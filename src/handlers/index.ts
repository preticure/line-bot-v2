import { Context } from 'hono'
import { LINE_CONFIG, SHEETS_CONFIG } from '../../config'
import { yesterdayRecordMessage } from '../../managers/learningRecord/yesterdayRecord'
import { sendMessage } from '../services/line'

export const scheduledHandler = async () => {
  try {
    const message = await yesterdayRecordMessage(SHEETS_CONFIG.range)
    await sendMessage(LINE_CONFIG.userId, message)
  } catch (e) {
    console.error('Error in scheduledHandler:', e)
  }
}

export const handleWebhook = async (c: Context) => {
  const body: any = await c.req.json()

  if (body.events) {
    for (const event of body.events) {
      console.log('Received event:', event)

      if (event.type === 'message' && event.message.type === 'text') {
        const messageText = event.message.text

        if (messageText.includes('昨日の記録')) {
          await scheduledHandler()
        }
      }
    }
  }
  return c.text('OK')
}

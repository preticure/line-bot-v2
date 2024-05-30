import { Client, WebhookEvent } from '@line/bot-sdk'
import axios from 'axios'
import { Context } from 'hono'
import { LINE_CONFIG, SHEETS_CONFIG } from './config'

const lineClient = new Client({
  channelAccessToken: LINE_CONFIG.channelAccessToken,
})

interface GoogleSheetsResponse {
  values: string[][]
}

export const scheduledHandler = async () => {
  try {
    const spreadsheetId = SHEETS_CONFIG.spreadsheetId
    const range = 'Sheet1!A2:C'
    const apiKey = SHEETS_CONFIG.apiKey
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`

    const response = await axios.get(url)

    const rows = response.data.values

    if (rows && rows.length) {
      const jstOffset = 9 * 60 * 60 * 1000
      const utcDate = new Date()
      const jstDate = new Date(utcDate.getTime() + jstOffset)

      console.log('jstDate', jstDate)

      jstDate.setDate(jstDate.getDate() - 1)
      const yesterdayStr = `${jstDate.getFullYear()}/${
        jstDate.getMonth() + 1
      }/${jstDate.getDate()}`
      console.log('yesterdayStr', yesterdayStr)

      const filteredRows = rows.filter(
        (row: string[]) => row[0] === yesterdayStr,
      )
      let message = '学習記録:\n'
      filteredRows.forEach((row: string[]) => {
        const minutes = parseInt(row[2], 10)
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        const timeString = `${hours}時間${remainingMinutes}分`
        message += `日付: ${row[0]}\n内容: ${row[1]}\n時間: ${timeString}\n`
      })

      if (filteredRows.length === 0) {
        message = '学習記録はありません。'
      }

      console.log('Message to be sent:', message)
      await lineClient.pushMessage(LINE_CONFIG.userId, {
        type: 'text',
        text: message,
      })
    }
  } catch (err) {
    console.error('Error in scheduledHandler:', err)
  }
}

export const handleWebhook = async (c: Context) => {
  const body: any = await c.req.json()

  if (body.events) {
    for (const event of body.events as WebhookEvent[]) {
      console.log('Received event:', event)

      if (event.type === 'message' && event.message.type === 'text') {
        const messageText = event.message.text

        if (messageText.includes('記録')) {
          await scheduledHandler()
        }

        await lineClient.replyMessage(event.replyToken, {
          type: 'text',
          text: 'Hello, this is your bot!',
        })
      }
    }
  }

  return c.text('OK')
}

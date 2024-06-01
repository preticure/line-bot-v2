import { Client } from '@line/bot-sdk'
import { LINE_CONFIG } from '../../config'

export const lineClient = new Client({
  channelAccessToken: LINE_CONFIG.channelAccessToken,
  channelSecret: LINE_CONFIG.channelSecret,
})

export const sendMessage = async (userId: string, message: string) => {
  await lineClient.pushMessage(userId, {
    type: 'text',
    text: message,
  })
}

import axios from 'axios'
import { SHEETS_CONFIG } from '../../config'

export const getGoogleSheetData = async (range: string) => {
  const spreadsheetId = SHEETS_CONFIG.spreadsheetId
  const apiKey = SHEETS_CONFIG.apiKey
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`

  const res = await axios.get(url)
  return res.data.values
}

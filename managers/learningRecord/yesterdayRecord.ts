import { getGoogleSheetData } from '../../src/utils/googleSheet'
import { getYesterdayDateString } from '../../src/utils/date'

export const yesterdayRecordMessage = async (
  range: string,
): Promise<string> => {
  const rows = await getGoogleSheetData(range)

  if (rows.length) {
    const yesterdayStr = getYesterdayDateString()

    const filteredRows = rows.filter((row: string[]) => row[0] === yesterdayStr)
    let message = ''

    if (filteredRows.length === 0) {
      message = '学習記録の取得に失敗した'
    } else {
      let recordsFound = false

      filteredRows.forEach((row: string[]) => {
        if (row[2] !== '') {
          const minutes = parseInt(row[2], 10)
          recordsFound = true

          const hours = Math.floor(minutes / 60)
          const remainingMinutes = minutes % 60
          const timeString = `${hours}時間${remainingMinutes}分`
          message += `${row[0]}の学習記録✏️\n\nやったこと：\n${row[1]}\n\n時間：${timeString}\n`
        }
      })

      if (!recordsFound) {
        message = '昨日の学習記録が入力されていません。'
      }
    }
    return message
  } else {
    return 'データが見つかりませんでした。'
  }
}

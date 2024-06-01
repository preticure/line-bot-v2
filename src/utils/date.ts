export const getYesterdayDateString = () => {
  const jstOffset = 9 * 60 * 60 * 1000
  const utcDate = new Date()
  const jstDate = new Date(utcDate.getTime() + jstOffset)

  jstDate.setDate(jstDate.getDate() - 1)
  return `${jstDate.getFullYear()}/${
    jstDate.getMinutes() + 1
  }/${jstDate.getDate()}`
}

export const calendarMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export function isoMonth(year: number, month: number) {
  return `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}`
}
export function validCalendarValue(value: string, type = 'date') {
  if (!(type === 'month' ? /^\d{4}-\d{2}$/ : /^\d{4}-\d{2}-\d{2}$/).test(value)) return false
  const [year = 0, month = 0, day = 1] = value.split('-').map(Number)
  if (year < 1 || month < 1 || month > 12 || day < 1) return false
  const date = new Date(`${isoMonth(year, month - 1)}-01T00:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() + 1, 0)
  return day <= date.getUTCDate()
}
export function calendarError(value: string, type: string, min?: string, max?: string) {
  if (!value) return ''
  if (!validCalendarValue(value, type)) return type === 'month' ? 'Enter a valid month as YYYY-MM.' : 'Enter a valid date as YYYY-MM-DD.'
  if (min && value < min) return `Choose ${min} or later.`
  if (max && value > max) return `Choose ${max} or earlier.`
  return ''
}
export function calendarCells(year: number, month: number): (string | null)[] {
  if (!Number.isInteger(year) || year < 1 || year > 9999 || !Number.isInteger(month) || month < 0 || month > 11) return []
  const first = new Date(`${isoMonth(year, month)}-01T00:00:00Z`)
  const last = new Date(first)
  last.setUTCMonth(month + 1, 0)
  return [...Array(first.getUTCDay()).fill(null), ...Array.from({ length: last.getUTCDate() }, (_, i) => `${isoMonth(year, month)}-${String(i + 1).padStart(2, '0')}`)]
}
export function nepalCalendarToday() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  return ['year', 'month', 'day'].map(type => parts.find(p => p.type === type)?.value).join('-')
}

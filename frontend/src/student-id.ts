/** Admission identity: YY + two-digit grade + section A-I (1-9). Never used for transfers. */
export function studentIdPrefix(date: string, grade: string, section: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return ''
  const parsed = new Date(date + 'T00:00:00Z')
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return ''
  if (!/^\d{1,2}$/.test(grade) || Number(grade) < 1 || Number(grade) > 12) return ''
  const label = section.trim().toUpperCase()
  if (!/^[A-I]$/.test(label)) return ''
  return date.slice(2, 4) + grade.padStart(2, '0') + String(label.charCodeAt(0) - 64)
}
export function schoolStudentId(prefix: string, number: string): string {
  if (!/^\d{5}$/.test(prefix) || !/^\d{1,3}$/.test(number) || Number(number) < 1) return ''
  return prefix + number.padStart(3, '0')
}

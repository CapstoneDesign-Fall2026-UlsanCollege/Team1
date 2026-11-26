import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const js = ts.transpileModule(readFileSync(new URL('../src/english-calendar.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
const { calendarCells, validCalendarValue, calendarError, isoMonth } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))

test('Gregorian dates reject impossible dates and accept leap days including century rules', () => {
  for (const date of ['2026-02-29', '1900-02-29', '2026-04-31', '2026-00-01', '0000-01-01', '2026-11-00', '2026-1-01']) assert.equal(validCalendarValue(date), false, date)
  for (const date of ['2024-02-29', '2000-02-29', '2026-11-26', '0099-01-01']) assert.equal(validCalendarValue(date), true, date)
})
test('calendar grids align Sunday and handle month lengths and temporarily invalid year input', () => {
  assert.deepEqual(calendarCells(2026, 10).slice(0, 3), ['2026-11-01', '2026-11-02', '2026-11-03'])
  assert.equal(calendarCells(2024, 1).filter(Boolean).length, 29)
  assert.equal(calendarCells(2026, 1).filter(Boolean).length, 28)
  assert.equal(calendarCells(2026, 3).slice(-1)[0], '2026-04-30')
  assert.deepEqual(calendarCells(NaN, 0), [])
  assert.deepEqual(calendarCells(0, 0), [])
})
test('date limits are inclusive and month limits work across year boundaries', () => {
  assert.equal(calendarError('2026-11-26', 'date', '2026-11-26', '2026-11-27'), '')
  assert.match(calendarError('2026-11-25', 'date', '2026-11-26'), /later/)
  assert.match(calendarError('2026-11-28', 'date', undefined, '2026-11-27'), /earlier/)
  assert.equal(calendarError('2027-01', 'month', '2026-12', '2027-01'), '')
  assert.match(calendarError('2027-02', 'month', '2026-12', '2027-01'), /earlier/)
  assert.equal(validCalendarValue('2026-13', 'month'), false)
  assert.equal(calendarError('', 'date'), '')
  assert.equal(isoMonth(99, 0), '0099-01')
})

export const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export type JobSchedule = { days: number[] | null; start: number | null; end: number | null };
export type ScheduleFilter = { days: number[]; start: string; end: string; includeUnknown: boolean };
const koreanDays = ['월', '화', '수', '목', '금', '토', '일'];
export function parseJobSchedule(text: string): JobSchedule {
  const result: JobSchedule = { days: null, start: null, end: null };
  // A provider prefix "평일 :" is not evidence that weekends are free.
  const range = text.match(/([월화수목금토일])(?:요일)?\s*[~～–-]\s*([월화수목금토일])(?:요일)?/);
  if (range) {
    const first = koreanDays.indexOf(range[1]!); const last = koreanDays.indexOf(range[2]!);
    if (first <= last) result.days = Array.from({ length: last - first + 1 }, (_, index) => first + index);
  } else if (/평일/.test(text) && /주\s*5일/.test(text) && !/토요일|일요일|주말/.test(text)) result.days = [0, 1, 2, 3, 4];
  else if (/주말/.test(text) && !/평일|월요일|주\s*[3-7]일/.test(text)) result.days = [5, 6];
  if (result.days && ((/토요일/.test(text) && !result.days.includes(5)) || (/일요일/.test(text) && !result.days.includes(6)) || (/주\s*6일/.test(text) && result.days.length !== 6))) result.days = null;
  // Shift-based or negotiable schedules cannot be inferred from one advertised range.
  if (/교대|협의|탄력|스케줄|격일|로테이션/.test(text)) return { days: null, start: null, end: null };
  const times = [...text.matchAll(/(?:\(?(오전|오후)\)?\s*)?(\d{1,2})\s*[:시]\s*(\d{1,2})\s*(?:분)?/g)];
  if (times.length !== 2 || (!!times[0]![1] !== !!times[1]![1])) return result;
  const values = times.map(match => {
    let hour = Number(match[2]); const minute = Number(match[3]);
    if (minute > 59 || hour > 23 || (match[1] && (hour < 1 || hour > 12))) return null;
    if (match[1]) hour = hour % 12 + (match[1] === '오후' ? 12 : 0);
    return hour * 60 + minute;
  });
  if (values[0] !== null && values[1] !== null && values[0] !== values[1]) { result.start = values[0]!; result.end = values[1]!; }
  return result;
}
export function timeMinutes(value: string) { const [hour, minute] = value.split(':').map(Number); return hour! * 60 + minute!; }
export function matchesSchedule(schedule: JobSchedule, filter: ScheduleFilter) {
  if (filter.days.length) {
    if (!schedule.days) { if (!filter.includeUnknown) return false; }
    else if (!schedule.days.every(day => filter.days.includes(day))) return false;
    else if (schedule.start !== null && schedule.end !== null && schedule.end < schedule.start && !schedule.days.every(day => filter.days.includes((day + 1) % 7))) return false;
  }
  if (filter.start && filter.end) {
    if (schedule.start === null || schedule.end === null) return filter.includeUnknown;
    const start = timeMinutes(filter.start), end = timeMinutes(filter.end);
    const available = (end - start + 1440) % 1440;
    const offset = (schedule.start - start + 1440) % 1440;
    const duration = (schedule.end - schedule.start + 1440) % 1440;
    if (offset + duration > available) return false;
  }
  return true;
}
export function scheduleLabel(schedule: JobSchedule) {
  const days = schedule.days ? schedule.days.map(day => weekdays[day]!.slice(0, 3)).join(', ') : 'Days unknown';
  const format = (value: number) => String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0');
  return days + ' · ' + (schedule.start === null || schedule.end === null ? 'Hours unknown' : format(schedule.start) + '–' + format(schedule.end) + (schedule.end < schedule.start ? ' (overnight)' : ''));
}

export type ClassMeeting = { day_of_week: number; start_time: string; end_time: string; semester_id: number };
export function timetableStatus(schedule: JobSchedule, meetings: ClassMeeting[]): 'unknown' | 'conflict' | 'clear' {
  if (!schedule.days || schedule.start === null || schedule.end === null) return 'unknown';
  for (const day of schedule.days) {
    const segments = schedule.end > schedule.start ? [[day, schedule.start, schedule.end]] : [[day, schedule.start,1440],[(day+1)%7,0,schedule.end]];
    for (const [shiftDay,start,end] of segments) if (meetings.some(meeting => meeting.day_of_week-1===shiftDay && timeMinutes(meeting.start_time)<end! && timeMinutes(meeting.end_time)>start!)) return 'conflict';
  }
  return 'clear';
}

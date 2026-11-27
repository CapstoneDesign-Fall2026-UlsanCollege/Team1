export type AttendanceCounts = { present:number; absent:number; late:number; excused:number; unmarked:number; lateAbsences:number; adjustedAbsences:number }
export function attendanceSummary(t:AttendanceCounts){
  const counted=t.present+t.absent+t.late
  const marked=counted+t.excused,eligible=marked+t.unmarked
  return {counted,marked,eligible,rate:counted?Math.round(Math.max(0,counted-t.adjustedAbsences)/counted*1000)/10:null,coverage:eligible?Math.round(marked/eligible*100):null}
}
export function combinedAttendance(students:{totals:AttendanceCounts}[]):AttendanceCounts {
  return students.reduce((sum,s)=>Object.fromEntries(Object.keys(sum).map(key=>[key,sum[key as keyof AttendanceCounts]+s.totals[key as keyof AttendanceCounts]])) as AttendanceCounts,{present:0,absent:0,late:0,excused:0,unmarked:0,lateAbsences:0,adjustedAbsences:0})
}

export function attendanceRateMatches(t:AttendanceCounts,filter:string){
  const rate=attendanceSummary(t).rate
  if(filter==='none')return rate===null
  if(filter==='below90')return rate!==null&&rate<90
  if(filter==='below75')return rate!==null&&rate<75
  return true
}

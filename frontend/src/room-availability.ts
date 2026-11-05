type Planning = {
 meetings: {course_offering_id:number;day_of_week:number;start_time:string;end_time:string}[]
 subjects: {id:number;semester_id:number}[]
 terms: {id:number;start_date:string;end_date:string}[]
 links: {offering_id:number;class_id:number}[]
 subject_teachers: {offering_id:number;teacher_id:number}[]
}
type Booking = {teacher_id:number;is_cancelled:number;starts_on:string;ends_on:string;day_of_week:number;start_time:string;end_time:string}
export function teacherBusyReason(teacherId:number,classId:number,date:string,start:string,end:string,school:Planning,bookings:Booking[]):string {
 if(!date || !start || !end || start>=end)return 'Choose date and times'
 const day=new Date(date+'T00:00:00Z').getUTCDay()||7
 const overlaps=(a:string,b:string)=>a.slice(0,5)<end && b.slice(0,5)>start
 if(bookings.some(b=>!b.is_cancelled && b.teacher_id===teacherId && b.starts_on<=date && b.ends_on>=date && b.day_of_week===day && overlaps(b.start_time,b.end_time)))return 'Room booking'
 for(const assignment of school.subject_teachers.filter(a=>a.teacher_id===teacherId)){
  if(school.links.some(l=>l.offering_id===assignment.offering_id && l.class_id===classId))continue
  const subject=school.subjects.find(s=>s.id===assignment.offering_id)
  const term=school.terms.find(t=>t.id===subject?.semester_id)
  if(term && term.start_date<=date && term.end_date>=date && school.meetings.some(m=>m.course_offering_id===assignment.offering_id && m.day_of_week===day && overlaps(m.start_time,m.end_time)))return 'Teaching another class'
 }
 return ''
}

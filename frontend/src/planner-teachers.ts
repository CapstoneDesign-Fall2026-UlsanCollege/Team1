// Availability across every occurrence of a weekly lesson within its term.
export function plannerTeacherReason(teacherId:number,termId:number,slots:any[],state:any,excludeOffering=0):string {
 const term=state.terms.find((t:any)=>t.id===termId)
 if(!term||!slots.length)return 'Choose a day and time to check availability'
 const overlaps=(a:any,b:any)=>a.start_time.slice(0,5)<b.end_time.slice(0,5)&&a.end_time.slice(0,5)>b.start_time.slice(0,5)
 function occurs(start:string,end:string,day:number){if(start>end)return false;const first=new Date(start+'T00:00:00Z'),offset=(day%7-first.getUTCDay()+7)%7;first.setUTCDate(first.getUTCDate()+offset);return first.toISOString().slice(0,10)<=end}
 for(const slot of slots){
  for(const link of state.subject_teachers.filter((a:any)=>a.teacher_id===teacherId&&a.offering_id!==excludeOffering)){
   const subject=state.subjects.find((s:any)=>s.id===link.offering_id),other=state.terms.find((t:any)=>t.id===subject?.semester_id)
   if(!other)continue
   const start=term.start_date>other.start_date?term.start_date:other.start_date,end=term.end_date<other.end_date?term.end_date:other.end_date
   if(occurs(start,end,slot.day_of_week)&&state.meetings.some((m:any)=>m.course_offering_id===link.offering_id&&m.day_of_week===slot.day_of_week&&overlaps(m,slot)))return 'Unavailable — teaching another lesson'
  }
  for(const b of state.bookings??[]){if(b.is_cancelled||b.teacher_id!==teacherId||b.day_of_week!==slot.day_of_week||!overlaps(b,slot))continue
   const start=term.start_date>b.starts_on?term.start_date:b.starts_on,end=term.end_date<b.ends_on?term.end_date:b.ends_on
   if(occurs(start,end,slot.day_of_week))return 'Unavailable — special-room booking'
  }
 }
 return 'Available'
}
export function subjectTeacherIds(courseId:number,state:any):Set<number>{
 return new Set([...(state.teacher_subjects??[]).filter((s:any)=>s.course_id===courseId).map((s:any)=>s.teacher_id),...state.subject_teachers.filter((a:any)=>state.subjects.some((s:any)=>s.id===a.offering_id&&s.course_id===courseId)).map((a:any)=>a.teacher_id)])
}

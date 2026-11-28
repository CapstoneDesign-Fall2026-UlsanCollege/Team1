export type HomeworkFilterItem={id:number;course_name:string;due_on:string;progress_status?:string;title?:string;instructions?:string}
export function filterStudentHomework<T extends HomeworkFilterItem>(items:T[],subject:string,period:string,today:string){
 const tomorrow=new Date(today+'T00:00:00Z');tomorrow.setUTCDate(tomorrow.getUTCDate()+1)
 const nextWeek=new Date(today+'T00:00:00Z');nextWeek.setUTCDate(nextWeek.getUTCDate()+6)
 const tomorrowDate=Number.isFinite(tomorrow.getTime())?tomorrow.toISOString().slice(0,10):''
 const weekDate=Number.isFinite(nextWeek.getTime())?nextWeek.toISOString().slice(0,10):''
 return items.filter(h=>(!subject||h.course_name===subject)&&(period==='today'?h.due_on===today:period==='tomorrow'?h.due_on===tomorrowDate:period==='week'?h.due_on>=today&&h.due_on<=weekDate:true))
}
export function homeworkDateLabel(date:string,today:string){
 if(date===today)return 'Today'
 const tomorrow=new Date(today+'T00:00:00Z');tomorrow.setUTCDate(tomorrow.getUTCDate()+1)
 if(Number.isFinite(tomorrow.getTime())&&date===tomorrow.toISOString().slice(0,10))return 'Tomorrow'
 const d=new Date(date+'T00:00:00Z');return Number.isFinite(d.getTime())?new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).format(d):date
}

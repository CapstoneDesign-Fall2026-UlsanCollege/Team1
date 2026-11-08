import type {Meeting} from './schedules'
const names=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const time=(value:string)=>value.length===5?value+':00':value
// IDs and input ordering differ between weekdays; compare the actual routine.
export function groupWeeklyRoutine(meetings:Meeting[],school:boolean){
 const dayOrder=school?[7,1,2,3,4,5,...(meetings.some(m=>m.day_of_week===6)?[6]:[])]:[1,2,3,4,5,6,7]
 const signature=(m:Meeting)=>JSON.stringify([time(m.start_time),time(m.end_time),m.course_code,m.course_name,m.professor??'',m.location??'',school?'':m.section])
 const groups=new Map<string,{days:number[];meetings:Meeting[]}>()
 for(const day of dayOrder){
  const lessons=meetings.filter(m=>m.day_of_week===day).slice().sort((a,b)=>time(a.start_time).localeCompare(time(b.start_time))||signature(a).localeCompare(signature(b)))
  const key=JSON.stringify(lessons.map(signature)),existing=groups.get(key)
  if(existing)existing.days.push(day);else groups.set(key,{days:[day],meetings:lessons})
 }
 return [...groups.values()].map(g=>{
  const consecutive=g.days.every((d,i)=>i===0||dayOrder.indexOf(d)===dayOrder.indexOf(g.days[i-1]!)+1)
  const label=g.days.length>2&&consecutive?names[g.days[0]!-1]+'–'+names[g.days.at(-1)!-1]:g.days.map(d=>names[d-1]).join(', ')
  return {...g,label}
 })
}

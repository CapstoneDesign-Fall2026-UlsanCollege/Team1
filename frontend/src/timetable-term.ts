type Term={id:number;start_date?:string;end_date?:string}
type Lesson={semester_id:number}
export function chooseTimetableTerm(terms:Term[],lessons:Lesson[],selected:number,date:string,school:boolean,dateChanged=false){
 const active=(t:Term)=>Boolean(t.start_date&&t.end_date&&t.start_date<=date&&t.end_date>=date)
 const chosen=terms.find(t=>t.id===selected)
 // Explicit choices survive refresh/remount. A date change only replaces an out-of-range choice.
 if(chosen&&(!dateChanged||!school||active(chosen)))return chosen.id
 if(!school)return terms[0]?.id??0
 const current=terms.filter(active)
 return current.find(t=>lessons.some(m=>m.semester_id===t.id))?.id??current[0]?.id??0
}
const key=(login:string)=>'studenthub:timetable-term:'+encodeURIComponent(login)
export function rememberedTimetableTerm(storage:Pick<Storage,'getItem'>,login:string){
 try{const raw=storage.getItem(key(login)),value=raw?Number(raw):0;return Number.isSafeInteger(value)&&value>0?value:0}catch{return 0}
}
export function rememberTimetableTerm(storage:Pick<Storage,'setItem'>,login:string,id:number){
 if(!Number.isSafeInteger(id)||id<1)return
 try{storage.setItem(key(login),String(id))}catch{/* Timetable selection still works when browser storage is unavailable. */}
}

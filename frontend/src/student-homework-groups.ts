type Homework={id:number;due_on:string;progress_status?:string}
export function studentHomeworkGroups<T extends Homework>(items:T[],today:string){
 const past=(h:T)=>Boolean(today&&h.due_on<today)
 const history=(h:T)=>past(h)||h.progress_status==='reviewed'
 return {
  current:items.filter(h=>!history(h)).sort((a,b)=>a.due_on.localeCompare(b.due_on)||a.id-b.id),
  history:items.filter(history).sort((a,b)=>b.due_on.localeCompare(a.due_on)||b.id-a.id),
  overdue:items.filter(h=>past(h)&&(!h.progress_status||['pending','missing'].includes(h.progress_status))).length,
 }
}

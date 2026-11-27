export function homeworkMatches(h:{title:string;instructions?:string;due_on:string;is_active:any},today:string,query:string,filter:string){
 const match=(h.title+' '+(h.instructions??'')).toLowerCase().includes(query.trim().toLowerCase())
 return match&&(filter==='all'?true:filter==='archived'?!h.is_active:filter==='today'?Boolean(h.is_active)&&h.due_on===today:filter==='upcoming'?Boolean(h.is_active)&&h.due_on>today:filter==='past'?Boolean(h.is_active)&&h.due_on<today:true)
}

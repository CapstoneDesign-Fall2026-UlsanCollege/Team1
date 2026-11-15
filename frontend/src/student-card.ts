export type StudentCard = {full_name:string;login_id:string;school:string;checked_on:string;membership:{class_id:number;grade_label:string;class_name:string;academic_year:string}|null}
export const qrOptions={width:300,margin:4,errorCorrectionLevel:'M' as const,color:{dark:'#000000',light:'#ffffff'}}
export function studentCardUrl(token:string,origin:string,basePath:string){
 if(!/^[a-f0-9]{64}$/.test(token))throw new Error('Invalid student card reference.')
 const url=new URL(basePath,origin)
 if(url.origin!==new URL(origin).origin)throw new Error('Student cards must stay on this site.')
 url.search='';url.hash='student-card='+token;return url.href
}
export function cardClass(card:StudentCard){return card.membership?`Grade ${card.membership.grade_label} · Class ${card.membership.class_name}`:'Class not assigned'}

export function weekdayDate(date:string,day:number){
 const value=new Date(date+'T00:00:00Z');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(value.getTime())||value.toISOString().slice(0,10)!==date||!Number.isInteger(day)||day<0||day>6)throw Error('Choose a valid date and weekday.');
 value.setUTCDate(value.getUTCDate()+day-value.getUTCDay());return value.toISOString().slice(0,10);
}
export function recommendedPrice(name:string,items:{name:string;price:number}[]){return items.find(i=>i.name.trim().toLocaleLowerCase()===name.trim().toLocaleLowerCase())?.price}

import {Router} from 'express';
import type {Pool,RowDataPacket} from 'mysql2/promise';
import {ScheduleError} from './schedules.js';
import {campusDate,isMenuDate} from './canteen-menu.js';
export const canteenInfoSchema=`CREATE TABLE IF NOT EXISTS canteen_info (
 id TINYINT PRIMARY KEY, name VARCHAR(100) NOT NULL, location VARCHAR(250) NOT NULL,
 hours JSON NOT NULL, notice_date DATE NULL, notice VARCHAR(500) NOT NULL,
 closed_for_notice TINYINT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 0,
 version INT UNSIGNED NOT NULL DEFAULT 0,
 updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB`;
export type Hours={day:number;state:'unknown'|'open'|'closed';opens:string;closes:string};
export const emptyHours=():Hours[]=>Array.from({length:7},(_,i)=>({day:i+1,state:'unknown',opens:'',closes:''}));
export function validateInfo(input:any){
 if(!input || typeof input.name!=='string'||input.name.trim().length>100||typeof input.location!=='string'||input.location.trim().length>250||typeof input.notice!=='string'||input.notice.trim().length>500||typeof input.published!=='boolean'||typeof input.closed_for_notice!=='boolean'||!Number.isSafeInteger(input.version)||input.version<0)throw new ScheduleError(400,'Check canteen details and saved version.');
 if(input.published && (!input.name.trim()||!input.location.trim()))throw new ScheduleError(400,'Enter the canteen name and school location before publishing.');
 if(!Array.isArray(input.hours)||input.hours.length!==7)throw new ScheduleError(400,'Set a state for all seven weekdays.');
 const seen=new Set<number>();const hours:Hours[]=input.hours.map((h:any)=>{
  if(!h||!Number.isInteger(h.day)||h.day<1||h.day>7||seen.has(h.day)||!['unknown','open','closed'].includes(h.state))throw new ScheduleError(400,'Use each weekday once with known hours, closed or unknown.');
  seen.add(h.day);const time=(v:unknown)=>typeof v==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(v);
  if(h.state==='open'&&(!time(h.opens)||!time(h.closes)||h.opens>=h.closes))throw new ScheduleError(400,'Opening and closing times must be ordered on the same day.');
  return {day:h.day,state:h.state,opens:h.state==='open'?h.opens:'',closes:h.state==='open'?h.closes:''};
 });
 const notice=input.notice.trim(),notice_date=input.notice_date||null;
 if((notice && !isMenuDate(notice_date))||(!notice && notice_date)||(!notice && input.closed_for_notice))throw new ScheduleError(400,'A notice needs text and one valid applicable date.');
 return {name:input.name.trim(),location:input.location.trim(),hours,notice_date,notice,closed_for_notice:input.closed_for_notice,published:input.published,version:input.version};
}
const cols="id,name,location,hours,DATE_FORMAT(notice_date,'%Y-%m-%d') notice_date,notice,closed_for_notice,published,version,updated_at";
const unpack=(r?:RowDataPacket)=>r?{name:r.name as string,location:r.location as string,notice_date:r.notice_date as string|null,notice:r.notice as string,version:Number(r.version),updated_at:r.updated_at,hours:typeof r.hours==='string'?JSON.parse(r.hours):r.hours,closed_for_notice:Boolean(r.closed_for_notice),published:Boolean(r.published)}:null;
export function canteenInfoRouter(pool:Pool,today:()=>string=campusDate){
 const router=Router();
 router.get('/canteen/info',async(_req,res)=>{
  if(res.locals.user.role!=='canteen_head')throw new ScheduleError(403,'Canteen head only.');
  const [rows]=await pool.execute<RowDataPacket[]>(`SELECT ${cols} FROM canteen_info WHERE id=1`);res.json({info:unpack(rows[0]),today:today()});
 });
 router.put('/canteen/info',async(req,res)=>{
  if(res.locals.user.role!=='canteen_head')throw new ScheduleError(403,'Canteen head only.');
  const input=validateInfo(req.body),c=await pool.getConnection();
  try{await c.beginTransaction();await c.execute("INSERT IGNORE INTO canteen_info(id,name,location,hours,notice,version) VALUES(1,'','',?,'',0)",[JSON.stringify(emptyHours())]);
   const [rows]=await c.execute<RowDataPacket[]>('SELECT version FROM canteen_info WHERE id=1 FOR UPDATE');
   if(rows[0].version!==input.version)throw new ScheduleError(409,'Canteen details changed elsewhere. Reload saved details before saving.');
   await c.execute('UPDATE canteen_info SET name=?,location=?,hours=?,notice_date=?,notice=?,closed_for_notice=?,published=?,version=version+1 WHERE id=1',[input.name,input.location,JSON.stringify(input.hours),input.notice_date,input.notice,input.closed_for_notice?1:0,input.published?1:0]);await c.commit();res.json({message:input.published?'Canteen details published.':'Canteen draft saved.',version:input.version+1});
  }catch(e){await c.rollback();throw e}finally{c.release()}
 });
 router.get('/student/canteen/info',async(_req,res)=>{
  if(res.locals.user.role!=='student')throw new ScheduleError(403,'Students only.');
  const date=today();const [rows]=await pool.execute<RowDataPacket[]>(`SELECT ${cols} FROM canteen_info WHERE id=1 AND published=1`);
  const info=unpack(rows[0]);if(info && info.notice_date!==date){info.notice='';info.notice_date=null;info.closed_for_notice=false}
  res.json({today:date,info});
 });return router;
}

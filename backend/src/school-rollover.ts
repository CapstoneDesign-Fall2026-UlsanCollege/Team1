import {createHash} from 'node:crypto';
import {Router} from 'express';
import type {Pool,PoolConnection,RowDataPacket} from 'mysql2/promise';
import {schoolId} from './school-planning.js';
import {ScheduleError} from './schedules.js';
type Mutate=<T>(revision:unknown,run:(c:PoolConnection)=>Promise<T>)=>Promise<T>;
async function rows(db:Pick<Pool,'execute'>,sql:string,args:any[]=[]){return (await db.execute<RowDataPacket[]>(sql,args))[0]}
export function rolloverInput(input:any){
 const source=schoolId(input?.source_year_id),target=schoolId(input?.target_year_id);
 if(source===target)throw new ScheduleError(400,'Choose two different academic years.');
 if(!Array.isArray(input.mappings)||!input.mappings.length||input.mappings.length>200||new Set(input.mappings.map((m:any)=>m?.source_class_id)).size!==input.mappings.length)throw new ScheduleError(400,'Choose unique source classes and their destinations (maximum 200).');
 const mappings=input.mappings.map((m:any)=>({source_class_id:schoolId(m?.source_class_id),target_class_id:schoolId(m?.target_class_id)})).sort((a:any,b:any)=>a.source_class_id-b.source_class_id);
 return {source,target,mappings};
}
export async function rolloverPlan(db:Pick<Pool,'execute'>,input:any){
 const parsed=rolloverInput(input);
 const years=await rows(db,"SELECT id,name,DATE_FORMAT(start_date,'%Y-%m-%d') start_date,DATE_FORMAT(end_date,'%Y-%m-%d') end_date FROM school_years WHERE id IN (?,?)",[parsed.source,parsed.target]);
 const source=years.find(y=>y.id===parsed.source),target=years.find(y=>y.id===parsed.target);
 if(!source||!target)throw new ScheduleError(404,'Academic year not found.');
 if(target.start_date<=source.end_date)throw new ScheduleError(400,'The destination year must start after the source year ends.');
 const classes=await rows(db,'SELECT id,year_id,grade_label,name,is_active FROM school_classes WHERE year_id IN (?,?)',[parsed.source,parsed.target]);
 for(const m of parsed.mappings){
  if(!classes.some(c=>c.id===m.source_class_id&&c.year_id===source.id)||!classes.some(c=>c.id===m.target_class_id&&c.year_id===target.id&&c.is_active))throw new ScheduleError(400,'Map source classes to active classes in the destination year.');
 }
 const members=await rows(db,`SELECT m.id membership_id,m.student_user_id,m.class_id,DATE_FORMAT(m.starts_on,'%Y-%m-%d') starts_on,DATE_FORMAT(m.ends_on,'%Y-%m-%d') ends_on,u.login_id,p.full_name FROM school_memberships m JOIN users u ON u.id=m.student_user_id JOIN student_profiles p ON p.user_id=u.id WHERE m.year_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?) AND u.role='student' AND u.is_active=1 ORDER BY m.student_user_id,m.id`,[source.id,source.end_date,source.end_date]);
 const existing=await rows(db,"SELECT student_user_id,class_id,DATE_FORMAT(starts_on,'%Y-%m-%d') starts_on FROM school_memberships WHERE year_id=?",[target.id]);
 const students=members.filter(m=>parsed.mappings.some((mapping:any)=>mapping.source_class_id===m.class_id)).map(m=>{
  const mapping=parsed.mappings.find((x:any)=>x.source_class_id===m.class_id),records=existing.filter(e=>e.student_user_id===m.student_user_id);
  const duplicate=members.filter(other=>other.student_user_id===m.student_user_id).length>1;
  const status=duplicate?'conflict':records.length?(records.length===1&&records[0].class_id===mapping.target_class_id&&records[0].starts_on===target.start_date?'already_enrolled':'conflict'):'ready';
  return {...m,membership_id:Number(m.membership_id),student_user_id:Number(m.student_user_id),class_id:Number(m.class_id),target_class_id:mapping.target_class_id,status};
 });
 if(students.length>5000)throw new ScheduleError(400,'Preview at most 5,000 students at once. Map fewer classes.');
 const date=new Date(source.end_date+'T00:00:00Z');date.setUTCDate(date.getUTCDate()+1);
 const plan={source,target,mappings:parsed.mappings,students,close_on:date.toISOString().slice(0,10)};
 const digest=createHash('sha256').update(JSON.stringify(plan)).digest('hex');
 return {...plan,digest};
}
export function schoolRolloverRouter(pool:Pool,mutate:Mutate){
 const router=Router();
 router.post('/admin/school/rollover/preview',async(req,res)=>{
  if(!Number.isSafeInteger(req.body?.revision)||req.body.revision<0)throw new ScheduleError(400,'Reload school setup first.');
  const c=await pool.getConnection();try{await c.beginTransaction();const [lock]=await rows(c,'SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');if(lock.version!==req.body.revision)throw new ScheduleError(409,'School records changed. Reload setup and preview again.');const plan=await rolloverPlan(c,req.body);await c.commit();res.json(plan)}catch(e){await c.rollback();throw e}finally{c.release()}
 });
 router.post('/admin/school/rollover',async(req,res)=>{
  const input=req.body??{},ids=input.student_ids;
  if(!Array.isArray(ids)||!ids.length||ids.length>5000||new Set(ids).size!==ids.length||ids.some(id=>!Number.isSafeInteger(id)||id<1))throw new ScheduleError(400,'Select unique students from the preview.');
  if(input.confirmed!==true||typeof input.digest!=='string')throw new ScheduleError(400,'Review and confirm the rollover preview first.');
  await mutate(input.revision,async c=>{
   const plan=await rolloverPlan(c,input);
   if(plan.digest!==input.digest)throw new ScheduleError(409,'The preview changed. Preview again before continuing.');
   const selected=ids.map(id=>plan.students.find(s=>s.student_user_id===id));
   if(selected.some(s=>!s||s.status!=='ready'))throw new ScheduleError(409,'A selected student is already enrolled or has conflicting records. Preview again.');
   for(const s of selected){
    await c.execute('UPDATE school_memberships SET ends_on=? WHERE id=?',[plan.close_on,s!.membership_id]);
    await c.execute('INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(?,?,?,?)',[s!.student_user_id,plan.target.id,s!.target_class_id,plan.target.start_date]);
   }
  });res.json({count:ids.length,message:`Rollover saved for ${ids.length} student(s). Previous enrollment and school records retained.`});
 });
 return router;
}

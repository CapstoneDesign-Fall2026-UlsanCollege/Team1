import {AsyncLocalStorage} from 'node:async_hooks';
import {Router} from 'express';
import type {Pool,PoolConnection,RowDataPacket} from 'mysql2/promise';
import {ScheduleError} from './schedules.js';

type Actor={id:number;login_id:string;role:string};
const actorContext=new AsyncLocalStorage<Actor|null>();
export function withActivityActor(actor:Actor,next:()=>void){actorContext.run(['admin','canteen_head','teacher'].includes(actor.role)?actor:null,next)}
const actorSql='SET @sh_actor_id=?, @sh_actor_login=?, @sh_actor_role=?';
// Each checked-out connection carries only the authenticated request's actor.
// Never release a connection to the pool before clearing that context.
export function activityPool(raw:Pool):Pool{
 async function checkout(){const c=await raw.getConnection();const actor=actorContext.getStore();
  try{await c.query(actorSql,[actor?.id??null,actor?.login_id??null,actor?.role??null])}catch(e){c.destroy();throw e}
  let released=false;
  return new Proxy(c,{get(target,key){
   if(key==='release')return ()=>{if(released)return;released=true;void target.query(actorSql,[null,null,null]).then(()=>target.release()).catch(()=>target.destroy())};
   const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
  }}) as PoolConnection;
 }
 return new Proxy(raw,{get(target,key){
  if(key==='getConnection')return checkout;
  if(key==='query'||key==='execute')return async(...args:any[])=>{const c=await checkout();try{return await (c[key] as any)(...args)}finally{c.release()}};
  const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
 }}) as Pool;
}
export const activitySchema=`CREATE TABLE IF NOT EXISTS activity_logs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 actor_user_id INT UNSIGNED NOT NULL, actor_login VARCHAR(50) NOT NULL,
 actor_role VARCHAR(30) NOT NULL, action VARCHAR(10) NOT NULL,
 record_type VARCHAR(60) NOT NULL, record_key VARCHAR(190) NOT NULL,
 changed_fields JSON NOT NULL, before_values JSON NULL, after_values JSON NULL,
 occurred_at DATETIME(3) NOT NULL,
 KEY ix_activity_actor(actor_user_id,id), KEY ix_activity_record(record_type,id),
 KEY ix_activity_time(occurred_at,id), KEY ix_activity_action(action,id)
) ENGINE=InnoDB`;
type Area={keys:string[];fields:string[];hidden?:string[];label:string};
// Explicit allowlist. Secrets/profile contents never enter stored JSON.
export const activityAreas:Record<string,Area>={
 school_floors:{keys:['floor_number'],fields:['label'],label:'Building floors'},
 school_teacher_accounts:{keys:['user_id'],fields:['teacher_id'],label:'Teacher login links'},
 school_homework:{keys:['id'],fields:['class_id','offering_id','teacher_id','created_by','assigned_on','due_on','is_active','version'],hidden:['title','instructions'],label:'Class homework'},
 school_attendance_sheets:{keys:['class_id','attendance_date'],fields:['version','updated_by'],label:'Attendance sheets'},
 school_attendance:{keys:['class_id','attendance_date','student_user_id'],fields:['recorded_by'],hidden:['status'],label:'Student attendance'},
 users:{keys:['id'],fields:['role','is_active'],hidden:['login_id','password_hash'],label:'Accounts'},
 student_profiles:{keys:['user_id'],fields:[],hidden:['full_name','university','major','year_of_study','email','phone_number','address'],label:'Student profiles'},
 semesters:{keys:['id'],fields:['name','academic_year','start_date','end_date'],label:'Terms'},
 courses:{keys:['id'],fields:['course_code','course_name','credits','description'],label:'Subjects'},
 course_offerings:{keys:['id'],fields:['course_id','semester_id','major','professor','section'],label:'Class subject offerings'},
 student_semesters:{keys:['student_user_id','semester_id'],fields:[],label:'Legacy student terms'},
 enrollments:{keys:['student_user_id','course_offering_id'],fields:[],label:'Enrollments'},
 class_schedules:{keys:['id'],fields:['course_offering_id','day_of_week','start_time','end_time','location'],label:'Class lessons'},
 school_profile:{keys:['id'],fields:['name','level'],label:'School settings'},
 school_years:{keys:['id'],fields:['name','start_date','end_date'],label:'Academic years'},
 school_classes:{keys:['id'],fields:['year_id','grade_label','name','is_active'],label:'School classes'},
 school_terms:{keys:['semester_id'],fields:['year_id'],label:'School term links'},
 school_memberships:{keys:['id'],fields:['student_user_id','year_id','class_id','starts_on','ends_on'],label:'Student class membership'},
 school_class_offerings:{keys:['class_id','offering_id'],fields:[],label:'Class subject links'},
 school_teacher_subjects:{keys:['teacher_id'],fields:['course_id'],label:'Teacher teaching subjects'},
 school_teachers:{keys:['id'],fields:['staff_code','name','is_active'],label:'Teachers'},
 school_grade_subjects:{keys:['year_id','grade_label','course_id'],fields:[],label:'Grade subject library'},
 school_offering_teachers:{keys:['offering_id'],fields:['teacher_id'],label:'Subject teacher assignments'},
 school_rooms:{keys:['id'],fields:['room_number','floor_number','position_number','kind','name'],label:'Rooms'},
 school_class_rooms:{keys:['year_id','class_id'],fields:['room_id'],label:'Usual classroom assignments'},
 school_room_bookings:{keys:['id'],fields:['room_id','class_id','offering_id','teacher_id','day_of_week','start_time','end_time','starts_on','ends_on','repeats_weekly','is_cancelled'],label:'Special-room bookings'},
 password_reset_requests:{keys:['id'],fields:['user_id','status','reviewed_by'],label:'Password request reviews'},
 canteen_menus:{keys:['service_date'],fields:['published','currency','items'],label:'Canteen menus'},
 canteen_info:{keys:['id'],fields:['name','location','hours','notice_date','notice','closed_for_notice','published'],label:'Canteen details'},
};
const ident=(s:string)=>'`'+s+'`';
export async function ensureActivitySchema(pool:Pool){
 await pool.query(activitySchema);
 const [tables]=await pool.query<RowDataPacket[]>('SELECT TABLE_NAME name,ENGINE engine FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()');
 const [existing]=await pool.query<RowDataPacket[]>('SELECT TRIGGER_NAME name FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=DATABASE()');
 for(const [table,area] of Object.entries(activityAreas)){
  const record=tables.find(t=>t.name===table);if(!record)continue;
  if(record.engine!=='InnoDB')throw Error('Activity logging requires InnoDB for '+table);
  const [columns]=await pool.query<RowDataPacket[]>('SHOW COLUMNS FROM '+ident(table));const available=new Set(columns.map(c=>c.Field));
  if(area.keys.some(k=>!available.has(k)))throw Error('Activity key schema mismatch for '+table);
  const fields=[...new Set([...area.keys,...area.fields,...(area.hidden??[])])].filter(k=>available.has(k));
  const snapshot=(side:string)=>'JSON_OBJECT('+fields.map(k=>`'${k}',${area.hidden?.includes(k)?"'[hidden]'":side+'.'+ident(k)}`).join(',')+')';
  for(const [event,action] of [['INSERT','create'],['UPDATE','update'],['DELETE','delete']] as const){
   const name='sh_audit_v1_'+table+'_'+action;if(existing.some(t=>t.name===name))continue;
   const side=event==='DELETE'?'OLD':'NEW';const key="CONCAT_WS('/',"+area.keys.map(k=>side+'.'+ident(k)).join(',')+')' ;
   const changes=event==='UPDATE'?fields.map(k=>`IF NOT (OLD.${ident(k)} <=> NEW.${ident(k)}) THEN SET changes=JSON_ARRAY_APPEND(changes,'$','${k}'); END IF;`).join('\n'):`SET changes=JSON_ARRAY(${fields.map(k=>"'"+k+"'").join(',')});`;
   await pool.query(`CREATE TRIGGER ${ident(name)} AFTER ${event} ON ${ident(table)} FOR EACH ROW
   BEGIN
    DECLARE changes JSON;
    IF @sh_actor_id IS NOT NULL AND @sh_actor_id>0 AND @sh_actor_role IN ('admin','canteen_head','teacher') AND @sh_actor_login IS NOT NULL THEN
     SET changes=JSON_ARRAY();
     ${changes}
     IF JSON_LENGTH(changes)>0 THEN
      INSERT INTO activity_logs(actor_user_id,actor_login,actor_role,action,record_type,record_key,changed_fields,before_values,after_values,occurred_at)
      VALUES(@sh_actor_id,@sh_actor_login,@sh_actor_role,'${action}','${table}',${key},changes,${event==='INSERT'?'NULL':snapshot('OLD')},${event==='DELETE'?'NULL':snapshot('NEW')},UTC_TIMESTAMP(3));
     END IF;
    END IF;
   END`);
  }
 }
}
const validDate=(v:string)=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const utcBoundary=(date:string,plusDay=0)=>new Date(Date.parse(date+'T00:00:00+05:45')+plusDay*86400000).toISOString().slice(0,19).replace('T',' ');
export function activityRouter(pool:Pool){
 const router=Router();
 router.use('/admin/activity-logs',(_req,res,next)=>{if(res.locals.user.role!=='admin')throw new ScheduleError(403,'Administrators only.');next()});
 router.get('/admin/activity-logs',async(req,res)=>{
  const {actor,action,area,from,until,before}=req.query;
  for(const v of [actor,action,area,from,until,before])if(v!==undefined && (typeof v!=='string'||v.length>100))throw new ScheduleError(400,'Check activity filters.');
  if(actor!==undefined && !/^[1-9]\d{0,9}$/.test(String(actor)))throw new ScheduleError(400,'Choose a valid person.');
  if(action!==undefined && !['create','update','delete'].includes(String(action)))throw new ScheduleError(400,'Choose a valid action.');
  if(area!==undefined && !Object.hasOwn(activityAreas,String(area)))throw new ScheduleError(400,'Choose a valid record type.');
  if((from!==undefined&&!validDate(String(from)))||(until!==undefined&&!validDate(String(until)))||(from&&until&&String(from)>String(until)))throw new ScheduleError(400,'Choose valid ordered filter dates.');
  if(before!==undefined && !/^[1-9]\d{0,18}$/.test(String(before)))throw new ScheduleError(400,'Choose a valid page cursor.');
  const where:string[]=[],values:any[]=[];
  for(const [value,sql] of [[actor,'actor_user_id=?'],[action,'action=?'],[area,'record_type=?'],[before,'id<?']] as const)if(value!==undefined){where.push(sql);values.push(value)}
  if(from){where.push('occurred_at>=?');values.push(utcBoundary(String(from)))}if(until){where.push('occurred_at<?');values.push(utcBoundary(String(until),1))}
  const [rows]=await pool.execute<RowDataPacket[]>(`SELECT CAST(id AS CHAR) id,actor_user_id,actor_login,actor_role,action,record_type,record_key,changed_fields,before_values,after_values,DATE_FORMAT(occurred_at,'%Y-%m-%dT%H:%i:%sZ') occurred_at FROM activity_logs ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY activity_logs.id DESC LIMIT 21`,values);
  const [actors]=await pool.query<RowDataPacket[]>('SELECT a.actor_user_id id,a.actor_login login_id,a.actor_role role FROM activity_logs a JOIN (SELECT MAX(id) id FROM activity_logs GROUP BY actor_user_id) latest ON latest.id=a.id ORDER BY a.actor_login,a.actor_user_id');
  const parse=(v:any)=>typeof v==='string'?JSON.parse(v):v;
  const logs=rows.slice(0,20).map(row=>({...row,changed_fields:parse(row.changed_fields),before_values:parse(row.before_values),after_values:parse(row.after_values)}));
  res.json({logs,has_more:rows.length>20,next_before:rows.length>20?rows[19]!.id:null,actors,areas:Object.entries(activityAreas).map(([id,v])=>({id,label:v.label}))});
 });
 router.all('/admin/activity-logs',(_req,res)=>{res.status(405).json({message:'Activity Log is read-only.'})});
 return router;
}


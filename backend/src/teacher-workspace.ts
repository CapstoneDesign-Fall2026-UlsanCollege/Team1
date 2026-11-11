import {Router} from 'express';
import bcrypt from 'bcryptjs';
import type {Pool,PoolConnection,RowDataPacket,ResultSetHeader} from 'mysql2/promise';
import {ScheduleError} from './schedules.js';
import {schoolDate,schoolId,schoolText} from './school-planning.js';
import {isMenuDate} from './canteen-menu.js';

export const teacherSchema=[
 `CREATE TABLE IF NOT EXISTS school_teacher_accounts (
  user_id INT UNSIGNED PRIMARY KEY, teacher_id INT UNSIGNED NOT NULL UNIQUE,
  FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(teacher_id) REFERENCES school_teachers(id)
 ) ENGINE=InnoDB`,
 `CREATE TABLE IF NOT EXISTS school_homework (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, class_id INT UNSIGNED NOT NULL, offering_id INT UNSIGNED NOT NULL,
  teacher_id INT UNSIGNED NOT NULL, created_by INT UNSIGNED NOT NULL, assigned_on DATE NOT NULL, due_on DATE NOT NULL,
  title VARCHAR(150) NOT NULL, instructions TEXT NOT NULL, is_active TINYINT NOT NULL DEFAULT 1,
  version INT UNSIGNED NOT NULL DEFAULT 1, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(class_id) REFERENCES school_classes(id), FOREIGN KEY(offering_id) REFERENCES course_offerings(id),
  FOREIGN KEY(teacher_id) REFERENCES school_teachers(id), FOREIGN KEY(created_by) REFERENCES users(id)
 ) ENGINE=InnoDB`,
 `CREATE TABLE IF NOT EXISTS school_attendance_sheets (
  class_id INT UNSIGNED NOT NULL, attendance_date DATE NOT NULL, version INT UNSIGNED NOT NULL DEFAULT 0,
  updated_by INT UNSIGNED NOT NULL, PRIMARY KEY(class_id,attendance_date),
  FOREIGN KEY(class_id) REFERENCES school_classes(id), FOREIGN KEY(updated_by) REFERENCES users(id)
 ) ENGINE=InnoDB`,
 `CREATE TABLE IF NOT EXISTS school_attendance (
  class_id INT UNSIGNED NOT NULL, attendance_date DATE NOT NULL, student_user_id INT UNSIGNED NOT NULL,
  status ENUM('present','absent','late','excused') NOT NULL, recorded_by INT UNSIGNED NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(class_id,attendance_date,student_user_id),
  FOREIGN KEY(class_id,attendance_date) REFERENCES school_attendance_sheets(class_id,attendance_date),
  FOREIGN KEY(student_user_id) REFERENCES users(id), FOREIGN KEY(recorded_by) REFERENCES users(id)
 ) ENGINE=InnoDB`
];
export async function ensureTeacherSchema(pool:Pool){
 const [columns]=await pool.query<RowDataPacket[]>("SHOW COLUMNS FROM users LIKE 'role'");
 const type=columns[0]?.Type;
 if(type!=="enum('admin','student','canteen_head','teacher')"){
  if(!["enum('admin','student')","enum('admin','student','canteen_head')"].includes(type))throw Error('Unexpected users.role schema; review teacher migration.');
  await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin','student','canteen_head','teacher') NOT NULL DEFAULT 'student'");
 }
 for(const sql of teacherSchema)await pool.query(sql);
}
type DB=Pick<Pool,'execute'>;
async function rows(db:DB,sql:string,args:any[]=[]){return (await db.execute<RowDataPacket[]>(sql,args))[0]}
const dateOf=(v:unknown)=>{if(!isMenuDate(v))throw new ScheduleError(400,'Choose a valid date.');return v};
const classFields="cl.id class_id,cl.grade_label,cl.name class_name,cl.year_id";
const active="cl.is_active=1 AND s.start_date<=? AND s.end_date>=? AND y.start_date<=? AND y.end_date>=?";
async function teacher(db:DB,user:number){
 const [t]=await rows(db,'SELECT t.id,t.name,t.staff_code FROM school_teacher_accounts a JOIN school_teachers t ON t.id=a.teacher_id WHERE a.user_id=? AND t.is_active=1',[user]);
 if(!t)throw new ScheduleError(403,'Your active teacher record is not linked. Contact your administrator.');
 return t;
}
async function assignments(db:DB,id:number,date:string){
 return rows(db,`SELECT ${classFields},co.id offering_id,c.course_name,c.course_code,s.name term_name,
 DATE_FORMAT(s.end_date,'%Y-%m-%d') term_end FROM school_offering_teachers ot
 JOIN course_offerings co ON co.id=ot.offering_id JOIN courses c ON c.id=co.course_id
 JOIN school_class_offerings l ON l.offering_id=co.id JOIN school_classes cl ON cl.id=l.class_id
 JOIN school_terms st ON st.semester_id=co.semester_id AND st.year_id=cl.year_id
 JOIN school_years y ON y.id=cl.year_id JOIN semesters s ON s.id=co.semester_id
 WHERE ot.teacher_id=? AND ${active} ORDER BY cl.grade_label,cl.name,c.course_name`,[id,date,date,date,date]);
}
async function homerooms(db:DB,id:number,date:string){
 // Count unassigned first lessons too, so an incomplete/ambiguous timetable never grants attendance rights.
 return rows(db,`SELECT ${classFields} FROM school_classes cl JOIN school_years y ON y.id=cl.year_id
 JOIN school_class_offerings l ON l.class_id=cl.id JOIN course_offerings co ON co.id=l.offering_id
 JOIN school_terms st ON st.semester_id=co.semester_id AND st.year_id=cl.year_id JOIN semesters s ON s.id=co.semester_id
 JOIN class_schedules cs ON cs.course_offering_id=co.id
 LEFT JOIN school_offering_teachers ot ON ot.offering_id=co.id
 WHERE ${active} AND cs.day_of_week=7 AND cs.start_time='10:00:00'
 GROUP BY cl.id,cl.grade_label,cl.name,cl.year_id
 HAVING COUNT(DISTINCT ot.teacher_id)=1 AND MIN(ot.teacher_id)=? AND COUNT(ot.teacher_id)=COUNT(*)`,[date,date,date,date,id]);
}
async function roster(db:DB,classId:number,date:string){
 return rows(db,`SELECT DISTINCT u.id,u.login_id,p.full_name FROM school_memberships m JOIN users u ON u.id=m.student_user_id
 JOIN student_profiles p ON p.user_id=u.id WHERE m.class_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?) AND u.is_active=1 ORDER BY p.full_name,u.id`,[classId,date,date]);
}
async function transaction<T>(pool:Pool,run:(c:PoolConnection)=>Promise<T>){
 const c=await pool.getConnection();try{await c.beginTransaction();await c.execute('SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');const value=await run(c);await c.commit();return value}catch(e){await c.rollback();throw e}finally{c.release()}
}
export function teacherWorkspaceRouter(pool:Pool,invalidate:(id:number)=>void,today=()=>schoolDate()){
 const router=Router();
 router.get('/admin/teacher-accounts',async(_req,res)=>{
  res.json({teachers:await rows(pool,`SELECT t.id,t.name,t.staff_code,t.is_active,a.user_id,u.login_id,u.is_active account_active FROM school_teachers t LEFT JOIN school_teacher_accounts a ON a.teacher_id=t.id LEFT JOIN users u ON u.id=a.user_id ORDER BY t.name,t.id`)});
 });
 router.post('/admin/teacher-accounts',async(req,res)=>{
  const teacherId=schoolId(req.body?.teacher_id),login=schoolText(req.body?.login_id,50,'a login ID'),password=req.body?.password;
  if(!/^[A-Za-z0-9_-]+$/.test(login)||typeof password!=='string'||password.length<12||Buffer.byteLength(password)>72)throw new ScheduleError(400,'Use a valid login ID and a password of 12 characters or more, at most 72 UTF-8 bytes.');
  const hash=await bcrypt.hash(password,12);
  try{const id=await transaction(pool,async c=>{
   if(!(await rows(c,'SELECT id FROM school_teachers WHERE id=? AND is_active=1 FOR UPDATE',[teacherId])).length)throw new ScheduleError(400,'Choose an active teacher.');
   const [r]=await c.execute<ResultSetHeader>("INSERT INTO users(login_id,password_hash,role) VALUES(?,?,'teacher')",[login,hash]);
   await c.execute('INSERT INTO school_teacher_accounts(user_id,teacher_id) VALUES(?,?)',[r.insertId,teacherId]);return r.insertId;
  });res.status(201).json({id,message:'Teacher login created. Share credentials privately.'})}
  catch(e){if((e as {code?:string}).code==='ER_DUP_ENTRY')throw new ScheduleError(409,'This teacher already has a login, or that login ID is in use.');throw e}
 });
 router.put('/admin/teacher-accounts/:id/status',async(req,res)=>{
  const id=schoolId(Number(req.params.id)),enabled=req.body?.is_active;
  if(typeof enabled!=='boolean')throw new ScheduleError(400,'Choose an account status.');
  const [r]=await pool.execute<ResultSetHeader>("UPDATE users u JOIN school_teacher_accounts a ON a.user_id=u.id SET u.is_active=? WHERE u.id=? AND u.role='teacher'",[enabled?1:0,id]);
  if(!r.affectedRows)throw new ScheduleError(404,'Teacher account not found.');
  if(!enabled)invalidate(id);res.json({message:enabled?'Teacher account enabled. Sign in again.':'Teacher account disabled; sessions ended.'});
 });
 router.use('/teacher',async(_req,res,next)=>{res.locals.teacher=await teacher(pool,res.locals.user.id);next()});
 router.get('/teacher/dashboard',async(_req,res)=>{
  const date=today(),t=res.locals.teacher,assigned=await assignments(pool,t.id,date);
  const homes=await homerooms(pool,t.id,date);
  const lessons=await rows(pool,`SELECT cs.id,cs.course_offering_id,cs.day_of_week,TIME_FORMAT(cs.start_time,'%H:%i') start_time,TIME_FORMAT(cs.end_time,'%H:%i') end_time,cs.location FROM class_schedules cs JOIN school_offering_teachers ot ON ot.offering_id=cs.course_offering_id WHERE ot.teacher_id=? ORDER BY cs.day_of_week,cs.start_time`,[t.id]);
  res.json({teacher:t,today:date,school:(await rows(pool,'SELECT name FROM school_profile WHERE id=1'))[0]??null,assignments:assigned,homerooms:homes,lessons:lessons.filter(l=>assigned.some(a=>a.offering_id===l.course_offering_id))});
 });
 router.get('/teacher/classes/:id/students',async(req,res)=>{
  const id=schoolId(Number(req.params.id)),date=today(),t=res.locals.teacher;
  if(!(await assignments(pool,t.id,date)).some(a=>a.class_id===id)&&!(await homerooms(pool,t.id,date)).some(a=>a.class_id===id))throw new ScheduleError(403,'This class is not assigned to you.');
  res.json({students:await roster(pool,id,date),date});
 });
 router.get('/teacher/homework',async(_req,res)=>{
  res.json({homework:await rows(pool,`SELECT h.*,DATE_FORMAT(h.assigned_on,'%Y-%m-%d') assigned_on,DATE_FORMAT(h.due_on,'%Y-%m-%d') due_on FROM school_homework h WHERE h.teacher_id=? ORDER BY h.due_on DESC,h.id DESC LIMIT 100`,[res.locals.teacher.id])});
 });
 async function writeHomework(req:any,res:any,editing:boolean){
  const input=req.body??{},classId=schoolId(input.class_id),offeringId=schoolId(input.offering_id),due=dateOf(input.due_on),title=schoolText(input.title,150,'a homework title'),instructions=schoolText(input.instructions,2000,'homework instructions'),date=today();
  if(due<date)throw new ScheduleError(400,'Choose a due date today or later.');
  const result=await transaction(pool,async c=>{
   const t=await teacher(c,res.locals.user.id),assigned=await assignments(c,t.id,date);
   const a=assigned.find(a=>a.class_id===classId&&a.offering_id===offeringId);
   if(!a)throw new ScheduleError(403,'You can assign homework only to your current class subject.');
   if(due>a.term_end)throw new ScheduleError(400,'The due date must be within the subject term.');
   if(editing){
    const id=schoolId(Number(req.params.id)),version=schoolId(input.version);
    if(typeof input.is_active!=='boolean')throw new ScheduleError(400,'Choose a homework status.');
    const [r]=await c.execute<ResultSetHeader>('UPDATE school_homework SET title=?,instructions=?,due_on=?,is_active=?,version=version+1 WHERE id=? AND teacher_id=? AND class_id=? AND offering_id=? AND version=?',[title,instructions,due,input.is_active?1:0,id,t.id,classId,offeringId,version]);
    if(!r.affectedRows)throw new ScheduleError(409,'Homework changed or is not yours. Refresh before saving.');return id;
   }
   const [r]=await c.execute<ResultSetHeader>('INSERT INTO school_homework(class_id,offering_id,teacher_id,created_by,assigned_on,due_on,title,instructions) VALUES(?,?,?,?,?,?,?,?)',[classId,offeringId,t.id,res.locals.user.id,date,due,title,instructions]);return r.insertId;
  });res.status(editing?200:201).json({id:result,message:editing?'Homework updated.':'Homework assigned.'});
 }
 router.post('/teacher/homework',(req,res)=>writeHomework(req,res,false));
 router.put('/teacher/homework/:id',(req,res)=>writeHomework(req,res,true));
 router.get('/student/homework',async(_req,res)=>{
  const date=today();
  const homework=await rows(pool,`SELECT h.id,h.title,h.instructions,DATE_FORMAT(h.assigned_on,'%Y-%m-%d') assigned_on,DATE_FORMAT(h.due_on,'%Y-%m-%d') due_on,c.course_name,t.name teacher_name FROM school_homework h
  JOIN school_classes cl ON cl.id=h.class_id JOIN school_years y ON y.id=cl.year_id
  JOIN course_offerings co ON co.id=h.offering_id JOIN semesters s ON s.id=co.semester_id JOIN courses c ON c.id=co.course_id JOIN school_teachers t ON t.id=h.teacher_id
  WHERE h.is_active=1 AND h.assigned_on<=? AND ${active} AND EXISTS(SELECT 1 FROM school_memberships m WHERE m.class_id=h.class_id AND m.student_user_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?))
  ORDER BY h.due_on DESC,h.id DESC LIMIT 100`,[date,date,date,date,date,res.locals.user.id,date,date]);
  res.json({homework,today:date});
 });
 async function attendanceScope(db:DB,userId:number,classId:number,date:string){
  if(date>today())throw new ScheduleError(400,'Attendance cannot be recorded for a future date.');
  const t=await teacher(db,userId);
  if(!(await homerooms(db,t.id,date)).some(c=>c.class_id===classId))throw new ScheduleError(403,'Attendance is limited to your homeroom in an active term.');
  return roster(db,classId,date);
 }
 router.get('/teacher/classes/:id/attendance',async(req,res)=>{
  const id=schoolId(Number(req.params.id)),date=dateOf(req.query.date);
  const students=await attendanceScope(pool,res.locals.user.id,id,date);
  const [sheet]=await rows(pool,'SELECT version FROM school_attendance_sheets WHERE class_id=? AND attendance_date=?',[id,date]);
  const records=await rows(pool,'SELECT student_user_id,status FROM school_attendance WHERE class_id=? AND attendance_date=?',[id,date]);
  res.json({date,version:sheet?.version??0,students:students.map(s=>({...s,status:records.find(r=>r.student_user_id===s.id)?.status??''}))});
 });
 router.put('/teacher/classes/:id/attendance',async(req,res)=>{
  const id=schoolId(Number(req.params.id)),date=dateOf(req.body?.date),version=req.body?.version,records=req.body?.records;
  if(!Number.isSafeInteger(version)||version<0||!Array.isArray(records)||!records.length||records.length>500||new Set(records.map((r:any)=>r?.student_user_id)).size!==records.length)throw new ScheduleError(400,'Choose unique students and at least one attendance status (maximum 500).');
  for(const r of records)if(!r||!Number.isSafeInteger(r.student_user_id)||!['present','absent','late','excused'].includes(r.status))throw new ScheduleError(400,'Choose a valid student and attendance status.');
  await transaction(pool,async c=>{
   const students=await attendanceScope(c,res.locals.user.id,id,date);
   if(records.some((r:any)=>!students.some(s=>s.id===r.student_user_id)))throw new ScheduleError(400,'Attendance includes a student outside this class on this date.');
   await c.execute('INSERT IGNORE INTO school_attendance_sheets(class_id,attendance_date,updated_by) VALUES(?,?,?)',[id,date,res.locals.user.id]);
   const [sheet]=await rows(c,'SELECT version FROM school_attendance_sheets WHERE class_id=? AND attendance_date=? FOR UPDATE',[id,date]);
   if(sheet.version!==version)throw new ScheduleError(409,'Attendance changed elsewhere. Reload before saving.');
   for(const r of records)await c.execute('INSERT INTO school_attendance(class_id,attendance_date,student_user_id,status,recorded_by) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status),recorded_by=VALUES(recorded_by)',[id,date,r.student_user_id,r.status,res.locals.user.id]);
   await c.execute('UPDATE school_attendance_sheets SET version=version+1,updated_by=? WHERE class_id=? AND attendance_date=?',[res.locals.user.id,id,date]);
  });res.json({message:'Attendance saved.'});
 });
 return router;
}

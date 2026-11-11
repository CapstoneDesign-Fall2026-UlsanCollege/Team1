import {Router} from 'express';
import type {Pool,RowDataPacket,ResultSetHeader} from 'mysql2/promise';
import {ScheduleError} from './schedules.js';
import {schoolDate,schoolId} from './school-planning.js';
import {isMenuDate} from './canteen-menu.js';

export function structuredStudentLogin(date:string,grade:string,section:string,number:string){
 if(!isMenuDate(date)||!/^\d{1,2}$/.test(grade)||Number(grade)<1||Number(grade)>12||!/^[A-I]$/i.test(section.trim())||!/^\d{1,3}$/.test(number)||Number(number)<1)throw new ScheduleError(400,'Choose a valid admission date, grade 1–12, section A–I and student number 001–999.');
 return date.slice(2,4)+grade.padStart(2,'0')+String(section.trim().toUpperCase().charCodeAt(0)-64)+number.padStart(3,'0');
}
export function studentIdentitiesRouter(pool:Pool,invalidate:(id:number)=>void,today=schoolDate){
 const router=Router(),path='/admin/school/students/:id/login-id';
 router.use('/admin/school/students',(_req,res,next)=>{if(res.locals.user.role!=='admin')throw new ScheduleError(403,'Administrators only.');next()});
 router.get(path,async(req,res)=>{
  const id=schoolId(Number(req.params.id));
  const [users]=await pool.execute<RowDataPacket[]>("SELECT u.id,u.login_id FROM users u JOIN student_profiles p ON p.user_id=u.id WHERE u.id=? AND u.role='student'",[id]);
  if(!users.length)throw new ScheduleError(404,'Student account not found.');
  const [memberships]=await pool.execute<RowDataPacket[]>(`SELECT m.id,cl.grade_label,cl.name class_name,y.name year_name,DATE_FORMAT(m.starts_on,'%Y-%m-%d') starts_on FROM school_memberships m JOIN school_classes cl ON cl.id=m.class_id JOIN school_years y ON y.id=m.year_id WHERE m.student_user_id=? ORDER BY m.starts_on,m.id`,[id]);
  res.json({student:users[0],memberships,today:today()});
 });
 router.put(path,async(req,res)=>{
  const id=schoolId(Number(req.params.id)),membership=schoolId(req.body?.membership_id),date=req.body?.admitted_on,number=req.body?.student_number,expected=req.body?.expected_login_id;
  if(!isMenuDate(date)||date>today()||typeof number!=='string'||typeof expected!=='string'||!expected||expected.length>50)throw new ScheduleError(400,'Confirm the admission date, student number and current login ID.');
  const c=await pool.getConnection();let login='';
  try{
   await c.beginTransaction();await c.execute('SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');
   const [users]=await c.execute<RowDataPacket[]>("SELECT u.id,u.login_id FROM users u JOIN student_profiles p ON p.user_id=u.id WHERE u.id=? AND u.role='student' FOR UPDATE",[id]);
   if(!users.length)throw new ScheduleError(404,'Student account not found.');
   if(users[0].login_id!==expected)throw new ScheduleError(409,'The login ID changed elsewhere. Reload this student before trying again.');
   const [classes]=await c.execute<RowDataPacket[]>('SELECT cl.grade_label,cl.name FROM school_memberships m JOIN school_classes cl ON cl.id=m.class_id WHERE m.id=? AND m.student_user_id=?',[membership,id]);
   if(!classes.length)throw new ScheduleError(400,'Choose this student’s recorded class membership.');
   login=structuredStudentLogin(date,classes[0].grade_label,classes[0].name,number);
   if(login===expected)throw new ScheduleError(400,'This is already the student’s login ID.');
   const [r]=await c.execute<ResultSetHeader>("UPDATE users SET login_id=? WHERE id=? AND role='student' AND login_id=?",[login,id,expected]);
   if(r.affectedRows!==1)throw new ScheduleError(409,'The student changed elsewhere. Reload before saving.');
   await c.commit();
  }catch(e){await c.rollback();if((e as {code?:string}).code==='ER_DUP_ENTRY')throw new ScheduleError(409,'This login ID is already in use. Choose a different student number.');throw e}finally{c.release()}
  invalidate(id);
  res.json({id,login_id:login,message:'Student login ID changed. The password and linked records are unchanged; sign in again using the new ID.'});
 });
 return router;
}

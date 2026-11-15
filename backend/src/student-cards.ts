import {randomBytes} from 'node:crypto';
import {Router} from 'express';
import type {Pool,RowDataPacket} from 'mysql2/promise';
import {schoolDate} from './school-planning.js';

export function studentCardsRouter(pool:Pool,today:()=>string=schoolDate){
 const router=Router();
 const rows=async(sql:string,args:any[]=[]) => (await pool.execute<RowDataPacket[]>(sql,args))[0];
 async function details(id:number){
  const date=today();
  const [student]=await rows("SELECT u.login_id,p.full_name,p.university school FROM users u JOIN student_profiles p ON p.user_id=u.id WHERE u.id=? AND u.role='student' AND u.is_active=1",[id]);
  if(!student)return null;
  const [membership]=await rows(`SELECT cl.id class_id,cl.grade_label,cl.name class_name,y.name academic_year
   FROM school_memberships m JOIN school_classes cl ON cl.id=m.class_id JOIN school_years y ON y.id=cl.year_id
   WHERE m.student_user_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?) AND cl.is_active=1 AND y.start_date<=? AND y.end_date>=?
   ORDER BY m.starts_on DESC,m.id DESC LIMIT 1`,[id,date,date,date,date]);
  return {...student,membership:membership??null,checked_on:date};
 }
 router.get('/student/id-card',async(_req,res)=>{
  res.set('Cache-Control','no-store');
  const id=res.locals.user.id,card=await details(id);
  if(!card){res.status(404).json({message:'Student profile not found.'});return;}
  await pool.execute('INSERT IGNORE INTO school_student_cards(student_user_id,token) VALUES(?,?)',[id,randomBytes(32).toString('hex')]);
  const [record]=await rows('SELECT token FROM school_student_cards WHERE student_user_id=?',[id]);
  res.json({card,token:record.token});
 });
 router.get('/staff/student-cards/:token',async(req,res)=>{
  res.set('Cache-Control','no-store');
  const user=res.locals.user;
  if(!['admin','teacher'].includes(user.role)){res.status(403).json({message:'Sign in as an administrator or an assigned teacher to view this student card.'});return;}
  const unavailable=()=>res.status(404).json({message:'This student card is unavailable or outside your assigned classes.'});
  if(!/^[a-f0-9]{64}$/.test(String(req.params.token))){unavailable();return;}
  const [record]=await rows('SELECT student_user_id FROM school_student_cards WHERE token=?',[req.params.token]);
  if(!record){unavailable();return;}
  const card=await details(record.student_user_id);
  if(!card){unavailable();return;}
  if(user.role==='teacher'){
   const date=today();
   const allowed=card.membership&&await rows(`SELECT t.id FROM school_teacher_accounts a JOIN school_teachers t ON t.id=a.teacher_id
    JOIN school_offering_teachers ot ON ot.teacher_id=t.id JOIN course_offerings co ON co.id=ot.offering_id
    JOIN school_class_offerings l ON l.offering_id=co.id JOIN school_classes cl ON cl.id=l.class_id
    JOIN school_terms st ON st.year_id=cl.year_id AND st.semester_id=co.semester_id JOIN semesters s ON s.id=st.semester_id
    WHERE a.user_id=? AND t.is_active=1 AND cl.id=? AND s.start_date<=? AND s.end_date>=? LIMIT 1`,[user.id,card.membership.class_id,date,date]);
   if(!allowed?.length){unavailable();return;}
  }
  res.json({card});
 });
 return router;
}

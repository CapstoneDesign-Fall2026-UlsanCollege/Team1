import { Router } from 'express';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { ScheduleError } from './schedules.js';
export function majorPlanningRouter(pool: Pool) {
  const router = Router();
  router.use('/admin', (_req,res,next) => {
    if(res.locals.user.role !== 'admin'){res.status(403).json({message:'Administrators only.'});return;} next();
  });
  router.get('/admin/majors', async (_req,res) => {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT TRIM(major) AS name FROM student_profiles WHERE major IS NOT NULL AND TRIM(major)<>''
      UNION SELECT major AS name FROM course_offerings WHERE major IS NOT NULL AND major<>'' ORDER BY name`);
    res.json({majors:rows.map(r=>r.name)});
  });
  router.post('/admin/course-assignments', async(req,res)=>{
    const {course_id,semester_id,professor,major}=req.body??{};
    if(!Number.isSafeInteger(course_id)||course_id<1||!Number.isSafeInteger(semester_id)||semester_id<1||typeof professor!=='string'||!professor.trim()||professor.trim().length>150||typeof major!=='string'||!major.trim()||major.trim().length>150){res.status(400).json({message:'Choose a course, semester, major, and professor (up to 150 characters).'});return;}
    try {
      const [result]=await pool.execute<ResultSetHeader>('INSERT INTO course_offerings(course_id,semester_id,major,professor,section) VALUES (?,?,?,?,?)',[course_id,semester_id,major.trim(),professor.trim(),'A']);
      res.status(201).json({id:result.insertId,message:'Course assigned to major.'});
    }catch(e){if((e as {code?:string}).code==='ER_DUP_ENTRY'){res.status(409).json({message:'This course is already assigned to this major and semester.'});return;}throw e;}
  });
  // Classify legacy assignments without changing their IDs or deleting schedules.
  router.put('/admin/course-assignments/:id/major',async(req,res)=>{
    const id=Number(req.params.id), major=req.body?.major;
    if(!Number.isSafeInteger(id)||id<1||typeof major!=='string'||!major.trim()||major.trim().length>150){res.status(400).json({message:'Choose a valid major.'});return;}
    const c=await pool.getConnection();
    try{
      await c.beginTransaction();
      const [rows]=await c.execute<RowDataPacket[]>('SELECT semester_id FROM course_offerings WHERE id=?',[id]);
      if(!rows[0])throw new ScheduleError(404,'Course assignment not found.');
      await c.execute('SELECT id FROM semesters WHERE id=? FOR UPDATE',[rows[0].semester_id]);
      const [clashes]=await c.execute<RowDataPacket[]>(`SELECT a.id FROM class_schedules a JOIN class_schedules b ON a.day_of_week=b.day_of_week AND a.start_time<b.end_time AND a.end_time>b.start_time JOIN course_offerings co ON co.id=b.course_offering_id WHERE a.course_offering_id=? AND b.course_offering_id<>? AND co.semester_id=? AND co.major=? LIMIT 1 FOR UPDATE`,[id,id,rows[0].semester_id,major.trim()]);
      if(clashes.length)throw new ScheduleError(409,'This course has a timetable conflict with the selected major. Adjust its meeting times first.');
      await c.execute('UPDATE course_offerings SET major=? WHERE id=?',[major.trim(),id]);
      await c.commit();res.json({major:major.trim(),message:'Major assigned; existing class times retained.'});
    }catch(e){await c.rollback();if((e as {code?:string}).code==='ER_DUP_ENTRY'){res.status(409).json({message:'That major already has this course and section in this semester.'});return;}throw e;}finally{c.release();}
  });
  router.delete('/admin/course-assignments',(_req,res)=>{res.status(400).json({message:'Remove a specific course card using its assignment ID.'});});
  router.post('/admin/course-offerings',(_req,res)=>{res.status(400).json({message:'Use Course Planning to choose a semester and major for a catalog course.'});});
  return router;
}

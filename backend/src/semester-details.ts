import { Router } from 'express';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
export function semesterDetailsRouter(pool: Pool) {
  const router = Router();
  router.use('/admin/semesters/:id', (_req,res,next) => {
    if(res.locals.user.role !== 'admin') { res.status(403).json({message:'Administrators only.'}); return; }
    next();
  });
  router.get('/admin/semesters/:id', async (req,res) => {
    const id=Number(req.params.id);
    if(!Number.isSafeInteger(id)||id<1){res.status(400).json({message:'Choose a valid semester.'});return;}
    const [terms]=await pool.execute<RowDataPacket[]>('SELECT id,name,academic_year,start_date,end_date FROM semesters WHERE id=?',[id]);
    if(!terms.length){res.status(404).json({message:'Semester not found.'});return;}
    const [students]=await pool.execute<RowDataPacket[]>(`SELECT u.id,u.login_id,p.full_name,p.major FROM student_semesters ss JOIN users u ON u.id=ss.student_user_id JOIN student_profiles p ON p.user_id=u.id WHERE ss.semester_id=? ORDER BY p.full_name,u.id`,[id]);
    const [offerings]=await pool.execute<RowDataPacket[]>(`SELECT co.id AS offering_id,co.major,co.section,co.professor,c.course_code,c.course_name,
      (SELECT COUNT(*) FROM class_schedules cs WHERE cs.course_offering_id=co.id) AS meeting_count
      FROM course_offerings co JOIN courses c ON c.id=co.course_id WHERE co.semester_id=? ORDER BY co.major,c.course_code,co.id`,[id]);
    res.json({semester:terms[0],students,offerings});
  });
  router.delete('/admin/semesters/:id',async(req,res)=>{
    const id=Number(req.params.id);
    if(!Number.isSafeInteger(id)||id<1){res.status(400).json({message:'Choose a valid semester.'});return;}
    // Foreign keys remain the final guard against linked records, including concurrent assignments.
    try {
      const [result]=await pool.execute<ResultSetHeader>('DELETE FROM semesters WHERE id=? AND NOT EXISTS (SELECT 1 FROM student_semesters WHERE semester_id=?) AND NOT EXISTS (SELECT 1 FROM course_offerings WHERE semester_id=?)',[id,id,id]);
      if(!result.affectedRows){
        const [existing]=await pool.execute<RowDataPacket[]>('SELECT id FROM semesters WHERE id=?',[id]);
        res.status(existing.length?409:404).json({message:existing.length?'This semester still has linked students or courses. Remove their links, then refresh.':'Semester not found.'});return;
      }
      res.json({message:'Empty semester deleted.'});
    }catch(error){
      if(['ER_ROW_IS_REFERENCED_2','ER_ROW_IS_REFERENCED'].includes((error as {code:string}).code)){
        res.status(409).json({message:'This semester still has linked records. Review its students and courses, remove their links, then refresh.'});return;
      }
      throw error;
    }
  });
  return router;
}

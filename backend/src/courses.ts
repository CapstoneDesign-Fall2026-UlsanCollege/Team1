import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
export type Course = { id:number; course_code:string; course_name:string; credits:number; offering_id:number; semester_id:number; major:string|null; professor:string|null; section:string };
export async function addOffering(pool:Pool, v:{course_code:string;course_name:string;credits:number;semester_id:number;professor:string;section:string}) { const c=await pool.getConnection(); try{await c.beginTransaction(); const [r]=await c.execute<ResultSetHeader>('INSERT INTO courses(course_code,course_name,credits) VALUES (?,?,?)',[v.course_code,v.course_name,v.credits]); const [o]=await c.execute<ResultSetHeader>('INSERT INTO course_offerings(course_id,semester_id,professor,section) VALUES (?,?,?,?)',[r.insertId,v.semester_id,v.professor||null,v.section||'A']); await c.commit(); return o.insertId}catch(e){await c.rollback();throw e}finally{c.release()} }
export async function coursesForStudent(pool:Pool,userId:number){const [r]=await pool.execute<RowDataPacket[]>('SELECT c.id,c.course_code,c.course_name,c.credits,co.id offering_id,co.semester_id,co.major,co.professor,co.section FROM student_semesters ss JOIN student_profiles sp ON sp.user_id=ss.student_user_id JOIN course_offerings co ON co.semester_id=ss.semester_id AND co.major=TRIM(sp.major) JOIN courses c ON c.id=co.course_id WHERE ss.student_user_id=? ORDER BY c.course_code',[userId]);return r as Course[]}
export async function courseCatalog(pool:Pool){const [r]=await pool.query<RowDataPacket[]>('SELECT id,course_code,course_name,credits FROM courses ORDER BY course_code');return r}
export async function assignCourse(pool:Pool,courseId:number,semesterId:number,professor:string){const [r]=await pool.execute<ResultSetHeader>('INSERT INTO course_offerings(course_id,semester_id,professor,section) VALUES (?,?,?,"A")',[courseId,semesterId,professor||null]);return r.insertId}
export async function removeCourse(pool:Pool,courseId:number,semesterId:number){await pool.execute('DELETE FROM course_offerings WHERE course_id=? AND semester_id=?',[courseId,semesterId])}
export async function enrollStudent(pool:Pool,studentId:number,offeringId:number){await pool.execute('INSERT INTO enrollments(student_user_id,course_offering_id) VALUES (?,?)',[studentId,offeringId])}
export async function courseAssignments(pool: Pool): Promise<Course[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.id, c.course_code, c.course_name, c.credits,
            co.id AS offering_id, co.semester_id, co.major, co.professor, co.section
     FROM course_offerings co JOIN courses c ON c.id = co.course_id
     ORDER BY co.semester_id, c.course_code, co.section`
  );
  return rows as Course[];
}
export async function removeOffering(pool: Pool, offeringId: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM course_offerings WHERE id = ?', [offeringId]
  );
  return result.affectedRows > 0;
}
export async function updateOfferingProfessor(pool: Pool, offeringId: number, professor: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE course_offerings SET professor = ? WHERE id = ?', [professor, offeringId]
  );
  return result.affectedRows > 0;
}

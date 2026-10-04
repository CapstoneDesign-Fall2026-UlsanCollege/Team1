import { Router } from 'express';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import type { StudentProfile } from './students.js';
import { ScheduleError } from './schedules.js';
export type StudentEdit = StudentProfile & { is_active: boolean; semester_ids?: number[] };
export type StudentRecord = StudentEdit & { id: number; login_id: string };
export interface StudentAdminStore {
  list(search: string): Promise<StudentRecord[]>;
  update(id: number, value: StudentEdit): Promise<boolean>;
}
export function validateStudentEdit(input: unknown): StudentEdit | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const v = input as Record<string, unknown>;
  if (typeof v.is_active !== 'boolean') return null;
  if (v.semester_ids !== undefined && (!Array.isArray(v.semester_ids) || v.semester_ids.length > 100 || v.semester_ids.some(id => !Number.isSafeInteger(id) || id < 1) || new Set(v.semester_ids).size !== v.semester_ids.length)) return null;
  const text: Record<string, string | null> = {};
  for (const [key, limit] of Object.entries({ full_name:150, university:150, major:150, email:254, phone_number:30, address:500 })) {
    const required = key === 'full_name' || key === 'university';
    const field = v[key];
    if (field === null && !required) { text[key] = null; continue; }
    if (typeof field !== 'string' || field.trim().length > limit || (required && !field.trim())) return null;
    text[key] = field.trim() || null;
  }
  if (text.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email)) return null;
  if (v.year_of_study !== null && (typeof v.year_of_study !== 'number' || !Number.isInteger(v.year_of_study) || v.year_of_study < 1 || v.year_of_study > 255)) return null;
  return { full_name:text.full_name!, university:text.university!, major:text.major!, email:text.email!, phone_number:text.phone_number!, address:text.address!, year_of_study:v.year_of_study as number|null, is_active:v.is_active, ...(v.semester_ids === undefined ? {} : { semester_ids: v.semester_ids as number[] }) };
}
export function mysqlStudentAdmin(pool: Pool): StudentAdminStore {
  return {
    async list(search) {
      const [rows] = await pool.execute<RowDataPacket[]>(`SELECT u.id,u.login_id,u.is_active,p.full_name,p.university,p.major,p.year_of_study,p.email,p.phone_number,p.address
        FROM users u JOIN student_profiles p ON p.user_id=u.id
        WHERE u.role='student' AND (LOCATE(?,u.login_id)>0 OR LOCATE(?,p.full_name)>0)
        ORDER BY p.full_name,u.id LIMIT 100`, [search,search]);
      if (!rows.length) return [];
      const [assignments] = await pool.execute<RowDataPacket[]>(
        `SELECT student_user_id,semester_id FROM student_semesters WHERE student_user_id IN (${rows.map(() => '?').join(',')})`, rows.map(r => r.id));
      return rows.map(r => ({ ...r, is_active:Boolean(r.is_active), semester_ids:assignments.filter(a => a.student_user_id === r.id).map(a => a.semester_id) })) as StudentRecord[];
    },
    async update(id,value) {
      const c=await pool.getConnection();
      try {
        await c.beginTransaction();
        const [rows]=await c.execute<RowDataPacket[]>("SELECT u.id FROM users u JOIN student_profiles p ON p.user_id=u.id WHERE u.id=? AND u.role='student' FOR UPDATE",[id]);
        if (!rows.length) { await c.rollback(); return false; }
        if (value.semester_ids !== undefined) {
          const ids = value.semester_ids;
          if (ids.length) {
            const [terms] = await c.execute<RowDataPacket[]>(`SELECT id FROM semesters WHERE id IN (${ids.map(() => '?').join(',')}) FOR SHARE`, ids);
            if (terms.length !== ids.length) throw new ScheduleError(400, 'A selected semester no longer exists. Refresh the student list.');
          }
          // Preserve retained assignments and their original assigned_at timestamps.
          await c.execute(`DELETE FROM student_semesters WHERE student_user_id=?${ids.length ? ` AND semester_id NOT IN (${ids.map(() => '?').join(',')})` : ''}`, [id,...ids]);
          for (const semesterId of ids) await c.execute('INSERT INTO student_semesters (student_user_id,semester_id) VALUES (?,?) ON DUPLICATE KEY UPDATE semester_id=VALUES(semester_id)', [id,semesterId]);
        }
        await c.execute('UPDATE student_profiles SET full_name=?,university=?,major=?,year_of_study=?,email=?,phone_number=?,address=? WHERE user_id=?', [value.full_name,value.university,value.major,value.year_of_study,value.email,value.phone_number,value.address,id]);
        await c.execute('UPDATE users SET is_active=? WHERE id=?',[value.is_active ? 1:0,id]);
        await c.commit(); return true;
      } catch(e) { await c.rollback(); throw e; } finally { c.release(); }
    }
  };
}
export function studentAdminRouter(store: StudentAdminStore) {
  const router=Router();
  router.use('/admin/students',(_req,res,next)=>{if(res.locals.user.role!=='admin'){res.status(403).json({message:'Administrators only.'});return;}next();});
  router.get('/admin/students',async(req,res)=>{
    const search=req.query.search ?? '';
    if(typeof search!=='string'||search.length>150){res.status(400).json({message:'Search by name or login ID (up to 150 characters).'});return;}
    res.json({students:await store.list(search.trim())});
  });
  router.put('/admin/students/:id',async(req,res)=>{
    const id=Number(req.params.id), value=validateStudentEdit(req.body);
    if(!Number.isSafeInteger(id)||id<1||!value){res.status(400).json({message:'Check the profile fields and selected semesters. Year must be 1–255; semester selections must be unique.'});return;}
    if(!await store.update(id,value)){res.status(404).json({message:'Student record not found. Refresh the list.'});return;}
    res.json({message:'Student updated.'});
  });
  return router;
}

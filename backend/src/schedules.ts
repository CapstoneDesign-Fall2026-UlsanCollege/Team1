import { Router } from 'express';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export type MeetingInput = { course_offering_id: number; day_of_week: number; start_time: string; end_time: string; location: string };
export type Meeting = MeetingInput & { id: number; semester_id: number; semester_name: string; academic_year: number; course_code: string; course_name: string; professor: string | null; section: string };
export class ScheduleError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function validateMeeting(value: unknown): MeetingInput {
  const v = value as Partial<MeetingInput> | null;
  if (!v || typeof v !== 'object' || Array.isArray(v) || !Number.isSafeInteger(v.course_offering_id) || v.course_offering_id! < 1 ||
    !Number.isInteger(v.day_of_week) || v.day_of_week! < 1 || v.day_of_week! > 7 ||
    typeof v.start_time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v.start_time) ||
    typeof v.end_time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v.end_time) || v.end_time <= v.start_time ||
    typeof v.location !== 'string' || !v.location.trim() || v.location.trim().length > 150) {
    throw new ScheduleError(400, 'Choose a course, weekday, valid start/end times, and a room (up to 150 characters). End time must be after start time.');
  }
  return { course_offering_id: v.course_offering_id!, day_of_week: v.day_of_week!, start_time: v.start_time, end_time: v.end_time, location: v.location.trim() };
}
export interface ScheduleStore {
  list(studentId?: number): Promise<Meeting[]>;
  save(value: MeetingInput, id?: number): Promise<number>;
  remove(id: number): Promise<boolean>;
}
export function mysqlSchedules(pool: Pool): ScheduleStore {
  return {
    async list(studentId) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT cs.*, co.semester_id, co.major, co.professor, co.section, c.course_code, c.course_name,
          s.name AS semester_name, s.academic_year
         FROM class_schedules cs JOIN course_offerings co ON co.id = cs.course_offering_id
         JOIN courses c ON c.id = co.course_id JOIN semesters s ON s.id = co.semester_id
         ${studentId === undefined ? '' : 'WHERE EXISTS (SELECT 1 FROM student_semesters ss JOIN student_profiles sp ON sp.user_id=ss.student_user_id WHERE ss.semester_id = co.semester_id AND co.major=TRIM(sp.major) AND ss.student_user_id = ?)'}
         ORDER BY s.start_date DESC, cs.day_of_week, cs.start_time, cs.id`, studentId === undefined ? [] : [studentId]);
      return rows as Meeting[];
    },
    async save(value, id) {
      const c = await pool.getConnection();
      try {
        await c.beginTransaction();
        const [offerings] = await c.execute<RowDataPacket[]>('SELECT semester_id, major FROM course_offerings WHERE id = ?', [value.course_offering_id]);
        if (!offerings[0]) throw new ScheduleError(404, 'Course offering not found. Refresh the course list.');
        // Serialize timetable writes and major changes within the semester.
        await c.execute('SELECT id FROM semesters WHERE id = ? FOR UPDATE', [offerings[0].semester_id]);
        if (id !== undefined) {
          const [existing] = await c.execute<RowDataPacket[]>('SELECT course_offering_id FROM class_schedules WHERE id = ? FOR UPDATE', [id]);
          if (!existing[0]) throw new ScheduleError(404, 'Class meeting no longer exists.');
          if (existing[0].course_offering_id !== value.course_offering_id) throw new ScheduleError(400, 'Keep the original course when editing. Create a new meeting to change courses.');
        }
        const [overlap] = await c.execute<RowDataPacket[]>(
          `SELECT cs.id FROM class_schedules cs JOIN course_offerings co ON co.id = cs.course_offering_id
           WHERE co.semester_id = ? AND co.major <=> ? AND cs.day_of_week = ? AND cs.start_time < ? AND cs.end_time > ?
           AND cs.id <> ? LIMIT 1 FOR UPDATE`,
          [offerings[0].semester_id, offerings[0].major, value.day_of_week, value.end_time, value.start_time, id ?? 0]);
        if (overlap.length) throw new ScheduleError(409, 'Another class for this major and semester overlaps that time. Choose a different time.');
        let savedId = id;
        if (id !== undefined) {
          await c.execute('UPDATE class_schedules SET day_of_week=?, start_time=?, end_time=?, location=? WHERE id=?', [value.day_of_week, value.start_time, value.end_time, value.location, id]);
        } else {
          const [result] = await c.execute<ResultSetHeader>('INSERT INTO class_schedules (course_offering_id,day_of_week,start_time,end_time,location) VALUES (?,?,?,?,?)', [value.course_offering_id, value.day_of_week, value.start_time, value.end_time, value.location]);
          savedId = result.insertId;
        }
        await c.commit();
        return savedId!;
      } catch (e) { await c.rollback(); throw e; }
      finally { c.release(); }
    },
    async remove(id) {
      const [result] = await pool.execute<ResultSetHeader>('DELETE FROM class_schedules WHERE id=?', [id]);
      return result.affectedRows > 0;
    },
  };
}
export function scheduleRouter(store: ScheduleStore) {
  const router = Router();
  router.use('/admin/schedules', (_req, res, next) => {
    if (res.locals.user.role !== 'admin') { res.status(403).json({ message: 'Administrators only.' }); return; }
    next();
  });
  router.get('/admin/schedules', async (_req, res) => { res.json({ schedules: await store.list() }); });
  router.get('/student/schedule', async (_req, res) => {
    if (res.locals.user.role !== 'student') { res.status(403).json({ message: 'Students only.' }); return; }
    res.json({ schedules: await store.list(res.locals.user.id) });
  });
  router.post('/admin/schedules', async (req, res) => { res.status(201).json({ id: await store.save(validateMeeting(req.body)), message: 'Class meeting added.' }); });
  router.put('/admin/schedules/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) throw new ScheduleError(400, 'Invalid class meeting.');
    await store.save(validateMeeting(req.body), id);
    res.json({ message: 'Class meeting updated.' });
  });
  router.delete('/admin/schedules/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) throw new ScheduleError(400, 'Invalid class meeting.');
    if (!await store.remove(id)) throw new ScheduleError(404, 'Class meeting no longer exists.');
    res.json({ message: 'Class meeting removed.' });
  });
  return router;
}

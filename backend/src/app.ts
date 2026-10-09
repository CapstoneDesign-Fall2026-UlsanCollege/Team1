import express from 'express';
import { jobsRouter, type JobService } from './jobs.js';
import { resetRouter, type ResetStore } from './password-resets.js';
import { resolve } from 'node:path';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { validateStudent, type NewStudent, type StudentProfile } from './students.js';
import type { Semester } from './semesters.js';
import type { Course } from './courses.js';
import { scheduleRouter, ScheduleError, type ScheduleStore } from './schedules.js';
import { studentAdminRouter, type StudentAdminStore } from './student-admin.js';

export type Account = { id: number; login_id: string; password_hash: string; role: 'admin' | 'student'; is_active: number };
export type Accounts = {
  jobs?: JobService;
  resets?: ResetStore;
  majorPlanning?: express.Router;
  studentAdmin?: StudentAdminStore;
  schedules?: ScheduleStore;
  courseAssignments?: () => Promise<Course[]>;
  removeOffering?: (id: number) => Promise<boolean>;
  updateProfessor?: (id: number, professor: string) => Promise<boolean>;
  byLogin(login: string): Promise<Account | undefined>;
  byId(id: number): Promise<Account | undefined>;
};
export function createApp(accounts: Accounts, addStudent?: (student: NewStudent) => Promise<number>, readProfile?: (id: number) => Promise<StudentProfile | undefined>, updateContact?: (id: number, input: { email: string | null; phone_number: string | null; address: string | null }) => Promise<void>, readSemesters?: (studentId?: number) => Promise<Semester[]>, addSemester?: (value: Omit<Semester, 'id'>) => Promise<number>, assignSemester?: (studentId: number, semesterId: number) => Promise<void>, addOffering?: (value: {course_code:string;course_name:string;credits:number;semester_id:number;professor:string;section:string}) => Promise<number>, readCourses?: (studentId:number)=>Promise<Course[]>, enroll?: (studentId:number, offeringId:number)=>Promise<void>, catalog?: ()=>Promise<unknown[]>, assignCourse?: (courseId:number,semesterId:number,professor:string)=>Promise<number>, removeCourse?: (courseId:number,semesterId:number)=>Promise<void>) {
  const app = express();
  app.disable('x-powered-by');
  const serveFrontend = process.env.SERVE_FRONTEND === 'true';
  if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
  const frontendOrigin = serveFrontend ? undefined : process.env.FRONTEND_ORIGIN;
  app.use('/api', (req, res, next) => {
    const origin = req.get('Origin');
    if (origin && origin !== frontendOrigin && origin !== `${req.protocol}://${req.get('host')}`) {
      res.status(403).json({ message: 'Website origin is not allowed.' }); return;
    }
    next();
  });
  if (frontendOrigin) app.use('/api', cors({ origin: frontendOrigin, credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'X-StudentHub'] }));
  app.use(express.json({ limit: '4kb' }));
  const sessions = new Map<string, { id: number; expires: number }>();
  const attempts = new Map<string, { count: number; expires: number }>();
  const dummyHash = bcrypt.hashSync(randomBytes(24).toString('hex'), 12);
  const cookie = (token: string, maxAge: number) =>
    'studenthub_session=' + token + '; HttpOnly; SameSite=' + (frontendOrigin ? 'None' : 'Strict') + '; Path=/api; Max-Age=' + maxAge +
    (frontendOrigin || process.env.NODE_ENV === 'production' ? '; Secure' : '');
  const publicUser = (u: Account) => ({ id: u.id, login_id: u.login_id, role: u.role });
  // Mutations require a custom header, with browser origins checked above.
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET' && req.get('X-StudentHub') !== '1') {
      res.status(403).json({ message: 'Request not allowed.' }); return;
    }
    next();
  });
  const tokenFrom = (req: express.Request) =>
    req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('studenthub_session='))?.slice(19);
  const invalidate = (id: number) => { for (const [token, session] of sessions) if (session.id === id) sessions.delete(token); };
  if (accounts.resets) app.use('/api', resetRouter(accounts.resets, invalidate, true));
  app.post('/api/auth/login', async (req, res) => {
    const { login_id, password } = req.body ?? {};
    if (typeof login_id !== 'string' || !login_id.trim() || login_id.length > 50 ||
        typeof password !== 'string' || !password || Buffer.byteLength(password) > 72) {
      res.status(400).json({ message: 'Enter a valid login ID and password (maximum 72 password bytes).' }); return;
    }
    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
    for (const [key, value] of sessions) if (value.expires <= now) sessions.delete(key);
    const key = req.ip ?? 'local';
    const attempt = attempts.get(key) ?? { count: 0, expires: now + 15 * 60_000 };
    if (attempt.count >= 10) {
      res.status(429).json({ message: 'Too many login attempts. Try again in 15 minutes.' }); return;
    }
    attempt.count++; attempts.set(key, attempt);
    const account = await accounts.byLogin(login_id.trim());
    const valid = await bcrypt.compare(password, account?.password_hash ?? dummyHash);
    if (!account || !valid || !account.is_active) {
      res.status(401).json({ message: 'Incorrect login ID or password, or account disabled.' }); return;
    }
    attempts.delete(key);
    const previous = tokenFrom(req);
    if (previous) sessions.delete(previous);
    const token = randomBytes(32).toString('hex');
    sessions.set(token, { id: account.id, expires: now + 8 * 60 * 60_000 });
    res.setHeader('Set-Cookie', cookie(token, 8 * 60 * 60));
    res.json({ user: publicUser(account) });
  });
  app.post('/api/auth/logout', (req, res) => {
    const token = tokenFrom(req);
    if (token) sessions.delete(token);
    res.setHeader('Set-Cookie', cookie('', 0));
    res.json({ message: 'Logged out.' });
  });
  app.use('/api', async (req, res, next) => {
    const token = tokenFrom(req);
    const session = token ? sessions.get(token) : undefined;
    if (!session || session.expires <= Date.now()) {
      if (token) sessions.delete(token);
      res.status(401).json({ message: 'Please log in.' }); return;
    }
    const account = await accounts.byId(session.id);
    if (!account || !account.is_active) {
      sessions.delete(token!);
      res.status(401).json({ message: 'Please log in.' }); return;
    }
    res.locals.user = publicUser(account);
    next();
  });
  if (accounts.resets) app.use('/api', resetRouter(accounts.resets, invalidate));
  if (accounts.jobs) app.use('/api', jobsRouter(accounts.jobs));
  app.get('/api/auth/me', (_req, res) => { res.json({ user: res.locals.user }); });
  if (accounts.majorPlanning) app.use('/api', accounts.majorPlanning);
  if (accounts.schedules) app.use('/api', scheduleRouter(accounts.schedules));
  if (accounts.studentAdmin) app.use('/api', studentAdminRouter(accounts.studentAdmin));
  app.get('/api/admin/course-assignments', async (_req, res) => {
    if (res.locals.user.role !== 'admin') { res.status(403).json({ message: 'Administrators only.' }); return; }
    if (!accounts.courseAssignments) { res.status(503).json({ message: 'Course assignment service unavailable.' }); return; }
    res.json({ offerings: await accounts.courseAssignments() });
  });
  app.put('/api/admin/course-assignments/:id/professor', async (req, res) => {
    if (res.locals.user.role !== 'admin') { res.status(403).json({ message: 'Administrators only.' }); return; }
    const id = Number(req.params.id);
    const professor = req.body?.professor;
    if (!Number.isSafeInteger(id) || id < 1 || typeof professor !== 'string' || !professor.trim() || professor.trim().length > 150) {
      res.status(400).json({ message: 'Choose a valid course offering and enter a professor name (1–150 characters).' }); return;
    }
    if (!accounts.updateProfessor) { res.status(503).json({ message: 'Professor editing service unavailable.' }); return; }
    if (!await accounts.updateProfessor(id, professor.trim())) { res.status(404).json({ message: 'This assignment no longer exists. Refresh the board.' }); return; }
    res.json({ professor: professor.trim(), message: 'Professor updated.' });
  });
  app.delete('/api/admin/course-assignments/:id', async (req, res) => {
    if (res.locals.user.role !== 'admin') { res.status(403).json({ message: 'Administrators only.' }); return; }
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) { res.status(400).json({ message: 'Invalid course offering.' }); return; }
    if (!accounts.removeOffering) { res.status(503).json({ message: 'Course assignment service unavailable.' }); return; }
    try {
      if (!await accounts.removeOffering(id)) { res.status(404).json({ message: 'This assignment no longer exists. Refresh the board.' }); return; }
      res.json({ message: 'Course removed from semester.' });
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_ROW_IS_REFERENCED_2') {
        res.status(409).json({ message: 'This offering has linked schedules or enrollment records. Remove those links before removing the offering.' }); return;
      }
      throw error;
    }
  });
  app.get('/api/student/profile', async (_req, res) => {
    if (res.locals.user.role !== 'student') {
      res.status(403).json({ message: 'This page is for student accounts.' }); return;
    }
    if (!readProfile) {
      res.status(503).json({ message: 'Profile service is unavailable.' }); return;
    }
    const profile = await readProfile(res.locals.user.id);
    if (!profile) {
      res.status(404).json({ message: 'Your student profile was not found. Contact your administrator.' }); return;
    }
    res.json({ profile });
  });
  app.put('/api/student/profile/contact', async (req, res) => {
    if (res.locals.user.role !== 'student') { res.status(403).json({ message: 'This page is for student accounts.' }); return; }
    const { email, phone_number, address } = req.body ?? {};
    if (![email, phone_number, address].every(value => value === null || typeof value === 'string')) { res.status(400).json({ message: 'Contact fields must be text or empty.' }); return; }
    if (typeof email === 'string' && email.length > 254 || typeof phone_number === 'string' && phone_number.length > 30 || typeof address === 'string' && address.length > 500) { res.status(400).json({ message: 'One of the fields is too long.' }); return; }
    if (typeof email === 'string' && email && !/^\S+@\S+\.\S+$/.test(email)) { res.status(400).json({ message: 'Enter a valid email address.' }); return; }
    if (!updateContact) { res.status(503).json({ message: 'Profile service is unavailable.' }); return; }
    await updateContact(res.locals.user.id, { email: email?.trim() || null, phone_number: phone_number?.trim() || null, address: address?.trim() || null });
    res.json({ message: 'Profile updated.' });
  });
  app.get('/api/student/semesters', async (_req, res) => { if (res.locals.user.role !== 'student') { res.status(403).json({ message: 'Students only.' }); return; } res.json({ semesters: readSemesters ? await readSemesters(res.locals.user.id) : [] }); });
  app.get('/api/admin/semesters', async (_req, res) => { if (res.locals.user.role !== 'admin') { res.status(403).json({ message: 'Administrators only.' }); return; } res.json({ semesters: readSemesters ? await readSemesters() : [] }); });
  app.post('/api/admin/semesters', async (req, res) => {
    if (res.locals.user.role !== 'admin') { res.status(403).json({ message: 'Administrators only.' }); return; }
    const { name, academic_year, start_date, end_date } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || !Number.isInteger(academic_year) || academic_year < 2000 || academic_year > 2200 || typeof start_date !== 'string' || typeof end_date !== 'string' || end_date < start_date) { res.status(400).json({ message: 'Enter a valid name, year, and date range.' }); return; }
    if (!addSemester) { res.status(503).json({ message: 'Semester service is unavailable.' }); return; }
    try { const id = await addSemester({ name: name.trim(), academic_year, start_date, end_date }); res.status(201).json({ semester: { id, name: name.trim(), academic_year, start_date, end_date } }); } catch (error) { if ((error as { code?: string }).code === 'ER_DUP_ENTRY') { res.status(409).json({ message: 'That semester already exists.' }); return; } throw error; }
  });
  app.post('/api/admin/semester-assignments', async (req, res) => { if(res.locals.user.role!=='admin'){res.status(403).json({message:'Administrators only.'});return} const {login_id,semester_id}=req.body??{}; if(typeof login_id!=='string'||!login_id.trim()||!Number.isInteger(semester_id)){res.status(400).json({message:'Choose a student login ID and semester.'});return} if(!assignSemester){res.status(503).json({message:'Assignment service unavailable.'});return} const student=await accounts.byLogin(login_id.trim()); if(!student||student.role!=='student'){res.status(404).json({message:'Student login ID was not found.'});return} try{await assignSemester(student.id,semester_id);res.status(201).json({message:'Student assigned to semester.'})}catch(error){if((error as {code?:string}).code==='ER_DUP_ENTRY'){res.status(409).json({message:'Student is already assigned.'});return}throw error} });
  app.get('/api/student/courses', async (_req,res)=>{if(res.locals.user.role!=='student'){res.status(403).json({message:'Students only.'});return}res.json({courses:readCourses?await readCourses(res.locals.user.id):[]})});
  app.get('/api/admin/courses', async (_req,res)=>{if(res.locals.user.role!=='admin'){res.status(403).json({message:'Administrators only.'});return}res.json({courses:catalog?await catalog():[]})});
  app.post('/api/admin/course-assignments', async (req,res)=>{if(res.locals.user.role!=='admin'){res.status(403).json({message:'Administrators only.'});return}const {course_id,semester_id,professor}=req.body??{};if(!Number.isInteger(course_id)||!Number.isInteger(semester_id)||typeof professor!=='string'||!professor.trim()){res.status(400).json({message:'Choose a course, semester, and professor.'});return}if(!assignCourse){res.status(503).json({message:'Course assignment service unavailable.'});return}try{const id=await assignCourse(course_id,semester_id,professor.trim());res.status(201).json({message:'Course assigned to semester.',id})}catch(error){if((error as {code?:string}).code==='ER_DUP_ENTRY'){res.status(409).json({message:'Course is already in this semester.'});return}throw error}});
  app.delete('/api/admin/course-assignments', async (req,res)=>{if(res.locals.user.role!=='admin'){res.status(403).json({message:'Administrators only.'});return}const {course_id,semester_id}=req.body??{};if(!Number.isInteger(course_id)||!Number.isInteger(semester_id)||!removeCourse){res.status(400).json({message:'Choose a course and semester.'});return}await removeCourse(course_id,semester_id);res.json({message:'Course removed from semester.'})});
  app.post('/api/admin/course-offerings', async (req,res)=>{if(res.locals.user.role!=='admin'){res.status(403).json({message:'Administrators only.'});return}const {course_code,course_name,credits,semester_id,professor,section}=req.body??{};if(typeof course_code!=='string'||typeof course_name!=='string'||!Number.isFinite(credits)||!Number.isInteger(semester_id)){res.status(400).json({message:'Enter course code, name, credits, and semester.'});return}if(!addOffering){res.status(503).json({message:'Course service unavailable.'});return}try{const id=await addOffering({course_code:course_code.trim(),course_name:course_name.trim(),credits,semester_id,professor:typeof professor==='string'?professor.trim():'',section:typeof section==='string'?section.trim():'A'});res.status(201).json({message:'Course offering created.',id})}catch(error){if((error as {code?:string}).code==='ER_DUP_ENTRY'){res.status(409).json({message:'That course offering already exists.'});return}throw error}});
  app.post('/api/admin/enrollments', async(req,res)=>{if(res.locals.user.role!=='admin'){res.status(403).json({message:'Administrators only.'});return}const {login_id,offering_id}=req.body??{};if(typeof login_id!=='string'||!Number.isInteger(offering_id)){res.status(400).json({message:'Choose a student and course offering.'});return}const student=await accounts.byLogin(login_id.trim());if(!student||student.role!=='student'){res.status(404).json({message:'Student login ID was not found.'});return}if(!enroll){res.status(503).json({message:'Enrollment service unavailable.'});return}try{await enroll(student.id,offering_id);res.status(201).json({message:'Student enrolled.'})}catch(error){if((error as {code?:string}).code==='ER_DUP_ENTRY'){res.status(409).json({message:'Student is already enrolled.'});return}throw error}});
  app.post('/api/admin/students', async (req, res) => {
    if (res.locals.user.role !== 'admin') {
      res.status(403).json({ message: 'Only administrators can create student accounts.' }); return;
    }
    const validation = validateStudent(req.body);
    if (!validation.ok) {
      res.status(400).json({ message: validation.message }); return;
    }
    if (!addStudent) {
      res.status(503).json({ message: 'Student management is unavailable.' }); return;
    }
    try {
      const id = await addStudent(validation.student);
      res.status(201).json({ message: 'Student account created.', student: { id, login_id: validation.student.login_id, full_name: validation.student.full_name } });
    } catch (error) {
      // The database UNIQUE constraint also catches simultaneous duplicate requests.
      if ((error as { code?: string })?.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'This login ID is already in use.' }); return;
      }
      throw error;
    }
  });
  for (const role of ['admin', 'student']) {
    app.get('/api/' + role + '/home', (_req, res) => {
      if (res.locals.user.role !== role) {
        res.status(403).json({ message: 'You do not have access to this page.' }); return;
      }
      res.json({ user: res.locals.user, message: role === 'admin' ? 'Admin access verified.' : 'Student access verified.' });
    });
  }
  app.use('/api', (_req, res) => { res.status(404).json({ message: 'Endpoint not found.' }); });
  if (serveFrontend) {
    app.use(express.static(resolve(__dirname, '../../frontend/dist')));
  }
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof ScheduleError) { res.status(error.status).json({ message: error.message }); return; }
    if (error instanceof SyntaxError) {
      res.status(400).json({ message: 'Invalid request.' }); return;
    }
    console.error('API request failed:', error instanceof Error ? error.message : error);
    const code = (error as { code?: string })?.code;
    if (code === 'ER_NO_REFERENCED_ROW_2') { res.status(400).json({ message: 'The selected student or semester does not exist.' }); return; }
    if (code === 'ER_NO_SUCH_TABLE') { res.status(503).json({ message: 'Database table is missing. Run the student_semesters migration.' }); return; }
    res.status(503).json({ message: 'Service unavailable. Check the backend database connection.' });
  });
  return app;
}


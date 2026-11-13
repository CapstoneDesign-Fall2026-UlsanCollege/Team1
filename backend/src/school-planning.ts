import {schoolTransferRouter} from './school-transfer.js';
import bcrypt from 'bcryptjs';
import {validateStudent} from './students.js';
import { Router } from 'express';
import { schoolRoomRouter } from './school-rooms.js';
import type { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { ScheduleError, validateMeeting } from './schedules.js';
import { isMenuDate } from './canteen-menu.js';

export function schoolText(value: unknown, max: number, label: string): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new ScheduleError(400, `Enter ${label} (1–${max} characters).`);
  return value.trim();
}
export function schoolId(value: unknown): number {
  if (!Number.isSafeInteger(value) || Number(value) < 1) throw new ScheduleError(400, 'Choose a valid record.');
  return Number(value);
}
export function schoolDates(start: unknown, end: unknown) {
  if (!isMenuDate(start) || !isMenuDate(end) || start > end) throw new ScheduleError(400, 'Choose valid start/end dates in order.');
  return { start, end };
}
const yDates = "DATE_FORMAT(y.start_date,'%Y-%m-%d') start_date,DATE_FORMAT(y.end_date,'%Y-%m-%d') end_date";
const mDates = "DATE_FORMAT(m.starts_on,'%Y-%m-%d') starts_on,DATE_FORMAT(m.ends_on,'%Y-%m-%d') ends_on";
type DB = Pick<Pool, 'execute'>;
async function rows(db: DB, sql: string, values: any[] = []) {
  return (await db.execute<RowDataPacket[]>(sql, values))[0];
}
async function year(db: DB, id: number) {
  const [value] = await rows(db, `SELECT y.id,y.name,${yDates} FROM school_years y WHERE y.id=?`, [id]);
  if (!value) throw new ScheduleError(404, 'Academic year not found.');
  return value;
}
async function schoolClass(db: DB, id: number) {
  const [value] = await rows(db, `SELECT c.*,${yDates} FROM school_classes c JOIN school_years y ON y.id=c.year_id WHERE c.id=?`, [id]);
  if (!value) throw new ScheduleError(404, 'Class not found.');
  return value;
}
async function profile(db: DB) { return (await rows(db, 'SELECT name,level FROM school_profile WHERE id=1'))[0] ?? null; }
async function mutate<T>(pool: Pool, revision: unknown, run: (c: PoolConnection) => Promise<T>): Promise<T> {
  if (!Number.isSafeInteger(revision) || Number(revision) < 0) throw new ScheduleError(400, 'Reload school planning before saving.');
  const c = await pool.getConnection();
  try {
    await c.beginTransaction();
    const [lock] = await rows(c, 'SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');
    if (lock.version !== revision) throw new ScheduleError(409, 'School records changed elsewhere. Reload before saving.');
    const result = await run(c);
    await c.query('UPDATE school_planning_lock SET version=version+1 WHERE id=1');
    await c.commit(); return result;
  } catch (error) {
    await c.rollback();
    if ((error as {code?:string}).code === 'ER_DUP_ENTRY') throw new ScheduleError(409, 'That year, class or assignment already exists. Reload to review it.');
    throw error;
  } finally { c.release(); }
}
async function requireSchool(db: DB) {
  const value = await profile(db);
  if (!value) throw new ScheduleError(409, 'Set up the school profile first.');
  return value;
}

const membershipJoin = `FROM school_memberships m JOIN school_classes cl ON cl.id=m.class_id
  JOIN school_years y ON y.id=cl.year_id
  WHERE m.student_user_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?)
  AND y.start_date<=? AND y.end_date>=?`;
const activeOffering = `EXISTS (SELECT 1 FROM school_class_offerings link
  JOIN school_classes cl ON cl.id=link.class_id JOIN school_memberships m ON m.class_id=cl.id
  JOIN school_years y ON y.id=cl.year_id JOIN school_terms st ON st.year_id=y.id AND st.semester_id=co.semester_id
  WHERE link.offering_id=co.id AND m.student_user_id=? AND m.starts_on<=?
  AND (m.ends_on IS NULL OR m.ends_on>?) AND y.start_date<=? AND y.end_date>=?)`;
function scope(userId: number, today: string) { return [userId,today,today,today,today]; }

export function schoolDate(now: Date = new Date()): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now); }

export function schoolPlanningRouter(pool: Pool, today: () => string = schoolDate) {
  const router = Router();
  router.use('/admin/school', (_req,res,next) => {
    if (res.locals.user.role !== 'admin') { res.status(403).json({message:'Administrators only.'}); return; }
    next();
  });
  router.use(schoolTransferRouter(pool));
  router.use(schoolRoomRouter(pool,(revision,run)=>mutate(pool,revision,run)));
  // School enrollment creates all three records under the planning lock.
  router.post('/admin/school/students',async(req,res)=>{
    const input=req.body??{},classId=schoolId(input.class_id);
    if(!isMenuDate(input.starts_on))throw new ScheduleError(400,'Choose a valid enrollment date.');
    const check=validateStudent({...input,university:'School',major:'Not applicable',year_of_study:1,semester_id:null});
    if(!check.ok)throw new ScheduleError(400,check.message);
    const student=check.student,hash=await bcrypt.hash(student.password,12);
    const studentId=await mutate(pool,input.revision,async c=>{
      const school=await requireSchool(c),cl=await schoolClass(c,classId);
      if(!cl.is_active)throw new ScheduleError(400,'Choose an active class.');
      if(input.starts_on<cl.start_date||input.starts_on>cl.end_date)throw new ScheduleError(400,'Enrollment date must be inside the class academic year.');
      let id:number;
      try{const [r]=await c.execute<ResultSetHeader>("INSERT INTO users(login_id,password_hash,role) VALUES(?,?,'student')",[student.login_id,hash]);id=r.insertId}
      catch(e){if((e as {code?:string}).code==='ER_DUP_ENTRY')throw new ScheduleError(409,'This login ID is already in use.');throw e}
      await c.execute('INSERT INTO student_profiles(user_id,full_name,university,major,year_of_study,email,phone_number,address) VALUES(?,?,?,NULL,NULL,?,?,?)',[id,student.full_name,school.name,student.email||null,student.phone_number||null,student.address||null]);
      await c.execute('INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(?,?,?,?)',[id,cl.year_id,classId,input.starts_on]);
      return id;
    });
    res.status(201).json({message:'Student account and class enrollment saved.',student:{id:studentId,login_id:student.login_id,full_name:student.full_name}});
  });
  router.get('/admin/school/classes/:id/students',async(req,res)=>{
    const cl=await schoolClass(pool,schoolId(Number(req.params.id))),date=req.query.date??today(),page=Number(req.query.page??1);
    if(typeof date!=='string'||!isMenuDate(date)||date<cl.start_date||date>cl.end_date||!Number.isSafeInteger(page)||page<1||page>100000)throw new ScheduleError(400,'Choose a valid roster date and page.');
    const filter='FROM school_memberships m JOIN users u ON u.id=m.student_user_id JOIN student_profiles p ON p.user_id=u.id WHERE m.class_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?)';
    const values=[cl.id,date,date], [count]=await rows(pool,'SELECT COUNT(*) total '+filter,values);
    const students=await rows(pool,'SELECT u.id,u.login_id,u.is_active,p.full_name '+filter+' ORDER BY p.full_name,u.id LIMIT 10 OFFSET '+((page-1)*10),values);
    res.json({students,total:Number(count.total),page,page_size:10,date});
  });
  router.get('/admin/school/summary', async (_req,res) => {
    const date=today();
    const [currentYear]=await rows(pool,`SELECT y.id,y.name,${yDates} FROM school_years y WHERE y.start_date<=? AND y.end_date>=? LIMIT 1`,[date,date]);
    const [students]=await rows(pool,"SELECT COUNT(*) total FROM users WHERE role='student' AND is_active=1");
    const [classes]=await rows(pool,'SELECT COUNT(*) total FROM school_classes WHERE year_id=? AND is_active=1',[currentYear?.id??0]);
    const [unassigned]=await rows(pool,`SELECT COUNT(*) total FROM users u WHERE u.role='student' AND u.is_active=1 AND NOT EXISTS (SELECT m.id FROM school_memberships m JOIN school_years y ON y.id=m.year_id WHERE m.student_user_id=u.id AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?) AND y.start_date<=? AND y.end_date>=?)`,[date,date,date,date]);
    res.json({school:await profile(pool),current_year:currentYear??null,today:date,counts:{students:Number(students.total),classes:Number(classes.total),unassigned:Number(unassigned.total)}});
  });
  router.get('/admin/school', async (_req,res) => {
    const [revision] = await rows(pool,'SELECT version FROM school_planning_lock WHERE id=1');
    res.json({revision:revision.version,profile:await profile(pool),today:today(),
      years:await rows(pool,`SELECT y.id,y.name,${yDates} FROM school_years y ORDER BY y.start_date DESC`),
      classes:await rows(pool,'SELECT * FROM school_classes ORDER BY year_id DESC,grade_label,name,id'),
      terms:await rows(pool,`SELECT s.id,s.name,s.academic_year,DATE_FORMAT(s.start_date,'%Y-%m-%d') start_date,DATE_FORMAT(s.end_date,'%Y-%m-%d') end_date,st.year_id FROM semesters s LEFT JOIN school_terms st ON st.semester_id=s.id ORDER BY s.start_date DESC`),
      subjects:await rows(pool,`SELECT co.id,co.course_id,co.semester_id,co.major,co.professor,co.section,c.course_code,c.course_name FROM course_offerings co JOIN courses c ON c.id=co.course_id ORDER BY co.semester_id DESC,c.course_code,co.id`),
      links:await rows(pool,'SELECT class_id,offering_id FROM school_class_offerings'),
      teachers:await rows(pool,'SELECT * FROM school_teachers ORDER BY name,id'),
      grade_subjects:await rows(pool,'SELECT * FROM school_grade_subjects'),
      subject_teachers:await rows(pool,'SELECT * FROM school_offering_teachers'),
      catalog:await rows(pool,'SELECT id,course_code,course_name FROM courses ORDER BY course_code'),
      meetings:await rows(pool,'SELECT * FROM class_schedules ORDER BY day_of_week,start_time,id'),
    });
  });
  router.put('/admin/school/profile', async(req,res) => {
    const name=schoolText(req.body?.name,150,'a school name'),level=req.body?.level;
    if (!['middle','high'].includes(level) || req.body?.confirm_school_mode !== true) throw new ScheduleError(400,'Choose middle/high school and confirm explicit school-mode setup.');
    await mutate(pool,req.body.revision,async c => {
      const old=await profile(c);
      if (old && old.level !== level && (await rows(c,'SELECT id FROM school_years LIMIT 1')).length) throw new ScheduleError(409,'School years already exist. Review their migration before changing school level.');
      await c.execute('INSERT INTO school_profile(id,name,level) VALUES(1,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),level=VALUES(level)',[name,level]);
    }); res.json({message:'School profile saved. Student academic access now requires explicit class mapping.'});
  });
  router.post('/admin/school/years',async(req,res)=>{
    const name=schoolText(req.body?.name,80,'an academic year label'),{start,end}=schoolDates(req.body?.start_date,req.body?.end_date);
    const id=await mutate(pool,req.body.revision,async c=>{
      await requireSchool(c);
      if((await rows(c,'SELECT id FROM school_years WHERE start_date<=? AND end_date>=?',[end,start])).length) throw new ScheduleError(409,'Academic year dates overlap an existing year.');
      const [r]=await c.execute<ResultSetHeader>('INSERT INTO school_years(name,start_date,end_date) VALUES(?,?,?)',[name,start,end]);return r.insertId;
    });res.status(201).json({id,message:'Academic year created.'});
  });
  router.put('/admin/school/years/:id',async(req,res)=>{
    const id=schoolId(Number(req.params.id)),name=schoolText(req.body?.name,80,'an academic year label'),{start,end}=schoolDates(req.body?.start_date,req.body?.end_date);
    await mutate(pool,req.body.revision,async c=>{
      await year(c,id);
      if((await rows(c,'SELECT id FROM school_years WHERE id<>? AND start_date<=? AND end_date>=?',[id,end,start])).length) throw new ScheduleError(409,'Academic year dates overlap an existing year.');
      if((await rows(c,'SELECT s.id FROM school_terms st JOIN semesters s ON s.id=st.semester_id WHERE st.year_id=? AND (s.start_date<? OR s.end_date>?)',[id,start,end])).length ||
        (await rows(c,'SELECT id FROM school_memberships WHERE year_id=? AND (starts_on<? OR starts_on>? OR ends_on>?)',[id,start,end,end])).length) throw new ScheduleError(409,'The new dates would exclude saved terms or class-membership history.');
      await c.execute('UPDATE school_years SET name=?,start_date=?,end_date=? WHERE id=?',[name,start,end,id]);
    });res.json({message:'Academic year updated.'});
  });
  async function saveClass(input:any,id?:number) {
    const yearId=schoolId(input?.year_id),grade=schoolText(input?.grade_label,30,'a grade'),name=schoolText(input?.name,50,'a class label');
    if(typeof input.is_active!=='boolean')throw new ScheduleError(400,'Choose active or inactive.');
    return mutate(pool,input.revision,async c=>{
      await year(c,yearId);
      if(id){const old=await schoolClass(c,id);if(old.year_id!==yearId)throw new ScheduleError(400,'Keep the class in its original academic year.');
        if(!input.is_active && ((await rows(c,'SELECT id FROM school_memberships WHERE class_id=? AND ends_on IS NULL LIMIT 1',[id])).length || (await rows(c,'SELECT offering_id FROM school_class_offerings WHERE class_id=? LIMIT 1',[id])).length))throw new ScheduleError(409,'This class has linked assignments. Preserve it and review the assignments before deactivating.');
        await c.execute('UPDATE school_classes SET grade_label=?,name=?,is_active=? WHERE id=?',[grade,name,input.is_active?1:0,id]);return id;
      }
      const [r]=await c.execute<ResultSetHeader>('INSERT INTO school_classes(year_id,grade_label,name,is_active) VALUES(?,?,?,?)',[yearId,grade,name,input.is_active?1:0]);return r.insertId;
    });
  }
  router.post('/admin/school/classes',async(req,res)=>res.status(201).json({id:await saveClass(req.body),message:'Homeroom class created.'}));
  router.put('/admin/school/classes/:id',async(req,res)=>res.json({id:await saveClass(req.body,schoolId(Number(req.params.id))),message:'Homeroom class updated.'}));

  router.post('/admin/school/terms',async(req,res)=>{
    const yearId=schoolId(req.body?.year_id);
    const id=await mutate(pool,req.body.revision,async c=>{
      const y=await year(c,yearId);let semesterId:number,start:string,end:string;
      if(req.body.semester_id!==undefined){semesterId=schoolId(req.body.semester_id);const [term]=await rows(c,"SELECT DATE_FORMAT(start_date,'%Y-%m-%d') start_date,DATE_FORMAT(end_date,'%Y-%m-%d') end_date FROM semesters WHERE id=?",[semesterId]);if(!term)throw new ScheduleError(404,'Term not found.');({start,end}=schoolDates(term.start_date,term.end_date));}
      else {({start,end}=schoolDates(req.body.start_date,req.body.end_date));const name=schoolText(req.body.name,100,'a term name');
        if(start<y.start_date||end>y.end_date)throw new ScheduleError(400,'Term dates must fit inside the academic year.');
        const [r]=await c.execute<ResultSetHeader>('INSERT INTO semesters(name,academic_year,start_date,end_date) VALUES(?,?,?,?)',[name,Number(y.start_date.slice(0,4)),start,end]);semesterId=r.insertId;}
      if(start<y.start_date||end>y.end_date)throw new ScheduleError(400,'Term dates must fit inside the academic year.');
      await c.execute('INSERT INTO school_terms(semester_id,year_id) VALUES(?,?)',[semesterId,yearId]);return semesterId;
    });res.status(201).json({id,message:'Term linked to academic year.'});
  });
  router.get('/admin/school/directory',async(req,res)=>{
    const yearId=schoolId(Number(req.query.year_id)),grade=schoolText(req.query.grade,30,'a grade'),date=req.query.date,search=req.query.search??'';
    if(!isMenuDate(date)||typeof search!=='string'||search.length>150)throw new ScheduleError(400,'Choose a valid date and search up to 150 characters.');
    const y=await year(pool,yearId);if(date<y.start_date||date>y.end_date)throw new ScheduleError(400,'Choose a date inside the academic year.');
    const classId=req.query.class_id?schoolId(Number(req.query.class_id)):null;
    if(classId){const cl=await schoolClass(pool,classId);if(cl.year_id!==yearId||cl.grade_label!==grade)throw new ScheduleError(400,'Choose a class in the selected grade and year.');}
    const values:any[]=[yearId,date,date,search.trim(),search.trim()];
    let filter:string;
    if(grade==='__unassigned'){filter='m.id IS NULL';if(classId)throw new ScheduleError(400,'Unassigned students have no class filter.');}
    else {filter='cl.grade_label=?';values.push(grade);if(classId){filter+=' AND cl.id=?';values.push(classId);}}
    const students=await rows(pool,`SELECT u.id,u.login_id,u.is_active,p.full_name,p.university,p.major,p.year_of_study,p.email,p.phone_number,p.address,cl.grade_label,cl.name class_name,cl.id class_id
      FROM users u JOIN student_profiles p ON p.user_id=u.id
      LEFT JOIN school_memberships m ON m.student_user_id=u.id AND m.year_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?)
      LEFT JOIN school_classes cl ON cl.id=m.class_id
      WHERE u.role='student' AND (LOCATE(?,u.login_id)>0 OR LOCATE(?,p.full_name)>0) AND ${filter}
      ORDER BY p.full_name,u.id LIMIT 100`,values);
    res.json({students:students.map(s=>({...s,is_active:Boolean(s.is_active),semester_ids:[]})),limit:100,date});
  });
  router.get('/admin/school/teacher-directory',async(req,res)=>{
    const yearId=schoolId(Number(req.query.year_id));await year(pool,yearId);
    const teachers=await rows(pool,'SELECT id,staff_code,name,is_active FROM school_teachers ORDER BY name,id');
    const assignments=await rows(pool,`SELECT ot.teacher_id,co.id offering_id,c.course_name,c.course_code,cl.id class_id,cl.grade_label,cl.name class_name,s.id semester_id,s.name term_name,
      DATE_FORMAT(s.start_date,'%Y-%m-%d') start_date,DATE_FORMAT(s.end_date,'%Y-%m-%d') end_date,
      cs.id meeting_id,cs.day_of_week,TIME_FORMAT(cs.start_time,'%H:%i') start_time,TIME_FORMAT(cs.end_time,'%H:%i') end_time
      FROM school_offering_teachers ot JOIN course_offerings co ON co.id=ot.offering_id JOIN courses c ON c.id=co.course_id
      JOIN school_class_offerings link ON link.offering_id=co.id JOIN school_classes cl ON cl.id=link.class_id
      JOIN school_terms st ON st.semester_id=co.semester_id AND st.year_id=cl.year_id JOIN semesters s ON s.id=co.semester_id
      LEFT JOIN class_schedules cs ON cs.course_offering_id=co.id
      WHERE cl.year_id=? ORDER BY cl.grade_label,cl.name,cs.day_of_week,cs.start_time`,[yearId]);
    res.json({teachers,assignments});
  });
  router.get('/admin/school/students',async(req,res)=>{
    const search=req.query.search??'';if(typeof search!=='string'||search.length>150)throw new ScheduleError(400,'Search by name or login ID.');
    const students=await rows(pool,"SELECT u.id,u.login_id,u.is_active,p.full_name,p.major AS legacy_major FROM users u JOIN student_profiles p ON p.user_id=u.id WHERE u.role='student' AND (LOCATE(?,u.login_id)>0 OR LOCATE(?,p.full_name)>0) ORDER BY p.full_name,u.id LIMIT 100",[search.trim(),search.trim()]);
    const memberships=students.length?await rows(pool,`SELECT m.id,m.student_user_id,m.year_id,m.class_id,${mDates},c.grade_label,c.name,y.name year_name FROM school_memberships m JOIN school_classes c ON c.id=m.class_id JOIN school_years y ON y.id=m.year_id WHERE m.student_user_id IN (${students.map(()=>'?').join(',')}) ORDER BY m.starts_on,m.id`,students.map(s=>s.id)):[];
    res.json({students,memberships,limit:100});
  });
  router.put('/admin/school/students/:id/membership',async(req,res)=>{
    const studentId=schoolId(Number(req.params.id)),yearId=schoolId(req.body?.year_id),classId=req.body?.class_id===null?null:schoolId(req.body?.class_id),date=req.body?.starts_on;
    if(!isMenuDate(date))throw new ScheduleError(400,'Choose a valid effective date.');
    await mutate(pool,req.body.revision,async c=>{
      const y=await year(c,yearId);
      if(date<y.start_date||date>y.end_date)throw new ScheduleError(400,'Membership date must fit inside the academic year.');
      const [student]=await rows(c,"SELECT id,is_active FROM users WHERE id=? AND role='student'",[studentId]);
      if(!student)throw new ScheduleError(404,'Student not found.');
      if(classId){if(!student.is_active)throw new ScheduleError(400,'Enable this student before assigning a class.');const cl=await schoolClass(c,classId);if(cl.year_id!==yearId||!cl.is_active)throw new ScheduleError(400,'Choose an active class in this academic year.');}
      const history=await rows(c,`SELECT m.id,m.class_id,${mDates} FROM school_memberships m WHERE m.student_user_id=? AND m.year_id=? ORDER BY m.starts_on DESC,m.id DESC`,[studentId,yearId]);
      const last=history[0];
      if(last && (date<last.starts_on || (last.ends_on && date<last.ends_on)))throw new ScheduleError(409,'This date overlaps saved membership history. Choose a later effective date.');
      if(last && !last.ends_on && last.class_id===classId)throw new ScheduleError(409,'Student is already assigned to this class.');
      if(!classId && (!last||last.ends_on))throw new ScheduleError(409,'Student has no open membership to end.');
      if(last&&!last.ends_on)await c.execute('UPDATE school_memberships SET ends_on=? WHERE id=?',[date,last.id]);
      if(classId)await c.execute('INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(?,?,?,?)',[studentId,yearId,classId,date]);
    });res.json({message:classId?'Class membership saved; previous history retained.':'Membership ended; history retained.'});
  });

  async function linkSubject(c:PoolConnection,classId:number,offeringId:number) {
    const cl=await schoolClass(c,classId);if(!cl.is_active)throw new ScheduleError(400,'Choose an active class.');
    const [offering]=await rows(c,'SELECT co.course_id,co.semester_id,st.year_id,s.start_date,s.end_date FROM course_offerings co LEFT JOIN school_terms st ON st.semester_id=co.semester_id JOIN semesters s ON s.id=co.semester_id WHERE co.id=?',[offeringId]);
    if(!offering)throw new ScheduleError(404,'Subject offering not found.');
    if(offering.year_id!==cl.year_id)throw new ScheduleError(400,'Map this offering’s term to the class academic year first.');
    if((await rows(c,'SELECT link.offering_id FROM school_class_offerings link JOIN course_offerings co ON co.id=link.offering_id WHERE link.class_id=? AND co.course_id=? AND co.semester_id=?',[classId,offering.course_id,offering.semester_id])).length)throw new ScheduleError(409,'This subject is already linked to the class for that term.');
    if((await rows(c,`SELECT a.id FROM class_schedules a JOIN class_schedules b ON a.day_of_week=b.day_of_week AND a.start_time<b.end_time AND a.end_time>b.start_time JOIN school_class_offerings link ON link.offering_id=b.course_offering_id JOIN course_offerings co ON co.id=b.course_offering_id JOIN semesters s ON s.id=co.semester_id WHERE a.course_offering_id=? AND link.class_id=? AND s.start_date<=? AND s.end_date>=? LIMIT 1`,[offeringId,classId,offering.end_date,offering.start_date])).length)throw new ScheduleError(409,'This offering has meetings that overlap this class timetable. Review the meeting times first.');
    await c.execute('INSERT INTO school_class_offerings(class_id,offering_id) VALUES(?,?)',[classId,offeringId]);
  }
  router.post('/admin/school/teachers',async(req,res)=>{
    const name=schoolText(req.body.name,150,'a teacher name'),code=schoolText(req.body.staff_code,40,'a unique staff code');
    const id=await mutate(pool,req.body.revision,async c=>{await requireSchool(c);const [r]=await c.execute<ResultSetHeader>('INSERT INTO school_teachers(staff_code,name) VALUES(?,?)',[code,name]);return r.insertId;});
    res.status(201).json({id,message:'Teacher added to the directory.'});
  });
  router.post('/admin/school/grade-subjects',async(req,res)=>{
    const yearId=schoolId(req.body.year_id),grade=schoolText(req.body.grade_label,30,'a grade');
    const id=await mutate(pool,req.body.revision,async c=>{
      await year(c,yearId);let courseId:number;
      if(req.body.course_id)courseId=schoolId(req.body.course_id);
      else {const code=schoolText(req.body.course_code,50,'a subject code'),name=schoolText(req.body.course_name,150,'a subject name');
        const [r]=await c.execute<ResultSetHeader>('INSERT INTO courses(course_code,course_name,credits) VALUES(?,?,0)',[code,name]);courseId=r.insertId;}
      if(!(await rows(c,'SELECT id FROM courses WHERE id=?',[courseId])).length)throw new ScheduleError(404,'Catalog subject not found.');
      await c.execute('INSERT INTO school_grade_subjects(year_id,grade_label,course_id) VALUES(?,?,?)',[yearId,grade,courseId]);return courseId;
    });res.status(201).json({id,message:'Subject saved to this grade’s library.'});
  });
  async function teacherConflict(c:PoolConnection,offeringId:number,teacherId:number) {
    return (await rows(c,`SELECT a.id FROM class_schedules a JOIN course_offerings ca ON ca.id=a.course_offering_id JOIN semesters sa ON sa.id=ca.semester_id
      JOIN school_offering_teachers ot ON ot.teacher_id=? AND ot.offering_id<>a.course_offering_id
      JOIN course_offerings cb ON cb.id=ot.offering_id JOIN semesters sb ON sb.id=cb.semester_id
      JOIN class_schedules b ON b.course_offering_id=cb.id AND b.day_of_week=a.day_of_week AND a.start_time<b.end_time AND a.end_time>b.start_time
      WHERE a.course_offering_id=? AND sa.start_date<=sb.end_date AND sa.end_date>=sb.start_date LIMIT 1`,[teacherId,offeringId])).length>0;
  }
  router.put('/admin/school/subjects/:id/teacher',async(req,res)=>{
    const id=schoolId(Number(req.params.id)),teacherId=schoolId(req.body.teacher_id);
    await mutate(pool,req.body.revision,async c=>{
      const [teacher]=await rows(c,'SELECT name FROM school_teachers WHERE id=? AND is_active=1',[teacherId]);
      if(!teacher)throw new ScheduleError(400,'Choose an active teacher.');
      if(!(await rows(c,'SELECT offering_id FROM school_class_offerings WHERE offering_id=?',[id])).length)throw new ScheduleError(404,'Class subject not found.');
      if(await teacherConflict(c,id,teacherId))throw new ScheduleError(409,'This teacher already has a class at that time.');
      await c.execute('INSERT INTO school_offering_teachers(offering_id,teacher_id) VALUES(?,?) ON DUPLICATE KEY UPDATE teacher_id=VALUES(teacher_id)',[id,teacherId]);
      await c.execute('UPDATE course_offerings SET professor=? WHERE id=?',[teacher.name,id]);
    });res.json({message:'Subject teacher assigned.'});
  });
  router.post('/admin/school/subjects',async(req,res)=>{
    const classId=schoolId(req.body?.class_id),offeringId=req.body?.offering_id===undefined?undefined:schoolId(req.body.offering_id);
    const id=await mutate(pool,req.body.revision,async c=>{
      let id=offeringId;
      if(!id){const courseId=schoolId(req.body.course_id),termId=schoolId(req.body.semester_id),teacher=typeof req.body.teacher==='string'?req.body.teacher.trim():'';
        if(teacher.length>150)throw new ScheduleError(400,'Teacher name must be at most 150 characters.');
        if(!(await rows(c,'SELECT id FROM courses WHERE id=?',[courseId])).length)throw new ScheduleError(404,'Catalog subject not found.');
        const [r]=await c.execute<ResultSetHeader>('INSERT INTO course_offerings(course_id,semester_id,major,professor,section) VALUES(?,?,NULL,?,?)',[courseId,termId,teacher||null,'A']);id=r.insertId;}
      await linkSubject(c,classId,id);
      if(req.body.teacher_id!==undefined){
        const teacherId=schoolId(req.body.teacher_id),cl=await schoolClass(c,classId);
        const [offering]=await rows(c,'SELECT course_id FROM course_offerings WHERE id=?',[id]);
        if(!(await rows(c,'SELECT course_id FROM school_grade_subjects WHERE year_id=? AND grade_label=? AND course_id=?',[cl.year_id,cl.grade_label,offering.course_id])).length)throw new ScheduleError(400,'Add this subject to the selected grade library first.');
        const [teacher]=await rows(c,'SELECT name FROM school_teachers WHERE id=? AND is_active=1',[teacherId]);
        if(!teacher)throw new ScheduleError(400,'Choose an active teacher.');
        if(await teacherConflict(c,id,teacherId))throw new ScheduleError(409,'This teacher already has a class at that time.');
        await c.execute('INSERT INTO school_offering_teachers(offering_id,teacher_id) VALUES(?,?)',[id,teacherId]);
        await c.execute('UPDATE course_offerings SET professor=? WHERE id=?',[teacher.name,id]);
      }
      return id;
    });res.status(201).json({id,message:'Subject explicitly linked to class. Legacy records retained.'});
  });
  router.delete('/admin/school/classes/:classId/subjects/:id',async(req,res)=>{
    const classId=schoolId(Number(req.params.classId)),id=schoolId(Number(req.params.id));
    await mutate(pool,req.body?.revision,async c=>{const [r]=await c.execute<ResultSetHeader>('DELETE FROM school_class_offerings WHERE class_id=? AND offering_id=?',[classId,id]);if(!r.affectedRows)throw new ScheduleError(404,'Class subject link not found.');});
    res.json({message:'Class link removed. Original subject and meetings retained.'});
  });

  // School-mode schedule edits use class links, not the legacy major label.
  // They are serialised with mapping and membership writes by the same lock.
  async function saveMeeting(input:any,id?:number) {
    const value=validateMeeting({...input,location:input.location === '' || input.location === undefined ? 'Not specified' : input.location});
    return mutate(pool,input.revision,async c=>{
      if(!(await rows(c,'SELECT class_id FROM school_class_offerings WHERE offering_id=?',[value.course_offering_id])).length)throw new ScheduleError(400,'Link the subject to a school class before scheduling it.');
      if(id){const [old]=await rows(c,'SELECT course_offering_id FROM class_schedules WHERE id=?',[id]);if(!old)throw new ScheduleError(404,'Meeting not found.');if(old.course_offering_id!==value.course_offering_id)throw new ScheduleError(400,'Keep the original subject when editing.');}
      const clashes=await rows(c,`SELECT b.id FROM school_class_offerings a JOIN school_class_offerings other ON other.class_id=a.class_id JOIN course_offerings ca ON ca.id=a.offering_id JOIN course_offerings cb ON cb.id=other.offering_id JOIN semesters sa ON sa.id=ca.semester_id JOIN semesters sb ON sb.id=cb.semester_id JOIN class_schedules b ON b.course_offering_id=cb.id WHERE a.offering_id=? AND b.day_of_week=? AND b.start_time<? AND b.end_time>? AND b.id<>? AND sa.start_date<=sb.end_date AND sa.end_date>=sb.start_date LIMIT 1`,[value.course_offering_id,value.day_of_week,value.end_time,value.start_time,id??0]);
      const teacherClashes=await rows(c,`SELECT b.id FROM school_offering_teachers a JOIN school_offering_teachers other ON other.teacher_id=a.teacher_id
        JOIN course_offerings ca ON ca.id=a.offering_id JOIN course_offerings cb ON cb.id=other.offering_id
        JOIN semesters sa ON sa.id=ca.semester_id JOIN semesters sb ON sb.id=cb.semester_id
        JOIN class_schedules b ON b.course_offering_id=cb.id
        WHERE a.offering_id=? AND b.day_of_week=? AND b.start_time<? AND b.end_time>? AND b.id<>?
        AND sa.start_date<=sb.end_date AND sa.end_date>=sb.start_date LIMIT 1`,[value.course_offering_id,value.day_of_week,value.end_time,value.start_time,id??0]);
      if(teacherClashes.length)throw new ScheduleError(409,'This teacher already has a class at that time.');
      if(clashes.length)throw new ScheduleError(409,'Another subject for this class overlaps that time.');
      if(id){await c.execute('UPDATE class_schedules SET day_of_week=?,start_time=?,end_time=?,location=? WHERE id=?',[value.day_of_week,value.start_time,value.end_time,value.location,id]);return id;}
      const [r]=await c.execute<ResultSetHeader>('INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time,location) VALUES(?,?,?,?,?)',[value.course_offering_id,value.day_of_week,value.start_time,value.end_time,value.location]);return r.insertId;
    });
  }
  router.post('/admin/school/schedules',async(req,res)=>res.status(201).json({id:await saveMeeting(req.body),message:'School class meeting saved.'}));
  router.put('/admin/school/schedules/:id',async(req,res)=>res.json({id:await saveMeeting(req.body,schoolId(Number(req.params.id))),message:'School class meeting updated.'}));
  router.delete('/admin/school/schedules/:id',async(req,res)=>{
    const id=schoolId(Number(req.params.id));
    await mutate(pool,req.body?.revision,async c=>{const [r]=await c.execute<ResultSetHeader>('DELETE FROM class_schedules WHERE id=?',[id]);if(!r.affectedRows)throw new ScheduleError(404,'Meeting not found.');});res.json({message:'Meeting removed.'});
  });

  router.get('/student/school',async(_req,res)=>{
    if(res.locals.user.role!=='student')throw new ScheduleError(403,'Students only.');
    const school=await profile(pool),date=today();
    const memberships=school?await rows(pool,`SELECT m.id,m.year_id,m.class_id,${mDates},cl.grade_label,cl.name class_name,y.name year_name,${yDates} ${membershipJoin}` ,scope(res.locals.user.id,date)):[];
    const membership=memberships[0]??null;
    let room:RowDataPacket|null=null,homeroomTeacher:RowDataPacket|null=null,homeroomStatus='unassigned';let lessons:RowDataPacket[]=[];
    if(membership){
      room=(await rows(pool,'SELECT r.id,r.room_number,r.name FROM school_class_rooms cr JOIN school_rooms r ON r.id=cr.room_id WHERE cr.class_id=? AND cr.year_id=?',[membership.class_id,membership.year_id]))[0]??null;
      const first=await rows(pool,`SELECT DISTINCT t.id,t.name,t.staff_code,t.is_active FROM school_class_offerings l JOIN course_offerings co ON co.id=l.offering_id JOIN school_terms st ON st.semester_id=co.semester_id AND st.year_id=? JOIN semesters s ON s.id=co.semester_id JOIN class_schedules cs ON cs.course_offering_id=co.id LEFT JOIN school_offering_teachers ot ON ot.offering_id=co.id LEFT JOIN school_teachers t ON t.id=ot.teacher_id WHERE l.class_id=? AND s.start_date<=? AND s.end_date>=? AND cs.day_of_week=7 AND cs.start_time='10:00:00'`,[membership.year_id,membership.class_id,date,date]);
      if(first.length===1&&first[0].id&&first[0].is_active){homeroomTeacher={id:first[0].id,name:first[0].name,staff_code:first[0].staff_code} as RowDataPacket;homeroomStatus='assigned'}
      else if(first.length>1)homeroomStatus='needs_review';
      else if(first[0]?.id)homeroomStatus='inactive';
      const weekday=new Date(date+'T00:00:00Z').getUTCDay()||7;
      lessons=await rows(pool,`SELECT cs.id,TIME_FORMAT(cs.start_time,'%H:%i') start_time,TIME_FORMAT(cs.end_time,'%H:%i') end_time,cs.location,c.course_name,c.course_code,COALESCE(t.name,co.professor) teacher_name FROM class_schedules cs JOIN course_offerings co ON co.id=cs.course_offering_id JOIN courses c ON c.id=co.course_id JOIN semesters s ON s.id=co.semester_id LEFT JOIN school_offering_teachers ot ON ot.offering_id=co.id LEFT JOIN school_teachers t ON t.id=ot.teacher_id WHERE ${activeOffering} AND s.start_date<=? AND s.end_date>=? AND cs.day_of_week=? ORDER BY cs.start_time,cs.id`,[...scope(res.locals.user.id,date),date,date,weekday]);
    }
    res.json({school,today:date,membership,room,homeroom_teacher:homeroomTeacher,homeroom_status:homeroomStatus,lessons});
  });
  for(const route of ['courses','schedule','semesters'] as const){
    router.get('/student/'+route,async(_req,res,next)=>{
      if(res.locals.user.role!=='student')throw new ScheduleError(403,'Students only.');
      if(!await profile(pool)){next();return;}
      const values=scope(res.locals.user.id,today());let result:RowDataPacket[];
      if(route==='courses')result=await rows(pool,`SELECT c.id,c.course_code,c.course_name,c.credits,co.id offering_id,co.semester_id,co.professor,co.section,NULL major FROM course_offerings co JOIN courses c ON c.id=co.course_id WHERE ${activeOffering} ORDER BY c.course_code`,values);
      else if(route==='schedule')result=await rows(pool,`SELECT cs.*,co.semester_id,co.professor,co.section,NULL major,c.course_code,c.course_name,s.name semester_name,s.academic_year FROM class_schedules cs JOIN course_offerings co ON co.id=cs.course_offering_id JOIN courses c ON c.id=co.course_id JOIN semesters s ON s.id=co.semester_id WHERE ${activeOffering} ORDER BY cs.day_of_week,cs.start_time,cs.id`,values);
      else result=await rows(pool,`SELECT DISTINCT s.id,s.name,s.academic_year,DATE_FORMAT(s.start_date,'%Y-%m-%d') start_date,DATE_FORMAT(s.end_date,'%Y-%m-%d') end_date FROM school_terms st JOIN semesters s ON s.id=st.semester_id JOIN school_classes cl ON cl.year_id=st.year_id JOIN school_memberships m ON m.class_id=cl.id JOIN school_years y ON y.id=cl.year_id WHERE m.student_user_id=? AND m.starts_on<=? AND (m.ends_on IS NULL OR m.ends_on>?) AND y.start_date<=? AND y.end_date>=? ORDER BY start_date DESC`,values);
      res.json({[route==='schedule'?'schedules':route]:result,school_mode:true});
    });
  }
  // Do not let legacy academic writers change mapped records behind the new
  // validation path. Original data remains readable for explicit mapping.
  router.use('/admin',async(req,res,next)=>{
    if(['GET','HEAD','OPTIONS'].includes(req.method)||!await profile(pool)){next();return;}
    if(/^\/(schedules|course-assignments|course-offerings|semesters|semester-assignments|enrollments)(\/|$)/.test(req.path)){
      res.status(409).json({message:'School mode is enabled. Use School classes to manage school subjects, terms and meetings; legacy records are preserved.'});return;
    }
    next();
  });
  return router;
}

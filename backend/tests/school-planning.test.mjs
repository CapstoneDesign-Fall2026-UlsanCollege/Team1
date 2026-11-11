import {structuredStudentLogin} from '../dist/student-identities.js';
import {attendanceTotals,ensureTeacherSchema} from '../dist/teacher-workspace.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import {randomBytes} from 'node:crypto';
import {createDatabaseApp} from '../dist/database-app.js';
import {canteenMenuSchema} from '../dist/canteen-menu.js';
import {resetSchema} from '../dist/password-resets.js';
import {favouritesSchema} from '../dist/job-favourites.js';
import {ensureActivitySchema} from '../dist/activity-log.js';
import {ensureSchoolSchema} from '../dist/school-schema.js';
import {bookingDatesMeet} from '../dist/school-rooms.js';
import {schoolDate,schoolDates,schoolId,schoolText} from '../dist/school-planning.js';

test('structured student identity validates admission details and pads the eight-digit login',()=>{
 assert.equal(structuredStudentLogin('2026-04-15','6','A','61'),'26061061');
 assert.equal(structuredStudentLogin('2024-04-15','12','i','999'),'24129999');
 for(const args of [['2026-02-30','6','A','1'],['2026-04-15','0','A','1'],['2026-04-15','13','A','1'],['2026-04-15','6','J','1'],['2026-04-15','6','A','000'],['2026-04-15','6','A','1000']])assert.throws(()=>structuredStudentLogin(...args));
});

test('monthly attendance retains raw marks and converts each three late marks into one absence',()=>{
 assert.deepEqual(attendanceTotals(['present','absent','late','late','late','excused'],8),{present:1,absent:1,late:3,excused:1,marked:6,unmarked:2,lateAbsences:1,adjustedAbsences:2,remainingLates:0});
 for(const late of [0,1,2,3,4,5,6,7]){const t=attendanceTotals(['absent',...Array(late).fill('late')],late+1);assert.equal(t.adjustedAbsences,1+Math.floor(late/3));assert.equal(t.remainingLates,late%3);assert.equal(t.late,late)}
 assert.equal(attendanceTotals([],31).adjustedAbsences,0);
});

test('room recurrence overlap checks actual weekdays and date-range boundaries',()=>{
 const a={starts_on:'2026-11-01',ends_on:'2026-11-30',day_of_week:7};
 assert.equal(bookingDatesMeet(a,{starts_on:'2026-11-08',ends_on:'2026-11-08',day_of_week:7}),true);
 assert.equal(bookingDatesMeet(a,{starts_on:'2026-11-02',ends_on:'2026-11-07',day_of_week:7}),false);
 assert.equal(bookingDatesMeet(a,{...a,day_of_week:1}),false);
 assert.equal(bookingDatesMeet(a,{starts_on:'2026-12-06',ends_on:'2026-12-06',day_of_week:7}),false);
});

test('school dates follow Nepal midnight rather than the server or Korea timezone',()=>{
  assert.equal(schoolDate(new Date('2026-11-01T17:00:00Z')),'2026-11-01');
  assert.equal(schoolDate(new Date('2026-11-01T18:15:00Z')),'2026-11-02');
});

test('school planning rejects invalid dates, identifiers and blank labels',()=>{
  for(const id of [0,-1,1.1,'1',null,NaN])assert.throws(()=>schoolId(id));
  for(const name of ['','  ',null,'a'.repeat(31)])assert.throws(()=>schoolText(name,30,'a grade'));
  assert.equal(schoolText(' Grade 2 ',30,'a grade'),'Grade 2');
  for(const [a,b] of [['2026-02-30','2026-03-01'],['2026-12-31','2026-01-01'],['x','x']])assert.throws(()=>schoolDates(a,b));
});

test('isolated MySQL school structure, mapping and student scope',{skip:process.env.RUN_SCHOOL_DB_TESTS!=='1'},async t=>{
  // Explicit opt-in. Credentials are supplied by the invoking environment;
  // no application DB_NAME is used and no real users or academic rows are touched.
  const config={host:process.env.DB_HOST??'127.0.0.1',port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD};
  const db='studenthub_school_test_'+randomBytes(6).toString('hex');assert.match(db,/^studenthub_school_test_[a-f0-9]{12}$/);
  const root=await mysql.createConnection(config);let pool,server,today='2026-11-01';const cookies={};
  const fixturePassword='school-fixture-only';
  async function sql(statement,values=[]){return (await pool.execute(statement,values))[0];}
  function request(path,method='GET',body,role='admin'){
    return fetch('http://127.0.0.1:'+server.address().port+'/api'+path,{method,headers:{Cookie:cookies[role]??'','X-StudentHub':'1','Content-Type':'application/json'},...(body===undefined||method==='GET'?{}:{body:JSON.stringify(body)})});
  }
  async function data(path,role='admin'){const r=await request(path,'GET',undefined,role);const body=await r.json();assert.equal(r.status,200,JSON.stringify(body));return body;}
  async function mutate(path,method,body,status=200){const revision=(await data('/admin/school')).revision;const r=await request(path,method,{...body,revision});const result=await r.json();assert.equal(r.status,status,JSON.stringify(result));return result;}
  try{
    await root.query('CREATE DATABASE `'+db+'`');pool=mysql.createPool({...config,database:db,connectionLimit:6});
    for(const statement of [
      "CREATE TABLE users(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,login_id VARCHAR(50) UNIQUE,password_hash VARCHAR(255),role ENUM('admin','student','canteen_head'),is_active TINYINT DEFAULT 1)",
      'CREATE TABLE student_profiles(user_id INT UNSIGNED PRIMARY KEY,full_name VARCHAR(150),university VARCHAR(150),major VARCHAR(150),year_of_study INT,email VARCHAR(254),phone_number VARCHAR(30),address VARCHAR(500))',
      'CREATE TABLE semesters(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100),academic_year INT,start_date DATE,end_date DATE)',
      'CREATE TABLE courses(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,course_code VARCHAR(50) UNIQUE,course_name VARCHAR(150),credits INT)',
      'CREATE TABLE course_offerings(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,course_id INT UNSIGNED,semester_id INT UNSIGNED,major VARCHAR(150),professor VARCHAR(150),section VARCHAR(10),UNIQUE KEY(course_id,semester_id,major,section),FOREIGN KEY(semester_id) REFERENCES semesters(id),FOREIGN KEY(course_id) REFERENCES courses(id))',
      'CREATE TABLE student_semesters(student_user_id INT UNSIGNED,semester_id INT UNSIGNED)',
      'CREATE TABLE class_schedules(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,course_offering_id INT UNSIGNED,day_of_week INT,start_time TIME,end_time TIME,location VARCHAR(150))',
      'CREATE TABLE enrollments(student_user_id INT UNSIGNED,course_offering_id INT UNSIGNED,PRIMARY KEY(student_user_id,course_offering_id))',
      canteenMenuSchema,resetSchema,favouritesSchema,
    ])await sql(statement);
    const hash=await bcrypt.hash(fixturePassword,4);
    for(const [id,login,role]of[[1,'admin','admin'],[2,'alice','student'],[3,'bob','student'],[4,'canteen','canteen_head'],[5,'unmapped','student']])await sql('INSERT INTO users VALUES(?,?,?,?,1)',[id,login,hash,role]);
    await sql("INSERT INTO student_profiles(user_id,full_name,university,major) VALUES(2,'Fictional Alice','Legacy college','Legacy A'),(3,'Fictional Bob','Legacy college','Legacy A'),(5,'Fictional Unmapped','Legacy college','Legacy A')");
    await sql("INSERT INTO semesters VALUES(1,'Legacy Fall',2026,'2026-09-01','2026-12-31'),(2,'Outside year',2028,'2028-03-01','2028-06-30')");
    await sql("INSERT INTO courses VALUES(1,'MATH','Fictional Math',3),(2,'SCI','Fictional Science',3),(3,'ENG','Fictional English',3)");
    await sql("INSERT INTO course_offerings VALUES(1,1,1,'Legacy A','Legacy Teacher A','A'),(2,2,1,'Legacy B','Legacy Teacher B','A'),(3,3,2,'Legacy A','Legacy Teacher A','A')");
    await sql('INSERT INTO student_semesters VALUES(2,1),(3,1),(5,1)');
    await sql("INSERT INTO class_schedules VALUES(1,1,1,'09:00','10:00','Legacy location'),(2,2,1,'09:00','10:00','Other location')");
    const before=JSON.stringify({users:await sql('SELECT * FROM users ORDER BY id'),profiles:await sql('SELECT * FROM student_profiles ORDER BY user_id'),offerings:await sql('SELECT * FROM course_offerings ORDER BY id')});
    await ensureSchoolSchema(pool);await ensureSchoolSchema(pool);await ensureTeacherSchema(pool);await ensureTeacherSchema(pool);
    assert.equal(JSON.stringify({users:await sql('SELECT * FROM users ORDER BY id'),profiles:await sql('SELECT * FROM student_profiles ORDER BY user_id'),offerings:await sql('SELECT * FROM course_offerings ORDER BY id')}),before);
    function app(){return createDatabaseApp(pool,{today:()=>today,jobs:async page=>({jobs:[],total:0,page,pageSize:30,fetchedAt:new Date().toISOString()})});}
    server=app().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
    async function login(){for(const role of ['admin','alice','bob','canteen','unmapped']){const r=await request('/auth/login','POST',{login_id:role,password:fixturePassword},null);assert.equal(r.status,200);cookies[role]=r.headers.get('set-cookie').split(';')[0];}}
    await login();
    let yearId,nextYear,classA,classB,nextClass;
    await t.test('every visible workspace read endpoint is wired through the production app factory',async()=>{
      const endpoints={
        admin:['/auth/me','/admin/school','/admin/school/summary','/admin/students','/admin/semesters','/admin/semesters/1','/admin/courses','/admin/course-assignments','/admin/majors','/admin/schedules','/admin/canteen-accounts','/admin/password-reset-requests'],
        alice:['/auth/me','/student/profile','/student/semesters','/student/courses','/student/schedule','/student/school','/student/jobs?page=1','/student/job-favourites','/student/canteen'],
        canteen:['/canteen/home','/canteen/menu?date=2026-11-01'],
      };
      for(const [role,paths]of Object.entries(endpoints))for(const path of paths){const response=await request(path,'GET',undefined,role);const body=await response.json();assert.equal(response.status,200,role+' '+path+': '+JSON.stringify(body));}
    });
    await t.test('legacy records remain readable before explicit school-mode activation',async()=>{
      assert.equal((await data('/student/courses','alice')).courses[0].course_code,'MATH');
      assert.equal((await data('/student/school','alice')).school,null);
      assert.equal((await request('/admin/school','GET',undefined,null)).status,401);
      for(const role of ['alice','canteen'])for(const method of ['GET','POST'])assert.equal((await request('/admin/school/years',method,{},role)).status,403);
    });
    await t.test('explicit school setup and years preserve records and reject invalid overlap',async()=>{
      await mutate('/admin/school/profile','PUT',{name:'Fictional School',level:'middle',confirm_school_mode:true});
      assert.equal((await data('/student/courses','alice')).courses.length,0);
      assert.equal((await data('/student/semesters','alice')).semesters.length,0);
      assert.deepEqual((await data('/admin/school/summary')).counts,{students:3,classes:0,unassigned:3});
      for(const role of ['alice','canteen'])assert.equal((await request('/admin/school/summary','GET',undefined,role)).status,403);
      yearId=(await mutate('/admin/school/years','POST',{name:'2026–27',start_date:'2026-03-01',end_date:'2027-02-28'},201)).id;
      await mutate('/admin/school/years','POST',{name:'Overlap',start_date:'2027-01-01',end_date:'2027-12-31'},409);
      await mutate('/admin/school/years','POST',{name:'Bad',start_date:'2026-02-30',end_date:'2026-12-31'},400);
      nextYear=(await mutate('/admin/school/years','POST',{name:'2027–28',start_date:'2027-03-01',end_date:'2028-02-29'},201)).id;
      await mutate('/admin/school/years/'+yearId,'PUT',{name:'2026–27 reviewed',start_date:'2026-03-01',end_date:'2027-02-28'});
      await mutate('/admin/school/profile','PUT',{name:'Fictional School',level:'high',confirm_school_mode:true},409);
    });
    await t.test('same class label works across grades and years, not within the same grade/year',async()=>{
      const body={year_id:yearId,grade_label:'1',name:'A',is_active:true};
      classA=(await mutate('/admin/school/classes','POST',body,201)).id;
      classB=(await mutate('/admin/school/classes','POST',{...body,grade_label:'2'},201)).id;
      nextClass=(await mutate('/admin/school/classes','POST',{...body,year_id:nextYear},201)).id;
      await mutate('/admin/school/classes','POST',body,409);
      await mutate('/admin/school/classes/'+classB,'PUT',{...body,grade_label:'2',name:'B'});
      await mutate('/admin/school/classes/'+classB,'PUT',{...body,year_id:nextYear,grade_label:'2'},400);
    });
    await t.test('terms and legacy subjects require explicit valid school mapping',async()=>{
      await mutate('/admin/school/subjects','POST',{class_id:classA,offering_id:1},400);
      await mutate('/admin/school/terms','POST',{year_id:yearId,semester_id:2},400);
      await mutate('/admin/school/terms','POST',{year_id:yearId,semester_id:1},201);
      await mutate('/admin/school/terms','POST',{year_id:yearId,name:'School Spring',start_date:'2026-03-01',end_date:'2026-07-31'},201);
      await mutate('/admin/school/subjects','POST',{class_id:classA,offering_id:1},201);
      await mutate('/admin/school/subjects','POST',{class_id:classB,offering_id:2},201);
      await mutate('/admin/school/subjects','POST',{class_id:classA,offering_id:2},409);
      await mutate('/admin/school/subjects','POST',{class_id:classA,offering_id:1},409);
      await mutate('/admin/school/years/'+yearId,'PUT',{name:'2026–27 revised',start_date:'2026-03-01',end_date:'2026-10-01'},409);
      assert.equal((await sql('SELECT major FROM course_offerings WHERE id=1'))[0].major,'Legacy A');
    });
    await t.test('student academic scope follows explicit class membership, not legacy major or forged IDs',async()=>{
      await mutate('/admin/school/students/2/membership','PUT',{year_id:yearId,class_id:classA,starts_on:'2026-09-01'});
      await mutate('/admin/school/students/3/membership','PUT',{year_id:yearId,class_id:classB,starts_on:'2026-09-01'});
      const summary=await data('/admin/school/summary');assert.deepEqual(summary.counts,{students:3,classes:2,unassigned:1});assert.equal(summary.current_year.id,yearId);
      assert.equal((await data('/student/courses','bob')).courses[0].course_code,'SCI');
      assert.equal((await data('/student/courses?student_id=3&class_id='+classB,'alice')).courses[0].course_code,'MATH');
      assert.equal((await data('/student/schedule','bob')).schedules[0].location,'Other location');
      assert.equal((await data('/student/courses','unmapped')).courses.length,0);
      const own=await data('/student/school?student_id=3','alice');assert.equal(own.membership.class_id,classA);assert.equal(own.school.name,'Fictional School');
      assert.ok(!JSON.stringify(own).includes('Fictional Bob'));
      assert.equal((await request('/student/school','GET',undefined,'canteen')).status,403);
      assert.equal((await request('/admin/course-assignments','POST',{})).status,409);
      assert.equal((await request('/admin/schedules','POST',{})).status,409);
      assert.equal((await request('/admin/semester-assignments','POST',{})).status,409);
    });
    await t.test('dated transfer and ending membership preserve history with no major fallback',async()=>{
      await mutate('/admin/school/students/2/membership','PUT',{year_id:yearId,class_id:classB,starts_on:'2026-11-02'});
      assert.equal((await data('/student/school','alice')).membership.class_id,classA);
      today='2026-11-02';assert.equal((await data('/student/courses','alice')).courses[0].course_code,'SCI');
      await mutate('/admin/school/students/2/membership','PUT',{year_id:yearId,class_id:classA,starts_on:'2026-10-01'},409);
      await mutate('/admin/school/students/2/membership','PUT',{year_id:yearId,class_id:null,starts_on:'2026-11-03'});
      today='2026-11-03';assert.equal((await data('/student/courses','alice')).courses.length,0);
      assert.equal((await data('/student/school','alice')).membership,null);
      const history=(await data('/admin/school/students?search=alice')).memberships;assert.equal(history.length,2);assert.ok(history.every(m=>m.ends_on));
      await mutate('/admin/school/students/2/membership','PUT',{year_id:nextYear,class_id:nextClass,starts_on:'2027-03-01'});
      today='2027-03-01';assert.equal((await data('/student/school','alice')).membership.year_id,nextYear);
      assert.equal((await sql('SELECT COUNT(*) total FROM school_memberships WHERE student_user_id=2'))[0].total,3);
      today='2026-11-03';
    });
    await t.test('new school subjects and meetings use class conflicts and adjacent boundaries',async()=>{
      const subject=(await mutate('/admin/school/subjects','POST',{class_id:classB,course_id:3,semester_id:1,teacher:'Fictional Teacher'},201)).id;
      const meeting={course_offering_id:subject,day_of_week:1,start_time:'09:30',end_time:'10:30',location:'School location'};
      await mutate('/admin/school/schedules','POST',meeting,409);
      const saved=(await mutate('/admin/school/schedules','POST',{...meeting,start_time:'10:00',end_time:'11:00'},201)).id;
      await mutate('/admin/school/schedules/'+saved,'PUT',{...meeting,start_time:'11:00',end_time:'12:00'});
      assert.equal((await data('/student/courses','bob')).courses.length,2);
      await mutate('/admin/school/schedules/'+saved,'DELETE',{});
      assert.equal((await sql('SELECT major FROM course_offerings WHERE id=?',[subject]))[0].major,null);
    });
    await t.test('concurrent membership changes require a fresh revision and keep one open record',async()=>{
      const revision=(await data('/admin/school')).revision;
      const responses=await Promise.all([request('/admin/school/students/5/membership','PUT',{revision,year_id:yearId,class_id:classA,starts_on:today}),request('/admin/school/students/5/membership','PUT',{revision,year_id:yearId,class_id:classB,starts_on:today})]);
      assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
      assert.equal((await sql('SELECT COUNT(*) total FROM school_memberships WHERE student_user_id=5 AND year_id=? AND ends_on IS NULL',[yearId]))[0].total,1);
      await assert.rejects(()=>sql('INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(5,?,?,?)',[yearId,classA,today]),e=>e.code==='ER_DUP_ENTRY');
    });
    await t.test('data survives restart and users/profile credentials stay unchanged',async()=>{
      server.closeAllConnections();await new Promise(r=>server.close(r));server=app().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));await login();
      assert.equal((await data('/student/school','bob')).membership.class_id,classB);
      assert.equal((await data('/student/courses','bob')).courses.length,2);
      assert.equal(JSON.stringify({users:await sql('SELECT * FROM users ORDER BY id'),profiles:await sql('SELECT * FROM student_profiles ORDER BY user_id'),offerings:await sql('SELECT * FROM course_offerings WHERE id<=3 ORDER BY id')}),before);
    });
    await t.test('grade library, stable teachers and timetable drops reject duplicate, stale and cross-class clashes',async()=>{
      const teacher=(await mutate('/admin/school/teachers','POST',{name:'Fictional Planner Teacher',staff_code:'PLANNER-01'},201)).id;
      const other=(await mutate('/admin/school/teachers','POST',{name:'Fictional Other Teacher',staff_code:'PLANNER-02'},201)).id;
      await mutate('/admin/school/teachers','POST',{name:'Duplicate code',staff_code:'PLANNER-01'},409);
      const course=(await mutate('/admin/school/grade-subjects','POST',{year_id:yearId,grade_label:'1',course_code:'PLAN-MUSIC',course_name:'Fictional Music'},201)).id;
      await mutate('/admin/school/grade-subjects','POST',{year_id:yearId,grade_label:'1',course_id:course},409);
      await mutate('/admin/school/subjects','POST',{class_id:classB,course_id:course,semester_id:1,teacher_id:teacher},400);
      await mutate('/admin/school/grade-subjects','POST',{year_id:yearId,grade_label:'2',course_id:course},201);
      const a=(await mutate('/admin/school/subjects','POST',{class_id:classA,course_id:course,semester_id:1,teacher_id:teacher},201)).id;
      const b=(await mutate('/admin/school/subjects','POST',{class_id:classB,course_id:course,semester_id:1,teacher_id:teacher},201)).id;
      const meeting={course_offering_id:a,day_of_week:2,start_time:'10:00',end_time:'11:00',location:''};
      const saved=(await mutate('/admin/school/schedules','POST',meeting,201)).id;
      await mutate('/admin/school/schedules','POST',{...meeting,course_offering_id:b},409);
      await mutate('/admin/school/subjects/'+b+'/teacher','PUT',{teacher_id:other});
      const second=(await mutate('/admin/school/schedules','POST',{...meeting,course_offering_id:b},201)).id;
      await mutate('/admin/school/subjects/'+b+'/teacher','PUT',{teacher_id:teacher},409);
      await mutate('/admin/school/schedules/'+saved,'PUT',{...meeting,start_time:'11:00',end_time:'12:00'});
      await mutate('/admin/school/subjects/'+b+'/teacher','PUT',{teacher_id:teacher});
      await mutate('/admin/school/schedules/'+second,'PUT',{...meeting,course_offering_id:b,start_time:'11:00',end_time:'12:00'},409);
      assert.equal((await sql("SELECT TIME_FORMAT(start_time,'%H:%i') start_time FROM class_schedules WHERE id=?",[second]))[0].start_time,'10:00');
      const revision=(await data('/admin/school')).revision;
      await mutate('/admin/school/teachers','POST',{name:'Another Teacher',staff_code:'PLANNER-03'},201);
      assert.equal((await request('/admin/school/schedules/'+saved,'PUT',{...meeting,revision})).status,409);
      for(const role of ['alice','canteen'])for(const path of ['/admin/school/teachers','/admin/school/grade-subjects','/admin/school/subjects'])assert.equal((await request(path,'POST',{revision},role)).status,403);
      const state=await data('/admin/school');assert.equal(state.teachers.length,3);assert.equal(state.grade_subjects.filter(g=>g.course_id===course).length,2);
      await mutate('/admin/school/schedules/'+second,'DELETE',{});
      await mutate('/admin/school/classes/'+classB+'/subjects/'+b,'DELETE',{});
      assert.ok(!(await data('/student/courses','bob')).courses.some(c=>c.offering_id===b));
    });
    await t.test('account directory filters grade before limiting and isolates teacher timetable reads',async()=>{
      const query=(grade,extra='')=>'/admin/school/directory?year_id='+yearId+'&grade='+grade+'&date=2026-11-01'+extra;
      const a=await data(query('1'));assert.equal(a.students.length,1);assert.equal(a.students[0].login_id,'alice');assert.equal(a.students[0].grade_label,'1');
      const b=await data(query('2'));assert.equal(b.students.length,1);assert.equal(b.students[0].login_id,'bob');
      assert.equal((await data(query('2','&class_id='+classB))).students[0].class_id,classB);
      assert.equal((await data(query('2','&search=alice'))).students.length,0);
      assert.equal((await data(query('__unassigned'))).students[0].login_id,'unmapped');
      assert.equal((await request(query('1','&class_id='+classB))).status,400);
      assert.equal((await request('/admin/school/directory?year_id='+yearId+'&grade=1&date=2028-01-01')).status,400);
      assert.equal((await request('/admin/school/directory?year_id='+yearId+'&date=2026-11-01')).status,400);
      // More than 100 alphabetically earlier students in a different grade must not hide Alice.
      const hash=(await sql('SELECT password_hash FROM users WHERE id=2'))[0].password_hash;
      const added=[];
      try{for(let n=0;n<101;n++){
        const r=await sql("INSERT INTO users(login_id,password_hash,role,is_active) VALUES(?,?,'student',1)",['directory-fixture-'+n,hash]);added.push(r.insertId);
        await sql("INSERT INTO student_profiles(user_id,full_name,university) VALUES(?,'AAA other grade','Fictional School')",[r.insertId]);
        await sql("INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(?,?,?,'2026-09-01')",[r.insertId,yearId,classB]);
      }assert.equal((await data(query('1'))).students[0].login_id,'alice');}
      finally{for(const id of added){await sql('DELETE FROM school_memberships WHERE student_user_id=?',[id]);await sql('DELETE FROM student_profiles WHERE user_id=?',[id]);await sql('DELETE FROM users WHERE id=?',[id]);}}
      const teacherDirectory=await data('/admin/school/teacher-directory?year_id='+yearId);
      assert.equal(teacherDirectory.teachers.length,3);assert.ok(teacherDirectory.teachers.every(t=>t.staff_code&&!('password_hash'in t)));
      assert.ok(teacherDirectory.assignments.some(a=>a.start_time==='11:00'&&a.class_id===classA));
      assert.ok(teacherDirectory.assignments.every(a=>a.semester_id===1));
      assert.equal((await data('/admin/school/teacher-directory?year_id='+nextYear)).assignments.length,0);
      for(const role of ['bob','canteen',null])for(const path of [query('1'),'/admin/school/teacher-directory?year_id='+yearId])assert.equal((await request(path,'GET',undefined,role)).status,role?403:401);
    });
    await t.test('40-room layout, yearly classroom moves and recurring lab bookings are isolated and conflict-safe',async()=>{
      let board=await data('/admin/school/rooms');assert.equal(board.rooms.length,40);assert.equal(board.rooms.filter(r=>r.kind==='special').length,10);
      assert.deepEqual(board.rooms.filter(r=>r.kind==='special').map(r=>r.id).sort((a,b)=>a-b),[107,108,207,208,307,308,407,408,507,508]);
      await mutate('/admin/school/rooms/107','PUT',{name:'Fictional Physics Lab'});await ensureSchoolSchema(pool);
      assert.equal((await data('/admin/school/rooms')).rooms.find(r=>r.id===107).name,'Fictional Physics Lab');
      await mutate('/admin/school/room-assignments','POST',{class_id:classA,room_id:101},200);
      await mutate('/admin/school/room-assignments','POST',{class_id:classB,room_id:101},409);
      await mutate('/admin/school/room-assignments','POST',{class_id:classA,room_id:102});
      assert.equal((await data('/admin/school/rooms')).assignments.find(a=>a.class_id===classA).room_id,102);
      await mutate('/admin/school/room-assignments','POST',{class_id:nextClass,room_id:102});
      await mutate('/admin/school/room-assignments','POST',{class_id:classB,room_id:107},400);
      const state=await data('/admin/school'),offering=state.subjects.find(s=>s.course_code==='PLAN-MUSIC'&&state.links.some(l=>l.class_id===classA&&l.offering_id===s.id)).id;
      const teacher=state.teachers.find(t=>t.staff_code==='PLANNER-01').id,other=state.teachers.find(t=>t.staff_code==='PLANNER-02').id;
      const booking={room_id:107,class_id:classA,offering_id:offering,teacher_id:teacher,day_of_week:7,start_time:'10:00',end_time:'11:00',starts_on:'2026-11-01',ends_on:'2026-11-30',repeats_weekly:true};
      const saved=(await mutate('/admin/school/room-bookings','POST',booking,201)).id;
      const once={...booking,class_id:classB,offering_id:2,teacher_id:other,starts_on:'2026-11-08',ends_on:'2026-11-08',repeats_weekly:false};
      await mutate('/admin/school/room-bookings','POST',{...once,start_time:'10:30',end_time:'11:30'},409);
      await mutate('/admin/school/room-bookings','POST',{...booking,room_id:108},409);
      await mutate('/admin/school/room-bookings','POST',{...once,room_id:108,teacher_id:teacher},409);
      await mutate('/admin/school/room-bookings','POST',{...once,room_id:108},201);
      await mutate('/admin/school/room-bookings','POST',{...once,start_time:'11:00',end_time:'12:00'},201);
      await mutate('/admin/school/room-bookings','POST',{...once,starts_on:'2026-11-09',ends_on:'2026-11-09'},400);
      await mutate('/admin/school/room-bookings','POST',{...once,ends_on:'2026-11-15'},400);
      await mutate('/admin/school/room-bookings','POST',{...booking,ends_on:'2027-02-01'},400);
      await mutate('/admin/school/room-bookings','POST',{...once,room_id:101},400);
      await mutate('/admin/school/room-bookings','POST',{...once,offering_id:offering},400);
      // Teacher already teaches class A Tuesday 11–12; a booking for B must fail.
      await mutate('/admin/school/room-bookings','POST',{...once,room_id:207,teacher_id:teacher,day_of_week:2,starts_on:'2026-11-03',ends_on:'2026-11-03',start_time:'11:00',end_time:'12:00'},409);
      const revision=(await data('/admin/school')).revision;
      const competing=await Promise.all([request('/admin/school/room-bookings','POST',{...once,revision,starts_on:'2026-12-06',ends_on:'2026-12-06'}),request('/admin/school/room-bookings','POST',{...once,revision,starts_on:'2026-12-06',ends_on:'2026-12-06'})]);assert.deepEqual(competing.map(r=>r.status).sort(),[201,409]);
      await mutate('/admin/school/room-bookings/'+saved+'/cancel','PUT',{});
      assert.equal((await data('/admin/school/rooms')).bookings.find(b=>b.id===saved).is_cancelled,1);
      await mutate('/admin/school/room-bookings','POST',{...booking,ends_on:'2026-11-01',repeats_weekly:false},201);
      await mutate('/admin/school/room-assignments/'+classA,'DELETE',{});
      assert.ok(!(await data('/admin/school/rooms')).assignments.some(a=>a.class_id===classA));
      for(const role of ['alice','canteen',null]){assert.equal((await request('/admin/school/rooms','GET',undefined,role)).status,role?403:401);assert.equal((await request('/admin/school/room-bookings','POST',booking,role)).status,role?403:401);}
    });
    await t.test('#72 same-day save survives read-back, overlap leaves no row, adjacent slot succeeds',async t=>{
      const state=await data('/admin/school');
      const teacher=state.teachers.find(t=>t.staff_code==='PLANNER-02').id;
      const booking={room_id:207,class_id:classB,offering_id:2,teacher_id:teacher,day_of_week:7,start_time:'14:00',end_time:'15:00',starts_on:'2026-11-15',ends_on:'2026-11-15',repeats_weekly:false};
      const count=async()=>Number((await sql('SELECT COUNT(*) total FROM school_room_bookings'))[0].total);
      const before=await count();
      const saved=await mutate('/admin/school/room-bookings','POST',booking,201);
      const readback=(await data('/admin/school/rooms')).bookings.find(b=>b.id===saved.id);
      assert.ok(readback);
      for(const field of ['room_id','class_id','offering_id','teacher_id','day_of_week','start_time','end_time','starts_on','ends_on'])assert.equal(readback[field],booking[field],field);
      assert.equal(readback.repeats_weekly,0);assert.equal(readback.is_cancelled,0);
      assert.equal(await count(),before+1);
      t.diagnostic('VALID: HTTP 201; separate GET matches saved fields; SQL count increased by one. Fixture: '+JSON.stringify(booking));
      const revision=(await data('/admin/school')).revision;
      await mutate('/admin/school/room-bookings','POST',{...booking,start_time:'14:30',end_time:'15:30'},409);
      assert.equal(await count(),before+1);
      assert.equal((await data('/admin/school')).revision,revision);
      assert.deepEqual((await data('/admin/school/rooms')).bookings.find(b=>b.id===saved.id),readback);
      t.diagnostic('CONFLICT: HTTP 409; SQL count unchanged; original GET record and planning revision unchanged.');
      const adjacent=await mutate('/admin/school/room-bookings','POST',{...booking,start_time:'15:00',end_time:'16:00'},201);
      assert.ok((await data('/admin/school/rooms')).bookings.some(b=>b.id===adjacent.id&&b.start_time==='15:00'&&b.end_time==='16:00'));
      assert.equal(await count(),before+2);
      t.diagnostic('BOUNDARY: adjacent 15:00–16:00 returns HTTP 201 and survives separate GET.');
    });
    await t.test('student dashboard scopes homeroom, room and daily lessons to effective membership and active term',async()=>{
      today='2026-11-01';
      const state=await data('/admin/school'),offering=state.subjects.find(s=>s.course_code==='PLAN-MUSIC'&&state.links.some(l=>l.class_id===classA&&l.offering_id===s.id));
      const teacher=state.subject_teachers.find(a=>a.offering_id===offering.id).teacher_id;
      await sql('INSERT INTO school_class_rooms(year_id,class_id,room_id) VALUES(?,?,101)',[yearId,classA]);
      const meeting=(await sql("INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time,location) VALUES(?,7,'10:00','11:00','Room 101')",[offering.id])).insertId;
      const home=await data('/student/school?student_user_id=3','alice');
      assert.equal(home.membership.class_id,classA);assert.equal(home.room.id,101);assert.equal(home.homeroom_teacher.id,teacher);assert.equal(home.homeroom_status,'assigned');assert.ok(home.lessons.some(m=>m.id===meeting));assert.ok(home.lessons.every(m=>m.course_name&&m.start_time));
      assert.ok(!('email'in home.homeroom_teacher));assert.ok(!('password_hash'in home.homeroom_teacher));
      const other=await data('/student/school','bob');assert.equal(other.membership.class_id,classB);assert.ok(!other.lessons.some(m=>m.id===meeting));
      const unassigned=await data('/student/school','unmapped');assert.equal(unassigned.room,null);assert.equal(unassigned.homeroom_teacher,null);assert.deepEqual(unassigned.lessons,[]);
      today='2026-11-02';assert.equal((await data('/student/school','alice')).membership.class_id,classB);assert.equal((await data('/student/school','alice')).homeroom_teacher,null);assert.ok(!(await data('/student/school','alice')).lessons.some(m=>m.id===meeting));today='2026-11-01';
      await sql('UPDATE school_teachers SET is_active=0 WHERE id=?',[teacher]);assert.equal((await data('/student/school','alice')).homeroom_status,'inactive');assert.equal((await data('/student/school','alice')).homeroom_teacher,null);await sql('UPDATE school_teachers SET is_active=1 WHERE id=?',[teacher]);
      const secondTeacher=state.teachers.find(t=>t.id!==teacher).id;
      const extraCourse=(await sql("INSERT INTO courses(course_code,course_name,credits) VALUES('HOME-TEST','Other first lesson',1)")).insertId;
      const extraOffering=(await sql("INSERT INTO course_offerings(course_id,semester_id,section) VALUES(?,1,'A')",[extraCourse])).insertId;
      await sql('INSERT INTO school_class_offerings VALUES(?,?)',[classA,extraOffering]);await sql('INSERT INTO school_offering_teachers VALUES(?,?)',[extraOffering,secondTeacher]);
      const extraMeeting=(await sql("INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time) VALUES(?,7,'10:00','11:00')",[extraOffering])).insertId;
      assert.equal((await data('/student/school','alice')).homeroom_status,'needs_review');assert.equal((await data('/student/school','alice')).homeroom_teacher,null);
      await sql('DELETE FROM class_schedules WHERE id=?',[extraMeeting]);await sql('DELETE FROM school_offering_teachers WHERE offering_id=?',[extraOffering]);await sql('DELETE FROM school_class_offerings WHERE offering_id=?',[extraOffering]);await sql('DELETE FROM course_offerings WHERE id=?',[extraOffering]);await sql('DELETE FROM courses WHERE id=?',[extraCourse]);
      await sql("UPDATE semesters SET end_date='2026-10-31' WHERE id=1");assert.equal((await data('/student/school','alice')).homeroom_teacher,null);assert.deepEqual((await data('/student/school','alice')).lessons,[]);await sql("UPDATE semesters SET end_date='2026-12-31' WHERE id=1");
      await sql('DELETE FROM class_schedules WHERE id=?',[meeting]);await sql('DELETE FROM school_class_rooms WHERE class_id=?',[classA]);
      assert.equal((await data('/student/school','alice')).homeroom_status,'unassigned');
      for(const role of ['admin','canteen',null])assert.equal((await request('/student/school','GET',undefined,role)).status,role?403:401);
    });
    await t.test('school enrollment atomically creates account/profile/membership and supports paged class rosters',async()=>{
      await ensureActivitySchema(pool);
      const payload={login_id:'enrolled_one',password:fixturePassword,full_name:'Fictional Enrolled Student',class_id:classA,starts_on:'2026-11-01',email:'fictional@example.test',role:'admin',university:'Injected college',semester_id:2};
      const created=await mutate('/admin/school/students','POST',payload,201);
      const [user]=await sql('SELECT * FROM users WHERE id=?',[created.student.id]);assert.equal(user.role,'student');assert.ok(await bcrypt.compare(fixturePassword,user.password_hash));
      const [profile]=await sql('SELECT * FROM student_profiles WHERE user_id=?',[user.id]);assert.equal(profile.university,'Fictional School');assert.equal(profile.major,null);assert.equal(profile.year_of_study,null);
      const audit=await sql("SELECT record_type,actor_login FROM activity_logs WHERE action='create' ORDER BY id");assert.deepEqual(audit.map(a=>a.record_type),['users','student_profiles','school_memberships']);assert.ok(audit.every(a=>a.actor_login==='admin'));
      const [membership]=await sql('SELECT * FROM school_memberships WHERE student_user_id=?',[user.id]);assert.equal(membership.class_id,classA);assert.equal(membership.year_id,yearId);
      assert.equal((await sql('SELECT * FROM student_semesters WHERE student_user_id=?',[user.id])).length,0);
      const loginResponse=await request('/auth/login','POST',{login_id:payload.login_id,password:fixturePassword},null);assert.equal(loginResponse.status,200);cookies.enrolled=loginResponse.headers.get('set-cookie').split(';')[0];
      assert.equal((await data('/student/school','enrolled')).membership.class_id,classA);
      assert.ok((await data('/student/courses','enrolled')).courses.length);
      const count=(await sql('SELECT COUNT(*) n FROM users'))[0].n;
      await mutate('/admin/school/students','POST',payload,409);
      await mutate('/admin/school/students','POST',{...payload,login_id:'bad_date',starts_on:'2028-01-01'},400);
      await mutate('/admin/school/students','POST',{...payload,login_id:'bad_class',class_id:999999},404);
      const revision=(await data('/admin/school')).revision;
      assert.equal((await request('/admin/school/students','POST',{...payload,login_id:'stale',revision:revision-1})).status,409);
      assert.equal((await sql('SELECT COUNT(*) n FROM users'))[0].n,count);
      const inactive=(await mutate('/admin/school/classes','POST',{year_id:yearId,grade_label:'9',name:'Inactive',is_active:false},201)).id;
      await mutate('/admin/school/students','POST',{...payload,login_id:'inactive',class_id:inactive},400);
      await pool.query("CREATE TRIGGER enrollment_failure BEFORE INSERT ON school_memberships FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Fixture membership failure'");
      await mutate('/admin/school/students','POST',{...payload,login_id:'must_rollback'},503);
      assert.equal((await sql("SELECT id FROM users WHERE login_id='must_rollback'")).length,0);
      await pool.query('DROP TRIGGER enrollment_failure');
      const rosterPath='/admin/school/classes/'+classA+'/students?date=2026-11-01';
      const existing=(await data(rosterPath)).total;
      for(let n=0;n<105;n++){
        const inserted=await sql("INSERT INTO users(login_id,password_hash,role) VALUES(?,?,'student')",['roster_'+n,user.password_hash]);
        await sql("INSERT INTO student_profiles(user_id,full_name,university) VALUES(?,?,'Fictional School')",[inserted.insertId,'Roster '+String(n).padStart(3,'0')]);
        await sql("INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(?,?,?,'2026-11-01')",[inserted.insertId,yearId,classA]);
      }
      const first=await data(rosterPath+'&page=1'),last=await data(rosterPath+'&page=11');
      assert.equal(first.total,existing+105);assert.equal(first.students.length,10);assert.ok(last.students.length);assert.ok(last.students.every(s=>!first.students.some(a=>a.id===s.id)));
      assert.ok(first.students.every(s=>!('email'in s)&&!('password_hash'in s)));
      for(const role of ['alice','canteen',null]){
        assert.equal((await request('/admin/school/students','POST',{...payload,revision},role)).status,role?403:401);
        assert.equal((await request(rosterPath,'GET',undefined,role)).status,role?403:401);
      }
      for(const query of ['date=2028-01-01','date=2026-02-30','date=2026-11-01&page=0','date=2026-11-01&page=abc'])assert.equal((await request('/admin/school/classes/'+classA+'/students?'+query)).status,400);
    });
    await t.test('teacher accounts, scoped rosters, homework and homeroom attendance',async t=>{
      today='2026-11-01';await ensureActivitySchema(pool);
      const state=await data('/admin/school'),firstTeacher=state.teachers.find(t=>t.staff_code==='PLANNER-01').id,secondTeacher=state.teachers.find(t=>t.staff_code==='PLANNER-02').id;
      const offering=state.subjects.find(s=>s.course_code==='PLAN-MUSIC'&&state.links.some(l=>l.class_id===classA&&l.offering_id===s.id)).id;
      // Fixture uses one active subject assignment and Sunday first lesson for each teacher/class.
      await sql('UPDATE school_offering_teachers SET teacher_id=? WHERE offering_id=2',[secondTeacher]);
      await sql("DELETE FROM class_schedules WHERE day_of_week=7 AND start_time='10:00:00'");
      await sql("INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time) VALUES(?,7,'10:00','11:00'),(2,7,'10:00','11:00')",[offering]);
      const usersBefore=Number((await sql('SELECT COUNT(*) n FROM users'))[0].n);
      const staff={teacher_id:firstTeacher,login_id:'teacher_one',password:'teacher-test-password',role:'admin'};
      const create=await request('/admin/teacher-accounts','POST',staff);assert.equal(create.status,201);const userId=(await create.json()).id;
      const create2=await request('/admin/teacher-accounts','POST',{...staff,teacher_id:secondTeacher,login_id:'teacher_two'});assert.equal(create2.status,201);
      async function signTeacher(login,role){const r=await request('/auth/login','POST',{login_id:login,password:staff.password},null);assert.equal(r.status,200);cookies[role]=r.headers.get('set-cookie').split(';')[0];}
      await signTeacher('teacher_one','teacher');await signTeacher('teacher_two','otherTeacher');
      let homeworkId,version,rosterStudents;
      await t.test('admin links teacher accounts atomically; duplicate link rolls back user insert and every role is isolated',async()=>{
       assert.equal((await sql('SELECT role FROM users WHERE id=?',[userId]))[0].role,'teacher');
       assert.equal((await request('/admin/teacher-accounts','POST',{...staff,login_id:'orphan_attempt'})).status,409);
       assert.equal((await sql("SELECT id FROM users WHERE login_id='orphan_attempt'")).length,0);
       assert.equal(Number((await sql('SELECT COUNT(*) n FROM users'))[0].n),usersBefore+2);
       for(const role of ['alice','canteen','teacher',null])assert.equal((await request('/admin/teacher-accounts','GET',undefined,role)).status,role?403:401);
       for(const role of ['admin','alice','canteen',null])assert.equal((await request('/teacher/dashboard','GET',undefined,role)).status,role?403:401);
       for(const path of ['/admin/school','/student/profile','/canteen/home'])assert.equal((await request(path,'GET',undefined,'teacher')).status,403);
      });
      await t.test('schedule and roster follow linked teacher, effective membership and current term, ignoring forged teacher IDs',async()=>{
       const d=await data('/teacher/dashboard?teacher_id='+secondTeacher,'teacher');
       assert.equal(d.teacher.id,firstTeacher);assert.ok(d.homerooms.some(c=>c.class_id===classA));assert.ok(!d.homerooms.some(c=>c.class_id===classB));
       assert.ok(d.lessons.every(l=>d.assignments.some(a=>a.offering_id===l.course_offering_id)));
       rosterStudents=(await data('/teacher/classes/'+classA+'/students','teacher')).students;
       assert.ok(rosterStudents.length>100);assert.ok(rosterStudents.every(s=>!('email'in s)&&!('password_hash'in s)));
       const forbiddenClass=(await mutate('/admin/school/classes','POST',{year_id:yearId,grade_label:'8',name:'Private',is_active:true},201)).id;
       assert.equal((await request('/teacher/classes/'+forbiddenClass+'/students','GET',undefined,'teacher')).status,403);
       today='2027-02-01';assert.equal((await data('/teacher/dashboard','teacher')).assignments.length,0);today='2026-11-01';
      });
      await t.test('homework persists, scopes student reads, rejects foreign subjects and enforces edit revisions/archive',async()=>{
       const body={class_id:classA,offering_id:offering,title:'Read chapter one',instructions:'Answer questions 1–3.',due_on:'2026-11-04'};
       const r=await request('/teacher/homework','POST',body,'teacher');assert.equal(r.status,201);homeworkId=(await r.json()).id;
       assert.ok((await data('/student/homework?student_user_id=3','alice')).homework.some(h=>h.id===homeworkId));
       assert.ok(!(await data('/student/homework','bob')).homework.some(h=>h.id===homeworkId));
       assert.equal((await request('/teacher/homework','POST',{...body,class_id:classB,offering_id:2},'teacher')).status,403);
       assert.equal((await request('/teacher/homework','POST',{...body,due_on:'2026-02-30'},'teacher')).status,400);
       assert.equal((await request('/teacher/homework','POST',{...body,due_on:'2027-01-01'},'teacher')).status,400);
       const edit={...body,version:1,is_active:false};
       assert.equal((await request('/teacher/homework/'+homeworkId,'PUT',edit,'otherTeacher')).status,403);
       assert.equal((await request('/teacher/homework/'+homeworkId,'PUT',edit,'teacher')).status,200);
       assert.equal((await request('/teacher/homework/'+homeworkId,'PUT',edit,'teacher')).status,409);
       assert.ok(!(await data('/student/homework','alice')).homework.some(h=>h.id===homeworkId));
      });
      await t.test('attendance is homeroom-only, initially unmarked, date/membership validated, atomic and revision protected',async()=>{
       const path='/teacher/classes/'+classA+'/attendance',query=path+'?date=2026-11-01';
       const initial=await data(query,'teacher');version=initial.version;assert.equal(version,0);assert.ok(initial.students.every(s=>s.status===''));
       assert.equal((await request(query,'GET',undefined,'otherTeacher')).status,403);
       assert.equal((await request(path+'?date=2026-11-02','GET',undefined,'teacher')).status,400);
       const body={date:'2026-11-01',version:0,records:[{student_user_id:initial.students[0].id,status:'present'}]};
       const foreign={student_user_id:3,status:'absent'};
       assert.equal((await request(path,'PUT',{...body,records:[...body.records,foreign]},'teacher')).status,400);
       assert.equal((await sql('SELECT * FROM school_attendance WHERE class_id=?',[classA])).length,0);
       assert.equal((await request(path,'PUT',{...body,records:[body.records[0],body.records[0]]},'teacher')).status,400);
       const large={...body,records:initial.students.map(s=>({student_user_id:s.id,status:'present'}))};
       assert.ok(JSON.stringify(large).length>4096);
       assert.equal((await request(path,'PUT',large,'teacher')).status,200);
       const saved=await data(query,'teacher');assert.equal(saved.version,1);assert.ok(saved.students.every(s=>s.status==='present'));
       assert.equal((await request(path,'PUT',{...body,records:[{...body.records[0],status:'absent'}]},'teacher')).status,409);
       assert.ok((await data(query,'teacher')).students.every(s=>s.status==='present'));
       const edits={date:'2026-11-01',version:1,records:[{...body.records[0],status:'late'}]};
       const competing=await Promise.all([request(path,'PUT',edits,'teacher'),request(path,'PUT',edits,'teacher')]);assert.deepEqual(competing.map(r=>r.status).sort(),[200,409]);
       today='2026-11-02';const transferred=await data(path+'?date=2026-11-02','teacher');assert.ok(!transferred.students.some(s=>s.id===2));today='2026-11-01';
       const logs=await sql("SELECT * FROM activity_logs WHERE actor_role='teacher'");assert.ok(logs.some(l=>l.record_type==='school_attendance'));assert.ok(logs.some(l=>l.record_type==='school_homework'));assert.ok(!JSON.stringify(logs).includes('Answer questions'));
      });
      await t.test('monthly attendance scopes each day/membership, counts raw and adjusted totals and rejects other teachers',async()=>{
       const path='/teacher/classes/'+classA+'/attendance/month?month=2026-11';
       assert.equal((await request(path,'GET',undefined,'otherTeacher')).status,403);
       assert.equal((await request('/teacher/classes/'+classA+'/attendance/month?month=2026-13','GET',undefined,'teacher')).status,400);
       const initial=await data(path,'teacher');assert.equal(initial.days.length,30);assert.ok(initial.days.filter(d=>d.date>'2026-11-01').every(d=>!d.editable));
       const pupil=rosterStudents.find(s=>s.id!==2).id;
       const set=async(date,status)=>{
        today=date;const daily=await data('/teacher/classes/'+classA+'/attendance?date='+date,'teacher');
        assert.equal((await request('/teacher/classes/'+classA+'/attendance','PUT',{date,version:daily.version,records:[{student_user_id:pupil,status}]},'teacher')).status,200);
       };
       await set('2026-11-02','late');await set('2026-11-03','late');await set('2026-11-04','late');await set('2026-11-05','absent');
       const month=await data(path,'teacher'),p=month.students.find(s=>s.id===pupil);
       assert.equal(p.totals.late,3);assert.equal(p.totals.absent,1);assert.equal(p.totals.adjustedAbsences,2);assert.equal(p.totals.present,1);assert.equal(p.totals.marked,5);
       assert.equal(month.students.find(s=>s.id===2).eligible.length,1);
       assert.equal(Object.keys(p.marks).length,5);
       assert.ok(!JSON.stringify(month.students).includes('password'));assert.ok(!('email'in p));
       assert.equal((await request('/teacher/classes/'+classA+'/attendance/month?month=2027-02','GET',undefined,'teacher')).status,403);
       today='2026-11-01';
      });
      await t.test('ambiguous or inactive homeroom and deactivated accounts do not retain access',async()=>{
       await sql("INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time) VALUES(2,7,'10:00','11:00')");
       await sql('INSERT IGNORE INTO school_class_offerings VALUES(?,2)',[classA]);
       assert.equal((await request('/teacher/classes/'+classA+'/attendance?date=2026-11-01','GET',undefined,'teacher')).status,403);
       await sql('DELETE FROM school_class_offerings WHERE class_id=? AND offering_id=2',[classA]);
       await sql('UPDATE school_teachers SET is_active=0 WHERE id=?',[firstTeacher]);assert.equal((await request('/teacher/dashboard','GET',undefined,'teacher')).status,403);await sql('UPDATE school_teachers SET is_active=1 WHERE id=?',[firstTeacher]);
       assert.equal((await request('/admin/teacher-accounts/'+userId+'/status','PUT',{is_active:false})).status,200);
       assert.equal((await request('/teacher/dashboard','GET',undefined,'teacher')).status,401);
       await request('/admin/teacher-accounts/'+userId+'/status','PUT',{is_active:true});
       assert.equal((await request('/teacher/dashboard','GET',undefined,'teacher')).status,401);await signTeacher('teacher_one','teacher');
       assert.equal((await request('/teacher/dashboard','GET',undefined,'teacher')).status,200);
      });
    });
    await t.test('individual student identity preserves records/password, rejects collisions and revokes old sessions',async()=>{
      const [student]=await sql("SELECT * FROM users WHERE login_id='enrolled_one'");
      const path='/admin/school/students/'+student.id+'/login-id';
      const initial=await data(path),membership=initial.memberships[0];assert.ok(membership);
      assert.equal((await request(path,'GET',undefined,null)).status,401);
      for(const role of ['alice','canteen','teacher'])assert.equal((await request(path,'GET',undefined,role)).status,403);
      const body={expected_login_id:student.login_id,membership_id:membership.id,admitted_on:'2026-04-15',student_number:'061'};
      const before={profile:await sql('SELECT * FROM student_profiles WHERE user_id=?',[student.id]),memberships:await sql('SELECT * FROM school_memberships WHERE student_user_id=?',[student.id])};
      const {user_id,...profile}=before.profile[0];body.profile={...profile,is_active:true,full_name:'Updated Fictional Student'};
      assert.equal((await request(path,'PUT',{...body,admitted_on:'2027-01-01'})).status,400);
      assert.equal((await request(path,'PUT',{...body,student_number:'000'})).status,400);
      const [foreign]=await sql('SELECT id FROM school_memberships WHERE student_user_id<>? LIMIT 1',[student.id]);
      assert.equal((await request(path,'PUT',{...body,membership_id:foreign.id})).status,400);
      assert.equal((await request(path,'PUT',{...body,expected_login_id:'stale'})).status,409);
      const expected=structuredStudentLogin(body.admitted_on,membership.grade_label,membership.class_name,body.student_number);
      const duplicate=await sql("INSERT INTO users(login_id,password_hash,role) VALUES(?,?,'student')",[expected,student.password_hash]);
      assert.equal((await request(path,'PUT',body)).status,409);
      assert.deepEqual(await sql('SELECT * FROM student_profiles WHERE user_id=?',[student.id]),before.profile);
      assert.equal((await sql('SELECT login_id FROM users WHERE id=?',[student.id]))[0].login_id,student.login_id);
      await sql('DELETE FROM users WHERE id=?',[duplicate.insertId]);
      const saved=await request(path,'PUT',body);assert.equal(saved.status,200,JSON.stringify(await saved.clone().json()));assert.equal((await saved.json()).login_id,expected);
      const [after]=await sql('SELECT * FROM users WHERE id=?',[student.id]);assert.equal(after.password_hash,student.password_hash);assert.equal(after.role,'student');assert.equal(after.is_active,student.is_active);
      assert.deepEqual(await sql('SELECT * FROM student_profiles WHERE user_id=?',[student.id]),[{...before.profile[0],full_name:'Updated Fictional Student'}]);
      assert.deepEqual(await sql('SELECT * FROM school_memberships WHERE student_user_id=?',[student.id]),before.memberships);
      assert.equal((await request('/auth/me','GET',undefined,'enrolled')).status,401);
      assert.equal((await request('/auth/login','POST',{login_id:student.login_id,password:fixturePassword},null)).status,401);
      const login=await request('/auth/login','POST',{login_id:expected,password:fixturePassword},null);assert.equal(login.status,200);cookies.enrolled=login.headers.get('set-cookie').split(';')[0];
      assert.equal((await data('/auth/me','enrolled')).user.id,student.id);
      assert.equal((await request(path,'PUT',body)).status,409);
      assert.equal((await request(path,'PUT',{...body,expected_login_id:expected})).status,400);
      assert.equal((await request('/admin/school/students/1/login-id')).status,404);
    });
  }finally{
    if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}await pool?.end();
    try{await root.query('DROP DATABASE IF EXISTS `'+db+'`');}finally{await root.end();}
  }
});

// Targeted Week 12 API persistence check. Fictional isolated schema only.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {randomBytes} from 'node:crypto';
const require=createRequire(new URL('../../backend/package.json',import.meta.url));
const mysql=require('mysql2/promise'),bcrypt=require('bcryptjs');
const {createDatabaseApp}=require('./dist/database-app.js');
const {ensureSchoolSchema}=require('./dist/school-schema.js');
const {ensureTeacherSchema}=require('./dist/teacher-workspace.js');
const {ensureActivitySchema}=require('./dist/activity-log.js');
const {canteenMenuSchema}=require('./dist/canteen-menu.js');
const {resetSchema}=require('./dist/password-resets.js');
const {favouritesSchema}=require('./dist/job-favourites.js');
const db='studenthub_w12_'+randomBytes(6).toString('hex');
assert.match(db,/^studenthub_w12_[a-f0-9]{12}$/);
const config={host:process.env.DB_HOST??'127.0.0.1',port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD};
const root=await mysql.createConnection(config);
let pool,server,cookie;
const password=randomBytes(18).toString('base64url');
const sql=async(q,v=[]) => (await pool.execute(q,v))[0];
async function start(){server=createDatabaseApp(pool,{today:()=> '2026-11-21'}).listen(0,'127.0.0.1');await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject)});}
async function stop(){if(server){server.closeAllConnections();await new Promise(r=>server.close(r));server=undefined;}}
async function api(path,method='GET',body,status=200){const r=await fetch('http://127.0.0.1:'+server.address().port+'/api'+path,{method,headers:{'Content-Type':'application/json','X-StudentHub':'1',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,status,path+': '+JSON.stringify(data));return {data,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function login(){cookie=undefined;cookie=(await api('/auth/login','POST',{login_id:'w12_admin',password})).cookie;assert.ok(cookie);}
const state=async()=> (await api('/admin/school')).data;
async function write(path,method,body,status=200){return (await api('/admin/school/'+path,method,{...body,revision:(await state()).revision},status)).data;}
try{
 await root.query('CREATE DATABASE `'+db+'`');pool=mysql.createPool({...config,database:db,connectionLimit:4});
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

 await sql("INSERT INTO users(login_id,password_hash,role,is_active) VALUES('w12_admin',?,'admin',1)",[await bcrypt.hash(password,4)]);
 await ensureSchoolSchema(pool);await ensureTeacherSchema(pool);await ensureActivitySchema(pool);await start();await login();
 await write('profile','PUT',{name:'Fictional Week 12 School',level:'middle',confirm_school_mode:true});
 const year=(await write('years','POST',{name:'2026–2027',start_date:'2026-04-15',end_date:'2027-04-14'},201)).id;
 const cl=(await write('classes','POST',{year_id:year,grade_label:'6',name:'A',is_active:true},201)).id;
 const term=(await write('terms','POST',{year_id:year,name:'Fictional term',start_date:'2026-04-15',end_date:'2027-04-14'},201)).id;
 const course=(await write('grade-subjects','POST',{year_id:year,grade_label:'6',course_code:'W12-MORAL',course_name:'Moral Education'},201)).id;
 const teacher=(await write('teachers','POST',{name:'Fictional Hari Adhikari',staff_code:'W12-HARI',course_id:course},201)).id;
 const input={class_id:cl,course_id:course,semester_id:term,teacher_id:teacher};
 const oldRevision=(await state()).revision;
 const offering=(await write('subjects','POST',input,201)).id;
 console.log('PASS assignment: HTTP 201, explicit Grade 6 A / Moral Education / fictional Hari identifiers');
 async function verify(label){const s=await state();assert.equal(s.links.filter(l=>l.class_id===cl&&l.offering_id===offering).length,1);assert.equal(s.subjects.find(x=>x.id===offering).course_name,'Moral Education');assert.equal(s.subjects.find(x=>x.id===offering).professor,'Fictional Hari Adhikari');assert.equal(s.subject_teachers.find(x=>x.offering_id===offering).teacher_id,teacher);console.log('PASS '+label+': same class/offering/teacher IDs');}
 await verify('fresh API read');
 await write('subjects','POST',input,409);await verify('duplicate rejected without losing link');
 await api('/admin/school/subjects','POST',{...input,revision:oldRevision},409);await verify('stale revision rejected without losing link');
 await login();await verify('new administrator session');
 await stop();await start();await login();await verify('application restart and login');
 const saved=await sql('SELECT l.class_id,l.offering_id,t.teacher_id FROM school_class_offerings l JOIN school_offering_teachers t ON t.offering_id=l.offering_id WHERE l.class_id=? AND l.offering_id=?',[cl,offering]);
 assert.deepEqual(saved.map(x=>[x.class_id,x.offering_id,x.teacher_id]),[[cl,offering,teacher]]);
 assert.equal((await sql('SELECT COUNT(*) total FROM course_offerings WHERE course_id=?',[course]))[0].total,1);
 console.log('PASS SQL read-back: one class link, matching teacher, no orphan duplicate offering');
 console.log('RESULT: scoped API persistence all-clear; not a Safari or deployed-site fix claim');
}finally{await stop();await pool?.end();await root.query('DROP DATABASE IF EXISTS `'+db+'`');await root.end();console.log('CLEANUP: own random Week 12 schema removed');}

// Disposable local browser review. Never connects to the application's DB_NAME.
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import {randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {createDatabaseApp} from '../dist/database-app.js';
import {ensureSchoolSchema} from '../dist/school-schema.js';
import {canteenMenuSchema} from '../dist/canteen-menu.js';
import {resetSchema} from '../dist/password-resets.js';
import {favouritesSchema} from '../dist/job-favourites.js';
import {jobId} from '../dist/jobs.js';

if(process.env.ALLOW_DISPOSABLE_SCHOOL_REVIEW!=='1')throw Error('Set ALLOW_DISPOSABLE_SCHOOL_REVIEW=1 to create the disposable local review database.');
const host=process.env.DB_HOST??'127.0.0.1';
if(!['127.0.0.1','localhost'].includes(host))throw Error('School review is restricted to local MySQL. It must not use a cloud database.');
const html=await readFile(new URL('../../frontend/dist/index.html',import.meta.url),'utf8');
if(!html.includes('src="/assets/'))throw Error('Build the frontend with VITE_BASE_PATH=/ before running the browser review.');
const db='studenthub_school_review_'+randomBytes(6).toString('hex');
const root=await mysql.createConnection({host,port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD});
let pool,server,closing=false;
async function close(){
  if(closing)return;closing=true;
  try{if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}await pool?.end();
    if(!/^studenthub_school_review_[a-f0-9]{12}$/.test(db))throw Error('Unexpected review database name.');
    await root.query('DROP DATABASE IF EXISTS `'+db+'`');
  }finally{await root.end();}
}
try{
  await root.query('CREATE DATABASE `'+db+'`');pool=mysql.createPool({host,port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD,database:db,connectionLimit:5});
  for(const sql of [
    "CREATE TABLE users(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,login_id VARCHAR(50) UNIQUE,password_hash VARCHAR(255),role ENUM('admin','student','canteen_head'),is_active TINYINT DEFAULT 1)",
    'CREATE TABLE student_profiles(user_id INT UNSIGNED PRIMARY KEY,full_name VARCHAR(150),university VARCHAR(150),major VARCHAR(150),year_of_study INT,email VARCHAR(254),phone_number VARCHAR(30),address VARCHAR(500))',
    'CREATE TABLE semesters(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100),academic_year INT,start_date DATE,end_date DATE)',
    'CREATE TABLE courses(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,course_code VARCHAR(50) UNIQUE,course_name VARCHAR(150),credits INT)',
    'CREATE TABLE course_offerings(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,course_id INT UNSIGNED,semester_id INT UNSIGNED,major VARCHAR(150),professor VARCHAR(150),section VARCHAR(10),UNIQUE KEY(course_id,semester_id,major,section),FOREIGN KEY(semester_id) REFERENCES semesters(id),FOREIGN KEY(course_id) REFERENCES courses(id))',
    'CREATE TABLE student_semesters(student_user_id INT UNSIGNED,semester_id INT UNSIGNED,assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE class_schedules(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,course_offering_id INT UNSIGNED,day_of_week INT,start_time TIME,end_time TIME,location VARCHAR(150))',
    'CREATE TABLE enrollments(student_user_id INT UNSIGNED,course_offering_id INT UNSIGNED,PRIMARY KEY(student_user_id,course_offering_id))',
    canteenMenuSchema, resetSchema, favouritesSchema,
  ])await pool.query(sql);
  const password=process.env.SCHOOL_REVIEW_PASSWORD||randomBytes(15).toString('base64url'),hash=await bcrypt.hash(password,4);
  for(const [id,login,role]of[[1,'review_admin','admin'],[2,'review_student','student'],[3,'review_canteen','canteen_head']])await pool.execute('INSERT INTO users VALUES(?,?,?,?,1)',[id,login,hash,role]);
  await pool.query("INSERT INTO student_profiles VALUES(2,'Fictional Student','Fictional legacy school','Legacy group',2,NULL,NULL,NULL)");
  await pool.query("INSERT INTO semesters VALUES(1,'Fall term',2026,'2026-09-01','2026-12-31')");
  await pool.query("INSERT INTO courses VALUES(1,'MATH','Mathematics',3),(2,'SCI','Science',3)");
  await pool.query("INSERT INTO course_offerings VALUES(1,1,1,'Legacy group','Fictional Teacher','A')");
  await pool.query("INSERT INTO class_schedules VALUES(1,1,1,'10:00','11:00','Recorded class location')");
  await pool.query('INSERT INTO student_semesters VALUES(2,1,CURRENT_TIMESTAMP)');
  await ensureSchoolSchema(pool);
  if(process.env.SCHOOL_REVIEW_SEED==='1'){
    await pool.query("INSERT INTO school_profile VALUES(1,'Fictional School','middle')");
    await pool.query("INSERT INTO school_years VALUES(1,'2026–2027','2026-03-01','2027-02-28')");
    await pool.query("INSERT INTO school_classes VALUES(1,1,'2','A',1),(2,1,'2','B',1)");
    await pool.query('INSERT INTO school_terms VALUES(1,1)');
    await pool.query("INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(2,1,1,'2026-09-01')");
    await pool.query('INSERT INTO school_class_offerings VALUES(1,1)');
    await pool.query("INSERT INTO courses VALUES(3,'ENG','English',0),(4,'KOR','Korean Language',0),(5,'HIST','History',0),(6,'PE','Physical Education',0),(7,'ART','Art',0),(8,'MUSIC','Music',0),(9,'COMP','Computing',0),(10,'ETH','Ethics',0)");
    await pool.query("INSERT INTO school_teachers(staff_code,name) VALUES('DEMO-T01','Demo Teacher Kim'),('DEMO-T02','Demo Teacher Lee'),('DEMO-T03','Demo Teacher Park')");
    await pool.query("INSERT INTO school_grade_subjects SELECT 1,'2',id FROM courses");
    await pool.query('INSERT INTO school_offering_teachers VALUES(1,1)');
    await pool.query("INSERT INTO class_schedules VALUES(2,1,7,'10:00','11:00','Recorded class location')");
    await pool.query("UPDATE course_offerings SET professor='Demo Teacher Kim' WHERE id=1");

    await pool.execute("INSERT INTO users VALUES(4,'review_unmapped',?,'student',1)",[hash]);
    await pool.query("INSERT INTO student_profiles VALUES(4,'Fictional Unassigned Student','Fictional legacy school','Legacy group',2,NULL,NULL,NULL)");
  }
  process.env.SERVE_FRONTEND='true';process.env.NODE_ENV='test';delete process.env.FRONTEND_ORIGIN;
  const fixtureJob={company:'Fictional demo employer',title:'Fixture listing — not a real vacancy',location:'Demo location',salary:'Not specified',career:'',education:'',employment:'',posted:'2026-11-01',closes:'',description:'Fictional data for local route checks only.',address:'',hours:'',application:'Not open for applications',documents:'',phone:''};
  const jobs=async(page,query)=>({jobs:(!query||fixtureJob.title.toLowerCase().includes(query.toLowerCase()))?[{...fixtureJob,id:jobId(fixtureJob)}]:[],total:(!query||fixtureJob.title.toLowerCase().includes(query.toLowerCase()))?1:0,page,pageSize:30,fetchedAt:new Date().toISOString()});
  const app=createDatabaseApp(pool,{today:()=> '2026-11-01',jobs});
  const port=Number(process.env.SCHOOL_REVIEW_PORT??3019);if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Choose a SCHOOL_REVIEW_PORT between 1024 and 65535.');
  server=app.listen(port,'127.0.0.1');await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject);});
  console.log('Disposable school review: http://127.0.0.1:'+port);
  console.log('Fictional logins: review_admin / review_student / review_canteen');
  console.log('Temporary fixture password: '+password);
  console.log('Fixture date: 2026-11-01. Type stop and Enter or press Ctrl+C to remove the disposable database.');
  process.stdin.setEncoding('utf8');process.stdin.on('data',value=>{if(value.trim()==='stop')void close().then(()=>process.exit(0));});
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>void close().then(()=>process.exit(0)));
}catch(error){await close();throw error;}

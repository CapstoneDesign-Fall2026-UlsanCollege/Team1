// Disposable teacher UI review. Never connects to the application's DB_NAME.
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import {randomBytes} from 'node:crypto';
import {createDatabaseApp} from '../dist/database-app.js';
import {ensureSchoolSchema} from '../dist/school-schema.js';
import {ensureTeacherSchema} from '../dist/teacher-workspace.js';
import {ensureActivitySchema} from '../dist/activity-log.js';
import {canteenMenuSchema} from '../dist/canteen-menu.js';
import {resetSchema} from '../dist/password-resets.js';
import {favouritesSchema} from '../dist/job-favourites.js';
const config={host:process.env.DB_HOST??'127.0.0.1',port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD};
const name='studenthub_teacher_review_'+randomBytes(6).toString('hex');
if(!/^studenthub_teacher_review_[a-f0-9]{12}$/.test(name))throw Error('Unsafe fixture schema name');
const root=await mysql.createConnection(config);let pool,server,closing=false;
async function close(){if(closing)return;closing=true;if(server){server.closeAllConnections();await new Promise(r=>server.close(r))}await pool?.end();try{await root.query('DROP DATABASE IF EXISTS `'+name+'`')}finally{await root.end()}}
try{
 await root.query('CREATE DATABASE `'+name+'`');pool=mysql.createPool({...config,database:name,connectionLimit:5});
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
    ])await pool.query(statement);

 await ensureSchoolSchema(pool);await ensureTeacherSchema(pool);
 const password=randomBytes(18).toString('base64url'),hash=await bcrypt.hash(password,4);
 for(const [id,login,role]of[[1,'review_admin','admin'],[2,'review_teacher','teacher'],[3,'review_teacher_b','teacher'],[4,'review_pupil_01','student'],[5,'review_pupil_02','student'],[6,'review_pupil_b','student']])await pool.execute('INSERT INTO users VALUES(?,?,?,?,1)',[id,login,hash,role]);
 await pool.query("INSERT INTO student_profiles(user_id,full_name,university) VALUES(4,'Aarav Example','Mahendra School'),(5,'Bina Example','Mahendra School'),(6,'Chandra Example','Mahendra School')");
 await pool.query("INSERT INTO school_profile VALUES(1,'Mahendra School','high')");
 await pool.query("INSERT INTO school_years VALUES(1,'2026–2027','2026-04-15','2027-04-14')");
 await pool.query("INSERT INTO semesters VALUES(1,'School term 2026–2027',2026,'2026-04-15','2027-04-14')");
 await pool.query("INSERT INTO school_terms VALUES(1,1)");
 await pool.query("INSERT INTO school_classes VALUES(1,1,'6','A',1),(2,1,'6','B',1)");
 await pool.query("INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(4,1,1,'2026-04-15'),(5,1,1,'2026-04-15'),(6,1,2,'2026-04-15')");
 await pool.query("INSERT INTO school_teachers VALUES(1,'REVIEW-T01','Asha Example',1),(2,'REVIEW-T02','Bikash Example',1)");
 await pool.query('INSERT INTO school_teacher_accounts VALUES(2,1),(3,2)');
 await pool.query("INSERT INTO courses VALUES(1,'MATH','Mathematics',1),(2,'ENG','English',1)");
 await pool.query("INSERT INTO course_offerings VALUES(1,1,1,NULL,'Asha Example','A'),(2,1,1,NULL,'Asha Example','B'),(3,2,1,NULL,'Bikash Example','B')");
 await pool.query('INSERT INTO school_class_offerings VALUES(1,1),(2,2),(2,3)');
 await pool.query('INSERT INTO school_offering_teachers VALUES(1,1),(2,1),(3,2)');
 for(const day of [7,1,2,3,4,5])for(const [off,start,end,room]of [[1,'10:00','11:00','Room 101'],[2,'11:00','12:00','Room 102'],[3,'10:00','11:00','Room 102']])await pool.execute('INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time,location) VALUES(?,?,?,?,?)',[off,day,start,end,room]);
 await ensureActivitySchema(pool);
 process.env.SERVE_FRONTEND='true';process.env.NODE_ENV='test';delete process.env.FRONTEND_ORIGIN;
 server=createDatabaseApp(pool).listen(3019,'127.0.0.1');
 await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject)});
 console.log('TEMPORARY FICTIONAL TEACHER REVIEW ONLY: http://127.0.0.1:3019/');
 console.log('Logins: review_admin, review_teacher, review_teacher_b, review_pupil_01');
 console.log('Temporary password (never publish): '+password);
 console.log('Enter stop to end and remove the disposable schema. No application data was copied.');
 process.stdin.setEncoding('utf8');process.stdin.on('data',s=>{if(s.trim()==='stop')void close()});
 for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>void close());
}catch(e){await close();throw e}

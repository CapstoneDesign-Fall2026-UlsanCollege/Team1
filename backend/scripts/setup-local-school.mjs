import {canteenInfoSchema} from '../dist/canteen-info.js';
// Explicit, local-only persistent setup. Never runs during normal server startup.
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'node:crypto';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { ensureSchoolSchema } from '../dist/school-schema.js';
import { ensureCanteenRole } from '../dist/canteen-accounts.js';
import { canteenMenuSchema } from '../dist/canteen-menu.js';
import { resetSchema } from '../dist/password-resets.js';
import { favouritesSchema } from '../dist/job-favourites.js';

if (process.env.CONFIRM_SEED_LOCAL_SCHOOL !== '1') throw Error('Explicit local seed confirmation required.');
const host=process.env.DB_HOST??'127.0.0.1', database=process.env.DB_NAME??'studenthub';
if (!['127.0.0.1','localhost'].includes(host)||database!=='studenthub') throw Error('This setup only targets the local studenthub database.');
const backupDir=process.env.SCHOOL_PRIVATE_BACKUP_DIR;
if (!backupDir||!path.isAbsolute(backupDir)) throw Error('Choose an absolute private backup directory outside the repository.');
const config={host,port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD,dateStrings:true,supportBigNumbers:true,bigNumberStrings:true};
const pool=mysql.createPool({...config,database,connectionLimit:3}), c=await pool.getConnection();
const identifier=s=>'`'+String(s).replaceAll('`','``')+'`';
const digest=rows=>createHash('sha256').update(JSON.stringify(rows.map(r=>JSON.stringify(r)).sort())).digest('hex');
const baseline=new Map();
async function select(sql,args=[]){return (await c.execute(sql,args))[0];}
async function insert(sql,args=[]){return (await c.execute(sql,args))[0].insertId;}
let transaction=false;
try {
  const tables=await select('SELECT TABLE_NAME name,TABLE_TYPE type FROM information_schema.TABLES WHERE TABLE_SCHEMA=? ORDER BY TABLE_NAME',[database]);
  const triggers=await select('SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=?',[database]);
  if(tables.some(t=>t.type!=='BASE TABLE')||triggers.length)throw Error('Views/triggers require a full vendor-tool backup before this setup.');
  const dump=['-- Private studenthub backup. Restore into a NEW EMPTY database selected by the operator.','SET NAMES utf8mb4;','SET FOREIGN_KEY_CHECKS=0;'];
  await c.query('START TRANSACTION WITH CONSISTENT SNAPSHOT');
  for(const {name} of tables){
    const [ddl]=await select('SHOW CREATE TABLE '+identifier(name));
    const records=await select('SELECT * FROM '+identifier(name));baseline.set(name,records);
    dump.push(ddl['Create Table']+';');
    const columns=await select('SHOW COLUMNS FROM '+identifier(name));
    const jsonColumns=new Set(columns.filter(v=>String(v.Type).toLowerCase()==='json').map(v=>v.Field));
    const writable=columns.filter(v=>!/(VIRTUAL|STORED) GENERATED/.test(String(v.Extra))).map(v=>v.Field);
    for(const record of records)dump.push('INSERT INTO '+identifier(name)+' ('+writable.map(identifier).join(',')+') VALUES ('+writable.map(k=>c.escape(jsonColumns.has(k)&&record[k]!==null?JSON.stringify(record[k]):record[k])).join(',')+');');
  }
  await c.commit();dump.push('SET FOREIGN_KEY_CHECKS=1;');
  await mkdir(backupDir,{recursive:true});
  const backupPath=path.join(backupDir,'studenthub-before-school-'+new Date().toISOString().replaceAll(/[:.]/g,'-')+'-'+randomBytes(3).toString('hex')+'.sql');
  const backupSql=dump.join('\n')+'\n';await writeFile(backupPath+'.unverified',backupSql,{flag:'wx',mode:0o600});
  // Prove the dump can restore before changing studenthub. Only this random probe is removed.
  const probe='studenthub_backup_check_'+randomBytes(6).toString('hex');
  const check=await mysql.createConnection({...config,multipleStatements:true});
  try{await check.query('CREATE DATABASE '+identifier(probe));await check.query('USE '+identifier(probe));await check.query(backupSql);
    for(const [name,records] of baseline){const [restored]=await check.query('SELECT * FROM '+identifier(name));if(digest(restored)!==digest(records))throw Error('Backup restore verification failed for '+name);}
  }finally{if(!/^studenthub_backup_check_[a-f0-9]{12}$/.test(probe))throw Error('Invalid backup probe name.');await check.query('DROP DATABASE IF EXISTS '+identifier(probe));await check.end();}
  await rename(backupPath+'.unverified',backupPath);
  console.log('Verified private backup: '+backupPath);
  await ensureCanteenRole(pool);await ensureSchoolSchema(pool);
  for(const sql of [canteenMenuSchema,canteenInfoSchema,resetSchema,favouritesSchema])await c.query(sql);
  await c.query("CREATE TABLE IF NOT EXISTS school_demo_seeds(seed_key VARCHAR(80) PRIMARY KEY,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB");
  if((await select("SELECT seed_key FROM school_demo_seeds WHERE seed_key='nepal-school-v1'")).length){console.log('Dummy school data already exists; no duplicates or account/password resets performed.');}
  else{
    if((await select('SELECT id FROM school_profile LIMIT 1')).length||(await select('SELECT id FROM school_years LIMIT 1')).length)throw Error('School data already exists. Review before adding a demo school.');
    const password=process.env.DUMMY_SCHOOL_PASSWORD||randomBytes(15).toString('base64url'), hash=await bcrypt.hash(password,12);
    await c.beginTransaction();transaction=true;
    await c.query('SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');
    await insert("INSERT INTO school_profile(id,name,level) VALUES(1,'Demo Nepal School','high')");
    const year=await insert("INSERT INTO school_years(name,start_date,end_date) VALUES('Demo 2026–2027','2026-04-15','2027-04-14')");
    const term=await insert("INSERT INTO semesters(name,academic_year,start_date,end_date) VALUES('Demo school term',2026,'2026-04-15','2027-04-14')");
    await insert('INSERT INTO school_terms(semester_id,year_id) VALUES(?,?)',[term,year]);
    for(const [login,role] of [['demo_admin','admin'],['demo_canteen','canteen_head']])await insert('INSERT INTO users(login_id,password_hash,role,is_active) VALUES(?,?,?,1)',[login,hash,role]);
    const teacherNames=['Demo Asha Sharma','Demo Bikash Thapa','Demo Chandra Rai','Demo Deepa Karki','Demo Ekta Shrestha','Demo Farhan Khan','Demo Gita Gurung','Demo Hari Adhikari','Demo Indira Lama','Demo Jeevan Poudel'];
    const teacherIds=[];for(let i=0;i<10;i++)teacherIds.push(await insert('INSERT INTO school_teachers(staff_code,name) VALUES(?,?)',['DEMO-T'+String(i+1).padStart(2,'0'),teacherNames[i]]));
    const subjects=[['NEP','Nepali Language'],['ENG','English'],['MATH','Mathematics'],['SCI','Science'],['SOC','Social Studies'],['COMP','Computer Studies'],['HEALTH','Health Education'],['PE','Physical Education'],['ART','Art and Music'],['MORAL','Moral Education']];
    const courseIds=[];for(const [code,name] of subjects)courseIds.push(await insert('INSERT INTO courses(course_code,course_name,credits,description) VALUES(?,?,0,?)',['DEMO-'+code,name,'Fictional school seed; not an approved curriculum.']));
    for(let grade=6;grade<=10;grade++)for(const course of courseIds)await insert('INSERT INTO school_grade_subjects(year_id,grade_label,course_id) VALUES(?,?,?)',[year,String(grade),course]);
    const weekdays=[7,1,2,3,4,5], rooms=[];for(let f=1;f<=5;f++)for(let n=1;n<=6;n++)rooms.push(f*100+n);
    let classIndex=0;
    for(let grade=6;grade<=10;grade++)for(const section of ['A','B']){
      const cl=await insert('INSERT INTO school_classes(year_id,grade_label,name,is_active) VALUES(?,?,?,1)',[year,String(grade),section]);
      await insert('INSERT INTO school_class_rooms(year_id,class_id,room_id) VALUES(?,?,?)',[year,cl,rooms[classIndex]]);
      for(let n=1;n<=3;n++){
        const userId=await insert("INSERT INTO users(login_id,password_hash,role,is_active) VALUES(?,?,'student',1)",['demo_'+grade+section.toLowerCase()+'_'+String(n).padStart(2,'0'),hash]);
        await insert('INSERT INTO student_profiles(user_id,full_name,university,major,year_of_study) VALUES(?,?,?,NULL,?)',[userId,'Demo Student '+grade+section+' '+String(n).padStart(2,'0'),'Demo Nepal School',grade]);
        await insert("INSERT INTO school_memberships(student_user_id,year_id,class_id,starts_on) VALUES(?,?,?,'2026-04-15')",[userId,year,cl]);
      }
      const offerings=[];
      for(let s=0;s<subjects.length;s++){
        const ti=s;
        const offering=await insert('INSERT INTO course_offerings(course_id,semester_id,major,professor,section) VALUES(?,?,NULL,?,?)',[courseIds[s],term,teacherNames[ti],section]);offerings.push(offering);
        if([0,1,2,4,5].map(h=>(classIndex+3+h)%10).includes(s))await insert('INSERT INTO school_class_offerings(class_id,offering_id) VALUES(?,?)',[cl,offering]);
        await insert('INSERT INTO school_offering_teachers(offering_id,teacher_id) VALUES(?,?)',[offering,teacherIds[ti]]);
      }
      // Specialist teachers follow the same daily routine; Sunday 10 AM determines homeroom.
      for(let d=0;d<6;d++)for(const h of [0,1,2,4,5])await insert('INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time,location) VALUES(?,?,?,?,?)',[offerings[(classIndex+3+h)%10],weekdays[d],String(10+h)+':00',String(11+h)+':00','Room '+rooms[classIndex]]);
      if([0,2,4].includes(classIndex))await insert("INSERT INTO school_room_bookings(room_id,class_id,offering_id,teacher_id,day_of_week,start_time,end_time,starts_on,ends_on,repeats_weekly) VALUES(?,?,?,?,7,'10:00','11:00','2026-11-01','2027-04-14',1)",[[107,207,307][classIndex/2],cl,offerings[(classIndex+3)%10],teacherIds[(classIndex+3)%10]]);
      classIndex++;
    }
    await insert("INSERT INTO school_demo_seeds(seed_key) VALUES('nepal-school-v1'),('nepal-subject-specialists-v2'),('nepal-tiffin-v3')");
    await c.query('UPDATE school_planning_lock SET version=version+1 WHERE id=1');
    // Assert every original row is still present unchanged before committing the seed.
    for(const [name,records] of baseline){const current=new Set((await select('SELECT * FROM '+identifier(name))).map(r=>JSON.stringify(r)));if(records.some(r=>!current.has(JSON.stringify(r))))throw Error('Original record preservation failed for '+name);}
    await c.commit();transaction=false;
    console.log('Created dummy logins: demo_admin / demo_canteen / demo_6a_01 (and other labelled demo students).');
    console.log('Dummy-only password: '+password);
  }
  const counts={};for(const table of ['users','student_profiles','school_years','school_classes','school_memberships','school_teachers','school_grade_subjects','school_rooms','school_class_rooms','school_room_bookings'])counts[table]=Number((await select('SELECT COUNT(*) total FROM '+identifier(table)))[0].total);
  console.log(JSON.stringify({database,counts,originalRowsPreserved:true},null,2));
}catch(error){if(transaction)await c.rollback();throw new Error('Local setup failed: '+error.message);}finally{c.release();await pool.end();}

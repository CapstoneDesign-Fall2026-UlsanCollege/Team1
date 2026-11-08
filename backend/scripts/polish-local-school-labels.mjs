// Local, explicit data-polish operation. Fictional sample data remains fictional.
// Run with the existing private environment; --apply is required for writes.
import mysql from 'mysql2/promise';
import {spawnSync} from 'node:child_process';
import {mkdir,readFile,rename,writeFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import path from 'node:path';
const config={host:process.env.DB_HOST??'127.0.0.1',port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD,database:process.env.DB_NAME??'studenthub'};
if(!['127.0.0.1','localhost'].includes(config.host)||config.database!=='studenthub')throw Error('Local studenthub only.');
const apply=process.argv.includes('--apply');
const c=await mysql.createConnection(config);
const names=['Aarav Sharma','Aayush Thapa','Anisha Rai','Ankit Karki','Asmita Shrestha','Bibek Gurung','Bina Adhikari','Bishal Tamang','Diksha Poudel','Dipesh Magar','Elina Lama','Gaurav Bhandari','Ishika Basnet','Kiran Neupane','Kritika Acharya','Manish Khadka','Nabin Gautam','Nikita Pandey','Niraj Joshi','Pabitra Dahal','Prakash Raut','Pratiksha Rana','Rachana KC','Rohan Shahi','Sabina Maharjan','Samir Aryal','Sandhya Bhattarai','Sanjay Chaudhary','Srijana Pun','Suman Regmi'];
let transaction=false;
try{
 const q=async(sql,params=[])=> (await c.execute(sql,params))[0];
 const changes=[];
 const propose=async(table,column,key,sql,fn)=>{for(const row of await q(sql)){const after=fn(row);if(row[column]!==after)changes.push({table,column,key,id:row[key],before:row[column],after})}};
 await propose('school_profile','name','id',"SELECT id,name FROM school_profile WHERE name='Demo Nepal School'",()=> 'StudentHub Secondary School');
 await propose('school_years','name','id',"SELECT id,name FROM school_years WHERE name='Demo 2026–2027'",()=> '2026–2027');
 await propose('semesters','name','id',"SELECT id,name FROM semesters WHERE name='Demo school term'",()=> 'School term 2026–2027');
 await propose('school_teachers','name','id',"SELECT id,name FROM school_teachers WHERE name LIKE 'Demo %'",r=>r.name.replace(/^Demo /,''));
 await propose('school_teachers','staff_code','id',"SELECT id,staff_code FROM school_teachers WHERE staff_code LIKE 'DEMO-%'",r=>r.staff_code.replace(/^DEMO-/,''));
 const students=await q("SELECT p.user_id,p.full_name FROM student_profiles p JOIN users u ON u.id=p.user_id WHERE u.login_id REGEXP '^demo_(6|7|8|9|10)[ab]_0[123]$' AND p.full_name REGEXP '^Demo Student (6|7|8|9|10)[AB] 0[123]$' ORDER BY p.user_id");
 if(students.length && students.length!==30)throw Error('Sample student set changed; inspect before renaming.');
 students.forEach((r,i)=>changes.push({table:'student_profiles',column:'full_name',key:'user_id',id:r.user_id,before:r.full_name,after:names[i]}));
 await propose('student_profiles','university','user_id',"SELECT user_id,university FROM student_profiles WHERE university='Demo Nepal School'",()=> 'StudentHub Secondary School');
 await propose('course_offerings','professor','id',"SELECT id,professor FROM course_offerings WHERE professor LIKE 'Demo %'",r=>r.professor.replace(/^Demo /,''));
 await propose('courses','course_code','id',"SELECT id,course_code FROM courses WHERE course_code LIKE 'DEMO-%'",r=>r.course_code.replace(/^DEMO-/,'SCH-'));
 await propose('canteen_info','name','id',"SELECT id,name FROM canteen_info WHERE name LIKE 'Demo %'",r=>r.name.replace(/^Demo /,''));
 console.log('Planned display-label changes:',changes.length);
 if(!apply||!changes.length){console.log(apply?'Already polished; no changes.':'Dry run only. Credentials, IDs, links and history will be preserved.');}
 else{
  const dir=process.env.SCHOOL_PRIVATE_BACKUP_DIR;if(!dir||!path.isAbsolute(dir))throw Error('Set a private absolute backup directory outside the repository.');
  if(path.resolve(dir).startsWith(path.resolve('.')))throw Error('Backup must be outside repository.');
  await mkdir(dir,{recursive:true});
  const stem='studenthub-before-labels-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomBytes(3).toString('hex'),file=path.join(dir,stem+'.sql');
  const bin=process.env.MYSQL_BIN_DIR??'C:/Program Files/MySQL/MySQL Server 8.0/bin';
  const args=['--host='+config.host,'--port='+config.port,'--user='+config.user,'--protocol=TCP'];const env={...process.env,MYSQL_PWD:config.password};
  const dump=spawnSync(path.join(bin,'mysqldump.exe'),[...args,'--single-transaction','--routines','--triggers','--events','--no-tablespaces','--set-gtid-purged=OFF','--column-statistics=0','--result-file='+file+'.unverified',config.database],{env,windowsHide:true});
  if(dump.status!==0)throw Error('Vendor backup failed; no changes applied.');
  const bytes=await readFile(file+'.unverified');if(bytes.length<1000)throw Error('Backup unexpectedly small.');
  const probe='studenthub_labels_check_'+randomBytes(6).toString('hex');
  await c.query('CREATE DATABASE `'+probe+'`');
  try{
   const restore=spawnSync(path.join(bin,'mysql.exe'),[...args,'--database='+probe],{env,input:bytes,windowsHide:true,maxBuffer:2*1024*1024});
   if(restore.status!==0)throw Error('Backup restore failed; no changes applied.');
   const [source]=await c.query('SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=?',[config.database]);
   const [restored]=await c.query('SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=?',[probe]);
   if(source.length!==restored.length)throw Error('Backup trigger count mismatch.');
   const [tables]=await c.query("SELECT TABLE_NAME name FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_TYPE='BASE TABLE'",[config.database]);
   for(const t of tables){const [a]=await c.query('SELECT COUNT(*) n FROM `'+t.name+'`'),[b]=await c.query('SELECT COUNT(*) n FROM `'+probe+'`.`'+t.name+'`');if(a[0].n!==b[0].n)throw Error('Backup row count mismatch.');}
  }finally{if(!/^studenthub_labels_check_[a-f0-9]{12}$/.test(probe))throw Error('Invalid restore target');await c.query('DROP DATABASE `'+probe+'`');}
  await rename(file+'.unverified',file);
  await writeFile(path.join(dir,stem+'-changes.json'),JSON.stringify(changes,null,2),{flag:'wx',mode:0o600});
  await c.beginTransaction();transaction=true;
  await c.query('SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');
  for(const v of changes){const [result]=await c.execute('UPDATE `'+v.table+'` SET `'+v.column+'`=? WHERE `'+v.key+'`=? AND `'+v.column+'`=?',[v.after,v.id,v.before]);if(result.affectedRows!==1)throw Error('A record changed during review; rolled back.');}
  await c.query('UPDATE school_planning_lock SET version=version+1 WHERE id=1');
  await c.commit();transaction=false;
  console.log('Restored backup verified, including triggers. Updated',changes.length,'labels. Login IDs/passwords and all record links unchanged.');
  console.log('Private backup:',file);
 }
}catch(e){if(transaction)await c.rollback();console.error(e instanceof Error?e.message:'Label update failed.');process.exitCode=1}finally{await c.end()}

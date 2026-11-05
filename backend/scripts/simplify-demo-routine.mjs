// Deliberate local demo-data migration. Run only after a verified private backup.
import mysql from 'mysql2/promise';
if(process.env.CONFIRM_SIMPLIFY_DEMO!=='1')throw Error('Explicit demo migration confirmation required.');
if(!['localhost','127.0.0.1'].includes(process.env.DB_HOST)||process.env.DB_NAME!=='studenthub')throw Error('Local studenthub only.');
const c=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,dateStrings:true});
const q=async(sql,args=[]) => (await c.execute(sql,args))[0];
const codes=['NEP','ENG','MATH','SCI','SOC','COMP','HEALTH','PE','ART','MORAL'].map(s=>'DEMO-'+s);
const days=[7,1,2,3,4,5];
let transaction=false;
try{
 await c.beginTransaction();transaction=true;
 await q('SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');
 if((await q("SELECT seed_key FROM school_demo_seeds WHERE seed_key='nepal-subject-specialists-v2'")).length){console.log('Specialist daily routine already applied. No changes.');await c.rollback();transaction=false;}
 else{
 const before={};for(const t of ['users','student_profiles','school_memberships','school_class_rooms'])before[t]=JSON.stringify(await q('SELECT * FROM '+t+' ORDER BY 1'));
 const years=await q("SELECT id FROM school_years WHERE name='Demo 2026–2027'");
 if(years.length!==1)throw Error('Expected one original demo year.');
 const classes=await q("SELECT c.*,r.room_id FROM school_classes c JOIN school_class_rooms r ON r.class_id=c.id WHERE c.year_id=? ORDER BY CAST(c.grade_label AS UNSIGNED),c.name",[years[0].id]);
 if(classes.length!==10)throw Error('Expected ten demo classes.');
 const teachers=[];for(let i=1;i<=10;i++){const t=await q('SELECT id,name FROM school_teachers WHERE staff_code=?',['DEMO-T'+String(i).padStart(2,'0')]);if(t.length!==1)throw Error('Demo teacher missing.');teachers.push(t[0]);}
 const allOfferings=await q(`SELECT o.id,o.course_id,c.course_code,l.class_id FROM course_offerings o JOIN courses c ON c.id=o.course_id JOIN school_class_offerings l ON l.offering_id=o.id WHERE l.class_id IN (${classes.map(()=>'?').join(',')})`,classes.map(c=>c.id));
 if(allOfferings.length!==100 || allOfferings.some(o=>!codes.includes(o.course_code)))throw Error('Demo offerings changed; review migration first.');
 const bookings=await q(`SELECT * FROM school_room_bookings WHERE class_id IN (${classes.map(()=>'?').join(',')})`,classes.map(c=>c.id));
 const seedBookings=new Set();
 for(const i of [0,2,4]){
  const offering=allOfferings.find(o=>o.class_id===classes[i].id && o.course_code===codes[0]);
  const matches=bookings.filter(b=>b.class_id===classes[i].id && b.room_id===[107,207,307][i/2] && b.offering_id===offering.id && b.day_of_week===7 && b.start_time==='10:00:00' && b.end_time==='11:00:00' && b.starts_on==='2026-11-01' && b.ends_on==='2027-04-14' && b.repeats_weekly===1);
  matches.forEach(b=>seedBookings.add(b.id));
 }
 // Confirm custom bookings already fit the new daily routine; never silently move them.
 for(const b of bookings.filter(b=>!b.is_cancelled && !seedBookings.has(b.id))){
  const i=classes.findIndex(cl=>cl.id===b.class_id),h=Number(b.start_time.slice(0,2))-10;
  const subject=(i+3+h)%10,offering=allOfferings.find(o=>o.class_id===b.class_id && o.course_code===codes[subject]);
  if(!Number.isInteger(h)||h<0||h>5||b.start_time!==String(10+h)+':00:00'||b.end_time!==String(11+h)+':00:00'||b.offering_id!==offering?.id||b.teacher_id!==teachers[subject].id)throw Error('A custom booking needs review before this routine can be applied.');
 }
 for(const o of allOfferings){const ti=codes.indexOf(o.course_code);await q('UPDATE school_offering_teachers SET teacher_id=? WHERE offering_id=?',[teachers[ti].id,o.id]);await q('UPDATE course_offerings SET professor=? WHERE id=?',[teachers[ti].name,o.id]);}
 // Replace only these explicitly identified demo offerings' meetings.
 await q(`DELETE FROM class_schedules WHERE course_offering_id IN (${allOfferings.map(()=>'?').join(',')})`,allOfferings.map(o=>o.id));
 for(let i=0;i<classes.length;i++){
  const cl=classes[i],selected=new Set(Array.from({length:6},(_,h)=>(i+3+h)%10));
  for(const o of allOfferings.filter(o=>o.class_id===cl.id))if(!selected.has(codes.indexOf(o.course_code)))await q('DELETE FROM school_class_offerings WHERE class_id=? AND offering_id=?',[cl.id,o.id]);
  for(const day of days)for(let h=0;h<6;h++){
   const subject=(i+3+h)%10,offering=allOfferings.find(o=>o.class_id===cl.id && o.course_code===codes[subject]);
   await q('INSERT INTO class_schedules(course_offering_id,day_of_week,start_time,end_time,location) VALUES(?,?,?,?,?)',[offering.id,day,String(10+h)+':00',String(11+h)+':00','Room '+cl.room_id]);
  }
  for(const b of bookings.filter(b=>seedBookings.has(b.id)&&b.class_id===cl.id)){
   const subject=(i+3)%10,offering=allOfferings.find(o=>o.class_id===cl.id && o.course_code===codes[subject]);
   await q('UPDATE school_room_bookings SET offering_id=?,teacher_id=? WHERE id=?',[offering.id,teachers[subject].id,b.id]);
  }
 }
 const clashes=await q(`SELECT a.id FROM class_schedules a JOIN school_offering_teachers ta ON ta.offering_id=a.course_offering_id JOIN school_offering_teachers tb ON tb.teacher_id=ta.teacher_id JOIN class_schedules b ON b.course_offering_id=tb.offering_id AND a.id<b.id AND a.day_of_week=b.day_of_week AND a.start_time<b.end_time AND a.end_time>b.start_time WHERE ta.teacher_id IN (${teachers.map(()=>'?').join(',')})`,teachers.map(t=>t.id));
 if(clashes.length)throw Error('Teacher overlap detected; rolling back.');
 const assignments=await q(`SELECT t.teacher_id,COUNT(DISTINCT o.course_id) subjects FROM school_offering_teachers t JOIN course_offerings o ON o.id=t.offering_id WHERE t.teacher_id IN (${teachers.map(()=>'?').join(',')}) GROUP BY t.teacher_id`,teachers.map(t=>t.id));
 if(assignments.length!==10||assignments.some(t=>t.subjects!==1))throw Error('Specialist verification failed.');
 for(const [t,baseline] of Object.entries(before))if(JSON.stringify(await q('SELECT * FROM '+t+' ORDER BY 1'))!==baseline)throw Error('Student or classroom preservation failed.');
 for(const b of bookings.filter(b=>!seedBookings.has(b.id))){const [saved]=await q('SELECT * FROM school_room_bookings WHERE id=?',[b.id]);if(JSON.stringify(b)!==JSON.stringify(saved))throw Error('Custom booking changed.');}
 const [totals]=await q(`SELECT COUNT(*) meetings,COUNT(DISTINCT course_offering_id) class_subjects FROM class_schedules WHERE course_offering_id IN (${allOfferings.map(()=>'?').join(',')})`,allOfferings.map(o=>o.id));
 if(totals.meetings!==360||totals.class_subjects!==60)throw Error('Unexpected routine totals.');
 await q("INSERT INTO school_demo_seeds(seed_key) VALUES('nepal-subject-specialists-v2')");await q('UPDATE school_planning_lock SET version=version+1 WHERE id=1');
 await c.commit();transaction=false;
 console.log(JSON.stringify({teachers:10,subjectsPerTeacher:1,classes:10,subjectsPerClass:6,weeklyLessons:totals.meetings,teacherOverlaps:clashes.length,customBookingsPreserved:bookings.length-seedBookings.size,studentsAndRoomsPreserved:true}));
 console.log(teachers.map((t,i)=>t.name+': '+codes[i]).join('\n'));
 }
}catch(e){if(transaction)await c.rollback();throw e;}finally{await c.end();}

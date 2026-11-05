import mysql from 'mysql2/promise';
if(process.env.CONFIRM_DEMO_TIFFIN!=='1'||!['localhost','127.0.0.1'].includes(process.env.DB_HOST)||process.env.DB_NAME!=='studenthub')throw Error('Explicit local demo tiffin confirmation required.');
const c=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,dateStrings:true});
const q=async(s,a=[]) => (await c.execute(s,a))[0];
try{await c.beginTransaction();await q('SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');
if((await q("SELECT seed_key FROM school_demo_seeds WHERE seed_key='nepal-tiffin-v3'")).length){await c.rollback();console.log('Tiffin already applied.');}
else{
 if(!(await q("SELECT seed_key FROM school_demo_seeds WHERE seed_key='nepal-subject-specialists-v2'")).length)throw Error('Specialist routine must be applied first.');
 const lessons=await q(`SELECT cs.id,l.class_id,l.offering_id FROM class_schedules cs JOIN school_class_offerings l ON l.offering_id=cs.course_offering_id JOIN school_classes cl ON cl.id=l.class_id JOIN school_years y ON y.id=cl.year_id JOIN course_offerings o ON o.id=l.offering_id JOIN courses co ON co.id=o.course_id WHERE y.name='Demo 2026–2027' AND co.course_code LIKE 'DEMO-%' AND cs.start_time='13:00' AND cs.end_time='14:00'`);
 if(lessons.length!==60)throw Error('Expected 60 demo lunchtime lessons. Review first.');
 const [bookings]=await q('SELECT COUNT(*) n FROM school_room_bookings WHERE is_cancelled=0 AND start_time<? AND end_time>?',['14:00','13:00']);if(bookings.n)throw Error('An active room booking overlaps tiffin. Review first.');
 const bookingBefore=JSON.stringify(await q('SELECT * FROM school_room_bookings ORDER BY id'));
 await q(`DELETE FROM class_schedules WHERE id IN (${lessons.map(()=>'?').join(',')})`,lessons.map(l=>l.id));
 for(const link of new Map(lessons.map(l=>[l.offering_id,l])).values()){
  const [uses]=await q('SELECT COUNT(*) n FROM class_schedules WHERE course_offering_id=?',[link.offering_id]);
  const [booked]=await q('SELECT COUNT(*) n FROM school_room_bookings WHERE class_id=? AND offering_id=? AND is_cancelled=0',[link.class_id,link.offering_id]);
  if(!uses.n&&!booked.n)await q('DELETE FROM school_class_offerings WHERE class_id=? AND offering_id=?',[link.class_id,link.offering_id]);
 }
 if(bookingBefore!==JSON.stringify(await q('SELECT * FROM school_room_bookings ORDER BY id')))throw Error('Booking preservation failed.');
 await q("INSERT INTO school_demo_seeds(seed_key) VALUES('nepal-tiffin-v3')");await q('UPDATE school_planning_lock SET version=version+1 WHERE id=1');await c.commit();console.log('Tiffin 13:00-14:00 applied: 60 demo lessons removed; all room bookings preserved.');
}
}catch(e){await c.rollback();throw e;}finally{await c.end();}

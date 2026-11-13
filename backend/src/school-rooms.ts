import { Router } from 'express';
import type { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { ScheduleError } from './schedules.js';
import { isMenuDate } from './canteen-menu.js';
type Change=(revision:unknown,run:(c:PoolConnection)=>Promise<any>)=>Promise<any>;
const dateColumns="DATE_FORMAT(b.starts_on,'%Y-%m-%d') starts_on,DATE_FORMAT(b.ends_on,'%Y-%m-%d') ends_on";
async function rows(c:Pick<Pool,'execute'>,sql:string,values:any[]=[]){return (await c.execute<RowDataPacket[]>(sql,values))[0];}
function id(v:unknown){if(!Number.isSafeInteger(v)||Number(v)<1)throw new ScheduleError(400,'Choose a valid class, subject or room.');return Number(v);}
export function bookingDatesMeet(a:{starts_on:string;ends_on:string;day_of_week:number},b:{starts_on:string;ends_on:string;day_of_week:number}){
  if(a.day_of_week!==b.day_of_week)return false;
  const first=a.starts_on>b.starts_on?a.starts_on:b.starts_on,last=a.ends_on<b.ends_on?a.ends_on:b.ends_on;
  if(first>last)return false;
  const date=new Date(first+'T00:00:00Z'),weekday=date.getUTCDay()||7;
  date.setUTCDate(date.getUTCDate()+(a.day_of_week-weekday+7)%7);
  return date.toISOString().slice(0,10)<=last;
}
async function classRecord(c:PoolConnection,classId:number){
  const [cl]=await rows(c,"SELECT cl.*,DATE_FORMAT(y.start_date,'%Y-%m-%d') year_start,DATE_FORMAT(y.end_date,'%Y-%m-%d') year_end FROM school_classes cl JOIN school_years y ON y.id=cl.year_id WHERE cl.id=?",[classId]);
  if(!cl||!cl.is_active)throw new ScheduleError(400,'Choose an active homeroom class.');return cl;
}
export function schoolRoomRouter(pool:Pool,change:Change){
  const router=Router();
  const floorNumber=(v:unknown)=>{if(!Number.isInteger(v)||Number(v)<0||Number(v)>99)throw new ScheduleError(400,'Enter a floor number from 0 to 99.');return Number(v)};
  const text=(v:unknown,max:number,label:string)=>{if(typeof v!=='string'||!v.trim()||v.trim().length>max)throw new ScheduleError(400,`Enter ${label} up to ${max} characters.`);return v.trim()};
  router.put('/admin/school/floors/:floor',async(req,res)=>{
    const floor=floorNumber(Number(req.params.floor)),label=text(req.body.label,60,'a floor label');
    await change(req.body.revision,async c=>{await c.execute('INSERT INTO school_floors(floor_number,label) VALUES(?,?) ON DUPLICATE KEY UPDATE label=VALUES(label)',[floor,label]);});
    res.json({message:'Floor saved.'});
  });
  router.post('/admin/school/rooms',async(req,res)=>{
    const floor=floorNumber(req.body.floor_number),kind=req.body.kind;
    if(!['regular','special'].includes(kind)||!Array.isArray(req.body.room_numbers)||!req.body.room_numbers.length||req.body.room_numbers.length>50)throw new ScheduleError(400,'Choose a room type and 1–50 room numbers.');
    const numbers=req.body.room_numbers.map((v:unknown)=>text(v,32,'a room number'));
    if(new Set(numbers.map((n:string)=>n.toLowerCase())).size!==numbers.length)throw new ScheduleError(400,'Each room number must be different.');
    await change(req.body.revision,async c=>{
      if(!(await rows(c,'SELECT floor_number FROM school_floors WHERE floor_number=?',[floor])).length)throw new ScheduleError(400,'Create this floor first.');
      const [last]=await rows(c,'SELECT COALESCE(MAX(id),0) id FROM school_rooms');
      const [position]=await rows(c,'SELECT COALESCE(MAX(position_number),0) position FROM school_rooms WHERE floor_number=?',[floor]);
      for(let i=0;i<numbers.length;i++)await c.execute('INSERT INTO school_rooms(id,room_number,floor_number,position_number,kind,name) VALUES(?,?,?,?,?,?)',[Number(last.id)+i+1,numbers[i],floor,Number(position.position)+i+1,kind,(kind==='regular'?'Classroom ':'Special room ')+numbers[i]]);
    });res.status(201).json({message:`${numbers.length} room(s) added.`});
  });
  router.get('/admin/school/rooms',async(_req,res)=>res.json({floors:await rows(pool,'SELECT * FROM school_floors ORDER BY floor_number DESC'),rooms:await rows(pool,'SELECT * FROM school_rooms ORDER BY floor_number DESC,position_number'),assignments:await rows(pool,'SELECT a.*,r.room_number FROM school_class_rooms a JOIN school_rooms r ON r.id=a.room_id'),bookings:await rows(pool,`SELECT b.id,b.room_id,b.class_id,b.offering_id,b.teacher_id,b.day_of_week,TIME_FORMAT(b.start_time,'%H:%i') start_time,TIME_FORMAT(b.end_time,'%H:%i') end_time,${dateColumns},b.repeats_weekly,b.is_cancelled,r.room_number,c.course_name,t.name teacher_name FROM school_room_bookings b JOIN school_rooms r ON r.id=b.room_id JOIN course_offerings co ON co.id=b.offering_id JOIN courses c ON c.id=co.course_id JOIN school_teachers t ON t.id=b.teacher_id ORDER BY b.starts_on,b.start_time,b.id`)}));
  router.put('/admin/school/rooms/:id',async(req,res)=>{
    const roomId=id(Number(req.params.id)),name=req.body.name;
    if(typeof name!=='string'||!name.trim()||name.trim().length>100)throw new ScheduleError(400,'Enter a room name up to 100 characters.');
    await change(req.body.revision,async c=>{
      const [room]=await rows(c,'SELECT * FROM school_rooms WHERE id=?',[roomId]);if(!room)throw new ScheduleError(404,'Room not found.');
      const number=req.body.room_number===undefined?room.room_number:text(req.body.room_number,32,'a room number');
      const floor=req.body.floor_number===undefined?room.floor_number:floorNumber(req.body.floor_number),kind=req.body.kind??room.kind;
      if(!['regular','special'].includes(kind))throw new ScheduleError(400,'Choose a valid room type.');
      if(!(await rows(c,'SELECT floor_number FROM school_floors WHERE floor_number=?',[floor])).length)throw new ScheduleError(400,'Choose an existing floor.');
      if(kind!==room.kind && ((await rows(c,'SELECT room_id FROM school_class_rooms WHERE room_id=? LIMIT 1',[roomId])).length||(await rows(c,'SELECT id FROM school_room_bookings WHERE room_id=? LIMIT 1',[roomId])).length))throw new ScheduleError(409,'This room has assignments or booking history. Keep its current room type.');
      const position=floor===room.floor_number?room.position_number:Number((await rows(c,'SELECT COALESCE(MAX(position_number),0)+1 position FROM school_rooms WHERE floor_number=?',[floor]))[0].position);
      await c.execute('UPDATE school_rooms SET name=?,room_number=?,floor_number=?,position_number=?,kind=? WHERE id=?',[name.trim(),number,floor,position,kind,roomId]);
    });res.json({message:'Room details saved.'});
  });
  router.post('/admin/school/room-assignments',async(req,res)=>{
    const classId=id(req.body.class_id),roomId=id(req.body.room_id);
    await change(req.body.revision,async c=>{
      const cl=await classRecord(c,classId),[room]=await rows(c,'SELECT kind FROM school_rooms WHERE id=?',[roomId]);
      if(!room||room.kind!=='regular')throw new ScheduleError(400,'Choose a regular classroom for the usual class assignment.');
      const [occupied]=await rows(c,'SELECT cl.grade_label,cl.name FROM school_class_rooms a JOIN school_classes cl ON cl.id=a.class_id WHERE a.year_id=? AND a.room_id=? AND a.class_id<>?',[cl.year_id,roomId,classId]);
      if(occupied)throw new ScheduleError(409,`Room ${roomId} already belongs to Grade ${occupied.grade_label} Class ${occupied.name} for this year.`);
      await c.execute('INSERT INTO school_class_rooms(year_id,class_id,room_id) VALUES(?,?,?) ON DUPLICATE KEY UPDATE room_id=VALUES(room_id)',[cl.year_id,classId,roomId]);
    });res.json({message:'Usual classroom assigned for this academic year.'});
  });
  router.delete('/admin/school/room-assignments/:classId',async(req,res)=>{
    await change(req.body.revision,async c=>{const [r]=await c.execute<ResultSetHeader>('DELETE FROM school_class_rooms WHERE class_id=?',[id(Number(req.params.classId))]);if(!r.affectedRows)throw new ScheduleError(404,'This class has no usual classroom assignment.');});res.json({message:'Usual classroom assignment removed.'});
  });
  router.post('/admin/school/room-bookings',async(req,res)=>{
    const v=req.body,classId=id(v.class_id),roomId=id(v.room_id),offeringId=id(v.offering_id),teacherId=id(v.teacher_id);
    if(!isMenuDate(v.starts_on)||!isMenuDate(v.ends_on)||v.starts_on>v.ends_on||!Number.isInteger(v.day_of_week)||v.day_of_week<1||v.day_of_week>7||typeof v.repeats_weekly!=='boolean')throw new ScheduleError(400,'Choose valid booking dates and a weekday.');
    const validTime=(t:unknown)=>typeof t==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t);
    if(!validTime(v.start_time)||!validTime(v.end_time)||v.start_time>=v.end_time)throw new ScheduleError(400,'Choose start and end times in order on the same day.');
    if(!v.repeats_weekly && v.starts_on!==v.ends_on)throw new ScheduleError(400,'A one-time booking needs a single date.');
    if(!bookingDatesMeet(v,v))throw new ScheduleError(400,'The date range does not contain the chosen weekday.');
    const bookingId=await change(v.revision,async c=>{
      const cl=await classRecord(c,classId),[room]=await rows(c,'SELECT kind FROM school_rooms WHERE id=?',[roomId]);
      if(!room||room.kind!=='special')throw new ScheduleError(400,'Use a special room for a time-based booking.');
      if(v.starts_on<cl.year_start||v.ends_on>cl.year_end)throw new ScheduleError(400,'Booking dates must fit inside the class academic year.');
      const [subject]=await rows(c,"SELECT DATE_FORMAT(s.start_date,'%Y-%m-%d') term_start,DATE_FORMAT(s.end_date,'%Y-%m-%d') term_end FROM school_class_offerings link JOIN course_offerings co ON co.id=link.offering_id JOIN school_terms st ON st.semester_id=co.semester_id JOIN semesters s ON s.id=co.semester_id WHERE link.class_id=? AND co.id=? AND st.year_id=?",[classId,offeringId,cl.year_id]);
      if(!subject)throw new ScheduleError(400,'Choose a subject linked to this class and academic year.');
      if(v.starts_on<subject.term_start||v.ends_on>subject.term_end)throw new ScheduleError(400,'Booking dates must fit inside the selected subject term.');
      if(!(await rows(c,'SELECT id FROM school_teachers WHERE id=? AND is_active=1',[teacherId])).length)throw new ScheduleError(400,'Choose an active teacher.');
      const overlaps=await rows(c,`SELECT b.*,${dateColumns},r.name room_name,cl.grade_label,cl.name class_name FROM school_room_bookings b JOIN school_rooms r ON r.id=b.room_id JOIN school_classes cl ON cl.id=b.class_id WHERE b.is_cancelled=0 AND (b.room_id=? OR b.class_id=? OR b.teacher_id=?) AND b.day_of_week=? AND b.start_time<? AND b.end_time>? AND b.starts_on<=? AND b.ends_on>=?`,[roomId,classId,teacherId,v.day_of_week,v.end_time,v.start_time,v.ends_on,v.starts_on]);
      const conflict=overlaps.find(b=>bookingDatesMeet(v,b as any));
      if(conflict)throw new ScheduleError(409,`Booking conflicts with ${conflict.room_name} (${conflict.room_id}), Grade ${conflict.grade_label} Class ${conflict.class_name}. Choose another time.`);
      const teaching=await rows(c,`SELECT cs.day_of_week,DATE_FORMAT(s.start_date,'%Y-%m-%d') starts_on,DATE_FORMAT(s.end_date,'%Y-%m-%d') ends_on FROM school_offering_teachers ot JOIN course_offerings co ON co.id=ot.offering_id JOIN semesters s ON s.id=co.semester_id JOIN class_schedules cs ON cs.course_offering_id=co.id WHERE ot.teacher_id=? AND cs.day_of_week=? AND cs.start_time<? AND cs.end_time>? AND NOT EXISTS (SELECT 1 FROM school_class_offerings l WHERE l.offering_id=co.id AND l.class_id=?)`,[teacherId,v.day_of_week,v.end_time,v.start_time,classId]);
      if(teaching.some(m=>bookingDatesMeet(v,m as any)))throw new ScheduleError(409,'This teacher is teaching another class at that time.');
      const [r]=await c.execute<ResultSetHeader>('INSERT INTO school_room_bookings(room_id,class_id,offering_id,teacher_id,day_of_week,start_time,end_time,starts_on,ends_on,repeats_weekly) VALUES(?,?,?,?,?,?,?,?,?,?)',[roomId,classId,offeringId,teacherId,v.day_of_week,v.start_time,v.end_time,v.starts_on,v.ends_on,v.repeats_weekly?1:0]);return r.insertId;
    });res.status(201).json({id:bookingId,message:'Special-room booking saved.'});
  });
  router.put('/admin/school/room-bookings/:id/cancel',async(req,res)=>{
    await change(req.body.revision,async c=>{const [r]=await c.execute<ResultSetHeader>('UPDATE school_room_bookings SET is_cancelled=1 WHERE id=? AND is_cancelled=0',[id(Number(req.params.id))]);if(!r.affectedRows)throw new ScheduleError(404,'Active booking not found.');});res.json({message:'Booking cancelled. Its record is retained.'});
  });
  return router;
}

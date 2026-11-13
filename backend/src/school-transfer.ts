import {Router} from 'express';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {zipSync,unzipSync,strToU8,strFromU8} from 'fflate';
import type {Pool,PoolConnection,RowDataPacket} from 'mysql2/promise';
import {ScheduleError} from './schedules.js';
import {bookingDatesMeet} from './school-rooms.js';
import {isMenuDate,menuItems} from './canteen-menu.js';
import {validateInfo} from './canteen-info.js';

// Explicit domain allowlist: never transfer credentials, sessions, reset requests or audit history.
type Spec={table:string;fields:string[];key:string[];refs?:Record<string,string>;singleton?:boolean};
const spec=(table:string,fields:string,key:string,refs:Record<string,string>={},singleton=false):Spec=>({table,fields:fields.split(','),key:key.split(','),refs,singleton});
export const transferSpecs:Spec[]=[
 spec('school_profile','id,name,level','id',{},true),
 spec('school_years','id,name,start_date,end_date','name'),
 spec('semesters','id,name,academic_year,start_date,end_date','name,academic_year'),
 spec('school_terms','semester_id,year_id','semester_id',{semester_id:'semesters',year_id:'school_years'}),
 spec('school_classes','id,year_id,grade_label,name,is_active','year_id,grade_label,name',{year_id:'school_years'}),
 spec('school_teachers','id,staff_code,name,is_active','staff_code'),
 spec('users','id,login_id,role','login_id'),
 spec('student_profiles','user_id,full_name,university,major,year_of_study,email,phone_number,address','user_id',{user_id:'users'}),
 spec('school_teacher_accounts','user_id,teacher_id','user_id',{user_id:'users',teacher_id:'school_teachers'}),
 spec('courses','id,course_code,course_name,credits,description','course_code'),
 spec('school_grade_subjects','year_id,grade_label,course_id','year_id,grade_label,course_id',{year_id:'school_years',course_id:'courses'}),
 spec('course_offerings','id,course_id,semester_id,major,professor,section','course_id,semester_id,major,section',{course_id:'courses',semester_id:'semesters'}),
 spec('school_class_offerings','class_id,offering_id','class_id,offering_id',{class_id:'school_classes',offering_id:'course_offerings'}),
 spec('school_offering_teachers','offering_id,teacher_id','offering_id',{offering_id:'course_offerings',teacher_id:'school_teachers'}),
 spec('class_schedules','id,course_offering_id,day_of_week,start_time,end_time,location','course_offering_id,day_of_week,start_time,end_time',{course_offering_id:'course_offerings'}),
 spec('school_memberships','id,student_user_id,year_id,class_id,starts_on,ends_on','student_user_id,year_id,starts_on',{student_user_id:'users',year_id:'school_years',class_id:'school_classes'}),
 spec('student_semesters','student_user_id,semester_id','student_user_id,semester_id',{student_user_id:'users',semester_id:'semesters'}),
 spec('enrollments','student_user_id,course_offering_id','student_user_id,course_offering_id',{student_user_id:'users',course_offering_id:'course_offerings'}),
 spec('school_floors','floor_number,label','floor_number'),
 spec('school_rooms','id,room_number,floor_number,position_number,kind,name','room_number'),
 spec('school_class_rooms','year_id,class_id,room_id','year_id,class_id',{year_id:'school_years',class_id:'school_classes',room_id:'school_rooms'}),
 spec('school_room_bookings','id,room_id,class_id,offering_id,teacher_id,day_of_week,start_time,end_time,starts_on,ends_on,repeats_weekly,is_cancelled','room_id,class_id,offering_id,starts_on,day_of_week,start_time,end_time',{room_id:'school_rooms',class_id:'school_classes',offering_id:'course_offerings',teacher_id:'school_teachers'}),
 spec('canteen_info','id,name,location,hours,notice_date,notice,closed_for_notice,published','id',{},true),
 spec('canteen_menus','service_date,published,currency,items','service_date'),
];
export function encodeCsv(rows:(string|number|null)[][]){
 const cell=(v:string|number|null)=>{let s=v===null?'\\N':String(v);if(v!==null&&s.startsWith('\\'))s='\\'+s;if(/^[=+\-@\t\r']/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
 return '\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
}
export function decodeCsv(input:string):(string|null)[][]{
 const s=input.replace(/^\uFEFF/,'');let row:string[]=[],cell='',quoted=false,after=false;const result:(string|null)[][]=[];
 const push=()=>{row.push(cell);cell='';after=false};
 const finish=()=>{push();result.push(row.map(v=>v==='\\N'?null:v.startsWith('\\\\')?v.slice(1):/^'[=+\-@\t\r']/.test(v)?v.slice(1):v));row=[];if(result.length>20001)throw new ScheduleError(400,'A CSV may contain at most 20,000 records.');};
 for(let i=0;i<s.length;i++){const ch=s[i];if(quoted){if(ch==='"'){if(s[i+1]==='"'){cell+='"';i++}else{quoted=false;after=true}}else cell+=ch;continue}
 if(ch==='"'){if(cell||after)throw new ScheduleError(400,'Invalid CSV quotation.');quoted=true}
 else if(ch===',')push();else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&s[i+1]==='\n')i++;finish()}
 else{if(after)throw new ScheduleError(400,'Unexpected text after a CSV quote.');cell+=ch}
 if(cell.length>100000)throw new ScheduleError(400,'A CSV cell is too long.');
 }
 if(quoted)throw new ScheduleError(400,'An unclosed CSV quote was found.');if(cell||row.length||after)finish();return result;
}
type Column={Field:string;Type:string;Null:string;Key:string;Extra:string};
type Dataset=Record<string,Record<string,any>[]>;
async function query(c:Pick<Pool,'query'>,sql:string,values:any[]=[]):Promise<any[]>{return (await c.query<RowDataPacket[]>(sql,values))[0]}
async function structure(c:PoolConnection){const result:Record<string,Column[]>={};const names=new Set((await query(c,'SHOW TABLES')).map(r=>String(Object.values(r)[0])));for(const s of transferSpecs)if(names.has(s.table))result[s.table]=await query(c,`SHOW COLUMNS FROM \`${s.table}\``);return result}
const fields=(s:Spec,meta:Record<string,Column[]>)=>s.fields.filter(f=>meta[s.table]?.some(col=>col.Field===f));
function normalized(v:any,col:Column){if(v===null)return null;if(col.Type==='json')return typeof v==='string'?JSON.stringify(JSON.parse(v)):JSON.stringify(v);if(v instanceof Date)return v.toISOString().slice(0,10);return v;}
async function snapshot(c:PoolConnection,meta:Record<string,Column[]>,lock=false){const data:Dataset={};for(const s of transferSpecs){if(!meta[s.table])continue;const f=fields(s,meta);const rows=await query(c,`SELECT ${f.map(f=>meta[s.table].find(col=>col.Field===f)?.Type==='date'?"DATE_FORMAT(`"+f+"`,'%Y-%m-%d') AS `"+f+"`":'`'+f+'`').join(',')} FROM \`${s.table}\`${s.table==='users'?" WHERE role<>'admin'":''} ORDER BY ${(meta[s.table].some(col=>col.Key==='PRI')?meta[s.table].filter(col=>col.Key==='PRI').map(col=>col.Field):s.key).map(field=>'`'+field+'`').join(',')}${lock?' FOR UPDATE':''}`);data[s.table]=rows.map(row=>Object.fromEntries(f.map(f=>[f,normalized(row[f],meta[s.table].find(c=>c.Field===f)!)])))}return data}
const digest=(data:Dataset)=>createHash('sha256').update(JSON.stringify(data)).digest('hex');
const key=(r:Record<string,any>,cols:string[])=>JSON.stringify(cols.map(k=>r[k]));
function value(raw:string|null,col:Column,label:string){
 if(raw===null){if(col.Null!=='YES')throw new ScheduleError(400,label+' cannot be null.');return null}
 if(/int|decimal|float|double/.test(col.Type)){if(['is_active','published','closed_for_notice','repeats_weekly','is_cancelled'].includes(col.Field)&&!['0','1'].includes(raw))throw new ScheduleError(400,label+' must be 0 or 1.');if(!/^\d+(\.\d+)?$/.test(raw)||!Number.isFinite(Number(raw))||Number(raw)>4294967295||(/int/.test(col.Type)&&!Number.isSafeInteger(Number(raw))))throw new ScheduleError(400,label+' must be a non-negative number.');return Number(raw)}
 if(col.Type==='date'&&!isMenuDate(raw))throw new ScheduleError(400,label+' needs a valid YYYY-MM-DD date.');
 if(col.Type.startsWith('time')&&!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(raw))throw new ScheduleError(400,label+' needs a valid time.');
 const length=col.Type.match(/(?:var)?char\((\d+)\)/);if(length&&[...raw].length>Number(length[1]))throw new ScheduleError(400,label+' is too long.');
 if(col.Type.startsWith('enum(')){const options=[...col.Type.matchAll(/'([^']*)'/g)].map(m=>m[1]);if(!options.includes(raw))throw new ScheduleError(400,label+' has an invalid option.');}
 if(col.Type==='json'){try{return JSON.stringify(JSON.parse(raw))}catch{throw new ScheduleError(400,label+' needs valid JSON.')}}
 return raw;
}
export function readPackage(encoded:unknown){
 if(typeof encoded!=='string'||encoded.length>8_000_000||!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded))throw new ScheduleError(400,'Choose a ZIP package up to 6 MB.');
 let total=0,count=0;let files:Record<string,Uint8Array>;const names=new Set<string>();
 try{files=unzipSync(Buffer.from(encoded,'base64'),{filter:f=>{total+=f.originalSize;count++;if(total>20_000_000||count>40||names.has(f.name)||f.name.includes('/')||f.name.includes('\\'))throw Error('Archive size or path');names.add(f.name);return true}})}catch{throw new ScheduleError(400,'Invalid ZIP, duplicate files, unsafe paths or package too large (20 MB expanded).')}
 if(!files['manifest.json'])throw new ScheduleError(400,'The ZIP needs its StudentHub manifest.json.');
 let manifest:any;try{manifest=JSON.parse(strFromU8(files['manifest.json']))}catch{throw new ScheduleError(400,'Invalid package manifest.');}
 if(manifest.format!=='studenthub-csv-v1'||typeof manifest.source!=='string')throw new ScheduleError(400,'Unsupported StudentHub package.');
 const allowed=new Set(['manifest.json','README.txt',...transferSpecs.map(s=>s.table+'.csv')]);for(const name of Object.keys(files))if(!allowed.has(name))throw new ScheduleError(400,'Unsupported file: '+name);
 return {manifest,files};
}
async function validateDomain(c:PoolConnection,changed:Set<string>){
 const invalid=async(sql:string,message:string)=>{if(![...changed].some(t=>sql.includes(t)))return;if((await query(c,sql+' LIMIT 1')).length)throw new ScheduleError(400,message)};
 await invalid('SELECT id FROM school_years WHERE start_date>end_date','Academic year dates must be in order.');
 await invalid('SELECT id FROM semesters WHERE start_date>end_date','Term dates must be in order.');
 await invalid('SELECT st.semester_id FROM school_terms st JOIN semesters s ON s.id=st.semester_id JOIN school_years y ON y.id=st.year_id WHERE s.start_date<y.start_date OR s.end_date>y.end_date','Terms must fit inside their academic year.');
 await invalid('SELECT m.id FROM school_memberships m JOIN school_classes cl ON cl.id=m.class_id JOIN school_years y ON y.id=m.year_id JOIN users u ON u.id=m.student_user_id WHERE cl.year_id<>m.year_id OR u.role<>\'student\' OR m.starts_on<y.start_date OR m.starts_on>y.end_date OR m.ends_on<m.starts_on OR m.ends_on>y.end_date','Check student membership class, role and dates.');
 await invalid("SELECT a.user_id FROM school_teacher_accounts a JOIN users u ON u.id=a.user_id WHERE u.role<>'teacher'",'Teacher login links need teacher accounts.');
 await invalid('SELECT p.user_id FROM student_profiles p JOIN users u ON u.id=p.user_id WHERE u.role<>\'student\'','Student profiles need student accounts.');
 await invalid("SELECT r.id FROM school_rooms r LEFT JOIN school_floors f ON f.floor_number=r.floor_number WHERE f.floor_number IS NULL OR r.floor_number<0 OR r.floor_number>99 OR r.position_number<1 OR TRIM(r.room_number)=''",'Every room needs an existing floor and a unique non-empty room number.');
 await invalid("SELECT a.room_id FROM school_class_rooms a JOIN school_classes cl ON cl.id=a.class_id JOIN school_rooms r ON r.id=a.room_id WHERE cl.year_id<>a.year_id OR r.kind<>'regular'",'Usual classroom assignments need a regular room and the matching academic year.');
 await invalid('SELECT id FROM class_schedules WHERE start_time>=end_time OR day_of_week<1 OR day_of_week>7','Lesson days and times must be valid.');
 await invalid('SELECT id FROM school_room_bookings WHERE start_time>=end_time OR starts_on>ends_on OR day_of_week<1 OR day_of_week>7 OR (repeats_weekly=0 AND starts_on<>ends_on)','Room bookings need valid days and ordered times on one date.');
 const menus=changed.has('canteen_menus')?await query(c,'SELECT * FROM canteen_menus'):[];for(const m of menus){if(!['NPR','KRW'].includes(m.currency))throw new ScheduleError(400,'Canteen currency must be NPR or KRW.');const items=typeof m.items==='string'?JSON.parse(m.items):m.items;menuItems(items,items)}
 const info=changed.has('canteen_info')?await query(c,'SELECT * FROM canteen_info'):[];for(const r of info)validateInfo({...r,hours:typeof r.hours==='string'?JSON.parse(r.hours):r.hours,notice_date:r.notice_date instanceof Date?r.notice_date.toISOString().slice(0,10):r.notice_date,published:!!r.published,closed_for_notice:!!r.closed_for_notice,version:Number(r.version)});
 if(['class_schedules','school_offering_teachers','school_class_offerings','semesters'].some(t=>changed.has(t))){
  const lessons=await query(c,"SELECT cs.*,l.class_id,ot.teacher_id,DATE_FORMAT(s.start_date,'%Y-%m-%d') starts_on,DATE_FORMAT(s.end_date,'%Y-%m-%d') ends_on FROM class_schedules cs JOIN course_offerings co ON co.id=cs.course_offering_id JOIN semesters s ON s.id=co.semester_id JOIN school_class_offerings l ON l.offering_id=co.id LEFT JOIN school_offering_teachers ot ON ot.offering_id=co.id");
  for(let i=0;i<lessons.length;i++)for(let j=i+1;j<lessons.length;j++){const a=lessons[i],b=lessons[j];if((a.class_id===b.class_id||(a.teacher_id&&a.teacher_id===b.teacher_id))&&a.start_time<b.end_time&&a.end_time>b.start_time&&bookingDatesMeet(a,b))throw new ScheduleError(409,'The import creates overlapping class or teacher lessons. No records were saved.');}
 }
 if(['school_room_bookings','class_schedules','school_offering_teachers','school_class_offerings','semesters','school_rooms'].some(t=>changed.has(t))){
  await invalid("SELECT b.id FROM school_room_bookings b JOIN school_rooms r ON r.id=b.room_id JOIN school_classes cl ON cl.id=b.class_id JOIN school_years y ON y.id=cl.year_id JOIN course_offerings co ON co.id=b.offering_id JOIN semesters s ON s.id=co.semester_id WHERE b.is_cancelled=0 AND (r.kind<>'special' OR b.starts_on<y.start_date OR b.ends_on>y.end_date OR b.starts_on<s.start_date OR b.ends_on>s.end_date OR NOT EXISTS(SELECT 1 FROM school_class_offerings l WHERE l.class_id=b.class_id AND l.offering_id=b.offering_id))",'A room booking needs the correct special room, class subject and term dates.');
  const bookings=await query(c,"SELECT *,DATE_FORMAT(starts_on,'%Y-%m-%d') starts_on,DATE_FORMAT(ends_on,'%Y-%m-%d') ends_on FROM school_room_bookings WHERE is_cancelled=0");
  const lessons=await query(c,"SELECT cs.*,ot.teacher_id,DATE_FORMAT(s.start_date,'%Y-%m-%d') starts_on,DATE_FORMAT(s.end_date,'%Y-%m-%d') ends_on FROM class_schedules cs JOIN course_offerings co ON co.id=cs.course_offering_id JOIN semesters s ON s.id=co.semester_id JOIN school_offering_teachers ot ON ot.offering_id=co.id");
  const links=await query(c,'SELECT * FROM school_class_offerings');
  for(let i=0;i<bookings.length;i++){const a=bookings[i];if(!bookingDatesMeet(a,a))throw new ScheduleError(400,'A booking date does not contain its weekday.');
   for(let j=i+1;j<bookings.length;j++){const b=bookings[j];if((a.room_id===b.room_id||a.class_id===b.class_id||a.teacher_id===b.teacher_id)&&a.start_time<b.end_time&&a.end_time>b.start_time&&bookingDatesMeet(a,b))throw new ScheduleError(409,'The import creates overlapping room bookings. No records were saved.');}
   if(lessons.some(b=>a.teacher_id===b.teacher_id&&!links.some(l=>l.class_id===a.class_id&&l.offering_id===b.course_offering_id)&&a.start_time<b.end_time&&a.end_time>b.start_time&&bookingDatesMeet(a,b)))throw new ScheduleError(409,'A supervising teacher is teaching another class during this booking.');
  }
 }
}
export function schoolTransferRouter(pool:Pool){
 const router=Router();
 type Preview={user:number;expires:number;encoded:string;hash:string};const pending=new Map<string,Preview>();
 async function identity(c:PoolConnection){return (await query(c,'SELECT identity FROM school_transfer_identity WHERE id=1'))[0].identity as string}
 async function apply(c:PoolConnection,encoded:string,meta:Record<string,Column[]>,before:Dataset,sameSource:boolean){
  const {files}=readPackage(encoded),maps:Record<string,Map<any,any>>={},summary:any[]=[];let totalRows=0;
  for(const s of transferSpecs){const bytes=files[s.table+'.csv'];if(!bytes)continue;if(!meta[s.table])throw new ScheduleError(400,'This installation does not support '+s.table);
   const csv=decodeCsv(strFromU8(bytes)),header=csv.shift();const f=fields(s,meta);
   if(!header||header.length!==f.length||new Set(header).size!==header.length||f.some(field=>!header.includes(field)))throw new ScheduleError(400,s.table+': keep the exported column headers.');
   totalRows+=csv.length;if(totalRows>20000)throw new ScheduleError(400,'A package may contain at most 20,000 records.');
   const pk=meta[s.table].some(col=>col.Key==='PRI')?meta[s.table].filter(col=>col.Key==='PRI').map(col=>col.Field):s.key;const existing=before[s.table]??[];let nextId=Math.max(0,...existing.map(r=>Number(r.id)||0))+1;
   if(s.table==='users')nextId=Number((await query(c,'SELECT COALESCE(MAX(id),0)+1 next_id FROM users'))[0].next_id);
   const map=new Map<any,any>();maps[s.table]=map;const seen=new Set<string>();let added=0,updated=0,unchanged=0;
   for(let i=0;i<csv.length;i++){
    const line=csv[i];if(line.length!==header.length)throw new ScheduleError(400,`${s.table} row ${i+2}: column count differs.`);
    const row:Record<string,any>={};for(let j=0;j<header.length;j++){const field=header[j]!;row[field]=value(line[j],meta[s.table].find(col=>col.Field===field)!,`${s.table} row ${i+2}, ${field}`)}
    for(const field of f){if((field==='id'||field.endsWith('_id'))&&row[field]!==null&&row[field]<1)throw new ScheduleError(400,`${s.table} row ${i+2}: identifiers must be positive.`);if(['name','full_name','staff_code','login_id','course_code','course_name','grade_label','room_number','label'].includes(field)&&!String(row[field]??'').trim())throw new ScheduleError(400,`${s.table} row ${i+2}: ${field} is required.`);}
    const sourceId=row.id,sourceKey=sourceId??(pk.length===1?row[pk[0]]:undefined);for(const [field,target]of Object.entries(s.refs??{})){const mapped=maps[target]?.get(row[field]);if(mapped===undefined)throw new ScheduleError(400,`${s.table} row ${i+2}: include the referenced ${target} record (${row[field]}).`);row[field]=mapped}
    if(s.singleton&&row.id!==1)throw new ScheduleError(400,s.table+' must use id 1.');
    if(s.table==='users'&&!['student','teacher','canteen_head'].includes(row.role))throw new ScheduleError(400,'Administrator accounts cannot be imported.');
    if(s.table==='users'&&(await query(c,"SELECT id FROM users WHERE login_id=? AND role='admin'",[row.login_id])).length)throw new ScheduleError(400,'An imported login conflicts with an administrator.');
    const match=(sameSource&&sourceId!==undefined?existing.find(r=>r.id===sourceId):undefined)??existing.find(r=>key(r,s.key)===key(row,s.key));
    if(s.table==='users'&&match&&match.login_id!==row.login_id)throw new ScheduleError(400,'Change existing login IDs in Accounts, not through CSV import.');
    if(s.table==='users'&&match&&match.role!==row.role)throw new ScheduleError(400,'Existing account roles cannot be changed by import.');
    if(s.table==='school_rooms'&&match&&match.kind!==row.kind&&((await query(c,'SELECT room_id FROM school_class_rooms WHERE room_id=? LIMIT 1',[match.id])).length||(await query(c,'SELECT id FROM school_room_bookings WHERE room_id=? LIMIT 1',[match.id])).length))throw new ScheduleError(409,'A room with assignment or booking history must keep its current type.');
    if(row.id!==undefined)row.id=match?.id??(s.singleton?1:nextId++);
    const rowKey=key(row,pk);if(seen.has(rowKey))throw new ScheduleError(400,s.table+': duplicate records in the CSV.');seen.add(rowKey);
    const referenceKey=sourceKey;if(referenceKey!==undefined){if(map.has(referenceKey))throw new ScheduleError(400,s.table+': duplicate source identifiers.');map.set(referenceKey,pk.length===1?row[pk[0]]:row.id)}
    if(match&&f.every(field=>match[field]===null||row[field]===null?match[field]===row[field]:/int|decimal|float|double/.test(meta[s.table].find(c=>c.Field===field)!.Type)?Number(match[field])===Number(row[field]):String(match[field])===String(row[field]))){unchanged++;continue}
    if(s.table==='users'&&!match&&added>=500)throw new ScheduleError(400,'Import at most 500 new login accounts at a time.');
    const cols=[...f],values=cols.map(f=>row[f]);
    if(s.table==='users'&&!match){cols.push('password_hash','is_active');values.push(await bcrypt.hash(randomBytes(32).toString('hex'),10),0)}
    if(['canteen_info','canteen_menus'].includes(s.table)){cols.push('version');values.push(Number((await query(c,`SELECT version FROM \`${s.table}\` WHERE \`${pk[0]}\`=?`,[row[pk[0]]]))[0]?.version??0)+1)}
    if(match){const updates=cols.filter(f=>!pk.includes(f));await c.query(`UPDATE \`${s.table}\` SET ${updates.map(f=>'`'+f+'`=?').join(',')} WHERE ${pk.map(f=>'`'+f+'`=?').join(' AND ')}`,[...updates.map(f=>values[cols.indexOf(f)]),...pk.map(f=>row[f])]);updated++}
    else{await c.query(`INSERT INTO \`${s.table}\` (${cols.map(f=>'`'+f+'`').join(',')}) VALUES (${cols.map(()=>'?').join(',')})`,values);added++}
   }
   summary.push({table:s.table,added,updated,unchanged});
  }
  await validateDomain(c,new Set(summary.filter(s=>s.added||s.updated).map(s=>s.table)));return summary;
 }
 router.get('/admin/school/transfer/export',async(_req,res)=>{
  const c=await pool.getConnection();try{await c.beginTransaction();const meta=await structure(c),data=await snapshot(c,meta);const files:Record<string,Uint8Array>={};
   files['manifest.json']=strToU8(JSON.stringify({format:'studenthub-csv-v1',source:await identity(c),exported_at:new Date().toISOString(),excluded:['passwords','administrator accounts','sessions','password reset requests','audit history','homework and attendance','job favourites']}));
   files['README.txt']=strToU8('Edit the CSVs, keep headers and referenced records. UTF-8 CSV, dates YYYY-MM-DD, null = \\N. Room id stays fixed; edit room_number for labels. Import adds/updates and retains unlisted records. New logins are disabled with an unknown random password: set a password and enable them in Accounts. Administrator logins, credentials, audit history, homework/attendance and job favourites are excluded. This is a school-data transfer package, not a full database backup. Keep it private: it contains student contact information.');
   for(const s of transferSpecs)if(data[s.table]){const f=fields(s,meta);files[s.table+'.csv']=strToU8(encodeCsv([f,...data[s.table].map(r=>f.map(f=>r[f]))]));}
   await c.commit();res.type('application/zip').attachment('studenthub-school-data.zip').send(Buffer.from(zipSync(files)));
  }catch(e){await c.rollback();throw e}finally{c.release()}
 });
 router.post('/admin/school/transfer/preview',async(req,res)=>{
  for(const [token,p]of pending)if(p.expires<Date.now()||p.user===res.locals.user.id)pending.delete(token);
  if(pending.size>=20)throw new ScheduleError(429,'Too many previews. Try again shortly.');
  const encoded=req.body?.package;const {manifest}=readPackage(encoded);const c=await pool.getConnection();
  try{await c.beginTransaction();const meta=await structure(c),before=await snapshot(c,meta),summary=await apply(c,encoded,meta,before,manifest.source===await identity(c));await c.rollback();
   const token=randomUUID();pending.set(token,{user:res.locals.user.id,expires:Date.now()+10*60_000,encoded,hash:digest(before)});res.json({token,summary,expires_in:600,message:'Preview only. No school records saved. Unlisted records will be kept. New login accounts will be disabled until you set their password and enable access.'});
  }catch(e){await c.rollback();transferError(e)}finally{c.release()}
 });
 router.post('/admin/school/transfer/apply',async(req,res)=>{
  const p=pending.get(req.body?.token);if(!p||p.user!==res.locals.user.id||p.expires<Date.now())throw new ScheduleError(409,'Preview expired. Upload and preview the package again.');
  const c=await pool.getConnection();try{await c.beginTransaction();await c.query('SELECT version FROM school_planning_lock WHERE id=1 FOR UPDATE');const meta=await structure(c),before=await snapshot(c,meta,true);if(digest(before)!==p.hash)throw new ScheduleError(409,'School data changed after your preview. Preview again before importing.');
   const {manifest}=readPackage(p.encoded);const summary=await apply(c,p.encoded,meta,before,manifest.source===await identity(c));await c.query('UPDATE school_planning_lock SET version=version+1 WHERE id=1');await c.commit();pending.delete(req.body.token);res.json({summary,message:'Import completed. Unlisted records were kept.'});
  }catch(e){await c.rollback();transferError(e)}finally{c.release()}
 });
 return router;
}
function transferError(e:any):never{if(e instanceof ScheduleError)throw e;if(e.code==='ER_DUP_ENTRY')throw new ScheduleError(409,'The file conflicts with an existing unique record. No records were saved.');if(e.code?.startsWith('ER_'))throw new ScheduleError(400,'A record or relationship is invalid. Check the CSV references and field values. No records were saved.');throw e}

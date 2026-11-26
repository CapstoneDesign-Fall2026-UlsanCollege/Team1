import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';
import {teacherWorkspaceRouter} from '../dist/teacher-workspace.js';

test('class notices enforce teacher class/ownership, stale writes and student publication scope',async()=>{
 const hash=await bcrypt.hash('fictional-password',4),users=['teacher','student','admin'].map((role,i)=>({id:i+1,login_id:role,role,password_hash:hash,is_active:1}));
 let saved=null,rolledBack=0,inserts=0;
 const db={beginTransaction:async()=>{},commit:async()=>{},rollback:async()=>{rolledBack++},release:()=>{},execute:async(sql,a=[])=>{
  if(sql.includes('school_planning_lock'))return [[]];
  if(sql.includes('school_teacher_accounts a JOIN'))return [[{id:10,name:'Test teacher',staff_code:'T1'}]];
  if(sql.includes('FROM school_offering_teachers ot'))return [[{class_id:20,offering_id:30,term_end:'2027-04-14'},{class_id:21,offering_id:31,term_end:'2027-04-14'}]];
  if(sql.includes('HAVING COUNT'))return [[]];
  if(sql.includes('SELECT DATE_FORMAT(y.start_date'))return [[{start_date:'2026-04-15',end_date:'2027-04-14'}]];
  if(sql.startsWith('INSERT INTO school_class_notices')){inserts++;saved={id:1,class_id:a[0],teacher_id:a[1],title:a[2],message:a[3],starts_on:a[4],ends_on:a[5],published:a[6],version:1};return [{insertId:1}];}
  if(sql.startsWith('UPDATE school_class_notices')){const match=saved&&a[5]===saved.id&&a[6]===saved.class_id&&a[7]===saved.teacher_id&&a[8]===saved.version;if(match)Object.assign(saved,{title:a[0],message:a[1],starts_on:a[2],ends_on:a[3],published:a[4],version:saved.version+1});return [{affectedRows:match?1:0}];}
  if(sql.includes('FROM school_memberships m JOIN users')){assert.match(sql,/m.student_user_id=\?/);assert.match(sql,/u.is_active=1/);assert.match(sql,/m.ends_on IS NULL OR m.ends_on>\?/);return [a[0]===20&&a[1]===2?[{id:2,login_id:'student',full_name:'Test Student',school:'Test School',grade_label:'8',class_name:'A'}]:[]];}
  if(sql.includes('FROM school_class_notices n')){
   if(sql.includes('EXISTS(SELECT 1 FROM school_memberships')){assert.match(sql,/n.published=1/);assert.match(sql,/m.ends_on IS NULL OR m.ends_on>\?/);assert.equal(a[4],2);return [[...(saved?.published&&saved.starts_on<=a[0]&&saved.ends_on>=a[1]?[saved]:[])]];}
   return [[...(saved&&saved.class_id===a[0]?[saved]:[])]];
  }
  throw Error('Unexpected query: '+sql);
 }};db.getConnection=async()=>db;
 const app=createApp({byLogin:async l=>users.find(u=>u.login_id===l),byId:async id=>users.find(u=>u.id===id),teacherWorkspace:invalidate=>teacherWorkspaceRouter(db,invalidate,()=> '2026-11-26')});
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port+'/api';const cookies={};
 async function req(path,role,method='GET',body){return fetch(base+path,{method,headers:{Cookie:cookies[role]??'','X-StudentHub':'1','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});}
 try{
  for(const u of users){const r=await req('/auth/login',null,'POST',{login_id:u.login_id,password:'fictional-password'});cookies[u.role]=r.headers.get('set-cookie').split(';')[0];}
  assert.equal((await req('/teacher/classes/20/students/2','teacher')).status,200);
  const detail=await (await req('/teacher/classes/20/students/2','teacher')).json();assert.equal(detail.student.full_name,'Test Student');assert.equal(detail.student.email,undefined);
  assert.equal((await req('/teacher/classes/99/students/2','teacher')).status,403);
  assert.equal((await req('/teacher/classes/20/students/999','teacher')).status,404);
  assert.equal((await req('/teacher/classes/20/students/2','student')).status,403);
  const input={title:'Bring a notebook',message:'For our class only',starts_on:'2026-11-26',ends_on:'2026-11-27',published:false};
  assert.equal((await req('/teacher/classes/20/notices',null)).status,401);
  assert.equal((await req('/teacher/classes/20/notices','student','POST',input)).status,403);
  assert.equal((await req('/teacher/classes/99/notices','teacher','POST',input)).status,403);
  assert.equal((await req('/teacher/classes/20/notices','teacher','POST',{...input,ends_on:'2026-11-25'})).status,400);
  assert.equal((await req('/teacher/classes/20/notices','teacher','POST',input)).status,201);
  assert.equal((await (await req('/student/class-notices','student')).json()).notices.length,0);
  const list=await (await req('/teacher/classes/20/notices','teacher')).json();assert.equal(list.notices[0].title,input.title);
  assert.equal((await req('/teacher/classes/20/notices/1','teacher','PUT',{...input,published:true,version:1})).status,200);
  assert.equal((await (await req('/student/class-notices','student')).json()).notices.length,1);
  assert.equal((await req('/teacher/classes/20/notices/1','teacher','PUT',{...input,version:1})).status,409);
  const before=inserts;
  assert.equal((await req('/teacher/classes/20/notices','teacher','POST',{...input,class_ids:[20,99]})).status,403);assert.equal(inserts,before);
  assert.equal((await req('/teacher/classes/20/notices','teacher','POST',{...input,class_ids:[20,20]})).status,400);
  assert.equal((await req('/teacher/classes/20/notices','teacher','POST',{...input,class_ids:[]})).status,400);
  saved.teacher_id=11;
  assert.equal((await req('/teacher/classes/20/notices/1','teacher','PUT',{...input,version:2})).status,409);
  const previous=inserts;assert.equal((await req('/teacher/classes/20/notices','teacher','POST',{...input,class_ids:[20,21]})).status,201);assert.equal(inserts,previous+2);
  assert.ok(rolledBack>=3);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});

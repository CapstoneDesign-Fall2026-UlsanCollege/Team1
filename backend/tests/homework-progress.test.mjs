import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';
import {teacherWorkspaceRouter} from '../dist/teacher-workspace.js';

test('homework progress persists with ownership, membership, stale-write and role protection',async()=>{
 const hash=await bcrypt.hash('fictional-password',4),users=['teacher','student','admin'].map((role,i)=>({id:i+1,login_id:role,role,password_hash:hash,is_active:1}));
 let mark=null,assigned=true;
 const db={beginTransaction:async()=>{},commit:async()=>{},rollback:async()=>{},release:()=>{},execute:async(sql,a=[])=>{
  if(sql.includes('school_planning_lock'))return [[]];
  if(sql.includes('school_teacher_accounts a JOIN'))return [[{id:10,name:'Test Teacher'}]];
  if(sql.includes('FROM school_offering_teachers ot'))return [assigned?[{class_id:20,offering_id:30}]:[]];
  if(sql.startsWith('SELECT id,class_id'))return [[{id:a[0],class_id:20,offering_id:30,teacher_id:a[0]===99?11:10,title:'Read chapter 1'}]];
  if(sql.includes('FROM school_memberships m JOIN users'))return [[{id:2,login_id:'student',full_name:'Test Student'}]];
  if(sql.startsWith('SELECT student_user_id'))return [mark?[{student_user_id:2,...mark}]:[]];
  if(sql.startsWith('SELECT version FROM school_homework_progress'))return [mark?[{version:mark.version}]:[]];
  if(sql.startsWith('INSERT INTO school_homework_progress')){mark={status:a[2],version:1};return [{affectedRows:1}];}
  if(sql.startsWith('UPDATE school_homework_progress')){mark={status:a[0],version:mark.version+1};return [{affectedRows:1}];}
  if(sql.includes('FROM school_homework h')){assert.match(sql,/hp.student_user_id=\?/);assert.equal(a[0],2);assert.match(sql,/m.student_user_id=\?/);return [[{id:1,progress_status:mark?.status??'pending'}]];}
  throw Error('Unexpected query '+sql);
 }};db.getConnection=async()=>db;
 const app=createApp({byLogin:async l=>users.find(u=>u.login_id===l),byId:async id=>users.find(u=>u.id===id),teacherWorkspace:invalidate=>teacherWorkspaceRouter(db,invalidate,()=> '2026-11-27')});
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port+'/api',cookies={};
 const req=(path,role,method='GET',body)=>fetch(base+path,{method,headers:{Cookie:cookies[role]??'','X-StudentHub':'1','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 try{
  for(const u of users){const r=await req('/auth/login',null,'POST',{login_id:u.login_id,password:'fictional-password'});cookies[u.role]=r.headers.get('set-cookie').split(';')[0];}
  const path='/teacher/homework/1/progress';
  assert.equal((await req(path,'student')).status,403);
  assert.equal((await req('/teacher/homework/99/progress','teacher')).status,403);
  assert.equal((await(await req(path,'teacher')).json()).students[0].status,'pending');
  assert.equal((await req(path+'/999','teacher','PUT',{status:'submitted',version:0})).status,403);assert.equal(mark,null);
  assert.equal((await req(path+'/2','teacher','PUT',{status:'invented',version:0})).status,400);
  assert.equal((await req(path+'/2','teacher','PUT',{status:'submitted',version:0})).status,200);
  assert.equal((await(await req(path,'teacher')).json()).students[0].status,'submitted');
  assert.equal((await req(path+'/2','teacher','PUT',{status:'missing',version:0})).status,409);assert.equal(mark.status,'submitted');
  assert.equal((await req(path+'/2','teacher','PUT',{status:'reviewed',version:1})).status,200);
  assert.equal((await(await req('/student/homework','student')).json()).homework[0].progress_status,'reviewed');
  assigned=false;assert.equal((await req(path+'/2','teacher','PUT',{status:'missing',version:2})).status,403);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});

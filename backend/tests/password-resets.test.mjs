import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';
test('reset privacy, admin verification, hashing, replay protection and session revocation',async()=>{
const users=[{id:1,login_id:'admin',role:'admin',is_active:1,password_hash:await bcrypt.hash('old-password',4)},{id:2,login_id:'student',role:'student',is_active:1,password_hash:await bcrypt.hash('old-password',4)}];let pending=[],reviewer;
const store={async request(login,email){if(login==='student'&&email==='student@college.ac.kr'&&!pending.length)pending=[{id:1,user_id:2,login_id:login,email}];},async pending(){return pending;},async resolve(id,adminId,hash){if(id!==1||!pending.length)return;reviewer=adminId;if(hash)users[1].password_hash=hash;pending=[];return 2;}};
const server=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),resets:store}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port+'/api/';
const post=(path,body,cookie='')=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json','X-StudentHub':'1',Cookie:cookie},body:JSON.stringify(body)});const get=(path,cookie='')=>fetch(base+path,{headers:{Cookie:cookie}});
try{const login=async name=>(await post('auth/login',{login_id:name,password:'old-password'})).headers.get('set-cookie').split(';')[0];const admin=await login('admin'),student=await login('student');
assert.equal((await get('admin/password-reset-requests')).status,401);assert.equal((await get('admin/password-reset-requests',student)).status,403);
assert.equal((await post('auth/password-reset-requests',{login_id:'student',email:'bad'})).status,400);
const missing=await post('auth/password-reset-requests',{login_id:'missing',email:'other@college.ac.kr'}),valid=await post('auth/password-reset-requests',{login_id:'student',email:'STUDENT@college.ac.kr'});assert.deepEqual(await missing.json(),await valid.json());assert.equal(pending.length,1);
await post('auth/password-reset-requests',{login_id:'student',email:'student@college.ac.kr'});assert.equal(pending.length,1);
const path='admin/password-reset-requests/1/resolve',body={action:'reset',password:'new-strong-password',identity_verified:true};
assert.equal((await post(path,body,student)).status,403);assert.equal((await post(path,{...body,identity_verified:false},admin)).status,400);assert.equal((await post(path,{...body,password:'short'},admin)).status,400);assert.equal((await post(path,{...body,password:'\u00e9'.repeat(40)},admin)).status,400);
assert.equal((await post(path,body,admin)).status,200);assert.equal(reviewer,1);assert.ok(await bcrypt.compare(body.password,users[1].password_hash));assert.notEqual(users[1].password_hash,body.password);
assert.equal((await get('auth/me',student)).status,401);assert.equal((await get('auth/me',admin)).status,200);assert.equal((await post('auth/login',{login_id:'student',password:body.password})).status,200);assert.equal((await post(path,body,admin)).status,409);
await post('auth/password-reset-requests',{login_id:'student',email:'student@college.ac.kr'});assert.equal((await post('auth/password-reset-requests',{login_id:'student',email:'student@college.ac.kr'})).status,429);const hash=users[1].password_hash;assert.equal((await post(path,{action:'reject'},admin)).status,200);assert.equal(users[1].password_hash,hash);
}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';
import {ensureCanteenRole,mysqlCanteenAccounts} from '../dist/canteen-accounts.js';

async function fixture(run) {
 const hash=await bcrypt.hash('test-password',4);
 const users=[{id:1,login_id:'admin',role:'admin',is_active:1,password_hash:hash},{id:2,login_id:'student',role:'student',is_active:1,password_hash:hash},{id:3,login_id:'canteen',role:'canteen_head',is_active:1,password_hash:hash}];
 const store={
  async list(){return users.filter(u=>u.role==='canteen_head').map(({id,login_id,is_active})=>({id,login_id,is_active:!!is_active}));},
  async create(login_id,password_hash){if(users.some(u=>u.login_id===login_id))throw Object.assign(new Error('duplicate'),{code:'ER_DUP_ENTRY'});const id=users.length+1;users.push({id,login_id,password_hash,role:'canteen_head',is_active:1});return id;},
  async setActive(id,active){const u=users.find(u=>u.id===id&&u.role==='canteen_head');if(!u)return false;u.is_active=Number(active);return true;}
 };
 const server=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),canteenAccounts:store}).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
 const request=(path,method='GET',cookie='',body)=>fetch(base+'/api'+path,{method,headers:{Cookie:cookie,'X-StudentHub':'1','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const login=async(login_id,password='test-password')=>{const r=await request('/auth/login','POST','',{login_id,password});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0];};
 try{await run({users,request,login});}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
}

test('canteen-head login, session restore and workspace boundaries are enforced on every role',async()=>fixture(async({request,login})=>{
 const cookies={admin:await login('admin'),student:await login('student'),canteen_head:await login('canteen')};
 const routes={admin:'/admin/home',student:'/student/home',canteen_head:'/canteen/home'};
 for(const [role,path] of Object.entries(routes)) {
  assert.equal((await request(path)).status,401);
  for(const [account,cookie] of Object.entries(cookies))assert.equal((await request(path,'GET',cookie)).status,account===role?200:403);
 }
 const restored=await request('/auth/me','GET',cookies.canteen_head);const data=await restored.json();assert.equal(data.user.role,'canteen_head');assert.ok(!JSON.stringify(data).includes('password'));
 for(const path of ['/student/profile','/student/jobs','/student/job-favourites','/admin/students','/admin/semesters','/admin/schedules','/admin/password-reset-requests','/admin/canteen-accounts'])assert.equal((await request(path,'GET',cookies.canteen_head)).status,403);
 // Reserved future content routes: no implementation in C0, but the role boundary already applies.
 for(const role of ['admin','student'])for(const method of ['GET','POST','PUT','DELETE'])assert.equal((await request('/canteen/menu',method,cookies[role],method==='GET'?undefined:{})).status,403);
 await request('/auth/logout','POST',cookies.canteen_head,{});assert.equal((await request('/auth/me','GET',cookies.canteen_head)).status,401);
}));

test('only admin provisions staff; role injection is rejected and no password or hash is returned',async()=>fixture(async({users,request,login})=>{
 const admin=await login('admin'),student=await login('student'),head=await login('canteen');
 const body={login_id:'new_canteen',password:'a-private-test-password'};
 assert.equal((await request('/admin/canteen-accounts','POST','',body)).status,401);
 for(const cookie of [student,head]) {
  assert.equal((await request('/admin/canteen-accounts','POST',cookie,body)).status,403);
  assert.equal((await request('/admin/canteen-accounts','GET',cookie)).status,403);
  assert.equal((await request('/admin/canteen-accounts/3/status','PUT',cookie,{is_active:false})).status,403);
 }
 for(const invalid of [{...body,role:'admin'},{...body,role:'student'},{...body,is_active:false},{...body,password:'short'},{...body,password:'한'.repeat(25)},{...body,login_id:'bad/id'},[]])assert.equal((await request('/admin/canteen-accounts','POST',admin,invalid)).status,400);
 const r=await request('/admin/canteen-accounts','POST',admin,body);assert.equal(r.status,201);const text=await r.text();assert.ok(!text.includes(body.password));assert.ok(!text.includes('password_hash'));
 const stored=users.find(u=>u.login_id===body.login_id);assert.equal(stored.role,'canteen_head');assert.notEqual(stored.password_hash,body.password);assert.equal(await bcrypt.compare(body.password,stored.password_hash),true);
 const savedCookie=await login(body.login_id,body.password);assert.equal((await request('/canteen/home','GET',savedCookie)).status,200);
 assert.equal((await request('/admin/canteen-accounts','POST',admin,body)).status,409);
 assert.equal((await request('/admin/canteen-accounts','POST',admin,{...body,login_id:'student'})).status,409);
 const list=await (await request('/admin/canteen-accounts','GET',admin)).text();assert.ok(!list.includes('password_hash'));assert.ok(!list.includes('"login_id":"student"'));
}));

test('disable signs out every staff session and enable never restores old sessions or alters other roles',async()=>fixture(async({request,login,users})=>{
 const admin=await login('admin'),one=await login('canteen'),two=await login('canteen');
 for(const id of ['0','x','999','1','2'])assert.equal((await request('/admin/canteen-accounts/'+id+'/status','PUT',admin,{is_active:false})).status,['0','x'].includes(id)?400:404);
 for(const body of [{is_active:'false'},{is_active:false,role:'admin'}])assert.equal((await request('/admin/canteen-accounts/3/status','PUT',admin,body)).status,400);
 assert.equal((await request('/admin/canteen-accounts/3/status','PUT',admin,{is_active:false})).status,200);
 for(const cookie of [one,two])assert.equal((await request('/auth/me','GET',cookie)).status,401);
 assert.equal((await request('/auth/login','POST','',{login_id:'canteen',password:'test-password'})).status,401);
 assert.equal((await request('/admin/canteen-accounts/3/status','PUT',admin,{is_active:true})).status,200);
 assert.equal((await request('/auth/me','GET',one)).status,401);
 assert.equal((await request('/canteen/home','GET',await login('canteen'))).status,200);
 assert.equal(users[0].is_active,1);assert.equal(users[1].is_active,1);
}));

test('role migration appends the enum once and refuses unknown schemas',async()=>{
 let type="enum('admin','student')";const changes=[];
 const pool={async query(sql){if(sql.startsWith('SHOW'))return [[{Type:type}]];changes.push(sql);type="enum('admin','student','canteen_head')";return [];}};
 await ensureCanteenRole(pool);await ensureCanteenRole(pool);assert.equal(changes.length,1);assert.match(changes[0],/ENUM\('admin','student','canteen_head'\)/);assert.ok(!/UPDATE|DELETE|DROP/.test(changes[0]));
 type="enum('admin','student','other')";await assert.rejects(ensureCanteenRole(pool),/Unexpected/);assert.equal(changes.length,1);
});
test('canteen-head sessions expire after eight hours',async()=>fixture(async({request,login})=>{
 const cookie=await login('canteen');const original=Date.now;
 try {Date.now=()=>original()+8*60*60_000+1;assert.equal((await request('/auth/me','GET',cookie)).status,401);}
 finally{Date.now=original;}
 assert.equal((await request('/canteen/home','GET',cookie)).status,401);
}));

test('MySQL staff writes use a fixed role and cannot modify student/admin status',async()=>{
 const calls=[];const pool={async execute(sql,values){calls.push({sql,values});if(sql.startsWith('SELECT'))return [[{id:4,login_id:'head',is_active:0}]];return [{insertId:4,affectedRows:1}];}};
 const store=mysqlCanteenAccounts(pool);assert.equal(await store.create('head','hashed-only'),4);await store.setActive(4,false);assert.deepEqual(await store.list(),[{id:4,login_id:'head',is_active:false}]);
 assert.match(calls[0].sql,/'canteen_head'/);assert.deepEqual(calls[0].values,['head','hashed-only']);assert.match(calls[1].sql,/WHERE id=\? AND role='canteen_head'/);assert.deepEqual(calls[1].values,[0,4]);assert.match(calls[2].sql,/WHERE role='canteen_head'/);
});

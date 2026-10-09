import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';
import {createSeoulJobs,jobId} from '../dist/jobs.js';
test('catalogue search finds jobs beyond page one and reuses a shared catalogue',async()=>{
let calls=0;const service=createSeoulJobs(()=> 'private-key',async url=>{calls++;const second=url.includes('/1001/2000/');const rows=second?[{TITLE:'Remote developer',COMPANY:'Search company',REGION:'Busan',REG_DT:'today',CLOSE_DT:'later'}]:Array.from({length:1000},(_,i)=>({TITLE:'Other '+i,COMPANY:'Test',REG_DT:'today',CLOSE_DT:'later'}));return Response.json({recMntList:{RESULT:{CODE:'INFO-000'},list_total_count:1001,row:rows}});});
const [a,b]=await Promise.all([service(1,'developer'),service(1,'developer')]);assert.equal(a.jobs[0].title,'Remote developer');assert.equal(a.total,1);assert.deepEqual(a,b);assert.equal(calls,2);assert.equal((await service(1,'no-match')).total,0);assert.equal(calls,2);
});
test('favourites are private, normalized, removable, and restricted to student accounts',async()=>{
const hash=await bcrypt.hash('test-password',4);const users=[{id:1,login_id:'one',role:'student',is_active:1,password_hash:hash},{id:2,login_id:'two',role:'student',is_active:1,password_hash:hash},{id:3,login_id:'admin',role:'admin',is_active:1,password_hash:hash}];const saved=new Map();
const store={async list(id){return [...(saved.get(id)?.values()??[])];},async save(id,job){if(!saved.has(id))saved.set(id,new Map());saved.get(id).set(job.id,job);return true;},async remove(id,key){saved.get(id)?.delete(key);}};
const server=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),favourites:store}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
const request=(method,cookie='',body,path='/api/student/job-favourites')=>fetch(base+path,{method,headers:{Cookie:cookie,'X-StudentHub':'1','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
try{const login=async login_id=>(await request('POST','',{login_id,password:'test-password'},'/api/auth/login')).headers.get('set-cookie').split(';')[0];const one=await login('one'),two=await login('two'),admin=await login('admin');assert.equal((await request('GET')).status,401);assert.equal((await request('GET',admin)).status,403);
const job={id:'forged',company:'Test',title:'Developer',location:'Seoul',salary:'Pay',career:'Any',education:'Any',employment:'Work',posted:'today',closes:'later',description:'Description',address:'Seoul office',hours:'09:00~18:00',application:'Email',documents:'CV',phone:'02-1234567'};
assert.equal((await request('POST',one,{job:{title:'bad'}})).status,400);const response=await request('POST',one,{job,user_id:2});assert.equal(response.status,200);assert.equal((await response.json()).job.id,jobId(job));assert.equal((await (await request('GET',two)).json()).jobs.length,0);assert.equal((await (await request('GET',one)).json()).jobs.length,1);
await request('POST',one,{job});assert.equal((await (await request('GET',one)).json()).jobs.length,1);
await request('DELETE',two,undefined,'/api/student/job-favourites/'+jobId(job));assert.equal((await (await request('GET',one)).json()).jobs.length,1);await request('DELETE',one,undefined,'/api/student/job-favourites/'+jobId(job));assert.equal((await (await request('GET',one)).json()).jobs.length,0);
}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});

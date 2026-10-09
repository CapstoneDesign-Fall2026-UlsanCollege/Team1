import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';
import {createSeoulJobs} from '../dist/jobs.js';
const payload={recMntList:{RESULT:{CODE:'INFO-000'},list_total_count:45,row:[{COMPANY:'Test company',TITLE:'Developer',REGION:'Seoul',SAL_TP_NM:'Monthly pay',JOB_CONT:'<script>not executable</script>',CONTACT_TELNO:'02-123-4567'}]}};
test('Seoul adapter maps jobs, coalesces requests, caches pages and keeps the key server-side',async()=>{
let calls=0;const service=createSeoulJobs(()=> 'private-test-key',async url=>{calls++;assert.match(url,/private-test-key\/json\/recMntList\/31\/60\/$/);await new Promise(r=>setTimeout(r,10));return Response.json(payload);});
const [a,b]=await Promise.all([service(2),service(2)]);assert.deepEqual(a,b);assert.equal(calls,1);await service(2);assert.equal(calls,1);assert.equal(a.jobs[0].company,'Test company');assert.equal(a.jobs[0].phone,'02-123-4567');assert.equal(a.total,45);assert.equal(a.page,2);assert.ok(!JSON.stringify(a).includes('private-test-key'));
});
test('Seoul failures are sanitized, failures can retry, and empty results are supported',async()=>{
await assert.rejects(createSeoulJobs(()=>undefined)(1),/not configured/);await assert.rejects(createSeoulJobs(()=>'sample')(1),/not configured/);
let calls=0;const service=createSeoulJobs(()=>'secret',async()=>{calls++;if(calls===1)throw Error('http://provider/secret');return Response.json(payload);});await assert.rejects(service(1),e=>!e.message.includes('secret')&&/unavailable/.test(e.message));assert.equal((await service(1)).jobs.length,1);
for(const result of [{RESULT:{CODE:'ERROR-300',MESSAGE:'secret'}},{recMntList:{RESULT:{CODE:'INFO-000'},row:'bad'}}])await assert.rejects(createSeoulJobs(()=>'secret',async()=>Response.json(result))(1),/unavailable/);
assert.deepEqual((await createSeoulJobs(()=>'secret',async()=>Response.json({RESULT:{CODE:'INFO-200'}}))(1)).jobs,[]);
});
test('job endpoint requires student authentication and validates pages',async()=>{
const hash=await bcrypt.hash('test-password',4);const users=[{id:1,login_id:'admin',role:'admin',is_active:1,password_hash:hash},{id:2,login_id:'student',role:'student',is_active:1,password_hash:hash}];const pages=[];
const server=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),jobs:async page=>{pages.push(page);return {jobs:[],page,pageSize:30,total:0,fetchedAt:new Date().toISOString()};}}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
try{const get=(query='',cookie='')=>fetch(base+'/api/student/jobs'+query,{headers:{Cookie:cookie}});assert.equal((await get()).status,401);const login=async name=>(await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json','X-StudentHub':'1'},body:JSON.stringify({login_id:name,password:'test-password'})})).headers.get('set-cookie').split(';')[0];const admin=await login('admin'),student=await login('student');assert.equal((await get('',admin)).status,403);for(const query of ['?page=0','?page=-1','?page=1.2','?page=x','?page=1&page=2','?page=10000'])assert.equal((await get(query,student)).status,400);assert.equal((await get('?page=2',student)).status,200);assert.deepEqual(pages,[2]);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});

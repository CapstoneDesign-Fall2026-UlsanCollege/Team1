// Read-only role boundary checks against the preserved local fictional QA school.
// QA_CREDENTIALS_FILE points to a private local file; never commit its contents.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const path=process.env.QA_CREDENTIALS_FILE;
if(!path)throw Error('Supply QA_CREDENTIALS_FILE privately.');
const credentials=JSON.parse(await readFile(path,'utf8'));
const base=credentials.url;
if(base!=='http://127.0.0.1:3033/')throw Error('This check is limited to the local QA school.');
async function request(route,cookie){return fetch(base+'api'+route,{headers:{'X-StudentHub':'1',...(cookie?{Cookie:cookie}:{})}});}
assert.equal((await request('/admin/school')).status,401);
console.log('PASS anonymous administrator read rejected: HTTP 401');
for(const role of ['teacher','student','canteen','parent']){
 const c=credentials[role];
 const login=await fetch(base+'api/auth/login',{method:'POST',headers:{'Content-Type':'application/json','X-StudentHub':'1'},body:JSON.stringify({login_id:c.login,password:c.password})});
 assert.equal(login.status,200,role+' login');
 const cookie=login.headers.get('set-cookie')?.split(';')[0];assert.ok(cookie);
 assert.equal((await request('/admin/school',cookie)).status,403);
 console.log('PASS '+role+' sign-in: HTTP 200; administrator read denied: HTTP 403');
 const route={teacher:'/teacher/dashboard',student:'/student/school',canteen:'/canteen/home',parent:'/parent/children'}[role];
 const read=await request(route,cookie);assert.equal(read.status,200,role+' own workspace');
 console.log('PASS '+role+' own workspace read: HTTP 200');
 if(role!=='teacher'){
  assert.equal((await request('/teacher/dashboard',cookie)).status,403);
  console.log('PASS '+role+' teacher-workspace read denied: HTTP 403');
 }
 await fetch(base+'api/auth/logout',{method:'POST',headers:{'X-StudentHub':'1',Cookie:cookie}});
}
console.log('RESULT: selected read-only role boundaries passed. No record mutations or broad security certification.');

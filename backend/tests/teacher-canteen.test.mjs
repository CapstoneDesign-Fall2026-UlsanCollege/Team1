import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {Router} from 'express';
import {createApp} from '../dist/app.js';
import {canteenMenuRouter} from '../dist/canteen-menu.js';
import {canteenInfoRouter,emptyHours} from '../dist/canteen-info.js';

test('teacher can read published canteen data but cannot cross workspaces or edit',async()=>{
 const password='fictional-test-password',hash=await bcrypt.hash(password,4);
 const users=['teacher','student','admin','canteen_head','parent'].map((role,i)=>({id:i+1,login_id:role,role,password_hash:hash,is_active:1}));
 let published=true;
 const pool={execute:async(sql,params)=>{
  assert.match(sql,/published=1/);
  if(sql.includes('canteen_menus')){assert.deepEqual(params,['2026-11-25']);return [published?[{service_date:'2026-11-25',published:1,currency:'NPR',items:JSON.stringify([{id:'meal',name:'Lunch',price:100,status:'available'}]),version:1}]:[]];}
  assert.match(sql,/canteen_info/);
  return [published?[{name:'School canteen',location:'Ground floor',hours:JSON.stringify(emptyHours()),published:1,version:1,notice:'Old notice',notice_date:'2026-11-24',closed_for_notice:1}]:[]];
 }};
 const app=createApp({byLogin:async id=>users.find(u=>u.login_id===id),byId:async id=>users.find(u=>u.id===id),campus:Router().use(canteenMenuRouter(pool,()=> '2026-11-25')).use(canteenInfoRouter(pool,()=> '2026-11-25'))});
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const base='http://127.0.0.1:'+server.address().port+'/api';
 async function request(path,cookie='',method='GET',body){return fetch(base+path,{method,headers:{Cookie:cookie,'X-StudentHub':'1','Content-Type':'application/json'},...(body&&method!=='GET'?{body:JSON.stringify(body)}:{})});}
 try{
  assert.equal((await request('/teacher/canteen')).status,401);
  const cookies={};for(const user of users){const r=await request('/auth/login','','POST',{login_id:user.login_id,password});assert.equal(r.status,200);cookies[user.role]=r.headers.get('set-cookie').split(';')[0];}
  const r=await request('/teacher/canteen',cookies.teacher);assert.equal(r.status,200);const menu=await r.json();assert.equal(menu.menu.items[0].price,100);assert.equal(menu.menu.currency,'NPR');
  const info=await (await request('/teacher/canteen/info',cookies.teacher)).json();assert.equal(info.info.location,'Ground floor');assert.equal(info.info.notice,'');assert.equal(info.info.closed_for_notice,false);
  for(const role of ['student','admin','canteen_head','parent'])for(const path of ['/teacher/canteen','/teacher/canteen/info'])assert.equal((await request(path,cookies[role])).status,403);
  assert.equal((await request('/student/canteen',cookies.teacher)).status,403);
  for(const [path,method] of [['/canteen/menu','GET'],['/canteen/info','GET'],['/canteen/menu/2026-11-25','PUT'],['/canteen/info','PUT'],['/canteen/menu/apply-days','POST']])assert.equal((await request(path,cookies.teacher,method,{})).status,403);
  published=false;
  assert.equal((await (await request('/teacher/canteen',cookies.teacher)).json()).menu,null);
  assert.equal((await (await request('/teacher/canteen/info',cookies.teacher)).json()).info,null);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});


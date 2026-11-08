import {test} from 'node:test';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import {randomBytes} from 'node:crypto';
import {Router} from 'express';
import {canteenMenuSchema,canteenMenuRouter} from '../dist/canteen-menu.js';
import {createApp} from '../dist/app.js';
import {activityPool,withActivityActor,ensureActivitySchema,activityRouter} from '../dist/activity-log.js';

test('activity log: atomic history, actor isolation, privacy and read-only filters', {skip:process.env.RUN_ACTIVITY_DB_TESTS!=='1'}, async()=>{
 const config={host:process.env.DB_HOST??'127.0.0.1',port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD};
 const db='studenthub_audit_test_'+randomBytes(6).toString('hex');
 const root=await mysql.createConnection(config);let raw,server;
 try{
 await root.query('CREATE DATABASE `'+db+'`');raw=mysql.createPool({...config,database:db,connectionLimit:1});
 await raw.query('CREATE TABLE school_profile(id INT PRIMARY KEY,name VARCHAR(150),level VARCHAR(20)) ENGINE=InnoDB');
 await raw.query('CREATE TABLE student_profiles(user_id INT PRIMARY KEY,full_name VARCHAR(150),email VARCHAR(254)) ENGINE=InnoDB');
 await raw.query('CREATE TABLE users(id INT PRIMARY KEY,role VARCHAR(30),is_active INT,login_id VARCHAR(50),password_hash VARCHAR(255)) ENGINE=InnoDB');
 await raw.query("INSERT INTO school_profile VALUES(1,'Original','high')");
 await raw.query(canteenMenuSchema);await ensureActivitySchema(raw);await ensureActivitySchema(raw);
 const pool=activityPool(raw);
 const actors=[{id:1,login_id:'admin_a',role:'admin'},{id:2,login_id:'admin_b',role:'admin'},{id:3,login_id:'canteen_a',role:'canteen_head'},{id:4,login_id:'student_a',role:'student'}];
 function as(actor,fn){return new Promise((resolve,reject)=>withActivityActor(actor,()=>{Promise.resolve().then(fn).then(resolve,reject)}))}
 async function rows(){return (await raw.query('SELECT * FROM activity_logs ORDER BY id'))[0]}
 assert.equal((await rows()).length,0);
 await Promise.all(actors.slice(0,2).map(a=>as(a,()=>pool.execute('UPDATE school_profile SET name=? WHERE id=1',[a.login_id]))));
 let logs=await rows();assert.deepEqual(logs.map(r=>r.actor_login),['admin_a','admin_b']);
 assert.equal(logs[1].before_values.name,'admin_a');assert.equal(logs[1].after_values.name,'admin_b');
 await as(actors[1],()=>pool.execute('UPDATE school_profile SET name=name WHERE id=1'));
 await raw.query("UPDATE school_profile SET name='Direct SQL' WHERE id=1");
 await as(actors[3],()=>pool.execute("UPDATE school_profile SET name='Student' WHERE id=1"));
 assert.equal((await rows()).length,2);
 await as(actors[0],()=>pool.query("INSERT INTO student_profiles VALUES(10,'Private Person','private@example.test')"));
 await as(actors[0],()=>pool.query("INSERT INTO users VALUES(10,'student',1,'private_login','secret-hash')"));
 assert.doesNotMatch(JSON.stringify(await rows()),/Private Person|private@example|private_login|secret-hash/);
 await as(actors[0],async()=>{const c=await pool.getConnection();try{await c.beginTransaction();await c.query("UPDATE school_profile SET name='Rolled back' WHERE id=1");await c.rollback()}finally{c.release()}});
 assert.equal((await rows()).length,4);
 await raw.query("CREATE TRIGGER fail_audit BEFORE INSERT ON activity_logs FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Audit unavailable'");
 await assert.rejects(as(actors[0],()=>pool.query("UPDATE school_profile SET name='Must fail' WHERE id=1")));
 assert.equal((await raw.query('SELECT name FROM school_profile'))[0][0].name,'Student');
 await raw.query('DROP TRIGGER fail_audit');
 for(let n=0;n<23;n++)await as(actors[0],()=>pool.execute('UPDATE school_profile SET name=? WHERE id=1',['Page '+n]));
 await as(actors[0],()=>pool.query('DELETE FROM student_profiles WHERE user_id=10'));
 assert.equal((await rows()).at(-1).action,'delete');
 // Real authentication middleware sets actor context; request bodies cannot select it.
 const bcrypt=await import('bcryptjs');const hash=await bcrypt.hash('fictional-password',4);
 const users=actors.map(a=>({...a,password_hash:hash,is_active:1}));
 const router=Router().use(activityRouter(pool));router.put('/admin/test-profile',async(req,res)=>{await pool.execute('UPDATE school_profile SET name=? WHERE id=1',[req.body.name]);res.json({ok:true})});
 server=createApp({withActor:withActivityActor,byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),school:router,campus:canteenMenuRouter(pool,()=>'2026-11-08')}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const url='http://127.0.0.1:'+server.address().port+'/api';
 async function request(path,cookie='',method='GET',body){return fetch(url+path,{method,headers:{Cookie:cookie,'Content-Type':'application/json','X-StudentHub':'1'},...(body?{body:JSON.stringify(body)}:{})})}
 async function login(name){const r=await request('/auth/login','','POST',{login_id:name,password:'fictional-password'});assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0]}
 const cookie=await login('admin_b');
 const canteenCookie=await login('canteen_a');
 let r=await request('/canteen/menu/2026-11-08',canteenCookie,'PUT',{version:0,currency:'NPR',published:false,items:[{name:'Fictional meal',price:80}]});assert.equal(r.status,200);
 let menu=(await(await request('/canteen/menu?date=2026-11-08',canteenCookie)).json()).menu;
 const count=(await rows()).length;menu.items[0].price=90;
 r=await request('/canteen/menu/2026-11-08',canteenCookie,'PUT',menu);assert.equal(r.status,200);
 logs=await rows();assert.equal(logs.at(-1).actor_login,'canteen_a');assert.equal(logs.at(-1).before_values.items[0].price,80);assert.equal(logs.at(-1).after_values.items[0].price,90);
 r=await request('/canteen/menu/2026-11-08',canteenCookie,'PUT',menu);assert.equal(r.status,409);assert.equal((await rows()).length,count+1);

 assert.equal((await request('/admin/activity-logs')).status,401);
 for(const name of ['student_a','canteen_a'])assert.equal((await request('/admin/activity-logs',await login(name))).status,403);
 assert.equal((await request('/admin/test-profile',cookie,'PUT',{name:'Authenticated change',actor_user_id:999})).status,200);
 assert.equal((await rows()).at(-1).actor_user_id,2);
 let response=await request('/admin/activity-logs',cookie),data=await response.json();assert.equal(response.status,200);assert.equal(data.logs.length,20);assert.equal(data.has_more,true);
 const firstIds=data.logs.map(r=>r.id);data=await(await request('/admin/activity-logs?before='+data.next_before,cookie)).json();assert.ok(data.logs.length);assert.ok(data.logs.every(r=>!firstIds.includes(r.id)));
 data=await(await request('/admin/activity-logs?actor=2&action=update&area=school_profile',cookie)).json();assert.ok(data.logs.length);assert.ok(data.logs.every(r=>r.actor_user_id===2&&r.action==='update'&&r.record_type==='school_profile'));
 for(const filter of ['from=2026-02-30','from=2026-11-09&until=2026-11-08','before=oops','actor=0','area=unknown'])assert.equal((await request('/admin/activity-logs?'+filter,cookie)).status,400);
 data=await(await request('/admin/activity-logs?until=2000-01-01',cookie)).json();assert.equal(data.logs.length,0);
 for(const method of ['POST','PUT','DELETE'])assert.equal((await request('/admin/activity-logs',cookie,method,{})).status,405);
 }finally{if(server){server.closeAllConnections();await new Promise(r=>server.close(r))}if(raw)await raw.end();await root.query('DROP DATABASE `'+db+'`');await root.end()}
});

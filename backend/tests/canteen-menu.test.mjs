import {test} from 'node:test';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {randomBytes} from 'node:crypto';
import {Router} from 'express';
import {canteenInfoSchema,canteenInfoRouter,validateInfo,emptyHours} from '../dist/canteen-info.js';
import {createApp} from '../dist/app.js';
import {canteenMenuSchema, ensureCanteenMenuSchema, canteenMenuRouter, campusDate, isMenuDate, menuItems} from '../dist/canteen-menu.js';

test('menu dates use Nepal time and reject impossible calendar dates', () => {
  assert.equal(campusDate(new Date('2026-11-01T18:14:59Z')), '2026-11-01');
  assert.equal(campusDate(new Date('2026-11-01T18:15:00Z')), '2026-11-02');
  for (const value of ['2026-02-29','2026-02-30','2026-13-01','x',undefined,{},'1999-12-31']) assert.equal(isMenuDate(value), false);
  assert.equal(isMenuDate('2028-02-29'), true);
});
test('menu validation rejects invalid prices, names, IDs and oversized lists', () => {
  for (const price of [-1, 0.5, '5000', NaN, Infinity, 1000001]) assert.throws(() => menuItems([{name:'Meal',price}]), /whole-number/);
  for (const name of ['', '   ', 'a'.repeat(151), null]) assert.throws(() => menuItems([{name,price:5000}]));
  for (const list of [[],null,Array.from({length:41},()=>({name:'Meal',price:5000}))]) assert.throws(() => menuItems(list));
  assert.throws(() => menuItems([{id:'forged',name:'Meal',price:5000}]), /identity/);
  const previous=[{id:'saved',name:'Old meal',price:5000,status:'sold_out'}];
  assert.throws(() => menuItems([{id:'saved',name:'Meal',price:5000},{id:'saved',name:'Other',price:1}],previous));
  const [item]=menuItems([{id:'saved',name:' Updated meal ',price:6000,status:'available'}],previous);
  assert.equal(item.name,'Updated meal');assert.equal(item.status,'available');
  assert.equal(menuItems([{name:'New meal',price:0}])[0].status,'unknown');
});

test('canteen hours and closure notices validate without inventing hours',()=>{
 const info={name:'School canteen',location:'Ground floor',hours:emptyHours(),notice:'',notice_date:null,closed_for_notice:false,published:true,version:0};
 assert.equal(validateInfo(info).hours[0].state,'unknown');
 for(const change of [{name:''},{hours:[]},{hours:[...info.hours.slice(0,6),info.hours[0]]},{notice:'Closed'},{notice_date:'2026-11-01'},{closed_for_notice:true},{version:-1}])assert.throws(()=>validateInfo({...info,...change}));
 assert.throws(()=>validateInfo({...info,hours:info.hours.map((h,i)=>i? h:{...h,state:'open',opens:'16:00',closes:'10:00'})}));
 assert.equal(validateInfo({...info,notice:'Maintenance',notice_date:'2026-11-01',closed_for_notice:true}).closed_for_notice,true);
});

test('isolated MySQL daily menu lifecycle', {skip:process.env.RUN_MENU_DB_TESTS !== '1'}, async t => {
  dotenv.config({path:new URL('../.env',import.meta.url),quiet:true});
  // Never connect to DB_NAME or touch the application's tables. This suite
  // creates and removes its own random database using local MySQL credentials.
  const config={host:process.env.DB_HOST??'127.0.0.1',port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD};
  const db='studenthub_menu_test_'+randomBytes(6).toString('hex');
  assert.match(db,/^studenthub_menu_test_[a-f0-9]{12}$/);
  const admin=await mysql.createConnection(config);let pool,server;
  let today='2026-11-01';let cookies={};
  const password='fictional-menu-test';
  const hash=await bcrypt.hash(password,4);
  const users=['admin','student','canteen_head'].map((role,i)=>({id:i+1,login_id:role,password_hash:hash,role,is_active:1}));
  async function stop(){if(server){server.closeAllConnections();await new Promise(r=>server.close(r));server=undefined;}}
  async function start(){
    server=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),campus:Router().use(canteenMenuRouter(pool,()=>today)).use(canteenInfoRouter(pool,()=>today))}).listen(0,'127.0.0.1');
    await new Promise(r=>server.once('listening',r));cookies={};
    for(const role of ['admin','student','canteen_head']){const response=await request('/auth/login',null,'POST',{login_id:role,password});assert.equal(response.status,200);cookies[role]=response.headers.get('set-cookie').split(';')[0];}
  }
  function request(path,role='canteen_head',method='GET',body){return fetch('http://127.0.0.1:'+server.address().port+'/api'+path,{method,headers:{Cookie:cookies[role]??'','X-StudentHub':'1','Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});}
  async function data(path,role='canteen_head'){const r=await request(path,role);assert.equal(r.status,200);return r.json();}
  async function save(body,date=today){return request('/canteen/menu/'+date,'canteen_head','PUT',body);}
  try{
    await admin.query('CREATE DATABASE `'+db+'`');pool=mysql.createPool({...config,database:db,connectionLimit:5});
    await pool.query(canteenMenuSchema);await pool.query(canteenInfoSchema);await ensureCanteenMenuSchema(pool);
    await start();
    await t.test('anonymous, student and academic admin access is enforced',async()=>{
      assert.equal((await request('/student/canteen',null)).status,401);
      for(const role of ['admin','student']){
        assert.equal((await request('/canteen/menu',role)).status,403);
        assert.equal((await request('/canteen/info',role)).status,403);
        assert.equal((await request('/canteen/info',role,'PUT',{})).status,403);
        assert.equal((await request('/canteen/menu/'+today,role,'PUT',{})).status,403);
      }
      assert.equal((await request('/student/canteen','canteen_head')).status,403);
      assert.equal((await request('/student/canteen','admin')).status,403);
      assert.equal((await data('/student/canteen','student')).menu,null);
      assert.equal((await data('/student/canteen/info','student')).info,null);
    });
    await t.test('draft, publish, edit and unpublish survive database reads',async()=>{
      assert.equal((await save({version:0,published:false,items:[{name:'Fictional meal',price:5000}]})).status,200);
      assert.equal((await data('/student/canteen','student')).menu,null);
      let menu=(await data('/canteen/menu?date='+today)).menu;
      assert.equal(menu.version,1);assert.equal(menu.items[0].price,5000);
      assert.equal((await save({...menu,published:true})).status,200);
      menu=(await data('/student/canteen','student')).menu;
      assert.equal(menu.service_date,today);assert.ok(menu.updated_at);
      menu.items[0].name='Updated fictional meal';menu.items[0].price=6500;
      assert.equal((await save(menu)).status,200);
      menu=(await data('/student/canteen','student')).menu;assert.equal(menu.items[0].name,'Updated fictional meal');assert.equal(menu.items[0].price,6500);
      assert.equal((await save({...menu,published:false})).status,200);
      assert.equal((await data('/student/canteen','student')).menu,null);
      menu=(await data('/canteen/menu?date='+today)).menu;
      assert.equal((await save({...menu,published:true})).status,200);
    });
    await t.test('server restart retains the saved menu; date rollover hides yesterday',async()=>{
      await stop();await start();
      assert.equal((await data('/student/canteen','student')).menu.items[0].name,'Updated fictional meal');
      today='2026-11-02';assert.equal((await data('/student/canteen','student')).menu,null);
      assert.equal((await data('/canteen/menu?date='+today)).menu,null);
      assert.equal((await data('/canteen/menu?date=2026-11-01')).menu.items[0].price,6500);
    });
    await t.test('invalid writes roll back without creating a menu',async()=>{
      for(const items of [[{name:'',price:1}],[{name:'Meal',price:-1}],[]])assert.equal((await save({version:0,published:true,items})).status,400);
      assert.equal((await data('/canteen/menu?date='+today)).menu,null);
      assert.equal((await save({version:0,published:true,items:[{name:'Meal',price:1}]},'2026-02-30')).status,400);
      assert.equal((await request('/canteen/menu?date=2026-02-30')).status,400);
    });
    await t.test('simultaneous first writes and stale edits cannot overwrite a menu',async()=>{
      const body={version:0,published:true,items:[{name:'First meal',price:5000}]};
      const responses=await Promise.all([save(body),save({...body,items:[{name:'Second meal',price:6000}]})]);
      assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
      assert.equal((await save(body)).status,409);
      const menu=(await data('/student/canteen','student')).menu;assert.equal(menu.version,1);assert.equal(menu.items.length,1);
    });
    await t.test('item availability persists, retains name/price and stays isolated by date',async()=>{
      let menu=(await data('/canteen/menu?date='+today)).menu;
      assert.equal(menu.currency,'NPR');assert.equal(menu.items[0].status,'unknown');
      menu.items[0].status='sold_out';assert.equal((await save(menu)).status,200);
      let shown=(await data('/student/canteen','student')).menu;assert.equal(shown.items[0].status,'sold_out');assert.equal(shown.items[0].price,menu.items[0].price);assert.equal(shown.items[0].name,menu.items[0].name);
      assert.equal((await data('/canteen/menu?date=2026-11-01')).menu.items[0].status,'unknown');
      assert.equal((await save(menu)).status,409);
      shown.items[0].status='invalid';assert.equal((await save(shown)).status,400);
      shown.items[0].status='available';assert.equal((await save(shown)).status,200);
      await stop();await start();assert.equal((await data('/student/canteen','student')).menu.items[0].status,'available');
    });
    await t.test('canteen information drafts, Nepal weekday hours and dated closure notices persist',async()=>{
      const info={name:'Fictional School Canteen',location:'Ground floor, fictional building',hours:emptyHours().map(h=>h.day===1?{...h,state:'open',opens:'10:00',closes:'16:00'}:h),notice:'Demo maintenance closure',notice_date:today,closed_for_notice:true,published:false,version:0};
      let r=await request('/canteen/info','canteen_head','PUT',info);assert.equal(r.status,200);
      assert.equal((await data('/student/canteen/info','student')).info,null);
      let saved=(await data('/canteen/info')).info;assert.equal(saved.version,1);
      r=await request('/canteen/info','canteen_head','PUT',{...saved,published:true});assert.equal(r.status,200);
      let shown=(await data('/student/canteen/info','student')).info;assert.equal(shown.name,info.name);assert.equal(shown.closed_for_notice,true);assert.equal(shown.hours.find(h=>h.day===1).opens,'10:00');assert.equal(shown.hours.find(h=>h.day===6).state,'unknown');
      assert.equal((await request('/canteen/info','canteen_head','PUT',{...saved,published:true})).status,409);
      saved=(await data('/canteen/info')).info;
      assert.equal((await request('/canteen/info','canteen_head','PUT',{...saved,hours:[]})).status,400);
      today='2026-11-03';shown=(await data('/student/canteen/info','student')).info;assert.equal(shown.notice,'');assert.equal(shown.notice_date,null);assert.equal(shown.closed_for_notice,false);
      await stop();await start();assert.equal((await data('/canteen/info')).info.notice,info.notice);
      assert.equal((await request('/student/canteen/info','admin')).status,403);
    });
    await t.test('saved item suggestions use latest NPR prices and require canteen access',async()=>{
      const saveDate='2026-11-04';
      assert.equal((await save({version:0,published:false,items:[{name:'Suggestion meal',price:90},{name:'Unique snack',price:25}]},saveDate)).status,200);
      let menu=(await data('/canteen/menu?date='+saveDate)).menu;menu.items[0].price=95;
      assert.equal((await save(menu,saveDate)).status,200);
      await pool.execute("INSERT INTO canteen_menus(service_date,published,currency,items,version) VALUES('2020-01-02',0,'KRW',?,1)",[JSON.stringify([{id:'old-won',name:'Won-only item',price:5000,status:'unknown'}])]);
      const choices=await data('/canteen/menu/items');assert.equal(choices.currency,'NPR');assert.equal(choices.items.find(i=>i.name==='Suggestion meal').price,95);assert.ok(choices.items.some(i=>i.name==='Unique snack'));assert.ok(!choices.items.some(i=>i.name==='Won-only item'));
      for(const role of ['admin','student'])assert.equal((await request('/canteen/menu/items',role)).status,403);
      assert.equal((await request('/canteen/menu/items',null)).status,401);
    });
    await t.test('multi-day copy creates missing drafts and skips existing dates without overwriting',async()=>{
      const source=(await data('/canteen/menu?date=2026-11-04')).menu;
      const payload={currency:'NPR',dates:['2026-11-08','2026-11-10'],items:source.items.map(i=>({name:i.name,price:i.price,status:'unknown'}))};
      const copy=body=>request('/canteen/menu/apply-days','canteen_head','POST',body);
      assert.equal((await copy(payload)).status,201);
      const a=(await data('/canteen/menu?date=2026-11-08')).menu,b=(await data('/canteen/menu?date=2026-11-10')).menu;
      assert.equal(a.published,false);assert.equal(a.items[0].price,source.items[0].price);assert.equal(a.items[0].status,'unknown');assert.notEqual(a.items[0].id,b.items[0].id);assert.notEqual(a.items[0].id,source.items[0].id);
      assert.deepEqual((await data('/canteen/menu?date=2026-11-04')).menu,source);
      const mixed=await copy({...payload,dates:['2026-11-07','2026-11-08']});assert.equal(mixed.status,201);
      assert.deepEqual(await mixed.json(),{message:'Created 1 draft menu(s). Skipped 1 existing date(s).',created:['2026-11-07'],skipped:['2026-11-08']});
      assert.ok((await data('/canteen/menu?date=2026-11-07')).menu);
      assert.deepEqual((await data('/canteen/menu?date=2026-11-08')).menu,a);
      const repeated=await copy(payload);assert.equal(repeated.status,200);const repeatedResult=await repeated.json();assert.deepEqual(repeatedResult.created,[]);assert.deepEqual(repeatedResult.skipped,payload.dates);
      assert.deepEqual((await data('/canteen/menu?date=2026-11-10')).menu,b);
      for(const dates of [[],['bad'],['2026-11-09','2026-11-09'],Array.from({length:8},(_,i)=>'2026-12-'+String(i+1).padStart(2,'0'))])assert.equal((await copy({...payload,dates})).status,400);
      assert.equal((await copy({...payload,currency:'KRW',dates:['2026-11-09']})).status,400);
      for(const role of ['admin','student',null])assert.equal((await request('/canteen/menu/apply-days',role,'POST',payload)).status,role?403:401);
      const competing=await Promise.all([copy({...payload,dates:['2026-11-12','2026-11-13']}),copy({...payload,dates:['2026-11-12','2026-11-13']})]);assert.deepEqual(competing.map(r=>r.status).sort(),[200,201]);const results=await Promise.all(competing.map(r=>r.json()));assert.equal(results.reduce((n,r)=>n+r.created.length,0),2);assert.equal(results.reduce((n,r)=>n+r.skipped.length,0),2);
    });
    await t.test('legacy won prices survive currency migration',async()=>{
      await pool.execute("INSERT INTO canteen_menus(service_date,published,items,version,currency) VALUES('2020-01-01',0,?,1,'KRW')",[JSON.stringify([{id:'legacy',name:'Old menu',price:5000,status:'unknown'}])]);
      await pool.query('ALTER TABLE canteen_menus DROP COLUMN currency');await ensureCanteenMenuSchema(pool);
      const old=(await data('/canteen/menu?date=2020-01-01')).menu;assert.equal(old.currency,'KRW');assert.equal(old.items[0].price,5000);
      assert.equal((await save({...old,currency:'NPR'},'2020-01-01')).status,400);
    });
  }finally{
    await stop();await pool?.end();
    try{await admin.query('DROP DATABASE IF EXISTS `'+db+'`');}finally{await admin.end();}
  }
});

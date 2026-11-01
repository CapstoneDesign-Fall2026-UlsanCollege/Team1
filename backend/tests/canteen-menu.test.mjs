import {test} from 'node:test';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {randomBytes} from 'node:crypto';
import {createApp} from '../dist/app.js';
import {canteenMenuSchema, canteenMenuRouter, campusDate, isMenuDate, menuItems} from '../dist/canteen-menu.js';

test('menu dates use Korea time and reject impossible calendar dates', () => {
  assert.equal(campusDate(new Date('2026-11-01T14:59:59Z')), '2026-11-01');
  assert.equal(campusDate(new Date('2026-11-01T15:00:00Z')), '2026-11-02');
  for (const value of ['2026-02-29','2026-02-30','2026-13-01','x',undefined,{},'1999-12-31']) assert.equal(isMenuDate(value), false);
  assert.equal(isMenuDate('2028-02-29'), true);
});
test('menu validation rejects invalid prices, names, IDs and oversized lists', () => {
  for (const price of [-1, 0.5, '5000', NaN, Infinity, 1000001]) assert.throws(() => menuItems([{name:'Meal',price}]), /whole-won/);
  for (const name of ['', '   ', 'a'.repeat(151), null]) assert.throws(() => menuItems([{name,price:5000}]));
  for (const list of [[],null,Array.from({length:41},()=>({name:'Meal',price:5000}))]) assert.throws(() => menuItems(list));
  assert.throws(() => menuItems([{id:'forged',name:'Meal',price:5000}]), /identity/);
  const previous=[{id:'saved',name:'Old meal',price:5000,status:'sold_out'}];
  assert.throws(() => menuItems([{id:'saved',name:'Meal',price:5000},{id:'saved',name:'Other',price:1}],previous));
  const [item]=menuItems([{id:'saved',name:' Updated meal ',price:6000,status:'available'}],previous);
  assert.equal(item.name,'Updated meal');assert.equal(item.status,'sold_out');
  assert.equal(menuItems([{name:'New meal',price:0}])[0].status,'unknown');
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
    server=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),campus:canteenMenuRouter(pool,()=>today)}).listen(0,'127.0.0.1');
    await new Promise(r=>server.once('listening',r));cookies={};
    for(const role of ['admin','student','canteen_head']){const response=await request('/auth/login',null,'POST',{login_id:role,password});assert.equal(response.status,200);cookies[role]=response.headers.get('set-cookie').split(';')[0];}
  }
  function request(path,role='canteen_head',method='GET',body){return fetch('http://127.0.0.1:'+server.address().port+'/api'+path,{method,headers:{Cookie:cookies[role]??'','X-StudentHub':'1','Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});}
  async function data(path,role='canteen_head'){const r=await request(path,role);assert.equal(r.status,200);return r.json();}
  async function save(body,date=today){return request('/canteen/menu/'+date,'canteen_head','PUT',body);}
  try{
    await admin.query('CREATE DATABASE `'+db+'`');pool=mysql.createPool({...config,database:db,connectionLimit:5});
    await pool.query(canteenMenuSchema);await pool.query(canteenMenuSchema);
    await start();
    await t.test('anonymous, student and academic admin access is enforced',async()=>{
      assert.equal((await request('/student/canteen',null)).status,401);
      for(const role of ['admin','student']){
        assert.equal((await request('/canteen/menu',role)).status,403);
        assert.equal((await request('/canteen/menu/'+today,role,'PUT',{})).status,403);
      }
      assert.equal((await request('/student/canteen','canteen_head')).status,403);
      assert.equal((await request('/student/canteen','admin')).status,403);
      assert.equal((await data('/student/canteen','student')).menu,null);
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
  }finally{
    await stop();await pool?.end();
    try{await admin.query('DROP DATABASE IF EXISTS `'+db+'`');}finally{await admin.end();}
  }
});

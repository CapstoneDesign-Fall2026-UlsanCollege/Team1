import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createApp } from '../dist/app.js';
import { validateMeeting, mysqlSchedules, ScheduleError } from '../dist/schedules.js';
const meeting = { course_offering_id: 5, day_of_week: 1, start_time: '09:00', end_time: '10:00', location: 'Room 302' };

test('meeting validation rejects invalid times, days and identifiers', () => {
  for (const change of [{day_of_week:0},{day_of_week:8},{start_time:'24:00'},{end_time:'09:00'},{course_offering_id:'5'},{location:' '},{end_time:'08:00'}])
    assert.throws(() => validateMeeting({...meeting,...change}), ScheduleError);
  assert.deepEqual(validateMeeting({...meeting,location:' Room 302 ',admin:true}), meeting);
});

test('schedule routes enforce roles, student scope and complete admin lifecycle', async () => {
  const password_hash = await bcrypt.hash('test-password', 4);
  const users = ['admin','student'].map((role,i) => ({id:i+1,login_id:role,role,password_hash,is_active:1}));
  let rows = [], scopedId;
  const schedules = {
    list: async id => { scopedId = id; return rows; },
    save: async (v,id) => { if (v.location === 'Conflict') throw new ScheduleError(409,'Overlap'); const key=id??1; rows=[{...v,id:key}]; return key; },
    remove: async id => { const found=rows.some(r=>r.id===id); rows=rows.filter(r=>r.id!==id); return found; }
  };
  const app=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),schedules});
  const server=app.listen(0,'127.0.0.1'); await new Promise(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${server.address().port}/api/`;
  try {
    assert.equal((await fetch(base+'student/schedule')).status,401);
    for (const role of ['student','admin']) {
      const login=await fetch(base+'auth/login',{method:'POST',headers:{'Content-Type':'application/json','X-StudentHub':'1'},body:JSON.stringify({login_id:role,password:'test-password'})});
      const headers={Cookie:login.headers.get('set-cookie').split(';')[0],'Content-Type':'application/json','X-StudentHub':'1'};
      const call=(path,method='GET',body)=>fetch(base+path,{headers,method,...(body?{body:JSON.stringify(body)}:{})});
      if(role==='student') {
        for(const method of ['GET','POST','PUT','DELETE']) assert.equal((await call('admin/schedules'+(['PUT','DELETE'].includes(method)?'/1':''),method,method==='POST'||method==='PUT'?meeting:undefined)).status,403);
        assert.equal((await call('student/schedule?studentId=999')).status,200); assert.equal(scopedId,2);
      } else {
        assert.equal((await call('admin/schedules','POST',{...meeting,end_time:'08:00'})).status,400);
        assert.equal((await call('admin/schedules','POST',meeting)).status,201);
        assert.equal((await (await call('admin/schedules')).json()).schedules.length,1);
        assert.equal((await call('admin/schedules/1','PUT',{...meeting,location:'Room 404'})).status,200);
        assert.equal(rows[0].location,'Room 404');
        assert.equal((await call('admin/schedules','POST',{...meeting,location:'Conflict'})).status,409);
        assert.equal((await call('admin/schedules/1','DELETE')).status,200);
        assert.equal((await call('admin/schedules/1','DELETE')).status,404);
      }
    }
  } finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});

test('database transaction rolls back conflicts and commits valid meetings',async()=>{
  for(const conflict of [true,false]) {
    const calls=[];
    const connection={beginTransaction:async()=>calls.push('begin'),commit:async()=>calls.push('commit'),rollback:async()=>calls.push('rollback'),release:()=>calls.push('release'),execute:async(sql,args)=>{
      if(sql.startsWith('SELECT semester_id')) return [[{semester_id:3,major:'Global Business'}]];
      if(sql.includes('cs.start_time <')) { assert.match(sql,/co.major <=> \?/); assert.deepEqual(args,[3,'Global Business',1,'10:00','09:00',0]); return [conflict?[{id:8}]:[]]; }
      if(sql.startsWith('INSERT')) return [{insertId:9}];
      return [[]];
    }};
    const store=mysqlSchedules({getConnection:async()=>connection});
    if(conflict) await assert.rejects(store.save(meeting),e=>e.status===409);
    else assert.equal(await store.save(meeting),9);
    assert.deepEqual(calls,['begin',conflict?'rollback':'commit','release']);
  }
});

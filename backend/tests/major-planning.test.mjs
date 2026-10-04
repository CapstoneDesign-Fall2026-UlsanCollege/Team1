import {test} from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {majorPlanningRouter} from '../dist/major-planning.js';
import {coursesForStudent} from '../dist/courses.js';
import {mysqlSchedules} from '../dist/schedules.js';
test('student course and timetable queries require both semester membership and profile major',async()=>{
  let queries=[];
  const pool={execute:async(sql,args)=>{queries.push(sql);assert.deepEqual(args,[22]);return [[]];}};
  await coursesForStudent(pool,22);await mysqlSchedules(pool).list(22);
  for(const sql of queries){assert.match(sql,/co.major\s*=\s*TRIM\(sp.major\)/);assert.match(sql,/ss.student_user_id\s*=\s*\?/);assert.match(sql,/semester_id/);}
});
test('major assignments require admin and major, permit same course in two majors, and reject duplicates',async()=>{
  const saved=[];
  const pool={execute:async(sql,values)=>{
    assert.match(sql,/INSERT INTO course_offerings/);
    if(saved.some(v=>v[0]===values[0]&&v[1]===values[1]&&v[2]===values[2]))throw Object.assign(new Error('duplicate'),{code:'ER_DUP_ENTRY'});
    saved.push(values);return [{insertId:saved.length}];
  }};
  const app=express();app.use(express.json());app.use((req,res,next)=>{res.locals.user={role:req.get('test-role')};next();});app.use(majorPlanningRouter(pool));
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const url=`http://127.0.0.1:${server.address().port}/admin/course-assignments`;
  const send=(role,major)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json','test-role':role},body:JSON.stringify({course_id:1,semester_id:1,professor:'Lee',major})});
  try{
    assert.equal((await send('student','Global Business')).status,403);
    assert.equal((await send('admin','')).status,400);
    assert.equal((await send('admin','Global Business')).status,201);
    assert.equal((await send('admin','Computer IT & Security')).status,201);
    assert.equal((await send('admin','Global Business')).status,409);
    assert.equal(saved.length,2);
  }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});

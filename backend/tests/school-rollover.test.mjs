import {test} from 'node:test';import assert from 'node:assert/strict';import express from 'express';
import {rolloverInput,rolloverPlan,schoolRolloverRouter} from '../dist/school-rollover.js';
import {schoolPlanningRouter} from '../dist/school-planning.js';
const input={source_year_id:1,target_year_id:2,mappings:[{source_class_id:10,target_class_id:20}],revision:3};
function fixture(){
 const years=[{id:1,name:'2026',start_date:'2026-04-15',end_date:'2027-04-14'},{id:2,name:'2027',start_date:'2027-04-15',end_date:'2028-04-14'}];
 const members=[{membership_id:100,student_user_id:1,class_id:10,login_id:'test1',full_name:'First Test',starts_on:'2026-04-15',ends_on:null},{membership_id:101,student_user_id:2,class_id:10,login_id:'test2',full_name:'Second Test',starts_on:'2026-04-15',ends_on:null}];
 const existing=[],writes=[];let version=3;
 const db={getConnection:async()=>db,beginTransaction:async()=>{},commit:async()=>{},rollback:async()=>{},release:()=>{},execute:async(sql,a=[])=>{
  if(sql.includes('school_planning_lock'))return [[{version}]];
  if(sql.includes('FROM school_years WHERE'))return [years];
  if(sql.includes('FROM school_classes WHERE'))return [[{id:10,year_id:1,grade_label:'6',name:'A',is_active:1},{id:20,year_id:2,grade_label:'7',name:'A',is_active:1}]];
  if(sql.includes('FROM school_memberships m JOIN users')){assert.match(sql,/u.is_active=1/);assert.deepEqual(a,[1,'2027-04-14','2027-04-14']);return [members];}
  if(sql.includes('FROM school_memberships WHERE'))return [existing];
  if(sql.startsWith('UPDATE school_memberships')){writes.push([sql,a]);members.find(m=>m.membership_id===a[1]).ends_on=a[0];return [{affectedRows:1}];}
  if(sql.startsWith('INSERT INTO school_memberships')){writes.push([sql,a]);existing.push({student_user_id:a[0],class_id:a[2],starts_on:a[3]});return [{insertId:200}];}
  throw Error(sql);
 }};
 const mutate=async(revision,run)=>{if(revision!==version)throw Object.assign(Error('Stale revision'),{status:409});const result=await run(db);version++;return result};
 return {db,mutate,years,members,existing,writes};
}
test('rollover validates mappings, nonoverlapping years, preserves IDs and identifies existing enrollment',async()=>{
 for(const change of [{target_year_id:1},{mappings:[]},{mappings:[input.mappings[0],input.mappings[0]]}])assert.throws(()=>rolloverInput({...input,...change}));
 const f=fixture(),plan=await rolloverPlan(f.db,input);assert.equal(plan.close_on,'2027-04-15');assert.equal(plan.students[0].status,'ready');assert.equal(plan.students[0].login_id,'test1');assert.equal(f.writes.length,0);
 f.existing.push({student_user_id:1,class_id:20,starts_on:'2027-04-15'});assert.equal((await rolloverPlan(f.db,input)).students[0].status,'already_enrolled');
 f.existing[0].class_id=99;assert.equal((await rolloverPlan(f.db,input)).students[0].status,'conflict');
 f.years[1].start_date='2027-04-14';await assert.rejects(rolloverPlan(f.db,input),/must start after/);
});
test('confirmed rollover inserts only selected ready students, rejects changed previews and duplicate runs',async()=>{
 const f=fixture(),app=express();app.use(express.json());app.use(schoolRolloverRouter(f.db,f.mutate));app.use((e,req,res,next)=>res.status(e.status??e.statusCode??500).json({message:e.message}));
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;
 const req=async(path,body)=>fetch(base+'/admin/school/rollover'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 try{
  const preview=await(await req('/preview',input)).json();assert.equal(f.writes.length,0);
  assert.equal((await req('',{...input,student_ids:[1],digest:preview.digest,confirmed:false})).status,400);
  const changed=await req('',{...input,student_ids:[1],digest:'old',confirmed:true});assert.equal(changed.status,409);assert.equal(f.writes.length,0);
  const result=await req('',{...input,student_ids:[1],digest:preview.digest,confirmed:true});assert.equal(result.status,200);assert.equal(f.writes.length,2);
  assert.deepEqual(f.writes[0][1],['2027-04-15',100]);assert.deepEqual(f.writes[1][1],[1,2,20,'2027-04-15']);assert.equal(f.members[1].ends_on,null);
  const again=await(await req('/preview',{...input,revision:4})).json();assert.equal(again.students[0].status,'already_enrolled');
  assert.equal((await req('',{...input,revision:4,student_ids:[1],digest:again.digest,confirmed:true})).status,409);assert.equal(f.writes.length,2);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r))}
});
test('school rollover routes require administrator role before preview queries',async()=>{
 const app=express();app.use(express.json());app.use((req,res,next)=>{res.locals.user={role:'teacher'};next()});app.use(schoolPlanningRouter({execute:async()=>{throw Error('Must not query')}}));const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));try{const r=await fetch('http://127.0.0.1:'+server.address().port+'/admin/school/rollover/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});assert.equal(r.status,403)}finally{server.closeAllConnections();await new Promise(r=>server.close(r))}
});

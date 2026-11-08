import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const js=ts.transpileModule(readFileSync(new URL('../src/weekly-routine.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {groupWeeklyRoutine}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const lesson=(day,extra={})=>({id:day,course_offering_id:1,semester_id:1,major:null,course_code:'SCI',course_name:'Science',professor:'Teacher A',section:'A',day_of_week:day,start_time:'10:00:00',end_time:'11:00:00',location:'Room 101',...extra});
test('same Sunday-Friday routine is shown once; IDs and source order do not split it',()=>{
 const input=[5,2,7,1,4,3].flatMap(day=>[lesson(day,{id:day+10,start_time:'11:00',end_time:'12:00',course_name:'English',course_code:'ENG'}),lesson(day)]);
 const before=JSON.stringify(input),groups=groupWeeklyRoutine(input,true);
 assert.equal(groups.length,1);assert.equal(groups[0].label,'Sunday–Friday');assert.equal(groups[0].meetings.length,2);assert.equal(JSON.stringify(input),before);
});
test('subject, time, room or teacher exceptions each stay separate',()=>{
 for(const difference of [{course_name:'Art'},{start_time:'10:30'},{end_time:'11:30'},{location:'Science lab'},{professor:'Teacher B'}]){
  const groups=groupWeeklyRoutine([7,1,2,3,4,5].map(day=>lesson(day,day===3?difference:{})),true);
  assert.equal(groups.length,2);assert.equal(groups.find(g=>g.days.includes(3)).label,'Wednesday');assert.equal(groups.find(g=>g.days.length===5).label,'Sunday, Monday, Tuesday, Thursday, Friday');
 }
});
test('empty days and Saturday schedules remain explicit without inventing lessons',()=>{
 const groups=groupWeeklyRoutine([lesson(1),lesson(6,{course_name:'Special session'})],true);
 assert.ok(groups.some(g=>g.label==='Saturday'&&g.meetings[0].course_name==='Special session'));
 assert.ok(groups.some(g=>g.days.includes(7)&&!g.meetings.length));assert.deepEqual(groupWeeklyRoutine([],true)[0].days,[7,1,2,3,4,5]);
 const legacy=groupWeeklyRoutine([lesson(1),lesson(2,{section:'B'})],false);assert.notEqual(legacy.find(g=>g.days.includes(1)),legacy.find(g=>g.days.includes(2)));
});

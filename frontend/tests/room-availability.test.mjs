import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../src/room-availability.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {teacherBusyReason:check}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const school={subject_teachers:[{teacher_id:1,offering_id:2}],subjects:[{id:2,semester_id:3}],terms:[{id:3,start_date:'2026-01-01',end_date:'2026-12-31'}],links:[{offering_id:2,class_id:9}],meetings:[{course_offering_id:2,day_of_week:3,start_time:'10:00:00',end_time:'11:00:00'}]};
const run=(cl=8,date='2026-11-04',start='10:00',end='11:00',bookings=[])=>check(1,cl,date,start,end,school,bookings);
test('other-class teaching blocks only overlapping lessons within term',()=>{
 assert.equal(run(),'Teaching another class');assert.equal(run(8,'2026-11-04','11:00','12:00'),'');assert.equal(run(8,'2027-11-03'),'');assert.equal(run(8,'2026-11-05'),'');
});
test('supervising own class is allowed; another room booking still blocks',()=>{
 assert.equal(run(9),'');
 const b={teacher_id:1,is_cancelled:0,starts_on:'2026-11-01',ends_on:'2026-11-30',day_of_week:3,start_time:'10:30',end_time:'11:30'};
 assert.equal(run(9,'2026-11-04','10:00','11:00',[b]),'Room booking');
 assert.equal(run(9,'2026-11-04','10:00','11:00',[{...b,is_cancelled:1}]),'');
 assert.equal(run(9,'2026-11-04','10:00','11:00',[{...b,starts_on:'2026-11-11'}]),'');
});
test('missing or invalid times are not advertised as available',()=>{assert.equal(run(9,'2026-11-04','',''),'Choose date and times');assert.equal(run(9,'2026-11-04','12:00','10:00'),'Choose date and times')});

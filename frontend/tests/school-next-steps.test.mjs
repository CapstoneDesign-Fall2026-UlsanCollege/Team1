import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const js=ts.transpileModule(readFileSync(new URL('../src/school-next-steps.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {schoolGuide}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const empty={year:null,today:'2026-11-17',counts:{school:0,terms:0,classes:0,rooms:0,unroomed:0,grades_without_subjects:0,teachers:0,classes_without_subjects:0,classes_without_lessons:0,teachers_without_login:0,classes_without_students:0,canteen_staff:0}};
const first=d=>schoolGuide(d).find(s=>!s.done)?.id;
test('empty data cannot claim class, lesson or teacher-login readiness from zero missing counts',()=>{
 const steps=schoolGuide(empty);assert.equal(first(empty),'school');for(const id of ['classes','rooms','subjects','assignments','timetable','teacher-login','students'])assert.equal(steps.find(s=>s.id===id).done,false);
});
test('saved setup advances through the next missing task and back when a required record is removed',()=>{
 const d=structuredClone(empty);d.counts.school=1;assert.equal(first(d),'year');d.year={id:1,name:'2026–2027'};assert.equal(first(d),'term');d.counts.terms=1;assert.equal(first(d),'classes');d.counts.classes=2;d.counts.unroomed=2;d.counts.grades_without_subjects=1;d.counts.classes_without_subjects=2;d.counts.classes_without_lessons=2;d.counts.classes_without_students=2;assert.equal(first(d),'rooms');
 d.counts.rooms=2;d.counts.unroomed=0;assert.equal(first(d),'subjects');d.counts.grades_without_subjects=0;assert.equal(first(d),'teachers');d.counts.teachers=1;assert.equal(first(d),'assignments');d.counts.classes_without_subjects=0;assert.equal(first(d),'timetable');d.counts.classes_without_lessons=0;d.counts.teachers_without_login=1;assert.equal(first(d),'teacher-login');d.counts.teachers_without_login=0;assert.equal(first(d),'students');d.counts.classes_without_students=0;assert.equal(first(d),'canteen');d.counts.canteen_staff=1;assert.equal(first(d),undefined);d.counts.unroomed=1;assert.equal(first(d),'rooms');
});
test('guide navigation matches actual admin panels, does not mutate counts or require parent data',()=>{
 const before=JSON.stringify(empty),steps=schoolGuide(empty);assert.equal(steps.find(s=>s.id==='teachers').panel,'teachers');assert.equal(steps.find(s=>s.id==='teacher-login').panel,'teacher-access');assert.equal(steps.find(s=>s.id==='timetable').panel,'subjects');assert.equal(steps.find(s=>s.id==='canteen').panel,'canteen');assert.ok(!steps.some(s=>s.id==='parents'));assert.equal(JSON.stringify(empty),before);
});

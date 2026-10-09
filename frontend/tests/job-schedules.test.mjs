import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../src/job-schedules.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {parseJobSchedule:parse,matchesSchedule:matches}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('Korean schedules parse conservatively',()=>{
assert.deepEqual(parse('평일 : (오전) 8시 00분 ~ (오후) 5시 00분, 주 5일 근무'),{days:[0,1,2,3,4],start:480,end:1020});
assert.deepEqual(parse('주말 09:00 ~ 13:00'),{days:[5,6],start:540,end:780});
assert.deepEqual(parse('월~금 09:00~18:00'),{days:[0,1,2,3,4],start:540,end:1080});
assert.equal(parse('평일 : 09:00~18:00, 주 6일 근무').days,null);
assert.equal(parse('월~금, 토요일 근무 09:00~18:00').days,null);
for(const value of ['월~금 09:00~18:00 교대근무','시간 협의','09:00~18:00 휴게 12:00~13:00','25:00~26:00','(오전) 9시 00분 ~ 6시 00분'])assert.equal(parse(value).start,null);
assert.equal(parse('(오후) 12시 00분 ~ (오후) 1시 00분').start,720);
});
test('every known day and entire shift must fit; unknowns are optional',()=>{
const weekday=parse('월~금 09:00~18:00'),weekend=parse('주말 10:00~14:00'),filter={days:[0,1,2,3,4],start:'08:00',end:'19:00',includeUnknown:false};
assert.equal(matches(weekday,filter),true);assert.equal(matches(weekend,filter),false);
assert.equal(matches(weekday,{...filter,days:[0]}),false);assert.equal(matches(weekday,{...filter,end:'12:00'}),false);
assert.equal(matches(parse('시간 협의'),filter),false);assert.equal(matches(parse('시간 협의'),{...filter,includeUnknown:true}),true);
assert.equal(matches(weekend,{...filter,includeUnknown:true}),false);assert.equal(matches(weekend,{...filter,days:[5,6],start:'',end:''}),true);
assert.equal(matches(parse('월~금 22:00~06:00'),{...filter,days:[0,1,2,3,4,5,6],start:'21:00',end:'07:00'}),true);assert.equal(matches(parse('월~금 22:00~06:00'),filter),false);
});

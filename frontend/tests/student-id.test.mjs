import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const js=ts.transpileModule(readFileSync(new URL('../src/student-id.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {studentIdPrefix,schoolStudentId}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('admission year, grade and section produce five fixed digits with padded sequence',()=>{
 assert.equal(studentIdPrefix('2026-11-09','6','A'),'26061');
 assert.equal(schoolStudentId('26061','61'),'26061061');
 assert.equal(schoolStudentId(studentIdPrefix('2027-01-01','10','B'),'1'),'27102001');
 assert.equal(schoolStudentId(studentIdPrefix('2026-11-09','12',' i '),'999'),'26129999');
});
test('unsupported labels, impossible dates and invalid student numbers fail instead of colliding',()=>{
 for(const args of [['2026-02-30','6','A'],['2026-11-09','0','A'],['2026-11-09','13','A'],['2026-11-09','6','J'],['2026-11-09','6','Section A'],['','6','A']])assert.equal(studentIdPrefix(...args),'');
 for(const n of ['','0','000','1000','-1','1.5','abc'])assert.equal(schoolStudentId('26061',n),'');
 assert.equal(schoolStudentId('','061'),'');
 assert.equal(schoolStudentId('26061','001'),'26061001');
});

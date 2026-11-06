import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const src=readFileSync(new URL('../src/canteen-menu-tools.ts',import.meta.url),'utf8');
const js=ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {weekdayDate,recommendedPrice}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('weekday selector stays within Sunday-start week across month/year boundaries',()=>{
 assert.equal(weekdayDate('2026-11-06',0),'2026-11-01');assert.equal(weekdayDate('2026-11-06',6),'2026-11-07');
 assert.equal(weekdayDate('2027-01-01',0),'2026-12-27');assert.equal(weekdayDate('2027-01-01',6),'2027-01-02');
 for(const input of ['','2026-02-30','x'])assert.throws(()=>weekdayDate(input,1));assert.throws(()=>weekdayDate('2026-11-06',7));
});
test('saved names fill prices only for an exact normalized match; new names stay editable',()=>{
 const items=[{name:'Vegetable momo',price:80},{name:'Free water',price:0}];
 assert.equal(recommendedPrice(' vegetable MOMO ',items),80);assert.equal(recommendedPrice('Free water',items),0);
 assert.equal(recommendedPrice('Veg',items),undefined);assert.equal(recommendedPrice('New meal',items),undefined);
});

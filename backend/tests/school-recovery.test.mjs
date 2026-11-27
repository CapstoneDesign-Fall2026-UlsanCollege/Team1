import {test} from 'node:test';import assert from 'node:assert/strict';
import {strToU8,unzipSync,strFromU8} from 'fflate';
import {transferFileIssues,schoolRecoveryPackage,decodeCsv,encodeCsv} from '../dist/school-transfer.js';
const columns=[{Field:'floor_number',Type:'int',Null:'NO',Key:'PRI',Extra:''},{Field:'label',Type:'varchar(10)',Null:'NO',Key:'',Extra:''}];
test('recovery validation reports several field errors with file and row locations',()=>{
 const files={'school_floors.csv':strToU8(encodeCsv([['floor_number','label'],['bad','Valid'],['1','longer-than-ten']]))};
 const errors=transferFileIssues(files,{school_floors:columns});assert.equal(errors.length,2);assert.deepEqual(errors.map(e=>[e.file,e.row,e.field]),[['school_floors.csv',2,'floor_number'],['school_floors.csv',3,'label']]);
 const many={'school_floors.csv':strToU8(encodeCsv([['floor_number','label'],...Array.from({length:30},()=>['bad','x'])]))};assert.equal(transferFileIssues(many,{school_floors:columns}).length,20);
 assert.equal(transferFileIssues({'school_floors.csv':strToU8('wrong,headers\n')},{school_floors:columns})[0].row,1);
});
test('recovery package remains CSV-compatible and explicitly excludes credentials and guardian access links',()=>{
 const zipped=schoolRecoveryPackage({school_floors:[{floor_number:1,label:'First'}]},{school_floors:columns},'fixture-installation');
 const files=unzipSync(zipped),manifest=JSON.parse(strFromU8(files['manifest.json']));
 assert.equal(manifest.source,'fixture-installation');assert.equal(manifest.format,'studenthub-csv-v1');assert.ok(manifest.excluded.includes('parent-child access links'));
 assert.deepEqual(decodeCsv(strFromU8(files['school_floors.csv'])),[['floor_number','label'],['1','First']]);assert.match(strFromU8(files['README.txt']),/does not remove records/);
});

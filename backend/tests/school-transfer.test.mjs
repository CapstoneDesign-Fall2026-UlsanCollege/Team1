import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zipSync,strToU8} from 'fflate';
import {encodeCsv,decodeCsv,readPackage} from '../dist/school-transfer.js';

test('CSV preserves Unicode, leading zeroes, multiline quotes, nulls and formula-like text safely',()=>{
 const rows=[['name','phone','notes'],['नेपाल','0123456789','Comma, "quote"\r\nnext line'],[null,'','\\N'],['=SUM(A1)','+977123',"'literal"],['-12','@name','\tvalue'],["'=literal",'\\\\N','normal']];
 const text=encodeCsv(rows);assert.ok(text.startsWith('\uFEFF'));assert.ok(text.includes('"\'=SUM(A1)"'));assert.deepEqual(decodeCsv(text),rows);
});
test('CSV rejects malformed quotes rather than shifting columns silently',()=>{
 for(const text of ['"unclosed','ab"cd','"closed"text','"one",abc"def'])assert.throws(()=>decodeCsv(text));
 assert.deepEqual(decodeCsv('a,b\r\n1,2\r\n'),[['a','b'],['1','2']]);
});
test('package input rejects corrupt, unsupported, unsafe and over-expanded ZIPs',()=>{
 const manifest=strToU8(JSON.stringify({format:'studenthub-csv-v1',source:'fictional-test'}));
 const pack=files=>Buffer.from(zipSync(files)).toString('base64');
 assert.ok(readPackage(pack({'manifest.json':manifest})).manifest);
 for(const input of [null,'x',pack({'notes.txt':strToU8('not a package')}),pack({'manifest.json':manifest,'../users.csv':strToU8('bad')}),pack({'manifest.json':manifest,'passwords.csv':strToU8('bad')}),pack({'manifest.json':manifest,'README.txt':new Uint8Array(20_000_001)})])assert.throws(()=>readPackage(input));
});

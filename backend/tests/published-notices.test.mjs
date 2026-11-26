import {test} from 'node:test';import assert from 'node:assert/strict';
import {publishedNotices} from '../dist/published-notices.js';
test('notice board combines school and class notices with current audience and date constraints',async()=>{
 for(const role of ['student','parent']){
  let calls=0;
  const db={execute:async(sql,args)=>{
   calls++;assert.match(sql,/published=1/);assert.equal(args[0],'2026-11-26');assert.equal(args[1],'2026-11-26');
   if(sql.includes('FROM school_notices'))return [[{id:1,title:'School',starts_on:'2026-11-25'}]];
   assert.match(sql,/cl.is_active=1/);assert.match(sql,/y.start_date<=\?/);assert.match(sql,/m.class_id=n.class_id/);assert.match(sql,/m.starts_on<=\?/);assert.match(sql,/m.ends_on IS NULL OR m.ends_on>\?/);assert.equal(args[4],42);
   if(role==='parent'){assert.match(sql,/ps.parent_user_id=\?/);assert.match(sql,/ps.is_active=1/);assert.match(sql,/u.is_active=1/)}else{assert.match(sql,/m.student_user_id=\?/);assert.doesNotMatch(sql,/school_parent_students/)}
   return [[{id:1,title:'Class',starts_on:'2026-11-26',teacher_name:'Teacher',grade_label:'10',class_name:'A'}]];
  }};
  const result=await publishedNotices(db,42,role,'2026-11-26');assert.equal(calls,2);assert.deepEqual(result.map(n=>[n.source,n.author]),[['class','Teacher'],['school','School administration']]);
 }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStudent, validateStudent } from '../dist/students.js';
const student = { login_id:'2026008', password:'long-test-password', full_name:'Test Student', university:'College', major:'CS', year_of_study:1 };
test('creation validates optional semester IDs', () => {
  for (const semester_id of [0,-1,'1',1.5,{},[]]) assert.equal(validateStudent({...student,semester_id}).ok,false);
  for (const semester_id of [undefined,null,3]) assert.equal(validateStudent({...student,semester_id}).ok,true);
  assert.equal(validateStudent({...student,semester_id:3}).student.semester_id,3);
});
test('account, profile and semester assignment commit together or roll back together', async () => {
  for (const fail of [false,true]) {
    const calls=[];
    const connection={beginTransaction:async()=>calls.push('begin'),commit:async()=>calls.push('commit'),rollback:async()=>calls.push('rollback'),release:()=>calls.push('release'),execute:async(sql,values)=>{
      if(sql.includes('INSERT INTO users')){calls.push('account');return [{insertId:42}];}
      if(sql.includes('INSERT INTO student_profiles')){calls.push('profile');return [{}];}
      assert.match(sql,/INSERT INTO student_semesters/);assert.deepEqual(values,[42,3]);calls.push('semester');
      if(fail)throw new Error('Invalid semester');return [{}];
    }};
    const operation=createStudent({getConnection:async()=>connection},{...student,semester_id:3});
    if(fail)await assert.rejects(operation,/Invalid semester/);else assert.equal(await operation,42);
    assert.deepEqual(calls,['begin','account','profile','semester',fail?'rollback':'commit','release']);
  }
});

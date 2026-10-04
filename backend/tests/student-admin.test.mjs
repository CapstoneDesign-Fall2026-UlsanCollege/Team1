import {test} from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';
import {validateStudentEdit,mysqlStudentAdmin} from '../dist/student-admin.js';
const profile={full_name:'Student One',university:'College',major:null,year_of_study:null,email:null,phone_number:null,address:null,is_active:true};
test('student edits validate and allowlist fields',()=>{
  for(const semester_ids of [[1,1],[0],['1'],null,{},[-1]]) assert.equal(validateStudentEdit({...profile,semester_ids}),null);
  assert.deepEqual(validateStudentEdit({...profile,semester_ids:[1,3]}).semester_ids,[1,3]);
  assert.deepEqual(validateStudentEdit({...profile,semester_ids:[]}).semester_ids,[]);
  assert.deepEqual(validateStudentEdit({...profile,role:'admin',password:'ignored'}),profile);
  for(const extra of [{is_active:1},{full_name:' '},{email:'bad'},{year_of_study:0},{year_of_study:'2'},{address:'x'.repeat(501)}]) assert.equal(validateStudentEdit({...profile,...extra}),null);
});
test('semester changes validate targets, preserve retained assignments and roll back failures',async()=>{
  for(const mode of ['replace','clear','invalid','failure']){
    const calls=[];
    const c={beginTransaction:async()=>calls.push('begin'),commit:async()=>calls.push('commit'),rollback:async()=>calls.push('rollback'),release:()=>calls.push('release'),execute:async(sql,args)=>{
      if(sql.startsWith('SELECT u.id'))return [[{id:2}]];
      if(sql.startsWith('SELECT id FROM semesters'))return [mode==='invalid'?[]:[{id:3}]];
      if(sql.startsWith('DELETE')){assert.equal(args[0],2);assert.equal(sql.includes('NOT IN'),mode!=='clear');calls.push('remove');return [{}];}
      if(sql.startsWith('INSERT')){assert.deepEqual(args,[2,3]);assert.match(sql,/ON DUPLICATE KEY UPDATE/);calls.push('assign');return [{}];}
      if(sql.startsWith('UPDATE student_profiles')&&mode==='failure')throw new Error('Profile write failed');
      return [{}];
    }};
    const store=mysqlStudentAdmin({getConnection:async()=>c});
    const operation=store.update(2,{...profile,semester_ids:mode==='clear'?[]:[3]});
    if(mode==='invalid'||mode==='failure')await assert.rejects(operation);else assert.equal(await operation,true);
    assert.equal(calls.includes('commit'),mode==='replace'||mode==='clear');
    assert.equal(calls.includes('rollback'),mode==='invalid'||mode==='failure');
    if(mode==='invalid')assert.equal(calls.includes('remove'),false);
    assert.equal(calls.at(-1),'release');
  }
});
test('directory and profile updates are admin-only, validate input and retain login identity',async()=>{
  const password_hash=await bcrypt.hash('test-password',4);
  const users=['admin','student'].map((role,i)=>({id:i+1,login_id:role,role,is_active:1,password_hash}));
  let record={...profile,id:2,login_id:'student'};
  const app=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),studentAdmin:{list:async search=>record.full_name.includes(search)?[record]:[],update:async(id,v)=>{if(id!==2)return false;record={...record,...v};return true;}}});
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}/api/`;
  try{
    assert.equal((await fetch(base+'admin/students')).status,401);
    for(const role of ['student','admin']){
      const login=await fetch(base+'auth/login',{method:'POST',headers:{'Content-Type':'application/json','X-StudentHub':'1'},body:JSON.stringify({login_id:role,password:'test-password'})});
      const headers={Cookie:login.headers.get('set-cookie').split(';')[0],'Content-Type':'application/json','X-StudentHub':'1'};
      const update=(id,value)=>fetch(base+'admin/students/'+id,{headers,method:'PUT',body:JSON.stringify(value)});
      if(role==='student'){assert.equal((await fetch(base+'admin/students',{headers})).status,403);assert.equal((await update(2,profile)).status,403);}
      else{
        assert.equal((await update(2,{...profile,email:'bad'})).status,400);
        assert.equal((await update(1,profile)).status,404);
        assert.equal((await update(2,{...profile,full_name:'Updated Name',is_active:false,login_id:'changed',role:'admin'})).status,200);
        const rows=(await(await fetch(base+'admin/students?search=Updated',{headers})).json()).students;
        assert.equal(rows[0].login_id,'student');assert.equal(rows[0].full_name,'Updated Name');assert.equal(rows[0].is_active,false);assert.equal(rows[0].role,undefined);
        assert.equal((await update(2,{...profile,is_active:true})).status,200);
      }
    }
  }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
test('student update is atomic and refuses nonstudent targets',async()=>{
  for(const mode of ['success','missing','failure']){
    const calls=[];
    const c={beginTransaction:async()=>calls.push('begin'),commit:async()=>calls.push('commit'),rollback:async()=>calls.push('rollback'),release:()=>calls.push('release'),execute:async(sql,args)=>{
      if(sql.startsWith('SELECT')){assert.match(sql,/role='student'/);return [mode==='missing'?[]:[{id:2}]];}
      calls.push(sql.startsWith('UPDATE student_profiles')?'profile':'account');
      assert.equal(args.at(-1),2);
      if(mode==='failure'&&sql.startsWith('UPDATE users'))throw new Error('write failed');
      return [{}];
    }};
    const store=mysqlStudentAdmin({getConnection:async()=>c});
    if(mode==='failure')await assert.rejects(store.update(2,profile));else assert.equal(await store.update(2,profile),mode==='success');
    assert.deepEqual(calls,mode==='missing'?['begin','rollback','release']:['begin','profile','account',mode==='success'?'commit':'rollback','release']);
  }
});

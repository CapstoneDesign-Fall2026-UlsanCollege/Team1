// Separate persistent local school. Copies table structure only, never school records.
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import {createDatabaseApp} from '../dist/database-app.js';
import {ensureSchoolSchema} from '../dist/school-schema.js';
import {ensureTeacherSchema} from '../dist/teacher-workspace.js';
import {ensureActivitySchema} from '../dist/activity-log.js';
import {ensureCanteenMenuSchema} from '../dist/canteen-menu.js';
import {canteenInfoSchema} from '../dist/canteen-info.js';
import {resetSchema} from '../dist/password-resets.js';
import {favouritesSchema} from '../dist/job-favourites.js';

const host=process.env.DB_HOST??'127.0.0.1';
const database=process.env.FRESH_DB_NAME;
const port=Number(process.env.FRESH_PORT??3021);
if(!['localhost','127.0.0.1'].includes(host)||!/^studenthub_fresh_[a-z0-9_]{1,32}$/.test(database??''))throw Error('Use a local host and a separate studenthub_fresh_ database name.');
if(!Number.isInteger(port)||port<1024||port>65535||port===3020)throw Error('Choose a separate local port, default 3021.');
const config={host,port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD};
const ident=value=>'`'+value.replaceAll('`','``')+'`';
const root=await mysql.createConnection(config);
let pool;
try{
 if(process.env.FRESH_CREATE==='1'){
  const password=process.env.FRESH_ADMIN_PASSWORD;
  if(typeof password!=='string'||password.length<12||Buffer.byteLength(password)>72)throw Error('Supply a private initial admin password of at least 12 characters and at most 72 UTF-8 bytes.');
  const [existing]=await root.execute('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=?',[database]);
  if(existing.length)throw Error('Database already exists. Restart without FRESH_CREATE; this script never resets existing data.');
  const [tables]=await root.execute("SELECT TABLE_NAME name FROM information_schema.TABLES WHERE TABLE_SCHEMA='studenthub' AND TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME");
  if(!tables.some(t=>t.name==='users')||!tables.some(t=>t.name==='school_building_settings'))throw Error('The local studenthub schema must be available as a structure-only template.');
  await root.query('CREATE DATABASE '+ident(database)+' CHARACTER SET utf8mb4');
  await root.query('USE '+ident(database));
  await root.query('SET FOREIGN_KEY_CHECKS=0');
  try{
   for(const {name}of tables){
    const [[ddl]]=await root.query('SHOW CREATE TABLE `studenthub`.'+ident(name));
    await root.query(ddl['Create Table'].replace(/ AUTO_INCREMENT=\d+/g,''));
   }
  }finally{await root.query('SET FOREIGN_KEY_CHECKS=1');}
  // Prevent the legacy five-floor sample layout from appearing in this empty school.
  await root.query('INSERT INTO school_building_settings(id,initialized) VALUES(1,1)');
  const hash=await bcrypt.hash(password,12);
  await root.execute("INSERT INTO users(login_id,password_hash,role,is_active) VALUES('admin',?,'admin',1)",[hash]);
  delete process.env.FRESH_ADMIN_PASSWORD;
  console.log('Created a separate school with one administrator. No source rows were copied.');
 }
 pool=mysql.createPool({...config,database,connectionLimit:5});
 await ensureSchoolSchema(pool);await ensureTeacherSchema(pool);
 await ensureCanteenMenuSchema(pool);await pool.query(canteenInfoSchema);
 await pool.query(resetSchema);await pool.query(favouritesSchema);await ensureActivitySchema(pool);
 await root.end();
 process.env.SERVE_FRONTEND='true';process.env.NODE_ENV='development';delete process.env.FRONTEND_ORIGIN;
 const app=createDatabaseApp(pool);
 const server=app.listen(port,'127.0.0.1');
 server.on('listening',()=>console.log('Empty-school workspace: http://127.0.0.1:'+port+' / '+database+'. Changes remain saved after stopping.'));
 server.on('error',async e=>{console.error(e.message);await pool.end();process.exitCode=1;});
 let closing=false;
 async function close(){if(closing)return;closing=true;server.closeAllConnections();await new Promise(r=>server.close(r));await pool.end();process.exit(0);}
 process.stdin.setEncoding('utf8');process.stdin.on('data',v=>{if(v.trim()==='stop')void close();});
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>void close());
}catch(e){await pool?.end();await root.end().catch(()=>{});throw e;}

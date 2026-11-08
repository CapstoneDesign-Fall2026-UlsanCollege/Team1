import {ensureActivitySchema} from '../dist/activity-log.js';
import {ensureCanteenMenuSchema} from '../dist/canteen-menu.js';
import {canteenInfoSchema} from '../dist/canteen-info.js';
// Persistent local server. Stopping this process never drops or reseeds a database.
import mysql from 'mysql2/promise';
import { createDatabaseApp } from '../dist/database-app.js';
const host=process.env.DB_HOST??'127.0.0.1',database=process.env.DB_NAME??'studenthub';
if(!['127.0.0.1','localhost'].includes(host)||database!=='studenthub')throw Error('This launcher only serves local studenthub.');
process.env.SERVE_FRONTEND='true';process.env.NODE_ENV='development';delete process.env.FRONTEND_ORIGIN;
const pool=mysql.createPool({host,port:Number(process.env.DB_PORT??3307),user:process.env.DB_USER??'root',password:process.env.DB_PASSWORD,database,connectionLimit:5});
try{
  await ensureCanteenMenuSchema(pool);await pool.query(canteenInfoSchema);
  await pool.query('SELECT id FROM school_profile LIMIT 1');
  await ensureActivitySchema(pool);
  const app=createDatabaseApp(pool),port=Number(process.env.SCHOOL_LOCAL_PORT??3020);
  const server=app.listen(port,'127.0.0.1');
  server.on('listening',()=>console.log('Persistent StudentHub: http://127.0.0.1:'+port+' / database: studenthub. Data stays saved after stopping.'));
  server.on('error',async e=>{console.error(e.message);await pool.end();process.exitCode=1;});
  let closing=false;async function close(){if(closing)return;closing=true;server.closeAllConnections();await new Promise(r=>server.close(r));await pool.end();process.exit(0);}
  process.stdin.setEncoding('utf8');process.stdin.on('data',v=>{if(v.trim()==='stop')void close();});
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>void close());
}catch(e){await pool.end();throw e;}

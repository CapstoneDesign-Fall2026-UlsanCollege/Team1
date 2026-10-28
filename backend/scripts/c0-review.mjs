// Local C0 walkthrough fixture. No MySQL connection and no production accounts.
import {randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import {createApp} from '../dist/app.js';

const indexUrl=new URL('../../frontend/dist/index.html',import.meta.url);
const html=await readFile(indexUrl,'utf8').catch(()=>{throw Error('Build the published C0 frontend with VITE_BASE_PATH=/ first. See classroom/week8/c0-independent-test.md.');});
const asset=html.match(/src="(\/assets\/[^" ]+\.js)"/)?.[1];
if(!asset)throw Error('Use the root-path frontend build described in the C0 procedure.');
const bundle=await readFile(new URL('../../frontend/dist'+asset,import.meta.url),'utf8');
if(!bundle.includes('Canteen management is coming next'))throw Error('This is not the published C0-only workspace. Use a fresh checkout of the report commit; do not mix unpublished extension builds into this test.');

process.env.SERVE_FRONTEND='true';
process.env.NODE_ENV='test';
const port=Number(process.env.C0_REVIEW_PORT??3018);
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Choose a local C0_REVIEW_PORT between 1024 and 65535.');
const password=randomBytes(18).toString('base64url');
const hash=await bcrypt.hash(password,12);
const users=[
 {id:1,login_id:'review_admin',password_hash:hash,role:'admin',is_active:1},
 {id:2,login_id:'review_student',password_hash:hash,role:'student',is_active:1},
 {id:3,login_id:'review_canteen',password_hash:hash,role:'canteen_head',is_active:1},
];
const staffStore={
 async list(){return users.filter(u=>u.role==='canteen_head').map(({id,login_id,is_active})=>({id,login_id,is_active:!!is_active}));},
 async create(login_id,password_hash){
  if(users.some(u=>u.login_id===login_id))throw Object.assign(new Error('Duplicate fixture login'),{code:'ER_DUP_ENTRY'});
  const id=users.length+1;users.push({id,login_id,password_hash,role:'canteen_head',is_active:1});return id;
 },
 async setActive(id,active){const user=users.find(u=>u.id===id&&u.role==='canteen_head');if(!user)return false;user.is_active=Number(active);return true;},
};
const app=createApp({byLogin:async login=>users.find(u=>u.login_id===login),byId:async id=>users.find(u=>u.id===id),canteenAccounts:staffStore});
const server=app.listen(port,'127.0.0.1',()=>{
 console.log('C0 LOCAL FICTIONAL-ACCOUNT REVIEW ONLY — no MySQL, no production data.');
 console.log('Open http://127.0.0.1:'+port+'/');
 console.log('Fixture login IDs: review_admin, review_student, review_canteen');
 console.log('Temporary fixture password (do not screenshot or publish): '+password);
 console.log('All fixture data disappears on restart. Other academic/job features are outside this review fixture.');
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port is busy. Stop the previous review process or choose C0_REVIEW_PORT.':error.message);process.exitCode=1;});
process.on('SIGINT',()=>{server.closeAllConnections();server.close();});

import express from 'express';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { jobId, type Job } from './jobs.js';
export type SavedJob = Job & { savedAt: string };
export type FavouriteStore = { list(userId: number): Promise<SavedJob[]>; save(userId: number, job: Job): Promise<boolean>; remove(userId: number, id: string): Promise<void> };
export const favouritesSchema = `CREATE TABLE IF NOT EXISTS job_favourites (
 user_id INT UNSIGNED NOT NULL, job_id CHAR(64) NOT NULL, details JSON NOT NULL,
 saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(user_id,job_id),
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)`;
export function mysqlFavourites(pool: Pool): FavouriteStore {
 return {
  async list(userId) { const [rows] = await pool.execute<RowDataPacket[]>('SELECT details,saved_at FROM job_favourites WHERE user_id=? ORDER BY saved_at DESC',[userId]); return rows.map(row => ({ ...(typeof row.details === 'string' ? JSON.parse(row.details) : row.details), savedAt:row.saved_at })); },
  async save(userId,job) {
   const c=await pool.getConnection();
   try { await c.beginTransaction(); await c.execute('SELECT id FROM users WHERE id=? FOR UPDATE',[userId]);
    const [rows]=await c.execute<RowDataPacket[]>('SELECT job_id FROM job_favourites WHERE user_id=?',[userId]);
    if(rows.length>=200 && !rows.some(row=>row.job_id===job.id)){await c.rollback();return false;}
    await c.execute('INSERT INTO job_favourites(user_id,job_id,details) VALUES(?,?,?) ON DUPLICATE KEY UPDATE details=VALUES(details)',[userId,job.id,JSON.stringify(job)]);await c.commit();return true;
   } catch(error){await c.rollback();throw error;}finally{c.release();}
  },
  async remove(userId,id){await pool.execute('DELETE FROM job_favourites WHERE user_id=? AND job_id=?',[userId,id]);}
 };
}
export function favouritesRouter(store: FavouriteStore) {
 const router=express.Router();
 router.use('/student/job-favourites',(_req,res,next)=>{if(res.locals.user.role!=='student'){res.status(403).json({message:'Student accounts only.'});return;}next();});
 router.get('/student/job-favourites',async(_req,res)=>{res.json({jobs:await store.list(res.locals.user.id)});});
 router.post('/student/job-favourites',async(req,res)=>{
  const input=req.body?.job; const fields=['company','title','location','salary','career','education','employment','posted','closes','description','address','hours','application','documents','phone'] as const;
  if(!input || fields.some(field=>typeof input[field]!=='string'||input[field].length>12000) || !input.title.trim()){res.status(400).json({message:'Choose a valid job to save.'});return;}
  const job=Object.fromEntries(fields.map(field=>[field,input[field]])) as Omit<Job,'id'>;
  const normalized={...job,id:jobId(job)};
  if(!(await store.save(res.locals.user.id,normalized))){res.status(409).json({message:'You can save up to 200 favourites. Remove one before saving another.'});return;}
  res.json({job:normalized,message:'Job saved.'});
 });
 router.delete('/student/job-favourites/:id',async(req,res)=>{const id=String(req.params.id);if(!/^[a-f0-9]{64}$/.test(id)){res.status(400).json({message:'Choose a valid favourite.'});return;}await store.remove(res.locals.user.id,id);res.json({message:'Favourite removed.'});});
 return router;
}

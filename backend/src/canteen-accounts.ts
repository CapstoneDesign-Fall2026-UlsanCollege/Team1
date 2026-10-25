import { Router } from 'express';
import bcrypt from 'bcryptjs';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export type CanteenAccount = { id: number; login_id: string; is_active: boolean };
export type CanteenAccountStore = {
  list(): Promise<CanteenAccount[]>;
  create(login: string, passwordHash: string): Promise<number>;
  setActive(id: number, active: boolean): Promise<boolean>;
};

// Append the role without changing existing enum positions, defaults or accounts.
// Refuse an unexpected schema rather than silently removing other deployed roles.
export async function ensureCanteenRole(pool: Pool) {
  const [rows] = await pool.query<RowDataPacket[]>("SHOW COLUMNS FROM users LIKE 'role'");
  const type = rows[0]?.Type;
  if (type === "enum('admin','student','canteen_head')") return;
  if (type !== "enum('admin','student')") throw new Error('Unexpected users.role schema. Review migration 006 before starting.');
  await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin','student','canteen_head') NOT NULL DEFAULT 'student'");
}

export function mysqlCanteenAccounts(pool: Pool): CanteenAccountStore {
  return {
    async list() {
      const [rows] = await pool.execute<RowDataPacket[]>("SELECT id,login_id,is_active FROM users WHERE role='canteen_head' ORDER BY login_id,id");
      return rows.map(row => ({ id: row.id, login_id: row.login_id, is_active: Boolean(row.is_active) }));
    },
    async create(login, passwordHash) {
      const [result] = await pool.execute<ResultSetHeader>("INSERT INTO users (login_id,password_hash,role,is_active) VALUES (?,?,'canteen_head',1)", [login,passwordHash]);
      return result.insertId;
    },
    async setActive(id, active) {
      const [result] = await pool.execute<ResultSetHeader>("UPDATE users SET is_active=? WHERE id=? AND role='canteen_head'", [active ? 1 : 0,id]);
      return result.affectedRows > 0;
    },
  };
}

export function canteenAccountsRouter(store: CanteenAccountStore, invalidate: (id: number) => void) {
  const router = Router();
  router.use('/admin/canteen-accounts', (_req,res,next) => {
    if(res.locals.user.role !== 'admin') { res.status(403).json({message:'Administrators only.'}); return; }
    next();
  });
  router.get('/admin/canteen-accounts', async (_req,res) => { res.json({accounts:await store.list()}); });
  router.post('/admin/canteen-accounts', async (req,res) => {
    const input = req.body;
    if(!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !['login_id','password'].includes(key)) ||
      typeof input.login_id !== 'string' || !/^[A-Za-z0-9_-]{1,50}$/.test(input.login_id.trim()) ||
      typeof input.password !== 'string' || input.password.length < 12 || Buffer.byteLength(input.password) > 72) {
      res.status(400).json({message:'Use a login ID of 1–50 letters, numbers, underscores or hyphens, and a password of at least 12 characters, at most 72 UTF-8 bytes.'}); return;
    }
    try {
      const login = input.login_id.trim();
      const id = await store.create(login, await bcrypt.hash(input.password,12));
      res.status(201).json({account:{id,login_id:login,is_active:true},message:'Canteen-head account created. Share the login details privately.'});
    } catch(error) {
      if((error as {code?:string}).code === 'ER_DUP_ENTRY') {res.status(409).json({message:'This login ID is already in use.'}); return;}
      throw error;
    }
  });
  router.put('/admin/canteen-accounts/:id/status', async (req,res) => {
    const id = Number(req.params.id), input = req.body;
    if(!Number.isSafeInteger(id) || id < 1 || !input || typeof input.is_active !== 'boolean' || Object.keys(input).some(key=>key!=='is_active')) {
      res.status(400).json({message:'Choose a canteen-head account and a valid active status.'}); return;
    }
    if(!await store.setActive(id,input.is_active)) {res.status(404).json({message:'Canteen-head account not found. Refresh the list.'}); return;}
    if(!input.is_active) invalidate(id);
    res.json({message:input.is_active ? 'Account enabled. Sign in again to use it.' : 'Account disabled. Existing sessions were signed out.'});
  });
  return router;
}

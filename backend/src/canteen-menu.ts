import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { ScheduleError } from './schedules.js';

export const canteenMenuSchema = `CREATE TABLE IF NOT EXISTS canteen_menus (
  service_date DATE PRIMARY KEY,
  published TINYINT NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'KRW',
  items JSON NOT NULL,
  version INT UNSIGNED NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
)`;
export function campusDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}
export function isMenuDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= '2000-01-01' && value <= '2200-12-31' &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export type MenuItem = { id: string; name: string; price: number; status: 'unknown' | 'available' | 'sold_out' };
export function menuItems(input: unknown, previous: MenuItem[] = []): MenuItem[] {
  if (!Array.isArray(input) || !input.length || input.length > 40) {
    throw new ScheduleError(400, 'Enter 1–40 menu items.');
  }
  const seen = new Set<string>();
  return input.map(item => {
    if (!item || typeof item !== 'object' || typeof item.name !== 'string' ||
        !item.name.trim() || item.name.trim().length > 150 ||
        !Number.isSafeInteger(item.price) || item.price < 0 || item.price > 1_000_000) {
      throw new ScheduleError(400, 'Enter an item name and a whole-number price from 0 to 1,000,000.');
    }
    if (item.id !== undefined && (typeof item.id !== 'string' ||
        !previous.some(old => old.id === item.id) || seen.has(item.id))) {
      throw new ScheduleError(400, 'Menu item identity changed. Reload before saving.');
    }
    const id = item.id ?? randomUUID();
    seen.add(id);
    if(item.status!==undefined && !['unknown','available','sold_out'].includes(item.status))throw new ScheduleError(400,'Choose unknown, available or sold out for each item.');
    const status:MenuItem['status'] = item.status ?? previous.find(old => old.id === id)?.status ?? 'unknown';
    return { id, name: item.name.trim(), price: item.price, status };
  });
}
function unpack(row?: RowDataPacket) {
  return row ? { service_date: row.service_date as string, version: Number(row.version),
    updated_at: row.updated_at as Date | string, published: Boolean(row.published), currency: row.currency as 'NPR'|'KRW',
    items: typeof row.items === 'string' ? JSON.parse(row.items) as MenuItem[] : row.items as MenuItem[] } : null;
}
const columns = "DATE_FORMAT(service_date, '%Y-%m-%d') AS service_date, published, currency, items, version, updated_at";

export async function ensureCanteenMenuSchema(pool:Pool){
 await pool.query(canteenMenuSchema);
 const [columns]=await pool.execute<RowDataPacket[]>("SHOW COLUMNS FROM canteen_menus LIKE 'currency'");
 // Existing prices were entered as won: preserve their denomination.
 if(!columns.length)await pool.query("ALTER TABLE canteen_menus ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'KRW'");
}

export function canteenMenuRouter(pool: Pool, today: () => string = campusDate) {
  const router = Router();
  router.use('/canteen/menu', (_req, res, next) => {
    if (res.locals.user.role !== 'canteen_head') { res.status(403).json({ message: 'Canteen head only.' }); return; }
    next();
  });
  router.get('/student/canteen', async (_req, res) => {
    if (res.locals.user.role !== 'student') throw new ScheduleError(403, 'Students only.');
    const date = today();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${columns} FROM canteen_menus WHERE service_date=? AND published=1`, [date]);
    res.json({ today: date, menu: unpack(rows[0]) });
  });
  router.get('/canteen/menu/items',async(_req,res)=>{
    const [rows]=await pool.execute<RowDataPacket[]>(`SELECT items FROM canteen_menus WHERE currency='NPR' ORDER BY updated_at DESC,service_date DESC LIMIT 90`);
    const seen=new Set<string>(),items:{name:string;price:number}[]=[];
    for(const row of rows){const saved=typeof row.items==='string'?JSON.parse(row.items):row.items;for(const item of saved){
      const key=String(item.name).trim().toLocaleLowerCase();
      if(!seen.has(key)&&items.length<200){seen.add(key);items.push({name:item.name,price:item.price});}
    }}
    res.json({items:items.sort((a,b)=>a.name.localeCompare(b.name)),currency:'NPR'});
  });
  router.get('/canteen/menu', async (req, res) => {
    const date = req.query.date ?? today();
    if (!isMenuDate(date)) throw new ScheduleError(400, 'Choose a valid menu date.');
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${columns} FROM canteen_menus WHERE service_date=?`, [date]);
    res.json({ date, menu: unpack(rows[0]) });
  });
  router.post('/canteen/menu/apply-days',async(req,res)=>{
    const input=req.body;
    if(!input||input.currency!=='NPR'||!Array.isArray(input.dates)||!input.dates.length||input.dates.length>7||input.dates.some((d:unknown)=>!isMenuDate(d))||new Set(input.dates).size!==input.dates.length)throw new ScheduleError(400,'Choose 1-7 distinct valid dates for a rupee menu.');
    // Always make independent drafts: never reuse item IDs or stock status.
    const template=menuItems(input.items);
    const dates=[...input.dates].sort() as string[],c=await pool.getConnection();
    const created:string[]=[],skipped:string[]=[];
    try{await c.beginTransaction();
      for(const date of dates){const copies=menuItems(template.map(i=>({name:i.name,price:i.price,status:'unknown'})));
        try{await c.execute("INSERT INTO canteen_menus(service_date,published,currency,items,version) VALUES(?,0,'NPR',?,1)",[date,JSON.stringify(copies)]);created.push(date)}
        catch(e){if((e as {code?:string}).code==='ER_DUP_ENTRY'){skipped.push(date);continue}throw e}
      }
      await c.commit();res.status(created.length?201:200).json({message:`Created ${created.length} draft menu(s). Skipped ${skipped.length} existing date(s).`,created,skipped});
    }catch(e){await c.rollback();const code=(e as {code?:string}).code;
      if(code==='ER_LOCK_DEADLOCK'||code==='ER_LOCK_WAIT_TIMEOUT')throw new ScheduleError(409,'Menus changed while copying. No copies were saved; review the dates and retry.');
      throw e;
    }finally{c.release()}
  });
  router.put('/canteen/menu/:date', async (req, res) => {
    const date = req.params.date;
    const input = req.body;
    if (!isMenuDate(date) || !input || typeof input.published !== 'boolean' ||
        !Number.isSafeInteger(input.version) || input.version < 0) {
      throw new ScheduleError(400, 'Choose a valid date, publication status and saved version.');
    }
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // Reserve a new date before locking: simultaneous first writes cannot
      // overwrite each other. Invalid requests roll this reservation back.
      await connection.execute("INSERT IGNORE INTO canteen_menus(service_date,published,currency,items,version) VALUES(?,0,'NPR',?,0)", [date, '[]']);
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT ${columns} FROM canteen_menus WHERE service_date=? FOR UPDATE`, [date]);
      const previous = unpack(rows[0])!;
      if (previous.version !== input.version) throw new ScheduleError(409, 'This menu changed elsewhere. Reload saved data before saving.');
      if(input.currency!==undefined && input.currency!==previous.currency)throw new ScheduleError(400,'Keep this saved menu currency. Create a new date for a different currency.');
      const items = menuItems(input.items, previous.items);
      await connection.execute('UPDATE canteen_menus SET published=?,items=?,version=version+1 WHERE service_date=?',
        [input.published ? 1 : 0, JSON.stringify(items), date]);
      await connection.commit();
      res.json({ message: input.published ? 'Menu published.' : 'Draft saved.', version: input.version + 1 });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally { connection.release(); }
  });
  return router;
}

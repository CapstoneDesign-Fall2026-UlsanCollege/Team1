import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { ScheduleError } from './schedules.js';

export const canteenMenuSchema = `CREATE TABLE IF NOT EXISTS canteen_menus (
  service_date DATE PRIMARY KEY,
  published TINYINT NOT NULL DEFAULT 0,
  items JSON NOT NULL,
  version INT UNSIGNED NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
)`;
export function campusDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}
export function isMenuDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= '2000-01-01' && value <= '2200-12-31' &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
type MenuItem = { id: string; name: string; price: number; status: 'unknown' | 'available' | 'sold_out' };
export function menuItems(input: unknown, previous: MenuItem[] = []): MenuItem[] {
  if (!Array.isArray(input) || !input.length || input.length > 40) {
    throw new ScheduleError(400, 'Enter 1–40 menu items.');
  }
  const seen = new Set<string>();
  return input.map(item => {
    if (!item || typeof item !== 'object' || typeof item.name !== 'string' ||
        !item.name.trim() || item.name.trim().length > 150 ||
        !Number.isSafeInteger(item.price) || item.price < 0 || item.price > 1_000_000) {
      throw new ScheduleError(400, 'Enter an item name and a whole-won price from 0 to 1,000,000.');
    }
    if (item.id !== undefined && (typeof item.id !== 'string' ||
        !previous.some(old => old.id === item.id) || seen.has(item.id))) {
      throw new ScheduleError(400, 'Menu item identity changed. Reload before saving.');
    }
    const id = item.id ?? randomUUID();
    seen.add(id);
    // C1 does not offer availability editing. Preserve C3 information if it
    // already exists, and make no availability claim for a new item.
    const status = previous.find(old => old.id === id)?.status ?? 'unknown';
    return { id, name: item.name.trim(), price: item.price, status };
  });
}
function unpack(row?: RowDataPacket) {
  return row ? { service_date: row.service_date as string, version: Number(row.version),
    updated_at: row.updated_at as Date | string, published: Boolean(row.published),
    items: typeof row.items === 'string' ? JSON.parse(row.items) as MenuItem[] : row.items as MenuItem[] } : null;
}
const columns = "DATE_FORMAT(service_date, '%Y-%m-%d') AS service_date, published, items, version, updated_at";

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
  router.get('/canteen/menu', async (req, res) => {
    const date = req.query.date ?? today();
    if (!isMenuDate(date)) throw new ScheduleError(400, 'Choose a valid menu date.');
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${columns} FROM canteen_menus WHERE service_date=?`, [date]);
    res.json({ date, menu: unpack(rows[0]) });
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
      await connection.execute('INSERT IGNORE INTO canteen_menus(service_date,published,items,version) VALUES(?,0,?,0)', [date, '[]']);
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT ${columns} FROM canteen_menus WHERE service_date=? FOR UPDATE`, [date]);
      const previous = unpack(rows[0])!;
      if (previous.version !== input.version) throw new ScheduleError(409, 'This menu changed elsewhere. Reload saved data before saving.');
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

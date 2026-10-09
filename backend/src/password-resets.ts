import express from 'express';
import bcrypt from 'bcryptjs';
import type { Pool, RowDataPacket } from 'mysql2/promise';

export type ResetRequest = { id: number; user_id: number; login_id: string; full_name: string; email: string; requested_at: string };
export type ResetStore = {
  request(login: string, email: string): Promise<void>;
  pending(): Promise<ResetRequest[]>;
  resolve(id: number, adminId: number, hash: string | null): Promise<number | undefined>;
};
export const resetSchema = `CREATE TABLE IF NOT EXISTS password_reset_requests (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL UNIQUE,
 status ENUM('pending','completed','rejected') NOT NULL DEFAULT 'pending',
 requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 reviewed_at TIMESTAMP NULL, reviewed_by INT UNSIGNED NULL,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`;
export function mysqlResets(pool: Pool): ResetStore {
  return {
    async request(login, email) {
      await pool.execute(`INSERT INTO password_reset_requests (user_id)
        SELECT u.id FROM users u JOIN student_profiles p ON p.user_id=u.id
        WHERE u.login_id=? AND LOWER(TRIM(p.email))=? AND u.role='student' AND u.is_active=1
        ON DUPLICATE KEY UPDATE requested_at=IF(status='pending',requested_at,CURRENT_TIMESTAMP),
        reviewed_at=IF(status='pending',reviewed_at,NULL), reviewed_by=IF(status='pending',reviewed_by,NULL), status='pending'`, [login, email]);
    },
    async pending() {
      const [rows] = await pool.query<RowDataPacket[]>(`SELECT r.id,r.user_id,u.login_id,p.full_name,p.email,r.requested_at
        FROM password_reset_requests r JOIN users u ON u.id=r.user_id JOIN student_profiles p ON p.user_id=u.id
        WHERE r.status='pending' AND u.role='student' AND u.is_active=1 ORDER BY r.requested_at`);
      return rows as ResetRequest[];
    },
    async resolve(id, adminId, hash) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        const [rows] = await connection.execute<RowDataPacket[]>(`SELECT r.user_id FROM password_reset_requests r
          JOIN users u ON u.id=r.user_id WHERE r.id=? AND r.status='pending' AND u.role='student' AND u.is_active=1 FOR UPDATE`, [id]);
        if (!rows.length) { await connection.rollback(); return undefined; }
        const userId = Number(rows[0]!.user_id);
        if (hash) await connection.execute('UPDATE users SET password_hash=? WHERE id=?', [hash, userId]);
        await connection.execute('UPDATE password_reset_requests SET status=?,reviewed_at=CURRENT_TIMESTAMP,reviewed_by=? WHERE id=?', [hash ? 'completed' : 'rejected', adminId, id]);
        await connection.commit(); return userId;
      } catch (error) { await connection.rollback(); throw error; }
      finally { connection.release(); }
    },
  };
}
export function resetRouter(store: ResetStore, invalidate: (id: number) => void, publicRoutes = false) {
  const router = express.Router();
  if (publicRoutes) {
    const attempts = new Map<string, { count: number; expires: number }>();
    router.post('/auth/password-reset-requests', async (req, res) => {
      const now = Date.now();
      for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
      const key = req.ip ?? 'local'; const attempt = attempts.get(key) ?? { count: 0, expires: now + 15 * 60_000 };
      if (attempt.count >= 5) { res.status(429).json({ message: 'Too many requests. Try again in 15 minutes.' }); return; }
      attempt.count++; attempts.set(key, attempt);
      const { login_id, email } = req.body ?? {};
      if (typeof login_id !== 'string' || !/^[A-Za-z0-9_-]{1,50}$/.test(login_id.trim()) || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        res.status(400).json({ message: 'Enter your student ID and a valid registered email.' }); return;
      }
      await store.request(login_id.trim(), email.trim().toLowerCase());
      res.json({ message: 'If these details match an active student account, your request is queued for administrator review. The administrator will verify your identity and contact you privately. If you cannot access your registered email, contact your administrator.' });
    });
    return router;
  }
  router.use('/admin/password-reset-requests', (_req, res, next) => {
    if (res.locals.user.role !== 'admin') { res.status(403).json({ message: 'Administrators only.' }); return; } next();
  });
  router.get('/admin/password-reset-requests', async (_req, res) => { res.json({ requests: await store.pending() }); });
  router.post('/admin/password-reset-requests/:id/resolve', async (req, res) => {
    const id = Number(req.params.id); const { action, password, identity_verified } = req.body ?? {};
    if (!Number.isSafeInteger(id) || id < 1 || !['reset','reject'].includes(action)) { res.status(400).json({ message: 'Choose a valid request and action.' }); return; }
    if (action === 'reset' && (identity_verified !== true || typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password) > 72)) {
      res.status(400).json({ message: 'Verify the student’s identity and enter a password of at least 12 characters, at most 72 UTF-8 bytes.' }); return;
    }
    const hash = action === 'reset' ? await bcrypt.hash(password, 12) : null;
    const userId = await store.resolve(id, res.locals.user.id, hash);
    if (userId === undefined) { res.status(409).json({ message: 'This request is no longer pending. Refresh the list.' }); return; }
    if (hash) invalidate(userId);
    res.json({ message: hash ? 'Password reset. Existing sessions were signed out. Share the new password privately with the verified student.' : 'Request rejected.' });
  });
  return router;
}

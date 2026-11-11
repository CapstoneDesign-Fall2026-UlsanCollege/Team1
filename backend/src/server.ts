import {ensureTeacherSchema} from './teacher-workspace.js';
import {ensureActivitySchema} from './activity-log.js';
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { databaseTls } from './database-tls.js';
import { createDatabaseApp } from './database-app.js';
import { ensureCanteenRole } from './canteen-accounts.js';
import { ensureSchoolSchema } from './school-schema.js';
import {canteenInfoSchema} from './canteen-info.js';
import { ensureCanteenMenuSchema } from './canteen-menu.js';
import { resetSchema } from './password-resets.js';
import { favouritesSchema } from './job-favourites.js';

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3307),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'studenthub',
  connectionLimit: 5,
  ssl: databaseTls(),
});
const app = createDatabaseApp(pool);
const port = Number(process.env.PORT ?? 3000);
async function start() {
  await ensureCanteenRole(pool);
  await ensureSchoolSchema(pool);
  await ensureTeacherSchema(pool);
  await ensureCanteenMenuSchema(pool);
  await pool.query(canteenInfoSchema);
  await pool.query(resetSchema);
  await pool.query(favouritesSchema);
  await ensureActivitySchema(pool);
  const server = app.listen(port, '0.0.0.0');
  server.on('listening', () => console.log('StudentHub API: http://127.0.0.1:' + port));
  server.on('error', (error: NodeJS.ErrnoException) => {
    console.error(error.code === 'EADDRINUSE'
      ? `Port ${port} is already in use. Stop the existing backend before starting this version.`
      : `Backend failed to start: ${error.message}`);
    process.exitCode = 1;
    void pool.end();
  });
}
void start().catch(error => { console.error('Database initialization failed:', error.message); process.exitCode = 1; void pool.end(); });

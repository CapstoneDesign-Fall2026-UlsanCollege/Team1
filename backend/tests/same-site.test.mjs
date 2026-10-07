import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createApp } from '../dist/app.js';

test('combined deployment supports HTTPS origin and strict secure login cookies', async () => {
  const previous = { NODE_ENV: process.env.NODE_ENV, SERVE_FRONTEND: process.env.SERVE_FRONTEND, FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN };
  process.env.NODE_ENV = 'production';
  process.env.SERVE_FRONTEND = 'true';
  process.env.FRONTEND_ORIGIN = 'https://old-frontend.example';
  const account = { id: 1, login_id: 'admin', password_hash: await bcrypt.hash('test-password', 4), role: 'admin', is_active: 1 };
  const app = createApp({ byLogin: async () => account, byId: async () => account });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const headers = { Origin: url.replace('http:', 'https:'), 'X-Forwarded-Proto': 'https', 'Content-Type': 'application/json', 'X-StudentHub': '1' };
  try {
    const response = await fetch(url + '/api/auth/login', { method: 'POST', headers, body: JSON.stringify({ login_id: 'admin', password: 'test-password' }) });
    assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie');
    assert.match(cookie, /SameSite=Strict/);
    assert.match(cookie, /; Secure/);
    assert.match(cookie, /HttpOnly/);
    assert.equal((await fetch(url + '/api/admin/home', { headers: { ...headers, Cookie: cookie.split(';')[0] } })).status, 200);
    assert.equal((await fetch(url + '/api/auth/me', { headers: { ...headers, Origin: 'https://unapproved.example' } })).status, 403);
  } finally {
    await new Promise(resolve => server.close(resolve));
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

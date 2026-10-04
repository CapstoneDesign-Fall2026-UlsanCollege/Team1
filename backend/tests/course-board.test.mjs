import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createApp } from '../dist/app.js';

test('saved assignments reload; removal targets one offering and is admin-only', async () => {
  const password_hash = await bcrypt.hash('test-password', 4);
  const users = ['admin', 'student'].map((role, index) => ({ id: index + 1, login_id: role, role, password_hash, is_active: 1 }));
  let rows = [{ offering_id: 10, semester_id: 3, id: 4 }, { offering_id: 11, semester_id: 5, id: 4 }];
  const app = createApp({
    byLogin: async login => users.find(u => u.login_id === login),
    byId: async id => users.find(u => u.id === id),
    courseAssignments: async () => rows,
    updateProfessor: async (id, professor) => { const row = rows.find(o => o.offering_id === id); if (!row) return false; row.professor = professor; return true; },
    removeOffering: async id => { const exists = rows.some(o => o.offering_id === id); rows = rows.filter(o => o.offering_id !== id); return exists; },
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(base + '/api/admin/course-assignments')).status, 401);
    for (const role of ['student', 'admin']) {
      const response = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1' }, body: JSON.stringify({ login_id: role, password: 'test-password' }) });
      const headers = { Cookie: response.headers.get('set-cookie').split(';')[0], 'X-StudentHub': '1' };
      const list = () => fetch(base + '/api/admin/course-assignments', { headers });
      const remove = id => fetch(base + '/api/admin/course-assignments/' + id, { headers, method: 'DELETE' });
      const update = (id, professor) => fetch(base + '/api/admin/course-assignments/' + id + '/professor', { headers: { ...headers, 'Content-Type': 'application/json' }, method: 'PUT', body: JSON.stringify({ professor }) });
      if (role === 'student') {
        assert.equal((await list()).status, 403);
        assert.equal((await remove(10)).status, 403);
        assert.equal((await update(10, 'Professor Lee')).status, 403);
      } else {
        assert.equal((await (await list()).json()).offerings.length, 2);
        for (const name of ['', '   ', null, 42, 'x'.repeat(151)]) assert.equal((await update(10, name)).status, 400);
        assert.equal((await update('bad', 'Professor Lee')).status, 400);
        assert.equal((await update(999, 'Professor Lee')).status, 404);
        assert.equal((await update(10, '  Professor Lee  ')).status, 200);
        assert.equal((await update(10, 'Professor Lee')).status, 200);
        const saved = (await (await list()).json()).offerings;
        assert.equal(saved[0].professor, 'Professor Lee');
        assert.equal(saved[1].professor, undefined);
        assert.equal((await remove('bad')).status, 400);
        assert.equal((await remove(10)).status, 200);
        assert.deepEqual((await (await list()).json()).offerings.map(o => o.offering_id), [11]);
        assert.equal((await remove(10)).status, 404);
      }
    }
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

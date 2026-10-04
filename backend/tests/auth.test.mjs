import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createApp,              } from '../dist/app.js';

test('login, role boundaries, session restore, disabled accounts and logout', async () => {
  const hash = await bcrypt.hash('test-password', 4);
  const users            = [
    { id: 1, login_id: 'admin', password_hash: hash, role: 'admin', is_active: 1 },
    { id: 2, login_id: 'student', password_hash: hash, role: 'student', is_active: 1 },
  ];
  const app = createApp({ byLogin: async login => users.find(u => u.login_id === login), byId: async id => users.find(u => u.id === id) });
  const server = app.listen(0, '127.0.0.1');
  await new Promise      (resolve => server.once('listening', resolve));
  const address = server.address()                    ;
  const url = 'http://127.0.0.1:' + address.port;
  const post = (path        , body        , cookie = '') => fetch(url + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1', Cookie: cookie }, body: JSON.stringify(body) });
  try {
    assert.equal((await fetch(url + '/api/admin/home')).status, 401);
    assert.equal((await post('/api/auth/login', { login_id: 'admin', password: 'wrong' })).status, 401);
    assert.equal((await post('/api/auth/login', { login_id: {}, password: 'test' })).status, 400);
    assert.equal((await fetch(url + '/api/auth/logout', { method: 'POST' })).status, 403);
    for (const role of ['admin', 'student']) {
      const response = await post('/api/auth/login', { login_id: role, password: 'test-password' });
      assert.equal(response.status, 200);
      const data = await response.json()                                     ;
      assert.equal(data.user.role, role);
      assert.equal(data.user.password_hash, undefined);
      const cookieHeader = response.headers.get('set-cookie') ;
      assert.match(cookieHeader, /HttpOnly/);
      const cookie = cookieHeader.split(';')[0];
      const get = (path        ) => fetch(url + path, { headers: { Cookie: cookie } });
      assert.equal((await get('/api/auth/me')).status, 200);
      assert.equal((await get('/api/' + role + '/home')).status, 200);
      assert.equal((await get('/api/' + (role === 'admin' ? 'student' : 'admin') + '/home')).status, 403);
      assert.equal((await post('/api/auth/logout', {}, cookie)).status, 200);
      assert.equal((await get('/api/auth/me')).status, 401);
    }
    users[1] .is_active = 0;
    assert.equal((await post('/api/auth/login', { login_id: 'student', password: 'test-password' })).status, 401);
    for (let i = 0; i < 9; i++) await post('/api/auth/login', { login_id: 'missing', password: 'wrong' });
    assert.equal((await post('/api/auth/login', { login_id: 'missing', password: 'wrong' })).status, 429);
  } finally { server.closeAllConnections(); await new Promise      (resolve => server.close(() => resolve())); }
});

test('student creation requires admin, validates input and handles duplicate IDs', async () => {
  const hash = await bcrypt.hash('test-password', 4);
  const users = [
    { id: 1, login_id: 'admin', password_hash: hash, role: 'admin', is_active: 1 },
    { id: 2, login_id: 'student', password_hash: hash, role: 'student', is_active: 1 },
  ];
  const created = [];
  const app = createApp({ byLogin: async login => users.find(u => u.login_id === login), byId: async id => users.find(u => u.id === id) }, async student => {
    if (created.some(s => s.login_id === student.login_id)) throw { code: 'ER_DUP_ENTRY' };
    created.push(student); return 3;
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const post = (path, body, cookie = '') => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1', Cookie: cookie }, body: JSON.stringify(body) });
  const payload = { login_id: '2026007', password: 'long-test-password', full_name: ' Mina Kim ', university: 'Ulsan College', major: 'Computer Science', year_of_study: 2 };
  try {
    assert.equal((await post('/api/admin/students', payload)).status, 401);
    const cookies = {};
    for (const role of ['admin', 'student']) {
      const response = await post('/api/auth/login', { login_id: role, password: 'test-password' });
      cookies[role] = response.headers.get('set-cookie').split(';')[0];
    }
    assert.equal((await post('/api/admin/students', payload, cookies.student)).status, 403);
    for (const changes of [{ password: 'short' }, { password: '한'.repeat(30) }, { full_name: ' ' }, { email: 'invalid' }, { year_of_study: 1.5 }, { year_of_study: 256 }, { login_id: {} }]) {
      assert.equal((await post('/api/admin/students', { ...payload, ...changes }, cookies.admin)).status, 400);
    }
    assert.equal(created.length, 0);
    const response = await post('/api/admin/students', { ...payload, role: 'admin' }, cookies.admin);
    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.student.id, 3);
    assert.equal(body.student.full_name, 'Mina Kim');
    assert.equal(body.student.password, undefined);
    assert.equal(created[0].role, undefined);
    assert.equal((await post('/api/admin/students', payload, cookies.admin)).status, 409);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test('student persistence hashes passwords and rolls back when profile creation fails', async () => {
  const { createStudent } = await import('../dist/students.js');
  const student = { login_id: '2026007', password: 'long-test-password', full_name: 'Mina', university: 'Ulsan', major: 'CS', year_of_study: 2 };
  for (const fail of [false, true]) {
    const calls = [];
    let savedHash;
    const connection = {
      beginTransaction: async () => calls.push('begin'),
      execute: async (sql, values) => {
        if (sql.includes('INSERT INTO users')) {
          calls.push('account'); savedHash = values[1];
          assert.match(sql, /'student'/);
          return [{ insertId: 42 }];
        }
        calls.push('profile'); assert.equal(values[0], 42);
        if (fail) throw new Error('profile insert failed');
        return [{}];
      },
      commit: async () => calls.push('commit'),
      rollback: async () => calls.push('rollback'),
      release: () => calls.push('release'),
    };
    const operation = createStudent({ getConnection: async () => connection }, student);
    if (fail) await assert.rejects(operation, /profile insert failed/);
    else assert.equal(await operation, 42);
    assert.notEqual(savedHash, student.password);
    assert.equal(await bcrypt.compare(student.password, savedHash), true);
    assert.deepEqual(calls, ['begin', 'account', 'profile', fail ? 'rollback' : 'commit', 'release']);
  }
});

test('profile reads only the signed-in student and rejects admin and anonymous access', async () => {
  const hash = await bcrypt.hash('test-password', 4);
  const users = [
    { id: 1, login_id: 'admin', password_hash: hash, role: 'admin', is_active: 1 },
    { id: 2, login_id: 'student', password_hash: hash, role: 'student', is_active: 1 },
  ];
  let requestedId;
  let missing = false;
  const app = createApp({ byLogin: async login => users.find(u => u.login_id === login), byId: async id => users.find(u => u.id === id) }, undefined, async id => {
    requestedId = id;
    return missing ? undefined : { full_name: 'Mina Kim', university: 'Ulsan College', major: 'CS', year_of_study: 2, email: null, phone_number: null, address: null };
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    assert.equal((await fetch(base + '/api/student/profile')).status, 401);
    for (const role of ['admin', 'student']) {
      const login = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-StudentHub': '1' }, body: JSON.stringify({ login_id: role, password: 'test-password' }) });
      const headers = { Cookie: login.headers.get('set-cookie').split(';')[0] };
      const response = await fetch(base + '/api/student/profile?user_id=999', { headers });
      assert.equal(response.status, role === 'student' ? 200 : 403);
      if (role === 'student') {
        assert.equal(requestedId, 2);
        assert.equal((await response.json()).profile.full_name, 'Mina Kim');
        missing = true;
        assert.equal((await fetch(base + '/api/student/profile', { headers })).status, 404);
      }
    }
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

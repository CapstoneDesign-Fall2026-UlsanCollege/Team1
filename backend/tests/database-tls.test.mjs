import {test} from 'node:test';
import assert from 'node:assert/strict';
import {databaseTls} from '../dist/database-tls.js';

test('local database connections remain unchanged unless TLS is enabled', () => {
  assert.equal(databaseTls({}), undefined);
  assert.equal(databaseTls({DB_SSL:'false'}), undefined);
});

test('TLS refuses missing certificates and invalid enable flags', () => {
  assert.throws(() => databaseTls({DB_SSL:'true'}), /DB_SSL_CA/);
  assert.throws(() => databaseTls({DB_SSL:'true', DB_SSL_CA:'not a certificate'}), /DB_SSL_CA/);
  assert.throws(() => databaseTls({DB_SSL:'yes'}), /true or false/);
});

test('TLS preserves verification and handles escaped PEM newlines', () => {
  const pem='-----BEGIN CERTIFICATE-----\nfixture\n-----END CERTIFICATE-----';
  assert.deepEqual(databaseTls({DB_SSL:'true', DB_SSL_CA:pem.replace(/\n/g,'\\n')}), {
    ca:pem, rejectUnauthorized:true, verifyIdentity:true, minVersion:'TLSv1.2'
  });
});

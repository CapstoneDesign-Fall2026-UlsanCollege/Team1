import type { PoolOptions } from 'mysql2/promise';

// Existing local databases keep their current connection mode. Cloud deployments
// opt in with DB_SSL=true and the provider's public CA certificate.
export function databaseTls(env: NodeJS.ProcessEnv = process.env): PoolOptions['ssl'] {
  const enabled = env.DB_SSL?.trim().toLowerCase();
  if (!enabled || enabled === 'false') return undefined;
  if (enabled !== 'true') throw new Error('DB_SSL must be true or false');
  const ca = env.DB_SSL_CA?.replace(/\\n/g, '\n').trim();
  if (!ca || !ca.includes('-----BEGIN CERTIFICATE-----') || !ca.includes('-----END CERTIFICATE-----')) {
    throw new Error('DB_SSL=true requires the PEM CA certificate in DB_SSL_CA');
  }
  return { ca, rejectUnauthorized: true, verifyIdentity: true, minVersion: 'TLSv1.2' };
}

// db.js — Neon / PostgreSQL helper used by server.js
// If you already have a db.js that exports query, withTransaction and initDb
// you can keep yours; this one simply runs schema.sql on start-up.
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const here = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error('✖ DATABASE_URL is missing. Paste your Neon connection string into .env');
  process.exit(1);
}

const local = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: local ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
});
pool.on('error', (err) => console.error('Postgres pool error:', err.message));

export const query = (text, params) => pool.query(text, params);

export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function initDb() {
  const sql = fs.readFileSync(path.join(here, 'schema.sql'), 'utf8');
  await pool.query(sql);
}
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const { DATABASE_URL, PGSSLMODE } = process.env;

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL. Set it in backend/.env before starting the API.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
});

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
}

module.exports = { pool, initDb };

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GitHubStrategy } = require('passport-github2');

const {
  PORT = 5000,
  DATABASE_URL,
  JWT_SECRET,
  CLIENT_URL = 'http://localhost:5173',
  SERVER_URL = 'http://localhost:5000',
  ADMIN_NAME = 'Administrator',
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} = process.env;

if (!DATABASE_URL || !JWT_SECRET) {
  console.error('Missing DATABASE_URL or JWT_SECRET in server/.env');
  process.exit(1);
}

/* ---------- Database (Neon) ---------- */
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
});

async function initDb() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, LOWER($2), $3, 'admin')
       ON CONFLICT (email) DO UPDATE SET role = 'admin', password_hash = EXCLUDED.password_hash`,
      [ADMIN_NAME, ADMIN_EMAIL, hash]
    );
    console.log(`Admin account ready: ${ADMIN_EMAIL}`);
  }
}

/* ---------- Helpers ---------- */
const isAdminEmail = (email) =>
  !!ADMIN_EMAIL && !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

const publicUser = (u) => ({
  id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, provider: u.provider,
});

const signToken = (u) => jwt.sign({ id: u.id, role: u.role }, JWT_SECRET, { expiresIn: '7d' });

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Please sign in first.' });
  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Your session expired. Please sign in again.' });
  }
};

const requireAdmin = (req, res, next) =>
  req.auth?.role === 'admin' ? next() : res.status(403).json({ error: 'Admins only.' });

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');

/* ---------- App ---------- */
const app = express();
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(passport.initialize());
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { error: 'Too many attempts. Try again in a few minutes.' } });

app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* ---------- Email + password auth ---------- */
app.post('/api/auth/register', authLimiter, wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !emailOk(email) || (password || '').length < 8)
    return res.status(400).json({ error: 'Enter your name, a valid email and a password of at least 8 characters.' });

  const exists = await pool.query('SELECT 1 FROM users WHERE email = LOWER($1)', [email]);
  if (exists.rowCount) return res.status(409).json({ error: 'An account with this email already exists. Try signing in.' });

  const hash = await bcrypt.hash(password, 12);
  const role = isAdminEmail(email) ? 'admin' : 'user';
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, LOWER($2), $3, $4) RETURNING *`,
    [name.trim(), email, hash, role]
  );
  res.status(201).json({ token: signToken(rows[0]), user: publicUser(rows[0]) });
}));

app.post('/api/auth/login', authLimiter, wrap(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = LOWER($1)', [email || '']);
  const user = rows[0];
  if (!user || !user.password_hash)
    return res.status(401).json({ error: user ? `This account uses ${user.provider}. Use that button to sign in.` : 'Wrong email or password.' });
  if (!(await bcrypt.compare(password || '', user.password_hash)))
    return res.status(401).json({ error: 'Wrong email or password.' });
  res.json({ token: signToken(user), user: publicUser(user) });
}));

app.get('/api/auth/me', requireAuth, wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.auth.id]);
  if (!rows[0]) return res.status(401).json({ error: 'Account not found.' });
  res.json({ user: publicUser(rows[0]) });
}));

/* ---------- Social login (Google, Facebook, GitHub) ---------- */
async function oauthUser(provider, profile) {
  const email = (profile.emails?.[0]?.value || `${provider}_${profile.id}@no-email.local`).toLowerCase();
  const avatar = profile.photos?.[0]?.value || null;
  const name = profile.displayName || profile.username || 'Friend';

  let { rows } = await pool.query('SELECT * FROM users WHERE provider = $1 AND provider_id = $2', [provider, String(profile.id)]);
  if (!rows[0]) {
    ({ rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]));
    if (rows[0]) {
      // Same email already registered: link it to this provider.
      await pool.query('UPDATE users SET provider = $1, provider_id = $2, avatar = COALESCE(avatar, $3) WHERE id = $4',
        [provider, String(profile.id), avatar, rows[0].id]);
    } else {
      ({ rows } = await pool.query(
        `INSERT INTO users (name, email, role, provider, provider_id, avatar) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [name, email, isAdminEmail(email) ? 'admin' : 'user', provider, String(profile.id), avatar]
      ));
    }
  }
  if (isAdminEmail(email) && rows[0].role !== 'admin') {
    ({ rows } = await pool.query(`UPDATE users SET role = 'admin' WHERE id = $1 RETURNING *`, [rows[0].id]));
  }
  return rows[0];
}

const verify = (provider) => (_a, _r, profile, done) =>
  oauthUser(provider, profile).then((u) => done(null, u)).catch(done);

const enabled = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  enabled.google = true;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/api/auth/google/callback`,
  }, verify('google')));
}
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  enabled.facebook = true;
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID, clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${SERVER_URL}/api/auth/facebook/callback`, profileFields: ['id', 'displayName', 'emails', 'photos'],
  }, verify('facebook')));
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  enabled.github = true;
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/api/auth/github/callback`, scope: ['user:email'],
  }, verify('github')));
}

const scopes = { google: ['profile', 'email'], facebook: ['email'], github: ['user:email'] };

app.get('/api/auth/:provider', (req, res, next) => {
  const { provider } = req.params;
  if (!scopes[provider]) return res.status(404).json({ error: 'Unknown provider.' });
  if (!enabled[provider]) return res.redirect(`${CLIENT_URL}/auth/callback?error=${provider}_not_configured`);
  passport.authenticate(provider, { scope: scopes[provider], session: false })(req, res, next);
});

app.get('/api/auth/:provider/callback', (req, res, next) => {
  const { provider } = req.params;
  if (!enabled[provider]) return res.redirect(`${CLIENT_URL}/auth/callback?error=${provider}_not_configured`);
  passport.authenticate(provider, { session: false, failureRedirect: `${CLIENT_URL}/auth/callback?error=login_failed` })(req, res, () => {
    res.redirect(`${CLIENT_URL}/auth/callback?token=${signToken(req.user)}`);
  });
});

/* ---------- Public: projects + contact ---------- */
app.get('/api/projects', wrap(async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  res.json(rows);
}));

app.post('/api/contact', rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }), wrap(async (req, res) => {
  const { name, email, organization, subject, message } = req.body;
  if (!name?.trim() || !emailOk(email) || !message?.trim())
    return res.status(400).json({ error: 'Please add your name, a valid email and a message.' });
  await pool.query(
    'INSERT INTO messages (name, email, organization, subject, message) VALUES ($1,$2,$3,$4,$5)',
    [name.trim(), email.trim(), organization?.trim() || null, subject || null, message.trim()]
  );
  res.status(201).json({ ok: true });
}));

/* ---------- Admin ---------- */
const admin = express.Router();
admin.use(requireAuth, requireAdmin);

admin.get('/stats', wrap(async (_req, res) => {
  const q = (sql) => pool.query(sql).then((r) => Number(r.rows[0].n));
  const [users, messages, unread, projects] = await Promise.all([
    q('SELECT COUNT(*) n FROM users'),
    q('SELECT COUNT(*) n FROM messages'),
    q('SELECT COUNT(*) n FROM messages WHERE NOT is_read'),
    q('SELECT COUNT(*) n FROM projects'),
  ]);
  res.json({ users, messages, unread, projects });
}));

admin.get('/messages', wrap(async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  res.json(rows);
}));
admin.patch('/messages/:id/read', wrap(async (req, res) => {
  await pool.query('UPDATE messages SET is_read = TRUE WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
}));
admin.delete('/messages/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
}));

admin.get('/users', wrap(async (_req, res) => {
  const { rows } = await pool.query('SELECT id, name, email, role, provider, avatar, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
}));
admin.patch('/users/:id/role', wrap(async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role.' });
  if (Number(req.params.id) === req.auth.id) return res.status(400).json({ error: 'You cannot change your own role.' });
  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, req.params.id]);
  res.json({ ok: true });
}));

admin.post('/projects', wrap(async (req, res) => {
  const { title, category, description, image_url } = req.body;
  if (!title?.trim() || !description?.trim()) return res.status(400).json({ error: 'Title and description are required.' });
  const { rows } = await pool.query(
    'INSERT INTO projects (title, category, description, image_url) VALUES ($1,$2,$3,$4) RETURNING *',
    [title.trim(), category?.trim() || 'General', description.trim(), image_url?.trim() || null]
  );
  res.status(201).json(rows[0]);
}));
admin.put('/projects/:id', wrap(async (req, res) => {
  const { title, category, description, image_url } = req.body;
  const { rows } = await pool.query(
    'UPDATE projects SET title=$1, category=$2, description=$3, image_url=$4 WHERE id=$5 RETURNING *',
    [title, category || 'General', description, image_url || null, req.params.id]
  );
  res.json(rows[0]);
}));
admin.delete('/projects/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
}));
app.use('/api/admin', admin);

/* ---------- Errors ---------- */
app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
});

initDb()
  .then(() => app.listen(PORT, () => console.log(`API running on ${SERVER_URL} (providers: ${Object.keys(enabled).join(', ') || 'none'})`)))
  .catch((e) => { console.error('Database connection failed:', e.message); process.exit(1); });
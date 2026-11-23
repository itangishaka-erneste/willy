// server.js — REL4D Ltd API (Express + Neon Postgres)
// Run:  npm i express cors helmet express-rate-limit bcryptjs jsonwebtoken pg dotenv
//       (optional, for real e-mail replies:  npm i nodemailer)
//       node server.js        (Node 18+ required: it uses the built-in fetch)
//
// .env needs:  DATABASE_URL, JWT_SECRET (16+ chars), ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_URL
// Optional e-mail (admin replies + "new message" alerts):
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE=true|false, MAIL_FROM, NOTIFY_EMAIL
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { query, withTransaction, initDb } from './db.js';

const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '');
const SERVER_URL = (process.env.SERVER_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const ALLOWED_ORIGINS = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim().replace(/\/$/, ''));

if (!JWT_SECRET || JWT_SECRET.length < 16) {
  console.error('✖ JWT_SECRET is missing or too short. Add a long random text to .env (JWT_SECRET=...).');
  process.exit(1);
}

const CONTENT_KINDS = ['project', 'service', 'expertise', 'experience', 'client', 'team', 'opening'];
const APP_STATUSES = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];

/* ------------------------------ helpers ------------------------------ */
const app = express();
app.set('trust proxy', 1);

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const clean = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 200;
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, provider: u.provider });
const signToken = (u) => jwt.sign({ id: u.id, role: u.role, name: u.name }, JWT_SECRET, { expiresIn: u.role === 'admin' ? '12h' : '7d' });
const fail = (res, status, error) => res.status(status).json({ error });
const asBool = (v) => (typeof v === 'boolean' ? v : null);

const limiter = (windowMin, max, message) =>
  rateLimit({ windowMs: windowMin * 60_000, max, standardHeaders: true, legacyHeaders: false, message: { error: message } });

/* ------------------------------ e-mail ------------------------------- */
// Works only when SMTP_* is set in .env AND `npm i nodemailer` was run.
// Without it, messages are still saved and the admin can reply from the dashboard.
let mailer;
async function getMailer() {
  if (mailer !== undefined) return mailer;
  if (!process.env.SMTP_HOST) { mailer = null; return mailer; }
  try {
    const { default: nodemailer } = await import('nodemailer');
    const port = Number(process.env.SMTP_PORT || 587);
    mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  } catch {
    console.warn('! SMTP_HOST is set but nodemailer is not installed (npm i nodemailer). E-mail is disabled.');
    mailer = null;
  }
  return mailer;
}
async function sendMail({ to, subject, text, replyTo }) {
  const m = await getMailer();
  if (!m || !to) return false;
  try {
    await m.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text, replyTo });
    return true;
  } catch (err) {
    console.error('E-mail failed:', err.message);
    return false;
  }
}

/* ----------------------------- middleware ---------------------------- */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (origin, cb) => (!origin || ALLOWED_ORIGINS.includes(origin) ? cb(null, true) : cb(new Error('Origin not allowed'))) }));
app.use(express.json({ limit: '6mb' })); // room for a CV or a resized project image

const auth = (required = true) => (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch { req.user = null; }
  }
  if (required && !req.user) return fail(res, 401, 'Please sign in to continue.');
  next();
};
const adminOnly = [auth(true), (req, res, next) => (req.user.role === 'admin' ? next() : fail(res, 403, 'Admin access only.'))];

/* ------------------------------- health ------------------------------ */
app.get('/api/health', wrap(async (_req, res) => {
  await query('SELECT 1');
  res.json({ ok: true, time: new Date().toISOString() });
}));

/* ------------------------- password sign-in -------------------------- */
const authLimiter = limiter(15, 25, 'Too many attempts. Please wait a few minutes and try again.');

app.post('/api/auth/register', authLimiter, wrap(async (req, res) => {
  const name = clean(req.body.name, 100);
  const email = clean(req.body.email, 200).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (name.length < 2) return fail(res, 400, 'Please enter your full name.');
  if (!isEmail(email)) return fail(res, 400, 'Please enter a valid email address.');
  if (password.length < 8 || password.length > 100) return fail(res, 400, 'Use a password of at least 8 characters.');

  const exists = await query('SELECT id FROM users WHERE LOWER(email) = $1', [email]);
  if (exists.rows[0]) return fail(res, 409, 'An account with this email already exists. Please sign in.');

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, last_login) VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [name, email, hash],
  );
  res.status(201).json({ token: signToken(rows[0]), user: publicUser(rows[0]) });
}));

async function passwordLogin(req, res, adminRequired) {
  const email = clean(req.body?.email, 200).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const { rows } = await query('SELECT * FROM users WHERE LOWER(email) = $1', [email]);
  const user = rows[0];
  // Same message for every failure so nobody can discover which emails exist.
  const bad = () => fail(res, 401, 'Incorrect email or password.');
  if (!user || !user.password_hash) return bad();
  if (!(await bcrypt.compare(password, user.password_hash))) return bad();
  if (adminRequired && user.role !== 'admin') return bad();
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
  res.json({ token: signToken(user), user: publicUser(user) });
}
app.post('/api/auth/login', authLimiter, wrap((req, res) => passwordLogin(req, res, false)));
app.post('/api/admin/login', authLimiter, wrap((req, res) => passwordLogin(req, res, true)));

app.get('/api/auth/me', auth(true), wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  if (!rows[0]) return fail(res, 401, 'Your session has expired. Please sign in again.');
  res.json({ user: publicUser(rows[0]) });
}));

/* --------------- social sign-in (Google, Facebook, LinkedIn, GitHub) --------------- */
const PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
    profile: async (token) => {
      const p = await getJson('https://openidconnect.googleapis.com/v1/userinfo', token);
      return { id: p.sub, name: p.name, email: p.email_verified ? p.email : null, emailVerified: Boolean(p.email_verified), avatar: p.picture };
    },
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
    scope: 'email,public_profile',
    profile: async (token) => {
      const p = await getJson('https://graph.facebook.com/me?fields=id,name,email,picture.type(large)', token);
      return { id: p.id, name: p.name, email: p.email || null, emailVerified: Boolean(p.email), avatar: p.picture?.data?.url };
    },
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scope: 'openid profile email',
    profile: async (token) => {
      const p = await getJson('https://api.linkedin.com/v2/userinfo', token);
      return { id: p.sub, name: p.name, email: p.email_verified ? p.email : null, emailVerified: Boolean(p.email_verified), avatar: p.picture };
    },
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'read:user user:email',
    profile: async (token) => {
      const p = await getJson('https://api.github.com/user', token);
      let email = null;
      try {
        const emails = await getJson('https://api.github.com/user/emails', token);
        email = (emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified))?.email || null;
      } catch { /* no email permission */ }
        return { id: String(p.id), name: p.name || p.login, email, emailVerified: Boolean(email), avatar: p.avatar_url };
    },
  },
};

async function getJson(url, token) {
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json', 'User-Agent': 'rel4d-site' } });
  if (!r.ok) throw new Error(`Profile request failed (${r.status})`);
  return r.json();
}
const providerKeys = (name) => ({
  id: process.env[`${name.toUpperCase()}_CLIENT_ID`],
  secret: process.env[`${name.toUpperCase()}_CLIENT_SECRET`],
});
const backToSite = (res, hash) => res.redirect(`${CLIENT_URL}/#${hash}`);
const redirectUri = (name) => `${SERVER_URL}/api/auth/${name}/callback`;

app.get('/api/auth/:provider', (req, res) => {
  const name = req.params.provider;
  const provider = PROVIDERS[name];
  if (!provider) return fail(res, 404, 'Unknown sign-in provider.');
  const { id } = providerKeys(name);
  const intent = req.query.intent === 'admin' ? 'admin' : 'user';
  if (!id) return backToSite(res, `auth_error=${encodeURIComponent(`${name[0].toUpperCase() + name.slice(1)} sign-in is not set up yet.`)}&auth_intent=${intent}`);
  const state = jwt.sign({ p: name, n: crypto.randomBytes(8).toString('hex'), intent }, JWT_SECRET, { expiresIn: '10m' });
  const params = new URLSearchParams({ client_id: id, redirect_uri: redirectUri(name), response_type: 'code', scope: provider.scope, state });
  res.redirect(`${provider.authUrl}?${params}`);
});

app.get('/api/auth/:provider/callback', wrap(async (req, res) => {
  const name = req.params.provider;
  const provider = PROVIDERS[name];
  let adminIntent = false;
  const oops = (msg) => backToSite(res, `auth_error=${encodeURIComponent(msg)}&auth_intent=${adminIntent ? 'admin' : 'user'}`);
  if (!provider) return fail(res, 404, 'Unknown sign-in provider.');
  try {
    const decoded = jwt.verify(String(req.query.state || ''), JWT_SECRET);
    if (decoded.p !== name || !['admin', 'user'].includes(decoded.intent)) throw new Error('state mismatch');
    adminIntent = decoded.intent === 'admin';
  } catch { return oops('Sign-in link expired. Please try again.'); }
  if (req.query.error || !req.query.code) return oops('Sign-in was cancelled.');

  try {
    const { id, secret } = providerKeys(name);
    const tokenRes = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: String(req.query.code), redirect_uri: redirectUri(name), client_id: id, client_secret: secret }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token');
    const p = await provider.profile(tokenData.access_token);
    if (!p.id) throw new Error('No profile id');

    const email = (p.email || `${name}_${p.id}@social.rel4d.local`).toLowerCase();
    const displayName = clean(p.name, 100) || 'REL4D visitor';

    let user = (await query('SELECT * FROM users WHERE provider = $1 AND provider_id = $2', [name, String(p.id)])).rows[0];
    if (adminIntent) {
      if (user && user.role !== 'admin') return oops('This social account is not linked to an administrator.');
      if (!user) {
        if (!p.emailVerified || !p.email) return oops('Use an administrator account with a verified email for this provider.');
        const adminAccount = (await query(
          `SELECT * FROM users WHERE LOWER(email) = $1 AND role = 'admin'`,
          [email],
        )).rows[0];
        if (!adminAccount) return oops('No administrator account matches this verified social email.');
        if (adminAccount.provider && adminAccount.provider !== 'local'
          && (adminAccount.provider !== name || (adminAccount.provider_id && adminAccount.provider_id !== String(p.id)))) {
          return oops('This administrator account is already linked to another sign-in provider.');
        }
        user = (await query(
          `UPDATE users SET provider = $2, provider_id = $3, avatar = COALESCE(avatar, $4)
           WHERE id = $1 AND role = 'admin'
             AND (provider = 'local' OR (provider = $2 AND (provider_id IS NULL OR provider_id = $3)))
           RETURNING *`,
          [adminAccount.id, name, String(p.id), p.avatar || null],
        )).rows[0];
        if (!user) return oops('This administrator account is already linked to another sign-in provider.');
      }
      await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
      return backToSite(res, `auth_admin_token=${encodeURIComponent(signToken(user))}`);
    }

    if (!user) {
      const sameEmail = (await query('SELECT * FROM users WHERE LOWER(email) = $1', [email])).rows[0];
      if (sameEmail) {
        if (sameEmail.role === 'admin') return oops('The admin account must sign in with its password.');
        user = (await query(
          `UPDATE users SET provider = COALESCE(NULLIF(provider, 'local'), $2), provider_id = COALESCE(provider_id, $3), avatar = COALESCE(avatar, $4) WHERE id = $1 RETURNING *`,
          [sameEmail.id, name, String(p.id), p.avatar || null],
        )).rows[0];
      } else {
        user = (await query(
          `INSERT INTO users (name, email, provider, provider_id, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [displayName, email, name, String(p.id), p.avatar || null],
        )).rows[0];
      }
    }
    if (user.role === 'admin') return oops('The admin account must sign in with its password.');
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    backToSite(res, `auth_token=${encodeURIComponent(signToken(user))}`);
  } catch (err) {
    console.error(`${name} sign-in failed:`, err.message);
    oops('Sign-in failed. Please try again or use email and password.');
  }
}));

/* ------------------------- public page content ------------------------ */
app.get('/api/content', wrap(async (_req, res) => {
  const { rows } = await query(`SELECT id, kind, data FROM content_items WHERE published ORDER BY kind, sort_order, id`);
  const out = {};
  for (const r of rows) (out[r.kind] ||= []).push({ id: r.id, data: r.data });
  res.json(out);
}));

// Flat lists used by the website sections (Home.jsx reads /api/projects).
const flatList = (kind) => wrap(async (_req, res) => {
  const { rows } = await query(
    `SELECT id, data FROM content_items WHERE kind = $1 AND published ORDER BY sort_order, id`, [kind]);
  res.json(rows.map((r) => ({ id: r.id, ...r.data })));
});
app.get('/api/projects', flatList('project'));
app.get('/api/openings', flatList('opening'));
app.get('/api/team', flatList('team'));

/* ------------------------ contact form messages ----------------------- */
// The website form posts to /api/contact (and /api/messages works too).
// It accepts either "service" or "subject" for the topic the visitor picked.
const messageLimiter = limiter(10, 6, 'Too many messages. Please wait a little and try again.');
const postMessage = wrap(async (req, res) => {
  const name = clean(req.body?.name, 100);
  const email = clean(req.body?.email, 200).toLowerCase();
  const message = clean(req.body?.message, 4000);
  const organization = clean(req.body?.organization, 150) || null;
  const service = clean(req.body?.service || req.body?.subject, 120) || null;
  if (name.length < 2) return fail(res, 400, 'Please enter your name.');
  if (!isEmail(email)) return fail(res, 400, 'Please enter a valid email address.');
  if (message.length < 5) return fail(res, 400, 'Please write a short message.');
  await query(
    `INSERT INTO messages (user_id, name, email, organization, service, message) VALUES ($1,$2,$3,$4,$5,$6)`,
    [req.user?.id || null, name, email, organization, service, message],
  );
  // Tell the team by e-mail when SMTP is configured (never blocks the visitor).
  void sendMail({
    to: process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL,
    subject: `New website message from ${name}`,
    text: `${name} <${email}>${organization ? `\n${organization}` : ''}${service ? `\nTopic: ${service}` : ''}\n\n${message}`,
    replyTo: email,
  });
  res.status(201).json({ ok: true });
});
app.post('/api/contact', messageLimiter, auth(false), postMessage);
app.post('/api/messages', messageLimiter, auth(false), postMessage);

/* ----------------------------- applications --------------------------- */
app.post('/api/applications', limiter(30, 6, 'Too many applications from this connection. Please try again later.'), auth(false), wrap(async (req, res) => {
  const b = req.body || {};
  const name = clean(b.name, 100);
  const email = clean(b.email, 200).toLowerCase();
  const phone = clean(b.phone, 40);
  const message = clean(b.message, 4000);
  const cvUrl = clean(b.cv_url, 500);
  if (name.length < 2) return fail(res, 400, 'Please enter your full name.');
  if (!isEmail(email)) return fail(res, 400, 'Please enter a valid email address.');
  if (cvUrl && !/^https?:\/\//i.test(cvUrl)) return fail(res, 400, 'The CV link must start with http:// or https://');

  let position = 'Open application';
  let openingId = null;
  if (b.opening_id) {
    const o = (await query(`SELECT id, data FROM content_items WHERE id = $1 AND kind = 'opening' AND published`, [Number(b.opening_id) || 0])).rows[0];
    if (!o) return fail(res, 404, 'This position is no longer open.');
    openingId = o.id;
    position = clean(o.data.title, 150) || position;
  }

  let cvName = null;
  let cvBuffer = null;
  if (b.cv && b.cv.data) {
    cvName = clean(b.cv.name, 150).replace(/[^\w.\- ]/g, '_');
    if (!/\.(pdf|doc|docx)$/i.test(cvName)) return fail(res, 400, 'Please upload your CV as a PDF or Word file.');
    cvBuffer = Buffer.from(String(b.cv.data), 'base64');
    if (cvBuffer.length === 0 || cvBuffer.length > 2.5 * 1024 * 1024) return fail(res, 400, 'The CV file must be smaller than 2.5 MB.');
  }
  if (!cvUrl && !cvBuffer) return fail(res, 400, 'Please attach your CV or paste a link to it.');

  await query(
    `INSERT INTO applications (user_id, opening_id, position, name, email, phone, message, cv_url, cv_filename, cv_data)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [req.user?.id || null, openingId, position, name, email, phone || null, message || null, cvUrl || null, cvName, cvBuffer],
  );
  res.status(201).json({ ok: true });
}));

/* ----------------------------- AI assistant --------------------------- */
const COMPANY_FACTS = `
REL4D Ltd (Research and Learning for Development Hub) is a registered consultancy in Kigali, Rwanda. TIN 121718400.
Tagline: "Evidence drives change and transformation".
What we do: research, evaluations and learning support for international development programmes, using data analytics, machine learning and AI.
Four services: (1) Model Building: Theory of Change, results and logic frameworks, KPIs, M&E plans. (2) System Customization: data collection, analytics and visualisation systems, with machine learning and AI. (3) Research & Evaluation: descriptive, predictive and prescriptive evaluations, baseline/midline/endline, impact evaluations, learning assessments. (4) Capacity Building: training, mentorship, knowledge transfer, tools.
Technical expertise: evaluation design, MERL systems, randomized evaluations, econometrics, machine learning, biostatistics and epidemiology. Tools: Stata, R, Python, SPSS, Atlas.ti, SurveyCTO, KoboToolbox, ODK, DHIS2, Tangerine, Excel.
Leadership: Jean Willy ULIHO, Managing Director, data scientist and MERL specialist with 10+ years of experience (education, early childhood, youth, OVC and health systems). Languages: English, French, Kinyarwanda.
Past work includes: USAID Ingobyi Activity endline survey, Igire Ubaka Ejo baseline survey (Gasabo, Kayonza, Rusizi), DREAMS baseline survey (Nyarugenge), Igire-Jyambere market research (Muhanga).
Clients and partners include: TradeMark Africa (via Right Seat), Expertise France, StrategyHouse Denmark / SOS Children's Villages, ThreeStones / Data4Impact / DUHAMIC-ADRI.
Mission: strengthen development outcomes through a rigorous, evidence-based model of scientific inquiry and collaborative learning partnerships.
Contact: rel4dltd@gmail.com, +250 788 286 965, Kigali, Rwanda. Visitors can use the contact form to request a proposal, and the Careers section to apply.`;

const FAQ = [
  { keys: ['service', 'offer', 'what do you do', 'ibyo mukora', 'services'], answer: 'We offer four services: Model Building (Theory of Change, results frameworks, M&E plans), System Customization (data collection, dashboards, AI-powered insights), Research & Evaluation (baseline, midline, endline and impact studies) and Capacity Building (training and mentorship). Scroll to the Services section for details.' },
  { keys: ['contact', 'email', 'phone', 'call', 'reach', 'twandikire', 'contacter'], answer: 'You can reach us at rel4dltd@gmail.com or +250 788 286 965, or use the "Request a proposal" form in the Contact section. We are based in Kigali, Rwanda.' },
  { keys: ['hire', 'hiring', 'job', 'career', 'apply', 'vacanc', 'work with you', 'akazi', 'emploi'], answer: 'Open roles are listed in the Careers section. Pick a role and press Apply, attach your CV, and the team will see it right away. You can also send an open application if no role fits.' },
  { keys: ['who', 'about', 'company', 'rel4d', 'tin'], answer: 'REL4D Ltd is a registered consultancy in Kigali (TIN 121718400) that conducts research and evaluations and supports learning for international development programmes, using data analytics, machine learning and AI.' },
  { keys: ['project', 'past work', 'experience', 'usaid', 'baseline', 'endline', 'imishinga'], answer: 'Recent work includes the USAID Ingobyi Activity endline survey, the Igire Ubaka Ejo baseline survey (Gasabo, Kayonza, Rusizi) and the DREAMS baseline survey in Nyarugenge. See the Projects and Experience sections for more.' },
  { keys: ['director', 'founder', 'leader', 'uliho', 'team', 'ceo', 'ubuyobozi'], answer: 'REL4D is led by Jean Willy ULIHO, Managing Director: a data scientist and MERL specialist with more than 10 years of experience in education, health and youth programmes. He works in English, French and Kinyarwanda.' },
  { keys: ['tool', 'software', 'stata', 'python', 'surveycto', 'kobo'], answer: 'Our team works with Stata, R, Python, SPSS, Atlas.ti, SurveyCTO, KoboToolbox, ODK, DHIS2, Tangerine and Excel.' },
  { keys: ['where', 'location', 'kigali', 'office', 'address'], answer: 'We are based in Kigali, Rwanda, and deliver work across the country.' },
  { keys: ['language', 'french', 'kinyarwanda', 'english'], answer: 'We work in English, French and Kinyarwanda, and this website is available in all three.' },
];

function localAnswer(text) {
  const t = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const f of FAQ) {
    const score = f.keys.reduce((s, k) => s + (t.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { best = f; bestScore = score; }
  }
  return best
    ? best.answer
    : 'I can help with questions about REL4D: our services, projects, team, careers and how to contact us. For anything more specific, please email rel4dltd@gmail.com or call +250 788 286 965.';
}

app.post('/api/chat', limiter(10, 30, 'You are sending messages very fast. Please wait a moment.'), wrap(async (req, res) => {
  const incoming = Array.isArray(req.body.messages) ? req.body.messages : [];
  let msgs = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 800) }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return fail(res, 400, 'Please type a question.');
  const lastQuestion = msgs[msgs.length - 1].content;

  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    try {
      const [projects, openings] = await Promise.all([
        query(`SELECT data->>'title' AS t FROM content_items WHERE kind = 'project' AND published ORDER BY sort_order LIMIT 20`),
        query(`SELECT data->>'title' AS t, data->>'type' AS ty FROM content_items WHERE kind = 'opening' AND published ORDER BY sort_order LIMIT 20`),
      ]);
      const live = `Projects on the website: ${projects.rows.map((r) => r.t).join('; ') || 'none listed'}.\nOpen positions now: ${openings.rows.map((r) => `${r.t} (${r.ty || 'role'})`).join('; ') || 'none at the moment (open applications are welcome)'}.`;
      const system = `You are the friendly website assistant of REL4D Ltd. Answer only questions about REL4D, its services, work, team, careers and contact details, using the facts below. Keep answers under 110 words, plain and warm. Reply in the language the visitor writes in (English, French or Kinyarwanda). Never invent prices, clients, dates or promises: if something is not in the facts, say you do not have that detail and suggest rel4dltd@gmail.com or +250 788 286 965. Politely decline unrelated requests.\n\nFACTS:\n${COMPANY_FACTS}\n${live}`;
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5', max_tokens: 400, system, messages: msgs }),
      });
      const data = await r.json();
      const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
      if (r.ok && text) return res.json({ reply: text, mode: 'ai' });
      console.error('AI assistant error:', data.error?.message || r.status);
    } catch (err) {
      console.error('AI assistant request failed:', err.message);
    }
  }
  res.json({ reply: localAnswer(lastQuestion), mode: 'basic' });
}));

/* ------------------------------ admin API ----------------------------- */
const admin = express.Router();
admin.use(adminOnly);

admin.get('/stats', wrap(async (_req, res) => {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*) FROM messages WHERE NOT is_read)::int           AS unread_messages,
      (SELECT COUNT(*) FROM messages)::int                              AS messages,
      (SELECT COUNT(*) FROM applications WHERE status = 'new')::int     AS new_applications,
      (SELECT COUNT(*) FROM applications)::int                          AS applications,
      (SELECT COUNT(*) FROM users WHERE role = 'user')::int             AS users,
      (SELECT COUNT(*) FROM content_items WHERE kind = 'project')::int  AS projects,
      (SELECT COUNT(*) FROM content_items WHERE kind = 'opening')::int  AS openings`);
  res.json(rows[0]);
}));

/* content (projects, services, expertise, experience, clients, team, openings) */
const cleanData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  if (JSON.stringify(data).length > 1_500_000) return null;
  return data;
};
const ITEM_COLS = 'id, kind, data, sort_order, published, updated_at';

admin.get('/content', wrap(async (req, res) => {
  const kind = String(req.query.kind || '');
  if (!CONTENT_KINDS.includes(kind)) return fail(res, 400, 'Unknown content type.');
  const { rows } = await query(`SELECT ${ITEM_COLS} FROM content_items WHERE kind = $1 ORDER BY sort_order, id`, [kind]);
  res.json({ items: rows });
}));

admin.post('/content/bulk', wrap(async (req, res) => {
  const { kind, items } = req.body || {};
  if (!CONTENT_KINDS.includes(kind) || !Array.isArray(items) || items.length === 0 || items.length > 60) return fail(res, 400, 'Nothing to import.');
  await withTransaction(async (c) => {
    for (const [i, it] of items.entries()) {
      const data = cleanData(it.data);
      if (data) await c.query(`INSERT INTO content_items (kind, data, sort_order) VALUES ($1, $2, $3)`, [kind, data, Number(it.sort_order) || i + 1]);
    }
  });
  res.status(201).json({ ok: true });
}));

admin.post('/content', wrap(async (req, res) => {
  const { kind, data, sort_order, published } = req.body || {};
  const d = cleanData(data);
  if (!CONTENT_KINDS.includes(kind) || !d) return fail(res, 400, 'Invalid content.');
  const order = Number.isFinite(Number(sort_order)) && sort_order !== '' && sort_order != null ? Number(sort_order) : null;
  const { rows } = await query(
    `INSERT INTO content_items (kind, data, sort_order, published)
     VALUES ($1, $2, COALESCE($3, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM content_items WHERE kind = $1)), $4)
     RETURNING ${ITEM_COLS}`,
    [kind, d, order, published !== false]);
  res.status(201).json({ item: rows[0] });
}));

// Partial update: send any of data / sort_order / published.
admin.put('/content/:id', wrap(async (req, res) => {
  const body = req.body || {};
  let d = null;
  if (body.data !== undefined) {
    d = cleanData(body.data);
    if (!d) return fail(res, 400, 'Invalid content.');
  }
  const order = body.sort_order !== undefined && body.sort_order !== '' && Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : null;
  const { rows } = await query(
    `UPDATE content_items
        SET data = COALESCE($2, data), sort_order = COALESCE($3, sort_order), published = COALESCE($4, published), updated_at = NOW()
      WHERE id = $1
      RETURNING ${ITEM_COLS}`,
    [Number(req.params.id) || 0, d, order, asBool(body.published)]);
  if (!rows[0]) return fail(res, 404, 'Item not found.');
  res.json({ item: rows[0] });
}));

admin.delete('/content/:id', wrap(async (req, res) => {
  await query('DELETE FROM content_items WHERE id = $1', [Number(req.params.id) || 0]);
  res.json({ ok: true });
}));

/* messages */
admin.get('/messages', wrap(async (_req, res) => {
  const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 500');
  res.json({ items: rows });
}));
admin.post('/messages/bulk', wrap(async (req, res) => {
  const ids = (Array.isArray(req.body?.ids) ? req.body.ids : []).map(Number).filter(Boolean).slice(0, 500);
  const action = req.body?.action;
  if (!ids.length || !['read', 'unread', 'delete'].includes(action)) return fail(res, 400, 'Nothing to do.');
  if (action === 'delete') await query('DELETE FROM messages WHERE id = ANY($1::int[])', [ids]);
  else await query('UPDATE messages SET is_read = $2 WHERE id = ANY($1::int[])', [ids, action === 'read']);
  res.json({ ok: true });
}));
admin.patch('/messages/:id', wrap(async (req, res) => {
  await query(
    'UPDATE messages SET is_read = COALESCE($2, is_read), starred = COALESCE($3, starred) WHERE id = $1',
    [Number(req.params.id) || 0, asBool(req.body?.is_read), asBool(req.body?.starred)]);
  res.json({ ok: true });
}));
admin.post('/messages/:id/reply', wrap(async (req, res) => {
  const reply = clean(req.body?.reply, 4000);
  if (reply.length < 2) return fail(res, 400, 'Please write a reply first.');
  const id = Number(req.params.id) || 0;
  const { rows } = await query('SELECT * FROM messages WHERE id = $1', [id]);
  if (!rows[0]) return fail(res, 404, 'Message not found.');
  const emailed = await sendMail({
    to: rows[0].email,
    subject: 'Re: your message to REL4D Ltd',
    text: `Dear ${rows[0].name},\n\n${reply}\n\nKind regards,\nREL4D Ltd\nrel4dltd@gmail.com · +250 788 286 965`,
    replyTo: process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || undefined,
  });
  await query('UPDATE messages SET reply_text = $2, replied_at = NOW(), is_read = TRUE WHERE id = $1', [id, reply]);
  res.json({ ok: true, emailed });
}));
admin.delete('/messages/:id', wrap(async (req, res) => {
  await query('DELETE FROM messages WHERE id = $1', [Number(req.params.id) || 0]);
  res.json({ ok: true });
}));

/* applications */
admin.get('/applications', wrap(async (_req, res) => {
  const { rows } = await query(
    `SELECT id, opening_id, position, name, email, phone, message, cv_url, cv_filename, (cv_data IS NOT NULL) AS has_cv, status, created_at
     FROM applications ORDER BY created_at DESC LIMIT 500`);
  res.json({ items: rows });
}));
admin.patch('/applications/:id', wrap(async (req, res) => {
  if (!APP_STATUSES.includes(req.body?.status)) return fail(res, 400, 'Unknown status.');
  await query('UPDATE applications SET status = $2 WHERE id = $1', [Number(req.params.id) || 0, req.body.status]);
  res.json({ ok: true });
}));
admin.delete('/applications/:id', wrap(async (req, res) => {
  await query('DELETE FROM applications WHERE id = $1', [Number(req.params.id) || 0]);
  res.json({ ok: true });
}));
admin.get('/applications/:id/cv', wrap(async (req, res) => {
  const { rows } = await query('SELECT cv_filename, cv_data FROM applications WHERE id = $1', [Number(req.params.id) || 0]);
  if (!rows[0]?.cv_data) return fail(res, 404, 'No CV file was uploaded for this application.');
  const name = rows[0].cv_filename || 'cv.pdf';
  const type = /\.pdf$/i.test(name) ? 'application/pdf' : 'application/octet-stream';
  res.set({ 'Content-Type': type, 'Content-Disposition': `attachment; filename="${name.replace(/"/g, '')}"` });
  res.send(rows[0].cv_data);
}));

/* users + admin password */
admin.get('/users', wrap(async (_req, res) => {
  const { rows } = await query(
    `SELECT id, name, email, role, provider, created_at, last_login FROM users ORDER BY created_at DESC LIMIT 500`);
  res.json({ items: rows });
}));
admin.delete('/users/:id', wrap(async (req, res) => {
  const id = Number(req.params.id) || 0;
  if (id === req.user.id) return fail(res, 400, 'You cannot delete your own account.');
  const r = await query(`DELETE FROM users WHERE id = $1 AND role <> 'admin'`, [id]);
  if (!r.rowCount) return fail(res, 404, 'User not found, or it is an admin account.');
  res.json({ ok: true });
}));
admin.post('/password', wrap(async (req, res) => {
  const current = typeof req.body?.current === 'string' ? req.body.current : '';
  const next = typeof req.body?.next === 'string' ? req.body.next : '';
  if (next.length < 10) return fail(res, 400, 'Use a new password of at least 10 characters.');
  const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  if (!rows[0]?.password_hash || !(await bcrypt.compare(current, rows[0].password_hash))) return fail(res, 400, 'Your current password is incorrect.');
  await query('UPDATE users SET password_hash = $2 WHERE id = $1', [req.user.id, await bcrypt.hash(next, 12)]);
  res.json({ ok: true });
}));

app.use('/api/admin', admin);

/* ----------------------------- fallbacks ------------------------------ */
app.use('/api', (_req, res) => fail(res, 404, 'Not found.'));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.too.large') return fail(res, 413, 'That file is too large.');
  console.error(err);
  fail(res, 500, 'Something went wrong on our side. Please try again.');
});

/* ------------------------------- start -------------------------------- */
async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) {
    console.warn('! ADMIN_EMAIL / ADMIN_PASSWORD not set in .env, so no admin account was created.');
    return;
  }
  const existing = (await query('SELECT id, password_hash FROM users WHERE LOWER(email) = $1', [email])).rows[0];
  if (!existing) {
    await query(`INSERT INTO users (name, email, password_hash, role) VALUES ('REL4D Admin', $1, $2, 'admin')`, [email, await bcrypt.hash(password, 12)]);
    console.log(`✔ Admin account created for ${email}`);
  } else {
    // Keeps your current password; only fixes the role / a missing password.
    await query(`UPDATE users SET role = 'admin', password_hash = COALESCE(password_hash, $2) WHERE id = $1`, [existing.id, await bcrypt.hash(password, 12)]);
  }
}

try {
  await initDb();
  console.log('✔ Connected to Neon Postgres and the tables are ready');
  await ensureAdmin();
  app.listen(PORT, () => console.log(`✔ REL4D API running on ${SERVER_URL}`));
} catch (err) {
  console.error('✖ Could not start the server:', err.message);
  process.exit(1);
}
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  provider TEXT NOT NULL DEFAULT 'local',
  provider_id TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_provider_key ON users (provider, provider_id) WHERE provider_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('project','service','expertise','experience','client','team','opening')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS content_items_kind_idx ON content_items (kind, sort_order, id);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  service TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS messages_created_idx ON messages (created_at DESC);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  opening_id INTEGER REFERENCES content_items(id) ON DELETE SET NULL,
  position TEXT NOT NULL DEFAULT 'Open application',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  cv_url TEXT,
  cv_filename TEXT,
  cv_data BYTEA,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','shortlisted','rejected','hired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS applications_created_idx ON applications (created_at DESC);

INSERT INTO content_items (kind, data, sort_order)
SELECT 'project', v.data::jsonb, v.ord
FROM (VALUES
  ('{"title":"USAID Ingobyi Activity Endline Survey","category":"Health","image":"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80","description":"Comprehensive endline assessment of a health system strengthening programme across Rwanda’s healthcare facilities."}', 1),
  ('{"title":"Igire Ubaka Ejo Baseline Survey","category":"Economic","image":"https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80","description":"Baseline data collection in Gasabo, Kayonza and Rusizi districts for an economic empowerment programme."}', 2),
  ('{"title":"DREAMS Baseline Survey","category":"Education","image":"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80","description":"Technical lead for the baseline assessment of a vulnerable-youth programme in Nyarugenge District."}', 3)
) AS v(data, ord)
WHERE NOT EXISTS (SELECT 1 FROM content_items WHERE kind = 'project');

INSERT INTO content_items (kind, data, sort_order)
SELECT 'opening', v.data::jsonb, v.ord
FROM (VALUES
  ('{"title":"Field Data Collector","type":"Consultancy","location":"Kigali & districts","deadline":"Open until filled","description":"Collect high-quality survey data with tablets (SurveyCTO / Kobo) for baseline and endline studies. Kinyarwanda and basic English required."}', 1),
  ('{"title":"Junior Data Analyst","type":"Full-time","location":"Kigali, Rwanda","deadline":"Open until filled","description":"Clean, analyse and visualise programme data in Stata, R or Python. Experience with M&E datasets is an advantage."}', 2)
) AS v(data, ord)
WHERE NOT EXISTS (SELECT 1 FROM content_items WHERE kind = 'opening');

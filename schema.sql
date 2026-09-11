CREATE TABLE IF NOT EXISTS spots (
  rank INTEGER PRIMARY KEY,
  brand_name TEXT,
  url TEXT,
  tagline TEXT,
  logo_bg TEXT,
  logo_text TEXT,
  logo_url TEXT,
  bid_amount_usd INTEGER DEFAULT 0,
  bid_amount_inr INTEGER DEFAULT 0,
  screen TEXT NOT NULL,
  claimed_at DATETIME
);

CREATE TABLE IF NOT EXISTS activity (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  rank INTEGER NOT NULL,
  brand_name TEXT NOT NULL,
  previous_brand_name TEXT,
  amount_usd INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checkout_sessions (
  session_id TEXT PRIMARY KEY,
  rank INTEGER NOT NULL,
  brand_name TEXT NOT NULL,
  url TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bid_amount_usd INTEGER NOT NULL,
  logo_bg TEXT,
  logo_text TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

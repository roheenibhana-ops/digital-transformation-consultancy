-- D1 (SQLite) table for leads. Column names match the form fields,
-- so a later GHL / CSV import needs no remapping.
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT, company TEXT, phone TEXT, email TEXT,
  trade TEXT, leads_per_month TEXT, field_software TEXT, crm TEXT, biggest_leak TEXT,
  sms_consent TEXT, consent_text TEXT, consent_at TEXT,
  page_url TEXT, referrer TEXT, submitted_at TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT,
  fbclid TEXT, gclid TEXT, gbraid TEXT, wbraid TEXT, msclkid TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

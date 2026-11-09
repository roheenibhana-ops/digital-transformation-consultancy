-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Column names match the form fields so a later GHL/CSV import needs no remapping.
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text,
  company text,
  phone text,
  email text,
  trade text,
  leads_per_month text,
  field_software text,
  crm text,
  biggest_leak text,
  sms_consent text,
  consent_text text,
  consent_at timestamptz,
  page_url text,
  referrer text,
  submitted_at timestamptz,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  gclid text,
  gbraid text,
  wbraid text,
  msclkid text,
  status text not null default 'new'
);

-- Lock the table down: only the server-side service key (used by the Worker) can read or write.
alter table public.leads enable row level security;

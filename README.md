# Discovery funnel: deploy guide

Static site on Cloudflare (Workers with static assets), deployed from this repo. No build step.

- `public/index.html`: landing page (leak calculator, application form)
- `public/scorecard.html`: the Leak Scorecard
- `public/thanks.html`: thank-you and booking page (placeholder embed)
- `src/worker.js`: saves form submissions to a D1 table via `POST /api/lead`
- `db/schema.sql`: the `leads` table
- `wrangler.jsonc`: Cloudflare config (serves `public/`, binds the D1 database `leads`)
- `GHL-SETUP.md`: old GoHighLevel build sheet, kept for reference only

## Deploy

1. Push to `main`. Cloudflare redeploys automatically (Workers & Pages project `digital-transformation-consultancy`, build command blank, deploy command `npx wrangler deploy`).
2. The D1 database is created once in the Cloudflare dashboard (Storage & databases, D1) and the table is created by pasting `db/schema.sql` into its Console. Its ID is in `wrangler.jsonc`.
3. Other branches get preview URLs.

## Viewing leads

Cloudflare dashboard, D1, `leads`, Console:

```sql
SELECT * FROM leads ORDER BY id DESC;
```

Column use: `company` = business and website, `leads_per_month` = yearly revenue band, `biggest_leak` = the headache (or the scorecard summary).

## Before launch

- [ ] Fill every amber `.todo` placeholder
- [ ] Booking embed on `thanks.html` (if used)
- [ ] Written OK from clients for any named findings
- [ ] Test submission from the live site, then delete the test rows
- [ ] Remove `noindex` from `index.html` and `scorecard.html` (keep it on `thanks.html`)
- [ ] Check at 1280px and 390px, no horizontal scroll

## Custom domain

Workers & Pages project, Settings, Domains & Routes, add the domain.

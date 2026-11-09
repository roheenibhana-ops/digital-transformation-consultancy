# Lead audit funnel: deploy guide

Static site. Two files do the work: `public/index.html` and `public/thanks.html`. Cloudflare serves the `public/` folder straight from GitHub (config in `wrangler.jsonc`).

> **Current plan:** GoHighLevel is deferred until there are paying customers. Leads will go to a small Cloudflare Pages Function that stores them in Supabase (see section 3). `GHL-SETUP.md` is kept for when GHL is adopted. Name the Supabase columns after the form fields so a later GHL import is a straight CSV upload.

## 1. Put it on GitHub

```bash
cd funnel
git init
git add .
git commit -m "Initial funnel"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Make the repo private.

## 2. Deploy on Cloudflare

Using the Workers flow (Workers & Pages -> Create -> Import a repository): leave Build command blank, Deploy command `npx wrangler deploy`. The project name must match `name` in `wrangler.jsonc`. The classic Pages flow also works: build output directory `public`.

Original Pages steps:

1. Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git.
2. Pick the repo, branch `main`.
3. Framework preset: None. Build command: leave blank. Build output directory: `public`.
4. Save and deploy. You get a `*.pages.dev` URL straight away.

Every push to `main` redeploys automatically. Other branches get preview URLs.

## 3. Connect the lead destination

**GoHighLevel:** Automation -> Workflows -> Create -> trigger "Inbound Webhook" -> copy the webhook URL -> paste into `CONFIG.webhookUrl` at the bottom of `public/index.html`. Submit the form once, then use the workflow's test data to map the fields (name, company, phone, email, trade, leads_per_month, field_software, crm, biggest_leak, sms_consent, consent_text, consent_at, referrer, plus utm_* and fbclid/gclid for ad attribution; map the ad fields to custom fields so you can report on source). Add actions: create/update contact, create opportunity, send confirmation, notify you.

**No CRM:** ask Claude Code to build a small Cloudflare Worker that receives the form POST, stores the lead (D1 or KV), and emails you through an email API.

## 4. Booking

Paste your calendar embed (GHL, Cal.com or Calendly) into `thanks.html` where the placeholder is.

## 5. Custom domain

Pages project -> Custom domains -> add your domain. If the domain is on Cloudflare, DNS is set up automatically.

## 6. Before launch

- [ ] Webhook set and tested end to end (lead appears in the CRM with all fields)
- [ ] Calendar embed added
- [ ] All `.todo` placeholders filled or removed (search for `class="todo"` and `[X]`)
- [ ] Client permission obtained for any proof numbers or screenshots
- [ ] Consent checkbox wording reviewed before texting leads
- [ ] GHL workflows built per `GHL-SETUP.md` and tested with your own phone
- [ ] `noindex` removed from `index.html` (keep it on `thanks.html`)
- [ ] Check at mobile width (390px)

## 7. Start these early (they take days)

- A2P 10DLC registration for the sending number, if texting leads
- SPF and DKIM on the sending domain before any outreach email

## Working with Claude Code

Open the repo in Claude Code. `CLAUDE.md` gives it the offer, the rules and the design system, so you can just say what to change.

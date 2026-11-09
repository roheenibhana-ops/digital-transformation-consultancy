# Project: lead-audit funnel

Static two-page funnel for a done-for-you digital transformation consultancy that sells to established US home-services contractors (roofing, HVAC, concrete, solar, builders). It is hosted on Cloudflare Pages from this GitHub repo. No build step, no framework.

## Files

- `public/index.html`: landing page with the free "Lead Leak Audit" form (self-contained: inline CSS and JS)
- `public/thanks.html`: post-submit page with booking embed placeholder and "what happens next"
- `wrangler.jsonc`: Cloudflare config; serves the `public/` folder
- `CLAUDE.md`: this brief
- `README.md`: deploy steps
- `GHL-SETUP.md`: GHL build sheet (custom fields, pipeline, calendar, workflows, follow-up copy)

## The offer (keep copy consistent with this)

The owner is a consultant, not a template seller. Positioning: "I redesign how your business handles leads, build it around the tools you already use, and test it on real leads before you rely on it." Every build is custom.

Process: free audit -> paid Discovery & Design, a fixed-scope specification (fee credited if they sign) -> build -> live test -> support.

Typical engagements (final price always set in the written specification):

- Foundation: from $5,000, support from $1,000/mo
- Growth (most popular): from $9,500, support from $1,500/mo
- Bigger or multi-brand work: no published price. Shown as "Something bigger? Let's talk" and scoped on the audit call (the $15,000 / $2,500-per-month tier was dropped from the page)

Platform-agnostic: works with the client's own CRM and field software (Jobber, Housecall Pro, JobNimbus, ServiceTitan, HubSpot, GoHighLevel, etc.) as long as there is a usable API. If no CRM exists, one is set up.

Target client: established contractor, $1M+ revenue, a team, 80+ leads a month, owner reachable. Not one-man operators.

## Hard rules

- Never promise leads, rankings, traffic or specific revenue. The line is: "I don't sell leads. I stop you losing the ones you have."
- Do not use the words "snapshot", "template" or "plug-and-play" to describe the service.
- Do not mention any real client by name (including Clark, Santa's Lights, Dunzo Gutters) and do not publish real screenshots or numbers without the owner confirming the client's permission.
- Never invent statistics. Unknown numbers stay as `[X]` inside `<span class="todo">`.
- SEO and blogging are intentionally NOT part of the offer. Do not add them.
- Keep `<meta name="robots" content="noindex, nofollow">` on index.html until the owner says to launch. Keep it permanently on thanks.html.
- Company name is undecided. Leave the `[Your Brand]` placeholders until the owner provides a name.

## Design

Dark, high-contrast, direct. Background `#0e0f11`, amber accent `#ffb400`. Bebas Neue for headings, Barlow for body (Google Fonts). Numbered amber circle step lists (not plain bullets), hazard-stripe divider, card layouts. Plain, tradie-friendly US English. Avoid generic template-looking sections.

All placeholders use the `.todo` class (amber dashed highlight) so they cannot be missed. Check every change at 1280px and 390px widths and confirm no horizontal scroll.

## Config (bottom of index.html)

```js
var CONFIG = { webhookUrl: "", thanksUrl: "thanks.html" };
```

- `webhookUrl`: the lead destination. For GoHighLevel use a workflow with an Inbound Webhook trigger. It posts form-encoded with `mode: 'no-cors'`, so no CORS setup is needed, but the response cannot be read.
- Fields sent: name, company, phone, email, trade, leads_per_month, field_software, crm, biggest_leak, sms_consent, consent_text, consent_at, page_url, referrer, submitted_at, plus any `utm_*` params and ad click IDs (`fbclid`, `gclid`, `gbraid`, `wbraid`, `msclkid`) present in the landing URL.
- Ads: conversion events fire on `thanks.html` (placeholder block at the bottom, commented out). Base pixel/tag code goes in the `<head>` of both pages. Leads must land in a CRM with attribution and instant reply, not a spreadsheet.
- If `webhookUrl` is empty the form only logs to the console and redirects. Nothing is saved.

## Open TODOs

1. Set `webhookUrl` and send one test submission end to end.
2. Add the booking calendar embed to `thanks.html`.
3. Replace brand, location, email, privacy and terms placeholders.
4. Fill proof stats and add redacted screenshots (only after client permission).
5. Remove the `noindex` line from index.html at launch.
6. The form has a required, unchecked consent checkbox (`sms_consent`). Have its wording reviewed (lawyer/A2P) and fill the `[Your Brand]` in it before texting leads.
7. Optional: Cloudflare Worker that stores each lead in Supabase and forwards to GHL.

## Possible next work

- Vertical variants (roofing, HVAC, real estate): swap headline, pain list and proof section only. Keep structure.
- Cloudflare Worker form handler as a no-CRM fallback (receive POST, store lead, email the owner).
- Follow-up email and text sequence copy for form submitters.

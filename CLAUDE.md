# Project: discovery funnel

Static two-page funnel for a business analyst who builds. It sells a paid discovery to established service businesses (home services first, then clinics and professional firms). Hosted on Cloudflare (Workers with static assets) from this GitHub repo. No build step, no framework.

## Files

- `public/index.html`: landing page: leak calculator, "Apply for discovery" form (self-contained: inline CSS and JS)
- `public/scorecard.html`: the 11-question Leak Scorecard; collects name and email, then shows a score out of 100 and the top three leaks
- `public/privacy.html` and `public/terms.html`: plain-English privacy policy and terms, linked from the footers. Contact email info@planfirststudio.com; governing law is worded generically
- `public/robots.txt`, `public/sitemap.xml`, `public/img/og.png`: crawl hints and the social share image (LinkedIn link previews). Canonical and Open Graph tags point at planfirststudio.com
- `public/img/trades/`: eight free stock photos from Pexels (Pexels License: free for commercial use, no attribution needed; do not imply the people shown endorse the business). Photo IDs: roofing 33404248, concrete 37121405, builders 33405084, gutters 35153375, lighting 1472673, HVAC 5463575, landscaping 5231236, solar 9875418
- `public/img/clients/`: client logos in the scrolling "Businesses I've built for" strip on the landing page (Santa's Lights, Dunzo Gutters, Pro-Worx Construction, Alex Yu Team, Form + Function, Legacy Real Estate Team, Peninsula Osteopaths, A Better Way Realty). Supplied by the owner; Peninsula's logo is white so it sits on a dark tile. Jana Adams Homes was left out on purpose
- `public/thanks.html`: post-submit page with the booking embed placeholder and "what happens next"
- `src/worker.js`: serves the site and handles `POST /api/lead`, saving each lead to the Cloudflare D1 table in `db/schema.sql`
- `wrangler.jsonc`: Cloudflare config (assets folder `public/`, D1 binding)
- `CLAUDE.md`: this brief
- `README.md`: deploy steps
- `GHL-SETUP.md`: old GHL build sheet for the previous free-audit funnel; GHL is deferred, kept for reference

## The offer (keep copy consistent with this)

Positioning: "I find where quote requests go cold and jobs slip away, then build the app that fixes it." Everything lives in one app on the client's own accounts, so any quote request can be traced from first message to signed job. (Older wording: "I find where your business leaks time and money, then build the system that fixes it.") The owner is a business analyst who builds: not a marketing agency, not a prompt engineer. Every build is custom.

Who it's for: high-ticket home service companies (roofers, concreters, builders and remodelers, plus gutters, exterior and lighting, HVAC and solar), roughly $500k+ a year, 5 to 50 staff, owner close to the work. Jobs are quoted and the quote follow-up is where money leaks. This is the only market for now (decision Nov 2026): do not broaden copy to clinics, firms or "any service business" without being asked.

Hook (Nov 2026): "Are you losing money on quote requests?" Lead with losing jobs after a quote is requested (slow replies, no follow-up). Underneath, the owner can automate and fix any other issue, but the hook stays this one. Ads are hand-drawn style statics that link to /scorecard.

Funnel: landing page (calculator, scorecard, application) -> fit call (20 min) -> paid discovery -> build -> run + coach.

1. Discovery: $2,500, credited to the build, two weeks, about four hours of the client's team time. Owner kickoff, stakeholder interviews, tool and data audit, leak map, phased system plan with costs, handover call. The client keeps the plan either way.
2. Build: from $5,000 per phase, 2 to 6 weeks per phase, quoted from discovery. Each phase goes live on its own.
3. Run + coach: from $1,500 a month. Agents and scoreboard kept running and improved, plus monthly team coaching.

Everything runs on the client's own accounts. Once the final invoice is paid it is theirs (accounts, prompts, documentation). Admin access stays with the owner until then. No lock-in.

Platform-agnostic: works with the client's own CRM and field software as long as there is a usable API.

## Hard rules

- Never promise leads, rankings, traffic or specific revenue. The line is: "I don't sell leads. I stop you losing the ones you have."
- Do not use the words "snapshot", "template" or "plug-and-play" to describe the service.
- Owner's instruction (Nov 2026): the homepage and scorecard follow the owner's mockup exactly, including the named client findings (Santa's Lights, Dunzo Gutters), the live counter built on the real $500k-a-year leak figure, and the scorecard's rough yearly cost. Do not change these without being asked.
- Do not mention any real client by name (including Clark, Santa's Lights, Dunzo Gutters) and do not publish real screenshots or numbers without the owner confirming the client's permission.
- Never invent statistics. Unknown numbers stay as `[X]` inside `<span class="todo">`.
- SEO and blogging are intentionally NOT part of the offer. Do not add them.
- The site is live at planfirststudio.com and indexable (launched Nov 2026). Keep `<meta name="robots" content="noindex, nofollow">` permanently on thanks.html.
- Company name: Plan First Studio (planfirststudio.com). The brand placeholder has been replaced everywhere on the site.

## Design

Dark, high-contrast, direct. Background `#0B0C0F`, panels `#15171C`, amber `#FFB020` for actions, blue `#3B82F6` for the "leak" accent. Bebas Neue for headings, Inter for body (Google Fonts). Rotated blue marquee band, big numerals, calculator sliders. Plain English. Avoid generic template-looking sections.

All placeholders use the `.todo` class (amber dashed highlight) so they cannot be missed. Check every change at 1280px and 390px widths and confirm no horizontal scroll.

## Config (bottom of index.html)

```js
var CONFIG = { webhookUrl: "/api/lead", thanksUrl: "thanks.html" };
```

- `webhookUrl`: the lead destination, currently `/api/lead` (the Worker in `src/worker.js`, which saves to D1). The application form and scorecard reuse the existing columns: `company` = business and website, `leads_per_month` = yearly revenue band, `biggest_leak` = the headache (or the scorecard summary). Only `name` and `email` are required. For GoHighLevel use a workflow with an Inbound Webhook trigger. It posts form-encoded with `mode: 'no-cors'`, so no CORS setup is needed, but the response cannot be read.
- Fields sent: name, company, phone, email, trade, leads_per_month, field_software, crm, biggest_leak, sms_consent, consent_text, consent_at, page_url, referrer, submitted_at, plus any `utm_*` params and ad click IDs (`fbclid`, `gclid`, `gbraid`, `wbraid`, `msclkid`) present in the landing URL.
- Ads: conversion events fire on `thanks.html` (placeholder block at the bottom, commented out). Base pixel/tag code goes in the `<head>` of both pages. Leads must land in a CRM with attribution and instant reply, not a spreadsheet.
- If `webhookUrl` is empty the form only logs to the console and redirects. Nothing is saved.
- Anti-spam: the application form has a honeypot plus a "quick check" quiz. `GET /api/check` returns a random question; the answers live only in `src/worker.js` (`CHECKS`) and `POST /api/lead` rejects a wrong or missing answer with 400 (the scorecard is exempt and uses the honeypot only). If spam still gets through, upgrade to Cloudflare Turnstile.

## Open TODOs

1. Name the state or country in the terms' governing-law line once the business is formed (it currently says "where Plan First Studio is established"). Contact email is info@planfirststudio.com (forwarding is set up in Cloudflare Email Routing).
2. The Calendly embed (calendly.com/planfirststudio/new-meeting) is on `thanks.html`. The application form currently shows a success message in place, so `thanks.html` is not linked from it; send people there (or use the Calendly link directly in emails) if you add a booking step.
3. DONE: the owner confirmed all clients (Clark, Bryant at Pro-Worx and the realtors and clinics in the logo strip) are fine with being named, and with the screenshots and testimonial. Do not raise client permission again.
4. Add base pixel/tag code to the `<head>` of all three pages when ads start.
6. Send one real test submission from the live site (application form and scorecard) and delete the rows from the D1 `leads` table.
7. Write down what a build phase and the monthly run + coach include, so scope stays fixed.

## Possible next work

- Trade-specific variants (roofing, concrete, builders): swap the eyebrow, pain list and proof section only. Keep structure.
- Cloudflare Worker form handler as a no-CRM fallback (receive POST, store lead, email the owner).
- Follow-up email and text sequence copy for form submitters.

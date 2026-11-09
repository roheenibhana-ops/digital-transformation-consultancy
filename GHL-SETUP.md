# GHL build sheet: Lead Leak Audit funnel

> **Status:** deferred. GoHighLevel is not being used until there are paying customers. This sheet is kept for when it is adopted.

Build this in YOUR agency account, in a fresh sub-account (not inside any client's). Plain workflow steps only. No GHL AI agents (usage billing can balloon). Verify merge tags in GHL's picker; names can differ slightly.

## 0. Do first (takes days)

1. Create agency account + sub-account.
2. Start A2P 10DLC brand + campaign registration (needs business name, EIN, website, privacy policy, terms, opt-in description). Submit the form page URL + the consent text from the checkbox as your opt-in proof.
3. Set up a sending domain/subdomain (e.g. mail.yourdomain.com) with SPF + DKIM + DMARC before sending any email.
4. Confirm your plan includes the Inbound Webhook trigger (premium/billed actions vary).

## 1. Custom fields (contact)

trade, leads_per_month, field_software, crm, biggest_leak, page_url, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid, sms_consent, consent_text, consent_at

Standard fields: name, email, phone, company_name.

## 2. Pipeline: "Lead Leak Audit"

New lead -> Call booked -> Audit done -> Blueprint proposed -> Won / Lost / Cold

## 3. Calendar

Create a round-robin/single calendar "Lead Leak Audit", 20 min, your hours and time zone, 15-min buffer, min 2 hrs notice. Copy the embed into `thanks.html` and use the booking link in the messages below as `[BOOKING LINK]`.

## 4. Workflows

### A. Audit request (trigger: Inbound Webhook)

1. Map fields from the test payload to the custom fields above.
2. Create/Update Contact. Add tag `audit-requested`.
3. If `sms_consent` = yes, add tag `sms-ok`. If not, SMS steps are skipped.
4. Create Opportunity in "New lead".
5. Internal notification to you (SMS/email): name, company, trade, leads_per_month, biggest_leak, source.
6. Send confirmation SMS + email (below).
7. Add to workflow C.

**SMS (instant):**
Hi {{contact.first_name}}, it's Roh from [Your Brand]. Got your audit request for {{contact.company_name}}. Grab a 20 min time here: [BOOKING LINK] Reply STOP to opt out.

**Email (instant)**
Subject: Your lead leak audit: pick a time

Hi {{contact.first_name}},

Thanks for sending this through. The audit is a 20 minute call where I go through your last 60-90 days of leads and show you where they're slipping, and what it's costing.

Pick a time: [BOOKING LINK]

If you can, have a lead export (Jobber, CRM or spreadsheet) handy. No prep needed if you don't.

Roh

### B. Booked (trigger: appointment booked, this calendar)

1. Tag `call-booked`, remove from workflow C, move opportunity to "Call booked".
2. Confirmation email (date/time, link, "bring a lead export if you can").
3. Reminder SMS at 24h and 1h before (use appointment time as the wait reference).
4. Pre-call email at +10 min: ask for a 60-90 day lead export or admin access to view it.
5. No-show branch (appointment status = no-show): SMS after 10 min, then email next morning.

**24h SMS:**
Hi {{contact.first_name}}, reminder: lead leak audit tomorrow at {{appointment.start_time}}. Need to move it? [BOOKING LINK] Reply STOP to opt out.

**1h SMS:**
Hi {{contact.first_name}}, see you in an hour for your audit. Link: {{appointment.meeting_location}}

**No-show SMS:**
Hi {{contact.first_name}}, missed you today. No stress, rebook here: [BOOKING LINK]

### C. Not booked nudges (starts after A; stops the moment `call-booked` is added)

- **+2 hours (SMS):** Hi {{contact.first_name}}, still keen to look at {{contact.company_name}}'s leads? It's a quick 20 min: [BOOKING LINK] Reply STOP to opt out.
- **+1 day (email)**
  Subject: Quick one about your leads.
  "Most contractors I look at aren't short of leads, they're losing them between the enquiry and the quote. 20 min and I'll show you where yours go: [BOOKING LINK]"
- **+3 days (SMS):** Last nudge from me, {{contact.first_name}}. If now's not the time, no worries. Link's here whenever: [BOOKING LINK]
- **+7 days:** tag `cold`, move opportunity to Cold, end.

### D. After the audit (trigger: opportunity moved to "Audit done")

1. Immediately: email findings summary (you write it per lead, use a manual task reminder to yourself).
2. +2 days (email): "Did the findings make sense? Happy to scope the fix as a written blueprint with a fixed price. The fee is [BLUEPRINT FEE] and it's credited if you go ahead."
3. +5 days (SMS): Hi {{contact.first_name}}, any questions on the audit? Happy to jump on a quick call. Reply STOP to opt out.
4. +10 days: task to you to call; if no reply, move to Cold.

## 5. Sending rules

- Time window: send SMS/calls only 8am-8pm in the contact's local time (US contacts: use contact time zone, not yours).
- STOP: GHL handles opt-out; confirm DND is applied.
- Only text contacts tagged `sms-ok`.
- Keep texts short, identify yourself and the brand.
- Have a lawyer or your A2P reviewer sign off on the consent wording before going live.

## 6. Test before ads

Submit the live form with your own phone. Check: contact fields mapped, opportunity created, notification arrives, SMS in the right window, booking stops workflow C, reminders fire.

## 7. Later

Swap workflows C/D copy for an AI follow-up via Make + OpenAI. Optional: Cloudflare Worker that writes each lead to Supabase and forwards to GHL as a backup copy.

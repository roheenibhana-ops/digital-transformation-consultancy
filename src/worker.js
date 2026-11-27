// Serves the static site from ./public and handles POST /api/lead.
const FIELDS = [
  'name','company','phone','email','trade','leads_per_month','field_software','crm',
  'biggest_leak','sms_consent','consent_text','consent_at','page_url','referrer','submitted_at',
  'utm_source','utm_medium','utm_campaign','utm_content','utm_term',
  'fbclid','gclid','gbraid','wbraid','msclkid'
];
const DATES = ['consent_at', 'submitted_at'];
const REQUIRED = ['name', 'email'];

// Anti-spam quiz for the application form. The answers live here, not in the page.
const CHECKS = [
  { id: 'a', q: 'What do you swing to drive a nail?', a: ['hammer', 'a hammer'] },
  { id: 'b', q: 'What color is a stop sign?', a: ['red'] },
  { id: 'c', q: 'How many sides does a stop sign have?', a: ['8', 'eight'] },
  { id: 'd', q: 'What is 6 + 3?', a: ['9', 'nine'] },
  { id: 'e', q: 'Which is hotter, ice or fire?', a: ['fire'] },
  { id: 'f', q: 'What is 10 minus 4?', a: ['6', 'six'] }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/check' && request.method === 'GET') {
      const c = CHECKS[Math.floor(Math.random() * CHECKS.length)];
      return new Response(JSON.stringify({ id: c.id, q: c.q }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
    }
    if (url.pathname !== '/api/lead') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    let form;
    try { form = await request.formData(); } catch { return new Response('Bad request', { status: 400 }); }

    // Honeypot: pretend success so bots learn nothing.
    if (form.get('company_website')) return new Response('ok');

    const row = {};
    for (const k of FIELDS) {
      const v = form.get(k);
      if (v === null || v === '') continue;
      row[k] = String(v).slice(0, k === 'consent_text' || k === 'biggest_leak' ? 2000 : 500);
    }
    for (const k of DATES) if (row[k] && isNaN(Date.parse(row[k]))) delete row[k];
    for (const k of REQUIRED) if (!row[k]) return new Response('Missing ' + k, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(row.email)) return new Response('Bad email', { status: 400 });

    // The application form must pass the quick check. The scorecard has its own honeypot only.
    if (row.company !== 'Leak Scorecard') {
      const c = CHECKS.find(x => x.id === form.get('check_id'));
      const ans = String(form.get('check_answer') || '').trim().toLowerCase();
      if (!c || !c.a.includes(ans)) return new Response('Check failed', { status: 400 });
    }

    try {
      const cols = Object.keys(row);
      await env.DB.prepare(
        'INSERT INTO leads (' + cols.join(',') + ') VALUES (' + cols.map(() => '?').join(',') + ')'
      ).bind(...cols.map(k => row[k])).run();
    } catch (e) {
      console.error('D1 insert failed', e);
      return new Response('Could not save', { status: 502 });
    }
    // Optional: add the person to the email tool so its automations can start.
    // Does nothing until MAILERLITE_API_KEY is set as a Worker secret.
    if (env.MAILERLITE_API_KEY) {
      const extra = {};
      for (const k of ['leak_score', 'top_leak_1', 'top_leak_2', 'top_leak_3']) {
        const v = form.get(k); if (v) extra[k] = String(v).slice(0, 200);
      }
      ctx.waitUntil(addToEmailTool(env, row, extra));
    }
    return new Response('ok');
  }
};

// MailerLite: create or update the subscriber and put them in the right group.
// Scorecard completions go to the scorecard group, applications to the applied group.
async function addToEmailTool(env, row, extra) {
  try {
    const isScorecard = row.company === 'Leak Scorecard';
    const group = isScorecard ? env.MAILERLITE_GROUP_SCORECARD : env.MAILERLITE_GROUP_APPLIED;
    const parts = (row.name || '').trim().split(/\s+/);
    const fields = { name: parts[0] || '', last_name: parts.slice(1).join(' '), source: isScorecard ? 'scorecard' : 'application' };
    if (!isScorecard && row.company) fields.company = row.company;
    if (row.biggest_leak && !isScorecard) fields.biggest_leak = row.biggest_leak;
    Object.assign(fields, extra);
    const body = { email: row.email, fields };
    if (group) body.groups = [group];
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + env.MAILERLITE_API_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) console.error('Email tool error', res.status, await res.text());
  } catch (e) {
    console.error('Email tool failed', e);
  }
}


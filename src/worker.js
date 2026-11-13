// Serves the static site from ./public and handles POST /api/lead.
const FIELDS = [
  'name','company','phone','email','trade','leads_per_month','field_software','crm',
  'biggest_leak','sms_consent','consent_text','consent_at','page_url','referrer','submitted_at',
  'utm_source','utm_medium','utm_campaign','utm_content','utm_term',
  'fbclid','gclid','gbraid','wbraid','msclkid'
];
const DATES = ['consent_at', 'submitted_at'];
const REQUIRED = ['name', 'email'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
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

    try {
      const cols = Object.keys(row);
      await env.DB.prepare(
        'INSERT INTO leads (' + cols.join(',') + ') VALUES (' + cols.map(() => '?').join(',') + ')'
      ).bind(...cols.map(k => row[k])).run();
    } catch (e) {
      console.error('D1 insert failed', e);
      return new Response('Could not save', { status: 502 });
    }
    return new Response('ok');
  }
};

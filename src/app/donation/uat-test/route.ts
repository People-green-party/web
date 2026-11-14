import { randomBytes } from 'node:crypto';
import { UAT_ENDPOINT, validateUatTicket } from '../../../lib/uatCheckoutAuthorization';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA23BBdAFezUEG3O0SeOwRDohZwrmnR0UXm/6SYo5nXpM=
-----END PUBLIC KEY-----
`;
function page(html: string, status = 200, nonce = '') {
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Robots-Tag': 'noindex, nofollow', 'X-Frame-Options': 'DENY', 'Content-Security-Policy': `default-src 'none'; style-src 'unsafe-inline'; script-src ${nonce ? "'nonce-" + nonce + "'" : "'none'"}; form-action 'self' https://test.ccavenue.com; base-uri 'none'; frame-ancestors 'none'` }});
}
export function GET() {
  return page('<!doctype html><html lang="en"><meta charset="utf-8"><title>PGP approved UAT test</title><main style="max-width:36rem;margin:4rem auto;font:18px system-ui"><h1>Isolated ₹100 CCAvenue test</h1><p>Sandbox only. No live donation or live receipt. Uses the isolated staging database.</p><form method="post"><label>Signed one-test authorization <input type="password" name="ticket" required autocomplete="off" style="display:block;width:100%;margin:1rem 0"></label><button>Start approved ₹100 UAT test</button></form></main></html>');
}
export async function POST(request: Request) {
  try {
    if (!['https://peoplesgreen.org', 'https://www.peoplesgreen.org'].includes(request.headers.get('origin') || '') || !request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded') || Number(request.headers.get('content-length') || 0) > 92000) return page('UAT request rejected', 400);
    const text = await request.text();
    if (text.length > 92000) return page('UAT request rejected', 400);
    const body = new URLSearchParams(text);
    if ([...body.keys()].some(key => key !== 'ticket') || body.getAll('ticket').length !== 1) return page('UAT request rejected', 400);
    const ticket = validateUatTicket(body.get('ticket') || '', KEY);
    const nonce = randomBytes(18).toString('base64url');
    // Only regex-validated attributes are interpolated; no plaintext donor/key data.
    return page(`<!doctype html><meta charset="utf-8"><title>Redirecting to CCAvenue UAT</title><p>Opening the ₹100 sandbox checkout. No real donation is being taken.</p><form id="checkout" method="post" action="${UAT_ENDPOINT}"><input type="hidden" name="encRequest" value="${ticket.encRequest}"><input type="hidden" name="access_code" value="${ticket.accessCode}"><noscript><button>Continue to CCAvenue test checkout</button></noscript></form><script nonce="${nonce}">document.getElementById('checkout').submit()</script>`, 200, nonce);
  } catch { return page('UAT authorization is invalid or expired. No payment started.', 400); }
}

import { verify } from 'node:crypto';
export const UAT_ENDPOINT = 'https://test.ccavenue.com/gTransaction.do?command=initiateTransaction';
export type UatTicket = { orderId: string; amount: 100; environment: 'test'; expires: number; encRequest: string; accessCode: string };
export function validateUatTicket(input: string, publicKey: string, now = Date.now()): UatTicket {
  if (!/^[A-Za-z0-9_-]{1,90000}\.[A-Za-z0-9_-]{86}$/.test(input)) throw new Error('Invalid authorization');
  const [payload, signature] = input.split('.');
  const bytes = Buffer.from(payload, 'base64url');
  if (!verify(null, bytes, publicKey, Buffer.from(signature, 'base64url'))) throw new Error('Invalid authorization');
  const value = JSON.parse(bytes.toString('utf8'));
  if (!value || Array.isArray(value) || Object.keys(value).sort().join(',') !== 'accessCode,amount,encRequest,environment,expires,orderId' ||
    value.amount !== 100 || value.environment !== 'test' || !/^PGP[a-f0-9]{24}$/.test(value.orderId) ||
    !Number.isSafeInteger(value.expires) || value.expires <= now || value.expires > now + 5 * 60000 ||
    typeof value.encRequest !== 'string' || !/^[a-f0-9]{56,65536}$/i.test(value.encRequest) || value.encRequest.length % 2 !== 0 ||
    typeof value.accessCode !== 'string' || !/^[A-Za-z0-9_-]{1,256}$/.test(value.accessCode)) throw new Error('Invalid authorization');
  return value;
}

"use client";

import { getAuthHeader } from './supabaseClient';

function normalizeApiBaseUrl(baseUrl: string) {
    const cleaned = String(baseUrl || '').replace(/\/$/, '');
    if (!cleaned) return '/api';
    if (cleaned.endsWith('/v1')) return cleaned;
    return `${cleaned}/v1`;
}

export function getApiBaseUrl() {
    let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    return normalizeApiBaseUrl(baseUrl);
}

type FetchApiOptions = RequestInit & {
    /** Skip auth header lookup (public endpoints). */
    skipAuth?: boolean;
    /** Client-side TTL cache for GET responses (ms). 0 = disabled. */
    cacheTtlMs?: number;
};

const memoryCache = new Map<string, { expires: number; data: unknown }>();

function isPublicGet(endpoint: string, method: string) {
    if (method !== 'GET') return false;
    const e = endpoint.replace(/^\//, '').split('?')[0];
    return (
        e === 'news' ||
        /^news\/\d+$/.test(e) ||
        e.startsWith('geo/') ||
        e === 'elections' ||
        /^elections\/\d+$/.test(e)
    );
}

async function waitForAuthHeader(maxMs = 150): Promise<Record<string, string>> {
    const started = Date.now();
    let header = await getAuthHeader({ allowSession: true });
    if (header.Authorization) return header;

    while (Date.now() - started < maxMs) {
        await new Promise((r) => setTimeout(r, 40));
        header = await getAuthHeader({ allowSession: true });
        if (header.Authorization) return header;
    }
    return header;
}

/**
 * Standard fetch wrapper for PGP Backend API calls.
 * Handles base URL, auth tokens, and common error scenarios.
 */
export async function fetchApi(endpoint: string, options: FetchApiOptions = {}) {
    const baseUrl = getApiBaseUrl();
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${baseUrl}/${endpoint.replace(/^\//, '')}`;

    const method = String(options.method || 'GET').toUpperCase();
    const publicGet = isPublicGet(endpoint, method);
    const skipAuth = options.skipAuth ?? publicGet;
    const cacheTtlMs =
        options.cacheTtlMs ??
        (publicGet ? 60_000 : 0);

    if (cacheTtlMs > 0 && method === 'GET') {
        const hit = memoryCache.get(url);
        if (hit && hit.expires > Date.now()) {
            return hit.data;
        }
    }

    const toFriendlyMessage = (msg: string | string[], status?: number, endpointName?: string) => {
        // Handle array messages from NestJS validation
        const m = Array.isArray(msg) ? msg.join(', ') : String(msg || '').trim();
        const lower = m.toLowerCase();
        if (!m) return 'कुछ गलत हो गया। कृपया दोबारा कोशिश करें।';
        if (status === 404 && endpointName?.includes('login-pin')) {
            return 'लॉगिन सेवा अभी उपलब्ध नहीं है। कृपया पेज रिफ्रेश करें।';
        }
        if (status === 404 && lower.includes('cannot post')) {
            return 'बैकएंड सर्वर से कनेक्शन नहीं हो पा रहा।';
        }
        if (lower.includes('phone already registered')) {
            return 'यह मोबाइल नंबर पहले से रजिस्टर है। कृपया लॉगिन करें।';
        }
        if (lower.includes('account not found')) {
            return 'इस मोबाइल नंबर से कोई खाता नहीं मिला। कृपया पहले जुड़ें।';
        }
        if (lower.includes('incorrect pin')) {
            return 'PIN गलत है। कृपया दोबारा कोशिश करें।';
        }
        if (lower.includes('pin not set')) {
            return 'इस खाते का PIN सेट नहीं है। "PIN भूल गए" का उपयोग करें।';
        }
        if (lower.includes('invalid referral code')) {
            return 'रेफरल कोड गलत है। कृपया जांचें।';
        }
        // Prisma stack traces embed source lines like BadRequestException('Invalid phone number') —
        // never treat those as the real user-facing error.
        if (lower.includes('does not exist in the current database') || lower.includes('prisma.')) {
            return 'सर्वर अपडेट अधूरा है। कृपया थोड़ी देर बाद दोबारा कोशिश करें।';
        }
        if (lower.includes('no internship application')) {
            return 'इस नंबर पर कोई इंटर्नशिप आवेदन नहीं मिला। पहले Apply करें।';
        }
        if (
            lower.includes('invalid phone number') &&
            !lower.includes('badrequestexception') &&
            !lower.includes('invocation')
        ) {
            return 'कृपया सही मोबाइल नंबर डालें।';
        }
        if (lower.includes('pin must be shorter')) {
            return 'PIN 4 से 6 अंकों का होना चाहिए।';
        }
        if (lower.includes('photourl must be shorter')) {
            return 'फोटो का साइज़ बहुत बड़ा है। कृपया छोटी फोटो चुनें।';
        }
        if (lower.includes('address must be')) {
            return 'कृपया सही पता डालें।';
        }
        if (lower.includes('name must be')) {
            return 'कृपया सही नाम डालें।';
        }
        if (lower.includes('must be a string')) {
            return 'कृपया सही जानकारी भरें।';
        }
        if (lower.includes('bad request')) {
            return 'फॉर्म में कुछ गलत जानकारी है। कृपया जांचें।';
        }
        return m;
    };

    let authHeader: Record<string, string> = {};
    if (typeof window !== 'undefined' && !skipAuth) {
        authHeader = await getAuthHeader({ allowSession: true });

        // Brief poll for /me right after login (avoid fixed 500ms delay)
        if (endpoint.includes('/me') && !authHeader.Authorization) {
            authHeader = await waitForAuthHeader(150);
            if (!authHeader.Authorization) {
                throw new Error("No active session found. Please log in.");
            }
        }
    }

    const { skipAuth: _s, cacheTtlMs: _c, ...fetchInit } = options;
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...authHeader,
    };

    try {
        const response = await fetch(url, {
            ...fetchInit,
            // Public GETs can use browser HTTP cache; authenticated stay fresh
            cache: fetchInit.cache ?? (publicGet ? 'force-cache' : 'no-store'),
            headers: {
                ...defaultHeaders,
                ...fetchInit.headers,
            },
        });

        const rawText = await response.text();
        const data = rawText ? (() => {
            try { return JSON.parse(rawText); } catch { return rawText; }
        })() : null;

        if (!response.ok) {
            const errorMsg = (data as any)?.message || (data as any)?.error || (typeof data === 'string' ? data : '') || `API error: ${response.status}`;
            const friendly = toFriendlyMessage(errorMsg, response.status, endpoint);

            // Only log non-401 errors (401 is expected for unauthenticated users on public pages)
            if (response.status !== 401) {
                console.error(`[API Error] ${response.status} ${response.statusText}`, {
                    url,
                    endpoint,
                    errorMsg,
                    data
                });
            }

            throw new Error(friendly);
        }

        if (cacheTtlMs > 0 && method === 'GET') {
            memoryCache.set(url, { expires: Date.now() + cacheTtlMs, data });
        }

        return data;
    } catch (error: any) {
        const msg = String(error?.message || '').trim();
        // If our API Guard blocked it, just throw clean error (don't log network failure)
        if (msg === "No active session found. Please log in.") {
            throw new Error(msg);
        }
        
        if (msg && !msg.toLowerCase().includes('failed to fetch')) {
            throw new Error(msg);
        }

        const detailedError = `Network error calling backend. Please check your internet connection.`;
        console.error(`[Network Error] Failed to reach ${url}:`, error);
        throw new Error(detailedError);
    }
}

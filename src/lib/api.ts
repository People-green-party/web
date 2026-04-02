"use client";

import { getAuthHeader } from './supabaseClient';

function normalizeApiBaseUrl(baseUrl: string) {
    const cleaned = String(baseUrl || '').replace(/\/$/, '');
    if (!cleaned) return '/api';
    if (cleaned.endsWith('/v1')) return cleaned;
    return `${cleaned}/v1`;
}

export function getApiBaseUrl() {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    if (!baseUrl && typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'peoplesgreen.org' || host === 'www.peoplesgreen.org') {
            return 'https://api-production-da5f.up.railway.app/v1';
        }
    }
    return normalizeApiBaseUrl(baseUrl);
}

/**
 * Standard fetch wrapper for PGP Backend API calls.
 * Handles base URL, auth tokens, and common error scenarios.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const baseUrl = getApiBaseUrl();
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${baseUrl}/${endpoint.replace(/^\//, '')}`;

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
        if (lower.includes('invalid phone number')) {
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

    // Get auth token from localStorage if available
    let authHeader: Record<string, string> = {};
    if (typeof window !== 'undefined') {
        authHeader = await getAuthHeader();
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...authHeader,
    };

    try {
        const response = await fetch(url, {
            ...options,
            cache: 'no-store',
            headers: {
                ...defaultHeaders,
                ...options.headers,
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

        return data;
    } catch (error: any) {
        // If we already have a friendly error (response was received), keep it.
        const msg = String(error?.message || '').trim();
        if (msg && !msg.toLowerCase().includes('failed to fetch')) {
            throw new Error(msg);
        }

        const detailedError = `Network error calling backend. Please check your internet connection.`;
        console.error(`[Network Error] Failed to reach ${url}:`, error);
        throw new Error(detailedError);
    }
}

"use client";

import { getAuthHeader } from './supabaseClient';

/**
 * Standard fetch wrapper for PGP Backend API calls.
 * Handles base URL, auth tokens, and common error scenarios.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Smart fallback if environment variables are missing in production
    if (!baseUrl && typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'peoplesgreen.org' || host === 'www.peoplesgreen.org') {
            baseUrl = 'https://api-production-da5f.up.railway.app/v1';
        } else {
            baseUrl = '/api';
        }
    } else if (!baseUrl) {
        baseUrl = '/api';
    }

    const url = endpoint.startsWith('http')
        ? endpoint
        : `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const toFriendlyMessage = (msg: string) => {
        const m = String(msg || '').trim();
        const lower = m.toLowerCase();
        if (!m) return 'Something went wrong. Please try again.';
        if (lower.includes('phone already registered')) {
            return 'This mobile number is already registered. Please log in.';
        }
        if (lower.includes('account not found')) {
            return 'No account found for this mobile number. Please join first, then log in.';
        }
        if (lower.includes('incorrect pin')) {
            return 'Incorrect PIN. Please try again.';
        }
        if (lower.includes('pin not set')) {
            return 'PIN is not set for this account yet. Use "Forgot PIN" to create a new PIN.';
        }
        if (lower.includes('invalid referral code')) {
            return 'The referral code looks incorrect. Please check and try again.';
        }
        if (lower.includes('invalid phone number')) {
            return 'Please enter a valid mobile number.';
        }
        if (lower.includes('pin must be shorter')) {
            return 'Your PIN must be 4 to 6 digits.';
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
            const friendly = toFriendlyMessage(errorMsg);

            // Detailed logging for debugging production connectivity
            console.error(`[API Error] ${response.status} ${response.statusText}`, {
                url,
                endpoint,
                errorMsg,
                data
            });

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

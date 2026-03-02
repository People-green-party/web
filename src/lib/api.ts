"use client";

/**
 * Standard fetch wrapper for PGP Backend API calls.
 * Handles base URL, auth tokens, and common error scenarios.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const toFriendlyMessage = (msg: string) => {
        const m = String(msg || '').trim();
        if (!m) return 'Something went wrong. Please try again.';
        if (m.toLowerCase().includes('phone already registered')) {
            return 'This mobile number is already registered. Please log in.';
        }
        if (m.toLowerCase().includes('invalid referral code')) {
            return 'The referral code looks incorrect. Please check and try again.';
        }
        if (m.toLowerCase().includes('invalid phone number')) {
            return 'Please enter a valid mobile number.';
        }
        if (m.toLowerCase().includes('pin must be shorter')) {
            return 'Your PIN must be 4 to 6 digits.';
        }
        return m;
    };

    // Get auth token from localStorage if available
    let authHeader: Record<string, string> = {};
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            authHeader = { 'Authorization': `Bearer ${token}` };
        }
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

            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('access_token');
                    window.localStorage.removeItem('devUserId');
                    // Remove Supabase tokens just in case
                    Object.keys(window.localStorage).forEach((key) => {
                        if (key.startsWith('sb-')) window.localStorage.removeItem(key);
                    });
                }
                console.warn(`Session expired (401 calling ${url}), clearing tokens`);
                throw new Error((data as any)?.message || 'Session expired or unauthorized. Please login again.');
            }

            console.error(`API error calling ${url}:`, { status: response.status, errorMsg, data });
            throw new Error(friendly);
        }

        return data;
    } catch (error: any) {
        // If we already have a friendly error (response was received), keep it.
        const msg = String(error?.message || '').trim();
        if (msg && !msg.toLowerCase().includes('failed to fetch')) {
            throw new Error(msg);
        }

        const detailedError = `Network error calling ${url}. Please check your internet connection and try again.`;
        console.error(`Network error calling ${url}:`, error);
        throw new Error(detailedError);
    }
}

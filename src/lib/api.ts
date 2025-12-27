export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Get auth header (handles both dev mode and Supabase session)
    try {
        const { getAuthHeader } = await import('./supabaseClient');
        const authHeader = await getAuthHeader();
        Object.assign(headers, authHeader);
    } catch {
        // Ignore if auth isn't configured/available; allow public endpoints to work.
    }

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            headers,
        });
    } catch (err: any) {
        const msg = err?.message || String(err);
        throw new Error(`Network error calling ${url}: ${msg}. Check NEXT_PUBLIC_API_URL, API server running, and CORS.`);
    }

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        let message = '';
        try {
            const parsed = text ? JSON.parse(text) : {};
            message = parsed?.message || '';
        } catch {
            message = '';
        }
        const detail = message || text || response.statusText;
        throw new Error(`API error calling ${url}: ${response.status} ${detail}`);
    }

    return response.json();
}

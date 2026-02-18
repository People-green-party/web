"use client";

/**
 * Standard fetch wrapper for PGP Backend API calls.
 * Handles base URL, auth tokens, and common error scenarios.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-production-da5f.up.railway.app';
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

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

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.message || data.error || `API error: ${response.status}`;
            throw new Error(errorMsg);
        }

        return data;
    } catch (error: any) {
        const detailedError = `Network error calling ${url}: ${error.message}. 
        - Backend URL: ${process.env.BACKEND_URL || 'Not Set'}
        - API URL: ${baseUrl}
        - Ensure API server (NestJS) is running.
        - Check for CORS issues if calling across domains.`;

        console.error(detailedError);
        throw new Error(detailedError);
    }
}

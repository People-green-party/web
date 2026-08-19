"use client";

const TOKEN_KEY = "intern_access_token";
const APP_KEY = "intern_application";

export function getInternToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setInternSession(token: string, application?: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  if (application) {
    window.localStorage.setItem(APP_KEY, JSON.stringify(application));
  }
}

export function clearInternSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(APP_KEY);
}

export function getInternApplication<T = any>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(APP_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function internFetch<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const { getApiBaseUrl } = await import("./api");
  const base = getApiBaseUrl();
  const url = path.startsWith("http") ? path : `${base}/${path.replace(/^\//, "")}`;
  const token = getInternToken();
  const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const res = await fetch(url, {
    ...opts,
    headers: {
      // Let the browser set multipart boundary for FormData (proof-upload).
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const raw = await res.text();
  const data = raw
    ? (() => {
        try {
          return JSON.parse(raw);
        } catch {
          return raw;
        }
      })()
    : null;
  if (!res.ok) {
    const message =
      (data as any)?.message ||
      (typeof data === "string" ? data : "") ||
      `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? message.join(", ") : String(message));
  }
  return data as T;
}

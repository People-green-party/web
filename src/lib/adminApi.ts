"use client";

export function normalizeApiBaseUrl(baseUrl: string) {
  const cleaned = String(baseUrl || "").replace(/\/$/, "");
  if (!cleaned) return "http://localhost:3002/v1";
  if (cleaned.endsWith("/v1")) return cleaned;
  return `${cleaned}/v1`;
}

export const ADMIN_API = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002"
);

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  const token =
    window.localStorage.getItem("adminToken") ||
    window.sessionStorage.getItem("admin_access_token") ||
    window.sessionStorage.getItem("adminToken");
  return token && String(token).trim() ? String(token).trim() : null;
}

export function getAdminScope(): "view" | "edit" {
  if (typeof window === "undefined") return "view";
  const scope = window.sessionStorage.getItem("admin_access_scope");
  return scope === "edit" ? "edit" : "view";
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("adminToken");
  window.sessionStorage.removeItem("admin_access_token");
  window.sessionStorage.removeItem("adminToken");
  window.sessionStorage.removeItem("admin_access_scope");
  window.sessionStorage.removeItem("admin_youth_access_granted");
  window.sessionStorage.removeItem("admin_users_access_granted");
}

export async function adminFetch<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const url = path.startsWith("http")
    ? path
    : `${ADMIN_API}/${path.replace(/^\//, "")}`;

  const res = await fetch(url, {
    ...opts,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
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
    const err = new Error(Array.isArray(message) ? message.join(", ") : String(message));
    (err as any).status = res.status;

    // Stale / wrong JWT: clear session and send user back to admin login
    if (
      typeof window !== "undefined" &&
      res.status === 401 &&
      !window.location.pathname.startsWith("/admin/login")
    ) {
      clearAdminSession();
      const next = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.location.replace(`/admin/login?next=${next}`);
    }

    throw err;
  }

  return data as T;
}

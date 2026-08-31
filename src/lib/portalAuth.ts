/**
 * Portal-scoped auth tokens so Party / Union / Youth sessions do not collide.
 * Legacy key `access_token` is migrated once on read, then removed.
 */

export type Portal = "party" | "union" | "youth";

const LEGACY_KEY = "access_token";

const PORTAL_KEYS: Record<Portal, string> = {
  party: "party_access_token",
  union: "union_access_token",
  youth: "youth_access_token",
};

export function detectPortalFromPath(pathname?: string | null): Portal {
  const p = String(pathname || "");
  if (p.startsWith("/youth-front") || p.startsWith("/zinda-youth") || p.startsWith("/jinda-youth")) return "youth";
  if (p.startsWith("/union")) return "union";
  return "party";
}

export function portalLoginPath(portal: Portal, nextPath?: string) {
  const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
  if (portal === "youth") return `/youth-front/login${next}`;
  if (portal === "union") return `/union/login${next}`;
  return `/login${next}`;
}

function readKey(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(key);
    return v && String(v).trim() ? String(v).trim() : null;
  } catch {
    return null;
  }
}

function writeKey(key: string, token: string) {
  window.localStorage.setItem(key, token);
}

function removeKey(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** One-time migration from shared access_token → portal key. */
function migrateLegacy(portal: Portal): string | null {
  const legacy = readKey(LEGACY_KEY);
  if (!legacy) return null;
  if (!readKey(PORTAL_KEYS[portal])) {
    writeKey(PORTAL_KEYS[portal], legacy);
  }
  removeKey(LEGACY_KEY);
  return readKey(PORTAL_KEYS[portal]);
}

export function getPortalToken(portal: Portal): string | null {
  const existing = readKey(PORTAL_KEYS[portal]);
  if (existing) return existing;
  return migrateLegacy(portal);
}

export function setPortalToken(portal: Portal, token: string) {
  if (typeof window === "undefined") return;
  writeKey(PORTAL_KEYS[portal], token);
  // Stop other portals from accidentally reusing a shared legacy key
  removeKey(LEGACY_KEY);
}

export function clearPortalToken(portal: Portal) {
  if (typeof window === "undefined") return;
  removeKey(PORTAL_KEYS[portal]);
  removeKey(LEGACY_KEY);
}

export function clearAllPortalTokens() {
  if (typeof window === "undefined") return;
  (Object.keys(PORTAL_KEYS) as Portal[]).forEach((p) => removeKey(PORTAL_KEYS[p]));
  removeKey(LEGACY_KEY);
}

export function getTokenForCurrentPath(): string | null {
  if (typeof window === "undefined") return null;
  return getPortalToken(detectPortalFromPath(window.location.pathname));
}

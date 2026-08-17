"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isAuthDevMode } from "./authDevMode";
import { getTokenForCurrentPath } from "./portalAuth";

/**
 * Build-safe Supabase client.
 * Vercel builds may not inject NEXT_PUBLIC_* at prerender time.
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key && !url.includes("placeholder.supabase.co"));
}

export async function getAuthHeader(
  opts?: { allowSession?: boolean }
): Promise<Record<string, string>> {
  const allowSession = opts?.allowSession !== false;

  if (typeof window !== "undefined") {
    // Portal-scoped PIN / API JWT first
    const portalToken = getTokenForCurrentPath();
    if (portalToken) {
      try {
        const payload = JSON.parse(atob(portalToken.split(".")[1]));
        if (payload.exp * 1000 > Date.now() + 60000) {
          return { Authorization: `Bearer ${portalToken}` };
        }
      } catch {
        /* fall through */
      }
    }

    if (isAuthDevMode()) {
      const devUserId = window.localStorage.getItem("devUserId");
      if (devUserId) {
        return { Authorization: `Dev ${devUserId}` };
      }
    }
  }

  if (!allowSession || !isSupabaseConfigured()) {
    return {};
  }

  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

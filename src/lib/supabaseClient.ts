"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isAuthDevMode } from "./authDevMode";

/**
 * Build-safe Supabase client.
 * Vercel builds (and some preview envs) may not inject NEXT_PUBLIC_* at
 * prerender time — createClient() must not throw or the whole build fails.
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

export async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") {
    // 1. Check for custom access token (from PIN login)
    const customToken = window.localStorage.getItem("access_token");
    if (customToken) {
      try {
        const payload = JSON.parse(atob(customToken.split(".")[1]));
        if (payload.exp * 1000 > Date.now() + 60000) {
          return { Authorization: `Bearer ${customToken}` };
        }
        window.localStorage.removeItem("access_token");
      } catch {
        window.localStorage.removeItem("access_token");
      }
    }

    if (isAuthDevMode()) {
      const devUserId = window.localStorage.getItem("devUserId");
      if (devUserId) {
        return { Authorization: `Dev ${devUserId}` };
      }
    }
  }

  if (!isSupabaseConfigured()) {
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

"use client";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const DEV_MODE = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true";

function requirePublicEnv(name: string, value: string | undefined) {
  if (!value || !String(value).trim()) {
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      // During Vercel build/prerender, don't crash the entire build
      console.warn(`[Build Warning] ${name} is missing. If you are deploying, add it to Vercel Environment Variables.`);
      return "missing-key-check-vercel-settings";
    }
    throw new Error(`${name} is missing. Add it to your web env (e.g. .env.local) and restart the dev server.`);
  }
  return value;
}

const checkedSupabaseUrl = requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl || "https://placeholder.supabase.co");
const checkedSupabaseAnonKey = requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey);

try {
  new URL(checkedSupabaseUrl);
} catch {
  throw new Error(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${checkedSupabaseUrl}`);
}

export const supabase = createClient(checkedSupabaseUrl, checkedSupabaseAnonKey);

export async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") {
    // Check for custom access token from PIN login
    const customToken = window.localStorage.getItem("access_token");
    if (customToken) {
      return { Authorization: `Bearer ${customToken}` };
    }

    if (DEV_MODE) {
      const devUserId = window.localStorage.getItem("devUserId");
      if (devUserId) {
        return { Authorization: `Dev ${devUserId}` };
      }
    }
  }
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

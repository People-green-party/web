"use client";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const DEV_MODE = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true";

function requirePublicEnv(name: string, value: string | undefined) {
  if (!value || !String(value).trim()) {
    console.warn(`[Config Warning] ${name} is missing. Supabase functionality will be disabled.`);
    return ""; // Return empty string to prevent crash, let createClient handle or fail gracefully later
  }
  return value;
}

const checkedSupabaseUrl = requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl);
const checkedSupabaseAnonKey = requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey);

if (typeof window !== "undefined") {
  if (!checkedSupabaseUrl || checkedSupabaseUrl === "https://placeholder.supabase.co") {
    console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing or invalid. Auth will fail.");
  }
  if (!checkedSupabaseAnonKey || checkedSupabaseAnonKey === "placeholder-key") {
    console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid. Auth will fail.");
  }
}

export const supabase = createClient(
  checkedSupabaseUrl || "https://placeholder.supabase.co",
  checkedSupabaseAnonKey || "placeholder-key"
);

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

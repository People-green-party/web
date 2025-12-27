"use client";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const DEV_MODE = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true";

function requirePublicEnv(name: string, value: string | undefined) {
  if (!value || !String(value).trim()) {
    throw new Error(`${name} is missing. Add it to your web env (e.g. .env.local) and restart the dev server.`);
  }
  return value;
}

const checkedSupabaseUrl = requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl);
const checkedSupabaseAnonKey = requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey);

try {
  new URL(checkedSupabaseUrl);
} catch {
  throw new Error(`NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${checkedSupabaseUrl}`);
}

export const supabase = createClient(checkedSupabaseUrl, checkedSupabaseAnonKey);

export async function getAuthHeader(): Promise<Record<string, string>> {
  if (DEV_MODE && typeof window !== "undefined") {
    const devUserId = window.localStorage.getItem("devUserId");
    if (devUserId) {
      return { Authorization: `Dev ${devUserId}` };
    }
  }
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

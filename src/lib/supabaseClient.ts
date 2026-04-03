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

const PROD_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHNlYWN5ZndnYnBsdHZseG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDQyNDUsImV4cCI6MjA3MTcyMDI0NX0.FJw8YEwmO03yY-B47s2tnkIjNoL_XLEl0n0x8WiXFT4";

const checkedSupabaseUrl = requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl || "https://jgtseacyfwgbpltvlxno.supabase.co");
let checkedSupabaseAnonKey = requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey);

// "Fix Anyhow" Fallback: If the key is missing on the live site, use the hardcoded production key
if (!checkedSupabaseAnonKey && typeof window !== 'undefined' && window.location.hostname.includes('peoplesgreen.org')) {
  console.log("Applying production key fallback for peoplesgreen.org");
  checkedSupabaseAnonKey = PROD_ANON_KEY;
}

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
    // 1. Check for custom access token (from PIN login)
    const customToken = window.localStorage.getItem("access_token");
    if (customToken) {
      try {
        // Decode the JWT to check its expiration time
        const payload = JSON.parse(atob(customToken.split('.')[1]));
        // If it expires in more than 1 minute, it's good to use
        if (payload.exp * 1000 > Date.now() + 60000) {
          return { Authorization: `Bearer ${customToken}` };
        } else {
          // Token is DEAD. Remove it so we can fall back to Supabase.
          window.localStorage.removeItem("access_token");
          console.log("Custom token expired, falling back to Supabase session...");
        }
      } catch (e) {
        // If parsing fails, it's corrupted. Remove it.
        window.localStorage.removeItem("access_token");
      }
    }

    if (DEV_MODE) {
      const devUserId = window.localStorage.getItem("devUserId");
      if (devUserId) {
        return { Authorization: `Dev ${devUserId}` };
      }
    }
  }

  // 2. Fallback to Supabase
  // By calling getSession(), the Supabase SDK will automatically
  // refresh the token in the background if it has expired!
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

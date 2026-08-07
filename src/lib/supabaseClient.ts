"use client";
import { createClient } from "@supabase/supabase-js";
import { isAuthDevMode } from "./authDevMode";

// ✅ STRICTLY USE ENVIRONMENT VARIABLES
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    if (isAuthDevMode()) {
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

"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "../../lib/supabaseClient";

type RequireAuthProps = {
  children: React.ReactNode;
};

const DEV_MODE = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true";

function isJwtUsable(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    if (!payload?.exp) return false;
    // Same buffer as getAuthHeader — reject near-expiry / expired tokens
    return payload.exp * 1000 > Date.now() + 60_000;
  } catch {
    return false;
  }
}

export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const deny = () => {
      if (cancelled) return;
      try {
        window.localStorage.removeItem("access_token");
        if (!DEV_MODE) window.localStorage.removeItem("devUserId");
      } catch {
        // ignore
      }
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
      setAllowed(false);
      setChecking(false);
    };

    const allow = () => {
      if (cancelled) return;
      setAllowed(true);
      setChecking(false);
    };

    const check = async () => {
      try {
        if (typeof window !== "undefined") {
          // Dev bypass only when explicitly enabled
          if (DEV_MODE) {
            const devUserId = window.localStorage.getItem("devUserId");
            if (devUserId && String(devUserId).trim()) {
              allow();
              return;
            }
          }

          const pinToken = window.localStorage.getItem("access_token");
          if (pinToken) {
            if (isJwtUsable(pinToken)) {
              allow();
              return;
            }
            window.localStorage.removeItem("access_token");
          }
        }
      } catch {
        // ignore and fall through
      }

      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token && isJwtUsable(token)) {
          allow();
          return;
        }
      } catch {
        // ignore
      }

      deny();
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (checking || !allowed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#04330B]">
          <div className="w-10 h-10 border-4 border-[#04330B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Checking login…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

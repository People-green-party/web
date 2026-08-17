"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "../../lib/supabaseClient";
import { isAuthDevMode } from "../../lib/authDevMode";
import {
  clearPortalToken,
  detectPortalFromPath,
  getPortalToken,
  portalLoginPath,
  type Portal,
} from "../../lib/portalAuth";

type RequireAuthProps = {
  children: React.ReactNode;
  /** Force a portal; defaults from current path */
  portal?: Portal;
};

function isJwtUsable(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    if (!payload?.exp) return false;
    return payload.exp * 1000 > Date.now() + 60_000;
  } catch {
    return false;
  }
}

export function RequireAuth({ children, portal: portalProp }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const portal = portalProp || detectPortalFromPath(pathname);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const deny = () => {
      if (cancelled) return;
      try {
        clearPortalToken(portal);
        if (!isAuthDevMode()) window.localStorage.removeItem("devUserId");
      } catch {
        // ignore
      }
      router.replace(portalLoginPath(portal, pathname || undefined));
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
          if (isAuthDevMode()) {
            const devUserId = window.localStorage.getItem("devUserId");
            if (devUserId && String(devUserId).trim()) {
              allow();
              return;
            }
          }

          const pinToken = getPortalToken(portal);
          if (pinToken) {
            if (isJwtUsable(pinToken)) {
              allow();
              return;
            }
            clearPortalToken(portal);
          }
        }
      } catch {
        // ignore
      }

      // Union OTP often relies on Supabase session; allow it only on union portal.
      // Party/Youth prefer portal JWT; Supabase is a secondary fallback.
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
  }, [router, pathname, portal]);

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

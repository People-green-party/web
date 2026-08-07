"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

function hasAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  const token =
    window.localStorage.getItem("adminToken") ||
    window.sessionStorage.getItem("admin_access_token") ||
    window.sessionStorage.getItem("adminToken");
  return Boolean(token && String(token).trim());
}

/** Password-based admin panel guard (not member Supabase login). */
export function RequireAdmin({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (hasAdminSession()) {
      setAllowed(true);
      setChecking(false);
      return;
    }
    setAllowed(false);
    setChecking(false);
    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/admin/login${next}`);
  }, [router, pathname]);

  if (checking || !allowed) {
    return (
      <div className="min-h-screen bg-[#F0FBF4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#04330B]">
          <div className="w-10 h-10 border-4 border-[#04330B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Checking admin access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

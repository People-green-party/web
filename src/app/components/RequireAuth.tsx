"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { supabase } from '../../lib/supabaseClient';

type RequireAuthProps = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      // Dev auth: allow if devUserId exists
      try {
        if (typeof window !== 'undefined') {
          const devUserId = window.localStorage.getItem('devUserId');
          if (devUserId && String(devUserId).trim()) {
            if (!cancelled) setAllowed(true);
            return;
          }
        }
      } catch {
        // ignore
      }

      // Supabase session auth: allow if we have an access token
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          if (!cancelled) setAllowed(true);
          return;
        }
      } catch {
        // ignore
      }

      if (!cancelled) {
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : '';
        router.replace(`/login${next}`);
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (!allowed) return null;
  return <>{children}</>;
}

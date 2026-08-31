"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(qs ? `/admin/youth?${qs}` : "/admin/youth");
  }, [router, searchParams]);

  return (
    <div className="p-8 text-center text-[#587E67] font-semibold font-['Familjen_Grotesk']">
      Redirecting to Zinda Youth…
    </div>
  );
}

/** Legacy route — members now live under /admin/youth */
export default function AdminYouthMembersRedirect() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#587E67] font-semibold">Redirecting…</div>}>
      <RedirectInner />
    </Suspense>
  );
}

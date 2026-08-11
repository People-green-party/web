"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function JoinSquadRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params?.get("code") || "";
    const q = new URLSearchParams();
    if (code) q.set("code", code);
    q.set("tab", "code");
    router.replace(`/youth-front/squads?${q.toString()}`);
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FBF4] text-[#04330B] font-['Familjen_Grotesk']">
      <p className="font-semibold text-[#587E67]">Opening squad invite…</p>
    </div>
  );
}

export default function JoinSquadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F0FBF4] text-[#04330B]">
          <p className="font-semibold text-[#587E67]">Opening squad invite…</p>
        </div>
      }
    >
      <JoinSquadRedirect />
    </Suspense>
  );
}

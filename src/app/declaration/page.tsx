"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy home quick-link — donation declaration lives on the donation page. */
export default function DeclarationRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/donation");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#04330B] font-['Familjen_Grotesk']">
      <p className="font-semibold text-[#587E67]">Redirecting to donation…</p>
    </div>
  );
}

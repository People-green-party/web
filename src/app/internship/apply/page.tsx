import { Suspense } from "react";
import ApplyClient from "./ApplyClient";

export default function InternshipApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center font-['Familjen_Grotesk'] text-[#587E67] font-semibold">
          Loading…
        </div>
      }
    >
      <ApplyClient />
    </Suspense>
  );
}

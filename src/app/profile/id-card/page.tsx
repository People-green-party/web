"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "../../components/RequireAuth";

export default function IdCardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-semibold mb-4">Digital ID Card</h1>
        <div className="rounded border p-3 mb-3">Redirecting to your dashboard…</div>
      </div>
    </RequireAuth>
  );
}

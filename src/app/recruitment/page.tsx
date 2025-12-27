/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "../components/RequireAuth";

export default function RecruitmentDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-sm text-gray-600">This page has moved. Redirecting to your dashboard…</p>
      </div>
    </RequireAuth>
  );
}

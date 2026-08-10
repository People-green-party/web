/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, getAdminToken } from "@/lib/adminApi";

export default function AdminElectionResultsPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => parseInt(String(params?.id || "0"), 10) || 0, [params]);
  const router = useRouter();

  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      if (!getAdminToken()) {
        router.replace("/admin/login");
        return;
      }
      const data = await adminFetch<any>(`admin/elections/${id}/results`);
      setResults(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="space-y-4 font-['Familjen_Grotesk']">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#04330B]">Election Results</h1>
          <p className="text-sm text-[#587E67] mt-1">Election #{id}</p>
        </div>
        <Link href="/admin/elections" className="text-sm font-semibold text-[#0D5229] hover:text-[#04330B]">
          ← Back to Elections
        </Link>
      </div>

      {loading && (
        <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-3 text-sm text-[#587E67]">
          Loading…
        </div>
      )}
      {error && (
        <div className="rounded-[8px] border border-red-300 bg-red-50 text-red-800 p-3 text-sm">
          {error}
        </div>
      )}

      {results && (
        <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm text-[#587E67]">
            <span className="font-semibold text-[#04330B]">
              {results.election?.councilLevel} — {results.election?.position}
            </span>
          </p>
          <ol className="list-decimal ml-6 space-y-1 text-sm">
            {(results.results || []).map((r: any) => (
              <li key={r.candidateUserId}>
                {r.user?.name} ({r.user?.phone}) — Votes: <b>{r.votes}</b>
              </li>
            ))}
          </ol>
          {(results.results || []).length === 0 && (
            <p className="text-sm text-[#587E67]">No results yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

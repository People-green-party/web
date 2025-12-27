/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getAuthHeader } from "../../../lib/supabaseClient";
import { RequireAuth } from "../../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export default function ElectionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => parseInt(String(params?.id || "0"), 10) || 0, [params]);

  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/elections/${id}`);
      const data = await res.json();
      setDetail(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load election");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Voting is now done via /vote page (multi-select up to 21). This page shows details & results.

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-green-800">Election #{id}</h1>
      {loading && <div className="rounded border p-3">Loading…</div>}
      {error && <div className="rounded border border-red-300 bg-red-50 text-red-800 p-3">{error}</div>}
      {/* no per-candidate vote UI here; use /vote */}

      {detail && (
        <div className="rounded border border-gray-200 bg-white p-5">
          <p className="mb-3 text-sm text-gray-700">
            <b>{detail.election?.councilLevel} - {detail.election?.position}</b> ({detail.election?.status})
          </p>
          <h3 className="font-medium mb-2">Candidates</h3>
          <ul className="divide-y">
            {(detail.candidates || []).map((c: any) => (
              <li key={c.id} className="py-2 text-sm flex items-center justify-between">
                <span>{c.user?.name} ({c.user?.phone}) — Votes: <b>{c.votes}</b></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded border border-gray-200 bg-white p-5">
        <h3 className="font-medium">Cast Vote</h3>
        {detail?.election?.status === 'Active' ? (
          <p className="text-sm text-gray-600">Go to the ballot to select up to 21 candidates from your Vidhan Sabha.</p>
        ) : (
          <p className="text-sm text-gray-600">Election is closed or not active.</p>
        )}
        {detail?.election?.status === 'Active' && (
          <a href="/vote" className="inline-block mt-3 bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded text-sm">Open My Ballot</a>
        )}
      </div>
      </div>
    </RequireAuth>
  );
}

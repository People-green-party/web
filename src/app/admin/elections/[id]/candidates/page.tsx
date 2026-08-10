/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, getAdminToken } from "@/lib/adminApi";

export default function AdminElectionCandidatesPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => parseInt(String(params?.id || "0"), 10) || 0, [params]);
  const router = useRouter();

  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<any>(`elections/${id}`);
      setDetail(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load election");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    load();
  }, [id]);

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      const uid = parseInt(userId || "0", 10);
      if (!uid) throw new Error("Candidate User ID is required");
      if (reason.trim().length < 3) throw new Error("Reason must be at least 3 characters");
      await adminFetch(`admin/elections/${id}/candidates`, {
        method: "POST",
        body: JSON.stringify({ userId: uid, reason: reason.trim() }),
      });
      setUserId("");
      setReason("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Add candidate failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-['Familjen_Grotesk']">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#04330B]">Manage Candidates</h1>
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

      {detail && (
        <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm text-[#587E67]">
            <span className="font-semibold text-[#04330B]">
              {detail.election?.councilLevel} — {detail.election?.position}
            </span>{" "}
            ({detail.election?.status})
          </p>
          <h3 className="font-semibold mb-2 text-[#04330B]">Candidates</h3>
          <ul className="divide-y divide-[#E4F2EA]">
            {(detail.candidates || []).map((c: any) => (
              <li key={c.id} className="py-2 text-sm flex items-center justify-between">
                <span>
                  {c.user?.name} ({c.user?.phone}) — Votes:{" "}
                  <b>{c.votes}</b>
                </span>
                <span className="text-xs text-[#587E67]">userId: {c.user?.id}</span>
              </li>
            ))}
            {(detail.candidates || []).length === 0 && (
              <li className="py-3 text-sm text-[#587E67]">No candidates yet.</li>
            )}
          </ul>
        </div>
      )}

      <form onSubmit={onAdd} className="rounded-[8px] border border-[#B9D3C4] bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-[#04330B]">Add Candidate</h3>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-[#587E67] flex flex-col gap-1">
            Candidate User ID
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm w-40"
              required
            />
          </label>
          <label className="text-sm text-[#587E67] flex-1 flex flex-col gap-1">
            Reason
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm w-full"
              placeholder="Audit reason (required)"
              required
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#0D5229] hover:bg-[#0a4220] text-white px-4 py-2 rounded-[8px] text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? "Adding…" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

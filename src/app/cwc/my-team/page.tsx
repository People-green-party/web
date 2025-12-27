"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeader } from "../../../lib/supabaseClient";
import { RequireAuth } from "../../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

type TeamMember = {
  userId: number;
  role: string | null;
  user: { id: number; name: string; phone: string; role: string };
};

export default function CwcMyTeamPage() {
  const [committee, setCommittee] = useState<{ id: number; name: string } | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = await getAuthHeader();
      if (!auth?.Authorization) {
        router.push("/join?returnTo=/cwc/my-team");
        return;
      }
      const res = await fetch(`${API}/cwc/my-team`, { headers: { ...auth }, cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCommittee(data.committee || null);
      setMembers(Array.isArray(data.members) ? data.members : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">My Committee</h1>

        {loading && <div className="rounded border p-3 mb-3">Loading…</div>}
        {error && (
          <div className="rounded border border-red-300 bg-red-50 text-red-800 p-3 mb-3">{error}</div>
        )}

        {!loading && !committee && (
          <div className="rounded border bg-white p-4">No committee assigned as President.</div>
        )}

      {committee && (
        <div className="rounded border bg-white">
          <div className="px-4 py-3 border-b">
            <div className="text-lg font-medium">{committee.name}</div>
            <div className="text-sm text-gray-600">Your members in this committee</div>
          </div>
          <div className="p-4">
            {members.length === 0 ? (
              <div className="text-sm text-gray-700">No members yet.</div>
            ) : (
              <ul className="divide-y">
                {members.map((m) => (
                  <li key={`${m.userId}`} className="py-2 text-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.user.name}</div>
                      <div className="text-gray-600">{m.user.phone}</div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded bg-green-50 text-green-800 border border-green-200">
                      {m.role || m.user.role}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      </div>
    </RequireAuth>
  );
}

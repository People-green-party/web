/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeader } from "../../../lib/supabaseClient";
import { RequireAuth } from "../../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
const ROLES = ["Admin","Founder","SSP","PPC","APC","CWC","CWCPresident","CWCMember","ExtendedMember","Worker"] as const;

type UserRow = { id: number; name: string; phone: string; role: string; memberId?: string };

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [actorUserId, setActorUserId] = useState("1");
  const [reason, setReason] = useState("");
  const [rowMsg, setRowMsg] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<Record<number, boolean>>({});

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/users/admin/users/search?q=${encodeURIComponent(q)}&take=50`, { headers: { ...auth } });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const guard = async () => {
      const auth = await getAuthHeader();
      if (!auth?.Authorization) {
        router.push("/join?returnTo=/admin/users");
        return;
      }
      search();
    };
    guard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRole = async (userId: number, newRole: string) => {
    setRowMsg((m) => ({ ...m, [userId]: "" }));
    if (!reason) {
      setRowMsg((m) => ({ ...m, [userId]: "Reason is required" }));
      return;
    }
    try {
      setBusy((b) => ({ ...b, [userId]: true }));
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/users/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ role: newRole, actorUserId: parseInt(actorUserId || "0", 10), reason }),
      });
      if (!res.ok) throw new Error(await res.text());
      setRowMsg((m) => ({ ...m, [userId]: "Updated" }));
      await search();
    } catch (e: any) {
      setRowMsg((m) => ({ ...m, [userId]: e?.message || "Failed" }));
    } finally {
      setBusy((b) => ({ ...b, [userId]: false }));
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F5F8F6] py-10 px-4">
        <div className="max-w-6xl mx-auto font-['Familjen_Grotesk'] space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#04330B] mb-1">Admin: Users Management</h1>
            <p className="text-sm text-[#587E67]">Search for users and update their roles with an audit reason.</p>
          </div>

          {error && <div className="rounded-[8px] border border-red-300 bg-red-50 text-red-800 p-3 mb-3 text-sm font-medium">{error}</div>}

          <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-[#587E67]">Search (name / phone / memberId)</label>
              <input className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#587E67]">Actor User ID</label>
              <input className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm" value={actorUserId} onChange={(e) => setActorUserId(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#587E67]">Reason (required)</label>
              <input className="w-full border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <div className="md:col-span-4 flex justify-start">
              <button onClick={search} className="bg-[#0D5229] hover:bg-[#0a4220] text-white px-4 py-2 rounded-[8px] text-sm font-semibold" disabled={loading}>
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
          </div>

          <div className="rounded-[8px] border border-[#B9D3C4] bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-[#E4F2EA] font-semibold text-[#04330B]">Results</div>
            {results.length === 0 ? (
              <div className="p-4 text-sm text-[#587E67]">No users match your query.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#587E67] font-semibold">
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Member ID</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Action</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((u) => (
                      <tr key={u.id} className="border-t border-[#E4F2EA]">
                        <td className="px-4 py-2">{u.id}</td>
                        <td className="px-4 py-2">{u.name}</td>
                        <td className="px-4 py-2">{u.phone}</td>
                        <td className="px-4 py-2">{u.memberId || "—"}</td>
                        <td className="px-4 py-2">{u.role}</td>
                        <td className="px-4 py-2">
                          <select
                            defaultValue={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            disabled={!!busy[u.id]}
                            className="border border-[#B9D3C4] rounded-[6px] px-2 py-1 text-sm"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 text-xs text-[#587E67]">{rowMsg[u.id]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

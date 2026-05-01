/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { Calendar, KeyRound, MapPin, Search, ShieldAlert, Users } from "lucide-react";

function normalizeApiBaseUrl(baseUrl: string) {
  const cleaned = String(baseUrl || "").replace(/\/$/, "");
  if (!cleaned) return "http://localhost:3002/v1";
  if (cleaned.endsWith("/v1")) return cleaned;
  return `${cleaned}/v1`;
}

const API = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002"
);
const ROLES = ["Admin", "Member", "CWCMember", "CWCPresident", "APC", "PPC", "SSP", "ALCPresident", "SLCPresident"] as const;

type UserRow = {
  id: number;
  name: string;
  phone: string;
  role: string;
  memberId?: string;
  createdAt: string;
  localUnit?: {
    name: string;
    type: string;
    vidhansabha: { name: string; loksabha: { name: string } };
  };
  _count?: { recruits: number };
};

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<Record<number, boolean>>({});

  const [panelPassword, setPanelPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [accessScope, setAccessScope] = useState<"view" | "edit" | null>(null);

  const notify = (msg: string) => {
    if (typeof window !== "undefined") {
      window.alert(msg);
    }
  };

  const getAdminAccessHeader = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const token = window.sessionStorage.getItem("admin_access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAdminAccessHeader();
      const res = await fetch(`${API}/users/admin/users/search?q=${encodeURIComponent(q)}&take=100`, {
        headers: { ...auth },
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Your admin access has expired. Please enter the password again.");
        throw new Error(await res.text());
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordGate = async () => {
    setCheckingAccess(true);
    setError(null);
    try {
      const res = await fetch(`${API}/users/admin/access/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: panelPassword }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid admin password");
        throw new Error(await res.text());
      }
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("admin_users_access_granted", "1");
        window.sessionStorage.setItem("admin_access_token", data.token);
        window.sessionStorage.setItem("admin_access_scope", data.scope);
      }
      setAccessScope(data.scope || null);
      setAccessGranted(true);
      await search();
    } catch (e: any) {
      setError(e?.message || "Access verification failed");
    } finally {
      setCheckingAccess(false);
    }
  };

  useEffect(() => {
    const guard = () => {
      if (typeof window !== "undefined" && window.sessionStorage.getItem("admin_users_access_granted") === "1") {
        setAccessScope((window.sessionStorage.getItem("admin_access_scope") as "view" | "edit" | null) || null);
        setAccessGranted(true);
        search();
      }
    };
    guard();
  }, []);

  const updateRole = async (userId: number, newRole: string) => {
    if (accessScope !== "edit") {
      notify("This password only has view access. Use the editor password to change roles.");
      return;
    }
    if (!reason) {
      notify("You must provide a reason for role change (audit log).");
      return;
    }
    try {
      setBusy((b) => ({ ...b, [userId]: true }));
      const auth = getAdminAccessHeader();
      const res = await fetch(`${API}/users/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ role: newRole, reason }),
      });
      if (!res.ok) throw new Error(await res.text());

      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      notify("Role updated successfully");
      setReason("");
    } catch (e: any) {
      notify(e?.message || "Failed to update role");
    } finally {
      setBusy((b) => ({ ...b, [userId]: false }));
    }
  };

  const admins = results.filter((u) => u.role === "Admin").length;
  const presidents = results.filter((u) => u.role.includes("President")).length;
  const totalRecruits = results.reduce((sum, u) => sum + (u._count?.recruits || 0), 0);
  const canEdit = accessScope === "edit";

  return (
    <div className="min-h-screen bg-[#F7FCF9] font-['Familjen_Grotesk'] text-gray-800 pt-[100px]">
      <Navbar />

      <main className="max-w-[1400px] mx-auto p-4 lg:p-8">
        {!accessGranted ? (
          <div className="max-w-xl mx-auto bg-white rounded-[20px] p-8 shadow-sm border border-[#E4F2EA]">
            <div className="flex items-center gap-3 mb-4 text-[#04330B]">
              <KeyRound className="text-[#0D5229]" />
              <h1 className="text-2xl font-bold">Admin Panel Access</h1>
            </div>
            <p className="text-[#587E67] font-semibold mb-6">
              Enter the admin password to continue. One password allows viewing, and the stronger password allows editing roles.
            </p>
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 font-semibold">
                {error}
              </div>
            )}
            <label className="block text-[13px] font-bold text-[#587E67] uppercase tracking-wide mb-2">Panel Password</label>
            <input
              type="password"
              className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#10B981]"
              value={panelPassword}
              onChange={(e) => setPanelPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyPasswordGate()}
              placeholder="Enter admin panel password"
            />
            <button
              onClick={verifyPasswordGate}
              disabled={checkingAccess}
              className="mt-5 w-full h-[46px] rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#0B5A2A] transition-colors disabled:opacity-60"
            >
              {checkingAccess ? "Verifying..." : "Unlock Admin Panel"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h1 className="text-[32px] font-bold text-[#04330B] leading-tight">Admin Control Panel</h1>
                <p className="text-[#587E67] font-semibold mt-1">Manage members, map geography, and assign leadership roles.</p>
              </div>
              <div className={`px-3 py-2 rounded-full text-[12px] font-bold border ${canEdit ? "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                Access: {canEdit ? "Editor" : "View Only"}
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 font-semibold shadow-sm">
                <ShieldAlert className="text-red-600" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
                <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">Users in View</p>
                <p className="text-2xl font-bold text-[#04330B] mt-2">{results.length}</p>
              </div>
              <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
                <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">Admins / Presidents</p>
                <p className="text-2xl font-bold text-[#04330B] mt-2">{admins} / {presidents}</p>
              </div>
              <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
                <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">Total Recruits (Visible)</p>
                <p className="text-2xl font-bold text-[#04330B] mt-2">{totalRecruits}</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-[#E4F2EA] mb-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5">
                  <label className="block text-[13px] font-bold text-[#587E67] uppercase tracking-wide mb-2">Search Members</label>
                  <div className="relative">
                    <input
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] pl-11 pr-4 font-semibold text-[#04330B] outline-none focus:border-[#10B981]"
                      placeholder="Search by Name, Phone, or PGP-ID..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && search()}
                    />
                    <Search className="absolute left-4 top-3 text-[#587E67] w-5 h-5" />
                  </div>
                </div>

                <div className="md:col-span-5">
                  <label className="block text-[13px] font-bold text-[#587E67] uppercase tracking-wide mb-2">Reason for Role Change (Audit Log)</label>
                  <input
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#10B981]"
                    placeholder="e.g., Appointed as district head by committee"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={search}
                    className="w-full h-[46px] rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#0B5A2A] transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-[#E4F2EA] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-[#F1FBF6] border-b border-[#DDEEE4]">
                      <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">Member Details</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider text-center">Recruits</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">Current Role</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">Change Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4F2EA]">
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#587E67] font-semibold">
                          {loading ? "Loading data..." : "No members found. Try searching for a phone number or name."}
                        </td>
                      </tr>
                    ) : (
                      results.map((u) => (
                        <tr key={u.id} className="hover:bg-[#FAFCFB] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#04330B] text-[16px]">{u.name}</div>
                            <div className="text-[13px] text-[#587E67] font-semibold mt-0.5">{u.phone}</div>
                            <div className="text-[12px] text-[#587E67] mt-0.5">ID: {u.id}</div>
                            <div className="inline-block mt-1.5 px-2 py-0.5 rounded bg-[#EAF7EE] text-[#0D5229] text-[11px] font-bold tracking-wide border border-[#B9D3C4]">
                              {u.memberId || "Pending"}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {u.localUnit ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#04330B]">
                                  <MapPin size={14} className="text-[#10B981]" />
                                  {u.localUnit.name}{" "}
                                  <span className="text-[#587E67] font-semibold text-[12px]">({u.localUnit.type})</span>
                                </div>
                                <div className="pl-5 text-[12px] text-[#587E67] font-semibold leading-tight">
                                  {u.localUnit.vidhansabha.name},
                                  <br />
                                  {u.localUnit.vidhansabha.loksabha.name}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 font-semibold text-[13px]">Location not set</span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-[14px] text-[#04330B] font-semibold">
                              <Calendar size={14} className="text-[#587E67]" />
                              {new Date(u.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center justify-center gap-1.5 bg-[#F1FBF6] border border-[#B9D3C4] rounded-full px-3 py-1">
                              <Users size={14} className="text-[#0D5229]" />
                              <span className="font-bold text-[#04330B] text-[14px]">{u._count?.recruits || 0}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[12px] font-bold border ${
                                u.role === "Admin"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : u.role.includes("President")
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : u.role === "CWCMember"
                                      ? "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]"
                                      : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              onChange={(e) => updateRole(u.id, e.target.value)}
                              disabled={!!busy[u.id] || !canEdit}
                              className="w-full h-[36px] rounded-[8px] border border-[#DDEEE4] px-3 font-semibold text-[#04330B] text-[13px] outline-none focus:border-[#10B981] disabled:opacity-50 cursor-pointer"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

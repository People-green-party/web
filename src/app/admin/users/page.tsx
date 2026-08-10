/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, MapPin, Search, ShieldAlert, Users } from "lucide-react";
import { ADMIN_API, getAdminScope, getAdminToken } from "@/lib/adminApi";

const API = ADMIN_API;
const PAGE_SIZE = 50;
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

function roleBadge(role: string) {
  if (role === "Admin") return "bg-red-50 text-red-700 border-red-200";
  if (role.includes("President")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (role === "CWCMember") return "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]";
  return "bg-gray-50 text-gray-600 border-gray-200";
}

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<Record<number, boolean>>({});

  const [accessGranted, setAccessGranted] = useState(false);
  const [accessScope, setAccessScope] = useState<"view" | "edit" | null>(null);

  const notify = (msg: string) => {
    if (typeof window !== "undefined") window.alert(msg);
  };

  const getAdminAccessHeader = (): Record<string, string> => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const load = useCallback(async (query: string, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAdminAccessHeader();
      const res = await fetch(
        `${API}/users/admin/users/search?q=${encodeURIComponent(query)}&take=${PAGE_SIZE}&page=${pageNum}`,
        { headers: { ...auth } }
      );
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Your admin access has expired. Please enter the password again.");
        }
        throw new Error(await res.text());
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
        setTotal(data.length);
        setPage(1);
        setPages(1);
      } else {
        setResults(Array.isArray(data.items) ? data.items : []);
        setTotal(Number(data.total) || 0);
        setPage(Number(data.page) || pageNum);
        setPages(Number(data.pages) || 1);
      }
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = () => {
    setPage(1);
    load(q, 1);
  };

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    setAccessGranted(true);
    setAccessScope(getAdminScope());
    sessionStorage.setItem("admin_users_access_granted", "1");
    const initialQ = new URLSearchParams(window.location.search).get("q") || "";
    if (initialQ) setQ(initialQ);
    load(initialQ, 1);
  }, [load]);

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(pages, next));
    setPage(clamped);
    load(q, clamped);
  };

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
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="w-full max-w-full min-w-0 font-['Familjen_Grotesk'] text-gray-800">
      {!accessGranted ? (
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-8 text-center">
          <p className="font-bold text-[#04330B]">Admin session required</p>
          <p className="mt-2 text-sm text-[#587E67] font-medium">
            Please sign in again at /admin/login to manage PGP members.
          </p>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-[28px] font-bold text-[#04330B] leading-tight">
                PGP Members
              </h2>
              <p className="text-[#587E67] font-semibold mt-1 text-sm">
                Search party members and manage leadership roles.
              </p>
            </div>
            <div
              className={`shrink-0 px-3 py-2 rounded-full text-[12px] font-bold border ${
                canEdit
                  ? "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              Access: {canEdit ? "Editor" : "View Only"}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 font-semibold text-sm">
              <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={18} />
              <span className="break-words">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 min-w-0">
              <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">Total Members</p>
              <p className="text-2xl font-bold text-[#04330B] mt-2">{total}</p>
              <p className="text-xs text-[#587E67] mt-1 font-medium">
                Showing {from}–{to}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 min-w-0">
              <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">
                Admins / Presidents (page)
              </p>
              <p className="text-2xl font-bold text-[#04330B] mt-2">
                {admins} / {presidents}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 min-w-0">
              <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">Recruits (page)</p>
              <p className="text-2xl font-bold text-[#04330B] mt-2">{totalRecruits}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E4F2EA]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-5 min-w-0">
                <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
                  Search Members
                </label>
                <div className="relative">
                  <input
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] pl-11 pr-4 font-semibold text-[#04330B] outline-none focus:border-[#10B981]"
                    placeholder="Name, phone, or PGP-ID…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                  />
                  <Search className="absolute left-4 top-3 text-[#587E67] w-5 h-5" />
                </div>
              </div>
              <div className="lg:col-span-5 min-w-0">
                <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
                  Reason for Role Change
                </label>
                <input
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#10B981]"
                  placeholder="Audit reason for role change"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={search}
                  className="w-full h-[46px] rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#0B5A2A] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {results.length === 0 ? (
              <div className="rounded-2xl border border-[#E4F2EA] bg-white p-8 text-center text-[#587E67] font-semibold text-sm">
                {loading ? "Loading data…" : "No members found."}
              </div>
            ) : (
              results.map((u) => (
                <article
                  key={u.id}
                  className="rounded-2xl border border-[#E4F2EA] bg-white p-4 shadow-sm space-y-3 min-w-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#04330B] text-base break-words">{u.name}</h3>
                      <p className="text-sm text-[#587E67] font-semibold break-all">{u.phone}</p>
                      <p className="text-xs text-[#587E67] mt-0.5">ID: {u.id}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-[#EAF7EE] text-[#0D5229] text-[11px] font-bold border border-[#B9D3C4]">
                        {u.memberId || "Pending"}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleBadge(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </div>

                  {u.localUnit ? (
                    <div className="flex items-start gap-1.5 text-sm text-[#04330B]">
                      <MapPin size={14} className="text-[#10B981] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold break-words">
                          {u.localUnit.name}{" "}
                          <span className="text-[#587E67] font-semibold text-xs">
                            ({u.localUnit.type})
                          </span>
                        </p>
                        <p className="text-xs text-[#587E67] font-semibold">
                          {u.localUnit.vidhansabha.name}, {u.localUnit.vidhansabha.loksabha.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 font-semibold">Location not set</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-[#04330B] font-semibold">
                      <Calendar size={14} className="text-[#587E67]" />
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#F1FBF6] border border-[#B9D3C4] rounded-full px-2.5 py-0.5">
                      <Users size={14} className="text-[#0D5229]" />
                      <span className="font-bold text-[#04330B]">{u._count?.recruits || 0}</span>
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#587E67] uppercase mb-1">
                      Change role
                    </label>
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      disabled={!!busy[u.id] || !canEdit}
                      className="w-full h-10 rounded-[8px] border border-[#DDEEE4] px-3 font-semibold text-[#04330B] text-sm outline-none focus:border-[#10B981] disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-[20px] shadow-sm border border-[#E4F2EA] overflow-hidden">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left border-collapse min-w-[980px]">
                <thead>
                  <tr className="bg-[#F1FBF6] border-b border-[#DDEEE4]">
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Member Details
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider text-center">
                      Recruits
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Change Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4F2EA]">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#587E67] font-semibold">
                        {loading ? "Loading data…" : "No members found."}
                      </td>
                    </tr>
                  ) : (
                    results.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAFCFB] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#04330B] text-[16px]">{u.name}</div>
                          <div className="text-[13px] text-[#587E67] font-semibold mt-0.5">
                            {u.phone}
                          </div>
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
                                <span className="text-[#587E67] font-semibold text-[12px]">
                                  ({u.localUnit.type})
                                </span>
                              </div>
                              <div className="pl-5 text-[12px] text-[#587E67] font-semibold leading-tight">
                                {u.localUnit.vidhansabha.name},
                                <br />
                                {u.localUnit.vidhansabha.loksabha.name}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-semibold text-[13px]">
                              Location not set
                            </span>
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
                            <span className="font-bold text-[#04330B] text-[14px]">
                              {u._count?.recruits || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[12px] font-bold border ${roleBadge(
                              u.role
                            )}`}
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

          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#E4F2EA] bg-white px-4 py-3">
              <p className="text-sm font-semibold text-[#587E67] text-center sm:text-left">
                {total.toLocaleString("en-IN")} members · Page {page} of {pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-[8px] border border-[#B9D3C4] text-sm font-semibold text-[#04330B] disabled:opacity-40 hover:bg-[#F8FBF9]"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= pages || loading}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-[8px] border border-[#B9D3C4] text-sm font-semibold text-[#04330B] disabled:opacity-40 hover:bg-[#F8FBF9]"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

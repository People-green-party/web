"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { ADMIN_API, getAdminToken } from "@/lib/adminApi";

const API = ADMIN_API;
const PAGE_SIZE = 50;

type YouthRow = {
  id: number;
  name: string;
  phone: string;
  memberId?: string;
  programTag?: string;
  youthAgeGroup?: string;
  memberType?: string;
  campusName?: string;
  registrationStatus?: string;
  createdAt: string;
};

function MembersInner() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [memberType, setMemberType] = useState("");
  const [results, setResults] = useState<YouthRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (query: string, pageNum: number, age: string, type: string) => {
      setLoading(true);
      setError(null);
      try {
        const token = getAdminToken();
        if (!token) throw new Error("Admin session required. Sign in at /admin/login.");
        const params = new URLSearchParams({
          segment: "youth",
          q: query,
          take: String(PAGE_SIZE),
          page: String(pageNum),
        });
        if (age) params.set("youthAgeGroup", age);
        if (type) params.set("memberType", type);

        const res = await fetch(`${API}/users/admin/users/search?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Your admin access has expired. Please enter the password again.");
          }
          throw new Error(await res.text());
        }
        const data = await res.json();
        setResults(Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : []);
        setTotal(Number(data.total) || (Array.isArray(data) ? data.length : 0));
        setPage(Number(data.page) || pageNum);
        setPages(Number(data.pages) || 1);
      } catch (e: any) {
        setError(e?.message || "Failed to load youth members");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const initialAge = searchParams.get("youthAgeGroup") || "";
    const initialType = searchParams.get("memberType") || "";
    const initialQ = searchParams.get("q") || "";
    setAgeGroup(initialAge);
    setMemberType(initialType);
    setQ(initialQ);
    load(initialQ, 1, initialAge, initialType);
  }, [searchParams, load]);

  const search = () => {
    setPage(1);
    load(q, 1, ageGroup, memberType);
  };

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(pages, next));
    setPage(clamped);
    load(q, clamped, ageGroup, memberType);
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const filterLabel =
    ageGroup === "16-17"
      ? "Age 16–17"
      : ageGroup === "18+"
        ? "Age 18+"
        : memberType === "student"
          ? "Students"
          : memberType === "professional"
            ? "Professionals"
            : memberType === "volunteer"
              ? "Volunteers"
              : "All Jinda Youth";

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 font-['Familjen_Grotesk'] text-[#04330B]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/admin/youth"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:underline mb-2"
          >
            <ArrowLeft size={14} /> Back to Youth dashboard
          </Link>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Users size={22} /> Jinda Youth Members
          </h2>
          <p className="mt-1 text-sm text-[#587E67] font-medium">
            {filterLabel} — {total} registered
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
          <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">Total in view</p>
          <p className="text-2xl font-black mt-2">{total}</p>
          <p className="text-xs text-[#587E67] mt-1 font-medium">
            Showing {from}–{to}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E4F2EA]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4 min-w-0">
            <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
              Search
            </label>
            <div className="relative">
              <input
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] pl-11 pr-4 font-semibold outline-none focus:border-[#10B981]"
                placeholder="Name, phone, or Member ID…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
              <Search className="absolute left-4 top-3 text-[#587E67] w-5 h-5" />
            </div>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
              Age group
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-3 font-semibold outline-none focus:border-[#10B981]"
            >
              <option value="">All ages</option>
              <option value="16-17">16–17</option>
              <option value="18+">18+</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
              Member type
            </label>
            <select
              value={memberType}
              onChange={(e) => setMemberType(e.target.value)}
              className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-3 font-semibold outline-none focus:border-[#10B981]"
            >
              <option value="">All types</option>
              <option value="student">Students</option>
              <option value="professional">Professionals</option>
              <option value="volunteer">Volunteers</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={search}
              className="w-full h-[46px] rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#0B5A2A] transition-colors"
              disabled={loading}
            >
              {loading ? "Loading…" : "Apply"}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-8 text-center text-[#587E67] font-semibold text-sm">
            {loading ? "Loading…" : "No youth members found."}
          </div>
        ) : (
          results.map((u) => (
            <article key={u.id} className="rounded-2xl border border-[#E4F2EA] bg-white p-4 space-y-2">
              <h3 className="font-bold break-words">{u.name?.trim() || "Name not provided"}</h3>
              <p className="text-sm text-[#587E67] font-semibold break-all">{u.phone}</p>
              <p className="text-xs text-[#587E67]">
                {u.youthAgeGroup || "—"} · {u.memberType || "—"}
                {u.campusName ? ` · ${u.campusName}` : ""}
              </p>
              <p className="text-xs font-semibold inline-flex items-center gap-1 text-[#04330B]">
                <Calendar size={12} />{" "}
                {new Date(u.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </article>
          ))
        )}
      </div>

      <div className="hidden lg:block bg-white rounded-[20px] shadow-sm border border-[#E4F2EA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F1FBF6] border-b border-[#DDEEE4]">
                <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Member</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Age</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Type</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Campus</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4F2EA]">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#587E67] font-semibold">
                    {loading ? "Loading…" : "No youth members found."}
                  </td>
                </tr>
              ) : (
                results.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAFCFB]">
                    <td className="px-6 py-4">
                      <div className="font-bold">{u.name?.trim() || "Name not provided"}</div>
                      <div className="text-[13px] text-[#587E67] font-semibold">{u.phone}</div>
                      <div className="text-[12px] text-[#587E67]">
                        {u.memberId || (u.registrationStatus === "pending" ? "Incomplete" : `ID ${u.id}`)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{u.youthAgeGroup || "—"}</td>
                    <td className="px-6 py-4 font-semibold">{u.memberType || "—"}</td>
                    <td className="px-6 py-4 font-semibold">{u.campusName || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-sm">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DDEEE4] font-bold text-sm disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <p className="text-sm font-semibold text-[#587E67]">
            Page {page} / {pages}
          </p>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= pages || loading}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DDEEE4] font-bold text-sm disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminYouthMembersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#587E67] font-semibold">Loading youth members…</div>
      }
    >
      <MembersInner />
    </Suspense>
  );
}

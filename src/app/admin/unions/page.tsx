"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";

type UnionStat = { unionName: string; count: number };
type UnionUser = {
  id: number;
  name: string;
  phone: string;
  memberId?: string;
  unionName?: string;
  vehicleNumber?: string;
  createdAt: string;
};

export default function AdminUnionsPage() {
  const [stats, setStats] = useState<UnionStat[]>([]);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<UnionUser[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [unionFilter, setUnionFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, listRes] = await Promise.all([
        adminFetch<{ total: number; unions: UnionStat[] }>("users/admin/unions/stats"),
        adminFetch<{ items: UnionUser[]; total: number; page: number; pages: number }>(
          `users/admin/users/search?segment=union&page=${page}&take=50&q=${encodeURIComponent(q)}${
            unionFilter !== "All" ? `&unionName=${encodeURIComponent(unionFilter)}` : ""
          }`
        ),
      ]);
      setStats(Array.isArray(statsRes?.unions) ? statsRes.unions : []);
      setTotal(Number(statsRes?.total) || 0);
      setItems(Array.isArray(listRes?.items) ? listRes.items : []);
      setPages(Number(listRes?.pages) || 1);
    } catch (e: any) {
      setError(e?.message || "Failed to load unions");
    } finally {
      setLoading(false);
    }
  }, [page, q, unionFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#04330B] flex items-center gap-2">
            <Building2 size={22} /> Unions
          </h2>
          <p className="text-sm text-[#587E67] font-medium">
            Workers registered via Union join — {total} total
          </p>
          <p className="text-[12px] text-amber-700 font-medium mt-2 max-w-2xl">
            Missing Member ID = registration not fully completed (ID is created only on final submit).
            Missing Vehicle = optional for that union / left blank on the form (not always required).
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setUnionFilter("All");
            setPage(1);
          }}
          className={`rounded-2xl border p-4 text-left transition-colors ${
            unionFilter === "All"
              ? "border-[#16A34A] bg-[#EAF7EE]"
              : "border-[#E4F2EA] bg-white hover:border-[#16A34A]"
          }`}
        >
          <p className="text-sm font-bold text-[#04330B]">Total Union Workers</p>
          <p className="mt-2 text-2xl font-black text-[#0D5229]">{total}</p>
          <p className="text-xs font-semibold text-[#587E67]">Click to see all members below</p>
        </button>
        {stats.map((u) => (
          <button
            key={u.unionName}
            type="button"
            onClick={() => {
              setUnionFilter(u.unionName);
              setPage(1);
            }}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              unionFilter === u.unionName
                ? "border-[#16A34A] bg-[#EAF7EE]"
                : "border-[#E4F2EA] bg-white hover:border-[#16A34A]"
            }`}
          >
            <p className="text-sm font-bold text-[#04330B] line-clamp-2">{u.unionName}</p>
            <p className="mt-2 text-2xl font-black text-[#0D5229]">{u.count}</p>
            <p className="text-xs font-semibold text-[#587E67]">Click to filter list</p>
          </button>
        ))}
        {!loading && stats.length === 0 ? (
          <p className="text-sm font-semibold text-[#94A3B8] sm:col-span-3">
            No union members yet. They appear when people join via /union/join.
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  load();
                }
              }}
              placeholder="Search name, phone, member ID, union…"
              className="w-full h-11 rounded-xl border border-[#DDEEE4] bg-[#F8FBF9] pl-9 pr-3 text-sm font-medium"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setUnionFilter("All");
              setPage(1);
            }}
            className="h-11 px-4 rounded-xl border border-[#DDEEE4] text-sm font-bold"
          >
            Clear union filter
          </button>
          <button
            type="button"
            onClick={() => {
              setPage(1);
              load();
            }}
            className="h-11 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center text-[#587E67] gap-2 font-semibold">
            <Loader2 className="animate-spin" size={18} /> Loading…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#587E67] border-b border-[#E4F2EA]">
                  <th className="py-2 pr-3 font-bold">ID</th>
                  <th className="py-2 pr-3 font-bold">Name</th>
                  <th className="py-2 pr-3 font-bold">Phone</th>
                  <th className="py-2 pr-3 font-bold">Member ID</th>
                  <th className="py-2 pr-3 font-bold">Union</th>
                  <th className="py-2 pr-3 font-bold">Vehicle</th>
                  <th className="py-2 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id} className="border-b border-[#F0F5F2]">
                    <td className="py-2.5 pr-3 font-semibold">#{u.id}</td>
                    <td className="py-2.5 pr-3 font-bold text-[#04330B]">{u.name}</td>
                    <td className="py-2.5 pr-3">{u.phone}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs">{u.memberId || "—"}</td>
                    <td className="py-2.5 pr-3 max-w-[220px]">{u.unionName || "—"}</td>
                    <td className="py-2.5 pr-3">{u.vehicleNumber || "—"}</td>
                    <td className="py-2.5 whitespace-nowrap text-[#587E67]">
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 ? (
              <p className="py-10 text-center text-sm font-semibold text-[#94A3B8]">No results</p>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-[#587E67]">
            Page {page} of {pages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 w-9 rounded-lg border border-[#DDEEE4] flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 w-9 rounded-lg border border-[#DDEEE4] flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

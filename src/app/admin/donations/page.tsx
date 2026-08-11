"use client";

import React, { useCallback, useEffect, useState } from "react";
import { HandCoins, Loader2, Search } from "lucide-react";
import { adminFetch, getAdminScope } from "@/lib/adminApi";

type Donation = {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
  amount: number;
  pan?: string | null;
  city?: string | null;
  state?: string | null;
  status: string;
  isExistingMember: boolean;
  createdAt: string;
  notes?: string | null;
};

const STATUSES = ["All", "pending", "reviewed", "confirmed", "rejected"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-sky-50 text-sky-700",
  reviewed: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function AdminDonationsPage() {
  const [items, setItems] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [confirmedSum, setConfirmedSum] = useState(0);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const canEdit = getAdminScope() === "edit";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const statusParam = filter === "All" ? "" : `&status=${filter}`;
      const data = await adminFetch<{
        items: Donation[];
        total: number;
        confirmedAmountSum: number;
      }>(`admin/donations?page=1&limit=50&q=${encodeURIComponent(q)}${statusParam}`);
      setItems(Array.isArray(data?.items) ? data.items : []);
      setTotal(Number(data?.total) || 0);
      setConfirmedSum(Number(data?.confirmedAmountSum) || 0);
    } catch (e: any) {
      setError(e?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }, [filter, q]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: number, status: string) => {
    if (!canEdit) return;
    setBusyId(id);
    try {
      await adminFetch(`admin/donations/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e: any) {
      alert(e?.message || "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#04330B] flex items-center gap-2">
            <HandCoins size={22} /> Donations
          </h2>
          <p className="text-sm text-[#587E67] font-medium">
            Form submissions from /donation · {total} records · Confirmed ₹
            {confirmedSum.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                filter === s
                  ? "bg-[#04330B] text-white"
                  : "bg-white text-[#04330B] border border-[#DDEEE4]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search name, phone, PAN…"
            className="w-full h-10 rounded-xl border border-[#DDEEE4] bg-white pl-9 pr-3 text-sm font-medium"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E4F2EA] bg-white overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center text-[#587E67] gap-2 font-semibold">
            <Loader2 className="animate-spin" size={18} /> Loading…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#587E67] border-b border-[#E4F2EA] bg-[#F8FBF9]">
                  <th className="py-3 px-4 font-bold">ID</th>
                  <th className="py-3 px-4 font-bold">Donor</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">City</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  {canEdit ? <th className="py-3 px-4 font-bold">Action</th> : null}
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.id} className="border-b border-[#F0F5F2]">
                    <td className="py-3 px-4 font-semibold">#{d.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#04330B]">{d.fullName}</p>
                      <p className="text-xs text-[#587E67]">{d.phone}</p>
                      {d.email ? <p className="text-xs text-[#94A3B8]">{d.email}</p> : null}
                    </td>
                    <td className="py-3 px-4 font-black text-[#0D5229]">
                      ₹{Number(d.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      {[d.city, d.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          STATUS_STYLE[d.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#587E67]">
                      {new Date(d.createdAt).toLocaleString("en-IN")}
                    </td>
                    {canEdit ? (
                      <td className="py-3 px-4">
                        <select
                          disabled={busyId === d.id}
                          value={d.status}
                          onChange={(e) => updateStatus(d.id, e.target.value)}
                          className="h-9 rounded-lg border border-[#DDEEE4] px-2 text-xs font-bold"
                        >
                          {STATUSES.filter((s) => s !== "All").map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 ? (
              <p className="py-12 text-center text-sm font-semibold text-[#94A3B8]">
                No donations yet. Submissions from the public donation form will show here.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

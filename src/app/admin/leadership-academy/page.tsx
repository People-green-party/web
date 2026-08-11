"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { adminFetch, getAdminToken } from "@/lib/adminApi";

type Application = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  college: string | null;
  department: string;
  mode: string;
  motivation: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["pending", "reviewed", "accepted", "rejected", "waitlisted"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-sky-50 text-sky-700",
  reviewed: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  waitlisted: "bg-purple-50 text-purple-700",
};

export default function AdminLeadershipAcademyPage() {
  const router = useRouter();
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!getAdminToken()) {
        router.replace("/admin/login");
        return;
      }
      // Always load full list so status cards show true portal totals
      const data = await adminFetch<Application[]>(`leadership-academy/applications`);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const initialQ = new URLSearchParams(window.location.search).get("q") || "";
    if (initialQ) setSearch(initialQ);
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((a) => {
      if (filter !== "All" && a.status !== filter) return false;
      if (!q) return true;
      return [a.fullName, a.email, a.phone, a.city, a.department, a.college || ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, search, filter]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await adminFetch(`leadership-academy/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      showToast(`#${id} → ${status}`);
      await load();
    } catch (e: any) {
      showToast(e.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#04330B]">Internship Applications</h2>
        <p className="text-sm text-[#587E67] font-medium">
          All internship applicants — click a status card to filter the list below.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: "All", label: "Total Applications", count: items.length },
          ...STATUSES.map((s) => ({
            key: s,
            label: s,
            count: items.filter((a) => a.status === s).length,
          })),
        ].map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => setFilter(card.key)}
            className={`rounded-2xl border p-4 text-left transition-colors capitalize ${
              filter === card.key
                ? "border-[#16A34A] bg-[#EAF7EE]"
                : "border-[#E4F2EA] bg-white hover:border-[#16A34A]"
            }`}
          >
            <p className="text-[11px] font-bold text-[#587E67] uppercase tracking-wide">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-black text-[#0D5229]">{card.count}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          {["All", ...STATUSES].map((s) => (
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email…"
            className="w-full h-10 rounded-xl border border-[#DDEEE4] bg-white pl-9 pr-3 text-sm font-medium outline-none focus:border-[#16A34A]"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-semibold">
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-[#E4F2EA] bg-white shadow-sm overflow-hidden w-full max-w-full min-w-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#587E67] gap-2 font-semibold">
            <Loader2 className="animate-spin" size={18} /> Loading applications…
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-[#587E67] font-semibold">No applications found.</p>
        ) : (
          <div className="overflow-x-auto w-full max-w-full overscroll-x-contain">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-[#F8FBF9] border-b border-[#E4F2EA] text-[11px] uppercase tracking-wide text-[#587E67]">
                <tr>
                  <th className="px-4 py-3 font-bold">Applicant</th>
                  <th className="px-4 py-3 font-bold">Department</th>
                  <th className="px-4 py-3 font-bold">Mode</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Applied</th>
                  <th className="px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-[#F0F5F2] align-top">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#EAF7EE] text-[#04330B] flex items-center justify-center text-sm font-black shrink-0">
                          {app.fullName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#04330B]">
                            #{app.id} · {app.fullName}
                          </p>
                          <p className="text-xs text-[#587E67] font-medium truncate">
                            {app.email} · {app.phone}
                          </p>
                          <p className="text-xs text-[#94A3B8] font-medium">
                            {app.city}
                            {app.college ? ` · ${app.college}` : ""}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-[#587E67] line-clamp-2 max-w-md">
                        {app.motivation}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#04330B]">
                      {app.department}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-[#F0F5F2] px-2.5 py-1 text-[11px] font-bold capitalize text-[#04330B]">
                        {app.mode}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          STATUS_STYLE[app.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-[#587E67] whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={updatingId === app.id || app.status === s}
                            onClick={() => updateStatus(app.id, s)}
                            className="px-2 py-1 rounded-md text-[10px] font-bold border border-[#DDEEE4] bg-[#F8FBF9] text-[#04330B] hover:bg-[#EAF7EE] disabled:opacity-40 capitalize"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast ? (
        <div className="fixed bottom-5 right-5 bg-[#04330B] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

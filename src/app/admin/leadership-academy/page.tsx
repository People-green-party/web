"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, RefreshCw, ChevronLeft } from "lucide-react";

function normalizeApiBaseUrl(baseUrl: string) {
  const cleaned = String(baseUrl || "").replace(/\/$/, "");
  if (!cleaned) return "http://localhost:3002/v1";
  if (cleaned.endsWith("/v1")) return cleaned;
  return `${cleaned}/v1`;
}

const API = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002");

async function adminFetch(path: string, opts: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || sessionStorage.getItem("admin_access_token")
      : null;
  const res = await fetch(`${API}/${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

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
  pending: "bg-yellow-50 text-yellow-800",
  reviewed: "bg-blue-50 text-blue-800",
  accepted: "bg-green-50 text-green-800",
  rejected: "bg-red-50 text-red-800",
  waitlisted: "bg-purple-50 text-purple-800",
};

export default function AdminLeadershipAcademyPage() {
  const router = useRouter();
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
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
      const token = localStorage.getItem("adminToken") || sessionStorage.getItem("admin_access_token");
      if (!token) {
        router.replace("/admin/login");
        return;
      }
      const q = filter !== "All" ? `?status=${filter}` : "";
      const data = await adminFetch(`leadership-academy/applications${q}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    load();
  }, [load]);

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
    <div className="min-h-screen bg-[#F0FBF4]">
      <div className="bg-[#04330B] text-white px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-[#86EFAC] hover:text-white">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <p className="text-xs font-bold tracking-widest text-[#86EFAC] uppercase">Admin</p>
            <h1 className="text-xl font-black mt-0.5 flex items-center gap-2">
              <GraduationCap size={20} /> Internship
            </h1>
          </div>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm text-[#86EFAC] hover:text-white"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-5">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                filter === s ? "bg-[#04330B] text-white" : "bg-white text-[#04330B] border border-[#DDEEE4]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-semibold mb-4">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#587E67] gap-2 font-semibold">
            <Loader2 className="animate-spin" size={18} /> Loading applications…
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-16 text-[#587E67] font-semibold">No applications found.</p>
        ) : (
          <div className="space-y-3">
            {items.map((app) => (
              <article
                key={app.id}
                className="bg-white border border-[#DDEEE4] rounded-xl p-4 sm:p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-[#04330B] text-lg">
                        #{app.id} · {app.fullName}
                      </h2>
                      <span
                        className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          STATUS_STYLE[app.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#587E67]">
                      {app.email} · {app.phone} · {app.city}
                      {app.college ? ` · ${app.college}` : ""}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#04330B]">
                      {app.department} · {app.mode}
                    </p>
                    <p className="mt-2 text-sm text-[#587E67] line-clamp-3">{app.motivation}</p>
                    <p className="mt-2 text-xs text-[#94A3B8]">
                      {new Date(app.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={updatingId === app.id || app.status === s}
                        onClick={() => updateStatus(app.id, s)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-[#DDEEE4] bg-[#F8FBF9] text-[#04330B] hover:bg-[#EAF7EE] disabled:opacity-40 capitalize"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {toast ? (
        <div className="fixed bottom-5 right-5 bg-[#04330B] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

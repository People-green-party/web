"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "../../../../components/Navbar";
import {
  CheckCircle2, XCircle, Flag, Zap, RefreshCw, Users,
  ChevronLeft, ChevronRight, AlertTriangle, ShieldOff,
} from "lucide-react";

function normalizeApiBaseUrl(baseUrl: string) {
  const cleaned = String(baseUrl || "").replace(/\/$/, "");
  if (!cleaned) return "http://localhost:3002/v1";
  if (cleaned.endsWith("/v1")) return cleaned;
  return `${cleaned}/v1`;
}

const API = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002");

async function adminFetch(path: string, opts: RequestInit = {}) {
  const token = typeof window !== "undefined"
    ? (localStorage.getItem("adminToken") || sessionStorage.getItem("admin_access_token"))
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

const SQUAD_RANK_EMOJI: Record<string, string> = {
  "Bronze Squad":  "🥉",
  "Silver Squad":  "🥈",
  "Gold Squad":    "🥇",
  "Diamond Squad": "💎",
};

const STATUS_UI: Record<string, { label: string; color: string; bg: string }> = {
  New:                 { label: "Forming",      color: "text-yellow-700", bg: "bg-yellow-50" },
  PendingVerification: { label: "Pending",       color: "text-blue-700",   bg: "bg-blue-50" },
  Active:              { label: "Active",        color: "text-green-700",  bg: "bg-green-50" },
  Inactive:            { label: "Inactive",      color: "text-gray-500",   bg: "bg-gray-50" },
  Flagged:             { label: "Flagged",       color: "text-red-700",    bg: "bg-red-50" },
  Rejected:            { label: "Rejected",      color: "text-red-700",    bg: "bg-red-50" },
};

const STATUS_FILTERS = ["All", "New", "PendingVerification", "Active", "Flagged", "Rejected"];

type Squad = {
  id: number; name: string; squadType: string; district: string;
  locality: string; purpose: string; status: string; squadXp: number;
  squadRank: string; memberCount: number; captainName: string | null;
  createdAt: string; approvedAt: string | null;
};

export default function AdminSquadsPage() {
  const [squads, setSquads]       = useState<Squad[]>([]);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filterStatus, setFilterStatus] = useState("New");
  const [filterDistrict, setFilterDistrict] = useState("");

  const [rejectTarget, setRejectTarget]  = useState<Squad | null>(null);
  const [rejectReason, setRejectReason]  = useState("");
  const [flagTarget, setFlagTarget]      = useState<Squad | null>(null);
  const [flagReason, setFlagReason]      = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (filterStatus !== "All") params.set("status", filterStatus);
      if (filterDistrict) params.set("district", filterDistrict);
      const data = await adminFetch(`admin/youth/squads?${params}`);
      setSquads(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterDistrict]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await adminFetch(`admin/youth/squads/${id}/approve`, { method: "POST" });
      showToast("✓ Squad approved — 500 XP awarded to leader");
      load();
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setActionLoading(rejectTarget.id);
    try {
      await adminFetch(`admin/youth/squads/${rejectTarget.id}/reject`, {
        method: "POST", body: JSON.stringify({ reason: rejectReason }),
      });
      showToast("Squad rejected");
      setRejectTarget(null); setRejectReason(""); load();
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleFlag = async () => {
    if (!flagTarget || !flagReason.trim()) return;
    setActionLoading(flagTarget.id);
    try {
      await adminFetch(`admin/youth/squads/${flagTarget.id}/flag`, {
        method: "POST", body: JSON.stringify({ reason: flagReason }),
      });
      showToast("Squad flagged");
      setFlagTarget(null); setFlagReason(""); load();
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleFreezeXp = async (id: number) => {
    setActionLoading(id);
    try {
      await adminFetch(`admin/youth/squads/${id}/freeze-xp`, { method: "POST" });
      showToast("Squad XP frozen");
      load();
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="min-h-screen bg-[#F5FBF7] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />

      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-[#04330B] text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg">{toast}</div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-[#04330B] mb-1">Reject Squad</h3>
            <p className="text-sm text-gray-500 mb-1">{rejectTarget.name}</p>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#04330B] mt-3"
              rows={3} placeholder="Reason for rejection..."
              value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleReject} disabled={!rejectReason.trim()} className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-700 disabled:opacity-50">
                Confirm Reject
              </button>
              <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Flag modal */}
      {flagTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-[#04330B] mb-1">Flag Squad</h3>
            <p className="text-sm text-gray-500 mb-1">{flagTarget.name}</p>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#04330B] mt-3"
              rows={3} placeholder="Reason for flagging..."
              value={flagReason} onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleFlag} disabled={!flagReason.trim()} className="flex-1 bg-orange-500 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-orange-600 disabled:opacity-50">
                Confirm Flag
              </button>
              <button onClick={() => { setFlagTarget(null); setFlagReason(""); }} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#04330B]">Squad Management</h1>
            <p className="text-sm text-[#587E67] mt-0.5">{total} squads</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm font-bold text-[#587E67] hover:text-[#04330B]">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#BBF7D0] p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-bold text-[#587E67] block mb-1">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filterStatus === s ? "bg-[#04330B] text-white" : "border border-gray-200 text-[#587E67] hover:border-[#04330B]"
                  }`}
                >
                  {s === "PendingVerification" ? "Pending" : s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#587E67] block mb-1">District</label>
            <input
              type="text" placeholder="e.g. Jaipur" value={filterDistrict}
              onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#04330B] w-36"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[#587E67] font-semibold">Loading squads...</div>
        ) : squads.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No squads match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {squads.map((sq) => {
              const sc = STATUS_UI[sq.status] || { label: sq.status, color: "text-gray-500", bg: "bg-gray-50" };
              const rankEmoji = SQUAD_RANK_EMOJI[sq.squadRank] || "🥉";
              return (
                <div key={sq.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#BBF7D0] transition-all">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-[#04330B] text-base">{sq.name}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-[#587E67] mb-2">
                        {sq.district && <span>📍 {sq.district}</span>}
                        {sq.squadType && <span>{sq.squadType}</span>}
                        <span><Users size={10} className="inline mr-0.5" />{sq.memberCount} members</span>
                        <span>{rankEmoji} {sq.squadRank} · {sq.squadXp} XP</span>
                        {sq.captainName && <span>Leader: {sq.captainName}</span>}
                      </div>
                      {sq.purpose && <p className="text-xs text-[#587E67] line-clamp-2">{sq.purpose}</p>}
                    </div>

                    <div className="flex flex-col gap-2 items-end shrink-0">
                      {(sq.status === "New" || sq.status === "PendingVerification") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(sq.id)}
                            disabled={actionLoading === sq.id}
                            className="flex items-center gap-1.5 bg-[#04330B] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#16A34A] disabled:opacity-50"
                          >
                            <CheckCircle2 size={12} /> {actionLoading === sq.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => setRejectTarget(sq)}
                            className="flex items-center gap-1.5 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {sq.status !== "Flagged" && (
                          <button
                            onClick={() => setFlagTarget(sq)}
                            className="flex items-center gap-1.5 border border-orange-200 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-50"
                          >
                            <Flag size={12} /> Flag
                          </button>
                        )}
                        <button
                          onClick={() => handleFreezeXp(sq.id)}
                          disabled={actionLoading === sq.id}
                          className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ShieldOff size={12} /> Freeze XP
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Created {new Date(sq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold disabled:opacity-40">
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-sm text-gray-500 font-semibold">Page {page} of {pages}</span>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold disabled:opacity-40">
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

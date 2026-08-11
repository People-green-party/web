"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2, XCircle, Flag, Users,
  ChevronLeft, ChevronRight, AlertTriangle, ShieldOff,
} from "lucide-react";
import { adminFetch } from "@/lib/adminApi";

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
    <div className="w-full max-w-full min-w-0 space-y-5 font-['Familjen_Grotesk']">
      {toast ? (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-[#04330B] px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      {rejectTarget ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-[#04330B] mb-1">Reject Squad</h3>
            <p className="text-sm text-[#587E67] mb-1">{rejectTarget.name}</p>
            <textarea
              className="w-full border border-[#DDEEE4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#04330B] mt-3"
              rows={3}
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
              <button
                type="button"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
                className="flex-1 border border-[#DDEEE4] rounded-xl py-2.5 text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {flagTarget ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-[#04330B] mb-1">Flag Squad</h3>
            <p className="text-sm text-[#587E67] mb-1">{flagTarget.name}</p>
            <textarea
              className="w-full border border-[#DDEEE4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#04330B] mt-3"
              rows={3}
              placeholder="Reason for flagging..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleFlag}
                disabled={!flagReason.trim()}
                className="flex-1 bg-orange-500 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-orange-600 disabled:opacity-50"
              >
                Confirm Flag
              </button>
              <button
                type="button"
                onClick={() => {
                  setFlagTarget(null);
                  setFlagReason("");
                }}
                className="flex-1 border border-[#DDEEE4] rounded-xl py-2.5 text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="text-2xl font-black text-[#04330B]">Squads</h2>
        <p className="text-sm text-[#587E67] font-medium">{total} squads · approve, reject or flag</p>
      </div>

      <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 shadow-sm flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-bold text-[#587E67] block mb-1">Status</label>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setFilterStatus(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filterStatus === s
                    ? "bg-[#04330B] text-white"
                    : "border border-[#DDEEE4] text-[#587E67] hover:border-[#04330B]"
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
            type="text"
            placeholder="e.g. Jaipur"
            value={filterDistrict}
            onChange={(e) => {
              setFilterDistrict(e.target.value);
              setPage(1);
            }}
            className="border border-[#DDEEE4] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#04330B] w-36"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-[#E4F2EA] bg-white shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-[#587E67] font-semibold">Loading squads…</p>
        ) : squads.length === 0 ? (
          <div className="text-center py-16 text-[#94A3B8]">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No squads match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0F5F2]">
            {squads.map((sq) => {
              const sc = STATUS_UI[sq.status] || { label: sq.status, color: "text-gray-500", bg: "bg-gray-50" };
              const rankEmoji = SQUAD_RANK_EMOJI[sq.squadRank] || "🥉";
              return (
                <article key={sq.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-[#04330B] text-base">{sq.name}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-[#587E67] font-medium mb-2">
                        {sq.district ? <span>{sq.district}</span> : null}
                        {sq.squadType ? <span>{sq.squadType}</span> : null}
                        <span>
                          <Users size={10} className="inline mr-0.5" />
                          {sq.memberCount} members
                        </span>
                        <span>
                          {rankEmoji} {sq.squadRank} · {sq.squadXp} XP
                        </span>
                        {sq.captainName ? <span>Leader: {sq.captainName}</span> : null}
                      </div>
                      {sq.purpose ? (
                        <p className="text-xs text-[#587E67] line-clamp-2">{sq.purpose}</p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2 items-end shrink-0">
                      {(sq.status === "New" || sq.status === "PendingVerification") && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(sq.id)}
                            disabled={actionLoading === sq.id}
                            className="flex items-center gap-1.5 bg-[#04330B] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#16A34A] disabled:opacity-50"
                          >
                            <CheckCircle2 size={12} /> {actionLoading === sq.id ? "…" : "Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectTarget(sq)}
                            className="flex items-center gap-1.5 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {sq.status !== "Flagged" ? (
                          <button
                            type="button"
                            onClick={() => setFlagTarget(sq)}
                            className="flex items-center gap-1.5 border border-orange-200 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-50"
                          >
                            <Flag size={12} /> Flag
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleFreezeXp(sq.id)}
                          disabled={actionLoading === sq.id}
                          className="flex items-center gap-1.5 border border-[#DDEEE4] text-[#587E67] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#F8FBF9] disabled:opacity-50"
                        >
                          <ShieldOff size={12} /> Freeze XP
                        </button>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] font-medium">
                        Created{" "}
                        {new Date(sq.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {pages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[#DDEEE4] text-sm font-bold disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-[#587E67] font-semibold">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[#DDEEE4] text-sm font-bold disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

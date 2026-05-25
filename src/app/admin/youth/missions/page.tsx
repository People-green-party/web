"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "../../../../components/Navbar";
import {
  CheckCircle2, XCircle, Clock, Filter, RefreshCw, ExternalLink,
  ChevronLeft, ChevronRight, Shield, Zap, AlertTriangle, Image as ImageIcon,
} from "lucide-react";

function normalizeApiBaseUrl(baseUrl: string) {
  const cleaned = String(baseUrl || "").replace(/\/$/, "");
  if (!cleaned) return "http://localhost:3002/v1";
  if (cleaned.endsWith("/v1")) return cleaned;
  return `${cleaned}/v1`;
}

const API = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002");

async function adminFetch(path: string, opts: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  assigned:   { label: "Not started", color: "text-gray-500",  bg: "bg-gray-100",   icon: <Clock size={12} /> },
  inprogress: { label: "In progress", color: "text-yellow-600", bg: "bg-yellow-50",  icon: <Zap size={12} /> },
  submitted:  { label: "Submitted",   color: "text-blue-600",  bg: "bg-blue-50",    icon: <Clock size={12} /> },
  completed:  { label: "Completed",   color: "text-green-600", bg: "bg-green-50",   icon: <CheckCircle2 size={12} /> },
  approved:   { label: "Approved",    color: "text-green-700", bg: "bg-green-100",  icon: <CheckCircle2 size={12} /> },
  rejected:   { label: "Rejected",    color: "text-red-600",   bg: "bg-red-50",     icon: <XCircle size={12} /> },
};

const MISSION_TYPES = ["All", "Onboarding", "Daily", "Campaign", "Weekly", "Squad"];
const STATUSES      = ["All", "submitted", "approved", "rejected", "completed"];

type Submission = {
  userMissionId: number;
  memberId: number;
  memberName: string;
  memberPhone: string;
  jindaId: string;
  district: string;
  missionTitle: string;
  missionType: string;
  xpReward: number;
  status: string;
  proofUrl: string | null;
  rejectionReason: string | null;
  completedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
};

export default function AdminMissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [filterStatus,  setFilterStatus]  = useState("submitted");
  const [filterType,    setFilterType]    = useState("All");
  const [filterDistrict,setFilterDistrict]= useState("");
  const [filterMember,  setFilterMember]  = useState("");

  const [rejectTarget, setRejectTarget]   = useState<number | null>(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (filterStatus !== "All") params.set("status", filterStatus);
      if (filterType   !== "All") params.set("missionType", filterType);
      if (filterDistrict)         params.set("district", filterDistrict);
      if (filterMember)           params.set("memberId", filterMember);

      const data = await adminFetch(`admin/youth/mission-submissions?${params}`);
      setSubmissions(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterType, filterDistrict, filterMember]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await adminFetch(`admin/youth/mission-submissions/${id}/approve`, { method: "POST" });
      showToast(`✓ Approved — ${res.xpAwarded} XP awarded`);
      load();
    } catch (e: any) {
      showToast(`✗ ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setActionLoading(rejectTarget);
    try {
      await adminFetch(`admin/youth/mission-submissions/${rejectTarget}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason }),
      });
      showToast("Rejected with reason saved");
      setRejectTarget(null);
      setRejectReason("");
      load();
    } catch (e: any) {
      showToast(`✗ ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "submitted").length;

  return (
    <div className="min-h-screen bg-[#F5FBF7] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-[#04330B] text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg">
          {toast}
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-[#04330B] mb-1">Reject Submission</h3>
            <p className="text-sm text-gray-500 mb-4">The member will see this reason on their dashboard.</p>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#04330B]"
              rows={3}
              placeholder="e.g. Proof image is unclear. Please resubmit with a clearer photo."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === rejectTarget}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === rejectTarget ? "Rejecting..." : "Confirm Reject"}
              </button>
              <button
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#04330B]">Mission Submissions</h1>
            <p className="text-sm text-[#587E67] mt-0.5">{total} total · {pendingCount} pending review</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm font-bold text-[#587E67] hover:text-[#04330B]">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#BBF7D0] p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-bold text-[#587E67] block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#04330B]"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#587E67] block mb-1">Mission Type</label>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#04330B]"
            >
              {MISSION_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#587E67] block mb-1">District</label>
            <input
              type="text"
              placeholder="e.g. Jaipur"
              value={filterDistrict}
              onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#04330B] w-32"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#587E67] block mb-1">Member ID</label>
            <input
              type="number"
              placeholder="ID"
              value={filterMember}
              onChange={(e) => { setFilterMember(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#04330B] w-24"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[#587E67] font-semibold">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <CheckCircle2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No submissions match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => {
              const sc = STATUS_CONFIG[s.status] || STATUS_CONFIG.assigned;
              return (
                <div key={s.userMissionId} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#BBF7D0] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: member + mission info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-[#04330B]">{s.memberName || `Member #${s.memberId}`}</span>
                        {s.jindaId && (
                          <span className="text-[10px] font-mono bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">{s.jindaId}</span>
                        )}
                        {s.district && (
                          <span className="text-[10px] text-gray-400 font-semibold">{s.district}</span>
                        )}
                        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{s.missionTitle}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-400">{s.missionType}</span>
                        <span className="text-xs font-bold text-[#16A34A]">+{s.xpReward} XP</span>
                        <span className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                      {s.rejectionReason && (
                        <div className="mt-2 text-xs text-red-600 font-semibold bg-red-50 rounded-lg px-3 py-1.5 inline-block">
                          Rejected: {s.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Right: proof + actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {s.proofUrl ? (
                        <a
                          href={s.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg"
                        >
                          <ImageIcon size={12} /> View Proof <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No proof attached</span>
                      )}

                      {s.status === "submitted" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(s.userMissionId)}
                            disabled={actionLoading === s.userMissionId}
                            className="flex items-center gap-1.5 bg-[#04330B] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#16A34A] disabled:opacity-50 transition-colors"
                          >
                            <CheckCircle2 size={12} />
                            {actionLoading === s.userMissionId ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => setRejectTarget(s.userMissionId)}
                            disabled={actionLoading === s.userMissionId}
                            className="flex items-center gap-1.5 border border-red-300 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      )}

                      {s.status === "approved" && s.approvedAt && (
                        <span className="text-[10px] text-green-600 font-semibold">
                          Approved {new Date(s.approvedAt).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold disabled:opacity-40 hover:border-[#04330B]"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-sm text-gray-500 font-semibold">Page {page} of {pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold disabled:opacity-40 hover:border-[#04330B]"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

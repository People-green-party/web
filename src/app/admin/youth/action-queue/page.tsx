"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  Loader2,
  XCircle,
} from "lucide-react";
import { adminFetch, getAdminScope } from "@/lib/adminApi";

type Issue = {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  priority?: string;
  urgency?: string;
  createdAt?: string;
  location?: string;
  district?: string;
  ward?: string;
  village?: string;
  locality?: string;
  trustScore?: number;
  proofUrl?: string | null;
};

type ActionQueue = {
  p0Issues?: Issue[];
  p1Issues?: Issue[];
  highDuplicateIssues?: Issue[];
  sensitiveIssues?: Issue[];
  followUpOverdue?: Issue[];
};

type TabId = "p0" | "p1" | "recent" | "sensitive" | "overdue";

export default function AdminActionQueuePage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [queue, setQueue] = useState<ActionQueue | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("p0");
  const [canEdit, setCanEdit] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchQueue = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<ActionQueue>("admin/youth/action-queue");
      setQueue(data || {});
    } catch (e: any) {
      setError(e?.message || "Failed to load action queue");
      setQueue(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCanEdit(getAdminScope() === "edit");
    fetchQueue();
  }, []);

  const reviewIssue = async (issueId: number, status: string, label: string) => {
    if (!canEdit) {
      showToast("View-only access — use editor password to review");
      return;
    }
    setBusyId(issueId);
    setError("");
    try {
      await adminFetch(`admin/youth/issues/${issueId}/review`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      showToast(`${label} · #${issueId}`);
      await fetchQueue();
    } catch (e: any) {
      setError(e?.message || "Failed to review issue");
    } finally {
      setBusyId(null);
    }
  };

  const tabs = [
    { id: "p0" as const, label: "P0 Emergency", icon: AlertTriangle, count: queue?.p0Issues?.length || 0 },
    { id: "p1" as const, label: "P1 High Priority", icon: Clock, count: queue?.p1Issues?.length || 0 },
    { id: "recent" as const, label: "High Duplicate", icon: FileText, count: queue?.highDuplicateIssues?.length || 0 },
    { id: "sensitive" as const, label: "Sensitive Issues", icon: Flag, count: queue?.sensitiveIssues?.length || 0 },
    { id: "overdue" as const, label: "Overdue Follow-ups", icon: Clock, count: queue?.followUpOverdue?.length || 0 },
  ];

  const currentIssues = (() => {
    switch (activeTab) {
      case "p0":
        return queue?.p0Issues || [];
      case "p1":
        return queue?.p1Issues || [];
      case "recent":
        return queue?.highDuplicateIssues || [];
      case "sensitive":
        return queue?.sensitiveIssues || [];
      case "overdue":
        return queue?.followUpOverdue || [];
      default:
        return [];
    }
  })();

  const actionsForTab = (issue: Issue) => {
    const disabled = busyId === issue.id || !canEdit;
    const btn = (label: string, status: string, className: string, icon?: React.ReactNode) => (
      <button
        key={status + label}
        type="button"
        disabled={disabled}
        onClick={() => reviewIssue(issue.id, status, label)}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-50 ${className}`}
      >
        {icon}
        {busyId === issue.id ? "…" : label}
      </button>
    );

    if (activeTab === "recent") {
      return (
        <>
          {btn("Mark Duplicate", "DuplicateMerged", "bg-amber-600 hover:bg-amber-700")}
          {btn("Verify", "HumanVerified", "bg-green-600 hover:bg-green-700", <CheckCircle2 size={14} />)}
        </>
      );
    }
    if (activeTab === "sensitive") {
      return (
        <>
          {btn("Verify", "HumanVerified", "bg-green-600 hover:bg-green-700", <CheckCircle2 size={14} />)}
          {btn("Escalate", "Escalated", "bg-violet-600 hover:bg-violet-700")}
        </>
      );
    }
    if (activeTab === "overdue") {
      return (
        <>
          {btn("Verify", "HumanVerified", "bg-green-600 hover:bg-green-700", <CheckCircle2 size={14} />)}
          {btn("Escalate", "Escalated", "bg-violet-600 hover:bg-violet-700")}
          {btn("Reject", "Rejected", "bg-red-600 hover:bg-red-700", <XCircle size={14} />)}
        </>
      );
    }
    // p0 / p1
    return (
      <>
        {btn("Verify", "HumanVerified", "bg-green-600 hover:bg-green-700", <CheckCircle2 size={14} />)}
        {btn("Reject", "Rejected", "bg-red-600 hover:bg-red-700", <XCircle size={14} />)}
      </>
    );
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 font-['Familjen_Grotesk']">
      {toast ? (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-[#04330B] px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#04330B]">Action Queue</h2>
          <p className="text-sm text-[#587E67] font-medium">
            Review Zinda Youth issues that need PGP ops attention.
          </p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${
            canEdit
              ? "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {canEdit ? "Editor" : "View only"}
        </span>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="-mx-1 px-1 overflow-x-auto overscroll-x-contain">
        <div className="flex w-max min-w-full gap-2 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#04330B] text-white"
                    : "bg-white border border-[#DDEEE4] text-[#04330B] hover:bg-[#EAF7EE]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px]">{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E4F2EA] bg-white shadow-sm overflow-hidden">
        {loading && !queue ? (
          <div className="flex items-center justify-center py-20 text-[#587E67] gap-2 font-semibold">
            <Loader2 className="animate-spin" size={18} /> Loading live queue…
          </div>
        ) : currentIssues.length === 0 ? (
          <p className="text-center py-16 text-[#587E67] font-semibold">No issues in this queue.</p>
        ) : (
          <div className="divide-y divide-[#F0F5F2]">
            {currentIssues.map((issue) => (
              <article key={issue.id} className="px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#04330B]">
                      #{issue.id} · {issue.title || "Untitled issue"}
                    </h3>
                    <p className="mt-1 text-sm text-[#587E67] font-medium line-clamp-2">
                      {issue.description || "No description"}
                    </p>
                    <p className="mt-2 text-xs text-[#94A3B8] font-semibold">
                      {[issue.category, issue.priority || issue.urgency, issue.district || issue.location]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-[#587E67] font-medium max-w-lg">
                      {issue.ward ? <span>Ward: {issue.ward}</span> : null}
                      {issue.village ? <span>Village: {issue.village}</span> : null}
                      {issue.locality ? <span>Locality: {issue.locality}</span> : null}
                      {typeof issue.trustScore === "number" ? (
                        <span>Trust: {issue.trustScore}</span>
                      ) : null}
                    </div>
                    {issue.proofUrl ? (
                      <a
                        href={issue.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-[#0D5229] hover:underline"
                      >
                        View Proof →
                      </a>
                    ) : null}
                    {issue.createdAt ? (
                      <p className="mt-2 text-[11px] text-[#94A3B8] font-medium">
                        {new Date(issue.createdAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[11px] font-bold uppercase px-2 py-1 rounded-full bg-[#F0F5F2] text-[#04330B]">
                      {issue.status || "open"}
                    </span>
                    <div className="flex flex-wrap justify-end gap-2">{actionsForTab(issue)}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

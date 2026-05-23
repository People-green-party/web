"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../../components/Navbar";
import { AlertTriangle, Clock, CheckCircle2, FileText, Users, Filter } from "lucide-react";
import { getAuthHeaders } from "../../../../lib/auth";

export default function AdminActionQueuePage() {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"p0" | "p1" | "recent" | "sensitive" | "overdue">("p0");

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const res = await fetch("/admin/youth/action-queue", { headers: authHeaders });
      if (res.ok) setQueue(await res.json());
    } catch (err) {
      console.error("Failed to fetch action queue", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />
        <main className="mx-auto max-w-7xl px-5 lg:px-8 py-14">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  const tabs = [
    { id: "p0" as const, label: "P0 Emergency", icon: AlertTriangle, color: "text-[#DC2626]", count: queue?.p0Issues?.length || 0 },
    { id: "p1" as const, label: "P1 High Priority", icon: Clock, color: "text-[#D97706]", count: queue?.p1Issues?.length || 0 },
    { id: "recent" as const, label: "Recent Submissions", icon: FileText, color: "text-[#16A34A]", count: queue?.highDuplicateIssues?.length || 0 },
    { id: "sensitive" as const, label: "Sensitive Issues", icon: Users, color: "text-[#7C3AED]", count: queue?.sensitiveIssues?.length || 0 },
    { id: "overdue" as const, label: "Overdue Follow-ups", icon: Clock, color: "text-[#DC2626]", count: queue?.followUpOverdue?.length || 0 },
  ];

  const getIssuesForTab = () => {
    switch (activeTab) {
      case "p0": return queue?.p0Issues || [];
      case "p1": return queue?.p1Issues || [];
      case "recent": return queue?.highDuplicateIssues || [];
      case "sensitive": return queue?.sensitiveIssues || [];
      case "overdue": return queue?.followUpOverdue || [];
      default: return [];
    }
  };

  const currentIssues = getIssuesForTab();

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 lg:px-8 py-14">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">Admin Action Queue</h1>
          <p className="mt-2 text-[#587E67] font-semibold">
            Prioritized issues requiring immediate attention
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#04330B] text-white"
                    : "bg-white border border-[#BBF7D0] text-[#04330B] hover:bg-[#DCFCE7]"
                }`}
              >
                <Icon size={18} className={activeTab === tab.id ? "" : tab.color} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-[#DCFCE7]"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Issues List */}
        <div className="rounded-2xl bg-white border border-[#BBF7D0] overflow-hidden">
          {currentIssues.length === 0 ? (
            <div className="p-8 text-center text-[#587E67] font-semibold">
              No issues in this queue.
            </div>
          ) : (
            <div className="divide-y divide-[#DDEEE4]">
              {currentIssues.map((item: any) => {
                const isFollowUp = activeTab === "overdue";
                const issue = isFollowUp ? item.issue : item;
                const action = isFollowUp ? item : null;

                return (
                  <div key={issue.id} className="p-5 hover:bg-[#F5FBF7] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            issue.priority === "P0" ? "bg-[#FEE2E2] text-[#DC2626]" :
                            issue.priority === "P1" ? "bg-[#FEF3C7] text-[#D97706]" :
                            issue.priority === "P2" ? "bg-[#DCFCE7] text-[#16A34A]" :
                            "bg-[#E5E7EB] text-[#6B7280]"
                          }`}>
                            {issue.priority}
                          </span>
                          <span className="text-sm text-[#587E67] font-semibold">
                            {issue.category}
                          </span>
                          <span className="text-sm text-[#587E67]">
                            • {issue.district || "No district"}
                          </span>
                        </div>
                        <h3 className="font-bold text-[#04330B] text-lg">{issue.title}</h3>
                        <p className="mt-1 text-sm text-[#587E67] line-clamp-2">{issue.description}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#587E67]">
                          <span className="bg-[#F5FBF7] px-2 py-1 rounded">
                            Status: {issue.status}
                          </span>
                          <span className="bg-[#F5FBF7] px-2 py-1 rounded">
                            Trust Score: {issue.trustScore}
                          </span>
                          {action && (
                            <span className="bg-[#FEE2E2] text-[#DC2626] px-2 py-1 rounded">
                              Follow-up overdue since {new Date(action.followUpDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        <button className="px-3 py-2 rounded-lg bg-[#04330B] text-white font-bold text-sm hover:bg-[#16A34A] transition-colors">
                          Review
                        </button>
                        <button className="px-3 py-2 rounded-lg border border-[#BBF7D0] bg-white text-[#04330B] font-bold text-sm hover:bg-[#DCFCE7] transition-colors">
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-[#BBF7D0]">
            <div className="text-3xl font-black text-[#DC2626]">{queue?.p0Issues?.length || 0}</div>
            <div className="text-sm text-[#587E67] font-semibold">P0 Emergency Issues</div>
          </div>
          <div className="rounded-2xl bg-white p-5 border border-[#BBF7D0]">
            <div className="text-3xl font-black text-[#D97706]">{queue?.p1Issues?.length || 0}</div>
            <div className="text-sm text-[#587E67] font-semibold">P1 High Priority Issues</div>
          </div>
          <div className="rounded-2xl bg-white p-5 border border-[#BBF7D0]">
            <div className="text-3xl font-black text-[#DC2626]">{queue?.followUpOverdue?.length || 0}</div>
            <div className="text-sm text-[#587E67] font-semibold">Overdue Follow-ups</div>
          </div>
        </div>
      </main>
    </div>
  );
}

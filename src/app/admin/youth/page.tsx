"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { AlertTriangle, Building2, ClipboardCheck, Flag, KeyRound, School, Users, CheckCircle2, XCircle, TrendingUp, Award, MessageSquare } from "lucide-react";

function normalizeApiBaseUrl(baseUrl: string) {
  const cleaned = String(baseUrl || "").replace(/\/$/, "");
  if (!cleaned) return "http://localhost:3002/v1";
  if (cleaned.endsWith("/v1")) return cleaned;
  return `${cleaned}/v1`;
}

const API = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002");

type YouthDashboard = {
  totalYouth: number;
  ageGroup16to17: number;
  ageGroup18Plus: number;
  memberTypeStudent: number;
  memberTypeProfessional: number;
  memberTypeVolunteer: number;
  pendingIssues: number;
  escalatedIssues: number;
  flaggedMembers: number;
};

type Issue = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  urgency: string;
  createdAt: string;
  reporterMemberId: number;
  location?: string;
  district?: string;
  ward?: string;
  village?: string;
  locality?: string;
  trustScore?: number;
  proofUrl?: string;
};

type ActionQueue = {
  p0Issues: Issue[];
  p1Issues: Issue[];
  highDuplicateIssues: Issue[];
  sensitiveIssues: Issue[];
};

const cards = [
  { key: "totalYouth", title: "Total Youth Members", icon: Users },
  { key: "ageGroup16to17", title: "Age 16-17 (Civic Volunteers)", icon: Users },
  { key: "ageGroup18Plus", title: "Age 18+ (Active Members)", icon: Users },
  { key: "memberTypeStudent", title: "Students", icon: School },
  { key: "memberTypeProfessional", title: "Professionals", icon: Building2 },
  { key: "memberTypeVolunteer", title: "Volunteers", icon: ClipboardCheck },
  { key: "pendingIssues", title: "Pending Issues", icon: AlertTriangle },
  { key: "escalatedIssues", title: "Escalated Issues", icon: AlertTriangle },
  { key: "flaggedMembers", title: "Open Flags", icon: Flag },
] as const;

export default function AdminYouthPage() {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<YouthDashboard | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "issues" | "action-queue">("dashboard");
  const [actionQueue, setActionQueue] = useState<ActionQueue | null>(null);

  const getAdminAccessHeader = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const token = window.sessionStorage.getItem("admin_access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/youth/dashboard`, { headers: getAdminAccessHeader() });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Your admin access has expired. Please enter the password again.");
        throw new Error(await res.text());
      }
      setData(await res.json());
    } catch (e: any) {
      setError(e?.message || "Failed to load Youth dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadActionQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/youth/action-queue`, { headers: getAdminAccessHeader() });
      if (!res.ok) throw new Error("Failed to load action queue");
      setActionQueue(await res.json());
    } catch (e: any) {
      setError(e?.message || "Failed to load action queue");
    } finally {
      setLoading(false);
    }
  };

  const reviewIssue = async (issueId: number, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/youth/issues/${issueId}/review`, {
        method: "POST",
        headers: { ...getAdminAccessHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to review issue");
      await loadActionQueue();
      await loadDashboard();
    } catch (e: any) {
      setError(e?.message || "Failed to review issue");
    } finally {
      setLoading(false);
    }
  };

  const verifyPasswordGate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/users/admin/access/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid admin password");
        throw new Error(await res.text());
      }
      const auth = await res.json();
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("admin_youth_access_granted", "1");
        window.sessionStorage.setItem("admin_access_token", auth.token);
        window.sessionStorage.setItem("admin_access_scope", auth.scope);
      }
      setAccessGranted(true);
      await loadDashboard();
    } catch (e: any) {
      setError(e?.message || "Access verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem("admin_youth_access_granted") === "1") {
      setAccessGranted(true);
      loadDashboard();
    }
  }, []);

  useEffect(() => {
    if (accessGranted && activeTab === "action-queue") {
      loadActionQueue();
    }
  }, [accessGranted, activeTab]);

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] pt-[70px] lg:pt-[92px] font-['Familjen_Grotesk']">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="text-sm font-black text-[#16A34A] uppercase tracking-[0.22em]">Production Operations</div>
            <h1 className="mt-2 text-4xl lg:text-6xl font-black tracking-[-0.05em]">Youth Front Dashboard</h1>
            <p className="mt-3 text-[#587E67] font-semibold">Monitor youth membership, review issues, and manage action queues.</p>
          </div>
          {accessGranted && (
            <button onClick={() => activeTab === "dashboard" ? loadDashboard() : loadActionQueue()} disabled={loading} className="rounded-2xl bg-[#04330B] px-6 py-3 font-black text-white disabled:opacity-60">
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          )}
        </div>

        {!accessGranted && (
          <section className="mt-10 max-w-xl rounded-[28px] border border-[#DDEEE4] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3 text-2xl font-black"><KeyRound /> Admin Access</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-6 h-12 w-full rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none"
              placeholder="Enter admin password"
            />
            <button onClick={verifyPasswordGate} disabled={loading || !password} className="mt-4 w-full rounded-xl bg-[#04330B] px-5 py-3 font-black text-white disabled:opacity-60">
              {loading ? "Checking..." : "Open Dashboard"}
            </button>
          </section>
        )}

        {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">{error}</div>}

        {accessGranted && (
          <>
            {/* Tabs */}
            <div className="mt-8 flex gap-2 border-b border-[#DDEEE4] pb-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 font-bold rounded-lg ${activeTab === "dashboard" ? "bg-[#04330B] text-white" : "text-[#587E67] hover:bg-[#DCFCE7]"}`}
              >
                <TrendingUp size={16} className="inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("action-queue")}
                className={`px-4 py-2 font-bold rounded-lg ${activeTab === "action-queue" ? "bg-[#04330B] text-white" : "text-[#587E67] hover:bg-[#DCFCE7]"}`}
              >
                <MessageSquare size={16} className="inline mr-2" />
                Action Queue
              </button>
            </div>

            {activeTab === "dashboard" && data && (
              <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.key} className="rounded-[28px] border border-[#DDEEE4] bg-white p-6 shadow-sm">
                      <Icon className="text-[#16A34A]" size={32} />
                      <div className="mt-5 text-4xl font-black">{data[card.key]}</div>
                      <div className="mt-1 font-bold text-[#587E67]">{card.title}</div>
                    </div>
                  );
                })}
              </section>
            )}

            {activeTab === "action-queue" && actionQueue && (
              <section className="mt-10 space-y-6">
                {/* P0 Issues */}
                {actionQueue.p0Issues.length > 0 && (
                  <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-6">
                    <h3 className="text-xl font-black text-red-700 mb-4 flex items-center gap-2">
                      <AlertTriangle size={24} />
                      P0 Critical Issues ({actionQueue.p0Issues.length})
                    </h3>
                    <div className="space-y-4">
                      {actionQueue.p0Issues.map((issue) => (
                        <div key={issue.id} className="rounded-xl bg-white p-5 border border-red-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="font-bold text-lg text-[#04330B]">{issue.title}</div>
                              <div className="text-sm text-[#587E67] mt-1">
                                <span className="font-semibold">{issue.category}</span> • {issue.priority} • {issue.urgency}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => reviewIssue(issue.id, "HumanVerified")}
                                className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700"
                              >
                                <CheckCircle2 size={16} className="inline mr-1" />
                                Verify
                              </button>
                              <button
                                onClick={() => reviewIssue(issue.id, "Rejected")}
                                className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700"
                              >
                                <XCircle size={16} className="inline mr-1" />
                                Reject
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-[#04330B] mb-3">{issue.description}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-[#587E67]">
                            <div><span className="font-semibold">Location:</span> {issue.location || "N/A"}</div>
                            <div><span className="font-semibold">District:</span> {issue.district || "N/A"}</div>
                            <div><span className="font-semibold">Ward:</span> {issue.ward || "N/A"}</div>
                            <div><span className="font-semibold">Village:</span> {issue.village || "N/A"}</div>
                            <div><span className="font-semibold">Locality:</span> {issue.locality || "N/A"}</div>
                            <div><span className="font-semibold">Trust Score:</span> {issue.trustScore || 50}</div>
                          </div>
                          {issue.proofUrl && (
                            <div className="mt-3">
                              <a href={issue.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                View Proof →
                              </a>
                            </div>
                          )}
                          <div className="mt-3 text-xs text-[#587E67]">
                            Status: <span className="font-semibold">{issue.status}</span> • Reported: {new Date(issue.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* P1 Issues */}
                {actionQueue.p1Issues.length > 0 && (
                  <div className="rounded-2xl border border-orange-300 bg-orange-50 p-6">
                    <h3 className="text-xl font-black text-orange-700 mb-4 flex items-center gap-2">
                      <AlertTriangle size={24} />
                      P1 High Priority Issues ({actionQueue.p1Issues.length})
                    </h3>
                    <div className="space-y-4">
                      {actionQueue.p1Issues.map((issue) => (
                        <div key={issue.id} className="rounded-xl bg-white p-5 border border-orange-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="font-bold text-lg text-[#04330B]">{issue.title}</div>
                              <div className="text-sm text-[#587E67] mt-1">
                                <span className="font-semibold">{issue.category}</span> • {issue.priority} • {issue.urgency}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => reviewIssue(issue.id, "HumanVerified")}
                                className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700"
                              >
                                <CheckCircle2 size={16} className="inline mr-1" />
                                Verify
                              </button>
                              <button
                                onClick={() => reviewIssue(issue.id, "Rejected")}
                                className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700"
                              >
                                <XCircle size={16} className="inline mr-1" />
                                Reject
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-[#04330B] mb-3">{issue.description}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-[#587E67]">
                            <div><span className="font-semibold">Location:</span> {issue.location || "N/A"}</div>
                            <div><span className="font-semibold">District:</span> {issue.district || "N/A"}</div>
                            <div><span className="font-semibold">Ward:</span> {issue.ward || "N/A"}</div>
                            <div><span className="font-semibold">Village:</span> {issue.village || "N/A"}</div>
                            <div><span className="font-semibold">Locality:</span> {issue.locality || "N/A"}</div>
                            <div><span className="font-semibold">Trust Score:</span> {issue.trustScore || 50}</div>
                          </div>
                          {issue.proofUrl && (
                            <div className="mt-3">
                              <a href={issue.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                View Proof →
                              </a>
                            </div>
                          )}
                          <div className="mt-3 text-xs text-[#587E67]">
                            Status: <span className="font-semibold">{issue.status}</span> • Reported: {new Date(issue.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* High Duplicate Issues */}
                {actionQueue.highDuplicateIssues.length > 0 && (
                  <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-6">
                    <h3 className="text-xl font-black text-yellow-700 mb-4 flex items-center gap-2">
                      <Flag size={24} />
                      Potential Duplicates ({actionQueue.highDuplicateIssues.length})
                    </h3>
                    <div className="space-y-4">
                      {actionQueue.highDuplicateIssues.map((issue) => (
                        <div key={issue.id} className="rounded-xl bg-white p-5 border border-yellow-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="font-bold text-lg text-[#04330B]">{issue.title}</div>
                              <div className="text-sm text-[#587E67] mt-1">
                                <span className="font-semibold">{issue.category}</span> • {issue.priority} • {issue.urgency}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => reviewIssue(issue.id, "DuplicateMerged")}
                                className="px-3 py-1 rounded-lg bg-yellow-600 text-white text-sm font-bold hover:bg-yellow-700"
                              >
                                Mark Duplicate
                              </button>
                              <button
                                onClick={() => reviewIssue(issue.id, "HumanVerified")}
                                className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700"
                              >
                                Verify
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-[#04330B] mb-3">{issue.description}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-[#587E67]">
                            <div><span className="font-semibold">Location:</span> {issue.location || "N/A"}</div>
                            <div><span className="font-semibold">District:</span> {issue.district || "N/A"}</div>
                            <div><span className="font-semibold">Ward:</span> {issue.ward || "N/A"}</div>
                            <div><span className="font-semibold">Village:</span> {issue.village || "N/A"}</div>
                            <div><span className="font-semibold">Locality:</span> {issue.locality || "N/A"}</div>
                            <div><span className="font-semibold">Trust Score:</span> {issue.trustScore || 50}</div>
                          </div>
                          {issue.proofUrl && (
                            <div className="mt-3">
                              <a href={issue.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                View Proof →
                              </a>
                            </div>
                          )}
                          <div className="mt-3 text-xs text-[#587E67]">
                            Status: <span className="font-semibold">{issue.status}</span> • Reported: {new Date(issue.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sensitive Issues */}
                {actionQueue.sensitiveIssues.length > 0 && (
                  <div className="rounded-2xl border border-purple-300 bg-purple-50 p-6">
                    <h3 className="text-xl font-black text-purple-700 mb-4 flex items-center gap-2">
                      <Flag size={24} />
                      Sensitive Issues ({actionQueue.sensitiveIssues.length})
                    </h3>
                    <div className="space-y-4">
                      {actionQueue.sensitiveIssues.map((issue) => (
                        <div key={issue.id} className="rounded-xl bg-white p-5 border border-purple-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="font-bold text-lg text-[#04330B]">{issue.title}</div>
                              <div className="text-sm text-[#587E67] mt-1">
                                <span className="font-semibold">{issue.category}</span> • {issue.priority} • {issue.urgency}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => reviewIssue(issue.id, "HumanVerified")}
                                className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700"
                              >
                                <CheckCircle2 size={16} className="inline mr-1" />
                                Verify
                              </button>
                              <button
                                onClick={() => reviewIssue(issue.id, "Escalated")}
                                className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700"
                              >
                                Escalate
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-[#04330B] mb-3">{issue.description}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-[#587E67]">
                            <div><span className="font-semibold">Location:</span> {issue.location || "N/A"}</div>
                            <div><span className="font-semibold">District:</span> {issue.district || "N/A"}</div>
                            <div><span className="font-semibold">Ward:</span> {issue.ward || "N/A"}</div>
                            <div><span className="font-semibold">Village:</span> {issue.village || "N/A"}</div>
                            <div><span className="font-semibold">Locality:</span> {issue.locality || "N/A"}</div>
                            <div><span className="font-semibold">Trust Score:</span> {issue.trustScore || 50}</div>
                          </div>
                          {issue.proofUrl && (
                            <div className="mt-3">
                              <a href={issue.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                View Proof →
                              </a>
                            </div>
                          )}
                          <div className="mt-3 text-xs text-[#587E67]">
                            Status: <span className="font-semibold">{issue.status}</span> • Reported: {new Date(issue.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {actionQueue.p0Issues.length === 0 && actionQueue.p1Issues.length === 0 && actionQueue.highDuplicateIssues.length === 0 && actionQueue.sensitiveIssues.length === 0 && (
                  <div className="rounded-2xl bg-white p-8 text-center border border-[#DDEEE4]">
                    <CheckCircle2 size={48} className="mx-auto text-[#16A34A]" />
                    <div className="mt-4 text-xl font-black text-[#04330B]">All Clear!</div>
                    <div className="mt-2 text-[#587E67]">No pending issues in the action queue.</div>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

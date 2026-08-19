"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  AlertTriangle,
  Flag,
  ShieldCheck,
  ClipboardList,
  Loader2,
  Swords,
  Target,
  Building2,
  HandCoins,
} from "lucide-react";
import { ADMIN_API, adminFetch, getAdminToken } from "@/lib/adminApi";

type YouthStats = {
  totalYouth?: number;
  pendingIssues?: number;
  flaggedMembers?: number;
  escalatedIssues?: number;
};

type InternshipApp = {
  id: number;
  fullName: string;
  department: string;
  status: string;
  mode: string;
  createdAt: string;
  city?: string;
};

type InternshipStats = {
  total: number;
  byStatus: Record<string, number>;
  byDepartment: { department: string; count: number }[];
  recent: InternshipApp[];
};

type Election = { id: number; status?: string; councilLevel?: string; position?: string };
type AuditLog = { id: number; action?: string; entityType?: string; createdAt?: string };
type Countish = { total?: number; items?: any[]; data?: any[] } | any[];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-sky-50 text-sky-700",
  reviewed: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  waitlisted: "bg-purple-50 text-purple-700",
};

function asList(data: Countish): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.items)) return (data as any).items;
  if (Array.isArray((data as any)?.data)) return (data as any).data;
  return [];
}

function asTotal(data: Countish): number {
  if (Array.isArray(data)) return data.length;
  if (typeof (data as any)?.total === "number") return (data as any).total;
  return asList(data).length;
}

function actionQueueTotal(data: any): number {
  if (!data || typeof data !== "object") return 0;
  if (Array.isArray(data)) return data.length;
  const keys = [
    "p0Issues",
    "p1Issues",
    "highDuplicateIssues",
    "sensitiveIssues",
    "followUpOverdue",
  ];
  return keys.reduce((sum, key) => sum + (Array.isArray(data[key]) ? data[key].length : 0), 0);
}

export default function AdminPage() {
  const [youth, setYouth] = useState<YouthStats>({});
  const [internships, setInternships] = useState<InternshipStats>({
    total: 0,
    byStatus: {},
    byDepartment: [],
    recent: [],
  });
  const [elections, setElections] = useState<Election[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [pendingSquads, setPendingSquads] = useState(0);
  const [pendingMissions, setPendingMissions] = useState(0);
  const [pendingSquadMissions, setPendingSquadMissions] = useState(0);
  const [actionQueueCount, setActionQueueCount] = useState(0);
  const [unionTotal, setUnionTotal] = useState(0);
  const [memberTotal, setMemberTotal] = useState(0);
  const [donationTotal, setDonationTotal] = useState(0);
  const [donationConfirmedSum, setDonationConfirmedSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    const token = getAdminToken();
    if (!token) return;
    setError("");
    try {
      const [
        youthDash,
        applications,
        electionList,
        auditLogs,
        squads,
        missions,
        squadMissions,
        actionQueue,
        unionStats,
        membersPage,
        donationsPage,
      ] = await Promise.all([
        adminFetch<YouthStats>("admin/youth/dashboard").catch(() => ({})),
        adminFetch<InternshipStats>("internship/applications/stats").catch(() => null),
        fetch(`${ADMIN_API}/elections`, { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
        adminFetch<{ logs?: AuditLog[] } | AuditLog[]>("audit/logs?limit=12").catch(() => ({ logs: [] })),
        adminFetch<Countish>("admin/youth/squads?status=PendingVerification&limit=1").catch(() => ({ total: 0 })),
        adminFetch<Countish>("admin/youth/mission-submissions?status=submitted&limit=1").catch(() => ({
          total: 0,
        })),
        adminFetch<Countish>("admin/youth/squad-missions?status=submitted&limit=1").catch(() => ({
          total: 0,
        })),
        adminFetch<Countish>("admin/youth/action-queue").catch(() => []),
        adminFetch<{ total?: number }>("users/admin/unions/stats").catch(() => ({ total: 0 })),
        adminFetch<Countish>("users/admin/users/search?segment=all&take=1&page=1").catch(() => ({
          total: 0,
        })),
        adminFetch<{ total?: number; confirmedAmountSum?: number }>("admin/donations?limit=1").catch(
          () => ({ total: 0, confirmedAmountSum: 0 })
        ),
      ]);

      setYouth(youthDash || {});
      setInternships({
        total: Number(applications?.total || 0),
        byStatus: applications?.byStatus || {},
        byDepartment: Array.isArray(applications?.byDepartment)
          ? applications.byDepartment
          : [],
        recent: Array.isArray(applications?.recent) ? applications.recent : [],
      });
      setElections(Array.isArray(electionList) ? electionList : []);
      setAudit(
        Array.isArray(auditLogs)
          ? auditLogs
          : Array.isArray((auditLogs as any)?.logs)
            ? ((auditLogs as any).logs as AuditLog[])
            : []
      );
      setPendingSquads(asTotal(squads));
      setPendingMissions(asTotal(missions));
      setPendingSquadMissions(asTotal(squadMissions));
      setActionQueueCount(actionQueueTotal(actionQueue));
      setUnionTotal(Number(unionStats?.total || 0));
      setMemberTotal(asTotal(membersPage));
      setDonationTotal(Number(donationsPage?.total || 0));
      setDonationConfirmedSum(Number(donationsPage?.confirmedAmountSum || 0));
    } catch (e: any) {
      setError(e?.message || "Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const internshipStats = useMemo(() => {
    const s = internships.byStatus;
    return {
      total: internships.total,
      pending: s.pending || 0,
      accepted: s.accepted || 0,
      rejected: s.rejected || 0,
      reviewed: s.reviewed || 0,
      waitlisted: s.waitlisted || 0,
    };
  }, [internships]);

  const openElections = useMemo(
    () =>
      elections.filter((e) => {
        const s = String(e.status || "").toLowerCase();
        return !s || s === "open" || s === "active" || s === "published";
      }).length,
    [elections]
  );

  const recent = internships.recent;

  const deptBars = useMemo(() => {
    const rows = internships.byDepartment
      .slice(0, 6)
      .map((d) => ({ name: d.department, count: d.count }));
    const max = Math.max(1, ...rows.map((r) => r.count));
    return { rows, max };
  }, [internships]);

  const donut = useMemo(() => {
    const parts = [
      { key: "pending", label: "New", value: internshipStats.pending, color: "#38BDF8" },
      { key: "reviewed", label: "Under Review", value: internshipStats.reviewed, color: "#F59E0B" },
      { key: "accepted", label: "Accepted", value: internshipStats.accepted, color: "#16A34A" },
      { key: "waitlisted", label: "Waitlisted", value: internshipStats.waitlisted, color: "#8B5CF6" },
      { key: "rejected", label: "Rejected", value: internshipStats.rejected, color: "#EF4444" },
    ];
    const sum = parts.reduce((s, p) => s + p.value, 0) || 1;
    let start = 0;
    const segments = parts.map((p) => {
      const pct = (p.value / sum) * 100;
      const seg = { ...p, start, end: start + pct };
      start += pct;
      return seg;
    });
    return { segments, sum: parts.reduce((s, p) => s + p.value, 0) };
  }, [internshipStats]);

  const cards = [
    {
      label: "All Registered Users",
      value: memberTotal,
      icon: Users,
      hint: "Full User database — updates on every enrollment",
      href: "/admin/users",
    },
    {
      label: "Union Workers",
      value: unionTotal,
      icon: Building2,
      hint: "Click to view union member list",
      href: "/admin/unions",
    },
    {
      label: "Jinda Youth",
      value: youth.totalYouth ?? "—",
      icon: Flag,
      hint: "Click card → member details",
      href: "/admin/youth",
    },
    {
      label: "Internships",
      value: internshipStats.total,
      icon: GraduationCap,
      hint: `${internshipStats.pending} pending — view applications`,
      href: "/admin/internships",
    },
    {
      label: "Donations",
      value: donationTotal,
      icon: HandCoins,
      hint:
        donationConfirmedSum > 0
          ? `₹${donationConfirmedSum.toLocaleString("en-IN")} confirmed`
          : "Form submissions",
      href: "/admin/donations",
    },
    {
      label: "Open Elections",
      value: openElections,
      icon: ShieldCheck,
      hint: `${elections.length} total elections`,
      href: "/admin/elections",
    },
    {
      label: "Action Queue",
      value: actionQueueCount,
      icon: AlertTriangle,
      hint: "Issues needing attention",
      href: "/admin/youth/action-queue",
    },
    {
      label: "Squad Approvals",
      value: pendingSquads,
      icon: Swords,
      hint: "Pending squads",
      href: "/admin/youth/squads",
    },
    {
      label: "Mission Reviews",
      value: pendingMissions + pendingSquadMissions,
      icon: Target,
      hint: `${pendingMissions} individual · ${pendingSquadMissions} squad`,
      href: "/admin/youth/missions",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#587E67] gap-2 font-semibold">
        <Loader2 className="animate-spin" size={18} /> Loading live party data…
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#04330B]">Party Dashboard</h2>
        <p className="text-sm text-[#587E67] font-medium">
          Live data — Members, Unions, Youth, Internships, Donations and ops.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-[#E4F2EA] bg-white p-4 sm:p-5 shadow-sm hover:border-[#16A34A] transition-colors min-w-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#587E67]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-[#04330B]">{card.value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#94A3B8]">{card.hint}</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-[#EAF7EE] text-[#16A34A] flex items-center justify-center">
                  <Icon size={20} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <section className="rounded-2xl border border-[#E4F2EA] bg-white p-5 shadow-sm">
          <h3 className="font-black text-[#04330B]">Internship Overview</h3>
          <p className="text-xs text-[#587E67] font-medium mt-1">Real application status mix</p>
          <div className="mt-6 flex flex-col items-center">
            <div
              className="h-40 w-40 rounded-full relative"
              style={{
                background: `conic-gradient(${donut.segments
                  .map((s) => `${s.color} ${s.start}% ${s.end}%`)
                  .join(", ")})`,
              }}
            >
              <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-[#04330B]">{donut.sum}</span>
                <span className="text-[10px] font-bold uppercase text-[#94A3B8]">Total</span>
              </div>
            </div>
            <div className="mt-5 w-full space-y-2">
              {donut.segments.map((s) => (
                <div key={s.key} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-[#04330B]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-bold text-[#587E67]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="xl:col-span-2 rounded-2xl border border-[#E4F2EA] bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-black text-[#04330B]">Recent Internship Applications</h3>
            <p className="text-xs text-[#587E67] font-medium">Latest live submissions</p>
          </div>

          {recent.length === 0 ? (
            <p className="py-12 text-center text-sm font-semibold text-[#94A3B8]">
              No internship applications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recent.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#F0F5F2] px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#04330B] truncate">
                      #{app.id} · {app.fullName}
                    </p>
                    <p className="text-xs text-[#587E67] font-medium truncate">
                      {app.department} · {app.mode}
                      {app.city ? ` · ${app.city}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        STATUS_STYLE[app.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status}
                    </span>
                    <p className="mt-1 text-[11px] text-[#94A3B8] font-medium">
                      {new Date(app.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-[#E4F2EA] bg-white p-5 shadow-sm">
          <h3 className="font-black text-[#04330B]">Department-wise Applications</h3>
          <p className="text-xs text-[#587E67] font-medium mt-1">From live internship data</p>
          {deptBars.rows.length === 0 ? (
            <p className="py-10 text-center text-sm font-semibold text-[#94A3B8]">No data yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {deptBars.rows.map((row) => (
                <div key={row.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-[#04330B] truncate pr-3">{row.name}</span>
                    <span className="font-bold text-[#587E67]">{row.count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#F0F5F2] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A]"
                      style={{ width: `${(row.count / deptBars.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#E4F2EA] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-[#04330B]">Recent Audit Activity</h3>
              <p className="text-xs text-[#587E67] font-medium">Live system trail</p>
            </div>
            <Link href="/admin/audit-logs" className="text-sm font-bold text-[#16A34A] hover:underline">
              All logs
            </Link>
          </div>
          {audit.length === 0 ? (
            <p className="py-10 text-center text-sm font-semibold text-[#94A3B8]">No recent audit logs.</p>
          ) : (
            <div className="space-y-2">
              {audit.slice(0, 8).map((log, idx) => (
                <div
                  key={log.id ?? idx}
                  className="rounded-xl border border-[#F0F5F2] px-3 py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#04330B] truncate">
                      {log.action || "ACTION"}
                    </p>
                    <p className="text-xs text-[#587E67] font-medium truncate">
                      {log.entityType || "Entity"}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-medium whitespace-nowrap">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-[#E4F2EA] bg-white p-5 shadow-sm">
        <h3 className="font-black text-[#04330B] mb-1">Jinda Youth pulse</h3>
        <p className="text-xs text-[#587E67] font-medium mb-4">Live ops counters</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Open issues", value: youth.pendingIssues ?? "—", href: "/admin/youth/action-queue", icon: AlertTriangle },
            { label: "Flagged members", value: youth.flaggedMembers ?? "—", href: "/admin/youth", icon: Flag },
            { label: "Escalated", value: youth.escalatedIssues ?? "—", href: "/admin/youth/action-queue", icon: ClipboardList },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-xl border border-[#E4F2EA] bg-[#F8FBF9] px-4 py-3 hover:border-[#16A34A]"
              >
                <div className="flex items-center gap-2 text-[#16A34A]">
                  <Icon size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide text-[#587E67]">
                    {item.label}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-black text-[#04330B]">{item.value}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

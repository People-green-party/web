"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Flag,
  School,
  Search,
  Users,
} from "lucide-react";
import { ADMIN_API, getAdminToken } from "@/lib/adminApi";

const API = ADMIN_API;
const PAGE_SIZE = 50;

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

type YouthRow = {
  id: number;
  name: string;
  phone: string;
  memberId?: string;
  programTag?: string;
  youthAgeGroup?: string;
  memberType?: string;
  campusName?: string;
  registrationStatus?: string;
  createdAt: string;
};

type MemberFilter = {
  youthAgeGroup?: string;
  memberType?: string;
};

const cards: {
  key: keyof YouthDashboard;
  title: string;
  icon: typeof Users;
  href?: string;
  filter?: MemberFilter;
}[] = [
  { key: "totalYouth", title: "Total Youth Members", icon: Users, filter: {} },
  {
    key: "ageGroup16to17",
    title: "Age 16-17 (Civic Volunteers)",
    icon: Users,
    filter: { youthAgeGroup: "16-17" },
  },
  {
    key: "ageGroup18Plus",
    title: "Age 18+ (Active Members)",
    icon: Users,
    filter: { youthAgeGroup: "18+" },
  },
  {
    key: "memberTypeStudent",
    title: "Students",
    icon: School,
    filter: { memberType: "student" },
  },
  {
    key: "memberTypeProfessional",
    title: "Professionals",
    icon: Building2,
    filter: { memberType: "professional" },
  },
  {
    key: "memberTypeVolunteer",
    title: "Volunteers",
    icon: ClipboardCheck,
    filter: { memberType: "volunteer" },
  },
  { key: "pendingIssues", title: "Open Issues", icon: AlertTriangle, href: "/admin/youth/action-queue" },
  { key: "escalatedIssues", title: "Escalated Issues", icon: AlertTriangle, href: "/admin/youth/action-queue" },
  { key: "flaggedMembers", title: "Open Flags", icon: Flag, href: "/admin/youth/action-queue" },
];

function YouthMergedInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accessGranted, setAccessGranted] = useState(false);
  const [dashLoading, setDashLoading] = useState(false);
  const [dashError, setDashError] = useState<string | null>(null);
  const [data, setData] = useState<YouthDashboard | null>(null);

  const [q, setQ] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [memberType, setMemberType] = useState("");
  const [results, setResults] = useState<YouthRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const getAdminAccessHeader = (): Record<string, string> => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadDashboard = async () => {
    setDashLoading(true);
    setDashError(null);
    try {
      const res = await fetch(`${API}/admin/youth/dashboard`, { headers: getAdminAccessHeader() });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Your admin access has expired. Please enter the password again.");
        throw new Error(await res.text());
      }
      setData(await res.json());
    } catch (e: any) {
      setDashError(e?.message || "Failed to load Youth dashboard");
    } finally {
      setDashLoading(false);
    }
  };

  const loadMembers = useCallback(
    async (query: string, pageNum: number, age: string, type: string) => {
      setListLoading(true);
      setListError(null);
      try {
        const token = getAdminToken();
        if (!token) throw new Error("Admin session required. Sign in at /admin/login.");
        const params = new URLSearchParams({
          segment: "youth",
          q: query,
          take: String(PAGE_SIZE),
          page: String(pageNum),
        });
        if (age) params.set("youthAgeGroup", age);
        if (type) params.set("memberType", type);

        const res = await fetch(`${API}/users/admin/users/search?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Your admin access has expired. Please enter the password again.");
          }
          throw new Error(await res.text());
        }
        const payload = await res.json();
        setResults(Array.isArray(payload.items) ? payload.items : Array.isArray(payload) ? payload : []);
        setTotal(Number(payload.total) || (Array.isArray(payload) ? payload.length : 0));
        setPage(Number(payload.page) || pageNum);
        setPages(Number(payload.pages) || 1);
      } catch (e: any) {
        setListError(e?.message || "Failed to load youth members");
      } finally {
        setListLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    sessionStorage.setItem("admin_youth_access_granted", "1");
    setAccessGranted(true);
    loadDashboard();
  }, []);

  useEffect(() => {
    const initialAge = searchParams.get("youthAgeGroup") || "";
    const initialType = searchParams.get("memberType") || "";
    const initialQ = searchParams.get("q") || "";
    setAgeGroup(initialAge);
    setMemberType(initialType);
    setQ(initialQ);
    if (getAdminToken()) {
      loadMembers(initialQ, 1, initialAge, initialType);
    }
  }, [searchParams, loadMembers]);

  const applyFilterToUrl = (filter: MemberFilter = {}, query = "") => {
    const params = new URLSearchParams();
    if (filter.youthAgeGroup) params.set("youthAgeGroup", filter.youthAgeGroup);
    if (filter.memberType) params.set("memberType", filter.memberType);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.replace(qs ? `/admin/youth?${qs}` : "/admin/youth", { scroll: false });
    requestAnimationFrame(() => {
      document.getElementById("youth-members")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const search = () => {
    applyFilterToUrl(
      {
        ...(ageGroup ? { youthAgeGroup: ageGroup } : {}),
        ...(memberType ? { memberType: memberType } : {}),
      },
      q
    );
  };

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(pages, next));
    setPage(clamped);
    loadMembers(q, clamped, ageGroup, memberType);
  };

  const filterLabel =
    ageGroup === "16-17"
      ? "Age 16–17"
      : ageGroup === "18+"
        ? "Age 18+"
        : memberType === "student"
          ? "Students"
          : memberType === "professional"
            ? "Professionals"
            : memberType === "volunteer"
              ? "Volunteers"
              : "All Zinda Youth";

  return (
    <div className="w-full max-w-full min-w-0 space-y-8 font-['Familjen_Grotesk'] text-[#04330B]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-[#16A34A] uppercase tracking-[0.18em]">
            Peoples Green Party
          </p>
          <h2 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Zinda Youth
          </h2>
          <p className="mt-1 text-sm text-[#587E67] font-medium">
            Dashboard overview first, then the full youth members list below. Click a membership card to filter the list.
          </p>
        </div>
      </div>

      {!accessGranted && (
        <section className="rounded-2xl border border-[#DDEEE4] bg-white p-6 shadow-sm text-center">
          <p className="font-bold text-[#04330B]">Admin session required</p>
          <p className="mt-2 text-sm text-[#587E67] font-medium">
            Sign in at /admin/login to load live Zinda Youth data.
          </p>
        </section>
      )}

      {dashError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 text-sm">
          {dashError}
        </div>
      )}

      {accessGranted && dashLoading && !data && (
        <p className="text-sm font-semibold text-[#587E67]">Loading dashboard…</p>
      )}

      {accessGranted && data && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const body = (
              <>
                <Icon className="text-[#16A34A]" size={24} />
                <div className="mt-3 text-2xl sm:text-3xl font-black tabular-nums">
                  {data[card.key]}
                </div>
                <div className="mt-1 text-sm font-bold text-[#587E67] leading-snug">
                  {card.title}
                </div>
              </>
            );

            if (card.href) {
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  className="rounded-2xl border border-[#DDEEE4] bg-white p-4 sm:p-5 shadow-sm min-w-0 hover:border-[#16A34A]/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  {body}
                  <p className="mt-2 text-[11px] font-bold text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Action Queue →
                  </p>
                </Link>
              );
            }

            return (
              <button
                key={card.key}
                type="button"
                onClick={() => applyFilterToUrl(card.filter || {})}
                className="text-left rounded-2xl border border-[#DDEEE4] bg-white p-4 sm:p-5 shadow-sm min-w-0 hover:border-[#16A34A]/40 hover:shadow-md transition-all cursor-pointer group"
              >
                {body}
                <p className="mt-2 text-[11px] font-bold text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity">
                  Filter members ↓
                </p>
              </button>
            );
          })}
        </section>
      )}

      {/* Members list */}
      <section id="youth-members" className="space-y-5 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-t border-[#DDEEE4] pt-8">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Users size={22} /> Youth Members
            </h3>
            <p className="mt-1 text-sm text-[#587E67] font-medium">
              {filterLabel} — {total} registered
            </p>
          </div>
        </div>

        {listError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 text-sm">
            {listError}
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E4F2EA]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 min-w-0">
              <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] pl-11 pr-4 font-semibold outline-none focus:border-[#10B981]"
                  placeholder="Name, phone, or Member ID…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && search()}
                />
                <Search className="absolute left-4 top-3 text-[#587E67] w-5 h-5" />
              </div>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
                Age group
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-3 font-semibold outline-none focus:border-[#10B981]"
              >
                <option value="">All ages</option>
                <option value="16-17">16–17</option>
                <option value="18+">18+</option>
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
                Member type
              </label>
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-3 font-semibold outline-none focus:border-[#10B981]"
              >
                <option value="">All types</option>
                <option value="student">Students</option>
                <option value="professional">Professionals</option>
                <option value="volunteer">Volunteers</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={search}
                className="w-full h-[46px] rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#0B5A2A] transition-colors"
                disabled={listLoading}
              >
                {listLoading ? "Loading…" : "Apply"}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-3">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-8 text-center text-[#587E67] font-semibold text-sm">
              {listLoading ? "Loading…" : "No youth members found."}
            </div>
          ) : (
            results.map((u) => (
              <article key={u.id} className="rounded-2xl border border-[#E4F2EA] bg-white p-4 space-y-2">
                <h3 className="font-bold break-words">{u.name?.trim() || "Name not provided"}</h3>
                <p className="text-sm text-[#587E67] font-semibold break-all">{u.phone}</p>
                <p className="text-xs text-[#587E67]">
                  {u.youthAgeGroup || "—"} · {u.memberType || "—"}
                  {u.campusName ? ` · ${u.campusName}` : ""}
                </p>
                <p className="text-xs font-semibold inline-flex items-center gap-1 text-[#04330B]">
                  <Calendar size={12} />{" "}
                  {new Date(u.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </article>
            ))
          )}
        </div>

        <div className="hidden lg:block bg-white rounded-[20px] shadow-sm border border-[#E4F2EA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F1FBF6] border-b border-[#DDEEE4]">
                  <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Member</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Age</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Type</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Campus</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4F2EA]">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#587E67] font-semibold">
                      {listLoading ? "Loading…" : "No youth members found."}
                    </td>
                  </tr>
                ) : (
                  results.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFCFB]">
                      <td className="px-6 py-4">
                        <div className="font-bold">{u.name?.trim() || "Name not provided"}</div>
                        <div className="text-[13px] text-[#587E67] font-semibold">{u.phone}</div>
                        <div className="text-[12px] text-[#587E67]">
                          {u.memberId || (u.registrationStatus === "pending" ? "Incomplete" : `ID ${u.id}`)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{u.youthAgeGroup || "—"}</td>
                      <td className="px-6 py-4 font-semibold">{u.memberType || "—"}</td>
                      <td className="px-6 py-4 font-semibold">{u.campusName || "—"}</td>
                      <td className="px-6 py-4 font-semibold text-sm">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || listLoading}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DDEEE4] font-bold text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <p className="text-sm font-semibold text-[#587E67]">
              Page {page} / {pages}
            </p>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= pages || listLoading}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DDEEE4] font-bold text-sm disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminYouthPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#587E67] font-semibold">Loading Zinda Youth…</div>
      }
    >
      <YouthMergedInner />
    </Suspense>
  );
}

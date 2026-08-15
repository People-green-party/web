/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, MapPin, Search, ShieldAlert, User, Users, X } from "lucide-react";
import { ADMIN_API, getAdminScope, getAdminToken } from "@/lib/adminApi";
import { resolveMemberPhotoUrl } from "@/lib/memberPhoto";

const API = ADMIN_API;
const PAGE_SIZE = 50;
const ROLES = [
  "Admin",
  "Member",
  "CWCMember",
  "CWCPresident",
  "APC",
  "PPC",
  "SSP",
  "ALCPresident",
  "SLCPresident",
] as const;

const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  Admin: "Admin",
  Member: "Member",
  CWCMember: "CWC Member",
  CWCPresident: "CWC President (unit / ward)",
  APC: "APC",
  PPC: "PPC",
  SSP: "SSP",
  ALCPresident: "ALC President (assembly)",
  SLCPresident: "SLC President (state)",
};

type UserRow = {
  id: number;
  name: string;
  phone: string;
  role: string;
  memberId?: string;
  photoUrl?: string | null;
  unionName?: string | null;
  programTag?: string | null;
  registrationStatus?: string;
  createdAt: string;
  address?: string | null;
  localUnit?: {
    name: string;
    type: string;
    vidhansabha: { name: string; loksabha: { name: string } };
  } | null;
  _count?: { recruits: number };
};

function resolveAdminPhotoUrl(url: string | null | undefined) {
  return resolveMemberPhotoUrl(url, ADMIN_API);
}

function MemberAvatar({
  name,
  photoUrl,
}: {
  name?: string | null;
  photoUrl?: string | null;
}) {
  const [broken, setBroken] = useState(false);
  const src = resolveAdminPhotoUrl(photoUrl);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const initials = String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "?";

  if (src && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name || "Member"}
        className="w-11 h-11 rounded-full object-cover border border-[#B9D3C4] bg-[#F1FBF6] shrink-0"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <div className="w-11 h-11 rounded-full bg-[#EAF7EE] border border-[#B9D3C4] flex items-center justify-center shrink-0 text-[#0D5229]">
      {initials.length ? (
        <span className="text-[12px] font-black tracking-wide">{initials}</span>
      ) : (
        <User size={18} />
      )}
    </div>
  );
}

function LocationCell({ u }: { u: UserRow }) {
  const address = String(u.address || "").trim();
  if (u.localUnit) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-1.5 text-[14px] font-bold text-[#04330B]">
          <MapPin size={14} className="text-[#10B981] mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="break-words">
              {u.localUnit.name}{" "}
              <span className="text-[#587E67] font-semibold text-[12px]">
                ({u.localUnit.type})
              </span>
            </p>
            <p className="text-[12px] text-[#587E67] font-semibold leading-tight">
              {u.localUnit.vidhansabha.name}, {u.localUnit.vidhansabha.loksabha.name}
            </p>
          </div>
        </div>
        {address ? (
          <p className="pl-5 text-[12px] text-[#587E67] font-semibold break-words line-clamp-2">
            {address}
          </p>
        ) : null}
      </div>
    );
  }
  if (address) {
    return (
      <div className="flex items-start gap-1.5 text-[14px] text-[#04330B]">
        <MapPin size={14} className="text-[#10B981] mt-0.5 shrink-0" />
        <p className="font-semibold break-words line-clamp-3">{address}</p>
      </div>
    );
  }
  return <span className="text-gray-400 font-semibold text-[13px]">Location / address not set</span>;
}

type Segment = "all" | "party" | "union" | "youth";

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: "all", label: "All users" },
  { key: "party", label: "Party only" },
  { key: "union", label: "Union only" },
  { key: "youth", label: "Jinda Youth" },
];

function roleBadge(role: string) {
  if (role === "Admin") return "bg-red-50 text-red-700 border-red-200";
  if (role.includes("President")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (role === "CWCMember") return "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]";
  return "bg-gray-50 text-gray-600 border-gray-200";
}

function portalTags(u: UserRow): string[] {
  const tags: string[] = [];
  if (u.localUnit) tags.push("Party");
  if (String(u.unionName || "").trim()) tags.push("Union");
  const tag = String(u.programTag || "").toLowerCase();
  if (tag.includes("youth") || tag.includes("jinda")) tags.push("Youth");
  if (tags.length === 0) tags.push("Incomplete");
  return tags;
}

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [segment, setSegment] = useState<Segment>("all");
  const [results, setResults] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reason, setReason] = useState("");
  const [reasonHighlight, setReasonHighlight] = useState(false);
  const reasonInputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState<Record<number, boolean>>({});

  const [accessGranted, setAccessGranted] = useState(false);
  const [accessScope, setAccessScope] = useState<"view" | "edit" | null>(null);

  type RecruitRow = {
    id: number;
    name: string;
    phone: string;
    memberId?: string | null;
    unionName?: string | null;
    programTag?: string | null;
    address?: string | null;
    createdAt: string;
    localUnit?: {
      name: string;
      type: string;
      vidhansabha: { name: string; loksabha: { name: string } };
    } | null;
  };

  const [recruitsOpen, setRecruitsOpen] = useState(false);
  const [recruitsLoading, setRecruitsLoading] = useState(false);
  const [recruitsError, setRecruitsError] = useState<string | null>(null);
  const [recruitsFor, setRecruitsFor] = useState<{
    id: number;
    name: string;
    memberId?: string | null;
    referralCode?: string | null;
  } | null>(null);
  const [recruitsList, setRecruitsList] = useState<RecruitRow[]>([]);
  const [recruitsTotal, setRecruitsTotal] = useState(0);

  const notify = (msg: string) => {
    if (typeof window !== "undefined") window.alert(msg);
  };

  const getAdminAccessHeader = (): Record<string, string> => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const load = useCallback(async (query: string, pageNum: number, seg: Segment) => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAdminAccessHeader();
      const res = await fetch(
        `${API}/users/admin/users/search?segment=${encodeURIComponent(seg)}&q=${encodeURIComponent(query)}&take=${PAGE_SIZE}&page=${pageNum}`,
        { headers: { ...auth } }
      );
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Your admin access has expired. Please enter the password again.");
        }
        throw new Error(await res.text());
      }
      const data = await res.json();
      let items: UserRow[] = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
          ? data.items
          : [];

      // Permanent: enrich durable photoUrl from DB via Vercel (not Coolify /uploads).
      try {
        const ids = items.map((u) => u.id).filter(Boolean);
        if (ids.length && auth.Authorization) {
          const photoRes = await fetch("/api/admin/member-photos", {
            method: "POST",
            headers: {
              Authorization: auth.Authorization,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
          });
          if (photoRes.ok) {
            const photoJson = await photoRes.json().catch(() => null);
            const photos = (photoJson?.photos || {}) as Record<string, string>;
            items = items.map((u) => {
              const durable = photos[String(u.id)];
              if (!durable) return u;
              return { ...u, photoUrl: durable };
            });
          }
        }
      } catch {
        /* keep Nest photoUrl if enrichment fails */
      }

      if (Array.isArray(data)) {
        setResults(items);
        setTotal(items.length);
        setPage(1);
        setPages(1);
      } else {
        setResults(items);
        setTotal(Number(data.total) || 0);
        setPage(Number(data.page) || pageNum);
        setPages(Number(data.pages) || 1);
      }
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = () => {
    setPage(1);
    load(q, 1, segment);
  };

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    setAccessGranted(true);
    setAccessScope(getAdminScope());
    sessionStorage.setItem("admin_users_access_granted", "1");
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get("q") || "";
    const initialSeg = (params.get("segment") as Segment) || "all";
    if (initialQ) setQ(initialQ);
    if (["all", "party", "union", "youth"].includes(initialSeg)) setSegment(initialSeg);
    load(initialQ, 1, ["all", "party", "union", "youth"].includes(initialSeg) ? initialSeg : "all");
  }, [load]);

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(pages, next));
    setPage(clamped);
    load(q, clamped, segment);
  };

  const applySegment = (seg: Segment) => {
    setSegment(seg);
    setPage(1);
    load(q, 1, seg);
  };

  const openRecruits = async (u: UserRow) => {
    const count = u._count?.recruits || 0;
    if (count <= 0) return;
    setRecruitsOpen(true);
    setRecruitsLoading(true);
    setRecruitsError(null);
    setRecruitsFor({ id: u.id, name: u.name, memberId: u.memberId || null });
    setRecruitsList([]);
    setRecruitsTotal(count);
    try {
      const auth = getAdminAccessHeader();
      const res = await fetch(`${API}/users/admin/users/${u.id}/recruits?take=200`, {
        headers: { ...auth },
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Your admin access has expired. Please enter the password again.");
        }
        throw new Error(await res.text());
      }
      const data = await res.json();
      setRecruitsFor({
        id: data?.referrer?.id ?? u.id,
        name: data?.referrer?.name ?? u.name,
        memberId: data?.referrer?.memberId ?? u.memberId ?? null,
        referralCode: data?.referrer?.referralCode ?? null,
      });
      setRecruitsList(Array.isArray(data?.recruits) ? data.recruits : []);
      setRecruitsTotal(Number(data?.total) || count);
    } catch (e: any) {
      setRecruitsError(e?.message || "Failed to load recruits");
    } finally {
      setRecruitsLoading(false);
    }
  };

  const closeRecruits = () => {
    setRecruitsOpen(false);
    setRecruitsError(null);
    setRecruitsList([]);
    setRecruitsFor(null);
  };

  const recruitPortal = (r: RecruitRow) => {
    const tags: string[] = [];
    if (r.localUnit) tags.push("Party");
    if (String(r.unionName || "").trim()) tags.push("Union");
    const tag = String(r.programTag || "").toLowerCase();
    if (tag.includes("youth") || tag.includes("jinda")) tags.push("Youth");
    return tags.length ? tags.join(" · ") : "—";
  };

  const updateRole = async (userId: number, newRole: string, previousRole: string) => {
    if (newRole === previousRole) return;

    if (accessScope !== "edit") {
      notify(
        "Role change blocked: you are on View Only access. Log out and sign in again at /admin/login with the EDITOR password (not the view password).",
      );
      return;
    }

    let auditReason = reason.trim();
    if (!auditReason) {
      setReasonHighlight(true);
      reasonInputRef.current?.focus();
      reasonInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const typed = window.prompt(
        `Audit reason required to change role to ${ROLE_LABELS[newRole as keyof typeof ROLE_LABELS] || newRole}.\n\nType the reason below:`,
      );
      auditReason = String(typed || "").trim();
      if (!auditReason) {
        notify("Role not changed — audit reason is required (fill the Reason box at the top, then try again).");
        return;
      }
      setReason(auditReason);
      setReasonHighlight(false);
    }

    try {
      setBusy((b) => ({ ...b, [userId]: true }));
      const auth = getAdminAccessHeader();
      const res = await fetch(`${API}/users/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ role: newRole, reason: auditReason }),
      });
      if (!res.ok) {
        let msg = await res.text();
        try {
          const parsed = JSON.parse(msg);
          msg = parsed?.message || msg;
        } catch {
          /* keep text */
        }
        if (res.status === 401) {
          throw new Error(
            "Editor access required or session expired. Sign in again with the EDITOR admin password.",
          );
        }
        throw new Error(Array.isArray(msg) ? msg.join(", ") : String(msg));
      }
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      notify(`Role updated to ${ROLE_LABELS[newRole as keyof typeof ROLE_LABELS] || newRole}`);
      setReason("");
      setReasonHighlight(false);
    } catch (e: any) {
      notify(e?.message || "Failed to update role");
    } finally {
      setBusy((b) => ({ ...b, [userId]: false }));
    }
  };

  const admins = results.filter((u) => u.role === "Admin").length;
  const presidents = results.filter((u) => u.role.includes("President")).length;
  const totalRecruits = results.reduce((sum, u) => sum + (u._count?.recruits || 0), 0);
  const canEdit = accessScope === "edit";
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="w-full max-w-full min-w-0 font-['Familjen_Grotesk'] text-gray-800">
      {!accessGranted ? (
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-8 text-center">
          <p className="font-bold text-[#04330B]">Admin session required</p>
          <p className="mt-2 text-sm text-[#587E67] font-medium">
            Please sign in again at /admin/login to manage PGP members.
          </p>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-[28px] font-bold text-[#04330B] leading-tight">
                All Registered Users
              </h2>
              <p className="text-[#587E67] font-semibold mt-1 text-sm">
                Full User table from the database. Total updates every time someone enrolls (Party,
                Union, or Jinda Youth). Internships are on their own page.
              </p>
              <p className="text-[12px] text-amber-700 font-medium mt-2 max-w-2xl">
                Use the filters below to narrow by portal. Incomplete joins (no name/location) are
                included in “All users”.
              </p>
            </div>
            <div
              className={`shrink-0 px-3 py-2 rounded-full text-[12px] font-bold border ${
                canEdit
                  ? "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              Access: {canEdit ? "Editor" : "View Only"}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 font-semibold text-sm">
              <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={18} />
              <span className="break-words">{error}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {SEGMENTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => applySegment(s.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  segment === s.key
                    ? "bg-[#04330B] text-white border-[#04330B]"
                    : "bg-white text-[#04330B] border-[#DDEEE4] hover:border-[#16A34A]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 min-w-0">
              <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">
                Total in database
              </p>
              <p className="text-2xl font-bold text-[#04330B] mt-2">{total}</p>
              <p className="text-xs text-[#587E67] mt-1 font-medium">
                Showing {from}–{to} · filter: {segment}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 min-w-0">
              <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">
                Admins / Presidents (page)
              </p>
              <p className="text-2xl font-bold text-[#04330B] mt-2">
                {admins} / {presidents}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4 min-w-0">
              <p className="text-[#587E67] text-xs font-bold uppercase tracking-wide">Recruits (page)</p>
              <p className="text-2xl font-bold text-[#04330B] mt-2">{totalRecruits}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#E4F2EA]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-5 min-w-0">
                <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
                  Search Members
                </label>
                <div className="relative">
                  <input
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] pl-11 pr-4 font-semibold text-[#04330B] outline-none focus:border-[#10B981]"
                    placeholder="Name, phone, or PGP-ID…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                  />
                  <Search className="absolute left-4 top-3 text-[#587E67] w-5 h-5" />
                </div>
              </div>
              <div className="lg:col-span-5 min-w-0">
                <label className="block text-[12px] font-bold text-[#587E67] uppercase tracking-wide mb-2">
                  Reason for Role Change {canEdit ? "(required)" : "(editor login needed)"}
                </label>
                <input
                  ref={reasonInputRef}
                  className={`w-full h-[46px] rounded-[10px] border px-4 font-semibold text-[#04330B] outline-none focus:border-[#10B981] ${
                    reasonHighlight
                      ? "border-amber-500 bg-amber-50"
                      : "border-[#DDEEE4]"
                  }`}
                  placeholder={
                    canEdit
                      ? "e.g. Promoting Sudhanshu to CWC President after 6 recruits"
                      : "Sign in with EDITOR password to change roles"
                  }
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value.trim()) setReasonHighlight(false);
                  }}
                  disabled={!canEdit}
                />
                {!canEdit && (
                  <p className="mt-1.5 text-[12px] font-semibold text-amber-700">
                    Top-right shows View Only — re-login with editor password to enable Change Role.
                  </p>
                )}
              </div>
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={search}
                  className="w-full h-[46px] rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#0B5A2A] transition-colors"
                  disabled={loading}
                >
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {results.length === 0 ? (
              <div className="rounded-2xl border border-[#E4F2EA] bg-white p-8 text-center text-[#587E67] font-semibold text-sm">
                {loading ? "Loading data…" : "No members found."}
              </div>
            ) : (
              results.map((u) => (
                <article
                  key={u.id}
                  className="rounded-2xl border border-[#E4F2EA] bg-white p-4 shadow-sm space-y-3 min-w-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex items-start gap-3">
                      <MemberAvatar name={u.name} photoUrl={u.photoUrl} />
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#04330B] text-base break-words">
                          {u.name?.trim() || "Name not provided"}
                        </h3>
                        <p className="text-sm text-[#587E67] font-semibold break-all">{u.phone}</p>
                        <p className="text-xs text-[#587E67] mt-0.5">ID: {u.id}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {portalTags(u).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1FBF6] text-[#0D5229] border border-[#B9D3C4]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${
                            u.memberId
                              ? "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {u.memberId ||
                            (u.registrationStatus === "pending"
                              ? "Incomplete join"
                              : "No Member ID")}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleBadge(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <LocationCell u={u} />

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-[#04330B] font-semibold">
                      <Calendar size={14} className="text-[#587E67]" />
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-[#F1FBF6] border border-[#B9D3C4] rounded-full px-2.5 py-0.5">
                      <Users size={14} className="text-[#0D5229]" />
                      {(u._count?.recruits || 0) > 0 ? (
                        <button
                          type="button"
                          onClick={() => openRecruits(u)}
                          className="font-bold text-[#04330B] underline decoration-[#0D5229]/40 underline-offset-2 hover:text-[#0D5229]"
                          title="View who they referred"
                        >
                          {u._count?.recruits || 0}
                        </button>
                      ) : (
                        <span className="font-bold text-[#04330B]">0</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#587E67] uppercase mb-1">
                      Change role
                    </label>
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value, u.role)}
                      disabled={!!busy[u.id] || !canEdit}
                      className="w-full h-10 rounded-[8px] border border-[#DDEEE4] px-3 font-semibold text-[#04330B] text-sm outline-none focus:border-[#10B981] disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                    {!canEdit && (
                      <p className="mt-1 text-[11px] font-semibold text-amber-700">
                        View only — cannot change role
                      </p>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-[20px] shadow-sm border border-[#E4F2EA] overflow-hidden">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left border-collapse min-w-[980px]">
                <thead>
                  <tr className="bg-[#F1FBF6] border-b border-[#DDEEE4]">
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Member Details
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Location / Address
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider text-center">
                      Recruits
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#587E67] uppercase tracking-wider">
                      Change Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4F2EA]">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#587E67] font-semibold">
                        {loading ? "Loading data…" : "No members found."}
                      </td>
                    </tr>
                  ) : (
                    results.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAFCFB] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <MemberAvatar name={u.name} photoUrl={u.photoUrl} />
                            <div className="min-w-0">
                              <div className="font-bold text-[#04330B] text-[16px]">
                                {u.name?.trim() || "Name not provided"}
                              </div>
                              <div className="text-[13px] text-[#587E67] font-semibold mt-0.5">
                                {u.phone}
                              </div>
                              <div className="text-[12px] text-[#587E67] mt-0.5">ID: {u.id}</div>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {portalTags(u).map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1FBF6] text-[#0D5229] border border-[#B9D3C4]"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                              <div
                                className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide border ${
                                  u.memberId
                                    ? "bg-[#EAF7EE] text-[#0D5229] border-[#B9D3C4]"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}
                              >
                                {u.memberId ||
                                  (u.registrationStatus === "pending"
                                    ? "Incomplete join"
                                    : "No Member ID")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <LocationCell u={u} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-[14px] text-[#04330B] font-semibold">
                            <Calendar size={14} className="text-[#587E67]" />
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {(u._count?.recruits || 0) > 0 ? (
                            <button
                              type="button"
                              onClick={() => openRecruits(u)}
                              className="inline-flex items-center justify-center gap-1.5 bg-[#F1FBF6] border border-[#B9D3C4] rounded-full px-3 py-1 hover:bg-[#EAF7EE] hover:border-[#0D5229] transition-colors"
                              title="View who they referred"
                            >
                              <Users size={14} className="text-[#0D5229]" />
                              <span className="font-bold text-[#04330B] text-[14px] underline decoration-[#0D5229]/40 underline-offset-2">
                                {u._count?.recruits || 0}
                              </span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center justify-center gap-1.5 bg-[#F1FBF6] border border-[#B9D3C4] rounded-full px-3 py-1">
                              <Users size={14} className="text-[#0D5229]" />
                              <span className="font-bold text-[#04330B] text-[14px]">0</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[12px] font-bold border ${roleBadge(
                              u.role
                            )}`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value, u.role)}
                            disabled={!!busy[u.id] || !canEdit}
                            className="w-full h-[36px] rounded-[8px] border border-[#DDEEE4] px-3 font-semibold text-[#04330B] text-[13px] outline-none focus:border-[#10B981] disabled:opacity-50 cursor-pointer"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {ROLE_LABELS[r]}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#E4F2EA] bg-white px-4 py-3">
              <p className="text-sm font-semibold text-[#587E67] text-center sm:text-left">
                {total.toLocaleString("en-IN")} members · Page {page} of {pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-[8px] border border-[#B9D3C4] text-sm font-semibold text-[#04330B] disabled:opacity-40 hover:bg-[#F8FBF9]"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= pages || loading}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-[8px] border border-[#B9D3C4] text-sm font-semibold text-[#04330B] disabled:opacity-40 hover:bg-[#F8FBF9]"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {recruitsOpen && (
            <div
              className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6"
              onClick={closeRecruits}
            >
              <div
                className="w-full sm:max-w-2xl max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white border border-[#E4F2EA] shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#E4F2EA] px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#587E67]">
                      Recruits
                    </p>
                    <h3 className="text-lg font-bold text-[#04330B] truncate">
                      {recruitsFor?.name || "Member"}
                    </h3>
                    <p className="text-xs text-[#587E67] font-semibold mt-0.5">
                      {recruitsTotal} referred ·{" "}
                      {recruitsFor?.memberId || `ID ${recruitsFor?.id || "—"}`}
                      {recruitsFor?.referralCode
                        ? ` · Code ${recruitsFor.referralCode}`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeRecruits}
                    className="shrink-0 p-2 rounded-lg border border-[#DDEEE4] text-[#04330B] hover:bg-[#F8FBF9]"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-76px)] p-4 sm:p-5">
                  {recruitsLoading ? (
                    <p className="text-sm font-semibold text-[#587E67] py-8 text-center">
                      Loading recruits…
                    </p>
                  ) : recruitsError ? (
                    <p className="text-sm font-semibold text-red-700 py-6 text-center break-words">
                      {recruitsError}
                    </p>
                  ) : recruitsList.length === 0 ? (
                    <p className="text-sm font-semibold text-[#587E67] py-8 text-center">
                      No recruits found.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {recruitsList.map((r) => (
                        <li
                          key={r.id}
                          className="rounded-xl border border-[#E4F2EA] bg-[#FAFCFB] p-3.5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-[#04330B]">
                                {r.name?.trim() || "Name not provided"}
                              </p>
                              <p className="text-sm text-[#587E67] font-semibold">{r.phone}</p>
                              <p className="text-xs text-[#587E67] mt-0.5">
                                {r.memberId || `ID ${r.id}`} · {recruitPortal(r)}
                              </p>
                            </div>
                            <p className="text-xs font-semibold text-[#587E67] shrink-0">
                              {new Date(r.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          {r.localUnit ? (
                            <p className="mt-2 text-xs font-semibold text-[#0D5229]">
                              {r.localUnit.name} ({r.localUnit.type}) ·{" "}
                              {r.localUnit.vidhansabha.name},{" "}
                              {r.localUnit.vidhansabha.loksabha.name}
                            </p>
                          ) : String(r.address || "").trim() ? (
                            <p className="mt-2 text-xs font-semibold text-[#587E67] line-clamp-2">
                              {String(r.address).trim()}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

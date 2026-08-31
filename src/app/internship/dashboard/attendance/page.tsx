"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  attendanceProgress,
  sessionMode,
  sessionModeLabel,
  upcomingLiveSessions,
} from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";
import { internFetch } from "@/lib/internApi";

export default function InternAttendancePage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading, refresh } = useInternPortal();
  const stats = attendanceProgress(data);
  const rows = data?.attendance || [];
  const rule = data?.summary?.certificate?.requirements.attendance;
  const requiredClasses = rule?.requiredClasses ?? 3;
  const requiredPct = rule?.required ?? 75;
  const pct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
  const upcoming = upcomingLiveSessions(data);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const checkedIn = new Set(
    rows.filter((a) => a.present && a.class?.id).map((a) => a.class!.id),
  );

  const canCheckIn = (scheduledAt?: string | null) => {
    if (!scheduledAt) return true;
    const start = new Date(scheduledAt).getTime();
    const now = Date.now();
    return now >= start - 2 * 60 * 60 * 1000 && now <= start + 6 * 60 * 60 * 1000;
  };

  const checkIn = async (classId: number) => {
    setBusyId(classId);
    setMsg("");
    try {
      await internFetch(`internship/me/classes/${classId}/check-in`, { method: "POST" });
      setMsg(isHi ? "उपस्थिति दर्ज हो गई" : "Checked in");
      await refresh();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : isHi ? "चेक-इन असफल" : "Check-in failed");
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !data) {
    return <div className="p-8 font-semibold text-[#6B8F7A]">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-5 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मेरी उपस्थिति" : "My Attendance"}</h1>
        <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
          {isHi
            ? "ऑनलाइन जॉइन या ऑफलाइन चेक-इन — दोनों उपस्थिति गिनी जाती है।"
            : "Join online or check in offline — both count as present."}
        </p>
        {msg ? <p className="mt-2 text-[13px] font-semibold text-[#0B5A2A]">{msg}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#DCEBE2] bg-white p-4 shadow-sm">
          <p className="text-[11.5px] font-semibold text-[#6B8F7A]">
            {isHi ? "कुल उपस्थिति" : "Overall attendance"}
          </p>
          <p className="mt-2 text-[26px] font-bold tabular-nums text-[#04330B]">{pct}%</p>
        </div>
        <div className="rounded-2xl border border-[#DCEBE2] bg-white p-4 shadow-sm">
          <p className="text-[11.5px] font-semibold text-[#6B8F7A]">
            {isHi ? "सत्र उपस्थित" : "Sessions attended"}
          </p>
          <p className="mt-2 text-[26px] font-bold tabular-nums text-[#04330B]">
            {stats.present} / {stats.total || requiredClasses}
          </p>
        </div>
        <div
          className={`rounded-2xl border p-4 shadow-sm ${
            rule?.met ? "border-[#BBF7D0] bg-[#F0FDF4]" : "border-[#FDE68A] bg-[#FFFBEB]"
          }`}
        >
          <p className="text-[11.5px] font-semibold text-[#6B8F7A]">
            {isHi ? "प्रमाणपत्र शर्त" : "Certificate requirement"}
          </p>
          <p className="mt-2 text-[18px] font-bold text-[#04330B]">
            {requiredPct}% · {requiredClasses}+ {isHi ? "कक्षाएँ" : "classes"}
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#4F6B5C]">
            {rule?.met
              ? isHi
                ? "यह शर्त पूरी है"
                : "This requirement is met"
              : isHi
                ? "अभी अधूरी — कक्षाओं में चेक-इन करें"
                : "Not met yet — check in at classes"}
          </p>
        </div>
      </div>

      {upcoming.length ? (
        <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#04330B]">{isHi ? "आगामी सत्र" : "Upcoming"}</h2>
          <ul className="mt-3 space-y-2.5">
            {upcoming.slice(0, 6).map((session) => {
              const mode = sessionMode(session);
              const present = checkedIn.has(session.id);
              return (
                <li
                  key={session.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#EAF2EC] px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold text-[#04330B]">{session.title}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6B8F7A]">
                      <Clock3 size={12} />
                      {session.scheduledAt
                        ? new Date(session.scheduledAt).toLocaleString(locale, {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                      {" · "}
                      {sessionModeLabel(mode, isHi)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {session.url ? (
                      <a
                        href={session.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-[#04330B] px-3 py-2 text-[12px] font-bold text-white"
                      >
                        {isHi ? "ऑनलाइन जॉइन" : "Join online"}
                      </a>
                    ) : null}
                    {present ? (
                      <span className="px-2 py-2 text-[12px] font-bold text-[#0B5A2A]">
                        {isHi ? "दर्ज" : "Present"}
                      </span>
                    ) : canCheckIn(session.scheduledAt) ? (
                      <button
                        type="button"
                        disabled={busyId === session.id}
                        onClick={() => void checkIn(session.id)}
                        className="rounded-lg border border-[#C5D9CC] px-3 py-2 text-[12px] font-bold text-[#04330B] disabled:opacity-50"
                      >
                        {isHi ? "चेक-इन" : "Check in"}
                      </button>
                    ) : (
                      <Link
                        href="/internship/dashboard/classes"
                        className="px-2 py-2 text-[12px] font-bold text-[#0B5A2A] hover:underline"
                      >
                        {isHi ? "कक्षाएँ" : "Classes"}
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#DCEBE2] bg-white shadow-sm">
        {rows.length === 0 ? (
          <PortalEmptyState
            bordered={false}
            art="attendance"
            title={isHi ? "अभी कोई उपस्थिति दर्ज नहीं" : "No attendance recorded yet"}
            description={
              isHi
                ? "लाइव सत्र के समय ऑनलाइन जॉइन करें या चेक-इन करें।"
                : "Join online or check in during a live session."
            }
          />
        ) : (
          <ul className="divide-y divide-[#EAF2EC]">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-[#04330B]">
                    {row.class?.title || (isHi ? "सामान्य उपस्थिति" : "General attendance")}
                  </p>
                  <p className="text-[12px] font-medium text-[#6B8F7A]">
                    {new Date(row.date).toLocaleDateString(locale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {row.notes ? ` · ${row.notes}` : ""}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    row.present ? "bg-[#E8F5EC] text-[#0B5A2A]" : "bg-red-50 text-red-700"
                  }`}
                >
                  {row.present ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {row.present ? (isHi ? "उपस्थित" : "Present") : isHi ? "अनुपस्थित" : "Absent"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  MapPin,
  PlayCircle,
  Radio,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  sessionMode,
  sessionModeLabel,
  sessionPlatformLabel,
  upcomingLiveSessions,
} from "@/components/internship/portal/types";
import { internFetch } from "@/lib/internApi";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const isSameDay = (iso?: string | null, d = new Date()) => {
  if (!iso) return false;
  return dayKey(new Date(iso)) === dayKey(d);
};

export default function InternClassesPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading, refresh } = useInternPortal();
  const [checkInBusy, setCheckInBusy] = useState<number | null>(null);
  const [checkInMsg, setCheckInMsg] = useState("");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const live = upcomingLiveSessions(data);
  const recorded = data?.classes.recorded || [];
  const allLive = data?.classes.live || [];
  const checkedIn = new Set(
    (data?.attendance || [])
      .filter((a) => a.present && a.class?.id)
      .map((a) => a.class!.id),
  );

  const todaySessions = live.filter((s) => isSameDay(s.scheduledAt) || !s.scheduledAt);
  const futureSessions = live.filter((s) => s.scheduledAt && !isSameDay(s.scheduledAt));

  const canCheckIn = (scheduledAt?: string | null) => {
    if (!scheduledAt) return true;
    const start = new Date(scheduledAt).getTime();
    const now = Date.now();
    return now >= start - 2 * 60 * 60 * 1000 && now <= start + 6 * 60 * 60 * 1000;
  };

  const checkIn = async (classId: number) => {
    setCheckInBusy(classId);
    setCheckInMsg("");
    try {
      await internFetch(`internship/me/classes/${classId}/check-in`, { method: "POST" });
      setCheckInMsg(isHi ? "उपस्थिति दर्ज हो गई" : "Checked in");
      await refresh();
    } catch (e: unknown) {
      setCheckInMsg(
        e instanceof Error ? e.message : isHi ? "चेक-इन असफल" : "Check-in failed",
      );
    } finally {
      setCheckInBusy(null);
    }
  };

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, typeof allLive>();
    for (const s of allLive) {
      if (!s.scheduledAt) continue;
      const key = dayKey(new Date(s.scheduledAt));
      const list = map.get(key) || [];
      list.push(s);
      map.set(key, list);
    }
    return map;
  }, [allLive]);

  const selectedSessions = selectedDay ? sessionsByDay.get(selectedDay) || [] : [];
  const selectedDayLabel = selectedDay
    ? new Date(`${selectedDay}T00:00:00`).toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const calendarDays = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: ({ day: number; key: string } | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, key: dayKey(new Date(year, month, day)) });
    }
    return cells;
  }, [cursor]);

  if (loading && !data) {
    return <div className="p-8 font-semibold text-[#6B8F7A]">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मेरी कक्षाएँ" : "My Classes"}</h1>
        <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
          {isHi
            ? "कहाँ और कब। ऑनलाइन जॉइन करें या ऑफलाइन चेक-इन करें — ट्रैक नहीं बदलेगा।"
            : "Where and when. Join online or check in offline — your track stays the same."}
        </p>
        {checkInMsg ? (
          <p className="mt-2 text-[13px] font-semibold text-[#0B5A2A]">{checkInMsg}</p>
        ) : null}
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#0B5A2A]">
          <Radio size={15} /> {isHi ? "आज" : "Today"}
        </h2>
        {todaySessions.length === 0 ? (
          <p className="rounded-xl border border-[#EAF2EC] bg-[#F8FBF9] px-4 py-3 text-[13px] font-medium text-[#6B8F7A]">
            {isHi ? "आज कोई लाइव सत्र नहीं।" : "No live session today."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {todaySessions.map((c) => (
              <SessionCard
                key={c.id}
                session={c}
                isHi={isHi}
                locale={locale}
                checkedIn={checkedIn.has(c.id)}
                canCheckIn={canCheckIn(c.scheduledAt)}
                busy={checkInBusy === c.id}
                onCheckIn={() => void checkIn(c.id)}
                highlight
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wide text-[#6B8F7A]">
          {isHi ? "आगे" : "Future"}
        </h2>
        {futureSessions.length === 0 ? (
          <p className="text-[13px] font-medium text-[#6B8F7A]">
            {isHi ? "कोई और सत्र शेड्यूल नहीं।" : "No further sessions scheduled."}
          </p>
        ) : (
          <ul className="divide-y divide-[#E8F0EB] overflow-hidden rounded-2xl border border-[#DCEBE2] bg-white">
            {futureSessions.map((c) => {
              const mode = sessionMode(c);
              return (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#04330B]">{c.title}</p>
                    <p className="mt-0.5 text-[12px] font-medium text-[#6B8F7A]">
                      {c.scheduledAt
                        ? new Date(c.scheduledAt).toLocaleString(locale, {
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
                  <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-bold text-[#0B5A2A]">
                    {sessionModeLabel(mode, isHi)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#6B8F7A]">
          <PlayCircle size={15} /> {isHi ? "रिकॉर्डेड" : "Recorded"}
        </h2>
        {recorded.length === 0 ? (
          <PortalEmptyState
            art="library"
            title={isHi ? "अभी कोई रिकॉर्डिंग नहीं" : "No recordings yet"}
            description={
              isHi
                ? "बीते सत्रों की रिकॉर्डिंग यहाँ जुड़ेंगी।"
                : "Recordings of past sessions will appear here."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recorded.map((c) => (
              <article key={c.id} className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
                <h3 className="text-[15px] font-bold text-[#04330B]">{c.title}</h3>
                {c.description ? (
                  <p className="mt-1 text-[12.5px] font-medium text-[#4F6B5C]">{c.description}</p>
                ) : null}
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B5A2A] hover:underline"
                  >
                    {isHi ? "देखें" : "Watch"} <ExternalLink size={12} />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#DCEBE2] bg-white p-4 sm:p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[16px] font-bold text-[#04330B]">
            <CalendarDays size={17} className="text-[#0B5A2A]" />
            {isHi ? "कैलेंडर" : "Calendar"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCEBE2] hover:bg-[#F5FBF7]"
              onClick={() => {
                setSelectedDay(null);
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
              }}
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="min-w-[120px] text-center text-[13px] font-bold text-[#04330B]">
              {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCEBE2] hover:bg-[#F5FBF7]"
              onClick={() => {
                setSelectedDay(null);
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
              }}
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-[#8AA396]">
          {(isHi
            ? ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
            : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          ).map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((cell, idx) => {
            if (!cell) return <div key={`e-${idx}`} className="min-h-[64px]" />;
            const hits = sessionsByDay.get(cell.key) || [];
            const isToday = cell.key === dayKey(new Date());
            const isSelected = cell.key === selectedDay;
            const cellClass = `min-h-[64px] w-full rounded-lg border px-1.5 py-1 text-left ${
              hits.length ? "border-[#B9D3C4] bg-[#EAF7EE]" : "border-transparent bg-[#F8FBF9]"
            } ${isSelected ? "ring-2 ring-[#0B5A2A]" : isToday ? "ring-1 ring-[#0B5A2A]" : ""}`;
            const inner = (
              <>
                <p className={`text-[12px] font-bold ${hits.length ? "text-[#0B5A2A]" : "text-[#6B8F7A]"}`}>
                  {cell.day}
                </p>
                {hits.slice(0, 2).map((h) => (
                  <p key={h.id} className="truncate text-[11px] font-semibold leading-tight text-[#04330B]">
                    {h.title}
                  </p>
                ))}
              </>
            );
            if (!hits.length) {
              return (
                <div key={cell.key} className={cellClass}>
                  {inner}
                </div>
              );
            }
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedDay((prev) => (prev === cell.key ? null : cell.key))}
                className={`${cellClass} hover:border-[#0B5A2A]`}
              >
                {inner}
              </button>
            );
          })}
        </div>
        {selectedDay && selectedSessions.length ? (
          <div className="mt-4 rounded-xl border border-[#DCEBE2] bg-[#F8FBF9] p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13px] font-bold text-[#04330B]">{selectedDayLabel}</p>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#DCEBE2] bg-white"
              >
                <X size={13} />
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              {selectedSessions.map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  isHi={isHi}
                  locale={locale}
                  checkedIn={checkedIn.has(s.id)}
                  canCheckIn={canCheckIn(s.scheduledAt)}
                  busy={checkInBusy === s.id}
                  onCheckIn={() => void checkIn(s.id)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function SessionCard({
  session,
  isHi,
  locale,
  checkedIn,
  canCheckIn,
  busy,
  onCheckIn,
  highlight = false,
}: {
  session: {
    id: number;
    title: string;
    description?: string | null;
    url?: string | null;
    venue?: string | null;
    scheduledAt?: string | null;
  };
  isHi: boolean;
  locale: string;
  checkedIn: boolean;
  canCheckIn: boolean;
  busy: boolean;
  onCheckIn: () => void;
  highlight?: boolean;
}) {
  const mode = sessionMode(session);
  const platform = sessionPlatformLabel(session.url);
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        highlight ? "border-2 border-[#0B5A2A]" : "border-[#DCEBE2]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-[15px] font-bold text-[#04330B]">{session.title}</h3>
        <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-bold text-[#0B5A2A]">
          {sessionModeLabel(mode, isHi)}
        </span>
      </div>
      {session.description ? (
        <p className="mt-1 text-[12.5px] font-medium text-[#4F6B5C]">{session.description}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-semibold text-[#6B8F7A]">
        {session.scheduledAt ? (
          <>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} />
              {new Date(session.scheduledAt).toLocaleDateString(locale, { day: "numeric", month: "short" })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} />
              {new Date(session.scheduledAt).toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        ) : null}
        {platform ? <span>{platform}</span> : null}
        {session.venue ? (
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {session.venue}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {session.url ? (
          <a
            href={session.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#04330B] px-4 text-[13px] font-bold text-white"
          >
            {isHi ? "ऑनलाइन जॉइन करें" : "Join online"} <ExternalLink size={12} />
          </a>
        ) : null}
        {checkedIn ? (
          <span className="inline-flex h-10 items-center px-3 text-[13px] font-bold text-[#0B5A2A]">
            {isHi ? "चेक-इन हो चुका" : "Checked in"}
          </span>
        ) : canCheckIn ? (
          <button
            type="button"
            onClick={onCheckIn}
            disabled={busy}
            className="h-10 rounded-xl border border-[#C5D9CC] bg-white px-4 text-[13px] font-bold text-[#04330B] disabled:opacity-50"
          >
            {busy
              ? isHi
                ? "दर्ज हो रहा है…"
                : "Checking in…"
              : isHi
                ? "ऑफलाइन चेक-इन"
                : "Check in (offline)"}
          </button>
        ) : (
          <p className="text-[12px] font-medium text-[#6B8F7A]">
            {isHi
              ? "चेक-इन सत्र से 2 घंटे पहले खुलता है।"
              : "Check-in opens two hours before the session."}
          </p>
        )}
      </div>
    </article>
  );
}

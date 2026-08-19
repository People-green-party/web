"use client";

import React, { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, ExternalLink, PlayCircle, Radio, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  sessionPlatformLabel,
  upcomingLiveSessions,
} from "@/components/internship/portal/types";
import { internFetch } from "@/lib/internApi";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

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
    } catch (e: any) {
      setCheckInMsg(e?.message || (isHi ? "चेक-इन असफल" : "Check-in failed"));
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

  const goToMonth = (offset: number) => {
    setSelectedDay(null);
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + offset, 1));
  };

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
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-5xl space-y-8">
      <div>
        <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मेरी कक्षाएँ" : "My Classes"}</h1>
        <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
          {isHi ? "लाइव सत्र, कैलेंडर और रिकॉर्डेड लाइब्रेरी।" : "Live sessions, calendar, and recorded library."}
        </p>
        {checkInMsg ? (
          <p className="mt-2 text-[13px] font-semibold text-[#0B5A2A]">{checkInMsg}</p>
        ) : null}
      </div>

      <section className="rounded-2xl border border-[#DCEBE2] bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-[16px] font-bold text-[#04330B] flex items-center gap-2">
            <CalendarDays size={17} className="text-[#0B5A2A]" />
            {isHi ? "कैलेंडर" : "Calendar"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-8 w-8 rounded-lg border border-[#DCEBE2] flex items-center justify-center hover:bg-[#F5FBF7]"
              onClick={() => goToMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-[13px] font-bold text-[#04330B] min-w-[120px] text-center">
              {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              className="h-8 w-8 rounded-lg border border-[#DCEBE2] flex items-center justify-center hover:bg-[#F5FBF7]"
              onClick={() => goToMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-[#8AA396] mb-1">
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
                  <p key={h.id} className="text-[11px] font-semibold text-[#04330B] truncate leading-tight">
                    {h.title}
                  </p>
                ))}
                {hits.length > 2 ? (
                  <p className="text-[11px] font-bold text-[#0B5A2A]">+{hits.length - 2}</p>
                ) : null}
              </>
            );
            if (!hits.length) {
              return (
                <div key={cell.key} className={cellClass}>
                  {inner}
                </div>
              );
            }
            const dayLabel = new Date(`${cell.key}T00:00:00`).toLocaleDateString(locale, {
              weekday: "long",
              day: "numeric",
              month: "long",
            });
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedDay((prev) => (prev === cell.key ? null : cell.key))}
                aria-pressed={isSelected}
                aria-label={`${dayLabel} — ${hits.map((h) => h.title).join(", ")}`}
                title={hits.map((h) => h.title).join(", ")}
                className={`${cellClass} hover:border-[#0B5A2A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5A2A]`}
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
                aria-label="Close selected day"
                className="h-7 w-7 shrink-0 rounded-lg border border-[#DCEBE2] bg-white flex items-center justify-center text-[#6B8F7A] hover:bg-[#F5FBF7]"
              >
                <X size={13} />
              </button>
            </div>
            <ul className="mt-3 space-y-2.5">
              {selectedSessions.map((s) => {
                const platform = sessionPlatformLabel(s.url);
                return (
                  <li key={s.id} className="rounded-xl border border-[#DCEBE2] bg-white px-3.5 py-3">
                    <p className="text-[13.5px] font-bold text-[#04330B]">{s.title}</p>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-[12px] font-semibold text-[#6B8F7A]">
                      {s.scheduledAt ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={13} />
                          {new Date(s.scheduledAt).toLocaleTimeString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : null}
                      {platform ? <span>{platform}</span> : null}
                    {s.venue ? <span>{s.venue}</span> : null}
                    </div>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B5A2A] hover:underline"
                      >
                        {isHi ? "सत्र जॉइन करें" : "Join Session"} <ExternalLink size={12} />
                      </a>
                    ) : null}
                    {checkedIn.has(s.id) ? (
                      <p className="mt-2 text-[12px] font-bold text-[#0B5A2A]">
                        {isHi ? "चेक-इन हो चुका है" : "Checked in"}
                      </p>
                    ) : canCheckIn(s.scheduledAt) ? (
                      <button
                        type="button"
                        onClick={() => checkIn(s.id)}
                        disabled={checkInBusy === s.id}
                        className="mt-2 h-8 px-3 rounded-lg bg-[#04330B] text-white text-[12px] font-bold disabled:opacity-50"
                      >
                        {checkInBusy === s.id
                          ? isHi
                            ? "दर्ज हो रहा है…"
                            : "Checking in…"
                          : isHi
                            ? "उपस्थिति दर्ज करें"
                            : "Check in"}
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="text-[16px] font-bold text-[#04330B] flex items-center gap-2 mb-4">
          <Radio size={17} className="text-[#0B5A2A]" /> {isHi ? "लाइव सत्र" : "Live Sessions"}
        </h2>
        {live.length === 0 ? (
          <PortalEmptyState
            art="sessions"
            title={isHi ? "कोई आगामी लाइव सत्र नहीं" : "No upcoming live sessions"}
            description={
              isHi
                ? "नए सत्र शेड्यूल होते ही कैलेंडर में दिखेंगे।"
                : "New sessions will show up on the calendar as soon as they're scheduled."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {live.map((c) => {
              const platform = sessionPlatformLabel(c.url);
              return (
                <article key={c.id} className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
                  <h3 className="text-[15px] font-bold text-[#04330B]">{c.title}</h3>
                  {c.description ? (
                    <p className="mt-1 text-[12.5px] text-[#4F6B5C] font-medium">{c.description}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-semibold text-[#6B8F7A]">
                    {c.scheduledAt ? (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={13} />
                          {new Date(c.scheduledAt).toLocaleDateString(locale)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={13} />
                          {new Date(c.scheduledAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </>
                    ) : null}
                    {platform ? <span>{platform}</span> : null}
                    {c.venue ? <span>{c.venue}</span> : null}
                  </div>
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B5A2A] hover:underline"
                    >
                      {isHi ? "सत्र जॉइन करें" : "Join Session"} <ExternalLink size={12} />
                    </a>
                  ) : null}
                  {checkedIn.has(c.id) ? (
                    <p className="mt-3 text-[12px] font-bold text-[#0B5A2A]">
                      {isHi ? "चेक-इन हो चुका है" : "Checked in"}
                    </p>
                  ) : canCheckIn(c.scheduledAt) ? (
                    <button
                      type="button"
                      onClick={() => checkIn(c.id)}
                      disabled={checkInBusy === c.id}
                      className="mt-3 h-9 px-3 rounded-lg bg-[#04330B] text-white text-[13px] font-bold disabled:opacity-50"
                    >
                      {checkInBusy === c.id
                        ? isHi
                          ? "दर्ज हो रहा है…"
                          : "Checking in…"
                        : isHi
                          ? "उपस्थिति दर्ज करें"
                          : "Check in"}
                    </button>
                  ) : (
                    <p className="mt-3 text-[12px] font-medium text-[#6B8F7A]">
                      {isHi
                        ? "चेक-इन सत्र से 2 घंटे पहले खुलता है।"
                        : "Check-in opens two hours before the session."}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-[16px] font-bold text-[#04330B] flex items-center gap-2 mb-4">
          <PlayCircle size={17} className="text-[#0B5A2A]" /> {isHi ? "रिकॉर्डेड लाइब्रेरी" : "Recorded Library"}
        </h2>
        {recorded.length === 0 ? (
          <PortalEmptyState
            art="library"
            title={isHi ? "अभी कोई रिकॉर्डेड कक्षा नहीं" : "No recorded classes yet"}
            description={
              isHi
                ? "बीते सत्रों की रिकॉर्डिंग यहाँ जुड़ती जाएँगी।"
                : "Recordings of past sessions will be added here."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recorded.map((c) => (
              <article key={c.id} className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
                <h3 className="text-[15px] font-bold text-[#04330B]">{c.title}</h3>
                {c.description ? <p className="mt-1 text-[12.5px] text-[#4F6B5C] font-medium">{c.description}</p> : null}
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B5A2A] hover:underline"
                  >
                    {isHi ? "सेशन देखें" : "Watch session"} <ExternalLink size={12} />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

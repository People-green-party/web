"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock3,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Lock,
  MapPin,
  Play,
  Route,
  Users,
  Video,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "./InternPortalContext";
import PortalEmptyState from "./PortalEmptyState";
import {
  attendanceProgress,
  deptLabel,
  firstName,
  initialsFromName,
  sessionPlatformLabel,
  taskProgress,
  upcomingLiveSessions,
} from "./types";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[14px] border border-[#E3EDE7] bg-white shadow-[0_1px_3px_rgba(15,46,28,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  actionHref,
  actionLabel,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3.5">
      <h2 className="text-[15px] font-bold text-[#0F2E1C]">{title}</h2>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="text-[12px] font-semibold text-[#0B5A2A] hover:underline">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function StatIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-9 w-9 rounded-[10px] bg-[#E8F5EC] text-[#0B5A2A] flex items-center justify-center shrink-0">
      {children}
    </div>
  );
}

export function DashboardHome() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading, error, refresh } = useInternPortal();

  if (loading && !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#6B8F7A] font-semibold text-sm">
        {isHi ? "डैशबोर्ड लोड हो रहा है…" : "Loading dashboard…"}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="p-8 text-center">
          <p className="text-[#B91C1C] font-semibold">{error || (isHi ? "डेटा उपलब्ध नहीं" : "Unable to load")}</p>
          <button
            type="button"
            onClick={() => refresh()}
            className="mt-4 rounded-xl bg-[#04330B] px-4 py-2 text-sm font-bold text-white"
          >
            {isHi ? "फिर कोशिश करें" : "Try again"}
          </button>
        </Card>
      </div>
    );
  }

  const app = data.application;
  const name = firstName(app.fullName);
  const tasks = taskProgress(data);
  const attendance = attendanceProgress(data);
  const live = upcomingLiveSessions(data);
  const nextLive = live[0] || null;
  const nextLivePlatform = sessionPlatformLabel(nextLive?.url);
  const track = deptLabel(app.department, isHi ? "hi" : "en");
  const hasCert = Boolean(app.certificateUrl);
  const certEligible = Boolean(data.summary?.certificateEligible);

  const openTasks = data.tasks.filter((t) => t.status !== "completed");
  const moduleItems = [
    ...data.tasks
      .filter((t) => t.status === "completed")
      .slice(0, 2)
      .map((t) => ({ title: t.task.title, state: "done" as const })),
    ...openTasks.slice(0, 1).map((t) => ({ title: t.task.title, state: "current" as const })),
    ...openTasks.slice(1, 3).map((t) => ({ title: t.task.title, state: "locked" as const })),
  ];

  /**
   * Where a task stands beats how soon it is due: once it is submitted or sent
   * back, a deadline countdown is the wrong thing to show.
   */
  const taskBadge = (status: string, dueAt?: string | null) => {
    if (status === "completed") {
      return { label: isHi ? "पूर्ण" : "Completed", cls: "bg-[#E8F5EC] text-[#0B5A2A]" };
    }
    if (status === "submitted") {
      return { label: isHi ? "समीक्षा में" : "Under review", cls: "bg-[#E8F1FF] text-[#1D4ED8]" };
    }
    if (status === "rejected") {
      return { label: isHi ? "फिर से करना है" : "Needs rework", cls: "bg-red-50 text-red-700" };
    }
    if (dueAt) {
      const days = Math.ceil((new Date(dueAt).getTime() - Date.now()) / 86400000);
      if (days < 0) return { label: isHi ? "समय सीमा पार" : "Overdue", cls: "bg-red-50 text-red-700" };
      if (days <= 3) {
        return {
          label: isHi ? `${days} दिन में देय` : `Due in ${days} day${days === 1 ? "" : "s"}`,
          cls: "bg-[#FFF4E5] text-[#C2410C]",
        };
      }
    }
    return { label: isHi ? "आगामी" : "Upcoming", cls: "bg-[#EEF2FF] text-[#4338CA]" };
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_292px] gap-4 lg:gap-5">
        <div className="space-y-4 min-w-0">
          {/* Welcome — match reference banner */}
          <div className="relative overflow-hidden rounded-[16px] border border-[#D4EBD9] bg-[#EAF7EE]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              <img
                src="/internship/portal/welcome-leaves-center.png"
                alt=""
                className="h-[135%] w-auto max-w-[70%] translate-y-[16%] object-contain opacity-50 select-none"
              />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 py-5 sm:py-6">
              <div className="min-w-0 max-w-xl">
                <h1 className="text-[22px] sm:text-[24px] font-bold text-[#04330B] tracking-tight">
                  {isHi ? `वापसी पर स्वागत है, ${name}! 👋` : `Welcome back, ${name}! 👋`}
                </h1>
                <p className="mt-1.5 text-[13px] sm:text-[14px] font-medium text-[#4F6B5C] leading-relaxed">
                  {isHi
                    ? "सीखते रहें, योगदान देते रहें — हरित और बेहतर भारत के लिए।"
                    : "Keep learning, keep contributing for a Green & Better Bharat."}
                </p>
              </div>
              <div className="relative shrink-0 rounded-[12px] border border-[#C9E6D4] bg-white/95 px-4 py-3 shadow-sm max-w-[220px]">
                <span className="absolute -top-2.5 -right-2.5 h-8 w-8 overflow-hidden rounded-md shadow-sm border border-[#D4EBD9] bg-[#EAF7EE]">
                  <img
                    src="/internship/portal/leaf-icon-v2.png"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <p className="text-[12.5px] font-semibold italic text-[#0B5A2A] leading-snug pr-5">
                  “{isHi ? "छोटे प्रयास। बड़ा बदलाव।" : "Small efforts. Big change."}”
                </p>
                <p className="mt-1 text-[11px] font-bold text-[#6B8F7A]">— PGP</p>
              </div>
            </div>
          </div>

          {/* Stats with icons like reference */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: isHi ? "प्रोग्राम प्रगति" : "Program Progress",
                value: `${tasks.pct}%`,
                sub: isHi ? "ट्रैक पर" : "On track",
                bar: tasks.pct,
                icon: <GraduationCap size={16} />,
              },
              {
                label: isHi ? "कक्षा उपस्थिति" : "Classes Attended",
                value: attendance.total > 0 ? `${attendance.present} / ${attendance.total}` : "—",
                sub: isHi ? "अब तक कुल" : "All time",
                icon: <BookOpen size={16} />,
              },
              {
                label: isHi ? "पूर्ण कार्य" : "Tasks Completed",
                value: `${tasks.completed} / ${tasks.total || 0}`,
                sub: isHi ? "अब तक कुल" : "All time",
                icon: <ClipboardList size={16} />,
              },
              {
                label: isHi ? "प्रमाणपत्र" : "Certificate",
                value: hasCert
                  ? isHi
                    ? "तैयार"
                    : "Ready"
                  : certEligible
                    ? isHi
                      ? "पात्र"
                      : "Eligible"
                    : isHi
                      ? "प्रगति में"
                      : "In Progress",
                sub: hasCert
                  ? isHi
                    ? "डाउनलोड उपलब्ध"
                    : "Download available"
                  : certEligible
                    ? isHi
                      ? "जारी होने की प्रतीक्षा"
                      : "Waiting for issue"
                    : isHi
                      ? "सभी आवश्यकताएँ पूरी करें"
                      : "Complete all requirements",
                icon: <Award size={16} />,
              },
            ].map((s) => (
              <Card key={s.label} className="p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11.5px] font-semibold text-[#6B8F7A] leading-snug">{s.label}</p>
                  <StatIcon>{s.icon}</StatIcon>
                </div>
                <p className="mt-2.5 text-[22px] font-bold text-[#04330B] tabular-nums leading-none">{s.value}</p>
                {"bar" in s && typeof s.bar === "number" ? (
                  <div className="mt-2.5 h-1.5 rounded-full bg-[#E8F5EC] overflow-hidden">
                    <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${s.bar}%` }} />
                  </div>
                ) : (
                  <div className="mt-2.5 h-1.5" />
                )}
                <p className="mt-2 text-[11px] font-medium text-[#6B8F7A]">{s.sub}</p>
              </Card>
            ))}
          </div>

          {/* Next Live Session — sprout image from reference */}
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative p-5 sm:p-6 bg-[#EAF7EE] min-h-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0B5A2A]">
                    <Video size={14} />
                    {isHi ? "अगला लाइव सत्र" : "Next Live Session"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0B5A2A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#86EFAC]" />
                    {isHi ? "जल्द लाइव" : "Live Soon"}
                  </span>
                </div>

                {nextLive ? (
                  <>
                    <h3 className="mt-3 text-[18px] sm:text-[19px] font-bold text-[#04330B] leading-snug max-w-md">
                      {nextLive.title}
                    </h3>
                    {nextLive.description ? (
                      <p className="mt-2 text-[13px] font-medium text-[#4F6B5C] line-clamp-2 max-w-md">
                        {nextLive.description}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-semibold text-[#4F6B5C]">
                      {nextLive.scheduledAt ? (
                        <>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={14} className="text-[#0B5A2A]" />
                            {new Date(nextLive.scheduledAt).toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={14} className="text-[#0B5A2A]" />
                            {new Date(nextLive.scheduledAt).toLocaleTimeString(locale, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#0B5A2A]" />
                        {isHi ? "ऑनलाइन" : "Online"}
                        {nextLivePlatform ? ` — ${nextLivePlatform}` : ""}
                      </span>
                    </div>
                    {nextLive.url ? (
                      <a
                        href={nextLive.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#0B5A2A]"
                      >
                        <Play size={13} fill="currentColor" />
                        {isHi ? "सत्र जॉइन करें" : "Join Session"}
                      </a>
                    ) : (
                      <p className="mt-5 text-[12.5px] font-semibold text-[#6B8F7A]">
                        {isHi ? "जॉइन लिंक जल्द जोड़ा जाएगा।" : "Join link will be added soon."}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="mt-4">
                    <h3 className="text-[18px] font-bold text-[#04330B]">
                      {isHi ? "कोई आगामी लाइव सत्र नहीं" : "No upcoming live sessions"}
                    </h3>
                    <p className="mt-2 text-[13px] font-medium text-[#4F6B5C] max-w-sm">
                      {isHi
                        ? "अपने अगले सत्र के लिए बाद में जाँच करें।"
                        : "Check back later for your next session."}
                    </p>
                  </div>
                )}
              </div>
              {/* photo panel shares the mint of the text panel so the fade leaves no seam */}
              <div className="relative h-[200px] md:h-auto md:min-h-[220px] overflow-hidden bg-[#EAF7EE]">
                <img
                  src="/internship/portal/session-sprout-v3.jpg"
                  alt=""
                  className="portal-session-photo absolute inset-0 block h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </Card>

          {/* Module + Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 sm:p-5 flex flex-col">
              <SectionTitle
                title={isHi ? "आपका वर्तमान मॉड्यूल" : "Your Current Module"}
                actionHref="/internship/dashboard/program"
                actionLabel={isHi ? "सभी देखें" : "View All"}
              />
              <div className="flex gap-3 items-start">
                <div className="h-[76px] w-[100px] shrink-0 overflow-hidden rounded-[10px] border border-[#E3EDE7] bg-[#EAF7EE]">
                  <img
                    src="/internship/portal/module-sprout-v3.jpg"
                    alt=""
                    className="block h-full w-full object-cover object-center"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-[#04330B] leading-snug">{track}</p>
                  <p className="mt-0.5 text-[11.5px] font-semibold text-[#6B8F7A]">
                    {isHi ? "विभाग ट्रैक" : "Department track"}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#6B8F7A]">
                    <span>{isHi ? "प्रगति" : "Progress"}</span>
                    <span className="text-[#0B5A2A]">{tasks.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-[6px] rounded-full bg-[#E8F5EC] overflow-hidden">
                    <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${tasks.pct}%` }} />
                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2.5 flex-1">
                {moduleItems.length === 0 ? (
                  <li>
                    <PortalEmptyState
                      bordered={false}
                      size="sm"
                      className="!py-4"
                      art="sprout"
                      title={isHi ? "अभी कोई मॉड्यूल आइटम नहीं" : "No module items yet"}
                    />
                  </li>
                ) : (
                  moduleItems.map((item, idx) => (
                    <li key={`${item.title}-${idx}`} className="flex items-start gap-2.5 text-[13px]">
                      {item.state === "done" ? (
                        <span className="mt-0.5 h-[16px] w-[16px] rounded-[4px] bg-[#0B5A2A] text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 size={11} />
                        </span>
                      ) : item.state === "current" ? (
                        <Circle size={16} className="text-[#0B5A2A] mt-0.5 shrink-0" />
                      ) : (
                        <Lock size={14} className="text-[#94A3B8] mt-0.5 shrink-0" />
                      )}
                      <span
                        className={`font-semibold leading-snug ${
                          item.state === "done"
                            ? "text-[#6B8F7A] line-through"
                            : item.state === "locked"
                              ? "text-[#94A3B8]"
                              : "text-[#04330B]"
                        }`}
                      >
                        {item.title}
                      </span>
                    </li>
                  ))
                )}
              </ul>

              <Link
                href="/internship/dashboard/tasks"
                className="mt-4 inline-flex w-full items-center justify-center rounded-[10px] bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#0B5A2A]"
              >
                {isHi ? "सीखना जारी रखें →" : "Continue Learning →"}
              </Link>
            </Card>

            <Card className="p-4 sm:p-5 flex flex-col">
              <SectionTitle
                title={isHi ? "मेरे कार्य" : "My Tasks"}
                actionHref="/internship/dashboard/tasks"
                actionLabel={isHi ? "सभी देखें" : "View All"}
              />
              <ul className="space-y-2.5 flex-1">
                {data.tasks.length === 0 ? (
                  <li>
                    <PortalEmptyState
                      size="sm"
                      className="!rounded-[12px]"
                      art="tasks"
                      title={isHi ? "अभी कोई कार्य असाइन नहीं हुआ" : "No tasks assigned yet"}
                      description={
                        isHi ? "नए कार्य यहाँ दिखेंगे।" : "New tasks will land here."
                      }
                    />
                  </li>
                ) : (
                  data.tasks.slice(0, 5).map((t) => {
                    const badge = taskBadge(t.status, t.task.dueAt);
                    const done = t.status === "completed";
                    return (
                      <li
                        key={t.assignmentId}
                        className="flex items-start gap-2.5 rounded-[12px] border border-[#EAF2EC] px-3 py-2.5"
                      >
                        {done ? (
                          <span className="mt-0.5 h-[16px] w-[16px] rounded-[4px] bg-[#0B5A2A] text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 size={11} />
                          </span>
                        ) : (
                          <span className="mt-0.5 h-[16px] w-[16px] rounded-[4px] border border-[#C9D8CF] shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[13px] font-bold leading-snug ${
                              done ? "text-[#6B8F7A] line-through" : "text-[#04330B]"
                            }`}
                          >
                            {t.task.title}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
              <div className="mt-3 rounded-[12px] border border-[#D4EBD9] bg-[#EAF7EE] px-3 py-2.5 text-[12px] font-medium text-[#0B5A2A] flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0" />
                <span>
                  {isHi
                    ? "टिप: समय पर प्रूफ जमा करें ताकि मेंटर समीक्षा जल्दी हो।"
                    : "Tip: Submit proof on time so mentor review stays on schedule."}
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Right column */}
        <aside className="space-y-4 min-w-0">
          <Card className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14px] font-bold text-[#04330B]">{isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}</p>
              <Link
                href="/internship/dashboard/profile"
                className="text-[12px] font-semibold text-[#0B5A2A] hover:underline"
              >
                {isHi ? "संपादित करें" : "Edit"}
              </Link>
            </div>
            <div className="mt-3.5 flex flex-col items-center text-center">
              {app.photoUrl ? (
                <img
                  src={app.photoUrl}
                  alt=""
                  className="h-[64px] w-[64px] rounded-full object-cover border border-[#DCEBE2]"
                />
              ) : (
                <div className="h-[64px] w-[64px] rounded-full bg-[#0B5A2A] text-white text-[18px] font-bold flex items-center justify-center">
                  {initialsFromName(app.fullName)}
                </div>
              )}
              <p className="mt-2.5 text-[15px] font-bold text-[#04330B]">{app.fullName}</p>
              <p className="text-[12px] font-semibold text-[#6B8F7A]">
                {isHi ? "पीजीपी इंटर्न" : "PGP Intern"}
              </p>
            </div>
            <dl className="mt-4 space-y-2.5 text-[12.5px]">
              {[
                {
                  label: isHi ? "स्थान" : "Location",
                  value: app.city || "—",
                  icon: <MapPin size={13} className="text-[#0B5A2A]" />,
                },
                {
                  label: isHi ? "संगठन" : "Organisation",
                  value: app.college || "—",
                  icon: <Building2 size={13} className="text-[#0B5A2A]" />,
                },
                {
                  label: isHi ? "ट्रैक" : "Track",
                  value: track,
                  icon: <Route size={13} className="text-[#0B5A2A]" />,
                },
                {
                  label: isHi ? "जॉइन तिथि" : "Join Date",
                  value: app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—",
                  icon: <CalendarDays size={13} className="text-[#0B5A2A]" />,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-lg bg-[#EAF7EE] flex items-center justify-center shrink-0">
                    {row.icon}
                  </span>
                  <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                    <dt className="text-[#6B8F7A] font-semibold">{row.label}</dt>
                    <dd className="font-bold text-[#04330B] text-right truncate">{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-4 sm:p-5">
            <SectionTitle
              title={isHi ? "आगामी सत्र" : "Upcoming Sessions"}
              actionHref="/internship/dashboard/classes"
              actionLabel={isHi ? "कैलेंडर देखें" : "View Calendar"}
            />
            {live.length === 0 ? (
              <PortalEmptyState
                bordered={false}
                size="sm"
                className="!py-4"
                art="sessions"
                title={isHi ? "कोई आगामी सत्र नहीं" : "No upcoming sessions"}
              />
            ) : (
              <ul className="space-y-3">
                {live.slice(0, 3).map((s) => (
                  <li key={s.id} className="flex gap-3">
                    <div className="h-12 w-12 rounded-[10px] bg-[#EAF7EE] text-[#0B5A2A] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold uppercase tracking-wide">
                        {s.scheduledAt
                          ? new Date(s.scheduledAt).toLocaleDateString(locale, { month: "short" })
                          : "—"}
                      </span>
                      <span className="text-[15px] font-bold leading-none">
                        {s.scheduledAt ? new Date(s.scheduledAt).getDate() : "•"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#04330B] line-clamp-2">{s.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {s.scheduledAt ? (
                          <span className="text-[11px] font-medium text-[#6B8F7A]">
                            {new Date(s.scheduledAt).toLocaleTimeString(locale, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : null}
                        <span className="rounded-full bg-[#E8F5EC] px-2 py-0.5 text-[10px] font-bold text-[#0B5A2A]">
                          {isHi ? "ऑनलाइन" : "Online"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div>
            <p className="mb-2.5 text-[14px] font-bold text-[#04330B]">
              {isHi ? "त्वरित लिंक" : "Quick Links"}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  href: "/internship/dashboard/classes",
                  label: isHi ? "लाइव सत्र" : "Live Sessions",
                  icon: Video,
                },
                {
                  href: "/internship/dashboard/resources",
                  label: isHi ? "रिसोर्स" : "Resource Library",
                  icon: BookOpen,
                },
                {
                  href: "/internship/dashboard/mentors",
                  label: isHi ? "मेंटर" : "Mentors",
                  icon: Users,
                },
                {
                  href: "https://peoplesgreen.org",
                  label: isHi ? "पीजीपी वेबसाइट" : "PGP Website",
                  icon: ExternalLink,
                  external: true,
                },
              ].map((q) => {
                const Icon = q.icon;
                const cls =
                  "rounded-[12px] border border-[#E3EDE7] bg-white p-3 shadow-[0_1px_2px_rgba(15,46,28,0.04)] hover:border-[#B9D3C4] transition-colors";
                const inner = (
                  <>
                    <Icon size={15} className="text-[#0B5A2A]" />
                    <p className="mt-2 text-[11.5px] font-bold text-[#04330B] leading-snug">{q.label}</p>
                  </>
                );
                return q.external ? (
                  <a key={q.href} href={q.href} target="_blank" rel="noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link key={q.href} href={q.href} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

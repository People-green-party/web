"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Circle,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  attendanceProgress,
  completedTasks,
  deptLabel,
  formatUnlockWhen,
  initialsFromName,
  modeLabel,
  moduleProgress,
  pickLocaleText,
  sortedModules,
  taskDayLabel,
  taskProgress,
  ticketStatusLabel,
  type CertificateStatus,
  type InternDash,
} from "@/components/internship/portal/types";
import { internFetch } from "@/lib/internApi";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

export default function InternProfilePage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const lang = isHi ? "hi" : "en";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading, refresh } = useInternPortal();
  const app = data?.application;
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [tickets, setTickets] = useState<
    { id: number; subject: string; message: string; status: string; adminReply?: string | null; createdAt: string }[]
  >([]);

  useEffect(() => {
    if (!app) return;
    setFullName(app.fullName || "");
    setCity(app.city || "");
    setCollege(app.college || "");
    setEmail(app.email || "");
  }, [app]);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await internFetch("internship/me/help-tickets");
        setTickets(Array.isArray(rows) ? rows : []);
      } catch {
        setTickets([]);
      }
    })();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast(isHi ? "पूरा नाम आवश्यक है" : "Full name is required");
      return;
    }
    setSaving(true);
    try {
      await internFetch("internship/me/profile", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: fullName.trim(),
          city: city.trim() || null,
          college: college.trim() || null,
          email: email.trim() || null,
        }),
      });
      showToast(isHi ? "प्रोफ़ाइल सेव हो गई" : "Profile saved");
      await refresh();
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : isHi ? "सेव असफल" : "Save failed",
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (file: File | null) => {
    if (!file) return;
    setPhotoBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await internFetch("internship/me/profile/photo", {
        method: "POST",
        body: fd,
      });
      showToast(isHi ? "फोटो अपडेट हो गई" : "Photo updated");
      await refresh();
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : isHi ? "अपलोड असफल" : "Upload failed",
      );
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const tasks = taskProgress(data);
  const attendance = attendanceProgress(data);
  const modules = moduleProgress(data);
  const cert = data?.summary?.certificate;
  const hasCert = Boolean(app?.certificateUrl);
  const certEligible = Boolean(cert?.eligible ?? data?.summary?.certificateEligible);
  const remainingTasks = useMemo(
    () =>
      (data?.tasks || [])
        .filter((t) => t.status !== "completed" && t.status !== "submitted")
        .sort((a, b) => (a.task.dueAfterDays ?? 0) - (b.task.dueAfterDays ?? 0)),
    [data],
  );
  const doneTasks = useMemo(
    () =>
      completedTasks(data).sort((a, b) => {
        const ta = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const tb = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return tb - ta;
      }),
    [data],
  );
  const remainingModules = useMemo(
    () => sortedModules(data).filter((m) => m.status !== "done"),
    [data],
  );

  if (loading && !app) {
    return (
      <div className="p-8 font-semibold text-[#6B8F7A]">
        {isHi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-8 font-semibold text-[#B91C1C]">
        {isHi ? "प्रोफ़ाइल नहीं मिली" : "Profile not found"}
      </div>
    );
  }

  const track = deptLabel(app.department, lang);
  const attReq = cert?.requirements.attendance.required ?? 75;
  const attFloor = cert?.requirements.attendance.requiredClasses ?? 3;

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {toast ? (
        <div className="rounded-xl bg-[#04330B] px-4 py-2 text-sm font-semibold text-white">
          {toast}
        </div>
      ) : null}

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B8F7A]">
            {isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}
          </p>
          <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#04330B]">
            {isHi ? "आपकी जानकारी और प्रगति" : "Your details and progress"}
          </h1>
          <p className="mt-1 text-[13px] font-medium text-[#4F6B5C]">
            {isHi
              ? `ट्रैक: ${track} · यहाँ देखें क्या बचा है प्रमाणपत्र के लिए`
              : `Track: ${track} · See what is left before your certificate`}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label={isHi ? "प्रोग्राम प्रगति" : "Program Progress"}
          value={`${tasks.pct}%`}
          sub={isHi ? "ट्रैक पर" : "On track"}
          bar={tasks.pct}
          icon={<GraduationCap size={16} />}
        />
        <StatCard
          label={isHi ? "कक्षा उपस्थिति" : "Classes Attended"}
          value={attendance.total > 0 ? `${attendance.present} / ${attendance.total}` : "—"}
          sub={isHi ? "अब तक कुल" : "All time"}
          icon={<BookOpen size={16} />}
        />
        <StatCard
          label={isHi ? "पूर्ण कार्य" : "Tasks Completed"}
          value={`${tasks.completed} / ${tasks.total || 0}`}
          sub={isHi ? "अब तक कुल" : "All time"}
          icon={<ClipboardList size={16} />}
        />
        <StatCard
          label={isHi ? "प्रमाणपत्र" : "Certificate"}
          value={
            hasCert
              ? isHi
                ? "तैयार"
                : "Ready"
              : certEligible
                ? isHi
                  ? "पात्र"
                  : "Eligible"
                : isHi
                  ? "प्रगति में"
                  : "In Progress"
          }
          sub={
            hasCert
              ? isHi
                ? "डाउनलोड उपलब्ध"
                : "Download available"
              : isHi
                ? "सभी शर्तें पूरी करें"
                : "Complete all requirements"
          }
          icon={<Award size={16} />}
        />
      </div>

      <CertificateBlocker
        isHi={isHi}
        lang={lang}
        hasCert={hasCert}
        certUrl={app.certificateUrl}
        certEligible={certEligible}
        cert={cert}
        remainingTasks={remainingTasks}
        remainingModules={remainingModules}
        attReq={attReq}
        attFloor={attFloor}
        attendance={attendance}
        modules={modules}
        tasks={tasks}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
        <section className="rounded-2xl border border-[#DCEBE2] bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#04330B]">
            {isHi ? "व्यक्तिगत जानकारी" : "Personal details"}
          </h2>
          <p className="mt-1 text-[12.5px] font-medium text-[#6B8F7A]">
            {isHi ? "नाम, ईमेल, शहर — यहाँ बदल सकते हैं।" : "Name, email, city — you can edit these here."}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative">
              {app.photoUrl ? (
                <img
                  src={app.photoUrl}
                  alt=""
                  className="h-20 w-20 rounded-full object-cover border border-[#DCEBE2]"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0B5A2A] text-lg font-bold text-white">
                  {initialsFromName(fullName || app.fullName)}
                </div>
              )}
              <button
                type="button"
                disabled={photoBusy}
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#04330B] text-white disabled:opacity-50"
                title={isHi ? "फोटो अपडेट करें" : "Update photo"}
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void uploadPhoto(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#04330B]">{fullName || app.fullName}</p>
              <p className="text-[13px] font-semibold text-[#6B8F7A]">{track}</p>
              <button
                type="button"
                disabled={photoBusy}
                onClick={() => fileRef.current?.click()}
                className="mt-1 text-[12px] font-bold text-[#0B5A2A] hover:underline disabled:opacity-50"
              >
                {photoBusy
                  ? isHi
                    ? "अपलोड हो रहा है…"
                    : "Uploading…"
                  : isHi
                    ? "प्रोफ़ाइल फोटो बदलें"
                    : "Change profile photo"}
              </button>
            </div>
          </div>

          <form onSubmit={save} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "पूरा नाम" : "Full name"}</span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "ईमेल" : "Email"}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "शहर" : "City"}</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[12px] font-semibold text-[#6B8F7A]">
                {isHi ? "कॉलेज / संगठन" : "College / Organisation"}
              </span>
              <input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="h-11 rounded-xl bg-[#04330B] px-5 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? (isHi ? "सेव हो रहा है…" : "Saving…") : isHi ? "सेव करें" : "Save profile"}
              </button>
            </div>
          </form>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#EAF2EC] pt-5">
            <ReadonlyField label={isHi ? "विभाग ट्रैक" : "Department track"} value={track} />
            <ReadonlyField label={isHi ? "मोड" : "Mode"} value={modeLabel(app.mode, lang)} />
            <ReadonlyField
              label={isHi ? "फ़ोन" : "Phone"}
              value={app.phone || "—"}
            />
            <ReadonlyField
              label={isHi ? "जॉइन तिथि" : "Join date"}
              value={
                app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </dl>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-bold text-[#04330B]">
                {isHi ? "बचे हुए कार्य" : "Tasks still to do"}
              </h2>
              <Link
                href="/internship/dashboard/tasks"
                className="text-[12px] font-bold text-[#0B5A2A] hover:underline"
              >
                {isHi ? "मेरे कार्य →" : "My Tasks →"}
              </Link>
            </div>
            <p className="mt-1 text-[12.5px] font-medium text-[#6B8F7A]">
              {isHi
                ? `प्रमाणपत्र तभी मिलेगा जब ${tasks.total || 0} में से सभी कार्य पूरे हों।`
                : `Certificate only after all ${tasks.total || 0} tasks are done.`}
            </p>
            {remainingTasks.length === 0 ? (
              <p className="mt-4 rounded-xl bg-[#E8F5EC] px-4 py-3 text-[13px] font-semibold text-[#0B5A2A]">
                {isHi ? "सारे कार्य पूरे हो चुके।" : "All tasks are complete."}
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-[#E8F0EB]">
                {remainingTasks.map((item) => {
                  const day = taskDayLabel(item.task.dueAfterDays, isHi);
                  return (
                    <li key={item.assignmentId} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      {item.locked ? (
                        <Lock size={15} className="mt-0.5 shrink-0 text-[#94A3B8]" />
                      ) : (
                        <Circle size={15} className="mt-0.5 shrink-0 text-[#0B5A2A]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-bold text-[#04330B]">
                          {pickLocaleText(item.task.title, lang)}
                        </p>
                        <p className="mt-0.5 text-[11.5px] font-medium text-[#6B8F7A]">
                          {day ? `${day} · ` : ""}
                          {item.locked
                            ? item.opensAt
                              ? isHi
                                ? `${formatUnlockWhen(item.opensAt, "hi")} को खुलेगा`
                                : `Opens ${formatUnlockWhen(item.opensAt, "en")}`
                              : isHi
                                ? "अभी लॉक"
                                : "Locked for now"
                            : isHi
                              ? "आज जमा कर सकते हैं"
                              : "You can submit this now"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-[#04330B]">
              {isHi ? "पूरे हो चुके कार्य — इतिहास" : "Completed tasks — history"}
            </h2>
            {doneTasks.length === 0 ? (
              <p className="mt-3 text-[13px] font-medium text-[#6B8F7A]">
                {isHi ? "अभी कोई कार्य पूरा नहीं हुआ।" : "No tasks completed yet."}
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {doneTasks.map((item) => (
                  <li
                    key={item.assignmentId}
                    className="flex items-start gap-3 rounded-xl border border-[#EAF2EC] bg-[#F8FBF9] px-3 py-2.5"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#16A34A]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-bold text-[#04330B]">
                        {pickLocaleText(item.task.title, lang)}
                      </p>
                      <p className="mt-0.5 text-[11.5px] font-medium text-[#6B8F7A]">
                        {taskDayLabel(item.task.dueAfterDays, isHi)}
                        {item.completedAt
                          ? ` · ${new Date(item.completedAt).toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short",
                            })}`
                          : ""}
                      </p>
                    </div>
                    {item.proofUrl ? (
                      <a
                        href={item.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-[11px] font-bold text-[#0B5A2A] hover:underline"
                      >
                        {isHi ? "प्रूफ" : "Proof"}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#04330B]">
          {isHi ? "मेरे मदद अनुरोध" : "My help requests"}
        </h2>
        {tickets.length === 0 ? (
          <PortalEmptyState
            bordered={false}
            size="sm"
            art="sprout"
            title={isHi ? "अभी कोई मदद अनुरोध नहीं" : "No help requests yet"}
            description={
              isHi
                ? "साइडबार में Need Help से कभी भी सवाल पूछें।"
                : "Use Need Help in the sidebar to ask a question anytime."
            }
          />
        ) : (
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-xl border border-[#EAF2EC] p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold text-[#04330B]">{t.subject}</p>
                  <span className="rounded-full bg-[#EAF7EE] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#0B5A2A]">
                    {ticketStatusLabel(t.status, lang)}
                  </span>
                </div>
                <p className="mt-1 text-[12px] font-medium text-[#4F6B5C]">{t.message}</p>
                {t.adminReply ? (
                  <p className="mt-2 rounded-lg bg-[#F5FBF7] px-2.5 py-2 text-[12px] font-semibold text-[#04330B]">
                    {isHi ? "एडमिन जवाब: " : "Admin reply: "}
                    {t.adminReply}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  bar,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  bar?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#DCEBE2] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11.5px] font-semibold leading-snug text-[#6B8F7A]">{label}</p>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E8F5EC] text-[#0B5A2A]">
          {icon}
        </div>
      </div>
      <p className="mt-2.5 text-[22px] font-bold tabular-nums leading-none text-[#04330B]">{value}</p>
      {typeof bar === "number" ? (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#E8F5EC]">
          <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${bar}%` }} />
        </div>
      ) : null}
      <p className="mt-2 text-[11.5px] font-medium text-[#6B8F7A]">{sub}</p>
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] font-semibold text-[#6B8F7A]">{label}</dt>
      <dd className="mt-0.5 text-[13.5px] font-bold text-[#04330B] break-all">{value}</dd>
    </div>
  );
}

function CertificateBlocker({
  isHi,
  lang,
  hasCert,
  certUrl,
  certEligible,
  cert,
  remainingTasks,
  remainingModules,
  attReq,
  attFloor,
  attendance,
  modules,
  tasks,
}: {
  isHi: boolean;
  lang: "en" | "hi";
  hasCert: boolean;
  certUrl?: string | null;
  certEligible: boolean;
  cert?: CertificateStatus;
  remainingTasks: InternDash["tasks"];
  remainingModules: ReturnType<typeof sortedModules>;
  attReq: number;
  attFloor: number;
  attendance: { present: number; total: number };
  modules: { done: number; total: number; pct: number };
  tasks: { completed: number; total: number; pct: number };
}) {
  if (hasCert && certUrl) {
    return (
      <div className="rounded-2xl border-2 border-[#0B5A2A] bg-[#E8F5EC] p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#0B5A2A]">
          {isHi ? "प्रमाणपत्र तैयार" : "Certificate ready"}
        </p>
        <p className="mt-1 text-[18px] font-bold text-[#04330B]">
          {isHi ? "सारी शर्तें पूरी — डाउनलोड करें" : "All requirements met — download it"}
        </p>
        <a
          href={certUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          {isHi ? "प्रमाणपत्र डाउनलोड करें" : "Download certificate"} <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  if (certEligible) {
    return (
      <div className="rounded-2xl border border-[#86EFAC] bg-[#F0FDF4] p-5 sm:p-6">
        <p className="text-[18px] font-bold text-[#04330B]">
          {isHi ? "पात्र — प्रमाणपत्र बन रहा है" : "Eligible — certificate is being prepared"}
        </p>
        <p className="mt-1 text-[13px] font-medium text-[#4F6B5C]">
          {isHi
            ? "सारी शर्तें पूरी हो चुकी हैं। थोड़ी देर में रिफ्रेश करें।"
            : "Requirements are met. Refresh this page in a moment."}
        </p>
      </div>
    );
  }

  const taskMet = cert?.requirements.tasks.met ?? remainingTasks.length === 0;
  const moduleMet = cert?.requirements.modules.met ?? remainingModules.length === 0;
  const attMet = cert?.requirements.attendance.met ?? false;

  return (
    <div className="rounded-2xl border-2 border-[#F59E0B] bg-[#FFFBEB] p-5 sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#92400E]">
        {isHi ? "प्रमाणपत्र अभी नहीं मिलेगा" : "You cannot download the certificate yet"}
      </p>
      <h2 className="mt-1 text-[18px] font-bold text-[#04330B]">
        {isHi
          ? "ये चीज़ें पूरी करो — तभी प्रमाणपत्र आएगा"
          : "Finish these — then the certificate unlocks"}
      </h2>
      <p className="mt-1.5 text-[13px] font-medium text-[#78350F]">
        {isHi
          ? "नीचे जो लाल/खाली है, वही रोक रहा है। हरा हो जाए तो डाउनलोड खुल जाएगा।"
          : "Anything still open below is what is blocking you. When all are green, download appears."}
      </p>

      <ul className="mt-4 grid gap-3 md:grid-cols-3">
        <Gate
          met={taskMet}
          title={isHi ? "सारे कार्य" : "All tasks"}
          detail={
            isHi
              ? `${tasks.completed} / ${tasks.total} पूरे · ${remainingTasks.length} बाकी`
              : `${tasks.completed} / ${tasks.total} done · ${remainingTasks.length} left`
          }
          href="/internship/dashboard/tasks"
          cta={isHi ? "कार्य जमा करें" : "Submit tasks"}
        />
        <Gate
          met={moduleMet}
          title={isHi ? "सारे मॉड्यूल" : "All modules"}
          detail={
            isHi
              ? `${modules.done} / ${modules.total} पूरे`
              : `${modules.done} / ${modules.total} done`
          }
          href="/internship/dashboard/program"
          cta={isHi ? "प्रोग्राम खोलें" : "Open program"}
        />
        <Gate
          met={attMet}
          title={isHi ? "लाइव कक्षाएँ" : "Live classes"}
          detail={
            isHi
              ? `${attendance.present} / ${Math.max(attendance.total, attFloor)} · कम से कम ${attFloor} चेक-इन और ${attReq}%`
              : `${attendance.present} / ${Math.max(attendance.total, attFloor)} · at least ${attFloor} check-ins and ${attReq}%`
          }
          href="/internship/dashboard/classes"
          cta={isHi ? "कक्षाएँ खोलें" : "Open classes"}
        />
      </ul>

      {remainingTasks.length > 0 ? (
        <p className="mt-4 text-[13px] font-semibold text-[#04330B]">
          {isHi
            ? `अगला काम: “${pickLocaleText(remainingTasks[0].task.title, lang)}” — My Tasks पर जमा करें।`
            : `Next: “${pickLocaleText(remainingTasks[0].task.title, lang)}” — submit it on My Tasks.`}
        </p>
      ) : null}
    </div>
  );
}

function Gate({
  met,
  title,
  detail,
  href,
  cta,
}: {
  met: boolean;
  title: string;
  detail: string;
  href: string;
  cta: string;
}) {
  return (
    <li
      className={`rounded-xl border px-4 py-3 ${
        met ? "border-[#86EFAC] bg-white" : "border-[#FDE68A] bg-white"
      }`}
    >
      <div className="flex items-start gap-2">
        {met ? (
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#16A34A]" />
        ) : (
          <Circle size={16} className="mt-0.5 shrink-0 text-[#D97706]" />
        )}
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#04330B]">{title}</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#6B8F7A]">{detail}</p>
          {!met ? (
            <Link href={href} className="mt-2 inline-block text-[12px] font-bold text-[#0B5A2A] hover:underline">
              {cta} →
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  );
}

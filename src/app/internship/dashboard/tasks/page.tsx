"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  Lock,
  MessageSquareWarning,
  Upload,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  completedTasks,
  deptLabel,
  formatUnlockWhen,
  pickLocaleText,
  programmeDay,
  taskDayLabel,
  taskKindLabel,
  taskStatusLabel,
  todaysOpenTasks,
  upcomingLockedTasks,
} from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";
import { internFetch } from "@/lib/internApi";

export default function InternTasksPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const lang = isHi ? "hi" : "en";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading, refresh } = useInternPortal();
  const [proofDrafts, setProofDrafts] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const submitProof = async (assignmentId: number) => {
    const proofUrl = (proofDrafts[assignmentId] || "").trim();
    if (!proofUrl) return;
    setBusyId(assignmentId);
    try {
      await internFetch(`internship/me/tasks/${assignmentId}/proof`, {
        method: "POST",
        body: JSON.stringify({ proofUrl }),
      });
      showToast(isHi ? "कार्य पूरा हो गया" : "Task completed");
      await refresh();
    } catch (e: unknown) {
      showToast(
        e instanceof Error
          ? e.message
          : isHi
            ? "सबमिट असफल"
            : "Submit failed",
      );
    } finally {
      setBusyId(null);
    }
  };

  const uploadProof = async (assignmentId: number, file: File | null) => {
    if (!file) return;
    const okType =
      file.type.startsWith("image/") || file.type === "application/pdf";
    if (!okType) {
      showToast(isHi ? "केवल इमेज या PDF" : "Only image or PDF files");
      return;
    }
    setBusyId(assignmentId);
    try {
      const form = new FormData();
      form.append("file", file);
      await internFetch(`internship/me/tasks/${assignmentId}/proof-upload`, {
        method: "POST",
        body: form,
      });
      showToast(isHi ? "कार्य पूरा हो गया" : "Task completed");
      await refresh();
    } catch (e: unknown) {
      showToast(
        e instanceof Error
          ? e.message
          : isHi
            ? "अपलोड असफल"
            : "Upload failed",
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 font-semibold text-[#6B8F7A]">
        {isHi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  const today = todaysOpenTasks(data);
  const upcoming = upcomingLockedTasks(data);
  const done = completedTasks(data);
  const track = data
    ? deptLabel(data.application.department, lang)
    : "—";
  const internDept = data?.application.department;
  const day = programmeDay(data);
  const dayN = data?.schedule?.workingDayNumber ?? day?.day ?? null;

  return (
    <div className="w-full max-w-3xl space-y-5 p-4 sm:p-6 lg:p-8 pb-10">
      {toast ? (
        <div className="rounded-xl bg-[#04330B] px-4 py-2 text-sm font-semibold text-white">
          {toast}
        </div>
      ) : null}

      <header>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#0B5A2A]">
          {dayN
            ? isHi
              ? `आज — दिन ${dayN}`
              : `TODAY — DAY ${dayN}`
            : isHi
              ? "आज"
              : "TODAY"}
        </p>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#04330B]">
          {isHi ? "आज क्या जमा करना है?" : "What to submit today?"}
        </h1>
        <p className="mt-1 text-[13px] font-medium text-[#4F6B5C]">
          {track}
          {isHi ? " · जमा होते ही कार्य पूरा" : " · Submit = complete. No review wait."}
        </p>
      </header>

      {(data?.tasks || []).length === 0 ? (
        <PortalEmptyState
          art="tasks"
          title={isHi ? "अभी कोई कार्य नहीं" : "No tasks assigned yet"}
          description={
            isHi
              ? "स्वीकार होते ही आपके ट्रैक के रोज़ के कार्य यहाँ दिखेंगे।"
              : "Once accepted, your track’s daily tasks appear here."
          }
        />
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#0B5A2A]">
                {isHi ? "आज — ये जमा करें" : "Today — submit these"}
              </h2>
              <span className="text-[12px] font-semibold text-[#6B8F7A]">
                {today.length}
              </span>
            </div>

            {today.length === 0 ? (
              <p className="rounded-xl border border-[#EAF2EC] bg-[#F8FBF9] px-4 py-3 text-[13px] font-medium text-[#6B8F7A]">
                {data?.schedule?.isSundayOff
                  ? isHi
                    ? "आज रविवार — छुट्टी। सोमवार 9:00 IST पर अगला काम।"
                    : "Sunday holiday. Next work Monday 9:00 AM IST."
                  : isHi
                    ? "अभी कोई खुला कार्य नहीं। नीचे “आगे” में देखें अगला कब खुलेगा।"
                    : "Nothing open right now. Check Upcoming for the next unlock."}
              </p>
            ) : (
              today.map((item) => (
                <TaskCard
                  key={item.assignmentId}
                  item={item}
                  isHi={isHi}
                  lang={lang}
                  locale={locale}
                  internDept={internDept}
                  proofDrafts={proofDrafts}
                  setProofDrafts={setProofDrafts}
                  busyId={busyId}
                  submitProof={submitProof}
                  uploadProof={uploadProof}
                />
              ))
            )}
          </section>

          {upcoming.length ? (
            <section className="space-y-2">
              <button
                type="button"
                onClick={() => setShowUpcoming((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-[#EAF2EC] bg-[#F8FBF9] px-4 py-3 text-left"
              >
                <span className="text-[13px] font-bold text-[#6B8F7A]">
                  {isHi
                    ? `आगे के लॉक टास्क (${upcoming.length})`
                    : `Upcoming locked (${upcoming.length})`}
                </span>
                <span className="text-[12px] font-semibold text-[#0B5A2A]">
                  {showUpcoming
                    ? isHi
                      ? "छुपाएँ"
                      : "Hide"
                    : isHi
                      ? "दिखाएँ"
                      : "Show"}
                </span>
              </button>
              {showUpcoming ? (
                <ul className="space-y-2">
                  {upcoming.map((item) => {
                    const kind = taskKindLabel(
                      item.task.department,
                      internDept,
                      isHi,
                    );
                    const day = taskDayLabel(item.task.dueAfterDays, isHi);
                    return (
                      <li
                        key={item.assignmentId}
                        className="flex items-start gap-3 rounded-2xl border border-[#DCEBE2] bg-white px-4 py-3"
                      >
                        <Lock size={14} className="mt-1 shrink-0 text-[#94A3B8]" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold text-[#64748B]">
                            {pickLocaleText(item.task.title, lang)}
                          </p>
                          <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] font-semibold text-[#94A3B8]">
                            {day ? <span>{day}</span> : null}
                            <span>{kind.label}</span>
                          </p>
                          {item.opensAt ? (
                            <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-[#64748B]">
                              <CalendarClock size={12} />
                              {isHi
                                ? `${formatUnlockWhen(item.opensAt, "hi")} को खुलेगा`
                                : `Opens ${formatUnlockWhen(item.opensAt, "en")}`}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="px-1 text-[12px] font-medium text-[#9AB5A4]">
                  {isHi
                    ? "ये अभी नहीं करने — अपने दिन पर 9:00 IST पर खुलेंगे।"
                    : "Don’t do these yet — they open at 9:00 AM IST on their day."}
                </p>
              )}
            </section>
          ) : null}

          {done.length ? (
            <section className="space-y-2">
              <button
                type="button"
                onClick={() => setShowDone((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-[#EAF2EC] bg-[#F8FBF9] px-4 py-3 text-left"
              >
                <span className="text-[13px] font-bold text-[#6B8F7A]">
                  {isHi
                    ? `पूरे हो चुके (${done.length})`
                    : `Done (${done.length})`}
                </span>
                <span className="text-[12px] font-semibold text-[#0B5A2A]">
                  {showDone
                    ? isHi
                      ? "छुपाएँ"
                      : "Hide"
                    : isHi
                      ? "दिखाएँ"
                      : "Show"}
                </span>
              </button>
              {showDone
                ? done.map((item) => (
                    <TaskCard
                      key={item.assignmentId}
                      item={item}
                      isHi={isHi}
                      lang={lang}
                      locale={locale}
                      internDept={internDept}
                      proofDrafts={proofDrafts}
                      setProofDrafts={setProofDrafts}
                      busyId={busyId}
                      submitProof={submitProof}
                      uploadProof={uploadProof}
                    />
                  ))
                : null}
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

function TaskCard({
  item,
  isHi,
  lang,
  locale,
  internDept,
  locked = false,
  proofDrafts,
  setProofDrafts,
  busyId,
  submitProof,
  uploadProof,
}: {
  item: NonNullable<ReturnType<typeof useInternPortal>["data"]>["tasks"][number];
  isHi: boolean;
  lang: "en" | "hi";
  locale: string;
  internDept?: string;
  locked?: boolean;
  proofDrafts: Record<number, string>;
  setProofDrafts: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  busyId: number | null;
  submitProof: (id: number) => void;
  uploadProof: (id: number, file: File | null) => void;
}) {
  const closed = locked || item.status === "completed";
  const kind = taskKindLabel(item.task.department, internDept, isHi);
  const day = taskDayLabel(item.task.dueAfterDays, isHi);
  const title = pickLocaleText(item.task.title, lang);
  const description = pickLocaleText(item.task.description, lang);

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        locked ? "border-[#EAF2EC]" : "border-2 border-[#0B5A2A]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {item.status === "completed" ? (
            <CheckCircle2 size={18} className="mt-0.5 text-[#16A34A]" />
          ) : locked ? (
            <Lock size={16} className="mt-0.5 text-[#94A3B8]" />
          ) : (
            <Circle size={18} className="mt-0.5 text-[#0B5A2A]" />
          )}
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {day ? (
                <span className="rounded-md bg-[#E8F5EC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0B5A2A]">
                  {day}
                </span>
              ) : null}
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  item.task.department
                    ? "bg-[#04330B] text-white"
                    : "bg-[#EEF2F0] text-[#4F6B5C]"
                }`}
                title={kind.hint}
              >
                {kind.label}
              </span>
            </div>
            <h2
              className={`text-[16px] font-bold ${
                locked ? "text-[#64748B]" : "text-[#04330B]"
              }`}
            >
              {title}
            </h2>
            {!locked && description ? (
              <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#4F6B5C] whitespace-pre-line">
                {description}
              </p>
            ) : null}
            {!locked ? (
              <p className="mt-2 text-[12px] font-medium text-[#6B8F7A]">
                {kind.hint}
              </p>
            ) : null}
          </div>
        </div>
        <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-bold text-[#0B5A2A]">
          {locked
            ? isHi
              ? "लॉक"
              : "Locked"
            : taskStatusLabel(item.status, lang)}
        </span>
      </div>

      {locked && item.opensAt ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B]">
          <CalendarClock size={13} />
          {isHi
            ? `${formatUnlockWhen(item.opensAt, "hi")} को खुलेगा`
            : `Opens ${formatUnlockWhen(item.opensAt, "en")}`}
        </p>
      ) : null}

            {!locked && item.task.dueAt
        ? (() => {
            const due = new Date(item.task.dueAt);
            const overdue =
              item.status !== "completed" && due.getTime() < Date.now();
            return (
              <p
                className={`mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold ${
                  overdue ? "text-[#B91C1C]" : "text-[#6B8F7A]"
                }`}
              >
                <CalendarClock size={13} />
                {overdue
                  ? isHi
                    ? `समय सीमा बीत चुकी — ${due.toLocaleDateString(locale)}`
                    : `Overdue — was due ${due.toLocaleDateString(locale)}`
                  : isHi
                    ? `समय सीमा: आज ${due.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}`
                    : `Due today ${due.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}`}
              </p>
            );
          })()
        : null}

      {item.proofUrl ? (
        <p className="mt-2 text-[12px] font-semibold text-[#0B5A2A]">
          <a
            href={item.proofUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {isHi ? "वर्तमान प्रूफ देखें" : "View current proof"}
          </a>
        </p>
      ) : null}

      {item.notes ? (
        <div className="mt-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase text-[#92400E]">
            <MessageSquareWarning size={12} />{" "}
            {isHi ? "नोट" : "Note"}
          </p>
          <p className="mt-1 text-[13px] font-medium text-[#78350F]">
            {item.notes}
          </p>
        </div>
      ) : null}

      {closed ? (
        locked ? (
          <p className="mt-3 text-[12.5px] font-medium text-[#64748B]">
            {isHi
              ? "अपने दिन पर 9:00 IST पर खुलेगा — पहले जमा नहीं हो सकता।"
              : "Opens at 9:00 AM IST on its day — you cannot submit early."}
          </p>
        ) : null
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              aria-label={`Proof link for ${title}`}
              placeholder={isHi ? "प्रूफ लिंक पेस्ट करें" : "Paste proof link"}
              value={proofDrafts[item.assignmentId] || item.proofUrl || ""}
              onChange={(e) =>
                setProofDrafts((d) => ({
                  ...d,
                  [item.assignmentId]: e.target.value,
                }))
              }
              className="h-11 flex-1 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
            />
            <button
              type="button"
              disabled={busyId === item.assignmentId}
              onClick={() => submitProof(item.assignmentId)}
              className="h-11 rounded-xl bg-[#04330B] px-4 text-sm font-bold text-white disabled:opacity-50"
            >
              {busyId === item.assignmentId
                ? isHi
                  ? "भेज रहे हैं…"
                  : "Submitting…"
                : isHi
                  ? "लिंक जमा करें"
                  : "Submit link"}
            </button>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#DCEBE2] px-3 py-3 hover:bg-[#F8FBF9]">
            <Upload size={15} className="text-[#0B5A2A]" />
            <span className="text-[12.5px] font-semibold text-[#04330B]">
              {isHi
                ? "फ़ाइल अपलोड करें (इमेज / PDF)"
                : "Upload file (image / PDF)"}
            </span>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="sr-only"
              disabled={busyId === item.assignmentId}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                void uploadProof(item.assignmentId, file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      )}
    </article>
  );
}

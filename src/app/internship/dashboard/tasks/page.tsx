"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  MessageSquareWarning,
  Upload,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import { internFetch } from "@/lib/internApi";
import { taskStatusLabel } from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

export default function InternTasksPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading, refresh } = useInternPortal();
  const [proofDrafts, setProofDrafts] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

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
      showToast(isHi ? "प्रूफ भेज दिया गया" : "Proof submitted");
      await refresh();
    } catch (e: any) {
      showToast(e?.message || (isHi ? "सबमिट असफल" : "Submit failed"));
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
      showToast(isHi ? "फ़ाइल अपलोड हो गई" : "File uploaded");
      await refresh();
    } catch (e: any) {
      showToast(e?.message || (isHi ? "अपलोड असफल" : "Upload failed"));
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  const tasks = data?.tasks || [];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-4xl">
      {toast ? (
        <div className="mb-4 rounded-xl bg-[#04330B] text-white px-4 py-2 text-sm font-semibold">{toast}</div>
      ) : null}
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मेरे कार्य" : "My Tasks"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {isHi
          ? "प्रूफ लिंक या फ़ाइल जमा करें और मेंटर फीडबैक देखें।"
          : "Submit a proof link or file and review mentor feedback."}
      </p>

      <div className="mt-6 space-y-4">
        {tasks.length === 0 ? (
          <PortalEmptyState
            art="tasks"
            title={isHi ? "अभी कोई कार्य असाइन नहीं हुआ" : "No tasks assigned yet"}
            description={
              isHi
                ? "आपके मेंटर जैसे ही कार्य असाइन करेंगे, वे यहाँ दिखेंगे।"
                : "As soon as your mentor assigns work, it will show up here."
            }
          />
        ) : (
          tasks.map((item) => (
            <article key={item.assignmentId} className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  {item.status === "completed" ? (
                    <CheckCircle2 size={18} className="text-[#16A34A] mt-0.5" />
                  ) : (
                    <Circle size={18} className="text-[#94A3B8] mt-0.5" />
                  )}
                  <div>
                    <h2 className="text-[16px] font-bold text-[#04330B]">{item.task.title}</h2>
                    {item.task.description ? (
                      <p className="mt-1 text-[13px] font-medium text-[#4F6B5C]">{item.task.description}</p>
                    ) : null}
                  </div>
                </div>
                <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-bold text-[#0B5A2A]">
                  {taskStatusLabel(item.status, isHi ? "hi" : "en")}
                </span>
              </div>
              {item.task.dueAt ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6B8F7A]">
                  <CalendarClock size={13} />
                  {new Date(item.task.dueAt).toLocaleDateString(locale)}
                </p>
              ) : null}
              {item.proofUrl ? (
                <p className="mt-2 text-[12px] font-semibold text-[#0B5A2A]">
                  <a href={item.proofUrl} target="_blank" rel="noreferrer" className="underline">
                    {isHi ? "वर्तमान प्रूफ देखें" : "View current proof"}
                  </a>
                </p>
              ) : null}
              {item.notes ? (
                <div className="mt-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase text-[#92400E] flex items-center gap-1">
                    <MessageSquareWarning size={12} /> {isHi ? "मेंटर फीडबैक" : "Mentor feedback"}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-[#78350F]">{item.notes}</p>
                </div>
              ) : null}
              {item.status !== "completed" ? (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      aria-label={`Proof link for ${item.task.title}`}
                      placeholder={isHi ? "प्रूफ लिंक पेस्ट करें" : "Paste proof link"}
                      value={proofDrafts[item.assignmentId] || item.proofUrl || ""}
                      onChange={(e) =>
                        setProofDrafts((d) => ({ ...d, [item.assignmentId]: e.target.value }))
                      }
                      className="flex-1 h-11 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
                    />
                    <button
                      type="button"
                      disabled={busyId === item.assignmentId}
                      onClick={() => submitProof(item.assignmentId)}
                      className="h-11 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
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
                  <label className="flex items-center gap-2 rounded-xl border border-dashed border-[#DCEBE2] px-3 py-3 cursor-pointer hover:bg-[#F8FBF9]">
                    <Upload size={15} className="text-[#0B5A2A]" />
                    <span className="text-[12.5px] font-semibold text-[#04330B]">
                      {isHi ? "फ़ाइल अपलोड करें (इमेज / PDF)" : "Upload file (image / PDF)"}
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
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

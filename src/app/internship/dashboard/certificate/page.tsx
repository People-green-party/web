"use client";

import React from "react";
import Link from "next/link";
import { Award, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  pickLocaleText,
  taskDayLabel,
  taskProgress,
} from "@/components/internship/portal/types";

export default function InternCertificatePage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const lang = isHi ? "hi" : "en";
  const { data, loading } = useInternPortal();
  const tasks = taskProgress(data);
  const url = data?.application.certificateUrl;
  const cert = data?.summary?.certificate;
  const eligible = Boolean(cert?.eligible ?? data?.summary?.certificateEligible);
  const remaining = (data?.tasks || []).filter(
    (t) => t.status !== "completed" && t.status !== "submitted",
  );

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "प्रमाणपत्र" : "Certificate"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {isHi
          ? "नीचे साफ़ दिखेगा क्या बाकी है। सब पूरा होते ही प्रमाणपत्र अपने आप यहाँ आ जाता है।"
          : "You will see exactly what is left. When everything is done, the certificate appears here automatically."}
      </p>

      <div className="mt-6 rounded-2xl border border-[#DCEBE2] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[#0B5A2A]">
          <Award size={18} />
          <p className="text-[14px] font-bold">{isHi ? "स्थिति" : "Status"}</p>
        </div>
        {url ? (
          <>
            <p className="mt-3 text-[18px] font-bold text-[#04330B]">
              {isHi ? "आपका प्रमाणपत्र तैयार है" : "Your certificate is ready"}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#0B5A2A]"
            >
              {isHi ? "प्रमाणपत्र डाउनलोड करें" : "Download certificate"} <ExternalLink size={14} />
            </a>
          </>
        ) : eligible ? (
          <>
            <p className="mt-3 text-[18px] font-bold text-[#04330B]">
              {isHi ? "पात्र — प्रमाणपत्र बन रहा है" : "Eligible — certificate is being prepared"}
            </p>
            <p className="mt-2 text-[13px] font-medium text-[#4F6B5C]">
              {isHi
                ? "आवश्यकताएँ पूरी हो चुकी हैं। पेज रिफ्रेश करके देखें।"
                : "Requirements are met. Refresh this page in a moment."}
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 text-[18px] font-bold text-[#04330B]">
              {isHi ? "अभी डाउनलोड नहीं हो सकता" : "Download is locked"}
            </p>
            <p className="mt-2 text-[13px] font-medium text-[#4F6B5C]">
              {isHi
                ? "जो शर्त अधूरी है वही रोक रही है। नीचे सूची देखें।"
                : "Whatever is still open below is blocking the certificate."}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8F5EC]">
              <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${tasks.pct}%` }} />
            </div>
          </>
        )}

        {cert ? (
          <ul className="mt-6 space-y-2.5 border-t border-[#EAF2EC] pt-5">
            <RequirementRow
              met={cert.requirements.tasks.met}
              label={isHi ? "सभी कार्य पूरे" : "All tasks completed"}
              value={`${cert.requirements.tasks.done}/${cert.requirements.tasks.total}`}
            />
            <RequirementRow
              met={cert.requirements.attendance.met}
              label={
                isHi
                  ? `उपस्थिति (कम से कम ${cert.requirements.attendance.requiredClasses ?? 3} कक्षा + ${cert.requirements.attendance.required}%)`
                  : `Attendance (at least ${cert.requirements.attendance.requiredClasses ?? 3} classes + ${cert.requirements.attendance.required}%)`
              }
              value={`${cert.requirements.attendance.present}/${cert.requirements.attendance.total || cert.requirements.attendance.requiredClasses || 3} · ${cert.requirements.attendance.pct}%`}
            />
            <RequirementRow
              met={cert.requirements.modules.met}
              label={isHi ? "सभी मॉड्यूल पूरे" : "All modules completed"}
              value={`${cert.requirements.modules.done}/${cert.requirements.modules.total}`}
            />
          </ul>
        ) : null}

        {!url && remaining.length > 0 ? (
          <div className="mt-6 border-t border-[#EAF2EC] pt-5">
            <p className="text-[13px] font-bold text-[#04330B]">
              {isHi
                ? `ये ${remaining.length} कार्य अभी बाकी हैं — इन्हें पूरा करो तब प्रमाणपत्र मिलेगा`
                : `These ${remaining.length} tasks are still left — finish them to get the certificate`}
            </p>
            <ul className="mt-3 space-y-2">
              {remaining.map((item) => (
                <li key={item.assignmentId} className="flex items-start gap-2 text-[13px]">
                  <Circle size={14} className="mt-0.5 shrink-0 text-[#D97706]" />
                  <span className="font-semibold text-[#04330B]">
                    {taskDayLabel(item.task.dueAfterDays, isHi)
                      ? `${taskDayLabel(item.task.dueAfterDays, isHi)} · `
                      : ""}
                    {pickLocaleText(item.task.title, lang)}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/internship/dashboard/tasks"
              className="mt-4 inline-flex rounded-xl bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white"
            >
              {isHi ? "मेरे कार्य पर जाएँ" : "Go to My Tasks"}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RequirementRow({
  met,
  label,
  value,
}: {
  met: boolean;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-2.5">
      {met ? (
        <CheckCircle2 size={17} className="shrink-0 text-[#16A34A]" />
      ) : (
        <Circle size={17} className="shrink-0 text-[#94A3B8]" />
      )}
      <span className="flex-1 text-[13px] font-semibold text-[#04330B]">{label}</span>
      <span className={`text-[12.5px] font-bold ${met ? "text-[#16A34A]" : "text-[#B45309]"}`}>
        {value}
      </span>
    </li>
  );
}

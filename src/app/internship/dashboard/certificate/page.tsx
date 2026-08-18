"use client";

import React from "react";
import { Award, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import { taskProgress } from "@/components/internship/portal/types";

export default function InternCertificatePage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data, loading } = useInternPortal();
  const tasks = taskProgress(data);
  const url = data?.application.certificateUrl;
  const cert = data?.summary?.certificate;
  const eligible = Boolean(cert?.eligible ?? data?.summary?.certificateEligible);

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl">
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "प्रमाणपत्र" : "Certificate"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {isHi
          ? "प्रोग्राम पूरा होने पर प्रमाणपत्र यहाँ उपलब्ध होगा।"
          : "Your certificate will appear here after programme completion."}
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
            <div className="mt-4 h-24 w-24 portal-empty-float">
              <img
                src="/internship/portal/empty/empty-certificate.png"
                alt=""
                aria-hidden
                className="h-full w-full object-contain select-none"
                draggable={false}
              />
            </div>
            <p className="mt-3 text-[18px] font-bold text-[#04330B]">
              {isHi ? "पात्र — प्रमाणपत्र जारी होने की प्रतीक्षा" : "Eligible — waiting for certificate issue"}
            </p>
            <p className="mt-2 text-[13px] font-medium text-[#4F6B5C]">
              {isHi
                ? "आपने आवश्यकताएँ पूरी कर ली हैं। एडमिन प्रमाणपत्र जारी होने पर यह यहाँ दिखेगा।"
                : "You have completed the requirements. Your certificate will appear here once admin issues it."}
            </p>
            <div className="mt-4 h-2 rounded-full bg-[#E8F5EC] overflow-hidden">
              <div className="h-full rounded-full bg-[#16A34A]" style={{ width: "100%" }} />
            </div>
          </>
        ) : (
          <>
            <div className="mt-4 h-24 w-24 portal-empty-float">
              <img
                src="/internship/portal/empty/empty-certificate.png"
                alt=""
                aria-hidden
                className="h-full w-full object-contain select-none opacity-90"
                draggable={false}
              />
            </div>
            <p className="mt-3 text-[18px] font-bold text-[#04330B]">
              {isHi ? "प्रगति में" : "In Progress"}
            </p>
            <p className="mt-2 text-[13px] font-medium text-[#4F6B5C]">
              {isHi
                ? "प्रमाणपत्र के लिए नीचे दी गई सभी शर्तें पूरी करनी होंगी।"
                : "You need to meet all of the requirements below."}
            </p>
            <div className="mt-4 h-2 rounded-full bg-[#E8F5EC] overflow-hidden">
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
                  ? `उपस्थिति (कम से कम ${cert.requirements.attendance.required}%)`
                  : `Attendance (at least ${cert.requirements.attendance.required}%)`
              }
              value={`${cert.requirements.attendance.pct}%`}
            />
            <RequirementRow
              met={cert.requirements.modules.met}
              label={isHi ? "सभी मॉड्यूल पूरे" : "All modules completed"}
              value={`${cert.requirements.modules.done}/${cert.requirements.modules.total}`}
            />
          </ul>
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
        <CheckCircle2 size={17} className="text-[#16A34A] shrink-0" />
      ) : (
        <Circle size={17} className="text-[#94A3B8] shrink-0" />
      )}
      <span className="flex-1 text-[13px] font-semibold text-[#04330B]">{label}</span>
      <span
        className={`text-[12.5px] font-bold ${met ? "text-[#16A34A]" : "text-[#6B8F7A]"}`}
      >
        {value}
      </span>
    </li>
  );
}

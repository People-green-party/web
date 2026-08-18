"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/leadership-academy/portal/InternPortalContext";
import { attendanceProgress } from "@/components/leadership-academy/portal/types";
import PortalEmptyState from "@/components/leadership-academy/portal/PortalEmptyState";

export default function InternAttendancePage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading } = useInternPortal();
  const stats = attendanceProgress(data);
  const rows = data?.attendance || [];

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl">
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "उपस्थिति" : "Attendance"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {stats.total > 0
          ? `${stats.present} / ${stats.total} ${isHi ? "उपस्थित" : "present"}`
          : isHi
            ? "अभी कोई उपस्थिति दर्ज नहीं।"
            : "No attendance recorded yet."}
      </p>

      <div className="mt-6 rounded-2xl border border-[#DCEBE2] bg-white overflow-hidden shadow-sm">
        {rows.length === 0 ? (
          <PortalEmptyState
            bordered={false}
            art="attendance"
            title={isHi ? "अभी कोई उपस्थिति दर्ज नहीं" : "No attendance recorded yet"}
            description={
              isHi
                ? "जब मेंटर उपस्थिति अंकित करेंगे, वह यहाँ दिखेगी।"
                : "Attendance marked by mentors will appear here."
            }
          />
        ) : (
          <ul className="divide-y divide-[#EAF2EC]">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#04330B] truncate">
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

"use client";

import React, { useMemo } from "react";
import { Pin } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import { deptLabel } from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

export default function InternAnnouncementsPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading } = useInternPortal();

  const announcements = useMemo(() => {
    return [...(data?.announcements || [])].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data?.announcements]);

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="w-full max-w-3xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "घोषणाएँ" : "Announcements"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {isHi ? "पिन की गई सूचना सबसे ऊपर।" : "Pinned notices stay at the top."}
      </p>

      <div className="mt-6 space-y-4">
        {announcements.length === 0 ? (
          <PortalEmptyState
            art="announcements"
            title={isHi ? "अभी कोई घोषणा नहीं" : "No announcements yet"}
            description={
              isHi
                ? "प्रोग्राम अपडेट यहाँ दिखाई देंगे।"
                : "Programme updates from mentors will show up here."
            }
          />
        ) : (
          announcements.map((a) => (
            <article
              key={a.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                a.pinned ? "border-[#86EFAC] bg-[#F7FDF9]" : "border-[#DCEBE2]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[16px] font-bold text-[#04330B]">{a.title}</h2>
                    {a.pinned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-bold text-white">
                        <Pin size={10} /> {isHi ? "ज़रूरी" : "IMPORTANT"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[12px] font-semibold text-[#6B8F7A]">
                    {new Date(a.createdAt).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {a.department ? ` · ${deptLabel(a.department, isHi ? "hi" : "en")}` : ""}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[13.5px] font-medium text-[#4F6B5C] whitespace-pre-wrap">{a.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

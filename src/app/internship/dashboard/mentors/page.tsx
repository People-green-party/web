"use client";

import React from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import { deptLabel, initialsFromName } from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

function digitsOnly(value?: string | null) {
  return String(value || "").replace(/\D/g, "");
}

export default function InternMentorsPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data, loading } = useInternPortal();
  const mentors = data?.mentors || [];

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="w-full max-w-3xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मेरा मेंटर" : "My Mentor"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {isHi
          ? "मेंटर प्रोग्राम नहीं चलाते — गाइड और संपर्क के लिए यहाँ हैं।"
          : "Mentors do not run the programme — they are here to guide and be reached."}
      </p>

      <div className="mt-6 space-y-4">
        {mentors.length === 0 ? (
          <PortalEmptyState
            art="mentors"
            title={isHi ? "अभी कोई मेंटर असाइन नहीं" : "No mentors assigned yet"}
            description={
              isHi
                ? "जब एडमिन मेंटर जोड़ेंगे, उनकी जानकारी यहाँ दिखेगी।"
                : "When mentors are assigned by admin, their details will appear here."
            }
          />
        ) : (
          mentors.map((m) => {
            const wa = digitsOnly(m.whatsapp || m.phone);
            const phone = digitsOnly(m.phone);
            return (
              <article key={m.id} className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover border border-[#DCEBE2]"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-[#0B5A2A] text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {initialsFromName(m.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[16px] font-bold text-[#04330B]">{m.name}</h2>
                    {m.title ? (
                      <p className="text-[13px] font-semibold text-[#6B8F7A]">{m.title}</p>
                    ) : null}
                    {m.department ? (
                      <p className="mt-1 text-[12px] font-semibold text-[#0B5A2A]">
                        {deptLabel(m.department, isHi ? "hi" : "en")}
                      </p>
                    ) : null}
                    {m.bio ? (
                      <p className="mt-2 text-[13px] font-medium text-[#4F6B5C]">{m.bio}</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {wa ? (
                        <a
                          href={`https://wa.me/${wa}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#16A34A] px-3 py-2 text-[12px] font-bold text-white"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                      ) : null}
                      {m.email ? (
                        <a
                          href={`mailto:${m.email}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCEBE2] px-3 py-2 text-[12px] font-bold text-[#04330B]"
                        >
                          <Mail size={14} /> {isHi ? "ईमेल" : "Email"}
                        </a>
                      ) : null}
                      {phone ? (
                        <a
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCEBE2] px-3 py-2 text-[12px] font-bold text-[#04330B]"
                        >
                          <Phone size={14} /> {isHi ? "कॉल" : "Call"}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

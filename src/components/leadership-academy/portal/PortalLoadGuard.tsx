"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "./InternPortalContext";

/**
 * A failed load used to look identical to an empty portal. This says what went
 * wrong instead, and keeps showing the last good data when there is some.
 */
export default function PortalLoadGuard({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data, error, loading, refresh } = useInternPortal();

  const retry = (
    <button
      type="button"
      onClick={() => void refresh()}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#0B5A2A] disabled:opacity-60"
    >
      <RefreshCw size={14} className={loading ? "animate-spin" : undefined} />
      {loading ? (isHi ? "फिर से लोड हो रहा है…" : "Retrying…") : isHi ? "फिर कोशिश करें" : "Try again"}
    </button>
  );

  if (error && !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-7 max-w-2xl">
        <div className="rounded-2xl border border-[#F3D6D6] bg-[#FDF7F7] p-6 text-center">
          <AlertTriangle size={22} className="mx-auto text-[#B4443F]" />
          <h1 className="mt-3 text-[17px] font-bold text-[#04330B]">
            {isHi ? "आपका पोर्टल लोड नहीं हो सका" : "We could not load your portal"}
          </h1>
          <p className="mt-2 text-[13px] font-medium text-[#6B5250]">{error}</p>
          <p className="mt-1 text-[12.5px] font-medium text-[#8A6C6A]">
            {isHi
              ? "यह आमतौर पर नेटवर्क की समस्या होती है। आपका कोई डेटा नहीं गया है।"
              : "This is usually a connection problem. Nothing of yours has been lost."}
          </p>
          <div className="mt-5">{retry}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="mx-4 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#F5E2C8] bg-[#FFFaf0] px-4 py-3 sm:mx-6 lg:mx-7">
          <AlertTriangle size={16} className="shrink-0 text-[#A8700C]" />
          <p className="flex-1 text-[12.5px] font-semibold text-[#7A5308]">
            {isHi
              ? "यह जानकारी पुरानी हो सकती है — ताज़ा डेटा नहीं मिल सका।"
              : "This may be out of date — we could not fetch the latest."}
          </p>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="text-[12.5px] font-bold text-[#7A5308] underline disabled:opacity-60"
          >
            {isHi ? "फिर कोशिश करें" : "Try again"}
          </button>
        </div>
      ) : null}
      {children}
    </>
  );
}

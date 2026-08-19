"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  deptLabel,
  initialsFromName,
  ticketStatusLabel,
} from "@/components/internship/portal/types";
import { internFetch } from "@/lib/internApi";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

export default function InternProfilePage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
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
    } catch (err: any) {
      showToast(err?.message || (isHi ? "सेव असफल" : "Save failed"));
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
    } catch (err: any) {
      showToast(err?.message || (isHi ? "अपलोड असफल" : "Upload failed"));
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (loading && !app) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  if (!app) {
    return <div className="p-8 text-[#B91C1C] font-semibold">{isHi ? "प्रोफ़ाइल नहीं मिली" : "Profile not found"}</div>;
  }

  const readonly = [
    { label: isHi ? "विभाग ट्रैक" : "Department track", value: deptLabel(app.department, isHi ? "hi" : "en") },
    { label: isHi ? "मोड" : "Mode", value: app.mode || "—" },
    { label: isHi ? "स्थिति" : "Status", value: app.status || "—" },
    {
      label: isHi ? "जॉइन तिथि" : "Join date",
      value: app.createdAt
        ? new Date(app.createdAt).toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl">
      {toast ? (
        <div className="mb-4 rounded-xl bg-[#04330B] text-white px-4 py-2 text-sm font-semibold">{toast}</div>
      ) : null}

      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {isHi ? "अपनी प्रोफ़ाइल जानकारी अपडेट करें।" : "Update your internship profile details."}
      </p>

      <div className="mt-6 rounded-2xl border border-[#DCEBE2] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            {app.photoUrl ? (
              <img
                src={app.photoUrl}
                alt=""
                className="h-20 w-20 rounded-full object-cover border border-[#DCEBE2]"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-[#0B5A2A] text-white text-lg font-bold flex items-center justify-center">
                {initialsFromName(fullName || app.fullName)}
              </div>
            )}
            <button
              type="button"
              disabled={photoBusy}
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#04330B] text-white flex items-center justify-center border-2 border-white disabled:opacity-50"
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
            <p className="text-[13px] font-semibold text-[#6B8F7A]">{isHi ? "इंटर्न" : "Intern"}</p>
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

        <form onSubmit={save} className="mt-6 space-y-3">
          <label className="block">
            <span className="text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "पूरा नाम" : "Full name"}</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "ईमेल" : "Email"}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "शहर" : "City"}</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#6B8F7A]">
              {isHi ? "कॉलेज / संगठन" : "College / Organisation"}
            </span>
            <input
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="mt-1 w-full h-11 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 h-11 px-5 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
          >
            {saving ? (isHi ? "सेव हो रहा है…" : "Saving…") : isHi ? "सेव करें" : "Save profile"}
          </button>
        </form>

        <dl className="mt-6 space-y-3 border-t border-[#EAF2EC] pt-5">
          {readonly.map((r) => (
            <div key={r.label} className="flex items-start justify-between gap-4">
              <dt className="text-[12.5px] font-semibold text-[#6B8F7A]">{r.label}</dt>
              <dd className="text-[13.5px] font-bold text-[#04330B] text-right break-all">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5 rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
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
          <ul className="mt-3 space-y-3">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-xl border border-[#EAF2EC] p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold text-[#04330B]">{t.subject}</p>
                  <span className="text-[10px] font-bold tracking-wide text-[#0B5A2A] bg-[#EAF7EE] px-2 py-0.5 rounded-full">
                    {ticketStatusLabel(t.status, isHi ? "hi" : "en")}
                  </span>
                </div>
                <p className="mt-1 text-[12px] font-medium text-[#4F6B5C]">{t.message}</p>
                {t.adminReply ? (
                  <p className="mt-2 text-[12px] font-semibold text-[#04330B] bg-[#F5FBF7] rounded-lg px-2.5 py-2">
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

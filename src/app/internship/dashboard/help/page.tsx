"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { internFetch } from "@/lib/internApi";
import { ticketStatusLabel } from "@/components/internship/portal/types";

const CATEGORIES = [
  { id: "Task", en: "Task", hi: "कार्य" },
  { id: "Class", en: "Class", hi: "कक्षा" },
  { id: "Attendance", en: "Attendance", hi: "उपस्थिति" },
  { id: "Technical", en: "Technical", hi: "तकनीकी" },
  { id: "Mentor", en: "Mentor", hi: "मेंटर" },
  { id: "Other", en: "Other", hi: "अन्य" },
] as const;

type Ticket = {
  id: number;
  subject: string;
  message: string;
  status: string;
  adminReply?: string | null;
  createdAt: string;
};

export default function InternHelpPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("Task");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const load = async () => {
    try {
      const rows = await internFetch("internship/me/help-tickets");
      setTickets(Array.isArray(rows) ? rows : []);
    } catch {
      setTickets([]);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    try {
      await internFetch("internship/me/help-tickets", {
        method: "POST",
        body: JSON.stringify({
          subject: `[${category}]`,
          message: message.trim(),
        }),
      });
      setToast(isHi ? "अनुरोध भेज दिया गया" : "Request sent");
      setMessage("");
      await load();
      setTimeout(() => setToast(""), 2500);
    } catch (err: unknown) {
      setToast(err instanceof Error ? err.message : isHi ? "भेजने में त्रुटि" : "Could not send");
      setTimeout(() => setToast(""), 2500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      {toast ? (
        <div className="rounded-xl bg-[#04330B] px-4 py-2 text-sm font-semibold text-white">{toast}</div>
      ) : null}

      <header>
        <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मदद चाहिए?" : "Need Help?"}</h1>
        <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
          {isHi
            ? "अनुरोध भेजें। एडमिन Internships → Help Desk से जवाब देगा।"
            : "Raise a request. Admin replies from Internships → Help Desk."}
        </p>
      </header>

      <form onSubmit={submit} className="rounded-2xl border border-[#DCEBE2] bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#04330B]">{isHi ? "नया अनुरोध" : "Raise a request"}</h2>
        <p className="mt-3 text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "श्रेणी" : "Category"}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.id}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] font-bold ${
                category === c.id
                  ? "border-[#04330B] bg-[#04330B] text-white"
                  : "border-[#DCEBE2] bg-white text-[#04330B]"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={c.id}
                checked={category === c.id}
                onChange={() => setCategory(c.id)}
                className="sr-only"
              />
              {isHi ? c.hi : c.en}
            </label>
          ))}
        </div>
        <label className="mt-4 block">
          <span className="text-[12px] font-semibold text-[#6B8F7A]">{isHi ? "संदेश" : "Message"}</span>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full resize-y rounded-xl border border-[#DCEBE2] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#0B5A2A]"
            placeholder={isHi ? "अपनी समस्या लिखें…" : "Describe your issue…"}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 h-11 rounded-xl bg-[#04330B] px-5 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? (isHi ? "भेजा जा रहा है…" : "Sending…") : isHi ? "भेजें" : "Submit"}
        </button>
      </form>

      <section>
        <h2 className="text-[15px] font-bold text-[#04330B]">{isHi ? "मेरे अनुरोध" : "My requests"}</h2>
        {tickets.length === 0 ? (
          <p className="mt-3 rounded-xl border border-[#EAF2EC] bg-[#F8FBF9] px-4 py-3 text-[13px] font-medium text-[#6B8F7A]">
            {isHi ? "अभी कोई अनुरोध नहीं।" : "No requests yet."}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-2xl border border-[#DCEBE2] bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-bold text-[#6B8F7A]">#{t.id}</p>
                    <p className="text-[14px] font-bold text-[#04330B]">{t.subject}</p>
                  </div>
                  <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-bold text-[#0B5A2A]">
                    {ticketStatusLabel(t.status, isHi ? "hi" : "en")}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-medium text-[#4F6B5C]">{t.message}</p>
                <p className="mt-1 text-[11px] font-medium text-[#9AB5A4]">
                  {new Date(t.createdAt).toLocaleString(locale, {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {t.adminReply ? (
                  <p className="mt-3 rounded-xl bg-[#F5FBF7] px-3 py-2.5 text-[13px] font-semibold text-[#04330B]">
                    {isHi ? "एडमिन जवाब: " : "Admin reply: "}
                    {t.adminReply}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

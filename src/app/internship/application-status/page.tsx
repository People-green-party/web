"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Check,
  Clock,
  LogOut,
  MessageSquare,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { useLanguage } from "@/components/LanguageContext";
import { clearInternSession, getInternToken, internFetch } from "@/lib/internApi";
import { deptLabel, type InternDash } from "@/components/leadership-academy/portal/types";

type HelpTicket = {
  id: number;
  subject: string;
  message: string;
  status: string;
  adminReply?: string | null;
  createdAt: string;
};

const COPY = {
  en: {
    brand: "PGP Internships",
    heading: "Your application",
    loading: "Loading your application…",
    refresh: "Refresh",
    signOut: "Sign out",
    applicationId: "Application ID",
    department: "Department",
    mode: "Mode",
    submitted: "Submitted on",
    stepSubmitted: "Application submitted",
    stepReview: "Under review",
    stepDecision: "Decision",
    updates: "Updates from the team",
    noUpdates: "No updates yet. We'll post here the moment anything changes.",
    help: "Have a question about your application?",
    helpBody: "Send it to the internship team and we'll reply here.",
    helpSubject: "Subject",
    helpSubjectPh: "What is your question about?",
    helpMessage: "Your question",
    helpMessagePh: "Tell us a little more…",
    helpSend: "Send question",
    helpSending: "Sending…",
    helpSent: "Sent. We'll reply here as soon as we can.",
    helpFailed: "Could not send your question. Please try again.",
    myQuestions: "Your questions",
    reply: "Reply from the team",
    awaitingReply: "Waiting for a reply",
    faq: "Read the FAQ",
    backHome: "← Back to Internships",
    openDashboard: "Open your dashboard",
    error: "We couldn't load your application. Please try again.",
    modes: { offline: "In person", hybrid: "Hybrid" } as Record<string, string>,
    status: {
      pending: {
        badge: "Application received",
        title: "Your application is with us",
        body: "We have your application and it's in the queue for review. Decisions for this intake are shared over email and here on this page.",
      },
      reviewed: {
        badge: "Under review",
        title: "Our team is reviewing your application",
        body: "Someone from your chosen department is reading through your application right now. You'll hear from us as soon as there's a decision.",
      },
      waitlisted: {
        badge: "Waitlisted",
        title: "You're on the waitlist",
        body: "We'd like to take you, but every place in this intake is currently filled. If one opens up we'll contact you straight away — nothing further is needed from you.",
      },
      rejected: {
        badge: "Not selected",
        title: "You weren't selected for this intake",
        body: "We had far more applications than places, and we couldn't offer you one this time. Thank you for the time you put in — we'd genuinely welcome an application from you in the next intake.",
      },
      accepted: {
        badge: "Accepted",
        title: "You're in",
        body: "Your place is confirmed. Head to your dashboard to see your classes, tasks and mentor.",
      },
    } as Record<string, { badge: string; title: string; body: string }>,
  },
  hi: {
    brand: "पीजीपी इंटर्नशिप",
    heading: "आपका आवेदन",
    loading: "आपका आवेदन लोड हो रहा है…",
    refresh: "रिफ्रेश करें",
    signOut: "साइन आउट",
    applicationId: "आवेदन आईडी",
    department: "विभाग",
    mode: "मोड",
    submitted: "आवेदन की तारीख",
    stepSubmitted: "आवेदन जमा हुआ",
    stepReview: "समीक्षा जारी",
    stepDecision: "निर्णय",
    updates: "टीम की ओर से अपडेट",
    noUpdates: "अभी कोई अपडेट नहीं है। कुछ भी बदलते ही हम यहाँ बताएँगे।",
    help: "आवेदन को लेकर कोई सवाल है?",
    helpBody: "इंटर्नशिप टीम को भेजें, हम यहीं जवाब देंगे।",
    helpSubject: "विषय",
    helpSubjectPh: "आपका सवाल किस बारे में है?",
    helpMessage: "आपका सवाल",
    helpMessagePh: "थोड़ा विस्तार से बताएँ…",
    helpSend: "सवाल भेजें",
    helpSending: "भेज रहे हैं…",
    helpSent: "भेज दिया गया। हम जल्द ही यहाँ जवाब देंगे।",
    helpFailed: "सवाल भेजा नहीं जा सका। कृपया दोबारा कोशिश करें।",
    myQuestions: "आपके सवाल",
    reply: "टीम का जवाब",
    awaitingReply: "जवाब का इंतज़ार",
    faq: "सामान्य सवाल पढ़ें",
    backHome: "← इंटर्नशिप पर वापस",
    openDashboard: "अपना डैशबोर्ड खोलें",
    error: "आपका आवेदन लोड नहीं हो सका। कृपया दोबारा कोशिश करें।",
    modes: { offline: "प्रत्यक्ष", hybrid: "हाइब्रिड" } as Record<string, string>,
    status: {
      pending: {
        badge: "आवेदन प्राप्त हुआ",
        title: "आपका आवेदन हमारे पास है",
        body: "आपका आवेदन हमें मिल गया है और समीक्षा की कतार में है। इस इनटेक के निर्णय ईमेल पर और इसी पेज पर बताए जाएंगे।",
      },
      reviewed: {
        badge: "समीक्षा जारी",
        title: "हमारी टीम आपका आवेदन देख रही है",
        body: "आपके चुने हुए विभाग की टीम अभी आपका आवेदन पढ़ रही है। निर्णय होते ही हम आपको सूचित करेंगे।",
      },
      waitlisted: {
        badge: "प्रतीक्षा सूची में",
        title: "आप प्रतीक्षा सूची में हैं",
        body: "हम आपको लेना चाहते हैं, लेकिन इस इनटेक की सभी सीटें अभी भरी हुई हैं। सीट खाली होते ही हम आपसे संपर्क करेंगे — आपको कुछ और नहीं करना है।",
      },
      rejected: {
        badge: "इस बार चयन नहीं",
        title: "इस इनटेक के लिए आपका चयन नहीं हो सका",
        body: "सीटों से कहीं ज़्यादा आवेदन आए थे और इस बार हम आपको जगह नहीं दे सके। आपके समय और मेहनत के लिए धन्यवाद — अगले इनटेक में आपके आवेदन का हमें इंतज़ार रहेगा।",
      },
      accepted: {
        badge: "चयनित",
        title: "आप चुन लिए गए हैं",
        body: "आपकी सीट पक्की है। कक्षाएँ, कार्य और मेंटर देखने के लिए अपना डैशबोर्ड खोलें।",
      },
    } as Record<string, { badge: string; title: string; body: string }>,
  },
} as const;

const TONE: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  pending: { bg: "#FFF8E7", border: "#F5E2B3", text: "#8A6100", dot: "#E0A72B" },
  reviewed: { bg: "#EFF6FF", border: "#C7DCF7", text: "#1D4C8F", dot: "#3B7DD8" },
  waitlisted: { bg: "#FFF8E7", border: "#F5E2B3", text: "#8A6100", dot: "#E0A72B" },
  rejected: { bg: "#FEF2F2", border: "#F5CDCD", text: "#9B2C2C", dot: "#DC5555" },
  accepted: { bg: "#EAF7EE", border: "#B9D3C4", text: "#0D5229", dot: "#16A34A" },
};

function formatDate(value?: string | null, lang: "en" | "hi" = "en") {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ApplicationStatusPage() {
  const { language } = useLanguage();
  const lang = language === "hi" ? "hi" : "en";
  const t = COPY[lang];
  const router = useRouter();

  const [data, setData] = useState<InternDash | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [helpNote, setHelpNote] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      const rows = await internFetch<HelpTicket[]>("leadership-academy/me/help-tickets");
      setTickets(Array.isArray(rows) ? rows : []);
    } catch {
      // The status view still works without the ticket history.
    }
  }, []);

  const load = useCallback(async () => {
    if (!getInternToken()) {
      router.replace("/internship/status");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const dash = await internFetch<InternDash>("leadership-academy/me/dashboard");
      if (dash?.access?.granted !== false) {
        router.replace("/internship/dashboard");
        return;
      }
      setData(dash);
      void loadTickets();
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("token")) {
        clearInternSession();
        router.replace("/internship/status");
        return;
      }
      setError(msg || t.error);
    } finally {
      setLoading(false);
    }
  }, [router, t.error, loadTickets]);

  useEffect(() => {
    void load();
  }, [load]);

  const signOut = () => {
    clearInternSession();
    router.push("/internship/status");
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || sending) return;
    setSending(true);
    setHelpNote(null);
    try {
      await internFetch("leadership-academy/me/help-tickets", {
        method: "POST",
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      setSubject("");
      setMessage("");
      setHelpNote({ tone: "ok", text: t.helpSent });
      await loadTickets();
    } catch (err: any) {
      setHelpNote({ tone: "bad", text: err?.message || t.helpFailed });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <AcademyShell>
        <div className="mx-auto w-full max-w-[860px] px-4 py-24 text-center font-semibold text-[#587E67]">
          {t.loading}
        </div>
      </AcademyShell>
    );
  }

  if (error || !data) {
    return (
      <AcademyShell>
        <div className="mx-auto w-full max-w-[560px] px-4 py-20">
          <div className="rounded-[24px] border border-[#F5CDCD] bg-[#FEF2F2] p-8 text-center">
            <AlertCircle size={26} className="mx-auto text-[#DC5555]" />
            <p className="mt-4 font-bold text-[#9B2C2C]">{error || t.error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#04330B] px-6 font-bold text-white"
            >
              <RefreshCw size={16} /> {t.refresh}
            </button>
          </div>
        </div>
      </AcademyShell>
    );
  }

  const app = data.application;
  const status = data.access?.status || app.status || "pending";
  const copy = t.status[status] || t.status.pending;
  const tone = TONE[status] || TONE.pending;
  const notifications = data.notifications || [];

  const decided = status === "accepted" || status === "rejected";
  const steps = [
    { label: t.stepSubmitted, done: true, current: false },
    {
      label: t.stepReview,
      done: status !== "pending",
      current: status === "pending",
    },
    {
      label: t.stepDecision,
      done: decided,
      current: status === "reviewed" || status === "waitlisted",
    },
  ];

  return (
    <AcademyShell>
      <section className="mx-auto w-full max-w-[860px] px-4 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">
              {t.brand}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#04330B] lg:text-3xl">
              {t.heading}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDEEE4] bg-white px-4 text-sm font-bold text-[#0D5229]"
            >
              <RefreshCw size={15} /> {t.refresh}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDEEE4] bg-white px-4 text-sm font-bold text-[#587E67]"
            >
              <LogOut size={15} /> {t.signOut}
            </button>
          </div>
        </div>

        <div
          className="mt-7 rounded-[26px] border p-7 lg:p-9"
          style={{ background: tone.bg, borderColor: tone.border }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[12px] font-black uppercase tracking-wide"
            style={{ color: tone.text }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: tone.dot }}
              aria-hidden
            />
            {copy.badge}
          </span>
          <h2 className="mt-4 text-[22px] font-bold lg:text-[26px]" style={{ color: tone.text }}>
            {copy.title}
          </h2>
          <p className="mt-2 max-w-[62ch] text-[15px] font-medium leading-relaxed text-[#3F5A49]">
            {copy.body}
          </p>

          {status === "accepted" ? (
            <Link
              href="/internship/dashboard"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-[#04330B] px-6 font-bold text-white"
            >
              {t.openDashboard} <ArrowRight size={18} />
            </Link>
          ) : null}
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.label}
              className={[
                "rounded-2xl border bg-white p-5",
                step.current ? "border-[#16A34A]" : "border-[#E4F2EA]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  step.done
                    ? "bg-[#16A34A] text-white"
                    : step.current
                      ? "bg-[#EAF7EE] text-[#0D5229]"
                      : "bg-[#F1F6F3] text-[#9DB6A8]",
                ].join(" ")}
              >
                {step.done ? (
                  <Check size={16} />
                ) : status === "rejected" && step.label === t.stepDecision ? (
                  <XCircle size={16} />
                ) : (
                  <Clock size={16} />
                )}
              </span>
              <p
                className={[
                  "mt-3 text-[14px] font-bold",
                  step.done || step.current ? "text-[#04330B]" : "text-[#9DB6A8]",
                ].join(" ")}
              >
                {step.label}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-4 rounded-[24px] border border-[#E4F2EA] bg-white p-7 sm:grid-cols-2">
          <Detail label={t.applicationId} value={`#${app.id}`} />
          <Detail label={t.department} value={deptLabel(app.department, lang)} />
          <Detail label={t.mode} value={t.modes[app.mode] || app.mode || "—"} />
          <Detail label={t.submitted} value={formatDate(app.createdAt, lang)} />
        </div>

        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#04330B]">
            <Bell size={16} className="text-[#16A34A]" /> {t.updates}
          </h3>
          {notifications.length ? (
            <ul className="mt-4 space-y-3">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="rounded-2xl border border-[#E4F2EA] bg-white p-5"
                >
                  <p className="text-[14.5px] font-bold text-[#04330B]">{n.title}</p>
                  {n.body ? (
                    <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-[#587E67]">
                      {n.body}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[12px] font-semibold text-[#9DB6A8]">
                    {formatDate(n.createdAt, lang)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-2xl border border-dashed border-[#DCEBE2] bg-white p-6 text-center text-[13.5px] font-medium text-[#6B8F7A]">
              {t.noUpdates}
            </p>
          )}
        </div>

        <div className="mt-8 rounded-[24px] bg-[#EAF7EE] p-7">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#04330B]">
            <MessageSquare size={16} className="text-[#16A34A]" /> {t.help}
          </h3>
          <p className="mt-1 text-[13.5px] font-medium text-[#587E67]">{t.helpBody}</p>

          <form onSubmit={submitQuestion} className="mt-5 space-y-3">
            <div>
              <label
                htmlFor="help-subject"
                className="text-[12px] font-bold uppercase tracking-wide text-[#0D5229]"
              >
                {t.helpSubject}
              </label>
              <input
                id="help-subject"
                required
                maxLength={140}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.helpSubjectPh}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#C8E2D3] bg-white px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
              />
            </div>
            <div>
              <label
                htmlFor="help-message"
                className="text-[12px] font-bold uppercase tracking-wide text-[#0D5229]"
              >
                {t.helpMessage}
              </label>
              <textarea
                id="help-message"
                required
                rows={4}
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.helpMessagePh}
                className="mt-1.5 w-full rounded-xl border border-[#C8E2D3] bg-white px-4 py-3 font-medium text-[#04330B] outline-none focus:border-[#16A34A]"
              />
            </div>
            {helpNote ? (
              <p
                className={[
                  "text-[13px] font-bold",
                  helpNote.tone === "ok" ? "text-[#0D5229]" : "text-[#9B2C2C]",
                ].join(" ")}
              >
                {helpNote.text}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-11 items-center rounded-xl bg-[#04330B] px-5 text-sm font-bold text-white disabled:opacity-50"
              >
                {sending ? t.helpSending : t.helpSend}
              </button>
              <Link
                href="/internship/faq"
                className="text-sm font-semibold text-[#0D5229] hover:underline"
              >
                {t.faq}
              </Link>
              <Link
                href="/internship"
                className="text-sm font-semibold text-[#587E67] hover:underline"
              >
                {t.backHome}
              </Link>
            </div>
          </form>

          {tickets.length ? (
            <div className="mt-7 border-t border-[#C8E2D3] pt-5">
              <p className="text-[13px] font-bold uppercase tracking-wide text-[#0D5229]">
                {t.myQuestions}
              </p>
              <ul className="mt-3 space-y-3">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="rounded-2xl bg-white p-5">
                    <p className="text-[14px] font-bold text-[#04330B]">{ticket.subject}</p>
                    <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-[#587E67]">
                      {ticket.message}
                    </p>
                    {ticket.adminReply ? (
                      <div className="mt-3 rounded-xl bg-[#EAF7EE] p-4">
                        <p className="text-[12px] font-bold uppercase tracking-wide text-[#0D5229]">
                          {t.reply}
                        </p>
                        <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-[#04330B]">
                          {ticket.adminReply}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-[12px] font-bold text-[#9DB6A8]">
                        {t.awaitingReply}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </AcademyShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-wide text-[#9DB6A8]">{label}</p>
      <p className="mt-1 text-[15px] font-bold text-[#04330B]">{value}</p>
    </div>
  );
}

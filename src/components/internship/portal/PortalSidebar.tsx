"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  CalendarCheck2,
  ClipboardCheck,
  GraduationCap,
  Home,
  Megaphone,
  MessageCircle,
  Route,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { internFetch } from "@/lib/internApi";

type NavItem = {
  href: string;
  labelEn: string;
  labelHi: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
};

const DASHBOARD: NavItem = {
  href: "/internship/dashboard",
  labelEn: "Dashboard",
  labelHi: "डैशबोर्ड",
  icon: Home,
  exact: true,
};

const MY_INTERNSHIP: NavItem[] = [
  { href: "/internship/dashboard/profile", labelEn: "My Profile", labelHi: "मेरी प्रोफ़ाइल", icon: UserRound },
  { href: "/internship/dashboard/program", labelEn: "My Program", labelHi: "मेरा प्रोग्राम", icon: Route },
  { href: "/internship/dashboard/tasks", labelEn: "My Tasks", labelHi: "मेरे कार्य", icon: ClipboardCheck },
  { href: "/internship/dashboard/classes", labelEn: "My Classes", labelHi: "मेरी कक्षाएँ", icon: GraduationCap },
  { href: "/internship/dashboard/attendance", labelEn: "Attendance", labelHi: "उपस्थिति", icon: CalendarCheck2 },
  { href: "/internship/dashboard/certificate", labelEn: "Certificate", labelHi: "प्रमाणपत्र", icon: Award },
];

const LEARN: NavItem[] = [
  { href: "/internship/dashboard/resources", labelEn: "Resource Library", labelHi: "रिसोर्स लाइब्रेरी", icon: BookOpen },
  { href: "/internship/dashboard/mentors", labelEn: "Mentors", labelHi: "मेंटर", icon: Users },
  { href: "/internship/dashboard/announcements", labelEn: "Announcements", labelHi: "घोषणाएँ", icon: Megaphone },
];

function NavLink({
  item,
  active,
  isHi,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  isHi: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
        active
          ? "bg-white/15 text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      {active ? <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#86EFAC]" /> : null}
      <Icon size={17} className="shrink-0 opacity-90" />
      <span>{isHi ? item.labelHi : item.labelEn}</span>
    </Link>
  );
}

export function PortalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [helpOpen, setHelpOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const active = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const submitHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setBusy(true);
    try {
      await internFetch("internship/me/help-tickets", {
        method: "POST",
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      setToast(isHi ? "आपका सवाल भेज दिया गया" : "Your question was sent");
      setSubject("");
      setMessage("");
      setHelpOpen(false);
      setTimeout(() => setToast(""), 2500);
    } catch (err: any) {
      setToast(err?.message || (isHi ? "भेजने में त्रुटि" : "Could not send"));
      setTimeout(() => setToast(""), 2500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#04330B] text-white">
      {toast ? (
        <div className="mx-3 mt-3 rounded-xl bg-white/15 px-3 py-2 text-[12px] font-semibold text-[#86EFAC]">
          {toast}
        </div>
      ) : null}

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <div className="space-y-0.5">
          <NavLink item={DASHBOARD} active={active(DASHBOARD)} isHi={isHi} onNavigate={onNavigate} />
        </div>

        <p className="mt-5 mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
          {isHi ? "मेरी इंटर्नशिप" : "My Internship"}
        </p>
        <div className="space-y-0.5">
          {MY_INTERNSHIP.map((item) => (
            <NavLink key={item.href} item={item} active={active(item)} isHi={isHi} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="my-4 mx-3 border-t border-white/10" />

        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
          {isHi ? "सीखें और बढ़ें" : "Learn & Grow"}
        </p>
        <div className="space-y-0.5">
          {LEARN.map((item) => (
            <NavLink key={item.href} item={item} active={active(item)} isHi={isHi} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 py-3">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 overflow-hidden rounded-lg bg-white shrink-0">
              <img
                src="/internship/portal/leaf-icon-v2.png"
                alt=""
                className="block h-full w-full object-cover"
              />
            </span>
            <p className="text-[13px] font-bold text-white">{isHi ? "मदद चाहिए?" : "Need Help?"}</p>
          </div>
          <p className="mt-2 text-[12px] font-medium leading-relaxed text-white/70">
            {isHi
              ? "कोई समस्या हो रही है? हम मदद के लिए यहाँ हैं।"
              : "Facing any issue? We're here to help."}
          </p>
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[12.5px] font-bold text-[#04330B] hover:bg-[#E8F5EC]"
          >
            <MessageCircle size={14} />
            {isHi ? "सवाल पूछें" : "Ask a question"}
          </button>
        </div>
      </div>

      {helpOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/45 p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close"
            onClick={() => setHelpOpen(false)}
          />
          <form
            onSubmit={submitHelp}
            className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white text-[#04330B] p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-[16px] font-bold">
                {isHi ? "मदद अनुरोध" : "Help request"}
              </h3>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                aria-label="Close help request"
                className="h-8 w-8 rounded-lg border border-[#DCEBE2] flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-[12px] font-medium text-[#6B8F7A] mb-3">
              {isHi
                ? "एडमिन आपकी क्वेरी देखकर जवाब देगा।"
                : "Admins will see your query and reply from the Internships panel."}
            </p>
            <label className="block mb-3">
              <span className="text-[12px] font-semibold text-[#6B8F7A]">
                {isHi ? "विषय" : "Subject"}
              </span>
              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium outline-none focus:border-[#0B5A2A]"
                placeholder={isHi ? "संक्षेप में लिखें" : "Short summary"}
              />
            </label>
            <label className="block mb-4">
              <span className="text-[12px] font-semibold text-[#6B8F7A]">
                {isHi ? "विवरण" : "Details"}
              </span>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#DCEBE2] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#0B5A2A] resize-y"
                placeholder={isHi ? "अपनी समस्या बताएँ…" : "Describe your issue…"}
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy ? (isHi ? "भेजा जा रहा है…" : "Sending…") : isHi ? "भेजें" : "Submit"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

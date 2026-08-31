"use client";

import React from "react";
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
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

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
  { href: "/internship/dashboard/help", labelEn: "Help Desk", labelHi: "हेल्प डेस्क", icon: MessageCircle },
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

  const active = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#04330B] text-white">
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
          <Link
            href="/internship/dashboard/help"
            onClick={onNavigate}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[12.5px] font-bold text-[#04330B] hover:bg-[#E8F5EC]"
          >
            <MessageCircle size={14} />
            {isHi ? "सवाल पूछें" : "Ask a question"}
          </Link>
        </div>
      </div>
    </div>
  );
}

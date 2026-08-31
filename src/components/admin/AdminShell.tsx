"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Swords,
  Target,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Flag,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Bell,
  ExternalLink,
  MapPinned,
  Newspaper,
  HandCoins,
  Building2,
} from "lucide-react";
import { adminFetch, clearAdminSession, getAdminScope, getAdminToken } from "@/lib/adminApi";
import { useLanguage } from "@/components/LanguageContext";
import {
  type AdminNotification,
  formatNotificationBody,
  formatNotificationTitle,
  isNotificationRead,
  loadNotifReadState,
  markAllNotificationsRead,
  markNotificationRead,
  notificationHref,
} from "@/lib/adminNotifications";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    title: "Party Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "People & Programmes",
    items: [
      { href: "/admin/users", label: "All Users", icon: Users },
      { href: "/admin/unions", label: "Unions", icon: Building2 },
      { href: "/admin/youth", label: "Zinda Youth", icon: BarChart3 },
      { href: "/admin/internships", label: "Internships", icon: GraduationCap },
      { href: "/admin/donations", label: "Donations", icon: HandCoins },
      { href: "/admin/news", label: "News CMS", icon: Newspaper },
    ],
  },
  {
    title: "Youth Ops",
    items: [
      { href: "/admin/youth/squads", label: "Squads", icon: Users },
      { href: "/admin/youth/missions", label: "Missions", icon: Target },
      { href: "/admin/youth/squad-missions", label: "Squad Missions", icon: Swords },
      { href: "/admin/youth/action-queue", label: "Action Queue", icon: AlertTriangle },
    ],
  },
  {
    title: "Organisation",
    items: [
      { href: "/admin/elections", label: "Elections", icon: ShieldCheck },
      { href: "/admin/committees", label: "Committees", icon: Flag },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
      { href: "/admin/geo-qa", label: "Geo QA", icon: MapPinned },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminSidebar({
  pathname,
  scope,
  onLogout,
  onNavigate,
  showClose,
  isHi,
}: {
  pathname: string;
  scope: "view" | "edit";
  onLogout: () => void;
  onNavigate?: () => void;
  showClose?: boolean;
  isHi?: boolean;
}) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-[#04330B] text-white">
      <div className="shrink-0 flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
          <img src="/PGPlogo.svg" alt="PGP" className="h-7 w-auto" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#86EFAC] uppercase">
            Peoples Green Party
          </p>
          <p className="text-sm font-semibold truncate">Website Admin</p>
        </div>
        {showClose ? (
          <button
            type="button"
            className="lg:hidden h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0"
            onClick={onNavigate}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <div className="space-y-5">
          {NAV.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-[10px] font-bold tracking-[0.16em] uppercase text-white/45">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                          active
                            ? "bg-white/15 text-white"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon size={17} className="shrink-0 opacity-90" />
                        <span className="truncate">
                          {item.href === "/admin/internships" && isHi ? "इंटर्नशिप" : item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center text-xs font-black">
            P
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">PGP Admin</p>
            <p className="text-[11px] text-white/55 capitalize">{scope} access</p>
          </div>
        </div>
        <a
          href="https://peoplesgreen.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10"
        >
          <ExternalLink size={15} /> Open peoplesgreen.org
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2.5 text-sm font-semibold"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const isHi = language === "hi";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scope, setScope] = useState<"view" | "edit">("view");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [readState, setReadState] = useState(() => loadNotifReadState());
  const notifRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !isNotificationRead(n.id, readState)).length,
    [notifications, readState]
  );

  const loadNotifications = async () => {
    if (!getAdminToken()) return;
    setNotifLoading(true);
    try {
      const data = await adminFetch<{ logs?: AdminNotification[] }>("audit/logs?limit=20");
      setNotifications(Array.isArray(data?.logs) ? data.logs : []);
      setReadState(loadNotifReadState());
    } catch {
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    setScope(getAdminScope());
    void loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!notifRef.current?.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [notifOpen]);

  const pageTitle = useMemo(() => {
    if (title) return title;
    if (pathname.startsWith("/admin/notifications")) return "Notifications";
    for (const section of NAV) {
      for (const item of section.items) {
        if (isActive(pathname, item.href)) return item.label;
      }
    }
    return "Admin";
  }, [pathname, title]);

  const logout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  const toggleNotifications = async () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next) await loadNotifications();
  };

  const openNotification = (n: AdminNotification) => {
    setReadState(markNotificationRead(n.id));
    setNotifOpen(false);
    router.push(notificationHref(n));
  };

  const markAllRead = () => {
    setReadState(markAllNotificationsRead(notifications));
  };

  return (
    <div className="fixed inset-0 z-40 flex bg-[#F3F6F4] text-[#04330B] font-['Familjen_Grotesk']">
      <div className="hidden lg:flex h-full w-[260px] shrink-0 flex-col">
        <AdminSidebar pathname={pathname} scope={scope} onLogout={logout} isHi={isHi} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[min(280px,88vw)] max-w-full shadow-2xl">
            <AdminSidebar
              pathname={pathname}
              scope={scope}
              onLogout={logout}
              onNavigate={() => setMobileOpen(false)}
              showClose
              isHi={isHi}
            />
          </div>
        </div>
      ) : null}

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 z-30 bg-white/95 backdrop-blur border-b border-[#E4F2EA]">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-3 min-w-0">
            <button
              type="button"
              className="lg:hidden h-10 w-10 shrink-0 rounded-xl border border-[#DDEEE4] flex items-center justify-center"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-[#587E67] truncate">
                {isHi ? "पीजीपी · वेबसाइट एडमिन" : "PGP · Website Admin"}
              </p>
              <h1 className="text-base sm:text-lg lg:text-xl font-black truncate">
                {pathname.startsWith("/admin/internships")
                  ? isHi
                    ? "इंटर्नशिप"
                    : "Internships"
                  : pageTitle}
              </h1>
              {subtitle ? (
                <p className="text-xs text-[#587E67] font-medium truncate">{subtitle}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setLanguage(isHi ? "en" : "hi")}
              className="h-10 px-2.5 rounded-xl border border-[#DDEEE4] text-xs font-black text-[#04330B] hover:bg-[#F8FBF9] shrink-0"
              aria-label={isHi ? "Switch to English" : "हिंदी में बदलें"}
              title={isHi ? "English" : "हिंदी"}
            >
              {isHi ? "EN" : "हिं"}
            </button>

            <div className="relative shrink-0" ref={notifRef}>
              <button
                type="button"
                onClick={toggleNotifications}
                className="relative h-10 w-10 rounded-xl border border-[#DDEEE4] flex items-center justify-center text-[#04330B] hover:bg-[#F8FBF9]"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#BE1E2D] text-white text-[10px] font-bold flex items-center justify-center">
                    {Math.min(unreadCount, 9)}
                    {unreadCount > 9 ? "+" : ""}
                  </span>
                ) : null}
              </button>

              {notifOpen ? (
                <div className="absolute right-0 mt-2 w-[min(380px,calc(100vw-1.5rem))] rounded-2xl border border-[#E4F2EA] bg-white shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#E4F2EA] flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-black text-[#04330B]">Notifications</p>
                      <p className="text-[11px] font-medium text-[#587E67]">
                        {unreadCount} unread
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={markAllRead}
                        disabled={unreadCount === 0}
                        className="text-[11px] font-bold text-[#04330B] disabled:opacity-40 hover:underline"
                      >
                        Mark all read
                      </button>
                      <Link
                        href="/admin/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="text-[11px] font-bold text-[#0D5229] hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                  <div className="max-h-[380px] overflow-y-auto">
                    {notifLoading ? (
                      <p className="px-4 py-8 text-sm text-[#587E67] font-medium text-center">
                        Loading…
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-8 text-sm text-[#587E67] font-medium text-center">
                        No notifications yet.
                      </p>
                    ) : (
                      <ul className="divide-y divide-[#F0F5F2]">
                        {notifications.map((log) => {
                          const unread = !isNotificationRead(log.id, readState);
                          return (
                            <li key={log.id}>
                              <button
                                type="button"
                                onClick={() => openNotification(log)}
                                className={`w-full text-left px-4 py-3 hover:bg-[#F8FBF9] transition-colors ${
                                  unread ? "bg-[#F3FBF6]" : ""
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <span
                                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                                      unread ? "bg-[#BE1E2D]" : "bg-[#D1D5DB]"
                                    }`}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={`text-sm text-[#04330B] ${
                                        unread ? "font-black" : "font-bold"
                                      }`}
                                    >
                                      {formatNotificationTitle(log.action)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-[#587E67] font-medium line-clamp-2">
                                      {formatNotificationBody(log)}
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#94A3B8] font-medium">
                                      {log.actor?.name ? `${log.actor.name} · ` : ""}
                                      {log.createdAt
                                        ? new Date(log.createdAt).toLocaleString("en-IN")
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  <div className="border-t border-[#E4F2EA] px-4 py-2.5 bg-[#F8FBF9]">
                    <Link
                      href="/admin/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="block text-center text-xs font-bold text-[#0D5229] hover:underline"
                    >
                      View all messages
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#DDEEE4] px-2.5 py-1.5 shrink-0">
              <div className="h-8 w-8 rounded-full bg-[#04330B] text-white flex items-center justify-center text-xs font-black">
                P
              </div>
              <div className="leading-tight hidden md:block">
                <p className="text-xs font-bold">PGP Admin</p>
                <p className="text-[10px] text-[#587E67] capitalize">{scope}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <div className="w-full min-w-0 max-w-full pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

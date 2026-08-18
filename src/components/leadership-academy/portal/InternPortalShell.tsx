"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { internFetch } from "@/lib/internApi";
import { useInternPortal } from "./InternPortalContext";
import { initialsFromName } from "./types";
import { PortalSidebar } from "./PortalSidebar";

export function InternPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, logout, refresh } = useInternPortal();
  const [mobileNav, setMobileNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifBusy, setNotifBusy] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const app = data?.application;
  const name = app?.fullName || (isHi ? "इंटर्न" : "Intern");
  const initials = initialsFromName(app?.fullName);
  const notifications = data?.notifications || [];
  const unread = data?.summary?.unreadNotifications ?? notifications.filter((n) => !n.readAt).length;

  useEffect(() => {
    setMobileNav(false);
    setMenuOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  // Match admin shell: lock page scroll so only the main pane scrolls
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
    if (!menuOpen && !notifOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      if (notifRef.current?.contains(e.target as Node)) return;
      setMenuOpen(false);
      setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen, notifOpen]);

  const markRead = async (id: number, href?: string | null) => {
    setNotifBusy(true);
    try {
      await internFetch(`leadership-academy/me/notifications/${id}/read`, { method: "POST" });
      await refresh();
      setNotifOpen(false);
      if (href) router.push(href);
    } catch {
      // keep dropdown open on failure
    } finally {
      setNotifBusy(false);
    }
  };

  const markAllRead = async () => {
    setNotifBusy(true);
    try {
      await internFetch("leadership-academy/me/notifications/read-all", { method: "POST" });
      await refresh();
    } catch {
      // ignore
    } finally {
      setNotifBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex bg-[#F3F8F5] text-[#0F2E1C] font-['Familjen_Grotesk']">
      {/* Fixed left sidebar — same pattern as admin */}
      <div className="hidden lg:flex h-full w-[260px] shrink-0 flex-col bg-[#04330B]">
        <div className="shrink-0 flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
            <img src="/PGPlogo.svg" alt="PGP" className="h-6 w-auto" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-[14px] font-bold text-white truncate flex items-center gap-1.5">
              {isHi ? "पीजीपी इंटर्नशिप" : "PGP Internships"}
              <span className="inline-flex h-3.5 w-3.5 overflow-hidden rounded-sm shrink-0 bg-white">
                <img
                  src="/internship/portal/leaf-icon-v2.png"
                  alt=""
                  className="block h-full w-full object-cover"
                />
              </span>
            </p>
            <p className="text-[10px] font-medium text-white/55">
              {isHi ? "सीखें • सेवा • नेतृत्व" : "Learn • Serve • Lead"}
            </p>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <PortalSidebar />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileNav ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileNav(false)}
          />
          <div className="relative h-full w-[min(280px,88vw)] max-w-full bg-[#04330B] shadow-2xl flex flex-col">
            <div className="shrink-0 flex items-center justify-between gap-2 px-4 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/PGPlogo.svg" alt="PGP" className="h-5 w-auto" />
                </div>
                <p className="text-sm font-bold text-white truncate">
                  {isHi ? "पीजीपी इंटर्नशिप" : "PGP Internships"}
                </p>
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white"
                onClick={() => setMobileNav(false)}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <PortalSidebar onNavigate={() => setMobileNav(false)} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Right column: top bar + scrollable content */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 z-30 border-b border-[#DCEBE2] bg-white/95 backdrop-blur">
          <div className="flex h-[64px] items-center gap-2 sm:gap-3 px-3 sm:px-5 lg:px-6">
            <button
              type="button"
              className="lg:hidden h-10 w-10 shrink-0 rounded-xl border border-[#DCEBE2] flex items-center justify-center"
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0 flex-1 lg:hidden">
              <p className="text-[14px] font-bold text-[#04330B] truncate">
                {isHi ? "पीजीपी इंटर्नशिप" : "PGP Internships"}
              </p>
            </div>

            <div className="hidden md:block flex-1" />

            <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setMenuOpen(false);
                  }}
                  className="relative h-10 w-10 rounded-full border border-[#DCEBE2] flex items-center justify-center text-[#04330B] hover:bg-[#F5FBF7]"
                  aria-label="Notifications"
                  title={isHi ? "सूचनाएँ" : "Notifications"}
                >
                  <Bell size={17} />
                  {unread > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </button>

                {notifOpen ? (
                  <div className="absolute right-0 mt-2 w-[min(360px,calc(100vw-1.5rem))] rounded-xl border border-[#DCEBE2] bg-white shadow-lg overflow-hidden z-50">
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-[#EAF2EC]">
                      <p className="text-[13px] font-bold text-[#04330B]">
                        {isHi ? "सूचनाएँ" : "Notifications"}
                      </p>
                      <button
                        type="button"
                        disabled={notifBusy || unread === 0}
                        onClick={() => void markAllRead()}
                        className="text-[11px] font-bold text-[#0B5A2A] hover:underline disabled:opacity-40"
                      >
                        {isHi ? "सभी पढ़ा चिह्नित" : "Mark all read"}
                      </button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <div className="mx-auto h-16 w-16 portal-empty-float">
                            <img
                              src="/internship/portal/empty/empty-announcements.png"
                              alt=""
                              aria-hidden
                              className="h-full w-full object-contain select-none"
                              draggable={false}
                            />
                          </div>
                          <p className="mt-3 text-[13px] font-semibold text-[#6B8F7A]">
                            {isHi ? "कोई सूचना नहीं" : "No notifications"}
                          </p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            disabled={notifBusy}
                            onClick={() => void markRead(n.id, n.href)}
                            className={`w-full text-left px-4 py-3 border-b border-[#F0F5F2] hover:bg-[#F8FBF9] ${
                              n.readAt ? "opacity-75" : "bg-[#F7FDF9]"
                            }`}
                          >
                            <p className="text-[13px] font-bold text-[#04330B]">{n.title}</p>
                            {n.body ? (
                              <p className="mt-0.5 text-[12px] font-medium text-[#4F6B5C] line-clamp-2">
                                {n.body}
                              </p>
                            ) : null}
                            <p className="mt-1 text-[11px] font-semibold text-[#6B8F7A]">
                              {new Date(n.createdAt).toLocaleString(locale, {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-[#DCEBE2] pl-1.5 pr-2.5 py-1.5 hover:bg-[#F5FBF7]"
                  aria-label={`Account menu — ${name}`}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                <span className="h-8 w-8 rounded-full bg-[#0B5A2A] text-white text-xs font-bold flex items-center justify-center overflow-hidden">
                  {app?.photoUrl ? (
                    <img src={app.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </span>
                  <span className="hidden sm:block text-left leading-tight">
                    <span className="block text-[13px] font-bold text-[#04330B] max-w-[120px] truncate">
                      {name}
                    </span>
                    <span className="block text-[11px] font-medium text-[#6B8F7A]">
                      {isHi ? "इंटर्न" : "Intern"}
                    </span>
                  </span>
                  <ChevronDown size={14} className="text-[#6B8F7A] hidden sm:block" />
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#DCEBE2] bg-white shadow-lg overflow-hidden z-50">
                    <Link
                      href="/internship/dashboard/profile"
                      className="block px-4 py-2.5 text-sm font-semibold text-[#04330B] hover:bg-[#F5FBF7]"
                      onClick={() => setMenuOpen(false)}
                    >
                      {isHi ? "मेरी प्रोफ़ाइल" : "My Profile"}
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#B91C1C] hover:bg-red-50 text-left"
                    >
                      <LogOut size={14} /> {isHi ? "लॉगआउट" : "Logout"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</main>
      </div>
    </div>
  );
}

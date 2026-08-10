"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Search,
  Bell,
  ChevronLeft,
  ExternalLink,
  MapPinned,
} from "lucide-react";
import { clearAdminSession, getAdminScope } from "@/lib/adminApi";

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
    title: "Internship Portal",
    items: [
      { href: "/admin/leadership-academy", label: "Applications", icon: GraduationCap },
    ],
  },
  {
    title: "Youth Front",
    items: [
      { href: "/admin/youth", label: "Youth Dashboard", icon: BarChart3 },
      { href: "/admin/youth/squads", label: "Squads", icon: Users },
      { href: "/admin/youth/missions", label: "Missions", icon: Target },
      { href: "/admin/youth/squad-missions", label: "Squad Missions", icon: Swords },
      { href: "/admin/youth/action-queue", label: "Action Queue", icon: AlertTriangle },
    ],
  },
  {
    title: "Organisation",
    items: [
      { href: "/admin/users", label: "Members", icon: Users },
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
}: {
  pathname: string;
  scope: "view" | "edit";
  onLogout: () => void;
  onNavigate?: () => void;
  showClose?: boolean;
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
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#16A34A] text-white"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4 pb-5 space-y-3 mt-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#16A34A] flex items-center justify-center text-sm font-black shrink-0">
            P
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">PGP Admin</p>
            <p className="text-[11px] text-white/55 capitalize">{scope} access</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-[#86EFAC] hover:text-white"
        >
          <ExternalLink size={14} /> Open peoplesgreen.org
        </Link>
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"view" | "edit">("view");

  useEffect(() => {
    setScope(getAdminScope());
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Admin is a fixed viewport shell — lock body so only the main pane scrolls
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

  const pageTitle = useMemo(() => {
    if (title) return title;
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

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (/^\d{10}$/.test(q) || q.includes("@")) {
      router.push(`/admin/users?q=${encodeURIComponent(q)}`);
      return;
    }
    router.push(`/admin/leadership-academy?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="fixed inset-0 z-40 flex bg-[#F3F6F4] text-[#04330B] font-['Familjen_Grotesk']">
      {/* Desktop sidebar: always full viewport height */}
      <div className="hidden lg:flex h-full w-[260px] shrink-0 flex-col">
        <AdminSidebar pathname={pathname} scope={scope} onLogout={logout} />
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

            {pathname !== "/admin" ? (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-[#587E67] hover:text-[#04330B] shrink-0"
              >
                <ChevronLeft size={16} /> Dashboard
              </Link>
            ) : null}

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-[#587E67] truncate">
                PGP · Website Admin
              </p>
              <h1 className="text-base sm:text-lg lg:text-xl font-black truncate">{pageTitle}</h1>
              {subtitle ? (
                <p className="text-xs text-[#587E67] font-medium truncate">{subtitle}</p>
              ) : null}
            </div>

            <form
              onSubmit={onSearch}
              className="hidden lg:flex items-center gap-2 flex-1 max-w-md min-w-0"
            >
              <div className="relative w-full min-w-0">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search members or applications…"
                  className="w-full h-10 rounded-xl border border-[#DDEEE4] bg-[#F8FBF9] pl-9 pr-3 text-sm font-medium outline-none focus:border-[#16A34A]"
                />
              </div>
            </form>

            <Link
              href="/admin/youth/action-queue"
              className="relative h-10 w-10 shrink-0 rounded-xl border border-[#DDEEE4] flex items-center justify-center text-[#04330B]"
              aria-label="Action queue"
              title="Action queue"
            >
              <Bell size={18} />
            </Link>

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

          <form onSubmit={onSearch} className="lg:hidden px-3 pb-3">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members or applications…"
                className="w-full h-10 rounded-xl border border-[#DDEEE4] bg-[#F8FBF9] pl-9 pr-3 text-sm font-medium outline-none focus:border-[#16A34A]"
              />
            </div>
          </form>
        </header>

        {/* Only this pane scrolls — sidebar stays full-height */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <div className="w-full min-w-0 max-w-full pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

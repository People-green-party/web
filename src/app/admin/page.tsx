'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Target, Swords, ClipboardList, ShieldCheck,
  BarChart3, LogOut, ChevronRight, AlertTriangle, Flag, GraduationCap,
} from 'lucide-react';

function normalizeApiBaseUrl(base: string) {
  const c = String(base || '').replace(/\/$/, '');
  if (!c) return 'http://localhost:3002/v1';
  if (c.endsWith('/v1')) return c;
  return `${c}/v1`;
}
const API = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002');

type Stats = {
  totalYouth?: number;
  pendingIssues?: number;
  flaggedMembers?: number;
};

const NAV_SECTIONS = [
  {
    title: 'Youth Front · JINDA',
    color: 'from-[#04330B] to-[#16A34A]',
    items: [
      { href: '/admin/youth',               icon: BarChart3,    label: 'Dashboard',           desc: 'XP stats, issues, action queue' },
      { href: '/admin/youth/squads',        icon: Users,        label: 'Squads',              desc: 'Approve, reject, freeze squads' },
      { href: '/admin/youth/squad-missions',icon: Swords,       label: 'Squad Missions',      desc: 'Approve squad mission submissions' },
      { href: '/admin/youth/missions',      icon: Target,       label: 'Mission Approvals',   desc: 'Approve individual mission proofs' },
      { href: '/admin/youth/action-queue',  icon: AlertTriangle,label: 'Action Queue',        desc: 'P0/P1 issues needing attention' },
    ],
  },
  {
    title: 'General',
    color: 'from-[#1E3A5F] to-[#2563EB]',
    items: [
      { href: '/admin/users',       icon: Users,        label: 'Members',       desc: 'Search and manage all members' },
      { href: '/admin/leadership-academy', icon: GraduationCap, label: 'Leadership Academy', desc: 'Review academy applications & status' },
      { href: '/admin/audit-logs',  icon: ClipboardList,label: 'Audit Logs',    desc: 'Full system audit trail' },
      { href: '/admin/elections',   icon: ShieldCheck,  label: 'Elections',     desc: 'Manage election candidates and results' },
      { href: '/admin/committees',  icon: Flag,         label: 'Committees',    desc: 'Manage committees and wings' },
    ],
  },
];

export default function AdminPage() {
  const router  = useRouter();
  const [stats, setStats]     = useState<Stats>({});
  const [authed, setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('admin_access_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    setAuthed(true);
    setChecking(false);

    // Load quick stats
    fetch(`${API}/admin/youth/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, [router]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    router.push('/admin/login');
  };

  if (checking) {
    return <div className="min-h-screen bg-[#F0FBF4] flex items-center justify-center text-[#587E67] font-semibold">Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0FBF4]">
      {/* Header */}
      <div className="bg-[#04330B] text-white px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#86EFAC] uppercase">Jinda Youth</p>
          <h1 className="text-xl font-black mt-0.5">Admin Panel</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-[#86EFAC] hover:text-white transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {/* Quick stats */}
      {(stats.totalYouth !== undefined) && (
        <div className="bg-white border-b border-[#DDEEE4] px-6 py-4 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-black text-[#04330B]">{stats.totalYouth ?? '—'}</div>
            <div className="text-xs text-[#587E67] font-semibold mt-0.5">Total Youth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-yellow-600">{stats.pendingIssues ?? '—'}</div>
            <div className="text-xs text-[#587E67] font-semibold mt-0.5">Pending Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-red-600">{stats.flaggedMembers ?? '—'}</div>
            <div className="text-xs text-[#587E67] font-semibold mt-0.5">Flagged</div>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${section.color} text-white text-xs font-black tracking-widest uppercase mb-3`}>
              {section.title}
            </div>
            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 bg-white rounded-2xl border border-[#DDEEE4] px-5 py-4 hover:border-[#16A34A] hover:shadow-sm transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center shrink-0 group-hover:bg-[#BBF7D0] transition-colors">
                      <Icon className="text-[#16A34A]" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-[#04330B] text-sm">{item.label}</div>
                      <div className="text-xs text-[#587E67] mt-0.5">{item.desc}</div>
                    </div>
                    <ChevronRight className="text-[#9CA3AF] group-hover:text-[#16A34A] shrink-0" size={18} />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

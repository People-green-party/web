"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  Share2,
  Award,
  Lock,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Camera,
  Download,
  Copy,
  CheckCheck,
  Leaf,
  X as CloseIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2canvas from 'html2canvas';

import { fetchApi } from '../../lib/api';
import { RequireAuth } from '../components/RequireAuth';
import { getAuthHeader } from '../../lib/supabaseClient';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useLanguage } from '../../components/LanguageContext';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface DashboardUserSummary {
  user: {
    id: number;
    name: string;
    phone: string;
    role: string | null;
    referralCode: string | null;
    memberId: string | null;
    photoUrl: string | null;
    localUnit: {
      name: string;
      vidhansabha: { name: string; loksabha: { name: string } };
    } | null;
    createdAt: string;
  };
}

// --- Internal Components ---
const SidebarItem = ({ icon: Icon, active = false, href = "#" }: { icon: any, active?: boolean, href?: string }) => (
  <Link href={href}>
    <div className={cn(
      "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer group",
      active ? "text-[#04330B]" : "text-gray-400 hover:text-[#04330B] hover:bg-gray-100"
    )}>
      <Icon size={22} fill={active ? "currentColor" : "none"} />
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#04330B]"
        />
      )}
    </div>
  </Link>
);

const StatLabel = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</span>
    <span className="text-sm font-bold text-[#04330B] leading-tight">{value}</span>
  </div>
);

const DashboardContent = () => {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<DashboardUserSummary | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [recruits, setRecruits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wantsToBeLeader, setWantsToBeLeader] = useState<boolean | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const idCardRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  // --- Logic: Data Fetching ---
  const loadDashboardData = async () => {
    try {
      const [s, p, r] = await Promise.all([
        fetchApi('users/me/summary'),
        fetchApi('users/me/recruitment-progress'),
        fetchApi('users/me/recruits')
      ]);
      setSummary(s as DashboardUserSummary);
      setProgress(p);
      setRecruits(r?.recruits || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getFullPhotoUrl = (url: string | null) => {
    if (!url || url === "") return `https://api.dicebear.com/7.x/initials/svg?seed=${summary?.user?.name || 'User'}`;
    if (url.startsWith('http')) return url;
    // For local dev,baseUrl will be http://localhost:3005
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/v1');
    const baseUrl = apiBase.split('/v1')[0];
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    loadDashboardData();
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pgp_leader_interest');
      if (saved === 'true') setWantsToBeLeader(true);
      // NOTE: We don't restore 'false', because we want it to reappear on refresh as requested
    }
  }, []);

  // --- Logic: Photo Upload ---
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const authHeader = await getAuthHeader();
      const fd = new FormData();
      fd.append('file', file);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/v1';
      const res = await fetch(`${baseUrl}/users/me/photo`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader.Authorization
        },
        body: fd,
      });
      if (res.ok) await loadDashboardData();
    } catch (e) { console.error('Upload failed:', e); }
    finally { setUploading(false); }
  };

  // --- Logic: Downloads ---
  const handleDownloadId = async () => {
    if (!idCardRef.current) return;
    try {
      // Ensure images are loaded before capturing
      const images = idCardRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
          // Refresh src if it's a cross-origin image to trigger CORS headers
          if (!img.src.includes('data:')) {
            const originalSrc = img.src;
            img.src = `${originalSrc}${originalSrc.includes('?') ? '&' : '?'}v=${Date.now()}`;
          }
        });
      }));

      // Small delay to ensure styles are re-rendered
      await new Promise(r => setTimeout(r, 200));

      const canvas = await html2canvas(idCardRef.current, {
        scale: 2.5, // Reduced scale for better compatibility and memory
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#020B03',
        logging: false,
        imageTimeout: 10000,
        onclone: (clonedDoc: Document) => {
          const card = clonedDoc.getElementById('membership-card-section-export');
          if (card) {
            // Force standard Arial/sans-serif to prevent font loading issues during capture
            card.style.fontFamily = 'Arial, sans-serif';
            card.style.display = 'flex'; // Ensure it's visible in the clone
          }
        }
      });
      const link = document.createElement('a');
      link.download = `PGP-ID-${(summary?.user?.name || 'User').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 0.9);
      link.click();
    } catch (err) {
      console.error('ID Card download failed:', err);
      alert('Failed to download ID card. This can happen if some icons or images haven\'t loaded. Please hard refresh (Ctrl/Cmd + Shift + R) and try again.');
    }
  };

  const handleDownloadLetter = async () => {
    if (!letterRef.current) return;
    try {
      const images = letterRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
      }));

      const canvas = await html2canvas(letterRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1000,
        windowHeight: 800
      });
      const link = document.createElement('a');
      link.download = `PGP-Appointment-${summary?.user?.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Letter download failed:', err);
      alert('Failed to download appointment letter. Please try again.');
    }
  };

  // --- Logic: Referral ---
  const referralLink = useMemo(() => {
    const code = summary?.user?.referralCode || '';
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/join?ref=${code.toUpperCase()}`;
  }, [summary]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUnlocked = recruits.length >= 5;
  const progressPercent = Math.min((recruits.length / 5) * 100, 100);

  if (loading) return <div className="h-screen bg-[#F8FAF9] flex items-center justify-center text-[#04330B] font-bold uppercase tracking-widest">Loading Premium Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans">
      <Navbar
        showAuthButtons={false}
        showProfileButton={true}
        showDonateButton={false}
        links={[
          { name: t.nav.home, href: '/' },
          { name: t.nav.donate, href: '/donation' },
          { name: t.nav.dashboard, href: '/dashboard' },
          { name: t.nav.election, href: '/election' }
        ]}
      />

      <div className="flex-1 flex flex-col pt-[92px]">

        <main className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-6">

          {/* Hero Section */}
          <section id="membership-card-section" className="bg-gradient-to-br from-[#022c0b] via-[#04330B] to-[#0a5c1a] rounded-[56px] p-12 flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden transition-all duration-1000 group shadow-2xl shadow-green-950/20 ring-1 ring-white/10">
            {/* LUXURY DECORATIONS */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-400/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-300/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 w-full xl:w-auto">
              {/* SUPREME PROFILE PHOTO */}
              <div className="relative">
                <div className="w-52 h-52 rounded-[4rem] bg-[#022c0b] p-1.5 ring-offset-[12px] ring-offset-[#04330B] ring-2 ring-emerald-400/30 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-105">
                  <div className="w-full h-full rounded-[3.5rem] overflow-hidden border-4 border-white/10">
                    <img
                      src={getFullPhotoUrl(summary?.user?.photoUrl || null)}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-[#022c0b]/80 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-[#04330B] rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer hover:bg-emerald-50 active:scale-90 transition-all z-20">
                  <Camera size={22} />
                  <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} />
                </label>
              </div>

              <div className="flex flex-col gap-8 text-center md:text-left flex-1">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-black tracking-[0.3em] uppercase">
                      {summary?.user?.role || "Elite Member"}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle2 size={12} className="text-emerald-400" /> Verified Identity
                    </div>
                  </div>
                  <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-4 drop-shadow-sm">
                    {summary?.user?.name}
                  </h1>
                </div>

                {/* GLASS DASHBOARD STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-black block mb-1">Protocol ID</span>
                    <span className="text-lg font-bold text-white leading-tight font-mono">{summary?.user?.memberId || "Pending"}</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-black block mb-1">Mobile Registry</span>
                    <span className="text-lg font-bold text-white leading-tight">{summary?.user?.phone || "---"}</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-black block mb-1">Regional Unit</span>
                    <span className="text-lg font-bold text-white leading-tight truncate">{summary?.user?.localUnit?.vidhansabha?.loksabha?.name || "Rajasthan"}</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-black block mb-1">Registry Date</span>
                    <span className="text-lg font-bold text-white leading-tight">
                      {summary?.user?.createdAt ? new Date(summary.user.createdAt).toLocaleDateString('en-GB') : "12/10/2023"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 relative z-10 w-full xl:w-auto">
              <button
                onClick={() => setShowCardModal(true)}
                className="px-10 py-5 bg-white text-[#04330B] rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-50 active:scale-95 transition-all shadow-2xl shadow-black/20"
              >
                View My Credentials
              </button>
            </div>
          </section>

          {/* Leadership Question */}
          {wantsToBeLeader === null && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-8"
            >
              <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#04330B]">
                <Leaf size={32} fill="currentColor" />
              </div>
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-[#04330B] mb-4">
                  {t.dashboard.leaderPoll.question} <br />
                  <span className="text-xl text-[#04330B]/40 font-medium">{t.dashboard.leaderPoll.questionEn}</span>
                </h2>
                <p className="text-gray-500">{t.dashboard.leaderPoll.description}</p>
              </div>
              <div className="flex gap-4 w-full max-w-md">
                <button
                  onClick={() => { setWantsToBeLeader(true); localStorage.setItem('pgp_leader_interest', 'true'); }}
                  className="flex-1 py-4 bg-[#04330B] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-green-900/10"
                >
                  {t.dashboard.leaderPoll.yes}
                </button>
                <button
                  onClick={() => { setWantsToBeLeader(false); }}
                  className="flex-1 py-4 bg-white text-gray-400 border border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all font-['Familjen_Grotesk']"
                >
                  {t.dashboard.leaderPoll.no}
                </button>
              </div>
            </motion.section>
          )}

          {/* Leadership Features (Hidden if 'No') */}
          {wantsToBeLeader === true && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Referral Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col h-full group hover:border-[#04330B]/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#04330B] mb-6 group-hover:scale-110 transition-transform">
                    <Share2 size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t.dashboard.sections.referral}</h3>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
                    {t.dashboard.sections.referralDesc}
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 flex items-center justify-between overflow-hidden">
                      <span className="text-[10px] font-mono text-gray-500 truncate mr-2">{referralLink}</span>
                      <button onClick={handleCopyLink} className="text-[#04330B] hover:scale-110 transition-transform">
                        {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <button onClick={() => window.open(`https://wa.me/?text=${t.dashboard.sections.whatsappShare} ${referralLink}`)} className="px-4 bg-[#25D366] text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity">
                      <Share2 size={18} fill="currentColor" />
                    </button>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden">
                  {!isUnlocked && <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10" />}
                  <div className="flex justify-between items-start mb-6 relative z-20">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#04330B]"><Award size={24} /></div>
                    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border", isUnlocked ? "bg-green-50 border-green-100 text-green-700" : "bg-gray-50 border-gray-100 text-gray-500")}>
                      {isUnlocked ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{isUnlocked ? t.dashboard.letterStatus.unlocked : t.dashboard.letterStatus.locked}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 relative z-20">{t.dashboard.sections.appointment}</h3>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed relative z-20">
                    {isUnlocked ? t.dashboard.letterStatus.congrats : `${t.dashboard.letterStatus.recruitMore} ${Math.max(0, 5 - recruits.length)} ${t.dashboard.letterStatus.toUnlock}`}
                  </p>
                  <div className="mt-auto relative z-20">
                    {isUnlocked ? (
                      <button onClick={handleDownloadLetter} className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"><Download size={18} /> {t.dashboard.download}</button>
                    ) : (
                      <>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-[#04330B]">{t.dashboard.letterStatus.status}: {recruits.length}/5 {t.dashboard.letterStatus.recruitsCap}</span>
                          <span className="text-xs font-bold text-[#04330B]">{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#04330B] rounded-full" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* Recruits Section */}
              <section className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#04330B]">{t.dashboard.sections.recruits}</h2>
                    <p className="text-sm text-gray-400 mt-1 font-medium italic">{t.dashboard.sections.recruitsDesc}</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-[#04330B] hover:bg-gray-100 transition-colors"><Filter size={18} />{t.dashboard.sections.filter}</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        <th className="pb-4 pl-4">{t.dashboard.sections.table.identity}</th>
                        <th className="pb-4">{t.dashboard.sections.table.position}</th>
                        <th className="pb-4">{t.dashboard.sections.table.region}</th>
                        <th className="pb-4">{t.dashboard.sections.table.status}</th>
                        <th className="pb-4 pr-4 text-right">{t.dashboard.sections.table.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruits.length === 0 ? (
                        <tr><td colSpan={5} className="py-20 text-center text-gray-400 italic">{t.dashboard.sections.noMembers}</td></tr>
                      ) : (
                        recruits.slice(0, 10).map((r) => (
                          <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-4 pl-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-[#04330B] text-xs">{r.name.charAt(0)}</div>
                                <div className="flex flex-col"><span className="font-bold text-sm text-[#04330B]">{r.name}</span><span className="text-[9px] text-gray-400">ID: {r.memberId || 'PGP-' + r.id}</span></div>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-gray-500">{summary?.user?.role || t.dashboard.roles.member}</td>
                            <td className="py-4 text-sm text-gray-500">{summary?.user?.localUnit?.name || 'Local'}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 rounded-full bg-[#F0FDF4] text-[#04330B] text-[10px] font-bold uppercase tracking-wider">
                                {t.dashboard.statusActive}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-right"><button className="text-gray-300 hover:text-[#04330B] transition-colors"><MoreHorizontal size={20} /></button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* HIDDEN EXPORT ELEMENTS */}
          <div className="fixed -left-[10000px] top-0 pointer-events-none select-none">
            {/* ULTRA PREMIUM ID Card for Export */}
            <div
              id="membership-card-section-export"
              ref={idCardRef}
              style={{
                width: '1200px',
                height: '750px',
                backgroundColor: '#010802',
                backgroundImage: 'url("/id-card-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '40px',
                padding: '0',
                color: '#ffffff',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: 'Arial, sans-serif',
                boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)'
              }}
            >
              {/* Ghosted Watermark Logo */}
              <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', opacity: 0.05, zIndex: 1 }}>
                <img src="/PGPlogo.svg" style={{ width: '600px', filter: 'brightness(0) invert(1)' }} crossOrigin="anonymous" />
              </div>

              {/* Left Stripe Dashboard */}
              <div style={{ width: '400px', backgroundColor: 'rgba(4, 51, 11, 0.85)', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', borderRight: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <img src="/PGPlogo.svg" style={{ height: '100px', filter: 'brightness(0) invert(1)', marginBottom: '20px' }} crossOrigin="anonymous" />
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Peoples Green Party</h2>
                  <div style={{ height: '3px', width: '40px', backgroundColor: '#4ade80', margin: '15px auto' }} />
                </div>

                <div style={{
                  width: '280px',
                  height: '280px',
                  borderRadius: '40px',
                  border: '6px solid #4ade80',
                  padding: '8px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  marginTop: '-20px'
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '28px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
                    <img
                      src={getFullPhotoUrl(summary?.user?.photoUrl || null)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '20px', padding: '15px 30px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '900', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Membership Valid Through</span>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#ffffff' }}>2024 - 2026</p>
                </div>
              </div>

              {/* Right Content Area */}
              <div style={{ flex: 1, padding: '60px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: '#4ade80', fontWeight: '900', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Official Digital Passport</span>
                    <h1 style={{ fontSize: '110px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em', margin: '10px 0 0 0', textTransform: 'uppercase', lineHeight: '0.85' }}>
                      {summary?.user?.name}
                    </h1>
                  </div>
                  <div style={{ padding: '12px 25px', borderRadius: '15px', border: '1px solid #4ade80', backgroundColor: 'rgba(74, 222, 128, 0.05)' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.1em' }}>ELITE CLASS</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', margin: '40px 0' }}>
                  <div style={{ padding: '30px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Current Role</span>
                    <p style={{ fontSize: '38px', fontWeight: '900', color: '#ffffff', margin: '8px 0 0 0', textTransform: 'uppercase' }}>{summary?.user?.role || "Verified Member"}</p>
                  </div>
                  <div style={{ padding: '30px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Member Protocol ID</span>
                    <p style={{ fontSize: '38px', fontWeight: '900', color: '#ffffff', margin: '8px 0 0 0', fontFamily: 'monospace' }}>{summary?.user?.memberId}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '30px' }}>
                  <div style={{ flex: 1, padding: '25px', borderLeft: '4px solid #4ade80', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Regional Unit</span>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 0 0' }}>{summary?.user?.localUnit?.vidhansabha?.loksabha?.name || 'RAJASTHAN CENTRAL'}</p>
                  </div>
                  <div style={{ flex: 1, padding: '25px', borderLeft: '4px solid #4ade80', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Registry Contact</span>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 0 0' }}>{summary?.user?.phone}</p>
                  </div>
                  <div style={{ flex: 1, padding: '25px', borderLeft: '4px solid #4ade80', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Issue Date</span>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 0 0' }}>{summary?.user?.createdAt ? new Date(summary.user.createdAt).toLocaleDateString('en-GB') : "12/10/2023"}</p>
                  </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)', borderRadius: '20px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#010802', letterSpacing: '0.5em', textTransform: 'uppercase' }}>Official Digital Identity • Peoples Green Party</span>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#010802', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '15px', height: '15px', backgroundColor: '#4ade80', borderRadius: '50%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div ref={letterRef} className="w-[1000px] bg-white text-[#020B03] p-24 font-serif">
              <div className="flex justify-between items-start border-b-4 border-green-800 pb-12 mb-16">
                <div>
                  <h1 className="text-5xl font-black text-green-900 tracking-tighter mb-4">Peoples Green Party</h1>
                  <p className="text-xl font-black uppercase tracking-[0.4em] text-green-700">Official Appointment Authority</p>
                </div>
                <Leaf className="text-green-800 opacity-20" size={100} />
              </div>
              <div className="space-y-12 text-2xl leading-relaxed">
                <p className="font-bold text-3xl uppercase">Dear {summary?.user?.name},</p>
                <p>We are pleased to inform you that you have successfully completed the Leadership Program by recruiting 5 members in your Local Unit. You are hereby appointed as the <span className="font-black text-green-900 border-b-4 border-green-700">CWC President</span> for your area.</p>
                <p>Your dedication to the party's ecological and social mission is highly valued. We trust your leadership will bring significant growth.</p>
              </div>
              <div className="mt-20 grid grid-cols-2 gap-20">
                <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Designation</p>
                  <p className="text-3xl font-black text-green-900">CWC President</p>
                </div>
                <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Issue Date</p>
                  <p className="text-3xl font-black text-green-900">{new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            </div>
          </div>

        </main>
        <Footer />

        {/* IDENTITY CARD MODAL */}
        {showCardModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowCardModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-4xl bg-[#020B03] border-[12px] border-[#04330B] rounded-[4.5rem] p-12 text-white shadow-2xl overflow-hidden aspect-[16/9] flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#04330B]/20 rounded-full blur-[120px]" />
              <button
                onClick={() => setShowCardModal(false)}
                className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
              >
                <CloseIcon size={32} />
              </button>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <img src="/PGPlogo.svg" alt="Logo" className="h-16 brightness-0 invert" />
                  <h2 className="text-xl font-bold text-[#04330B] mt-6 uppercase tracking-[0.4em] opacity-80">Official Member Identity</h2>
                </div>
                <div className="w-56 h-56 rounded-[3rem] border-4 border-[#04330B]/40 overflow-hidden shadow-2xl bg-black">
                  <img
                    src={getFullPhotoUrl(summary?.user?.photoUrl || null)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-auto relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <h1 className="text-6xl font-black uppercase tracking-tight leading-none text-white">{summary?.user?.name}</h1>
                    <div className="flex gap-8 font-mono text-[#04330B] text-xl font-bold uppercase tracking-[0.4em]">
                      <div>{summary?.user?.memberId}</div>
                      <div>{summary?.user?.role || t.dashboard.memberTier}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadId}
                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all mb-2"
                  >
                    <Download size={20} /> {t.dashboard.download}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PremiumDashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  X, // Twitter icon
  User,
  Menu,
  Share2,
  Trash2
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useLanguage } from '../../components/LanguageContext';
import { fetchApi } from '../../lib/api';
import { RequireAuth } from '../components/RequireAuth';
import html2canvas from 'html2canvas';
import { getAuthHeader } from '../../lib/supabaseClient';

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
    ward: { id: number; wardNumber: number; gp: { id: number; name: string } } | null;
    localUnit: {
      id: number;
      name: string;
      type: string;
      vidhansabha: { id: number; name: string; loksabha: { id: number; name: string } };
    } | null;
    cwcName?: string | null;
  };
  recruitsCount: number;
  votesCast: number;
}

interface DashboardRecruitProgress {
  role: string | null;
  total: number;
  target: number;
  remaining: number;
  localTotal?: number;
}

interface DashboardRecruitsListItem {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  photoUrl: string | null;
  localUnitId?: number | null;
}

type CwcTeamMember = {
  userId: number;
  role: string | null;
  user: { id: number; name: string; phone: string; role: string };
};

// --- Components ---

// Clean, standard download function without dangerous DOM hacks
async function downloadAsPng(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
  if (!ref.current) return;

  try {
    const canvas = await html2canvas(ref.current, {
      scale: 3, // High resolution
      useCORS: true, // Crucial for external profile photos
      allowTaint: false,
      backgroundColor: null,
      logging: false, // Turn on if debugging is needed
    });

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Canvas conversion failed');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download image:", error);
    alert("Could not download image. If the profile photo is loading, please wait a second and try again.");
  }
}

interface NewMemberIdCardProps {
  summary: DashboardUserSummary | null;
  loading: boolean;
  onPhotoUpdated: () => void;
}

const NewMemberIdCard = ({ summary, loading, onPhotoUpdated }: NewMemberIdCardProps) => {
  const { t } = useLanguage();
  const user = summary?.user;
  const idCardRef = useRef<HTMLDivElement | null>(null);

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    setUploading(true);
    try {
      const authHeader = await getAuthHeader();
      const formData = new FormData();
      formData.append('file', file, file.name || 'profile.jpg');

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${baseUrl}/users/me/photo`, {
        method: 'POST',
        headers: { ...authHeader },
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || 'Upload failed');
      }
      onPhotoUpdated();
    } catch (e) {
      console.error(e);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm('Remove your photo?')) return;
    setUploading(true);
    try {
      const authHeader = await getAuthHeader();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${baseUrl}/users/me/photo`, {
        method: 'DELETE',
        headers: { ...authHeader },
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || 'Remove failed');
      }
      onPhotoUpdated();
    } catch (e) {
      console.error(e);
      alert('Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  const designation = useMemo(() => {
    const role = (user?.role || 'Member') as string;
    // cwcName is of the form "CWC Ward 1 2"; extract just the trailing sequence number for display
    const rawName = (user?.cwcName || '') as string;
    let cwcLabel = '';
    if (rawName) {
      const parts = rawName.trim().split(/\s+/);
      const last = parts[parts.length - 1];
      const num = Number.parseInt(last, 10);
      if (!Number.isNaN(num)) {
        cwcLabel = `CWC ${num}`;
      } else {
        cwcLabel = 'CWC';
      }
    }

    if (role === 'CWCPresident') return cwcLabel ? `${cwcLabel} President` : 'CWC President';
    if (role === 'CWCMember') return cwcLabel ? `${cwcLabel} Member` : 'CWC Member';
    if (role === 'ExtendedMember') return cwcLabel ? `${cwcLabel} Extended Member` : 'Extended Member';
    return 'Member';
  },[user?.role, user?.cwcName]);

  const placeLine = useMemo(() => {
    const lok = user?.localUnit?.vidhansabha?.loksabha?.name;
    const vid = user?.localUnit?.vidhansabha?.name;
    const lu = user?.localUnit ? `${user.localUnit.name}${user.localUnit.type ? ` (${user.localUnit.type})` : ''}` : '';
    return[lok, vid, lu].filter(Boolean).join(', ');
  }, [user?.localUnit]);

  return (
    <div className="w-full bg-white rounded-[16px] p-[20px] flex flex-col gap-[14px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A]">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-[#04330B] font-['Familjen_Grotesk']">{t.dashboard.memberCardTitle}</h2>
      </div>

      <div className="flex items-center justify-center">
        {/* We use strict inline styles here because html2canvas ignores Tailwind CSS variable gradients */}
        <div
          ref={idCardRef}
          id="pgp-dashboard-capture-root"
          className="w-[360px] h-[210px] rounded-[18px] p-5 pb-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #04330B 0%, #0B5A2A 100%)',
            color: '#ffffff'
          }}
        >
          {/* Background shapes using inline RGBA so html2canvas renders them correctly */}
          <div className="absolute -right-10 -top-10 w-[180px] h-[180px] rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
          <div className="absolute -left-10 -bottom-10 w-[140px] h-[140px] rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

          <div className="flex items-start justify-between relative z-10">
            <div className="bg-white rounded-md px-2 py-1" style={{ backgroundColor: '#ffffff' }}>
              <img src="/PGPlogo.svg" alt="PGP" className="h-6" crossOrigin="anonymous" />
            </div>
            <div className="w-10 h-10 rounded-md flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl.startsWith('http')
                    ? user.photoUrl
                    : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '')}${user.photoUrl}`}
                  alt={user.name || 'Member'}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous" // CRITICAL: This allows html2canvas to fetch the image
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          <div className="mt-8 font-bold text-[18px] uppercase tracking-wide relative z-10" style={{ color: '#ffffff' }}>
            {loading ? '...' : (user?.name || t.dashboard.placeholderName)}
          </div>
          <div className="mt-1 text-[12px] font-semibold relative z-10" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            {loading ? '...' : designation}
          </div>
          <div className="mt-1 text-[12px] font-semibold relative z-10 max-w-[290px] truncate whitespace-nowrap" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {loading ? '...' : (placeLine || t.dashboard.placeholderWard)}
          </div>

          <div className="absolute bottom-4 left-5 text-[12px] font-bold tracking-widest z-10" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {loading ? '...' : (user?.memberId || t.dashboard.placeholderMembershipId)}
          </div>
          <div className="absolute bottom-4 right-5 w-10 h-10 rounded z-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <label className="cursor-pointer text-[#0D5229] bg-[#F1FBF6] px-4 py-2 rounded-full text-sm font-semibold border border-[#B9D3C4] hover:bg-[#E6F6EE] transition-colors">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {uploading ? t.dashboard.uploading : (user?.photoUrl ? t.dashboard.changePhoto : t.dashboard.uploadPhoto)}
        </label>
        {user?.photoUrl && !uploading && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full text-sm font-semibold border border-red-200 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
            <span>{t.dashboard.remove}</span>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => downloadAsPng(idCardRef, `PGP-ID-${(user?.name || 'Member').replace(/\s+/g, '-')}.png`)}
        className="w-full h-[46px] rounded-[10px] border border-[#B9D3C4] text-[#04330B] font-semibold bg-[#F1FBF6] mt-1"
        disabled={loading}
      >
        {t.dashboard.downloadCard}
      </button>
    </div>
  );
};

function SlotCircle({ label, filled, name, photoUrl }: { label: string; filled: boolean; name?: string; photoUrl?: string | null }) {
  return (
    <div className="flex flex-col items-center gap-2 w-[92px]">
      <div className={filled ? 'w-14 h-14 rounded-full bg-[#04330B] text-white flex items-center justify-center border-4 border-[#EAF7EE] overflow-hidden' : 'w-14 h-14 rounded-full bg-white text-[#587E67] flex items-center justify-center border border-dashed border-[#B9D3C4]'}>
        {filled && photoUrl ? (
          <img src={photoUrl.startsWith('http') ? photoUrl : photoUrl} alt={name || label} className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>
      <div className="text-[10px] font-bold text-[#587E67] uppercase tracking-wide">{label}</div>
      {filled && name ? (
        <div className="text-[11px] font-bold text-[#04330B] text-center leading-[1.1] line-clamp-2">
          {name}
        </div>
      ) : null}
    </div>
  );
}

// --- Main Layout Content ---
const DashboardContent = () => {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<DashboardUserSummary | null>(null);
  const[progress, setProgress] = useState<DashboardRecruitProgress | null>(null);
  const[recruits, setRecruits] = useState<DashboardRecruitsListItem[]>([]);
  const [committee, setCommittee] = useState<{ id: number; name: string } | null>(null);
  const[cwcMembers, setCwcMembers] = useState<CwcTeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const appointmentRef = useRef<HTMLDivElement | null>(null);

  const effectiveOrigin = typeof window !== 'undefined'
    ? (['peoplesgreen.org', 'www.peoplesgreen.org'].includes(window.location.hostname)
      ? 'https://peoplesgreen.org'
      : window.location.origin)
    : 'https://peoplesgreen.org';

  const referralCode = summary?.user?.referralCode || '';
  const isLeader = !!(progress as any)?.isLeader;

  const [showLeadershipTracker, setShowLeadershipTracker] = useState(false);

  useEffect(() => {
    // Auto-show tracker if they already have recruits, OR if they clicked it previously
    if (
      (progress?.localTotal && progress.localTotal > 0) ||
      (typeof window !== 'undefined' && localStorage.getItem('optedInLeader') === 'true')
    ) {
      setShowLeadershipTracker(true);
    }
  }, [progress?.localTotal]);

  const handleOptInLeader = () => {
    setShowLeadershipTracker(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('optedInLeader', 'true');
    }
  };

  const visibleRecruits = useMemo(() => {
    return (recruits || []).slice(0, 5);
  }, [recruits]);

  const localUnitId = summary?.user?.localUnit?.id ?? null;
  const localUnitRecruits = useMemo(() => {
    if (!localUnitId) return[];
    return (recruits ||[]).filter((r) => Number((r as any).localUnitId) === Number(localUnitId));
  }, [recruits, localUnitId]);

  const canDownloadAppointment = isLeader;

  const refreshSummary = async () => {
    try {
      const summaryRes = await fetchApi('users/me/summary');
      setSummary(summaryRes as DashboardUserSummary);
      if (typeof window !== 'undefined') {
        const cached = window.localStorage.getItem('dashboard_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            parsed.summary = summaryRes;
            window.localStorage.setItem('dashboard_cache', JSON.stringify(parsed));
          } catch (e) {
            console.error('Failed to update dashboard_cache after refreshSummary', e);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const dashboardLinks =[
    { name: t.nav.dashboard, href: '/dashboard' },
    { name: t.nav.election, href: '/election' }
  ];

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      // 1. Try to load from cache first for instant display
      const cached = localStorage.getItem('dashboard_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Only use cache if it has the expected structure
          if (parsed.summary && parsed.progress) {
            setSummary(parsed.summary);
            setProgress(parsed.progress);
            setRecruits(parsed.recruits ||[]);
            setLoading(false); // Show cached content immediately
          }
        } catch (e) {
          console.warn('Invalid dashboard cache', e);
        }
      }

      // 2. Fetch fresh data (background update)
      // Only set loading true if we didn't have cached data
      if (!cached) setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const[summaryRes, progressRes, recruitsRes] = await Promise.all([
          fetchApi('users/me/summary'),
          fetchApi('users/me/recruitment-progress'),
          fetchApi('users/me/recruits')
        ]);

        if (cancelled) return;

        const newRecruits = recruitsRes?.recruits ||[];

        // Update state with fresh data
        setSummary(summaryRes as DashboardUserSummary);
        setProgress(progressRes as DashboardRecruitProgress);
        setRecruits(newRecruits as DashboardRecruitsListItem[]);

        // Update cache
        localStorage.setItem('dashboard_cache', JSON.stringify({
          summary: summaryRes,
          progress: progressRes,
          recruits: newRecruits
        }));

        // Load committee members only for leaders (best-effort; doesn't block dashboard)
        try {
          const isLeader = !!(progressRes as any)?.isLeader;
          if (isLeader) {
            const auth = await getAuthHeader();
            if (auth?.Authorization) {
              const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
              const res = await fetch(`${baseUrl}/cwc/my-team`, { headers: { ...auth }, cache: 'no-store' });
              if (res.ok) {
                const data = await res.json();
                if (!cancelled) {
                  setCommittee(data.committee || null);
                  setCwcMembers(Array.isArray(data.members) ? data.members :[]);
                }
              }
            }
          } else if (!cancelled) {
            setCommittee(null);
            setCwcMembers([]);
          }
        } catch (e) {
          console.warn('Failed to load CWC team', e);
        }

      } catch (err: any) {
        if (cancelled) return;
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  },[]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pt-[104px] overflow-x-hidden">

      {/* Navbar with showProfileButton=true and isDashboard=true */}
      <Navbar links={dashboardLinks} showAuthButtons={false} showProfileButton={true} isDashboard={true} />

      <main className="w-full max-w-[1180px] mx-auto flex flex-col items-center px-4 lg:px-8">
        {/* Main Content Container - 1320x420, Gap 40px */}
        {error && (
          <div className="w-full max-w-[1320px] px-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-md text-sm font-['Familjen_Grotesk']">
            {error}
          </div>
        )}
        <section className="w-full mt-6 bg-[#F7FCF9] rounded-[24px] border border-[#E4F2EA] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-6 lg:p-10">
            <div className="text-center">
              <div className="text-[20px] font-bold text-[#04330B]">{t.dashboard.leadershipTitle}</div>
              <div className="mt-2 w-full rounded-[12px] border border-[#DDEEE4] bg-[#F1FBF6] text-[#04330B] font-semibold text-center py-3">
                {t.dashboard.leadershipJoined}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
              <NewMemberIdCard summary={summary} loading={loading} onPhotoUpdated={refreshSummary} />

              {(isLeader || showLeadershipTracker) && (
              <div className="w-full flex flex-col gap-4">
                <div className="rounded-[14px] border border-[#DDEEE4] bg-white p-5 shadow-sm">
                  <div className="text-[#04330B] font-bold">{t.dashboard.inviteTitle}</div>
                  <div className="mt-1 text-[12px] text-[#587E67] font-semibold">
                    {t.dashboard.inviteSubtitle}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const code = referralCode;
                        const inviteUrl = code ? `${effectiveOrigin}/join?ref=${code}` : `${effectiveOrigin}/join`;
                        const text = `${t.dashboard.inviteShareText} ${inviteUrl}`;
                        const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="flex-1 h-[46px] rounded-[12px] bg-[#10B981] text-white font-semibold"
                      disabled={!referralCode}
                    >
                      {t.dashboard.shareWhatsApp}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const code = referralCode;
                        const inviteUrl = code ? `${effectiveOrigin}/join?ref=${code}` : `${effectiveOrigin}/join`;
                        await navigator.clipboard.writeText(inviteUrl);
                      }}
                      className="h-[46px] px-4 rounded-[12px] border border-[#B9D3C4] text-[#04330B] font-semibold bg-[#F1FBF6]"
                      disabled={!referralCode}
                    >
                      {t.dashboard.copyLink}
                    </button>
                  </div>
                </div>

                <div className="rounded-[16px] border border-[#E4F2EA] bg-white p-5 shadow-sm">
                  <div className="text-[#04330B] font-bold">{t.dashboard.referralTitle}</div>
                  <div className="mt-1 text-[12px] text-[#587E67] font-semibold">{t.dashboard.referralSubtitle}</div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[#587E67] font-semibold">{t.dashboard.referralLabel}</div>
                      <div className="text-[22px] font-bold text-[#04330B] tracking-[0.2em]">
                        {(referralCode || '--------').toString().toUpperCase()}
                      </div>
                    </div>
                    <div className="w-[96px] h-[96px] rounded-[14px] border border-[#DDEEE4] bg-[#F7FCF9] flex items-center justify-center overflow-hidden">
                      {String(referralCode || '').trim() ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                            `${effectiveOrigin}/join?ref=${String(referralCode || '').trim().toUpperCase()}`
                          )}`}
                          alt="QR Code"
                          className="w-[88px] h-[88px]"
                        />
                      ) : (
                        <div className="text-[12px] font-bold text-[#587E67]">QR</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>

            {!isLeader && (
              <div className="mt-10 w-full">
                {!showLeadershipTracker ? (
                  <button
                    type="button"
                    onClick={handleOptInLeader}
                    className="w-full rounded-[18px] border border-[#DDEEE4] bg-white px-6 py-5 shadow-sm text-left"
                  >
                    <div className="text-[#04330B] font-bold text-[18px]">{t.dashboard.leaderOptInPrompt}</div>
                    <div className="mt-2 inline-flex items-center justify-center h-[44px] px-5 rounded-[12px] bg-[#10B981] text-white font-bold">
                      {t.dashboard.leaderOptInYes}
                    </div>
                  </button>
                ) : (
                  <>
                    <div className="mt-2 w-full rounded-[16px] border border-[#DDEEE4] bg-white p-6 shadow-sm">
                      <div className="text-[#04330B] font-bold text-[18px]">{t.dashboard.becomeLeaderTitle}</div>
                      <div className="mt-1 text-[12px] text-[#587E67] font-semibold">{t.dashboard.becomeLeaderSubtitle}</div>

                      <div className="mt-4 flex gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const code = referralCode;
                            const inviteUrl = code ? `${effectiveOrigin}/join?ref=${code}` : `${effectiveOrigin}/join`;
                            const text = `${t.dashboard.inviteShareText} ${inviteUrl}`;
                            const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                            window.open(waUrl, '_blank');
                          }}
                          className="h-[46px] px-5 rounded-[12px] bg-[#10B981] text-white font-semibold"
                          disabled={!referralCode}
                        >
                          {t.dashboard.shareWhatsApp}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const code = referralCode;
                            const inviteUrl = code ? `${effectiveOrigin}/join?ref=${code}` : `${effectiveOrigin}/join`;
                            await navigator.clipboard.writeText(inviteUrl);
                          }}
                          className="h-[46px] px-5 rounded-[12px] border border-[#B9D3C4] text-[#04330B] font-semibold bg-[#F1FBF6]"
                          disabled={!referralCode}
                        >
                          {t.dashboard.copyLink}
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-center gap-6 flex-wrap">
                        <SlotCircle label={t.dashboard.leaderLabel} filled name={summary?.user?.name || 'You'} photoUrl={summary?.user?.photoUrl || null} />
                        {Array.from({ length: 5 }).map((_, i) => {
                          const recruit = localUnitRecruits[i];
                          return (
                            <SlotCircle
                              key={i}
                              label={`${t.dashboard.slotLabel} ${i + 1}`}
                              filled={!!recruit}
                              name={recruit?.name}
                              photoUrl={recruit?.photoUrl || null}
                            />
                          );
                        })}
                      </div>
                      <div className="mt-6 text-center text-[#587E67] font-semibold text-[13px]">
                        {t.dashboard.slotsHint}
                      </div>
                    </div>

                    <div className="mt-10 rounded-[16px] border border-[#E4F2EA] bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[#04330B] font-bold text-[18px]">{t.dashboard.appointmentTitle}</div>
                          <div className="mt-1 text-[12px] text-[#587E67] font-semibold">
                            {t.dashboard.appointmentLocked}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled
                          className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed"
                          title={t.dashboard.locked}
                        >
                          <span className="text-[18px] font-bold">↓</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {isLeader && (
              <div className="mt-10 rounded-[16px] border border-[#E4F2EA] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-[#04330B] font-bold text-[18px]">{committee?.name || t.dashboard.myTeamTitle}</div>
                    <div className="mt-1 text-[12px] text-[#587E67] font-semibold">Your CWC members</div>
                  </div>
                  <Link
                    href="/cwc/my-team"
                    className="h-[38px] px-4 rounded-[12px] border border-[#B9D3C4] text-[#04330B] font-semibold bg-[#F1FBF6] flex items-center"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cwcMembers.length === 0 ? (
                    <div className="text-sm text-[#587E67] font-semibold">No members yet.</div>
                  ) : (
                    cwcMembers.map((m) => (
                      <div key={String(m.userId)} className="flex items-center justify-between gap-3 rounded-[12px] border border-[#E4F2EA] bg-[#F7FCF9] px-4 py-3">
                        <div className="min-w-0">
                          <div className="font-bold text-[#04330B] truncate">{m.user?.name}</div>
                          <div className="text-[12px] text-[#587E67] font-semibold truncate">{m.user?.phone}</div>
                        </div>
                        <div className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-[#EAF7EE] text-[#0D5229] border border-[#B9D3C4] font-bold">
                          {m.role || m.user?.role || 'Member'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {isLeader && (
            <div className="mt-10 rounded-[16px] border border-[#E4F2EA] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#04330B] font-bold text-[18px]">{t.dashboard.appointmentTitle}</div>
                  <div className="mt-1 text-[12px] text-[#587E67] font-semibold">
                    {canDownloadAppointment ? t.dashboard.appointmentReady : t.dashboard.appointmentLocked}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!canDownloadAppointment}
                  onClick={() => downloadAsPng(appointmentRef, `PGP-Appointment-${(summary?.user?.name || 'Member').replace(/\s+/g, '-')}.png`)}
                  className={canDownloadAppointment
                    ? 'w-12 h-12 rounded-full bg-[#04330B] text-white flex items-center justify-center'
                    : 'w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed'}
                  title={canDownloadAppointment ? t.dashboard.download : t.dashboard.locked}
                >
                  <span className="text-[18px] font-bold">↓</span>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-[#F1FBF6] flex items-center justify-center border border-[#DDEEE4]">
                  <Mail className="text-[#04330B]" />
                </div>
                <div>
                  <div className="font-bold text-[#04330B]">{t.dashboard.appointmentTitle}</div>
                  <div className="text-[12px] text-[#587E67] font-semibold">
                    {canDownloadAppointment ? t.dashboard.appointmentReady : t.dashboard.appointmentLocked}
                  </div>
                </div>
              </div>

              <div className="mt-6" ref={appointmentRef}>
                <div className="w-full rounded-[18px] border border-[#DDEEE4] bg-[#F7FCF9] p-6">
                  <div className="text-[18px] font-bold text-[#04330B]">{t.dashboard.partyName}</div>
                  <div className="mt-3 text-[#04330B] font-semibold">{t.dashboard.dear} {summary?.user?.name || 'Member'},</div>
                  <div className="mt-3 text-[13px] text-[#587E67] font-semibold leading-relaxed">
                    {t.dashboard.appointmentBody}
                  </div>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
                    <div>
                      <div className="text-[#587E67] font-semibold">{t.dashboard.designationLabel}</div>
                      <div className="text-[#04330B] font-bold">{t.dashboard.cwcPresident}</div>
                    </div>
                    <div>
                      <div className="text-[#587E67] font-semibold">{t.dashboard.dateLabel}</div>
                      <div className="text-[#04330B] font-bold">{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="mt-8 text-[12px] text-[#587E67] font-semibold">{t.dashboard.authorizedSignatory}</div>
                </div>
              </div>
            </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
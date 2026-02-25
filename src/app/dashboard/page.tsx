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
const normalizeCssColor = (() => {
  if (typeof document === 'undefined') return (c: string, _fallback: string) => c;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return (c: string, _fallback: string) => c;
  return (c: string, fallback: string) => {
    const v = (c || '').trim();
    if (!v || v === 'none') return v;
    if (/\b(lab|lch|oklab|oklch|color-mix)\(/i.test(v)) return fallback;
    ctx.fillStyle = '#000';
    try {
      ctx.fillStyle = v;
      return ctx.fillStyle as string;
    } catch {
      return fallback;
    }
  };
})();

function inlineComputedColors(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  for (const el of nodes) {
    const cs = window.getComputedStyle(el);
    el.style.color = normalizeCssColor(cs.color, 'rgb(0, 0, 0)');
    el.style.backgroundColor = normalizeCssColor(cs.backgroundColor, 'transparent');
    el.style.borderColor = normalizeCssColor(cs.borderColor, 'rgba(0, 0, 0, 0)');
    el.style.outlineColor = normalizeCssColor(cs.outlineColor, 'rgba(0, 0, 0, 0)');
    el.style.textDecorationColor = normalizeCssColor((cs as any).textDecorationColor || cs.color, 'rgb(0, 0, 0)');
    el.style.boxShadow = cs.boxShadow;
  }
}

function sanitizeForCanvas(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  for (const el of nodes) {
    el.style.boxShadow = 'none';
    (el.style as any).textShadow = 'none';
    (el.style as any).filter = 'none';
    (el.style as any).backdropFilter = 'none';
  }

  // Preserve the green look in downloads (avoid relying on Tailwind gradient tokens).
  const gradientNodes = root.querySelectorAll<HTMLElement>('.bg-gradient-to-br');
  gradientNodes.forEach((el) => {
    el.style.backgroundImage = 'linear-gradient(135deg, rgb(4, 51, 11), rgb(11, 90, 42))';
    el.style.backgroundColor = 'rgb(4, 51, 11)';
  });
}

async function downloadAsPng(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
  if (!ref.current) return;
  const canvas = await html2canvas(ref.current, {
    scale: 3,
    backgroundColor: null,
    useCORS: true,
    onclone: (doc: Document) => {
      const win = doc.defaultView as any;
      if (win && !win.__pgpPatchedGetComputedStyle) {
        const BAD_COLOR_RE = /\b(lab|lch|oklab|oklch|color-mix)\(/i;
        const origGetComputed = win.getComputedStyle.bind(win);
        win.__pgpPatchedGetComputedStyle = true;
        win.getComputedStyle = ((elt: Element) => {
          const cs = origGetComputed(elt);
          return new Proxy(cs, {
            get(target, prop, receiver) {
              const value = Reflect.get(target, prop, receiver);
              if (typeof value === 'string' && BAD_COLOR_RE.test(value)) {
                const key = String(prop).toLowerCase();
                if (key.includes('color')) return 'rgb(0,0,0)';
                if (key.includes('background')) return 'none';
                return '';
              }
              return value;
            },
          }) as any;
        }) as any;
      }

      const cloned = doc.getElementById('pgp-dashboard-capture-root') as HTMLElement | null;
      if (!cloned) return;
      const nodes = [cloned, ...Array.from(cloned.querySelectorAll<HTMLElement>('*'))];
      for (const el of nodes) {
        const cs = doc.defaultView?.getComputedStyle(el);
        if (!cs) continue;
        el.style.boxShadow = 'none';
        (el.style as any).textShadow = 'none';
        (el.style as any).filter = 'none';
        (el.style as any).backdropFilter = 'none';

        const hasBadColor = (value: string | null | undefined) => {
          if (!value) return false;
          return /\b(lab|lch|oklab|oklch|color-mix)\(/i.test(value);
        };

        // Neutralize only properties that contain unsupported color functions
        const bgImg = cs.backgroundImage || cs.background;
        if (hasBadColor(bgImg)) {
          el.style.backgroundImage = 'none';
        }

        const borderImg = (cs as any).borderImageSource as string | undefined;
        if (hasBadColor(borderImg)) {
          (el.style as any).borderImage = 'none';
        }

        const outlineColor = cs.outlineColor;
        if (hasBadColor(outlineColor)) {
          el.style.outlineColor = 'transparent';
        }

        const borderColor = cs.borderColor;
        if (hasBadColor(borderColor)) {
          el.style.borderColor = 'transparent';
        }
      }

      const gradientNodes = cloned.querySelectorAll<HTMLElement>('.bg-gradient-to-br');
      gradientNodes.forEach((el) => {
        el.style.backgroundImage = 'linear-gradient(135deg, rgb(4, 51, 11), rgb(11, 90, 42))';
        el.style.backgroundColor = 'rgb(4, 51, 11)';

        // Ensure text on the card remains light for readability
        const innerTextNodes = Array.from(el.querySelectorAll<HTMLElement>('*'));
        for (const t of innerTextNodes) {
          const cs = doc.defaultView?.getComputedStyle(t);
          if (!cs) continue;
          if (cs.color && cs.color !== 'rgb(0, 0, 0)') {
            // keep non-black colors as-is
            t.style.color = cs.color;
          } else {
            // nudge truly black text to white to avoid dark-on-dark
            t.style.color = '#ffffff';
          }
        }
      });
    },
  });
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b: Blob | null) => resolve(b), 'image/png'));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
    const cwcName = (user?.cwcName || '') as string;
    if (role === 'CWCPresident') return cwcName ? `${cwcName} President` : 'CWC President';
    if (role === 'CWCMember') return cwcName ? `${cwcName} Member` : 'CWC Member';
    if (role === 'ExtendedMember') return cwcName ? `${cwcName} Extended Member` : 'Extended Member';
    return 'Member';
  }, [user?.role, user?.cwcName]);

  const placeLine = useMemo(() => {
    const lok = user?.localUnit?.vidhansabha?.loksabha?.name;
    const vid = user?.localUnit?.vidhansabha?.name;
    const lu = user?.localUnit ? `${user.localUnit.name}${user.localUnit.type ? ` (${user.localUnit.type})` : ''}` : '';
    return [lok, vid, lu].filter(Boolean).join(', ');
  }, [user?.localUnit]);

  return (
    <div className="w-full bg-white rounded-[16px] p-[20px] flex flex-col gap-[14px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A]">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-[#04330B] font-['Familjen_Grotesk']">{t.dashboard.memberCardTitle}</h2>
      </div>

      <div ref={idCardRef} id="pgp-dashboard-capture-root" className="flex items-center justify-center">
        <div className="w-[360px] h-[210px] rounded-[18px] bg-gradient-to-br from-[#04330B] to-[#0B5A2A] p-5 text-white shadow-[0px_18px_40px_rgba(0,0,0,0.25)] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-[180px] h-[180px] rounded-full bg-white/10" />
          <div className="absolute -left-10 -bottom-10 w-[140px] h-[140px] rounded-full bg-white/10" />

          <div className="flex items-start justify-between">
            <div className="bg-white rounded-md px-2 py-1">
              <img src="/PGPlogo.svg" alt="PGP" className="h-6" />
            </div>
            <div className="w-10 h-10 rounded-md bg-white/15 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="mt-8 font-bold text-[18px] uppercase tracking-wide">
            {loading ? '...' : (user?.name || t.dashboard.placeholderName)}
          </div>
          <div className="mt-1 text-[12px] text-white/85 font-semibold">
            {loading ? '...' : designation}
          </div>
          <div className="mt-1 text-[12px] text-white/80 font-semibold">
            {loading ? '...' : (placeLine || t.dashboard.placeholderWard)}
          </div>

          <div className="absolute bottom-4 left-5 text-[12px] font-bold tracking-widest text-white/90">
            {loading ? '...' : (user?.memberId || t.dashboard.placeholderMembershipId)}
          </div>
          <div className="absolute bottom-4 right-5 w-10 h-10 rounded bg-white/15" />
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

interface RecruitsPanelProps {
  summary: DashboardUserSummary | null;
  progress: DashboardRecruitProgress | null;
  recruits: DashboardRecruitsListItem[];
  loading: boolean;
}

const RecruitsPanel = ({ summary, progress, recruits, loading }: RecruitsPanelProps) => {
  const { t, language } = useLanguage();
  const currentLang = language as 'en' | 'hi';

  const effectiveOrigin = typeof window !== 'undefined'
    ? (['peoplesgreen.org', 'www.peoplesgreen.org'].includes(window.location.hostname)
      ? 'https://peoplesgreen.org'
      : window.location.origin)
    : 'https://peoplesgreen.org';

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const code = summary?.user?.referralCode || '';
      if (code) {
        navigator.clipboard.writeText(code);
        alert('Referral code copied!');
      }
    }
  };

  const referralCode = summary?.user?.referralCode || t.dashboard.placeholderReferralCode;

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    // Construct the share link
    // If not production, we might want to ensure we point to the public URL, but window.location.origin handles the current host
    const shareUrl = `${effectiveOrigin}/join?ref=${referralCode}`;
    const shareText = `Join Peoples Green Party using my referral code: ${referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Peoples Green Party',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  const total = progress?.total ?? 0;
  const target = progress?.target ?? 0;
  const percentage = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0;
  const progressLabel = target > 0 ? `${total}/${target}` : `${total}`;

  // QR Code URL - points to the join page with ref code
  const qrData = typeof window !== 'undefined' ? `${effectiveOrigin}/join?ref=${referralCode}` : `https://peoplesgreen.org/join?ref=${referralCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=118x118&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="w-full lg:flex-1 h-auto lg:min-h-[420px] bg-white rounded-[8px] p-[24px] pt-[20px] pb-[20px] flex flex-col gap-[20px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A]">
      {/* Top Section: Header & QR */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-3/4 flex flex-col gap-[12px]">
          <h2 className="text-[24px] font-bold text-[#04330B] font-['Familjen_Grotesk'] leading-[30px]">{t.dashboard.recruitsTitle}</h2>

          <div className="flex items-center gap-2 h-[22px]">
            <span className="text-[#587E67] font-semibold font-['Familjen_Grotesk'] text-[16px]">{t.dashboard.referralCode}</span>
            <span className="text-[#04330B] font-bold font-['Familjen_Grotesk'] text-[16px]">{referralCode}</span>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="cursor-pointer hover:opacity-80 transition-opacity ml-2"
              title={t.dashboard.copy}
            >
              <img src="/CopiedIcon.svg" alt="Copy" className="w-[18px] h-[18px]" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="cursor-pointer hover:opacity-80 transition-opacity ml-1"
              title="Share Link"
            >
              <Share2 size={18} className="text-[#0D5229]" />
            </button>
          </div>

          <p className="text-[14px] text-[#587E67] font-semibold font-['Familjen_Grotesk'] leading-[18px]">
            {target > 0 ? t.dashboard.target : t.dashboard.targetNone}
          </p>

          {/* Progress Bar */}
          <div className="relative w-full max-w-[500px] h-[32px] bg-[#C6E0D1] rounded-[8px] overflow-hidden flex items-center">
            <div
              className="absolute left-0 top-0 h-full bg-[#65A27F] rounded-r-lg"
              style={{ width: `${percentage}%` }}
            ></div>
            <span className="relative z-10 pl-3 text-[14px] font-bold text-white font-['Familjen_Grotesk']">{progressLabel}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-4 md:mt-0 flex-shrink-0 w-[134px] h-[134px] p-[8px] border border-dashed border-[#0D5229] flex items-center justify-center">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-[118px] h-[118px]"
          />
        </div>
      </div>

      {/* Recruited Members Grid */}
      <div className="w-full flex flex-col gap-[16px]">
        <h3 className="text-[16px] font-bold text-[#04330B] font-['Familjen_Grotesk']">{t.dashboard.recruitedMembers}</h3>
        <div className="w-full h-[188px] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[52px] gap-y-[28px]">
          {recruits.map((recruit) => (
            <div key={recruit.id} className="flex items-center gap-[12px] w-[172px] h-[44px]">
              {recruit.photoUrl ? (
                <img
                  src={recruit.photoUrl.startsWith('http') ? recruit.photoUrl : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '')}${recruit.photoUrl}`}
                  alt={recruit.name}
                  className="w-[44px] h-[44px] rounded-[8px] object-cover bg-gray-100 shrink-0"
                />
              ) : (
                <div className="w-[44px] h-[44px] rounded-[8px] flex items-center justify-center bg-gray-200 text-gray-600 shrink-0">
                  <User size={20} />
                </div>
              )}
              <div className="flex flex-col w-[116px] h-[44px]">
                <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] truncate block h-[22px]">{recruit.name}</span>
                <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] block h-[22px]">{t.dashboard.roles.member}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Layout Content ---
const DashboardContent = () => {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<DashboardUserSummary | null>(null);
  const [progress, setProgress] = useState<DashboardRecruitProgress | null>(null);
  const [recruits, setRecruits] = useState<DashboardRecruitsListItem[]>([]);
  const [committee, setCommittee] = useState<{ id: number; name: string } | null>(null);
  const [cwcMembers, setCwcMembers] = useState<CwcTeamMember[]>([]);
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
    if (!localUnitId) return [];
    return (recruits || []).filter((r) => Number((r as any).localUnitId) === Number(localUnitId));
  }, [recruits, localUnitId]);

  const canDownloadAppointment = isLeader;

  const refreshSummary = async () => {
    try {
      const summaryRes = await fetchApi('users/me/summary');
      setSummary(summaryRes as DashboardUserSummary);
    } catch (e) {
      console.error(e);
    }
  };

  const dashboardLinks = [
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
            setRecruits(parsed.recruits || []);
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
        const [summaryRes, progressRes, recruitsRes] = await Promise.all([
          fetchApi('users/me/summary'),
          fetchApi('users/me/recruitment-progress'),
          fetchApi('users/me/recruits')
        ]);

        if (cancelled) return;

        const newRecruits = recruitsRes?.recruits || [];

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
                  setCwcMembers(Array.isArray(data.members) ? data.members : []);
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
  }, []);

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
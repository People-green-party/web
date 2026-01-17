"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
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
import { LanguageProvider, useLanguage } from '../../components/LanguageContext';
import { fetchApi } from '../../lib/api';
import { RequireAuth } from '../components/RequireAuth';

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
  };
  recruitsCount: number;
  votesCast: number;
}

interface DashboardRecruitProgress {
  role: string | null;
  total: number;
  target: number;
  remaining: number;
}

interface DashboardRecruitsListItem {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  photoUrl: string | null;
}

// --- Components ---
import ImageCropperModal from '../../components/ImageCropperModal';

interface MemberIdCardProps {
  summary: DashboardUserSummary | null;
  loading: boolean;
  onPhotoUpdate: () => void;
}

const MemberIdCard = ({ summary, loading, onPhotoUpdate }: MemberIdCardProps) => {
  const { t, language } = useLanguage();
  const currentLang = language as 'en' | 'hi'; // ensuring type safety
  const [uploading, setUploading] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear input so same file can be selected again
    event.target.value = '';

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImageSrc(reader.result?.toString() || null);
    });
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true);
    setSelectedImageSrc(null); // Close modal

    try {
      const { getAuthHeader } = await import('../../lib/supabaseClient');
      const authHeader = await getAuthHeader();
      const formData = new FormData();
      formData.append('file', croppedBlob, 'profile.jpg');

      // Ensure we are hitting the correct endpoint. 
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'; // Fallback to localhost:3002 for direct usage if env missing

      const response = await fetch(`${baseUrl}/users/me/photo`, {
        method: 'POST',
        headers: {
          ...authHeader,
          // Do NOT set Content-Type here; user browser sets it to multipart/form-data with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Upload failed: ${txt}`);
      }

      onPhotoUpdate();
    } catch (error) {
      console.error('Photo upload failed:', error);
      alert('Failed to update profile photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent file input from opening
    // Confirm dialog removed as requested
    // if (!confirm('Are you sure you want to remove your profile photo?')) return;

    setUploading(true);
    try {
      const { getAuthHeader } = await import('../../lib/supabaseClient');
      const authHeader = await getAuthHeader();

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${baseUrl}/users/me/photo`, {
        method: 'DELETE',
        headers: {
          ...authHeader,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove photo');
      }

      onPhotoUpdate();
    } catch (error) {
      console.error('Photo removal failed:', error);
      alert('Failed to remove profile photo');
    } finally {
      setUploading(false);
    }
  };

  const displayName = summary?.user?.name || (currentLang === 'hi' ? t.dashboard.placeholderNameHi : t.dashboard.placeholderNameEn);
  const membershipId = summary?.user?.memberId || t.dashboard.placeholderMemberId;
  const role = summary?.user?.role || 'Member';

  // Logic to determine ward text: Use legacy 'ward' relation if available, otherwise check 'localUnit' relation
  const effectiveWard = summary?.user?.ward
    ? summary.user.ward
    : (summary?.user?.localUnit?.type === 'Ward' ? { wardNumber: summary.user.localUnit.name.replace(/\D/g, '') || '?', gp: { name: summary.user.localUnit.vidhansabha?.name || 'Unknown' } } : null);

  const wardText = effectiveWard
    ? `${t.dashboard.wardLabel} ${effectiveWard.wardNumber || ''} – ${effectiveWard.gp?.name || ''}`
    : t.dashboard.placeholderWard;

  const roleLabel = role === 'Worker' ? t.dashboard.roles.worker : t.dashboard.roles.member;

  return (
    <div className="w-full lg:w-[388px] h-auto lg:h-[419px] bg-white rounded-[8px] p-[24px] pt-[20px] flex flex-col gap-[16px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A]">
      <h2 className="text-[20px] font-bold text-[#04330B] font-['Familjen_Grotesk'] leading-[26px]">
        {t.dashboard.memberCardTitle}
      </h2>

      {/* Photo */}
      <div className="w-full h-[200px] overflow-hidden rounded-[8px] bg-gray-100 relative group flex items-center justify-center">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : summary?.user?.photoUrl ? (
          <img
            src={summary.user.photoUrl.startsWith('http') ? summary.user.photoUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}${summary.user.photoUrl}`}
            alt={displayName}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
            <User size={64} strokeWidth={1} />
            <span className="text-sm font-medium">Add Photo</span>
          </div>
        )}

        {/* Edit Overlay - Visible on Hover (Desktop) */}
        <div className="absolute inset-0 bg-black/40 flex flex-row items-center justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 transition-all duration-300">
          {/* Upload Input Label */}
          <label className="cursor-pointer flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform group/edit">
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading ? (
              <span className="text-sm font-semibold">Processing...</span>
            ) : (
              <>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover/edit:bg-[#65A27F] transition-colors border border-white/20 shadow-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <span className="text-xs font-medium tracking-wide drop-shadow-md">Change</span>
              </>
            )}
          </label>

          {/* Remove Button (only if photo exists) */}
          {summary?.user?.photoUrl && !uploading && (
            <button
              onClick={handleRemovePhoto}
              className="flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform group/remove"
              title="Remove Photo"
            >
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover/remove:bg-red-500/60 transition-colors border border-white/20 shadow-lg">
                <Trash2 size={24} color="white" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium tracking-wide drop-shadow-md">Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile-only Edit Buttons (Visible below image on small screens) */}
      <div className="flex lg:hidden w-full justify-center gap-4 mt-[-8px]">
        <label className="cursor-pointer flex items-center gap-2 text-[#0D5229] bg-[#EAF7EE] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#d4eadd] transition-colors">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <span>{summary?.user?.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
        </label>

        {summary?.user?.photoUrl && !uploading && (
          <button
            onClick={handleRemovePhoto}
            className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Details Grid */}
      <div className="flex flex-col gap-[12px] text-[14px]">
        <div className="flex justify-between items-center h-[22px]">
          <span className="text-[#587E67] font-semibold font-['Familjen_Grotesk']">{t.dashboard.name}</span>
          {loading ? <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" /> : <span className="text-[#04330B] font-bold font-['Familjen_Grotesk'] text-right">{displayName}</span>}
        </div>
        <div className="flex justify-between items-center h-[22px]">
          <span className="text-[#587E67] font-semibold font-['Familjen_Grotesk']">{t.dashboard.membershipId}</span>
          {loading ? <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" /> : <span className="text-[#04330B] font-bold font-['Familjen_Grotesk'] text-right">{membershipId}</span>}
        </div>
        <div className="flex justify-between items-center h-[22px]">
          <span className="text-[#587E67] font-semibold font-['Familjen_Grotesk']">{t.dashboard.role}</span>
          {loading ? <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" /> : <span className="text-[#04330B] font-bold font-['Familjen_Grotesk'] text-right">{roleLabel}</span>}
        </div>
        <div className="flex justify-between items-start h-auto">
          <span className="text-[#587E67] font-semibold font-['Familjen_Grotesk'] shrink-0">{t.dashboard.ward}</span>
          {loading ? <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" /> : <span className="text-[#04330B] font-bold font-['Familjen_Grotesk'] text-right break-words max-w-[200px]">{wardText}</span>}
        </div>
      </div>


      {/* Cropper Modal */}
      {
        selectedImageSrc && (
          <ImageCropperModal
            imageSrc={selectedImageSrc!}
            onCancel={() => setSelectedImageSrc(null)}
            onCropComplete={handleCropComplete}
          />
        )
      }
    </div >
  );
};

interface RecruitsPanelProps {
  summary: DashboardUserSummary | null;
  progress: DashboardRecruitProgress | null;
  recruits: DashboardRecruitsListItem[];
  loading: boolean;
}

const RecruitsPanel = ({ summary, progress, recruits, loading }: RecruitsPanelProps) => {
  const { t, language } = useLanguage();
  const currentLang = language as 'en' | 'hi';

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
    const shareUrl = `${window.location.origin}/join?ref=${referralCode}`;
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
  const qrData = typeof window !== 'undefined' ? `${window.location.origin}/join?ref=${referralCode}` : `https://peoplesgreenparty.org/join?ref=${referralCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=118x118&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="w-full lg:w-[892px] h-auto lg:h-[420px] bg-white rounded-[8px] p-[24px] pt-[20px] pb-[20px] flex flex-col gap-[20px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A]">
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
                  src={recruit.photoUrl.startsWith('http') ? recruit.photoUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}${recruit.photoUrl}`}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      } catch (err: any) {
        if (cancelled) return;
        console.error('Failed to load dashboard data, falling back to mock data:', err);

        // --- MOCK FALLBACK ---
        setSummary({
          user: {
            id: 0,
            name: 'Demo User',
            phone: '+919876543210',
            role: 'Member',
            referralCode: 'DEMO123',
            memberId: 'PGP-DEMO',
            photoUrl: null,
            ward: { id: 1, wardNumber: 1, gp: { id: 1, name: 'Demo GP' } },
            localUnit: {
              id: 1,
              name: 'Demo Unit',
              type: 'Ward',
              vidhansabha: { id: 1, name: 'Demo Vidhansabha', loksabha: { id: 1, name: 'Demo Loksabha' } }
            }
          },
          recruitsCount: 0,
          votesCast: 0
        });
        setProgress({
          role: 'Member',
          total: 0,
          target: 21,
          remaining: 21
        });
        setRecruits([]);
        setError('Dashboard is running in offline mode. (Backend unavailable)');
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

      <main className="w-full max-w-[1320px] mx-auto flex flex-col items-center">
        {/* Main Content Container - 1320x420, Gap 40px */}
        {error && (
          <div className="w-full max-w-[1320px] px-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-md text-sm font-['Familjen_Grotesk']">
            {error}
          </div>
        )}

        <div className="w-full flex flex-col lg:flex-row gap-[40px] justify-center px-4 lg:px-0">

          {/* Left Column: Member Card (388px) */}
          <MemberIdCard
            summary={summary}
            loading={loading}
            onPhotoUpdate={() => {
              // Refresh data
              const loadDashboardData = async () => {
                try {
                  const summaryRes = await fetchApi('users/me/summary');
                  setSummary(summaryRes as DashboardUserSummary);
                } catch (e) { console.error(e); }
              };
              loadDashboardData();
            }}
          />

          {/* Right Column: Recruits Panel (892px) */}
          <RecruitsPanel summary={summary} progress={progress} recruits={recruits} loading={loading} />

        </div>

        {/* Removed the empty spacer div as requested */}
      </main>

      <Footer />
    </div>
  );
};

export default function Dashboard() {
  return (
    <RequireAuth>
      <LanguageProvider>
        <DashboardContent />
      </LanguageProvider>
    </RequireAuth>
  );
}
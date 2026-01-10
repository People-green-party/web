"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import {
  Copy,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  X, // Twitter icon
  User,
  Menu
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
      {/* Photo */}
      <div className="w-full h-[200px] overflow-hidden rounded-[8px] bg-gray-100 relative group flex items-center justify-center">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : summary?.user?.photoUrl ? (
          <img
            src={summary.user.photoUrl}
            alt={displayName}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
            <User size={64} strokeWidth={1} />
            <span className="text-sm font-medium">Add Photo</span>
          </div>
        )}
        {/* Edit Overlay */}
        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <span className="text-white font-semibold">Updating...</span>
          ) : (
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
          )}
        </label>
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
      if (code) navigator.clipboard.writeText(code);
    }
  };

  const referralCode = summary?.user?.referralCode || t.dashboard.placeholderReferralCode;
  const total = progress?.total ?? 0;
  const target = progress?.target ?? 0;
  const percentage = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0;
  const progressLabel = target > 0 ? `${total}/${target}` : `${total}`;

  return (
    <div className="w-full lg:w-[892px] h-auto lg:h-[420px] bg-white rounded-[8px] p-[24px] pt-[20px] pb-[20px] flex flex-col gap-[20px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A]">
      {/* Top Section: Header & QR */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-3/4 flex flex-col gap-[12px]">
          <h2 className="text-[24px] font-bold text-[#04330B] font-['Familjen_Grotesk'] leading-[30px]">{t.dashboard.recruitsTitle}</h2>

          <div className="flex items-center gap-2 h-[22px]">
            <span className="text-[#587E67] font-semibold font-['Familjen_Grotesk'] text-[16px]">{t.dashboard.referralCode}</span>
            <span className="text-[#04330B] font-bold font-['Familjen_Grotesk'] text-[16px]">{referralCode}</span>
            <button
              onClick={handleCopy}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              title={t.dashboard.copy}
            >
              <img src="/CopiedIcon.svg" alt="Copy" className="w-[18px] h-[18px]" />
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

        {/* QR Code Placeholder */}
        <div className="mt-4 md:mt-0 flex-shrink-0 w-[134px] h-[134px] p-[8px] opacity-80 border border-dashed border-[#0D5229]">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=118x118&data=Example"
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
                  src={recruit.photoUrl}
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
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, progressRes] = await Promise.all([
          fetchApi('users/me/summary'),
          fetchApi('users/me/recruitment-progress'),
        ]);

        if (cancelled) return;

        setSummary(summaryRes as DashboardUserSummary);
        setProgress(progressRes as DashboardRecruitProgress);

        // Load recruits list using the current user's id
        const userId = (summaryRes as DashboardUserSummary)?.user?.id;
        if (userId) {
          const recruitsData = await fetchApi(`users/${userId}/recruits`);
          if (!cancelled && recruitsData?.recruits) {
            setRecruits(recruitsData.recruits as DashboardRecruitsListItem[]);
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
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
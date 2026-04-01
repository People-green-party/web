"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from "next/link";
import {
    User,
    Mail,
    Trash2,
    Camera,
    Share2,
    Copy,
    Download
} from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { fetchApi, getApiBaseUrl } from '../../lib/api';
import { RequireAuth } from '../components/RequireAuth';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
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
        isLeader?: boolean;
        unionName?: string | null;
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
    isLeader?: boolean;
}

interface DashboardRecruitsListItem {
    id: number;
    name: string;
    phone: string;
    createdAt: string;
    photoUrl: string | null;
    localUnitId?: number | null;
    memberId?: string | null;
    cwcName?: string | null;
    localUnit?: {
        vidhansabha?: {
            loksabha?: {
                name?: string;
            }
        }
    } | null;
}

// --- Helper Functions ---
async function downloadAsPng(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
    if (!ref.current) return;
    try {
        const element = ref.current;

        // Ensure all fonts and images are fully loaded before capturing
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 300));

        // Patch CSSStyleSheet to prevent SecurityError from html-to-image
        // The library attempts to read cross-origin stylesheets (like external icons) and crashes.
        const originalCssRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules');
        if (originalCssRules) {
            Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
                get() {
                    try {
                        return originalCssRules.get?.call(this) || [];
                    } catch (e) {
                        return []; // Ignore CORS security errors!
                    }
                },
                configurable: true
            });
        }

        const dataUrl = await toPng(element, {
            pixelRatio: 3, // Premium quality
            // Ensure any hidden elements (like appointment letter) become visible during clone
            style: { opacity: '1', visibility: 'visible', pointerEvents: 'auto' },
            // Use native browser canvas renderer, no CSS parsing crashes!
        });

        // Restore original after capture
        if (originalCssRules) {
            Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', originalCssRules);
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    } catch (error: any) {
        console.error("Capture Error:", error);
        alert("Download failed. Please try again or take a screenshot.");
    }
}

async function downloadAsPdf(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
    if (!ref.current) return;
    try {
        const element = ref.current;
        await document.fonts.ready;

        // Patch CSSStyleSheet to prevent SecurityError from html-to-image
        const originalCssRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules');
        if (originalCssRules) {
            Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
                get() {
                    try {
                        return originalCssRules.get?.call(this) || [];
                    } catch (e) {
                        return [];
                    }
                },
                configurable: true
            });
        }

        const dataUrl = await toPng(element, {
            pixelRatio: 2,
            style: { opacity: '1', visibility: 'visible', pointerEvents: 'auto' }
        });

        if (originalCssRules) {
            Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', originalCssRules);
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    } catch (error) {
        console.error("Failed to download PDF:", error);
        alert("Could not download PDF.");
    }
}

function getDesignation(role: string | null, cwcName: string | null, t: any) {
    const r = role || 'Member';
    const rawName = cwcName || '';
    let cwcLabel = '';
    if (rawName) {
        const parts = rawName.trim().split(/\s+/);
        const last = parts[parts.length - 1];
        const num = Number.parseInt(last, 10);
        cwcLabel = !Number.isNaN(num) ? `${t.dashboard.cwc} ${num}` : t.dashboard.cwc;
    }
    let base = t.dashboard.roles.member;
    if (r === 'CWCPresident') base = cwcLabel ? `${cwcLabel} ${t.committee.roles.president}` : t.dashboard.cwcPresident;
    else if (r === 'CWCMember') base = cwcLabel ? `${cwcLabel} ${t.dashboard.roles.member}` : `${t.dashboard.cwc} ${t.dashboard.roles.member}`;
    else if (r === 'ExtendedMember') base = cwcLabel ? `${cwcLabel} Extended ${t.dashboard.roles.member}` : `Extended ${t.dashboard.roles.member}`;

    if (r === 'CWCPresident') return `${base} – ${t.dashboard.verifiedEliteMember}`;
    return base;
}

// --- Components ---

// Union ID Card Component (Green theme)
const UnionIdCard = ({ summary, loading }: { summary: DashboardUserSummary | null, loading: boolean }) => {
    const { t } = useLanguage();
    const user = summary?.user;
    const idCardRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="rounded-[2.5rem] p-8 flex flex-col items-center justify-between h-full bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#22C55E]/20 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)] min-h-[420px]">
            <div className="w-full self-start">
                <h3 className="text-xl font-bold text-[#04330B] mb-2">संघ सदस्य कार्ड</h3>
                <div className="min-h-[40px] mb-6 invisible lg:block text-sm leading-relaxed">Space aligner</div>
            </div>

            {/* Union ID Card Display */}
            <div
                ref={idCardRef}
                data-download-root
                className="w-full max-w-[400px] aspect-[1.6/1] rounded-[24px] p-6 relative overflow-hidden shadow-2xl mb-6 flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #04330B 0%, #0B5A2A 100%)', color: '#ffffff' }}
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8"></div>

                <div className="flex justify-between items-start relative z-10 mb-auto">
                    <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                        <span className="text-[#04330B] font-bold text-xs">संघ</span>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30">
                        {user?.photoUrl ? (
                            <img
                                src={user.photoUrl.startsWith('http') ? user.photoUrl : `${getApiBaseUrl().replace(/\/v1\/?$/, '')}${user.photoUrl}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <span className="material-symbols-outlined text-white text-3xl">person</span>
                        )}
                    </div>
                </div>

                <div className="relative z-10 ml-2 mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1 leading-none">{loading ? '...' : (user?.name || 'नाम')}</h2>
                    <p className="text-white/80 font-bold text-sm mb-0.5">{loading ? '...' : (user?.unionName || 'संघ सदस्य')}</p>
                </div>

                <div className="relative z-10 ml-2 mt-auto">
                    <p className="text-white/90 font-mono font-bold tracking-[0.2em] text-sm">{loading ? '...' : (user?.memberId || 'U-000000')}</p>
                </div>

                <div className="absolute bottom-6 right-8 w-10 h-10 bg-white/10 rounded-lg"></div>
            </div>

            <div className="flex w-full">
                <button
                    onClick={() => downloadAsPng(idCardRef, `Union-ID-${(user?.name || 'Member').replace(/\s+/g, '-')}.png`)}
                    className="w-full py-4 bg-gradient-to-r from-[#04330B] to-[#0B5A2A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all overflow-hidden"
                >
                    <span className="material-symbols-outlined shrink-0">download</span>
                    <span className="truncate">कार्ड डाउनलोड करें</span>
                </button>
            </div>
        </div>
    );
};

const NewMemberIdCard = ({ summary, loading, onPhotoUpdated }: { summary: DashboardUserSummary | null, loading: boolean, onPhotoUpdated: () => void }) => {
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
            const baseUrl = getApiBaseUrl();
            const response = await fetch(`${baseUrl}/users/me/photo`, {
                method: 'POST',
                headers: { ...authHeader },
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            onPhotoUpdated();
        } catch (e) {
            alert('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const designation = useMemo(() => getDesignation(user?.role || null, user?.cwcName || null, t), [user?.role, user?.cwcName, t]);

    const placeLine = useMemo(() => {
        const lok = user?.localUnit?.vidhansabha?.loksabha?.name;
        const vid = user?.localUnit?.vidhansabha?.name;
        const lu = user?.localUnit ? `${user.localUnit.name}${user.localUnit.type ? ` (${user.localUnit.type})` : ''}` : '';
        return [lok, vid, lu].filter(Boolean).join(', ');
    }, [user?.localUnit]);

    return (
        <div className="rounded-[2.5rem] p-8 subtle-pattern flex flex-col items-center justify-between h-full bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)] min-h-[420px]">
            <div className="w-full self-start">
                <h3 className="text-xl font-bold text-[#04330B] mb-2 min-h-[28px]">{t.dashboard.memberCardTitle}</h3>
                <div className="min-h-[40px] mb-6 invisible lg:block text-sm leading-relaxed">Space aligner</div>
            </div>

            {/* ID Card Display */}
            <div
                ref={idCardRef}
                data-download-root
                className="w-full max-w-[400px] aspect-[1.6/1] rounded-[24px] p-6 relative overflow-hidden shadow-2xl mb-6 flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #04330B 0%, #0B5A2A 100%)', color: '#ffffff' }}
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8"></div>

                <div className="flex justify-between items-start relative z-10 mb-auto">
                    <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                        <img src="/PGPlogo.svg" alt="PGP" className="h-7" />
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30">
                        {user?.photoUrl ? (
                            <img
                                src={user.photoUrl.startsWith('http') ? user.photoUrl : `${getApiBaseUrl().replace(/\/v1\/?$/, '')}${user.photoUrl}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <span className="material-symbols-outlined text-white text-3xl">person</span>
                        )}
                    </div>
                </div>

                <div className="relative z-10 ml-2 mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1 leading-none">{loading ? '...' : (user?.name || 'NAME')}</h2>
                    <p className="text-white/80 font-bold text-sm mb-0.5">{loading ? '...' : designation}</p>
                    <p className="text-white/60 font-semibold text-[11px] leading-tight max-w-[80%] break-words line-clamp-2">{loading ? '...' : placeLine}</p>
                </div>

                <div className="relative z-10 ml-2 mt-auto">
                    <p className="text-white/90 font-mono font-bold tracking-[0.2em] text-sm">{loading ? '...' : (user?.memberId || 'PGP-000000')}</p>
                </div>

                <div className="absolute bottom-6 right-8 w-10 h-10 bg-white/10 rounded-lg"></div>
            </div>

            <div className="flex w-full">

                <button
                    onClick={() => downloadAsPng(idCardRef, `PGP-ID-${(user?.name || 'Member').replace(/\s+/g, '-')}.png`)}
                    className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all overflow-hidden"
                >
                    <span className="material-symbols-outlined shrink-0">download</span>
                    <span className="truncate">{t.dashboard.downloadCard}</span>
                </button>
            </div>
        </div>
    );
};



// --- Main Page ---

export default function DemoDashboard() {
    const { language, t } = useLanguage();
    const [summary, setSummary] = useState<DashboardUserSummary | null>(null);
    const [progress, setProgress] = useState<DashboardRecruitProgress | null>(null);
    const [recruits, setRecruits] = useState<DashboardRecruitsListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isBecomingLeader, setIsBecomingLeader] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const appointmentRef = useRef<HTMLDivElement>(null);

    const handleBecomeLeader = async () => {
        setIsBecomingLeader(true);
        try {
            const auth = await getAuthHeader();
            await fetch(`${getApiBaseUrl()}/users/me`, {
                method: 'PATCH',
                headers: { ...auth, 'Content-Type': 'application/json' },
                body: JSON.stringify({ isLeader: true })
            });
            await refreshSummary();
        } catch (e) {
            console.error(e);
        } finally {
            setIsBecomingLeader(false);
        }
    };

    // Always use production URL for sharing/QR so links work when scanned from any device
    const PRODUCTION_ORIGIN = 'https://peoplesgreen.org';
    const localUnitId = summary?.user?.localUnit?.id ?? null;
    const localUnitRecruits = useMemo(() => {
        if (!localUnitId) return [];
        return (recruits || []).filter((r) => Number(r.localUnitId) === Number(localUnitId));
    }, [recruits, localUnitId]);

    const referralCode = summary?.user?.referralCode || '';
    const referralLink = referralCode ? `${PRODUCTION_ORIGIN}/join/?ref=${referralCode}` : '';
    const progressValue = Math.min(localUnitRecruits.length * 20, 100);
    const isUnlocked = progressValue >= 100;

    const currentDesignation = useMemo(() => getDesignation(summary?.user?.role || null, summary?.user?.cwcName || null, t), [summary?.user?.role, summary?.user?.cwcName, t]);

    useEffect(() => {
        const load = async () => {
            try {
                const [sum, prog, rec] = await Promise.all([
                    fetchApi('users/me/summary'),
                    fetchApi('users/me/recruitment-progress'),
                    fetchApi('users/me/recruits')
                ]);
                setSummary(sum as DashboardUserSummary);
                setProgress(prog as DashboardRecruitProgress);
                setRecruits(rec?.recruits || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const refreshSummary = async () => {
        const sum = await fetchApi('users/me/summary');
        setSummary(sum as DashboardUserSummary);
    };

    const handleShareWA = () => {
        const text = `Join the Peoples Green Party movement! Use my referral link: ${referralLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleNativeShare = async () => {
        const text = `Join the Peoples Green Party movement! Use my referral link: ${referralLink}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Peoples Green Party',
                    text: text,
                    url: referralLink
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const dashboardLinks = [
        { name: t.nav.dashboard, href: '/dashboard' },
        { name: t.nav.election, href: '/election' }
    ];

    // Check if user is a union worker
    const isUnionWorker = !!summary?.user?.unionName;

    return (
        <RequireAuth>
            <div className={`min-h-screen ${isUnionWorker ? 'bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]' : 'bg-white'} text-slate-900 overflow-x-hidden pt-[104px]`} style={{ fontFamily: "'Manrope', sans-serif" }}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

                <style jsx global>{`
          .glass-sidebar { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(4, 51, 11, 0.1); }
          .glass-card { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(4, 51, 11, 0.1); }
          .subtle-pattern { background-image: radial-gradient(circle at 2px 2px, rgba(4, 51, 11, 0.05) 1px, transparent 0); background-size: 24px 24px; }
          .shadow-premium { box-shadow: 0 10px 30px rgba(4, 51, 11, 0.05); }
        `}</style>

                <Navbar links={dashboardLinks} showAuthButtons={false} showProfileButton={true} isDashboard={true} />

                {/* Main */}
                <main className="w-full max-w-[1440px] mx-auto flex flex-col px-4 lg:px-8 mt-6">
                    {/* Hero Profile Section */}
                    <section className="bg-gradient-to-br from-[#B9D3C4] via-[#EAF1EE] to-white p-8 rounded-[2.5rem] mb-8 border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)] relative overflow-hidden flex items-center min-h-[280px]">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#04330B]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

                        <div className="flex flex-col lg:flex-row gap-10 items-center w-full relative z-10 px-4">
                            <div className="relative shrink-0">
                                <div className="w-40 h-40 rounded-full border-[6px] border-white p-1.5 bg-white shadow-xl flex items-center justify-center overflow-hidden">
                                    {summary?.user?.photoUrl ? (
                                        <img className="w-full h-full object-cover rounded-full" src={summary.user.photoUrl.startsWith('http') ? summary.user.photoUrl : `${getApiBaseUrl().replace(/\/v1\/?$/, '')}${summary.user.photoUrl}`} />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center"><User size={48} className="text-slate-200" /></div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-3 right-3 bg-white hover:bg-slate-50 rounded-full p-3 shadow-xl flex items-center justify-center border-2 border-[#04330B] transition-all scale-110"
                                >
                                    <span className="material-symbols-outlined text-[#04330B] font-bold text-2xl">photo_camera</span>
                                </button>
                                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    try {
                                        const auth = await getAuthHeader();
                                        const res = await fetch(`${getApiBaseUrl()}/users/me/photo`, {
                                            method: 'POST',
                                            headers: { ...auth },
                                            body: formData
                                        });
                                        if (res.ok) {
                                            refreshSummary();
                                        } else {
                                            const err = await res.json().catch(() => ({}));
                                            alert(`Failed to upload photo: ${err.message || 'Server error'}`);
                                        }
                                    } catch (err: any) {
                                        alert(`Upload failed: ${err.message}`);
                                    } finally {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }
                                }} />
                            </div>

                            <div className="flex-1 lg:ml-4 min-w-0">
                                <div className="mb-8">
                                    <h1 className="text-4xl font-black text-[#04330B] tracking-tight mb-2 truncate">{summary?.user?.name || '...'}</h1>
                                    <p className="text-[#04330B]/80 text-lg font-medium truncate">
                                        {currentDesignation}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                                    <div className="flex flex-col min-w-0"><span className="text-sm font-bold text-[#04330B] truncate">{t.dashboard.membershipIdLabel}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1 truncate">{summary?.user?.memberId || 'PGP-......'}</span></div>
                                    <div className="flex flex-col min-w-0"><span className="text-sm font-bold text-[#04330B] truncate">{t.dashboard.mobileNumberLabel}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1 truncate">{summary?.user?.phone || '...'}</span></div>
                                    <div className="flex flex-col min-w-0"><span className="text-sm font-bold text-[#04330B] truncate">{t.dashboard.loksabha}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1 truncate">{summary?.user?.localUnit?.vidhansabha?.loksabha?.name || '-'}</span></div>
                                    <div className="flex flex-col min-w-0"><span className="text-sm font-bold text-[#04330B] truncate">{t.dashboard.cwc}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1 truncate">{summary?.user?.cwcName?.replace(/^CWC\s+/i, '') || '-'}</span></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cards Grid */}
                    {isUnionWorker ? (
                        // UNION WORKER DASHBOARD
                        <div className="lg:col-span-3">
                            <div className="rounded-[2.5rem] p-8 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#22C55E]/20 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)] mb-8">
                                <h2 className="text-2xl font-black text-[#04330B] mb-2">{summary?.user?.unionName} में आपका स्वागत है</h2>
                                <p className="text-[#04330B]/70 font-medium">आप संघ के एक महत्वपूर्ण सदस्य हैं। एक साथ खड़े रहें, अपने अधिकारों के लिए लड़ें!</p>
                            </div>
                            <div className="max-w-[500px] mx-auto">
                                {/* Union ID Card */}
                                <UnionIdCard summary={summary} loading={loading} />
                            </div>
                        </div>
                    ) : (
                        // POLITICAL DASHBOARD (existing logic)
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {!summary?.user?.isLeader ? (
                            <div className="lg:col-span-2 rounded-[2.5rem] p-8 subtle-pattern flex flex-col items-center justify-center text-center bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)] min-h-[420px]">
                                <div className="w-24 h-24 mb-6 rounded-[2rem] bg-gradient-to-br from-[#04330B] to-[#0B5A2A] flex items-center justify-center shadow-[0_10px_30px_rgba(4,51,11,0.2)]">
                                    <span className="material-symbols-outlined text-[56px] text-white/90">emoji_events</span>
                                </div>
                                <h3 className="text-3xl font-black text-[#04330B] mb-3 tracking-tight px-4">{t.dashboard?.becomeLeaderTitle || 'Do you want to become a Leader of your area?'}</h3>
                                <p className="text-[#04330B]/70 font-medium text-base mb-8 max-w-[400px] mx-auto leading-relaxed">{t.dashboard?.becomeLeaderSubtitle || 'Recruit 5 people from your Local Unit to unlock your appointment letter and become CWC President.'}</p>
                                <button
                                    disabled={isBecomingLeader || !summary}
                                    onClick={handleBecomeLeader}
                                    className="py-5 px-10 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_-10px_rgba(4,51,11,0.5)] text-lg sm:text-xl w-full max-w-sm disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isBecomingLeader ? 'Updating...' : (t.dashboard?.becomeLeaderBtn || 'Yes, Become a Leader')}
                                    {!isBecomingLeader && <span className="material-symbols-outlined text-3xl shrink-0 font-bold">arrow_forward</span>}
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Referral Program */}
                                <div className="rounded-[2.5rem] p-8 subtle-pattern flex flex-col bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)] min-h-[420px]">
                                    <h3 className="text-xl font-bold text-[#04330B] mb-2 min-h-[28px]">{t.dashboard.inviteTitle}</h3>
                                    <p className="text-[#04330B]/60 text-sm leading-relaxed mb-6 min-h-[40px] line-clamp-2">{t.dashboard.inviteSubtitle}</p>

                                    <div className="flex items-center justify-between gap-4 bg-white/50 p-5 rounded-xl border border-[#04330B]/10 mb-4 h-[152px]">
                                        <div>
                                            <p className="text-[#04330B]/50 font-bold text-[10px] uppercase mb-1">{t.dashboard.referralLabel}</p>
                                            <p className="text-2xl font-black text-[#04330B] tracking-widest">{(referralCode || '--------').toString().toUpperCase()}</p>
                                        </div>
                                        <div className="w-28 h-28 bg-white rounded-xl p-2 border border-[#04330B]/5 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                            {referralLink ? (
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(referralLink)}`}
                                                    alt="QR Code"
                                                    className="w-full h-full"
                                                />
                                            ) : (
                                                <div className="text-[8px] font-bold text-[#04330B]/20">QR</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-5">
                                        <div className="grid grid-cols-2 gap-3 -mt-3">
                                            <button onClick={handleShareWA} className="col-span-1 py-3 bg-[#04330B]/5 text-[#04330B] rounded-2xl font-bold border border-[#04330B]/10 flex items-center justify-center text-xs gap-2 hover:bg-[#04330B]/10 transition-all">
                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.652.83 5.126 2.27 7.202L.613 24l5.067-1.583A11.964 11.964 0 0 0 12.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22A9.97 9.97 0 0 1 7.152 20.72l-.35-.208-3.078.96 1.052-3.14-.236-.376a9.971 9.971 0 0 1-1.638-5.719A9.914 9.914 0 0 1 12.031 2.094a9.914 9.914 0 0 1 9.91 9.937A9.914 9.914 0 0 1 12.031 22zm5.424-7.443c-.297-.15-1.761-.871-2.034-.972-.273-.101-.473-.15-.673.15-.201.3-.77 .972-.942 1.171-.174.2-.348.225-.646.075-.298-.15-1.258-.464-2.395-1.48-.885-.791-1.482-1.767-1.656-2.067-.174-.3-.018-.463.13-.611.134-.135.297-.346.447-.519.149-.174.199-.297.298-.496.099-.199.05-.373-.025-.523-.075-.15-.673-1.62-.921-2.215-.24-.582-.486-.503-.673-.513-.175-.008-.374-.008-.573-.008s-.523.075-.797.373c-.274.298-1.046 1.021-1.046 2.489s1.07 2.887 1.22 3.087c.15.2 2.106 3.21 5.099 4.5.712.308 1.268.492 1.7.63.714.227 1.365.195 1.879.118.575-.086 1.761-.72 2.01-1.416.248-.696.248-1.293.174-1.416-.075-.123-.274-.198-.572-.348z" />
                                                </svg>
                                                WhatsApp
                                            </button>
                                            <button onClick={handleCopyLink} className="col-span-1 py-3 bg-[#04330B]/5 text-[#04330B] rounded-2xl font-bold border border-[#04330B]/10 flex items-center justify-center text-xs gap-2 hover:bg-[#04330B]/10 transition-all">
                                                <span className="material-symbols-outlined text-[16px]">{copied ? 'check_circle' : 'content_copy'}</span>
                                                {copied ? (language === 'en' ? 'Copied' : 'कॉपी हो गया') : t.dashboard.copy}
                                            </button>
                                        </div>
                                        <button onClick={handleNativeShare} className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all overflow-hidden">
                                            <span className="material-symbols-outlined shrink-0">share</span>
                                            <span className="truncate">{t.dashboard.inviteTitle}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Leadership Progress */}
                                <div className="rounded-[2.5rem] p-8 subtle-pattern flex flex-col bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)] min-h-[420px]">
                                    <h3 className="text-xl font-bold text-[#04330B] mb-2 min-h-[28px]">{t.dashboard.appointmentTitle}</h3>
                                    <p className="text-[#04330B]/60 text-sm leading-relaxed mb-6 min-h-[40px] line-clamp-2">{t.dashboard.appointmentLocked}</p>

                                    <div className="flex items-center justify-between gap-4 bg-white/50 p-5 rounded-xl border border-[#04330B]/10 mb-4 h-[152px]">
                                        <div>
                                            <p className="text-[#04330B]/50 font-bold text-[10px] uppercase mb-1">{t.dashboard.status}</p>
                                            {isUnlocked ? (
                                                <p className="text-base font-black text-[#04330B]/60 leading-tight">{t.dashboard.congratulations}<br />{t.dashboard.appointmentLetterUnlocked}</p>
                                            ) : (
                                                <p className="text-xl font-black text-[#04330B]">{t.dashboard.appointmentTitle}</p>
                                            )}
                                        </div>
                                        <div className={`w-28 h-28 rounded-2xl p-2 border shadow-sm flex items-center justify-center shrink-0 bg-white border-[#04330B]/5`}>
                                            <span className={`material-symbols-outlined text-5xl ${isUnlocked ? 'text-[#04330B]/60' : 'text-[#04330B]/30'}`}>{isUnlocked ? 'workspace_premium' : 'lock'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex justify-between text-xs font-bold text-[#04330B] mb-3">
                                            <span>{localUnitRecruits.length}/5 {t.dashboard.recruits}</span>
                                            <span>{progressValue}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-[#B9D3C4]/20 rounded-full overflow-hidden mb-6">
                                            <div className="h-full bg-[#04330B] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(4,51,11,0.3)]" style={{ width: `${progressValue}%` }}></div>
                                        </div>
                                        {isUnlocked && (
                                            <button onClick={() => downloadAsPng(appointmentRef, `PGP-Appointment-${(summary?.user?.name || 'Member').replace(/\s+/g, '-')}.png`)} className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all overflow-hidden">
                                                <span className="material-symbols-outlined shrink-0">download</span>
                                                <span className="truncate">{t.dashboard.downloadAppointmentLetter}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ID Card Section */}
                        <NewMemberIdCard summary={summary} loading={loading} onPhotoUpdated={refreshSummary} />
                        </div>
                    )}

                    {!isUnionWorker && summary?.user?.isLeader && (
                        <div className="mb-8">
                            {/* Team Members */}
                            <section className="rounded-[2.5rem] p-8 bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)]">
                                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                                    <div><h3 className="text-2xl font-bold text-[#04330B]">{t.dashboard.recruitedMembers}</h3><p className="text-[#04330B]/50 text-sm font-medium">{t.dashboard.recentlyRecruited}</p></div>
                                </div>
                                <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr_0.5fr] gap-4 items-center px-4 pb-4 border-b border-[#04330B]/5 text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mb-4">
                                    <div>{t.dashboard.memberLabel}</div>
                                    <div>{t.dashboard.mobile}</div>
                                    <div>{t.dashboard.loksabha}</div>
                                    <div>{t.dashboard.cwc}</div>
                                    <div>{t.dashboard.joiningDate}</div>
                                    <div className="text-right">{t.dashboard.profile}</div>
                                </div>
                                <div className="space-y-4">
                                    {recruits.length === 0 ? (
                                        <div className="py-10 text-center text-[#04330B]/30 font-bold">{t.dashboard.noRecruitsYet}</div>
                                    ) : (
                                        recruits.slice(0, 5).map((m, i) => (
                                            <div key={i} className="flex flex-col lg:grid lg:grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr_0.5fr] gap-4 lg:items-center p-4 bg-white/40 rounded-2xl border border-[#04330B]/5 group hover:bg-white/80 transition-all cursor-pointer min-w-0">

                                                <div className="flex items-center gap-4 w-full min-w-0">
                                                    <div className="w-12 h-12 rounded-full bg-[#B9D3C4]/20 overflow-hidden shrink-0 border border-[#04330B]/5">
                                                        {m.photoUrl ? (
                                                            <img src={m.photoUrl.startsWith('http') ? m.photoUrl : `${getApiBaseUrl().replace(/\/v1\/?$/, '')}${m.photoUrl}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[#04330B]/40"><User size={20} /></div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <p className="font-black text-[#04330B] text-base truncate">{m.name}</p>
                                                        <p className="text-[11px] font-bold text-[#04330B]/40 truncate">{t.dashboard.membershipIdLabel}: {m.memberId || '-'}</p>
                                                    </div>
                                                </div>

                                                <div className="w-full text-sm text-[#04330B]/60 font-medium truncate min-w-0">
                                                    <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.mobile}:</span>
                                                    {m.phone}
                                                </div>

                                                <div className="w-full text-sm text-[#04330B]/60 font-medium truncate min-w-0">
                                                    <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.loksabha}:</span>
                                                    {m.localUnit?.vidhansabha?.loksabha?.name || '-'}
                                                </div>

                                                <div className="w-full text-sm text-[#04330B]/60 font-medium truncate min-w-0">
                                                    <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.cwc}:</span>
                                                    {m.cwcName || '-'}
                                                </div>

                                                <div className="w-full text-sm text-[#04330B]/60 font-medium truncate min-w-0">
                                                    <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.joiningDate}:</span>
                                                    {new Date(m.createdAt).toLocaleDateString(language === 'en' ? 'en-GB' : 'hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>

                                                <div className="w-full flex lg:justify-end mt-2 lg:mt-0">
                                                    <span className="material-symbols-outlined text-[#04330B]/20 group-hover:text-[#04330B] transition-colors text-lg">arrow_forward_ios</span>
                                                </div>

                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Hidden Appointment Letter for Download */}
                    <div className="fixed overflow-hidden pointer-events-none" style={{ top: '-10000px', left: '-10000px', width: '800px', height: '1130px' }}>
                        <div
                            ref={appointmentRef}
                            data-download-root
                            className="w-[800px] bg-white p-12 relative overflow-hidden flex flex-col items-center"
                            style={{
                                minHeight: '1130px', // A4 Aspect Ratio 
                                border: '30px solid #04330B',
                                borderStyle: 'double',
                                padding: '60px'
                            }}
                        >
                            {/* Decorative Corner Borders */}
                            <div className="absolute top-0 left-0 w-32 h-32 border-t-[10px] border-l-[10px] border-[#04330B]/10"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 border-t-[10px] border-r-[10px] border-[#04330B]/10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[10px] border-l-[10px] border-[#04330B]/10"></div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[10px] border-r-[10px] border-[#04330B]/10"></div>

                            {/* Header Section */}
                            <div className="w-full border-b-[3px] border-[#04330B] pb-8 mb-12 flex items-center gap-8">
                                <div className="bg-[#04330B] p-5 rounded-2xl shadow-lg">
                                    <img src="/PGPlogo.svg" className="h-20" style={{ filter: 'brightness(0) invert(1)' }} alt="Logo" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-[52px] font-black leading-tight text-[#04330B] tracking-tight m-0 uppercase" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                        {t.dashboard.partyName}
                                    </h1>
                                    <div className="h-1.5 w-full bg-[#04330B] mt-1 mb-2 opacity-20"></div>
                                    <p className="text-2xl font-bold tracking-[0.3em] text-[#04330B]/60 uppercase m-0 italic">
                                        {t.dashboard.empoweringIndia}
                                    </p>
                                </div>
                            </div>

                            {/* Letter Content */}
                            <div className="w-full flex-1 flex flex-col">
                                <div className="flex justify-between items-baseline mb-12">
                                    <div className="text-xl">
                                        <p className="font-bold text-[#04330B]/40 uppercase tracking-widest text-xs mb-1">{t.dashboard.membershipIdLabel}</p>
                                        <p className="font-black text-2xl text-[#04330B]">{summary?.user?.memberId || 'PGP-000000'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#04330B]/40 uppercase tracking-widest text-xs mb-1">{t.dashboard.dateLabel}</p>
                                        <p className="font-black text-xl text-[#04330B]">
                                            {new Date().toLocaleDateString(language === 'en' ? 'en-GB' : 'hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center mb-16">
                                    <h2 className="text-4xl font-black text-[#04330B] uppercase tracking-wider relative inline-block py-2">
                                        {t.dashboard.appointmentLetterHeader}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#04330B]"></div>
                                    </h2>
                                </div>

                                <div className="space-y-10 text-2xl text-[#04330B] leading-relaxed" style={{ fontFamily: "'Times New Roman', serif" }}>
                                    <p className="text-3xl font-bold">
                                        {t.dashboard.dear} <strong>{summary?.user?.name || 'Member'}</strong>,
                                    </p>

                                    <p className="text-2xl italic leading-relaxed">
                                        {t.dashboard.appointmentBody.replace('you', `you as a ${currentDesignation}`)}
                                    </p>

                                    <div className="grid grid-cols-2 gap-12 pt-8">
                                        <div className="p-8 rounded-3xl bg-[#B9D3C4]/10 border border-[#04330B]/10">
                                            <p className="text-sm font-bold text-[#04330B]/40 uppercase tracking-widest mb-2">{t.dashboard.loksabhaLabel}</p>
                                            <p className="text-2xl font-black text-[#04330B]">{summary?.user?.localUnit?.vidhansabha?.loksabha?.name || '-'}</p>
                                        </div>
                                        <div className="p-8 rounded-3xl bg-[#B9D3C4]/10 border border-[#04330B]/10">
                                            <p className="text-sm font-bold text-[#04330B]/40 uppercase tracking-widest mb-2">{t.dashboard.cwcLabel}</p>
                                            <p className="text-2xl font-black text-[#04330B]">{summary?.user?.cwcName || '-'}</p>
                                        </div>
                                    </div>

                                    <p className="pt-8 italic text-[#04330B]/80 font-medium">
                                        {t.dashboard.appointmentClosing}
                                    </p>
                                </div>

                                <div className="mt-auto pt-24 flex justify-between items-end border-t-2 border-[#04330B]/10">
                                    <div className="w-16 h-16 opacity-10">
                                        <img src="/PGPlogo.svg" className="w-full grayscale brightness-0" alt="Watermark" />
                                    </div>
                                    <div className="text-center w-80">
                                        <div className="h-0.5 w-full bg-[#04330B] mb-2"></div>
                                        <p className="font-black uppercase tracking-[0.2em] text-sm text-[#04330B]">{t.dashboard.authorizedSignatory}</p>
                                        <p className="text-xs font-bold text-[#04330B]/40 mt-1">PEOPLES GREEN PARTY (INDIA)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </RequireAuth>
    );
}

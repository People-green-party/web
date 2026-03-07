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
import { fetchApi } from '../../lib/api';
import { RequireAuth } from '../components/RequireAuth';
import html2canvas from 'html2canvas';
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
        const canvas = await html2canvas(ref.current, {
            scale: 3,
            useCORS: true,
            allowTaint: false,
            backgroundColor: null,
            logging: false,
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
        alert("Could not download image.");
    }
}

async function downloadAsPdf(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
    if (!ref.current) return;
    try {
        const canvas = await html2canvas(ref.current, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
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
        <div className="rounded-[2.5rem] p-8 flex flex-col items-center justify-between h-full bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)]">
            <div className="w-full self-start">
                <h3 className="text-xl font-bold text-[#04330B] mb-6">{t.dashboard.memberCardTitle}</h3>
            </div>

            {/* ID Card Display */}
            <div
                ref={idCardRef}
                className="w-full max-w-[400px] aspect-[1.6/1] rounded-[24px] p-6 relative overflow-hidden shadow-2xl mb-6 flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #04330B 0%, #0B5A2A 100%)', color: '#ffffff' }}
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8"></div>

                <div className="flex justify-between items-start relative z-10 mb-auto">
                    <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                        <img src="/PGPlogo.svg" alt="PGP" className="h-7" crossOrigin="anonymous" />
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30">
                        {user?.photoUrl ? (
                            <img
                                src={user.photoUrl.startsWith('http') ? user.photoUrl : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '')}${user.photoUrl}`}
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
                    className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                    <span className="material-symbols-outlined">download</span>
                    {t.dashboard.downloadCard}
                </button>
            </div>
        </div>
    );
};



// --- Main Page ---

export default function DemoDashboard() {
    const { t } = useLanguage();
    const [summary, setSummary] = useState<DashboardUserSummary | null>(null);
    const [progress, setProgress] = useState<DashboardRecruitProgress | null>(null);
    const [recruits, setRecruits] = useState<DashboardRecruitsListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const appointmentRef = useRef<HTMLDivElement>(null);

    const effectiveOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://peoplesgreen.org';
    const localUnitId = summary?.user?.localUnit?.id ?? null;
    const localUnitRecruits = useMemo(() => {
        if (!localUnitId) return [];
        return (recruits || []).filter((r) => Number(r.localUnitId) === Number(localUnitId));
    }, [recruits, localUnitId]);

    const referralCode = summary?.user?.referralCode || '';
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
        const link = `${effectiveOrigin}/join?ref=${referralCode}`;
        const text = `Join the Peoples Green Party movement! Use my referral link: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleNativeShare = async () => {
        const link = `${effectiveOrigin}/join?ref=${referralCode}`;
        const text = `Join the Peoples Green Party movement! Use my referral link: ${link}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Peoples Green Party',
                    text: text,
                    url: link
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = () => {
        const link = `${effectiveOrigin}/join?ref=${referralCode}`;
        navigator.clipboard.writeText(link);
        alert(t.language === 'en' ? 'Link copied to clipboard!' : 'लिंक क्लिपबोर्ड पर कॉपी हो गया!');
    };

    const dashboardLinks = [
        { name: t.nav.dashboard, href: '/dashboard' },
        { name: t.nav.election, href: '/election' }
    ];

    return (
        <RequireAuth>
            <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-[104px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
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
                                        <img className="w-full h-full object-cover rounded-full" src={summary.user.photoUrl.startsWith('http') ? summary.user.photoUrl : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '')}${summary.user.photoUrl}`} />
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
                                <input type="file" ref={fileInputRef} className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    const auth = await getAuthHeader();
                                    const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002')}/users/me/photo`, {
                                        method: 'POST',
                                        headers: { ...auth },
                                        body: formData
                                    });
                                    if (res.ok) refreshSummary();
                                }} />
                            </div>

                            <div className="flex-1 lg:ml-4">
                                <div className="mb-8">
                                    <h1 className="text-4xl font-black text-[#04330B] tracking-tight mb-2">{summary?.user?.name || '...'}</h1>
                                    <p className="text-[#04330B]/80 text-lg font-medium">
                                        {currentDesignation}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                                    <div className="flex flex-col"><span className="text-sm font-bold text-[#04330B]">{t.dashboard.membershipIdLabel}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1">{summary?.user?.memberId || 'PGP-......'}</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-bold text-[#04330B]">{t.dashboard.mobileNumberLabel}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1">{summary?.user?.phone || '...'}</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-bold text-[#04330B]">{t.dashboard.loksabha}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1">{summary?.user?.localUnit?.vidhansabha?.loksabha?.name || '...'}</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-bold text-[#04330B]">{t.dashboard.cwc}</span><span className="text-sm font-normal text-[#04330B]/80 mt-1">{summary?.user?.cwcName?.replace(/^CWC\s+/i, '') || 'Sector 04'}</span></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Referral Program */}
                        <div className="rounded-[2.5rem] p-8 subtle-pattern flex flex-col bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)]">
                            <h3 className="text-xl font-bold text-[#04330B] mb-2">{t.dashboard.inviteTitle}</h3>
                            <p className="text-[#04330B]/60 text-sm leading-relaxed mb-6">{t.dashboard.inviteSubtitle}</p>

                            <div className="flex items-center justify-between gap-4 bg-white/50 p-4 rounded-xl border border-[#04330B]/10 mb-8">
                                <div>
                                    <p className="text-[#04330B]/50 font-bold text-[10px] uppercase mb-0.5">{t.dashboard.referralLabel}</p>
                                    <p className="text-xl font-black text-[#04330B] tracking-widest">{(referralCode || '--------').toString().toUpperCase()}</p>
                                </div>
                                <div className="w-14 h-14 bg-white rounded-xl p-1.5 border border-[#04330B]/5 shadow-sm overflow-hidden flex items-center justify-center">
                                    {referralCode ? (
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${effectiveOrigin}/join?ref=${referralCode}`)}`}
                                            alt="QR Code"
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="text-[8px] font-bold text-[#04330B]/20">QR</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={handleShareWA} className="col-span-1 py-3 bg-[#04330B]/5 text-[#04330B] rounded-2xl font-bold border border-[#04330B]/10 flex items-center justify-center text-xs gap-2 hover:bg-[#04330B]/10 transition-all">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.652.83 5.126 2.27 7.202L.613 24l5.067-1.583A11.964 11.964 0 0 0 12.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22A9.97 9.97 0 0 1 7.152 20.72l-.35-.208-3.078.96 1.052-3.14-.236-.376a9.971 9.971 0 0 1-1.638-5.719A9.914 9.914 0 0 1 12.031 2.094a9.914 9.914 0 0 1 9.91 9.937A9.914 9.914 0 0 1 12.031 22zm5.424-7.443c-.297-.15-1.761-.871-2.034-.972-.273-.101-.473-.15-.673.15-.201.3-.77 .972-.942 1.171-.174.2-.348.225-.646.075-.298-.15-1.258-.464-2.395-1.48-.885-.791-1.482-1.767-1.656-2.067-.174-.3-.018-.463.13-.611.134-.135.297-.346.447-.519.149-.174.199-.297.298-.496.099-.199.05-.373-.025-.523-.075-.15-.673-1.62-.921-2.215-.24-.582-.486-.503-.673-.513-.175-.008-.374-.008-.573-.008s-.523.075-.797.373c-.274.298-1.046 1.021-1.046 2.489s1.07 2.887 1.22 3.087c.15.2 2.106 3.21 5.099 4.5.712.308 1.268.492 1.7.63.714.227 1.365.195 1.879.118.575-.086 1.761-.72 2.01-1.416.248-.696.248-1.293.174-1.416-.075-.123-.274-.198-.572-.348z" />
                                        </svg>
                                        WhatsApp
                                    </button>
                                    <button onClick={handleCopyLink} className="col-span-1 py-3 bg-[#04330B]/5 text-[#04330B] rounded-2xl font-bold border border-[#04330B]/10 flex items-center justify-center text-xs gap-2 hover:bg-[#04330B]/10 transition-all">
                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                        {t.dashboard.copy}
                                    </button>
                                </div>
                                <button onClick={handleNativeShare} className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                                    <span className="material-symbols-outlined">share</span>
                                    {t.dashboard.inviteTitle}
                                </button>
                            </div>
                        </div>

                        {/* Leadership Progress */}
                        <div className="rounded-[2.5rem] p-8 flex flex-col bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)]">
                            <h3 className="text-xl font-bold text-[#04330B] mb-2">{t.dashboard.appointmentTitle}</h3>
                            <p className="text-[#04330B]/60 text-sm mb-6">{t.dashboard.appointmentLocked}</p>

                            <div className="flex items-center justify-between gap-4 bg-white/50 p-4 rounded-xl border border-[#04330B]/10 mb-8">
                                <div>
                                    <p className="text-[#04330B]/50 font-bold text-[10px] uppercase mb-0.5">{t.dashboard.status}</p>
                                    {isUnlocked ? (
                                        <p className="text-sm font-black text-[#04330B]/60">{t.dashboard.congratulations}<br />{t.dashboard.appointmentLetterUnlocked}</p>
                                    ) : (
                                        <p className="text-sm font-black text-[#04330B]">{t.dashboard.appointmentTitle}</p>
                                    )}
                                </div>
                                <div className={`w-14 h-14 rounded-xl p-1.5 border shadow-sm flex items-center justify-center shrink-0 bg-white border-[#04330B]/5`}>
                                    <span className={`material-symbols-outlined text-3xl ${isUnlocked ? 'text-[#04330B]/60' : 'text-[#04330B]/30'}`}>{isUnlocked ? 'workspace_premium' : 'lock'}</span>
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
                                    <button onClick={() => downloadAsPng(appointmentRef, `PGP-Appointment-${(summary?.user?.name || 'Member').replace(/\s+/g, '-')}.png`)} className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined">download</span>
                                        {t.dashboard.downloadAppointmentLetter}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ID Card Section */}
                        <NewMemberIdCard summary={summary} loading={loading} onPhotoUpdated={refreshSummary} />
                    </div>

                    <div className="mb-8">
                        {/* Team Members */}
                        <section className="rounded-[2.5rem] p-8 bg-white/20 backdrop-blur-md border border-[#04330B]/10 shadow-[0_20px_50px_-12px_rgba(4,51,11,0.15)]">
                            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                                <div><h3 className="text-2xl font-bold text-[#04330B]">{t.dashboard.teamMembers}</h3><p className="text-[#04330B]/50 text-sm font-medium">{t.dashboard.recentlyRecruited}</p></div>
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
                                        <div key={i} className="flex flex-col lg:grid lg:grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr_0.5fr] gap-4 lg:items-center p-4 bg-white/40 rounded-2xl border border-[#04330B]/5 group hover:bg-white/80 transition-all cursor-pointer">

                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-12 h-12 rounded-full bg-[#B9D3C4]/20 overflow-hidden shrink-0">
                                                    {m.photoUrl ? (
                                                        <img src={m.photoUrl.startsWith('http') ? m.photoUrl : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '')}${m.photoUrl}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#04330B]/40"><User size={20} /></div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col truncate">
                                                    <p className="font-black text-[#04330B] text-base truncate">{m.name}</p>
                                                    <p className="text-[11px] font-bold text-[#04330B]/40">{t.dashboard.membershipIdLabel}: {m.memberId || 'PGP-XXXX'}</p>
                                                </div>
                                            </div>

                                            <div className="w-full text-sm text-[#04330B]/60 font-medium truncate">
                                                <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.mobile}:</span>
                                                {m.phone}
                                            </div>

                                            <div className="w-full text-sm text-[#04330B]/60 font-medium truncate">
                                                <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.loksabha}:</span>
                                                {m.localUnit?.vidhansabha?.loksabha?.name || 'Western Sector'}
                                            </div>

                                            <div className="w-full text-sm text-[#04330B]/60 font-medium truncate">
                                                <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.cwc}:</span>
                                                {m.cwcName || 'Shyampura Kacholiya'}
                                            </div>

                                            <div className="w-full text-sm text-[#04330B]/60 font-medium truncate">
                                                <span className="lg:hidden text-[10px] font-bold text-[#04330B]/40 uppercase tracking-widest mr-2">{t.dashboard.joiningDate}:</span>
                                                {new Date(m.createdAt).toLocaleDateString(t.language === 'en' ? 'en-GB' : 'hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
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

                    {/* Hidden Appointment Letter for Download */}
                    <div className="fixed -left-[10000px] top-0" ref={appointmentRef}>
                        <div className="w-[800px] p-16 bg-white text-[#04330B] font-['Times_New_Roman']" style={{ border: '20px solid #04330B' }}>
                            <div className="flex justify-between items-center border-b-2 border-[#04330B] pb-8 mb-12">
                                <div className="bg-[#04330B] p-4 rounded-xl"><img src="/PGPlogo.svg" className="h-16 invert brightness-0" alt="Logo" crossOrigin="anonymous" /></div>
                                <div className="text-right">
                                    <h1 className="text-4xl font-black">{t.dashboard.partyName}</h1>
                                    <p className="text-xl font-bold italic">{t.dashboard.empoweringIndia}</p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-center mb-12 underline decoration-4 uppercase">{t.dashboard.appointmentLetterHeader}</h2>
                            <div className="space-y-8 text-xl leading-relaxed">
                                <p>{t.dashboard.dateLabel}: {new Date().toLocaleDateString(t.language === 'en' ? 'en-GB' : 'hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                <p>{t.dashboard.dear} <strong>{summary?.user?.name || 'Member'}</strong>,</p>
                                <p>{t.dashboard.appointmentBody.replace('you', `you as a ${currentDesignation}`)}</p>
                                <p>{t.dashboard.loksabhaLabel}: <strong>{summary?.user?.localUnit?.vidhansabha?.loksabha?.name || 'Rajasthan'}</strong></p>
                                <p>{t.dashboard.cwcLabel}: <strong>{summary?.user?.cwcName || 'State Representative'}</strong></p>
                                <p>{t.dashboard.appointmentClosing}</p>
                            </div>
                            <div className="mt-32 flex justify-between items-end border-t border-[#04330B]/20 pt-12">
                                <div><p className="font-bold underline">{t.dashboard.membershipIdLabel}: {summary?.user?.memberId}</p></div>
                                <div className="text-center w-64 border-t-2 border-[#04330B] pt-2"><p className="font-black uppercase tracking-widest text-sm">{t.dashboard.authorizedSignatory}</p></div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </RequireAuth>
    );
}

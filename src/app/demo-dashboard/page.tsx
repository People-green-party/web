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
    isLeader?: boolean;
}

interface DashboardRecruitsListItem {
    id: number;
    name: string;
    phone: string;
    createdAt: string;
    photoUrl: string | null;
    localUnitId?: number | null;
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

    const designation = useMemo(() => {
        const role = (user?.role || 'Member') as string;
        const rawName = (user?.cwcName || '') as string;
        let cwcLabel = '';
        if (rawName) {
            const parts = rawName.trim().split(/\s+/);
            const last = parts[parts.length - 1];
            const num = Number.parseInt(last, 10);
            cwcLabel = !Number.isNaN(num) ? `CWC ${num}` : 'CWC';
        }
        if (role === 'CWCPresident') return cwcLabel ? `${cwcLabel} President` : 'CWC President';
        if (role === 'CWCMember') return cwcLabel ? `${cwcLabel} Member` : 'CWC Member';
        if (role === 'ExtendedMember') return cwcLabel ? `${cwcLabel} Extended Member` : 'Extended Member';
        return 'Member';
    }, [user?.role, user?.cwcName]);

    const placeLine = useMemo(() => {
        const lok = user?.localUnit?.vidhansabha?.loksabha?.name;
        const vid = user?.localUnit?.vidhansabha?.name;
        const lu = user?.localUnit ? `${user.localUnit.name}${user.localUnit.type ? ` (${user.localUnit.type})` : ''}` : '';
        return [lok, vid, lu].filter(Boolean).join(', ');
    }, [user?.localUnit]);

    return (
        <div className="glass-card rounded-[2.5rem] p-8 shadow-premium border border-[#04330B]/5 flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#04330B] mb-6 self-start">Member Identification Card</h3>

            {/* ID Card Display */}
            <div
                ref={idCardRef}
                className="w-full max-w-[400px] aspect-[1.6/1] rounded-[24px] p-6 relative overflow-hidden shadow-2xl mb-6"
                style={{ background: 'linear-gradient(135deg, #04330B 0%, #0B5A2A 100%)', color: '#ffffff' }}
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8"></div>

                <div className="flex justify-between items-start relative z-10">
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

                <div className="mt-8 relative z-10 ml-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{loading ? '...' : (user?.name || 'NAME')}</h2>
                    <p className="text-white/80 font-bold text-sm mb-0.5">{loading ? '...' : designation}</p>
                    <p className="text-white/60 font-semibold text-[11px] leading-tight max-w-[80%]">{loading ? '...' : placeLine}</p>
                </div>

                <div className="absolute bottom-6 left-8 z-10">
                    <p className="text-white/90 font-mono font-bold tracking-[0.2em] text-sm">{loading ? '...' : (user?.memberId || 'PGP-000000')}</p>
                </div>

                <div className="absolute bottom-6 right-8 w-10 h-10 bg-white/10 rounded-lg"></div>
            </div>

            <div className="flex flex-col w-full gap-3">
                <label className="flex items-center justify-center gap-2 cursor-pointer text-[#04330B] bg-[#04330B]/5 px-6 py-2.5 rounded-full text-sm font-bold border border-[#04330B]/10 hover:bg-[#04330B]/10 transition-colors w-fit">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                </label>

                <button
                    onClick={() => downloadAsPng(idCardRef, `PGP-ID-${(user?.name || 'Member').replace(/\s+/g, '-')}.png`)}
                    className="w-full h-14 rounded-2xl bg-[#04330B]/5 text-[#04330B] font-bold border border-[#04330B]/10 hover:bg-[#04330B]/10 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">download</span>
                    Download ID Card
                </button>
            </div>
        </div>
    );
};

const ReferralSection = ({ referralCode, effectiveOrigin }: { referralCode: string, effectiveOrigin: string }) => {
    return (
        <div className="glass-card rounded-[2.5rem] p-8 flex flex-col shadow-premium border border-[#04330B]/5">
            <h3 className="text-xl font-bold text-[#04330B] mb-2">Your Referral Code</h3>
            <p className="text-[#04330B]/60 text-sm mb-8">People can scan or use this code to join.</p>

            <div className="flex items-center justify-between gap-6 mt-auto">
                <div>
                    <p className="text-[#04330B]/50 font-bold text-sm mb-1">Your referral code</p>
                    <p className="text-3xl font-black text-[#04330B] tracking-[0.1em]">{(referralCode || '--------').toString().toUpperCase()}</p>
                </div>

                <div className="w-24 h-24 bg-white rounded-2xl p-2 border border-[#04330B]/5 shadow-sm overflow-hidden flex items-center justify-center">
                    {referralCode ? (
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${effectiveOrigin}/join?ref=${referralCode}`)}`}
                            alt="QR Code"
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="text-xs font-bold text-[#04330B]/20">QR CODE</div>
                    )}
                </div>
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

    const handleCopyLink = () => {
        const link = `${effectiveOrigin}/join?ref=${referralCode}`;
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };

    return (
        <RequireAuth>
            <div className="min-h-screen bg-white text-slate-900 overflow-hidden flex" style={{ fontFamily: "'Manrope', sans-serif" }}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

                <style jsx global>{`
          .glass-sidebar { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(4, 51, 11, 0.1); }
          .glass-card { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(4, 51, 11, 0.1); }
          .subtle-pattern { background-image: radial-gradient(circle at 2px 2px, rgba(4, 51, 11, 0.05) 1px, transparent 0); background-size: 24px 24px; }
          .shadow-premium { box-shadow: 0 10px 30px rgba(4, 51, 11, 0.05); }
        `}</style>

                {/* Sidebar */}
                <aside className="w-24 flex flex-col items-center py-8 gap-10 glass-sidebar m-4 mr-0 rounded-[1.5rem] z-50">
                    <Link href="/" className="w-12 h-12 bg-[#04330B] rounded-[1rem] flex items-center justify-center shadow-lg shadow-[#04330B]/20">
                        <span className="material-symbols-outlined text-white text-3xl">eco</span>
                    </Link>
                    <nav className="flex flex-col gap-8 flex-1">
                        <Link href="/dashboard" className="group relative flex flex-col items-center">
                            <div className="p-3 rounded-full text-[#04330B] hover:bg-[#04330B]/10 transition-all duration-300">
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                            </div>
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#B9D3C4] rounded-full"></div>
                        </Link>
                        <div className="p-3 rounded-full text-[#04330B]/60 hover:text-[#04330B] hover:bg-[#04330B]/10 transition-all duration-300 cursor-pointer">
                            <span className="material-symbols-outlined text-2xl">group</span>
                        </div>
                    </nav>
                </aside>

                {/* Main */}
                <main className="flex-1 flex flex-col overflow-y-auto px-8 py-4">
                    <header className="flex items-center justify-between py-4 mb-6 sticky top-0 bg-white/60 backdrop-blur-md z-40 rounded-[1.5rem] px-4 border border-[#04330B]/5">
                        <div className="relative w-96">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#04330B]/40">search</span>
                            <input className="w-full bg-[#04330B]/5 border-none rounded-full pl-12 pr-6 py-2.5 text-sm focus:ring-1 focus:ring-[#04330B]/20 placeholder:text-[#04330B]/30" placeholder="Search..." type="text" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#04330B]">{summary?.user?.name || 'Loading...'}</p>
                                <span className="text-[10px] px-2 py-0.5 bg-[#04330B] text-white rounded-full font-bold uppercase tracking-wider">{summary?.user?.role || 'Member'}</span>
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-[#04330B]/10 p-0.5 overflow-hidden">
                                {summary?.user?.photoUrl ? (
                                    <img className="w-full h-full object-cover rounded-full" src={summary.user.photoUrl.startsWith('http') ? summary.user.photoUrl : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '')}${summary.user.photoUrl}`} />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center"><User size={24} className="text-slate-400" /></div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Hero / ID Card Section */}
                    <section className="bg-gradient-to-br from-[#B9D3C4] via-[#EAF1EE] to-white p-10 rounded-[3rem] shadow-premium mb-8 border border-[#04330B]/5 relative overflow-hidden flex items-center min-h-[400px]">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#04330B]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>

                        <div className="flex flex-col lg:flex-row gap-16 items-center w-full relative z-10 px-4">
                            <div className="relative shrink-0">
                                <div className="w-52 h-52 rounded-full border-[8px] border-white p-1.5 bg-white shadow-2xl flex items-center justify-center overflow-hidden">
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

                            <div className="flex-1 lg:ml-8">
                                <div className="mb-10">
                                    <h1 className="text-6xl font-black text-[#04330B] mb-2 tracking-tight">{summary?.user?.name || '...'}</h1>
                                    <p className="text-[#04330B]/70 font-bold text-xl flex items-center gap-3">
                                        {summary?.user?.role || 'Member'} <span className="w-2 h-2 bg-[#04330B]/20 rounded-full"></span>
                                        <span className="text-[#04330B]">Verified Elite Member</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                                    <div className="flex flex-col"><span className="text-[11px] uppercase tracking-widest text-[#04330B]/40 font-black mb-1">ID</span><span className="text-xl font-bold text-[#04330B]">{summary?.user?.memberId || '...'}</span></div>
                                    <div className="flex flex-col"><span className="text-[11px] uppercase tracking-widest text-[#04330B]/40 font-black mb-1">CWC</span><span className="text-xl font-bold text-[#04330B]">{summary?.user?.cwcName || 'Sector 04'}</span></div>
                                    <div className="flex flex-col"><span className="text-[11px] uppercase tracking-widest text-[#04330B]/40 font-black mb-1">Referrals</span><span className="text-xl font-bold text-[#04330B]">{summary?.recruitsCount || 0}</span></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Referral Program */}
                        <div className="glass-card rounded-[2.5rem] p-8 subtle-pattern flex flex-col shadow-premium border border-[#04330B]/5">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#04330B]/5">
                                <span className="material-symbols-outlined text-[#04330B]">diversity_3</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#04330B] mb-2">Invite your 5 team members</h3>
                            <p className="text-[#04330B]/60 text-sm leading-relaxed mb-10">Share your link on WhatsApp to quickly recruit members from your Local Unit.</p>

                            <div className="mt-auto grid grid-cols-3 gap-3">
                                <button onClick={handleShareWA} className="col-span-1 py-4 bg-[#04330B] text-white rounded-2xl font-bold flex flex-col items-center justify-center text-[10px] gap-1 hover:brightness-110 transition-all">
                                    <span className="material-symbols-outlined text-lg">share</span>
                                    Invite
                                </button>
                                <button onClick={handleShareWA} className="col-span-1 py-4 bg-green-500 text-white rounded-2xl font-bold flex flex-col items-center justify-center text-[10px] gap-1 hover:brightness-110 transition-all">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width={18} height={18} alt="WA" className="invert brightness-200" />
                                    WhatsApp
                                </button>
                                <button onClick={handleCopyLink} className="col-span-1 py-4 bg-[#04330B]/5 text-[#04330B] rounded-2xl font-bold border border-[#04330B]/10 flex flex-col items-center justify-center text-[10px] gap-1 hover:bg-[#04330B]/10 transition-all">
                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        {/* Leadership Progress */}
                        <div className="glass-card rounded-[2.5rem] p-8 flex flex-col shadow-premium border border-[#04330B]/10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-[#B9D3C4]/30 rounded-2xl flex items-center justify-center text-[#04330B]">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isUnlocked ? 'bg-green-100 border-green-200 text-green-700' : 'bg-[#04330B]/5 border-[#04330B]/10 text-[#04330B]'}`}>
                                    <span className="material-symbols-outlined text-sm">{isUnlocked ? 'check_circle' : 'lock'}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Appointment Letter</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#04330B] mb-2">Leadership Progress</h3>
                            <p className="text-[#04330B]/60 text-sm mb-10">Recruit 5 members to unlock your Official Appointment Letter.</p>

                            <div className="mt-auto">
                                <div className="flex justify-between text-xs font-bold text-[#04330B] mb-3">
                                    <span>{localUnitRecruits.length}/5 Recruits</span>
                                    <span>{progressValue}%</span>
                                </div>
                                <div className="w-full h-3 bg-[#B9D3C4]/20 rounded-full overflow-hidden mb-6">
                                    <div className="h-full bg-[#04330B] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(4,51,11,0.3)]" style={{ width: `${progressValue}%` }}></div>
                                </div>
                                {isUnlocked && (
                                    <button onClick={() => downloadAsPng(appointmentRef, 'PGP-Appointment.png')} className="w-full py-4 bg-[#04330B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined">download</span>
                                        Download Appointment Letter
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* New Referral Section */}
                        <ReferralSection referralCode={referralCode} effectiveOrigin={effectiveOrigin} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <NewMemberIdCard summary={summary} loading={loading} onPhotoUpdated={refreshSummary} />

                        {/* Team Members */}
                        <section className="glass-card rounded-[2.5rem] p-8 shadow-premium border border-[#04330B]/5">
                            <div className="flex items-center justify-between mb-8">
                                <div><h3 className="text-2xl font-bold text-[#04330B]">Team Members</h3><p className="text-[#04330B]/50 text-sm font-medium">Your recently recruited members</p></div>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {recruits.length === 0 ? (
                                    <div className="py-10 text-center text-[#04330B]/30 font-bold">No members yet. Start recruiting!</div>
                                ) : (
                                    recruits.map((m, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-[#04330B]/5 group hover:bg-white/80 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-[#B9D3C4]/20 overflow-hidden">
                                                    {m.photoUrl ? (
                                                        <img src={m.photoUrl.startsWith('http') ? m.photoUrl : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '')}${m.photoUrl}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#04330B]/40"><User size={20} /></div>
                                                    )}
                                                </div>
                                                <div><p className="font-black text-[#04330B]">{m.name}</p><p className="text-[11px] font-bold text-[#04330B]/40 capitalize">{m.phone}</p></div>
                                            </div>
                                            <span className="material-symbols-outlined text-[#04330B]/20 group-hover:text-[#04330B] transition-colors">arrow_forward_ios</span>
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
                                <div className="bg-[#04330B] p-4 rounded-xl"><img src="/PGPlogo.svg" className="h-16 invert brightness-0" alt="Logo" /></div>
                                <div className="text-right">
                                    <h1 className="text-4xl font-black">Peoples Green Party</h1>
                                    <p className="text-xl font-bold italic">Empowering India Together</p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-center mb-12 underline decoration-4">APPOINTMENT LETTER (NIYUKTI PATR)</h2>
                            <div className="space-y-8 text-xl leading-relaxed">
                                <p>Date: {new Date().toLocaleDateString()}</p>
                                <p>Dear <strong>{summary?.user?.name || 'Member'}</strong>,</p>
                                <p>We are pleased to officially appoint you as a <strong>{summary?.user?.role || 'Leader'}</strong> within the Peoples Green Party. Your commitment to our vision of a greener, cleaner, and more equitable India is highly valued.</p>
                                <p>This appointment acknowledges your leadership in building our grassroots movement. We trust that you will continue to serve with integrity and dedication.</p>
                            </div>
                            <div className="mt-32 flex justify-between items-end border-t border-[#04330B]/20 pt-12">
                                <div><p className="font-bold underline">Member ID: {summary?.user?.memberId}</p></div>
                                <div className="text-center w-64 border-t-2 border-[#04330B] pt-2"><p className="font-black uppercase tracking-widest text-sm">Authorized Signatory</p></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </RequireAuth>
    );
}

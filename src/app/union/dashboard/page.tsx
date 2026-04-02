"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageContext';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi, getApiBaseUrl } from '../../../lib/api';
import { RequireAuth } from '../../components/RequireAuth';
import { User, Phone, MapPin, Car, FileText, AlertCircle, Camera, Trash2, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { getAuthHeader } from '../../../lib/supabaseClient';

interface UnionUserSummary {
  user: {
    id: number;
    name: string;
    phone: string;
    memberId: string | null;
    photoUrl: string | null;
    unionName: string | null;
    vehicleNumber: string | null;
    governmentId: string | null;
    address: string | null;
  };
}

// --- Helper for ID Card Download ---
async function downloadAsPng(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
    if (!ref.current) return;
    try {
        const element = ref.current;
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 300));

        // Bypass CSSStyleSheet CORS errors
        const originalCssRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules');
        if (originalCssRules) {
            Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
                get() { try { return originalCssRules.get?.call(this) || []; } catch { return []; } },
                configurable: true
            });
        }

        const dataUrl = await toPng(element, {
            pixelRatio: 3, 
            style: { opacity: '1', visibility: 'visible', pointerEvents: 'auto' },
        });

        if (originalCssRules) {
            Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', originalCssRules);
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error("Capture Error:", error);
        alert("Download failed. Please try again or take a screenshot.");
    }
}

export default function UnionDashboardPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [summary, setSummary] = useState<UnionUserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const idCardRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSummary = async () => {
    try {
      const sum = await fetchApi('users/me/summary');
      setSummary(sum as UnionUserSummary);
    } catch (e: any) {
      console.error("Dashboard Load Error:", e);
      setError(e.message || "Authentication failed or session expired.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
        const auth = await getAuthHeader();
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch(`${getApiBaseUrl()}/users/me/photo`, {
            method: 'POST',
            headers: { ...auth },
            body: formData
        });
        
        if (!res.ok) throw new Error('Upload failed');
        await loadSummary(); // Refresh data
    } catch (err: any) {
        alert(`Failed to upload photo: ${err.message}`);
    } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePhotoRemove = async () => {
    if (!confirm('Are you sure you want to remove your photo?')) return;
    setUploading(true);
    try {
        const auth = await getAuthHeader();
        await fetch(`${getApiBaseUrl()}/users/me/photo`, {
            method: 'DELETE',
            headers: { ...auth }
        });
        await loadSummary();
    } catch (err: any) {
        alert('Failed to remove photo');
    } finally {
        setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex flex-col pt-[104px]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#04330B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !summary?.user) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex flex-col pt-[104px]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-red-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#04330B] mb-2">Session Expired</h2>
            <p className="text-gray-600 mb-6">{error || "Please log in again to view your dashboard."}</p>
            <button onClick={() => router.push('/login')} className="w-full py-3 bg-[#04330B] text-white rounded-xl font-bold hover:bg-[#0B5A2A]">
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const user = summary.user;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F7FCF9] pt-[104px] pb-12 font-['Familjen_Grotesk']">
        <Navbar />
        
        <main className="max-w-[1000px] mx-auto px-4 lg:px-8 mt-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#04330B] to-[#0B5A2A] rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
            <h1 className="text-3xl font-black mb-2 relative z-10">संघ डैशबोर्ड</h1>
            <p className="text-white/80 font-medium text-lg relative z-10">{user.unionName || 'Union Dashboard'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
            
            {/* Left Col: ID Card & Photo Upload */}
            <div className="flex flex-col gap-4">
                <div className="rounded-[24px] p-6 bg-white border border-[#BBF7D0] shadow-sm flex flex-col items-center">
                    <h3 className="text-xl font-bold text-[#04330B] w-full text-left mb-6">संघ सदस्य कार्ड</h3>
                    
                    {/* The Digital ID Card */}
                    <div
                        ref={idCardRef}
                        className="w-full max-w-[380px] aspect-[1.6/1] rounded-[20px] p-6 relative overflow-hidden shadow-2xl mb-6 flex flex-col justify-between"
                        style={{ background: 'linear-gradient(135deg, #04330B 0%, #0B5A2A 100%)', color: '#ffffff' }}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-8 -mb-8"></div>

                        <div className="flex justify-between items-start relative z-10 mb-auto">
                            <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                                <span className="text-[#04330B] font-black text-sm px-1 tracking-wider">संघ</span>
                            </div>
                            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/30 shadow-inner">
                                {user.photoUrl ? (
                                    <img
                                        src={user.photoUrl.startsWith('http') ? user.photoUrl : `${getApiBaseUrl().replace(/\/v1\/?$/, '')}${user.photoUrl}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <User size={32} className="text-white/80" />
                                )}
                            </div>
                        </div>

                        <div className="relative z-10 ml-2 mb-4">
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-1 truncate">{user.name || 'नाम'}</h2>
                            <p className="text-[#BBF7D0] font-bold text-sm truncate">{user.unionName || 'संघ सदस्य'}</p>
                        </div>

                        <div className="relative z-10 ml-2 mt-auto">
                            <p className="text-white font-mono font-bold tracking-[0.2em] text-sm">{user.memberId || 'U-000000'}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full flex gap-3 mb-4">
                        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            disabled={uploading}
                            className="flex-1 py-3 bg-[#F0FDF4] border border-[#22C55E] text-[#04330B] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#DCFCE7] transition-all"
                        >
                            <Camera size={18} />
                            {uploading ? '...' : (user.photoUrl ? 'फोटो बदलें' : 'फोटो लगायें')}
                        </button>
                        {user.photoUrl && (
                            <button 
                                onClick={handlePhotoRemove}
                                disabled={uploading}
                                className="px-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => downloadAsPng(idCardRef, `Union-ID-${(user.name || 'Member').replace(/\s+/g, '-')}.png`)}
                        className="w-full py-4 bg-[#04330B] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B5A2A] transition-all"
                    >
                        <Download size={20} />
                        <span>कार्ड डाउनलोड करें</span>
                    </button>
                </div>
            </div>

            {/* Right Col: Details Grid */}
            <div className="bg-white rounded-[24px] shadow-sm p-8 border border-[#BBF7D0] h-fit">
              <h3 className="text-xl font-bold text-[#04330B] mb-6 border-b pb-4">सदस्य का विवरण (Profile Details)</h3>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7]">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#0B5A2A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">मोबाइल नंबर</p>
                    <p className="font-bold text-[#04330B] text-lg truncate">{user.phone}</p>
                  </div>
                </div>

                {user.unionName && (
                  <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7]">
                    <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#0B5A2A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">संघ का नाम</p>
                      <p className="font-bold text-[#04330B] text-lg truncate">{user.unionName}</p>
                    </div>
                  </div>
                )}

                {user.vehicleNumber && (
                  <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7]">
                    <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-[#0B5A2A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">वाहन नंबर</p>
                      <p className="font-bold text-[#04330B] text-lg uppercase tracking-wider truncate">{user.vehicleNumber}</p>
                    </div>
                  </div>
                )}

                {user.governmentId && (
                  <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7]">
                    <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#0B5A2A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">सरकारी ID</p>
                      <p className="font-bold text-[#04330B] text-lg uppercase truncate">{user.governmentId}</p>
                    </div>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-start gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7] sm:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0 mt-1">
                      <MapPin className="w-5 h-5 text-[#0B5A2A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">पता (Address)</p>
                      <p className="font-bold text-[#04330B] text-base leading-relaxed whitespace-pre-wrap">{user.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageContext';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi, getApiBaseUrl } from '../../../lib/api';
import { RequireAuth } from '../../components/RequireAuth';
import { User, Phone, MapPin, Car, FileText, AlertCircle, Camera, Trash2 } from 'lucide-react';
import { UnionIdCard } from '../../../components/UnionIdCard';
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

export default function UnionDashboardPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [summary, setSummary] = useState<UnionUserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSummary = async (retryCount = 0) => {
    try {
      // 1. Wait for auth to settle BEFORE hitting the backend
      const auth = await getAuthHeader();
      
      if (!auth.Authorization) {
        // If no token is ready, wait 600ms and try again (up to 3 times)
        // This prevents sending unauthorized requests to the backend!
        if (retryCount < 3) {
          console.log("Waiting for auth session to settle...");
          setTimeout(() => loadSummary(retryCount + 1), 600);
          return; // Exit early and wait
        }
        throw new Error("No active session found. Please log in.");
      }

      // 2. We have a token, safe to call the backend
      const sum = await fetchApi('users/me/summary');
      setSummary(sum as UnionUserSummary);
      setError(null);
      setLoading(false); // Stop loading ONLY on success

    } catch (e: any) {
      console.error(`Dashboard Load Error:`, e);
      setError(e.message || "Authentication failed or session expired.");
      setLoading(false); // Stop loading on final failure
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
            <h1 className="text-3xl font-black mb-2 relative z-10">यूनियन डैशबोर्ड</h1>
            <p className="text-white/80 font-medium text-lg relative z-10">{user.unionName || 'Union Dashboard'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
            
            {/* Left Col: ID Card & Photo Upload */}
            <div className="flex flex-col gap-4">
                <div className="rounded-[24px] p-6 bg-white border border-[#BBF7D0] shadow-sm">
                    <h3 className="text-xl font-bold text-[#04330B] w-full text-left mb-6">यूनियन सदस्य कार्ड</h3>
                    
                    {/* Use the new UnionIdCard component */}
                    <div className="union-dashboard max-w-md mx-auto">
                        <UnionIdCard user={user} />
                    </div>
                </div>
                
                {/* Photo Upload Section - Separate from ID card */}
                <div className="rounded-[24px] p-6 bg-white border border-[#BBF7D0] shadow-sm">
                    <h3 className="text-xl font-bold text-[#04330B] w-full text-left mb-4">फोटो प्रबंधन</h3>
                    
                    <div className="w-full flex gap-3">
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
                      <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">यूनियन का नाम</p>
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

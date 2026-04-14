"use client";

import React from 'react';
import { UnionIdCard } from '../../components/UnionIdCard';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { User, Phone, MapPin, Car, FileText, Camera, Trash2 } from 'lucide-react';

export default function IdCardPreviewPage() {
  const testUser = {
    name: "राम कुमार शर्मा Chandrasekahar lal meena",
    phone: "+91 98765 43210",
    address: "पीपल्स ग्रीन पार्टी कार्यालय, नई दिल्ली, दिल्ली - 110001",
    unionName: "राजस्थान गिग वर्कर्स यूनियन",
    photoUrl: "http://localhost:3000/IMG_20260209_164816.jpg",
    memberId: "PGP-RG-2024-001",
    vehicleNumber: null,
    governmentId: "AABCD1234E"
  };

  return (
    <div className="min-h-screen bg-[#F7FCF9] pt-[104px] pb-12 font-['Familjen_Grotesk']">
      <Navbar />
      
      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 mt-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#04330B] to-[#0B5A2A] rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
          <h1 className="text-3xl font-black mb-2 relative z-10">यूनियन डैशबोर्ड</h1>
          <p className="text-white/80 font-medium text-lg relative z-10">{testUser.unionName || 'Union Dashboard'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          
          {/* Left Col: ID Card & Photo Upload */}
          <div className="flex flex-col gap-4">
              <div className="rounded-[24px] p-6 bg-white border border-[#BBF7D0] shadow-sm">
                  <h3 className="text-xl font-bold text-[#04330B] w-full text-left mb-6">यूनियन सदस्य कार्ड</h3>
                  
                  <div className="union-dashboard max-w-md mx-auto">
                      <UnionIdCard user={testUser} />
                  </div>
              </div>
              
              {/* Photo Upload Section - Visual only */}
              <div className="rounded-[24px] p-6 bg-white border border-[#BBF7D0] shadow-sm">
                  <h3 className="text-xl font-bold text-[#04330B] w-full text-left mb-4">फोटो प्रबंधन</h3>
                  
                  <div className="w-full flex gap-3">
                      <button 
                          disabled
                          className="flex-1 py-3 bg-[#F0FDF4] border border-[#22C55E] text-[#04330B] rounded-xl font-bold flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                      >
                          <Camera size={18} />
                          फोटो लगायें
                      </button>
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
                  <p className="font-bold text-[#04330B] text-lg truncate">{testUser.phone}</p>
                </div>
              </div>

              {testUser.unionName && (
                <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7]">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#0B5A2A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">यूनियन का नाम</p>
                    <p className="font-bold text-[#04330B] text-lg truncate">{testUser.unionName}</p>
                  </div>
                </div>
              )}

              {testUser.vehicleNumber && (
                <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7]">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-[#0B5A2A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">वाहन नंबर</p>
                    <p className="font-bold text-[#04330B] text-lg uppercase tracking-wider truncate">{testUser.vehicleNumber}</p>
                  </div>
                </div>
              )}

              {testUser.governmentId && (
                <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7]">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#0B5A2A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">सरकारी ID</p>
                    <p className="font-bold text-[#04330B] text-lg uppercase truncate">{testUser.governmentId}</p>
                  </div>
                </div>
              )}

              {testUser.address && (
                <div className="flex items-start gap-4 p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7] sm:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-[#0B5A2A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider">पता (Address)</p>
                    <p className="font-bold text-[#04330B] text-base leading-relaxed whitespace-pre-wrap">{testUser.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

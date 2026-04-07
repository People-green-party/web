import React, { useRef } from 'react';
import { User } from 'lucide-react';
import html2canvas from 'html2canvas';

interface UnionIdCardProps {
  user: {
    name: string;
    phone: string;
    address: string | null;
    unionName: string | null;
    photoUrl: string | null;
    memberId: string | null;
  };
}

export function UnionIdCard({ user }: UnionIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Helper to format the photo URL correctly
  const getPhotoUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '');
    return `${baseUrl}${url}`;
  };

  // Function to download the card as an image
  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 3, 
          useCORS: true,
          allowTaint: true,
          backgroundColor: null
        });

        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `PGP-Union-ID-${user.name || 'Member'}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please try taking a screenshot.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* THE ACTUAL ID CARD UI - Premium Layout */}
      <div
        ref={cardRef}
        className="w-full max-w-[400px] rounded-[16px] overflow-hidden mb-6 flex flex-col relative"
        style={{
          // Standard physical ID Card aspect ratio
          aspectRatio: '1.586 / 1', 
          background: 'linear-gradient(135deg, #04330B 0%, #0B5A2A 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Background decorative watermark graphics */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 pointer-events-none" 
          style={{ backgroundColor: '#ffffff', opacity: 0.04 }}
        />
        <div 
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-16 -mb-16 pointer-events-none" 
          style={{ backgroundColor: '#ffffff', opacity: 0.04 }}
        />

        {/* --- MAIN CARD CONTENT (Top & Middle) --- */}
        <div className="flex flex-col flex-1 p-5 pb-3 relative z-10">
          
          {/* HEADER ROW */}
          <div className="flex justify-between items-start gap-3 w-full">
            {/* Logo */}
            <div 
              className="w-14 h-14 rounded-xl p-1.5 flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <img src="/PGPlogo.svg" alt="PGP Logo" className="w-full h-full object-contain" crossOrigin="anonymous" />
            </div>
            
            {/* Main Union Title */}
            <div className="flex-1 flex flex-col items-center justify-center pt-1 px-1">
              <h1 
                className="font-black tracking-tight text-center leading-[1.15]" 
                style={{ fontSize: '14px', color: '#ffffff' }}
              >
                {user.unionName || 'पीपल्स ग्रीन असंगठित श्रमिक यूनियन'}
              </h1>
              {user.unionName && (
                <p className="text-center font-bold mt-1" style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.75)' }}>
                  पीपल्स ग्रीन असंगठित श्रमिक यूनियन
                </p>
              )}
            </div>

            {/* Profile Photo (Crisper white border to look like a real photo) */}
            <div 
              className="w-[72px] h-[92px] rounded-lg flex items-center justify-center overflow-hidden shrink-0"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                border: '2px solid rgba(255, 255, 255, 0.5)', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
              }}
            >
              {user.photoUrl ? (
                <img
                  src={getPhotoUrl(user.photoUrl)!}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <User size={36} color="rgba(255, 255, 255, 0.6)" />
              )}
            </div>
          </div>

          {/* USER DETAILS ROW (Pushes to the bottom of the middle section) */}
          <div className="flex flex-col flex-1 justify-end pr-[70px]"> 
            <h2 
              className="font-black uppercase tracking-tight leading-none mb-1.5" 
              style={{ fontSize: '22px', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {user.name}
            </h2>
            <p className="font-bold tracking-wide mb-2" style={{ fontSize: '13px', color: '#86efac' }}>
              {user.phone}
            </p>
            <p className="font-medium leading-[1.3] max-w-[100%]" style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.85)' }}>
              कार्यालय: हम बदलेंगे भवन, 02 मिशन कंपाउंड, अजमेर पुलिया, जयपुर, राजस्थान
            </p>
          </div>
        </div>

        {/* --- OFFICIAL FOOTER BAR (ID Strip) --- */}
        <div 
          className="w-full px-5 py-2.5 relative z-10 flex items-center justify-between shrink-0"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.18)', // Dark contrast strip
            backdropFilter: 'blur(4px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <p className="font-bold tracking-widest uppercase" style={{ fontSize: '12px', color: '#ffffff' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', marginRight: '6px' }}>ID:</span> 
            {user.memberId}
          </p>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button 
        onClick={downloadCard} 
        className="flex items-center gap-2 bg-[#F0FDF4] text-[#04330B] border border-[#22C55E] font-bold px-6 py-2.5 rounded-xl hover:bg-[#DCFCE7] transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        Download ID Card
      </button>
    </div>
  );
}
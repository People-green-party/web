import React, { useRef } from 'react';
import { User } from 'lucide-react';
import { toPng } from 'html-to-image'; 

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

  const getPhotoUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace(/\/v1\/?$/, '');
    return `${baseUrl}${url}`;
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const originalCssRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules');
      if (originalCssRules) {
        Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
          get() {
            try { return originalCssRules.get?.call(this) || []; } catch (e) { return[]; }
          },
          configurable: true
        });
      }

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, 
        style: { transform: 'scale(1)' } 
      });

      if (originalCssRules) {
        Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', originalCssRules);
      }

      const link = document.createElement('a');
      link.download = `PGP-Union-ID-${user.name || 'Member'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try taking a screenshot.');
    }
  };

  // SMART UNION NAME LOGIC
  // We trim it to prevent space errors from the DB
  const rawUnion = (user.unionName || '').trim();
  const isSpecificUnion = rawUnion.length > 0 && !['अन्य', 'पीपल्स ग्रीन असंगठित श्रमिक यूनियन'].includes(rawUnion);
  
  // If we must use the generic name, we use \n to force a clean 2-line split instead of a messy 4-line wrap
  const mainTitle = isSpecificUnion ? rawUnion : 'पीपल्स ग्रीन असंगठित\nश्रमिक यूनियन';
  const subTitle = isSpecificUnion ? 'पीपल्स ग्रीन असंगठित श्रमिक यूनियन' : '';

  return (
    <div className="flex flex-col items-center w-full">
      {/* THE ACTUAL ID CARD UI */}
      <div
        ref={cardRef}
        className="w-full max-w-[440px] rounded-[18px] overflow-hidden mb-6 relative select-none"
        style={{
          aspectRatio: '1.586 / 1', 
          background: 'linear-gradient(135deg, #0B4523 0%, #062812 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 pointer-events-none bg-white/5" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-16 -mb-16 pointer-events-none bg-white/5" />

        {/* --- TOP LEFT: LOGO --- */}
        <div className="absolute top-5 left-5 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
          <img src="/PGPlogo.svg" alt="PGP Logo" className="w-full h-full object-contain" crossOrigin="anonymous" />
        </div>

        {/* --- TOP MIDDLE: UNION TITLES --- */}
        <div className="absolute top-5 left-[90px] sm:left-[100px] right-[90px] sm:right-[105px]">
          <h1 className="text-white font-black text-[16px] sm:text-[20px] leading-[1.15] drop-shadow-md whitespace-pre-wrap">
            {mainTitle}
          </h1>
          {subTitle && (
            <p className="text-white/80 font-bold text-[10px] sm:text-[11px] mt-1 leading-tight">
              {subTitle}
            </p>
          )}
        </div>

        {/* --- TOP RIGHT: PHOTO --- */}
        <div 
          className="absolute top-5 right-5 w-[75px] h-[95px] sm:w-[85px] sm:h-[110px] rounded-lg flex items-center justify-center overflow-hidden shadow-lg"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '2px solid rgba(255, 255, 255, 0.3)' }}
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

        {/* --- BOTTOM LEFT: USER DETAILS --- */}
        <div className="absolute bottom-5 left-5 right-[100px]">
          <h2 className="font-black uppercase tracking-tight leading-none text-[22px] sm:text-[26px] text-white drop-shadow-md truncate">
            {user.name}
          </h2>
          <p className="font-bold mt-1 text-[15px] sm:text-[17px] text-[#86efac]">
            {user.phone}
          </p>
          <p className="font-medium mt-1.5 text-[9px] sm:text-[11px] text-white/90 leading-[1.3] max-w-[90%]">
            कार्यालय: हम बदलेंगे भवन, 02 मिशन कंपाउंड, अजमेर पुलिया, जयपुर, राजस्थान
          </p>
        </div>

        {/* --- BOTTOM RIGHT: MEMBER ID --- */}
        <div className="absolute bottom-5 right-5 text-right">
          <p className="font-bold tracking-widest uppercase text-[10px] sm:text-[11px] text-white/50">
            {user.memberId ? `ID: ${user.memberId}` : ''}
          </p>
        </div>
      </div>

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
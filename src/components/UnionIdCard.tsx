import React, { useRef, useEffect, useState } from 'react';
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
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (measureRef.current) {
        const containerWidth = measureRef.current.offsetWidth;
        const targetWidth = 600; 
        
        if (containerWidth > 0 && containerWidth < targetWidth) {
          setScale(containerWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    setTimeout(updateScale, 10);
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  },[]);

  const getPhotoUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    
    let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';
    
    // Remove /v1 suffix if present
    baseUrl = baseUrl.replace(/\/v1\/?$/, '');
    return `${baseUrl}${url}`;
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, 
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
        width: 600,
        height: 378
      });

      const link = document.createElement('a');
      link.download = `PGP-Union-ID-${user.name || 'Member'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try taking a screenshot.');
    }
  };

  // --- Title Text Logic ---
  const rawUnion = (user.unionName || '').trim();
  const isSpecificUnion = rawUnion.length > 0 && !['अन्य', 'पीपल्स ग्रीन असंगठित श्रमिक यूनियन'].includes(rawUnion);
  
  // Removed \n so everything strictly sits on one line
  const mainTitle = isSpecificUnion ? rawUnion : 'पीपल्स ग्रीन असंगठित श्रमिक यूनियन';
  const subTitle = isSpecificUnion ? 'पीपल्स ग्रीन असंगठित श्रमिक यूनियन' : '';

  // Calculate dynamic font size based on string length to guarantee it fits on 1 line
  let titleFontSize = '28px';
  if (mainTitle.length > 32) titleFontSize = '18px';
  else if (mainTitle.length > 25) titleFontSize = '20px';
  else if (mainTitle.length > 18) titleFontSize = '24px';

  return (
    <div className="flex flex-col w-full items-center">
      
      <div ref={measureRef} className="w-full flex justify-center mb-6">
        
        <div 
          style={{ 
            width: `${600 * scale}px`, 
            height: `${378 * scale}px`,
            position: 'relative'
          }}
        >
          <div
            ref={cardRef}
            className="absolute top-0 left-0 overflow-hidden shrink-0 select-none"
            style={{
              width: '600px',
              height: '378px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #0B4523 0%, #062812 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Background graphics */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full -mr-24 -mt-24 pointer-events-none bg-white/5" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full -ml-20 -mb-20 pointer-events-none bg-white/5" />

            {/* Top Left: Logo */}
            <div className="absolute top-8 left-8 w-[95px] h-[95px] bg-white rounded-[18px] flex items-center justify-center p-2 shadow-lg">
              <img src="/PGPlogo.svg" alt="PGP Logo" className="w-full h-full object-contain" crossOrigin="anonymous" />
            </div>

            {/* Top Middle: Union Titles */}
            {/* Added right-[150px] to ensure text never touches the right-side photo */}
            <div className="absolute top-8 left-[135px] right-[150px] flex flex-col justify-center min-h-[95px]">
              <h1 
                className="text-white font-black drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ fontSize: titleFontSize, lineHeight: '1.2' }}
              >
                {mainTitle}
              </h1>
              {subTitle && (
                <p className="text-white/80 font-bold text-[13px] mt-1.5 leading-tight truncate">
                  {subTitle}
                </p>
              )}
            </div>

            {/* Top Right: Photo */}
            <div 
              className="absolute top-8 right-8 w-[110px] h-[140px] rounded-[14px] flex items-center justify-center overflow-hidden shadow-lg bg-black/20"
              style={{ border: '2px solid rgba(255, 255, 255, 0.3)' }}
            >
              {user.photoUrl ? (
                <img
                  src={getPhotoUrl(user.photoUrl)!}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <User size={50} color="rgba(255, 255, 255, 0.6)" />
              )}
            </div>

            {/* Bottom Left: User Details */}
            <div className="absolute bottom-8 left-8 right-[140px]">
              <h2 className="font-black uppercase tracking-tight leading-none text-[34px] text-white drop-shadow-md truncate">
                {user.name}
              </h2>
              <p className="font-bold mt-2 text-[22px] text-[#86efac]">
                {user.phone}
              </p>
              <p className="font-medium mt-3 text-[14px] text-white/90 leading-[1.4] max-w-[90%]">
                कार्यालय: हम बदलेंगे भवन, 02 मिशन कंपाउंड, अजमेर पुलिया, जयपुर, राजस्थान
              </p>
            </div>

            {/* Bottom Right: Member ID */}
            <div className="absolute bottom-8 right-8 text-right">
              <p className="font-bold tracking-widest uppercase text-[14px] text-white/50">
                {user.memberId ? `ID: ${user.memberId}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={downloadCard} 
        className="flex items-center gap-2 bg-[#F0FDF4] text-[#04330B] border border-[#22C55E] font-bold px-6 py-2.5 rounded-xl hover:bg-[#DCFCE7] transition-colors shadow-sm z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
        Download ID Card
      </button>
    </div>
  );
}
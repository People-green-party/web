"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { ArrowRight, Info } from 'lucide-react';

export const FloatingBrandingBanner = () => {
    const { language, t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-[800px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="relative group">
                {/* Glow Effect behind the banner */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#10B981] via-[#0D5229] to-[#E85C2F] rounded-[24px] blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                <div className="relative bg-[#04330B]/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-4 lg:p-6 flex flex-col md:flex-row items-center gap-4 lg:gap-8 shadow-2xl">

                    {/* Glowing Logo Section - Inspired by the reference image */}
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-blue-400/30 blur-xl rounded-full animate-pulse" />
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                            <img
                                src="/PGPlogo.svg"
                                alt="PGP"
                                className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-white font-bold text-lg lg:text-xl mb-1 flex items-center justify-center md:justify-start gap-2">
                            {language === 'hi' ? 'भारतीय पीपुल्स ग्रीन पार्टी' : "Bharatiya People's Green Party"}
                            <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
                        </h4>
                        <p className="text-white/70 text-sm lg:text-base leading-snug font-medium">
                            {language === 'hi'
                                ? "स्वच्छ राजनीति और हरित राजस्थान के लिए एक नया संकल्प। हम बदलेंगे राजस्थान!"
                                : "A new resolve for clean politics and a green Rajasthan. We will change Rajasthan!"}
                        </p>
                    </div>

                    {/* Action Button */}
                    <Link
                        href="/join"
                        className="shrink-0 px-6 py-3 bg-[#E85C2F] hover:bg-[#ff6b3d] text-white rounded-full font-bold text-sm tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(232,92,47,0.4)] flex items-center gap-2"
                    >
                        {language === 'hi' ? 'अभी जुड़ें' : 'Join Now'} <ArrowRight size={18} />
                    </Link>

                    {/* Close/Dismiss Button (Optional, but good for UX) */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                        <span className="text-xs">×</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

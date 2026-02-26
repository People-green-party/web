"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Droplets, BookOpen, Tractor, Zap, ArrowRight } from 'lucide-react';

export const SynergyEngine = ({ language }: { language: string }) => {
    const [activePillar, setActivePillar] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const totalHeight = containerRef.current.offsetHeight - window.innerHeight;

            // 0 से 1 के बीच स्क्रॉल प्रोग्रेस निकाल रहे हैं
            const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 1);

            // 5 phases: 0 (Default), 1 (Water), 2 (Energy), 3 (Farming), 4 (Skills)
            // Balanced timing for mobile and desktop
            if (progress < 0.08) setActivePillar(0);
            else if (progress < 0.28) setActivePillar(1);
            else if (progress < 0.48) setActivePillar(2);
            else if (progress < 0.68) setActivePillar(3);
            else setActivePillar(4);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const translations: any = {
        en: {
            tag: "The Synergy Engine",
            title: "A Future Built on",
            highlight: "Seamless Connection.",
            defaultTitle: "The Green Engine",
            defaultDesc: "Scroll down to see how our green model connects everything. From energy to farming, we create a circle of prosperity for all.",
            impactTarget: "Impact Target",
            planBtn: "Plan",
            pillars: [
                { id: 1, title: "Jal Swaraj", label: "WATER", desc: "Traditional wisdom meets modern tech. Restoring Rajasthan's ancient aquifers.", stats: "2,000+ Wells" },
                { id: 2, title: "Solar Revolution", label: "ENERGY", desc: "Turning our desert sun into gold. Every household a producer, not just a consumer.", stats: "10GW Potential" },
                { id: 3, title: "Eco-Agriculture", label: "FARMING", desc: "Chemical-free, high-yield farming. Putting dignity and profit back into the pocket.", stats: "1M+ Acres" },
                { id: 4, title: "Green Education", label: "SKILLS", desc: "Preparing our youth for the green economy. Jobs that don't just pay, but do good.", stats: "500 Skill Hubs" }
            ]
        },
        hi: {
            tag: "द सिनर्जी इंजन",
            title: "निर्बाध जुड़ाव पर बना",
            highlight: "भविष्य",
            defaultTitle: "ग्रीन इंजन",
            defaultDesc: "नीचे स्क्रॉल करें और देखें कि हमारा हरित मॉडल सब कुछ कैसे जोड़ता है। ऊर्जा से लेकर खेती तक, समृद्धि का एक चक्र।",
            impactTarget: "प्रभाव लक्ष्य",
            planBtn: "योजना",
            pillars: [
                { id: 1, title: "जल स्वराज", label: "जल", desc: "स्थायी जल सुरक्षा के लिए राजस्थान के प्राचीन जलभृतों को बहाल करना।", stats: "2,000+ कुएं" },
                { id: 2, title: "सौर क्रांति", label: "ऊर्जा", desc: "रेगिस्तानी सूरज को सोने में बदलना। हर घर एक उत्पादक।", stats: "10GW क्षमता" },
                { id: 3, title: "पारिस्थितिक कृषि", label: "खेती", desc: "रसायन मुक्त, उच्च उपज वाली खेती। किसान के सम्मान को वापस लाना।", stats: "1M+ एकड़" },
                { id: 4, title: "हरित शिक्षा", label: "कौशल", desc: "हरित अर्थव्यवस्था के लिए युवाओं को तैयार करना।", stats: "500 केंद्र" }
            ]
        }
    };

    const t = translations[language] || translations.en;
    const pillarIcons = [Droplets, Sun, Tractor, BookOpen];
    const pillarColors = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];

    return (
        /* Increased mobile height to 140vh to prevent content cut-off */
        <section ref={containerRef} className="relative z-0 h-[140vh] md:h-[110vh] bg-white m-0 p-0">

            {/* STICKY CONTENT: Pins to the screen. Added padding-top on mobile to avoid overlap with previous section */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pt-12 md:pt-0">


                <div className="container mx-auto px-6 lg:px-16 relative z-10">

                    {/* Header: Fades out when pillars start */}
                    <div className={`text-center mb-10 transition-all duration-700 ${activePillar > 0 ? 'opacity-0 -translate-y-10 scale-90 pointer-events-none' : 'opacity-100'}`}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0D5229]/10 bg-[#EAF7EE] mb-4">
                            <Zap size={14} className="text-[#10B981]" />
                            <span className="text-[#587E67] text-[10px] font-bold uppercase tracking-widest">{t.tag}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-[#04330B] tracking-tighter leading-tight">
                            {t.title} <span className="text-[#10B981]">{t.highlight}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* LEFT: Morphing Graphic (Diamond Design) */}
                        <div className="relative flex items-center justify-center">
                            <div className="relative w-72 h-72 md:w-96 md:h-96">
                                {/* Aura Light */}
                                <div className="absolute inset-0 blur-[100px] opacity-20 transition-colors duration-1000"
                                    style={{ backgroundColor: activePillar > 0 ? pillarColors[activePillar - 1] : '#10B981' }} />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* The Rotating Diamond Frame */}
                                    <div className={`relative w-56 h-56 md:w-64 md:h-64 transition-all duration-1000 ease-in-out border-2 border-[#0D5229]/10 rounded-[48px] flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-sm
                                        ${activePillar === 0 ? 'rotate-0' : 'rotate-45 scale-110'}`}>

                                        <div className={`transition-all duration-500 ${activePillar > 0 ? '-rotate-45' : ''}`}>
                                            {activePillar === 0 ? (
                                                <img src="/PGPlogo.svg" className="w-20 h-20 opacity-90" alt="Logo" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    {React.createElement(pillarIcons[activePillar - 1], {
                                                        size: 56,
                                                        style: { color: pillarColors[activePillar - 1] }
                                                    })}
                                                    <span className="text-[10px] font-black tracking-[0.3em] text-[#04330B]">{t.pillars[activePillar - 1].label}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Text Content (Slide Up/Down like Sarvam AI) */}
                        <div className="relative h-[300px] flex items-center">
                            {/* Default State */}
                            <div className={`absolute w-full transition-all duration-700
                                ${activePillar === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16 pointer-events-none'}`}>
                                <h3 className="text-3xl lg:text-5xl font-bold text-[#04330B] mb-6 leading-tight">
                                    {t.defaultTitle}
                                </h3>
                                <p className="text-[#587E67] text-lg lg:text-xl leading-relaxed">
                                    {t.defaultDesc}
                                </p>
                            </div>

                            {/* Pillars Content */}
                            {t.pillars.map((pillar: any, i: number) => (
                                <div key={pillar.id} className={`absolute w-full transition-all duration-700
                                    ${activePillar === pillar.id ? 'opacity-100 translate-y-0' :
                                        activePillar > pillar.id ? 'opacity-0 -translate-y-16' : 'opacity-0 translate-y-16 pointer-events-none'}`}>
                                    <div className="flex flex-col gap-5">
                                        <div className="inline-block self-start px-3 py-1 rounded-md text-[10px] font-black tracking-widest bg-white shadow-sm border"
                                            style={{ color: pillarColors[i], borderColor: `${pillarColors[i]}30` }}>
                                            {pillar.label}
                                        </div>
                                        <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[#04330B]">{pillar.title}</h3>
                                        <p className="text-[#587E67] text-sm md:text-lg lg:text-xl leading-snug">{pillar.desc}</p>

                                        <div className="flex items-center gap-4 mt-2 lg:mt-4">
                                            <div className="bg-[#F8FBF9] p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#0D5229]/5 flex-1 max-w-[180px] md:max-w-[200px]">
                                                <p className="text-[10px] font-bold text-[#587E67] uppercase mb-1">{t.impactTarget}</p>
                                                <p className="text-2xl font-bold" style={{ color: pillarColors[i] }}>{pillar.stats}</p>
                                            </div>
                                            <button className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#04330B] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                                                <ArrowRight size={22} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
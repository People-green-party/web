"use client";

import React, { useState } from 'react';
import { Sun, Droplets, BookOpen, Tractor, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const SynergyEngine = ({ language }: { language: string }) => {
    const [activePillar, setActivePillar] = useState<number | null>(null);

    const translations: any = {
        en: {
            tag: "The Synergy Engine",
            title: "A Future Built on",
            highlight: "Seamless Connection.",
            sub: "PGP's policies aren't isolated. They are a self-sustaining ecosystem where one's success powers the next.",
            defaultTitle: "The Green Engine",
            defaultDesc: "Click or hover over the engine nodes to see how our green model connects everything. From energy to farming, we create a circle of prosperity for all.",
            verified: "Verified Green Policy Framework",
            impactTarget: "Impact Target",
            planBtn: "Plan",
            pillars: [
                {
                    id: 1,
                    title: "Jal Swaraj",
                    label: "WATER",
                    desc: "Traditional wisdom meets modern tech. Restoring Rajasthan's ancient aquifers for permanent water security.",
                    stats: "2,000+ Wells Rejuvenated"
                },
                {
                    id: 2,
                    title: "Solar Revolution",
                    label: "ENERGY",
                    desc: "Turning our desert sun into gold. Every household a producer, not just a consumer.",
                    stats: "10GW Clean Potential"
                },
                {
                    id: 3,
                    title: "Eco-Agriculture",
                    label: "FARMING",
                    desc: "Chemical-free, high-yield farming. Putting dignity and profit back into the farmer's pocket.",
                    stats: "1M+ Organic Acres"
                },
                {
                    id: 4,
                    title: "Green Education",
                    label: "SKILLS",
                    desc: "Preparing our youth for the green economy. Jobs that don't just pay well, but do good.",
                    stats: "500 Skill Hubs"
                }
            ]
        },
        hi: {
            tag: "द सिनर्जी इंजन",
            title: "निर्बाध जुड़ाव पर बना",
            highlight: "भविष्य",
            sub: "पी.जी.पी. की नीतियां अलग-थलग नहीं हैं। वे एक स्व-sustaining पारिस्थितिकी तंत्र हैं जहां एक की सफलता दूसरे को शक्ति प्रदान करती है।",
            defaultTitle: "ग्रीन इंजन",
            defaultDesc: "यह देखने के लिए कि हमारा हरित मॉडल सब कुछ कैसे जोड़ता है, इंजन नोड्स पर क्लिक करें या होवर करें। ऊर्जा से लेकर खेती तक, हम सभी के लिए समृद्धि का एक चक्र बनाते हैं।",
            verified: "सत्यापित हरित नीति ढांचा",
            impactTarget: "प्रभाव लक्ष्य",
            planBtn: "योजना",
            pillars: [
                {
                    id: 1,
                    title: "जल स्वराज",
                    label: "जल",
                    desc: "पारंपरिक ज्ञान आधुनिक तकनीक से मिलता है। स्थायी जल सुरक्षा के लिए राजस्थान के प्राचीन जलभृतों को बहाल करना।",
                    stats: "2,000+ कुएं पुनर्जीवित"
                },
                {
                    id: 2,
                    title: "सौर क्रांति",
                    label: "ऊर्जा",
                    desc: "हमारे रेगिस्तानी सूरज को सोने में बदलना। हर घर एक उत्पादक, सिर्फ उपभोक्ता नहीं।",
                    stats: "10GW स्वच्छ क्षमता"
                },
                {
                    id: 3,
                    title: "पारिस्थितिक कृषि",
                    label: "खेती",
                    desc: "रसायन मुक्त, उच्च उपज वाली खेती। किसान की जेब में सम्मान और लाभ वापस लाना।",
                    stats: "1M+ जैविक एकड़"
                },
                {
                    id: 4,
                    title: "हरित शिक्षा",
                    label: "कौशल",
                    desc: "हरित अर्थव्यवस्था के लिए हमारे युवाओं को तैयार करना। ऐसी नौकरियां जो न केवल अच्छा भुगतान करती हैं, बल्कि अच्छा करती हैं।",
                    stats: "500 कौशल केंद्र"
                }
            ]
        }
    };

    const t = translations[language] || translations.en;

    const pillarIcons = [Droplets, Sun, Tractor, BookOpen];
    const pillarColors = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];
    const pillarGlows = [
        "rgba(59, 130, 246, 0.2)",
        "rgba(245, 158, 11, 0.2)",
        "rgba(16, 185, 129, 0.2)",
        "rgba(139, 92, 246, 0.2)"
    ];

    return (
        <section className="py-[120px] lg:py-[200px] bg-white relative overflow-hidden flex justify-center">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#0D522915 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-[1320px] px-4 lg:px-8 relative z-10">

                <div className="flex flex-col items-center mb-24 text-center">
                    <ScrollReveal animation="fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0D5229]/10 bg-[#EAF7EE] mb-6">
                            <Zap size={14} className="text-[#10B981] animate-pulse" />
                            <span className="text-[#587E67] text-[10px] font-bold uppercase tracking-[0.3em]">{t.tag}</span>
                        </div>
                        <h2 className="text-[40px] md:text-[60px] lg:text-[72px] font-bold text-[#04330B] tracking-tighter leading-[1.1] mb-8">
                            {t.title} <br />
                            <span className="text-[#04330B]">{t.highlight}</span>
                        </h2>
                        <p className="text-[#587E67] text-lg lg:text-xl max-w-[700px] mx-auto font-medium">
                            {t.sub}
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Engine Part */}
                    <div className="relative aspect-square max-w-[500px] mx-auto w-full">
                        {/* Central Core */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border border-[#0D5229]/10 shadow-[0_0_50px_rgba(13,82,41,0.05)] flex items-center justify-center z-20 overflow-hidden group">
                            <div className={`absolute inset-0 transition-all duration-700 opacity-10 blur-2xl
                            ${activePillar ? 'scale-150' : 'scale-100'}`}
                                style={{ backgroundColor: activePillar ? pillarColors[activePillar - 1] : '#10B981' }} />
                            <img src="/PGPlogo.svg" className="w-20 h-20 relative z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]" alt="PGP" />
                        </div>

                        {/* Orbiting Elements */}
                        {t.pillars.map((pillar: any, i: number) => {
                            const angles = [225, 315, 45, 135]; // Positioning
                            const angle = angles[i];
                            const isActive = activePillar === pillar.id;
                            const Icon = pillarIcons[i];
                            const color = pillarColors[i];
                            const glow = pillarGlows[i];

                            return (
                                <div
                                    key={pillar.id}
                                    onMouseEnter={() => setActivePillar(pillar.id)}
                                    className="absolute transition-all duration-500 cursor-pointer group"
                                    style={{
                                        top: `${50 + 35 * Math.sin(angle * (Math.PI / 180))}%`,
                                        left: `${50 + 35 * Math.cos(angle * (Math.PI / 180))}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {/* Connection Line (Animated SVG) */}
                                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none overflow-visible">
                                        <line
                                            x1="200" y1="200"
                                            x2={200 - 200 * Math.cos(angle * (Math.PI / 180))}
                                            y2={200 - 200 * Math.sin(angle * (Math.PI / 180))}
                                            stroke={isActive ? color : "#0D5229"}
                                            strokeWidth={isActive ? "2" : "1"}
                                            strokeDasharray="5,5"
                                            className="transition-all duration-700"
                                            style={{
                                                opacity: isActive ? 1 : 0.1,
                                            }}
                                        />
                                    </svg>

                                    {/* Pillar Icon Node */}
                                    <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center border transition-all duration-500
                                        ${isActive ? 'bg-white border-white scale-110 shadow-xl' : 'bg-[#F8FBF9] border-[#0D5229]/5 hover:border-[#0D5229]/20'}`}
                                        style={{ boxShadow: isActive ? `0 10px 40px ${glow}` : 'none' }}
                                    >
                                        <Icon size={32} style={{ color: isActive ? color : '#587E6750' }} />
                                        <span className={`text-[9px] font-bold tracking-widest mt-2 ${isActive ? 'text-[#04330B]' : 'text-[#587E67]'}`}>{pillar.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Content Part */}
                    <div className="flex flex-col justify-center">
                        <div className="relative min-h-[350px]">
                            {t.pillars.map((pillar: any, i: number) => {
                                const Icon = pillarIcons[i];
                                const color = pillarColors[i];

                                return (
                                    <div
                                        key={pillar.id}
                                        onMouseEnter={() => setActivePillar(pillar.id)}
                                        className={`absolute inset-0 transition-all duration-700 flex flex-col justify-center
                                            ${activePillar === pillar.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color: color }}>
                                                <Icon size={24} />
                                            </div>
                                            <h3 className="text-3xl lg:text-4xl font-bold text-[#04330B] capitalize">{pillar.title}</h3>
                                        </div>
                                        <p className="text-[#587E67] text-lg lg:text-xl leading-relaxed mb-8">
                                            {pillar.desc}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#F8FBF9] border border-[#0D5229]/5 p-5 rounded-2xl">
                                                <p className="text-[#587E67] text-xs font-bold uppercase tracking-widest mb-2">{t.impactTarget}</p>
                                                <p className="text-2xl font-bold" style={{ color: color }}>{pillar.stats}</p>
                                            </div>
                                            <div className="bg-[#04330B] p-5 rounded-2xl flex items-center justify-center group cursor-pointer hover:bg-[#0D5229] transition-colors">
                                                <button className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-widest">
                                                    {t.planBtn} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Default State Content */}
                            <div className={`absolute inset-0 transition-all duration-700 flex flex-col justify-center
                                ${activePillar === null ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                                <h3 className="text-3xl lg:text-4xl font-bold text-[#04330B] mb-6 flex items-center gap-3">
                                    {t.defaultTitle} <ArrowRight size={24} className="animate-bounce-x" />
                                </h3>
                                <p className="text-[#587E67] text-lg lg:text-xl leading-relaxed">
                                    {t.defaultDesc}
                                </p>
                                <div className="mt-10 flex items-center gap-2 text-[#0D5229]/20">
                                    <ShieldCheck size={20} />
                                    <span className="text-xs font-bold tracking-[0.2em] uppercase">{t.verified}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

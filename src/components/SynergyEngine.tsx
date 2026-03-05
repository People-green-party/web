"use client";

import React, { useState, useRef } from 'react';
import { Sun, Droplets, BookOpen, Tractor, Zap, ArrowRight, LucideIcon } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const SynergyCard = React.memo(({ item, i, scrollYProgress, activeIndex, pillarColors, t }: any) => {
    // The scroll location where this card should be exactly at 0px and fully opaque
    const centerPoint = i * 0.25;

    // The exact window size where the animation happens
    const duration = 0.15;

    const enterStartPos = Math.max(0, centerPoint - duration);
    const leaveEndPos = Math.min(1, centerPoint + duration);

    const mappingPoints = [enterStartPos, centerPoint, leaveEndPos];

    let yArray = [400, 0, -60];
    let scaleArray = [1, 1, 0.94];
    let opacityArray = [0.0, 1, 0.0];

    if (i === 0) {
        yArray = [0, 0, -60];
        scaleArray = [1, 1, 0.94];
        opacityArray = [1, 1, 0.0];
    }

    if (i === 4) { // items.length - 1 is 4
        yArray = [400, 0, 0];
        scaleArray = [1, 1, 1];
        opacityArray = [0.0, 1, 1];
    }

    const y = useTransform(scrollYProgress, mappingPoints, yArray, {
        clamp: true,
        ease: (t) => 1 - Math.pow(1 - t, 3)
    });

    const scale = useTransform(scrollYProgress, mappingPoints, scaleArray, {
        clamp: true,
        ease: (t) => 1 - Math.pow(1 - t, 3)
    });

    const opacity = useTransform(scrollYProgress, mappingPoints, opacityArray, {
        clamp: true,
        ease: (t) => 1 - Math.pow(1 - t, 2)
    });

    return (
        <motion.div
            style={{
                y,
                scale,
                opacity,
                zIndex: i,
                willChange: "transform, opacity",
                transform: "translateZ(0)"
            }}
            className="absolute top-0 left-0 w-full h-[320px] md:h-[400px] bg-white p-6 md:p-10 rounded-[28px] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.08)] border border-[#EAF7EE] flex flex-col justify-center origin-top overflow-hidden"
        >
            {item.isDefault ? (
                <div className="flex flex-col gap-4">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#04330B] leading-tight">
                        {item.title}
                    </h3>
                    <p className="text-[#587E67] text-base md:text-lg lg:text-xl leading-relaxed">
                        {item.desc}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3 md:gap-5 justify-between h-full">
                    <div>
                        <div className="inline-block self-start px-3 py-1.5 rounded-md text-[10px] md:text-[11px] font-black tracking-widest bg-white shadow-sm border mb-4 md:mb-6 mt-2"
                            style={{ color: pillarColors[i - 1], borderColor: `${pillarColors[i - 1]}30`, backgroundColor: `${pillarColors[i - 1]}05` }}>
                            {item.label}
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#04330B] mb-2">{item.title}</h3>
                        <p className="text-[#587E67] text-sm md:text-base lg:text-lg leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pb-2">
                        <div className="bg-[#F8FBF9] p-4 md:p-5 rounded-2xl border border-[#0D5229]/5 flex-1 max-w-[220px]">
                            <p className="text-[10px] md:text-[11px] font-bold text-[#587E67]/70 uppercase mb-1 tracking-wider">{t.impactTarget}</p>
                            <p className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: pillarColors[i - 1] }}>{item.stats}</p>
                        </div>
                        <button className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-[#04330B] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl shrink-0 group">
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
});

SynergyCard.displayName = "SynergyCard";

export const SynergyEngine = ({ language }: { language: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [activeIndex, setActiveIndex] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const index = Math.min(4, Math.max(0, Math.round(latest * 4)));
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    });

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
    const pillarIcons: LucideIcon[] = [Droplets, Sun, Tractor, BookOpen];
    const pillarColors = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];

    const items = [
        {
            id: 0,
            isDefault: true,
            title: t.defaultTitle,
            desc: t.defaultDesc,
        },
        ...t.pillars.map((p: any) => ({ ...p, isDefault: false }))
    ];

    return (
        <section ref={containerRef} className="relative z-0 h-[400vh] bg-white my-[60px] lg:my-[100px]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-6 lg:px-16 relative z-10 flex flex-col items-center">

                    <div className={`text-center mb-8 md:mb-16 transition-all duration-700 ease-out ${activeIndex > 0 ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0D5229]/10 bg-[#EAF7EE] mb-4">
                            <Zap size={14} className="text-[#10B981]" />
                            <span className="text-[#587E67] text-[10px] font-bold uppercase tracking-widest">{t.tag}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#04330B] tracking-tighter leading-tight transition-all duration-700">
                            {t.title} <span className="text-[#10B981]">{t.highlight}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center w-full max-w-6xl">

                        <div className="relative flex items-center justify-center">
                            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]">
                                <div className="absolute inset-0 blur-[60px] opacity-25 transition-colors duration-700 pointer-events-none"
                                    style={{ backgroundColor: activeIndex > 0 ? pillarColors[activeIndex - 1] : '#10B981' }} />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`relative w-48 h-48 md:w-64 md:h-64 lg:w-[320px] lg:h-[320px] transition-all duration-700 border border-[#0D5229]/10 rounded-[40px] flex items-center justify-center bg-white/80 backdrop-blur-md shadow-[0_15px_45px_-10px_rgba(0,0,0,0.08)]
                                        ${activeIndex === 0 ? 'rotate-0' : 'rotate-45'}`}>

                                        <div className={`transition-all duration-700 ${activeIndex > 0 ? '-rotate-45' : ''}`}>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={activeIndex}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="flex flex-col items-center justify-center"
                                                >
                                                    {activeIndex === 0 ? (
                                                        <img src="/PGPlogo.svg" className="w-16 h-16 md:w-24 md:h-24 opacity-90" alt="Logo" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-3 md:gap-4">
                                                            {React.createElement(pillarIcons[activeIndex - 1], {
                                                                size: 56,
                                                                className: "md:w-20 md:h-20 lg:w-24 lg:h-24",
                                                                style: { color: pillarColors[activeIndex - 1] }
                                                            })}
                                                            <span className="text-[12px] md:text-sm font-black tracking-[0.35em] text-[#04330B]">
                                                                {items[activeIndex].label}
                                                            </span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[320px] md:h-[400px] flex items-center w-full">
                            {items.map((item, i) => (
                                <SynergyCard
                                    key={item.id}
                                    item={item}
                                    i={i}
                                    scrollYProgress={scrollYProgress}
                                    activeIndex={activeIndex}
                                    pillarColors={pillarColors}
                                    t={t}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
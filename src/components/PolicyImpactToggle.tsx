"use client";

import React, { useState } from 'react';
import { Landmark, Trees, Factory, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const PolicyImpactToggle = ({ language }: { language: string }) => {
    const [isPGPActive, setIsPGPActive] = useState(false);

    const translations: any = {
        en: {
            title: "The Power of",
            highlight: "Political Choice",
            switchPgp: "PGP GREEN MODEL",
            switchOld: "STATUS QUO",
            currentSystem: "CURRENT SYSTEM",
            greenEra: "GREEN ERA",
            quote: '"Real data, real stories, real transformation. PGP doesn\'t just promise—we re-engineer the system for a flourishing Rajasthan."',
            categories: {
                governance: {
                    name: "Governance",
                    pgpLabel: "Transparent & Direct",
                    oldLabel: "Bureaucratic & Opaque",
                    stats: ["Corruption Index", "Public Grievances"]
                },
                ecology: {
                    name: "Ecology",
                    pgpLabel: "Eco-Regenerative",
                    oldLabel: "Resource Depleting",
                    stats: ["Green Cover Growth", "Water Level (Avg)"]
                },
                economy: {
                    name: "Economy",
                    pgpLabel: "Decentralized Wealth",
                    oldLabel: "Centralized Control",
                    stats: ["Village GDP Growth", "Jobs Ratio"]
                }
            }
        },
        hi: {
            title: "राजनीतिक पसंद की",
            highlight: "शक्ति",
            switchPgp: "पी.जी.पी. ग्रीन मॉडल",
            switchOld: "यथास्थिति",
            currentSystem: "पुराना सिस्टम",
            greenEra: "हरित युग",
            quote: '"वास्तविक डेटा, वास्तविक कहानियाँ, वास्तविक परिवर्तन। पी.जी.पी. केवल वादा नहीं करती—हम एक समृद्ध राजस्थान के लिए व्यवस्था को फिर से इंजीनियर करते हैं।"',
            categories: {
                governance: {
                    name: "शासन",
                    pgpLabel: "पारदर्शी और सीधा",
                    oldLabel: "नौकरशाही और अपारदर्शी",
                    stats: ["भ्रष्टाचार सूचकांक", "जन शिकायतें"]
                },
                ecology: {
                    name: "पारिस्थितिकी",
                    pgpLabel: "पारिस्थितिक-पुनर्योजी",
                    oldLabel: "संसाधन क्षयकारी",
                    stats: ["हरित आवरण वृद्धि", "जल स्तर (औसत)"]
                },
                economy: {
                    name: "अर्थव्यवस्था",
                    pgpLabel: "विकेंद्रीकृत धन",
                    oldLabel: "केंद्रीकृत नियंत्रण",
                    stats: ["ग्राम जीडीपी वृद्धि", "नौकरी अनुपात"]
                }
            }
        }
    };

    const t = translations[language] || translations.en;

    const data = [
        {
            id: 'governance',
            icon: Landmark,
            label: isPGPActive ? t.categories.governance.pgpLabel : t.categories.governance.oldLabel,
            stats: [
                { label: t.categories.governance.stats[0], value: isPGPActive ? "0.2%" : "68%", trend: isPGPActive ? "down" : "up", color: isPGPActive ? "#10B981" : "#EF4444" },
                { label: t.categories.governance.stats[1], value: isPGPActive ? "99.4%" : "12.5%", trend: isPGPActive ? "up" : "down", color: isPGPActive ? "#10B981" : "#F59E0B" }
            ]
        },
        {
            id: 'ecology',
            icon: Trees,
            label: isPGPActive ? t.categories.ecology.pgpLabel : t.categories.ecology.oldLabel,
            stats: [
                { label: t.categories.ecology.stats[0], value: isPGPActive ? "+24%" : "-8.2%", trend: isPGPActive ? "up" : "down", color: isPGPActive ? "#10B981" : "#EF4444" },
                { label: t.categories.ecology.stats[1], value: isPGPActive ? "+12m" : "-4m", trend: isPGPActive ? "up" : "down", color: isPGPActive ? "#10B981" : "#3B82F6" }
            ]
        },
        {
            id: 'economy',
            icon: Factory,
            label: isPGPActive ? t.categories.economy.pgpLabel : t.categories.economy.oldLabel,
            stats: [
                { label: t.categories.economy.stats[0], value: isPGPActive ? "18.5%" : "2.1%", trend: isPGPActive ? "up" : "down", color: isPGPActive ? "#10B981" : "#94A3B8" },
                { label: t.categories.economy.stats[1], value: isPGPActive ? "1:4" : "1:450", trend: isPGPActive ? "up" : "down", color: isPGPActive ? "#10B981" : "#F59E0B" }
            ]
        }
    ];

    return (
        <section className="bg-white relative overflow-hidden flex justify-center py-[60px] lg:py-[100px]">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#0D522915 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="w-full max-w-[1320px] px-4 lg:px-8 relative z-10">
                <div className="flex flex-col items-center mb-20 text-center">
                    <ScrollReveal animation="fade-up">
                        <h2 className="text-[40px] md:text-[60px] lg:text-[72px] font-bold text-[#04330B] tracking-tighter leading-[1.1] mb-12">
                            {t.title} <br /> <span className={isPGPActive ? "text-[#10B981]" : "text-[#EF4444]"}>{t.highlight}</span>
                        </h2>

                        {/* The High-Tech Toggle */}
                        <div
                            onClick={() => setIsPGPActive(!isPGPActive)}
                            className="relative w-[300px] md:w-[450px] h-[72px] bg-[#F8FBF9] border border-[#0D5229]/10 rounded-full p-2 cursor-pointer group select-none shadow-sm transition-all hover:shadow-md"
                        >
                            <div className={`absolute top-2 bottom-2 w-[48%] rounded-full transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] flex items-center justify-center font-bold text-sm tracking-widest text-white transition-all
                                ${isPGPActive ? 'left-[50%] bg-[#10B981] shadow-[0_10px_20px_rgba(16,185,129,0.3)]' : 'left-2 bg-[#EF4444] shadow-[0_10px_20px_rgba(239,68,68,0.3)]'}`}>
                                {isPGPActive ? t.switchPgp : t.switchOld}
                            </div>
                            <div className="flex justify-between items-center h-full px-8 text-[#0D5229]/30 text-[10px] font-bold tracking-widest uppercase">
                                <span className={!isPGPActive ? "opacity-0" : "opacity-100 transition-opacity"}>{t.currentSystem}</span>
                                <span className={isPGPActive ? "opacity-0" : "opacity-100 transition-opacity"}>{t.greenEra}</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-3 gap-1.5 md:gap-8">
                    {data.map((item, i) => {
                        const categoryName = t.categories[item.id as keyof typeof t.categories].name;
                        return (
                            <ScrollReveal key={i} animation="fade-up" delay={i * 100} className="w-full">
                                <div className="group relative h-full">
                                    <div className={`absolute -inset-1 rounded-[40px] blur-[15px] opacity-0 transition-opacity duration-700 group-hover:opacity-20
                                        ${isPGPActive ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />

                                    <div className="relative bg-white border border-[#0D5229]/10 p-2.5 md:p-10 rounded-[16px] md:rounded-[40px] h-full flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500">
                                        <div className={`w-8 h-8 md:w-20 md:h-20 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-8 transition-colors duration-700
                                            ${isPGPActive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                                            <item.icon className="w-4 h-4 md:w-9 md:h-9" strokeWidth={1.5} />
                                        </div>

                                        <h3 className="text-[#04330B] text-[10px] md:text-2xl font-bold mb-1 tracking-tight truncate w-full">{categoryName}</h3>
                                        <p className={`font-bold text-[6px] md:text-[10px] uppercase tracking-widest mb-4 md:mb-10 transition-colors duration-700
                                            ${isPGPActive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                            {item.label}
                                        </p>

                                        <div className="w-full space-y-3 md:space-y-8 flex-1">
                                            {item.stats.map((stat, j) => (
                                                <div key={j} className="flex flex-col gap-1 md:gap-3">
                                                    <div className="flex justify-between items-end text-sm">
                                                        <span className="text-[#587E67] font-bold text-[5px] md:text-[10px] uppercase tracking-wider text-left leading-none">{stat.label}</span>
                                                        <span className="font-bold text-[10px] md:text-2xl leading-none" style={{ color: stat.color }}>{stat.value}</span>
                                                    </div>
                                                    <div className="h-0.5 md:h-1.5 w-full bg-[#F8FBF9] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full transition-all duration-1000 ease-out"
                                                            style={{
                                                                width: isPGPActive ? (stat.trend === 'up' ? '90%' : '5%') : (stat.trend === 'up' ? '15%' : '80%'),
                                                                backgroundColor: stat.color
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 md:mt-12">
                                            {isPGPActive ? (
                                                <CheckCircle2 className="w-4 h-4 md:w-8 md:h-8 text-[#10B981] animate-bounce" strokeWidth={1.5} />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 md:w-8 md:h-8 text-[#EF4444] animate-pulse" strokeWidth={1.5} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-[#587E67]/40 font-bold text-[16px] italic max-w-[800px] mx-auto uppercase tracking-wider">
                        {t.quote}
                    </p>
                </div>
            </div>
        </section>
    );
};

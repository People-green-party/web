"use client";

import React, { useState } from 'react';
import {
    Coins,
    Zap,
    Tractor,
    Briefcase,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Info,
    Smartphone
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const ProsperityTracker = ({ language }: { language: string }) => {
    const [selectedRole, setSelectedRole] = useState<string>('Farmer');

    const translations: any = {
        en: {
            tag: "The Prosperity Tracker",
            title: "Calculate Your",
            highlight: "Green Growth",
            sub: "See the direct impact of PGP's re-engineering on your wallet and lifestyle. Select your profile to see the transformation.",
            before: "CURRENT STATUS",
            after: "PGP GREEN ERA",
            impactTitle: "Projected Annual Benefit",
            cta: "Join the Movement",
            roles: {
                Farmer: {
                    name: "Farmer",
                    income: "+ ₹1.2L / Year",
                    points: [
                        "Zero Fertilizer Cost (Organic)",
                        "Solar Energy Sale Income",
                        "Guaranteed MSP (Direct Export)"
                    ],
                    stats: [
                        { label: "Water Usage", val: "-40%", color: "#3B82F6" },
                        { label: "Profit Margin", val: "+250%", color: "#10B981" }
                    ]
                },
                Youth: {
                    name: "Youth",
                    income: "₹45K Avg. Starting",
                    points: [
                        "Village Skill Hub Employment",
                        "Drone/Green Tech Training",
                        "Zero-Interest Startup Capital"
                    ],
                    stats: [
                        { label: "Migration Risk", val: "0%", color: "#EF4444" },
                        { label: "Job Security", val: "High", color: "#10B981" }
                    ]
                },
                Resident: {
                    name: "Resident",
                    income: "₹18K Savings / Year",
                    points: [
                        "Zero Electricity Bill (Solar)",
                        "Clean Air & Water Quality",
                        "Direct Digital Governance"
                    ],
                    stats: [
                        { label: "Power Costs", val: "₹0", color: "#F59E0B" },
                        { label: "Health Index", val: "+35%", color: "#10B981" }
                    ]
                }
            }
        },
        hi: {
            tag: "समृद्धि ट्रैकर",
            title: "अपनी प्रगति का",
            highlight: "हिसाब लगाएं",
            sub: "देखें कि पी.जी.पी. की री-इंजीनियरिंग का आपके वॉलेट और जीवनशैली पर क्या सीधा प्रभाव पड़ता है। परिवर्तन देखने के लिए अपनी प्रोफाइल चुनें।",
            before: "वर्तमान स्थिति",
            after: "पी.जी.पी. हरित युग",
            impactTitle: "अनुमानित वार्षिक लाभ",
            cta: "आंदोलन से जुड़ें",
            roles: {
                Farmer: {
                    name: "किसान",
                    income: "+ ₹1.2L / वर्ष",
                    points: [
                        "शून्य उर्वरक लागत (जैविक)",
                        "सौर ऊर्जा बिक्री से आय",
                        "गारंटीड एमएसपी (प्रत्यक्ष निर्यात)"
                    ],
                    stats: [
                        { label: "पानी का उपयोग", val: "-40%", color: "#3B82F6" },
                        { label: "लाभ मार्जिन", val: "+250%", color: "#10B981" }
                    ]
                },
                Youth: {
                    name: "युवा",
                    income: "₹45K औसत शुरुआत",
                    points: [
                        "ग्राम कौशल केंद्र रोजगार",
                        "ड्रोन/हरित तकनीक प्रशिक्षण",
                        "शून्य ब्याज स्टार्टअप पूंजी"
                    ],
                    stats: [
                        { label: "पलायन जोखिम", val: "0%", color: "#EF4444" },
                        { label: "नौकरी सुरक्षा", val: "उच्च", color: "#10B981" }
                    ]
                },
                Resident: {
                    name: "निवासी",
                    income: "₹18K बचत / वर्ष",
                    points: [
                        "शून्य बिजली बिल (सोलर)",
                        "स्वच्छ हवा और पानी की गुणवत्ता",
                        "प्रत्यक्ष डिजिटल शासन"
                    ],
                    stats: [
                        { label: "बिजली लागत", val: "₹0", color: "#F59E0B" },
                        { label: "स्वास्थ्य सूचकांक", val: "+35%", color: "#10B981" }
                    ]
                }
            }
        }
    };

    const t = translations[language] || translations.en;
    const activeData = t.roles[selectedRole];

    const roleIcons: any = {
        Farmer: Tractor,
        Youth: Briefcase,
        Resident: Zap
    };

    return (
        <section className="py-[120px] lg:py-[200px] bg-white relative overflow-hidden flex justify-center">
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="w-full max-w-[1320px] px-4 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left: Interactive Controls */}
                    <div className="lg:col-span-5">
                        <ScrollReveal animation="slide-right">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0D5229]/10 bg-[#EAF7EE] mb-6">
                                <Coins size={14} className="text-[#10B981]" />
                                <span className="text-[#0D5229]/60 text-[10px] font-bold uppercase tracking-[0.3em]">{t.tag}</span>
                            </div>
                            <h2 className="text-[40px] md:text-[56px] font-bold text-[#04330B] tracking-tighter leading-[1.1] mb-8">
                                {t.title} <br />
                                <span className="text-[#10B981]">{t.highlight}</span>
                            </h2>
                            <p className="text-[#587E67] text-lg font-medium mb-12 max-w-[400px]">
                                {t.sub}
                            </p>

                            <div className="space-y-4">
                                {Object.keys(roleIcons).map((role) => {
                                    const Icon = roleIcons[role];
                                    const isActive = selectedRole === role;
                                    return (
                                        <div
                                            key={role}
                                            onClick={() => setSelectedRole(role)}
                                            className={`p-6 rounded-[24px] cursor-pointer transition-all duration-300 flex items-center justify-between group
                                                ${isActive ? 'bg-[#04330B] text-white shadow-xl translate-x-4' : 'bg-[#F8FBF9] text-[#0D5229] border border-[#0D5229]/5 hover:bg-white hover:border-[#0D5229]/20'}`}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                                                    ${isActive ? 'bg-white/10' : 'bg-[#10B981]/10'}`}>
                                                    <Icon size={24} />
                                                </div>
                                                <span className="font-bold text-xl">{t.roles[role].name}</span>
                                            </div>
                                            <ArrowRight size={20} className={`transition-transform duration-300 ${isActive ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-50'}`} />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-12 p-6 bg-[#04330B]/5 rounded-[32px] border border-[#04330B]/5 flex items-start gap-4">
                                <Info size={20} className="text-[#10B981] shrink-0 mt-1" />
                                <p className="text-[#587E67] text-sm font-medium italic">
                                    Calculations based on 2024 PGP Economic Impact Study & Rajasthan Resource Re-Engineering Bill.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right: The Transformation Display */}
                    <div className="lg:col-span-7">
                        <ScrollReveal animation="scale-up" delay={200}>
                            <div className="relative bg-white border border-[#0D5229]/10 rounded-[48px] p-8 md:p-12 shadow-[0_20px_80px_rgba(13,82,41,0.08)] overflow-hidden">

                                {/* Header Info */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                    <div>
                                        <p className="text-[#587E67] font-bold text-xs uppercase tracking-widest mb-1">{t.impactTitle}</p>
                                        <h3 className="text-[44px] font-bold text-[#10B981] tracking-tighter">{activeData.income}</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[#EAF7EE] p-3 rounded-2xl">
                                            <TrendingUp className="text-[#10B981]" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#04330B] font-bold">+180%</p>
                                            <p className="text-[#587E67] text-[10px] font-bold uppercase">Efficiency</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Points */}
                                <div className="space-y-6 mb-12">
                                    {activeData.points.map((point: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-5 rounded-[24px] bg-[#F8FBF9] border border-[#0D5229]/5">
                                            <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <p className="text-[#04330B] font-bold text-lg">{point}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic Stats */}
                                <div className="grid grid-cols-2 gap-6 mb-12">
                                    {activeData.stats.map((stat: any, i: number) => (
                                        <div key={i} className="p-6 rounded-[32px] border border-[#0D5229]/5 bg-white shadow-sm flex flex-col items-center">
                                            <p className="text-[#587E67] text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                                            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Call to Action Card within Tracker */}
                                <div className="bg-[#04330B] rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 group cursor-pointer hover:bg-[#0D5229] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                            <Smartphone size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-xl">{t.cta}</h4>
                                            <p className="text-white/60 text-sm">Download the PGP Action App</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <ArrowRight size={24} />
                                    </div>
                                </div>

                                {/* Decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#10B981]/10 to-transparent -translate-y-1/2 translate-x-1/2 rounded-full" />
                            </div>
                        </ScrollReveal>
                    </div>

                </div>

            </div>
        </section>
    );
};

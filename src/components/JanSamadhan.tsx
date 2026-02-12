"use client";

import React from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Zap,
    Droplets,
    GraduationCap,
    HelpCircle,
    ArrowRight
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const JanSamadhan = ({ language }: { language: string }) => {

    const translations: any = {
        en: {
            title: "Your Problem,",
            highlight: "Our System.",
            sub: "Simple solutions for a better life. No complex talk, just real work.",
            oldWay: "OLD SYSTEM",
            newWay: "PGP GREEN SYSTEM",
            cards: [
                {
                    icon: Zap,
                    problem: "Expensive Electricity Bills",
                    solution: "Free Solar Power for every house and income from extra sun.",
                    color: "#F59E0B"
                },
                {
                    icon: Droplets,
                    problem: "Dry Taps & Water Shortage",
                    solution: "Capturing every drop of rain. Water for every field and home.",
                    color: "#3B82F6"
                },
                {
                    icon: AlertCircle,
                    problem: "Running to Govt. Offices",
                    solution: "No more lines or bribes. All work done from your mobile.",
                    color: "#EF4444"
                },
                {
                    icon: GraduationCap,
                    problem: "Unemployment Tension",
                    solution: "Training & jobs in your own village. Every youth an owner.",
                    color: "#8B5CF6"
                }
            ]
        },
        hi: {
            title: "आपकी परेशानी,",
            highlight: "हमारा समाधान।",
            sub: "बेहतर जीवन के लिए सरल समाधान। कोई कठिन बात नहीं, बस सीधा काम।",
            oldWay: "पुरानी व्यवस्था",
            newWay: "पी.जी.पी. ग्रीन सिस्टम",
            cards: [
                {
                    icon: Zap,
                    problem: "महंगे बिजली बिल की टेंशन",
                    solution: "हर घर की अपनी मुफ़्त बिजली और फालतू धूप से कमाई।",
                    color: "#F59E0B"
                },
                {
                    icon: Droplets,
                    problem: "सूखे नल और पानी की कमी",
                    solution: "बारिश की हर बूंद का संचय। हर खेत और घर को पानी।",
                    color: "#3B82F6"
                },
                {
                    icon: AlertCircle,
                    problem: "दफ्तरों के चक्कर और रिश्वत",
                    solution: "लाइनों का झंझट खत्म। अब सारा काम आपके मोबाइल से सीधा।",
                    color: "#EF4444"
                },
                {
                    icon: GraduationCap,
                    problem: "बेरोजगारी और पलायन",
                    solution: "अपने ही गांव में ट्रेनिंग और काम। हर युवा बनेगा मालिक।",
                    color: "#8B5CF6"
                }
            ]
        }
    };

    const t = translations[language] || translations.en;

    return (
        <section className="py-[100px] lg:py-[180px] bg-[#F8FBF9] relative overflow-hidden flex justify-center">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0D5229 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="w-full max-w-[1320px] px-4 lg:px-8 relative z-10">

                <div className="text-center mb-16 lg:mb-24">
                    <ScrollReveal animation="fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0D5229]/10 bg-white mb-6 shadow-sm">
                            <HelpCircle size={16} className="text-[#10B981]" />
                            <span className="text-[#0D5229]/70 text-[10px] font-bold uppercase tracking-[0.3em]">Jan Samadhan</span>
                        </div>
                        <h2 className="text-[44px] md:text-[64px] font-bold text-[#04330B] tracking-tighter leading-tight mb-6">
                            {t.title} <br />
                            <span className="text-[#10B981]">{t.highlight}</span>
                        </h2>
                        <p className="text-[#587E67] text-lg lg:text-xl font-medium max-w-[600px] mx-auto">
                            {t.sub}
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                    {t.cards.map((card: any, i: number) => (
                        <ScrollReveal key={i} animation="fade-up" delay={i * 100}>
                            <div className="bg-white rounded-[40px] p-8 lg:p-12 border border-[#0D5229]/5 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden h-full">

                                {/* Top: Problem (Reddish/Muted) */}
                                <div className="mb-8">
                                    <div className="inline-block px-4 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                                        {t.oldWay}
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                            <card.icon size={24} />
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-bold text-[#04330B]/60 leading-tight">
                                            {card.problem}
                                        </h3>
                                    </div>
                                </div>

                                {/* Divider with Arrow */}
                                <div className="relative h-[2px] w-full bg-gray-100 my-8">
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#10B981] shadow-sm">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>

                                {/* Bottom: Solution (Green/Active) */}
                                <div className="relative z-10">
                                    <div className="inline-block px-4 py-1 rounded-full bg-[#EAF7EE] text-[#10B981] text-[10px] font-bold tracking-widest uppercase mb-4">
                                        {t.newWay}
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#10B981] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/20">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-bold text-[#04330B] leading-tight">
                                            {card.solution}
                                        </h3>
                                    </div>
                                </div>

                                {/* Hover Background Effect */}
                                <div
                                    className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                                    style={{ backgroundColor: card.color }}
                                />
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <ScrollReveal animation="scale-up">
                        <button className="px-10 py-5 bg-[#04330B] text-white rounded-full font-bold text-lg hover:bg-[#0D5229] transition-all shadow-xl shadow-[#04330B]/20 flex items-center gap-3 mx-auto group">
                            {language === 'hi' ? 'आज ही बदलाव से जुड़ें' : 'Join the Change Today'}
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </ScrollReveal>
                </div>

            </div>
        </section>
    );
};

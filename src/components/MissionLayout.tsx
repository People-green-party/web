"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import ScrollReveal from './ScrollReveal';
import { ArrowRight, CheckCircle2, Globe, Shield, Leaf, Target, Info } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface MissionLayoutProps {
    title: string;
    subtitle: string;
    heroImage: string;
    content: string;
    initiatives: {
        title: string;
        description: string;
        icon: React.ElementType;
    }[];
    secondaryTitle?: string;
    secondaryContent?: string;
}

export const MissionLayout = ({
    title,
    subtitle,
    heroImage,
    content,
    initiatives,
    secondaryTitle,
    secondaryContent
}: MissionLayoutProps) => {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen bg-white font-['Familjen_Grotesk']">
            <Navbar />

            {/* 1. HERO SECTION */}
            <section className="relative w-full h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden pt-[90px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt={title}
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#04330B]/80 via-[#04330B]/60 to-[#04330B]/90" />
                </div>

                <div className="relative z-10 w-full max-w-[1320px] px-4 lg:px-8 text-center text-white">
                    <ScrollReveal animation="fade-up" duration={1000}>
                        <h1 className="text-[36px] md:text-[54px] lg:text-[72px] font-bold leading-[1.1] mb-6 drop-shadow-lg">
                            {title}
                        </h1>
                    </ScrollReveal>
                    <ScrollReveal animation="fade-up" duration={1000} delay={200}>
                        <p className="text-[18px] lg:text-[24px] font-medium text-white/90 max-w-[800px] mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Floating Accent */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-[#E85C2F] rounded-t-full shadow-[0_-10px_30px_rgba(232,92,47,0.4)]" />
            </section>

            {/* 2. MAIN INTRODUCTION */}
            <section className="py-[80px] lg:py-[120px] px-4 lg:px-8 flex justify-center bg-white">
                <div className="w-full max-w-[1000px] text-center">
                    <ScrollReveal animation="fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EAF7EE] rounded-full text-[#0D5229] font-bold text-sm tracking-wider uppercase mb-8">
                            <Info size={16} />
                            Our Objective
                        </div>
                        <p className="text-[20px] lg:text-[28px] leading-[1.5] text-[#04330B] font-semibold text-wrap text-center">
                            {content}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* 3. KEY INITIATIVES GRID */}
            <section className="py-[80px] lg:py-[120px] bg-[#F9FBFA] px-4 lg:px-8 flex justify-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50 rounded-full blur-[100px] opacity-60 translate-y-1/2 -translate-x-1/2" />

                <div className="w-full max-w-[1320px] relative z-10">
                    <div className="text-center mb-16">
                        <ScrollReveal animation="fade-up">
                            <h2 className="text-[32px] md:text-[40px] lg:text-[56px] font-bold text-[#04330B] mb-4">
                                Key Initiatives
                            </h2>
                            <div className="w-24 h-1.5 bg-[#0D5229] mx-auto rounded-full" />
                        </ScrollReveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {initiatives.map((item, i) => (
                            <ScrollReveal key={i} animation="scale-up" delay={i * 100}>
                                <div className="bg-white p-8 lg:p-10 rounded-[24px] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(13,82,41,0.1)] hover:-translate-y-2 transition-all duration-300 h-full group">
                                    <div className="w-16 h-16 bg-[#EAF7EE] rounded-2xl flex items-center justify-center text-[#0D5229] mb-8 group-hover:bg-[#0D5229] group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <item.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-[24px] lg:text-[28px] font-bold text-[#04330B] mb-4">
                                        {item.title}
                                    </h3>
                                    <p className="text-[16px] lg:text-[18px] text-[#587E67] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. SECONDARY CONTENT SECTION (Optional) */}
            {secondaryTitle && (
                <section className="py-[80px] lg:py-[120px] px-4 lg:px-8 border-t border-gray-100 flex justify-center">
                    <div className="w-full max-w-[1320px] flex flex-col lg:flex-row gap-12 lg:items-center">
                        <div className="w-full lg:w-1/2">
                            <ScrollReveal animation="slide-right">
                                <h2 className="text-[32px] lg:text-[48px] font-bold text-[#04330B] leading-[1.2] mb-6">
                                    {secondaryTitle}
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="mt-1.5 shrink-0 text-[#0D5229]">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <p className="text-[18px] text-[#587E67]">
                                                Implementing statewide policies for transparent governance and citizen empowerment.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <ScrollReveal animation="scale-up" delay={200}>
                                <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/3]">
                                    <img
                                        src={heroImage}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        alt="Side visual"
                                    />
                                    <div className="absolute inset-0 bg-[#04330B]/10 hover:bg-transparent transition-colors duration-300" />
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* 5. CALL TO ACTION */}
            <section className="py-[60px] lg:py-[100px] px-4">
                <div className="w-full max-w-[1320px] mx-auto bg-[#04330B] rounded-[32px] lg:rounded-[48px] p-8 lg:p-20 text-center relative overflow-hidden group">
                    {/* Animated Glow */}
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#10B981] opacity-20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#E85C2F] opacity-10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000" />

                    <ScrollReveal animation="fade-up">
                        <h2 className="text-[32px] lg:text-[56px] font-bold text-white mb-6">
                            Be Part of the Green Revolution
                        </h2>
                        <p className="text-white/80 text-[18px] lg:text-[22px] max-w-[640px] mx-auto mb-10 leading-relaxed">
                            Your voice and support matter. Join thousands of citizens working together to build a sustainable and prosperous Rajasthan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/join"
                                className="px-10 py-5 bg-white text-[#04330B] rounded-full font-bold text-lg hover:bg-[#EAF7EE] transition-all hover:scale-105 flex items-center gap-3 shadow-xl"
                            >
                                Join the Party <ArrowRight size={20} />
                            </Link>
                            <Link
                                href="/donation"
                                className="px-10 py-5 bg-[#E85C2F] text-white rounded-full font-bold text-lg hover:bg-[#ff6b3d] transition-all hover:scale-105 shadow-xl"
                            >
                                Support Our Vision
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </div>
    );
};

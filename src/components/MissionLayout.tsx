"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import ScrollReveal from './ScrollReveal';
import { ArrowRight, CheckCircle2, Globe, Shield, Leaf, Target, Info, ArrowUpRight, MousePointer2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface MissionLayoutProps {
    title: string;
    subtitle: string;
    heroImage: string;
    content: string;
    tags?: string[];
    theme?: 'green' | 'blue' | 'gold' | 'orange';
    initiatives: {
        title: string;
        description: string;
        icon: React.ElementType;
        image?: string;
    }[];
    secondaryTitle?: string;
    secondaryContent?: string;
}

export const MissionLayout = ({
    title,
    subtitle,
    heroImage,
    content,
    tags = ["SUSTAINABLE", "CITIZEN FIRST", "INNOVATIVE"],
    theme = 'green',
    initiatives,
    secondaryTitle,
    secondaryContent
}: MissionLayoutProps) => {
    const { language } = useLanguage();

    const themes = {
        green: {
            bg: 'bg-[#EAF7EE]',
            accent: 'text-[#10B981]',
            border: 'border-[#B9D3C4]',
            glow: 'shadow-[#0D5229]/20',
            gradient: 'from-[#0D5229] to-[#10B981]'
        },
        blue: {
            bg: 'bg-[#EBF5FF]',
            accent: 'text-[#3B82F6]',
            border: 'border-[#BFDBFE]',
            glow: 'shadow-[#1E40AF]/20',
            gradient: 'from-[#1E40AF] to-[#3B82F6]'
        },
        gold: {
            bg: 'bg-[#FFFBEB]',
            accent: 'text-[#F59E0B]',
            border: 'border-[#FEF3C7]',
            glow: 'shadow-[#78350F]/20',
            gradient: 'from-[#78350F] to-[#F59E0B]'
        },
        orange: {
            bg: 'bg-[#FFF7ED]',
            accent: 'text-[#F97316]',
            border: 'border-[#FFEDD5]',
            glow: 'shadow-[#9A3412]/20',
            gradient: 'from-[#9A3412] to-[#F97316]'
        }
    };

    const tColor = themes[theme] || themes.green;

    return (
        <div className="min-h-screen bg-white font-['Familjen_Grotesk'] overflow-x-hidden">
            <Navbar />

            {/* 1. CINEMATIC HERO SECTION */}
            <section className="relative w-full pt-[80px] lg:pt-[100px] overflow-hidden">
                {/* Background Decor */}
                <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2 ${tColor.bg}`} />

                <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-10">
                    <div className="relative group">
                        <div className={`absolute -inset-4 rounded-[60px] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000 ${tColor.bg}`} />

                        <div className="relative w-full bg-white rounded-[40px] lg:rounded-[60px] overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:h-[750px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">

                            {/* Left: Atmospheric Content */}
                            <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center items-start relative z-10 text-left">
                                <ScrollReveal animation="fade-up">
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${tColor.border} bg-white shadow-sm mb-8`}>
                                        <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: tColor.accent.includes('#') ? tColor.accent : '#10B981' }} />
                                        <span className={`${tColor.accent} text-[10px] font-bold uppercase tracking-[0.3em]`}>{tags[0]}</span>
                                    </div>
                                    <h1 className="text-[48px] md:text-[70px] lg:text-[92px] font-bold leading-[0.95] text-[#04330B] mb-8 tracking-tighter">
                                        {title}
                                    </h1>
                                </ScrollReveal>

                                <ScrollReveal animation="fade-up" delay={200}>
                                    <p className="text-[20px] lg:text-[26px] font-medium text-[#587E67] max-w-[600px] mb-12 leading-tight">
                                        {subtitle}
                                    </p>
                                </ScrollReveal>

                                <ScrollReveal animation="fade-up" delay={400} className="flex flex-wrap gap-5 items-center">
                                    <Link
                                        href="/join"
                                        className="px-10 py-5 bg-[#04330B] text-white rounded-full font-bold text-lg hover:bg-[#0D5229] transition-all transform hover:scale-[1.05] flex items-center gap-3 shadow-2xl group/btn"
                                    >
                                        JOIN THE MISSION <ArrowUpRight size={22} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </Link>
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-100">
                                                <img src={`/herosection/${i + 6}.jpg`} className="w-full h-full object-cover" alt="Supporter" />
                                            </div>
                                        ))}
                                    </div>
                                </ScrollReveal>
                            </div>

                            {/* Right: Immersive Image with Overlays */}
                            <div className="w-full lg:w-[48%] relative">
                                <img
                                    src={heroImage}
                                    alt={title}
                                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

                                <div className="absolute bottom-12 left-12 right-12 text-white">
                                    <ScrollReveal animation="scale-up">
                                        <div className="p-8 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 shadow-2xl">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-[#04330B]`}>
                                                    <Target size={24} />
                                                </div>
                                                <p className="font-bold text-sm tracking-widest uppercase text-left">Target 2030</p>
                                            </div>
                                            <p className="text-xl font-medium leading-snug text-left">Implementing statewide systemic changes for a resilient Rajasthan.</p>
                                        </div>
                                    </ScrollReveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. THE CORE MANIFESTO */}
            <section className="py-[120px] lg:py-[200px] flex justify-center bg-white relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 opacity-50" />
                <div className="w-full max-w-[1200px] px-8 relative z-10">
                    <ScrollReveal animation="fade-up">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[#E85C2F] font-bold text-xs tracking-[0.5em] uppercase mb-12">The Philosophy</span>
                            <h2 className="text-[32px] md:text-[48px] lg:text-[64px] font-bold text-[#04330B] leading-[1.1] tracking-tighter italic">
                                "{content}"
                            </h2>
                            <div className={`mt-16 w-24 h-2 bg-gradient-to-r ${tColor.gradient} rounded-full`} />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 3. STRATEGIC PILLARS - Premium Grid */}
            <section className={`py-[150px] px-4 lg:px-8 flex justify-center ${tColor.bg}`}>
                <div className="w-full max-w-[1400px]">
                    <div className="flex flex-col items-center mb-24 text-center">
                        <ScrollReveal animation="fade-up">
                            <h2 className="text-[56px] lg:text-[86px] font-bold text-[#04330B] tracking-tighter leading-none mb-6">
                                The Roadmap
                            </h2>
                            <p className="text-[#587E67] text-xl font-medium max-w-[600px]">How we transform the vision into concrete, ground-level change.</p>
                        </ScrollReveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {initiatives.map((item, i) => (
                            <ScrollReveal key={i} animation="scale-up" delay={i * 100}>
                                <div className="group relative w-full h-[550px] rounded-[48px] overflow-hidden shadow-xl hover:shadow-[0_50px_100px_-20px_rgba(4,51,11,0.2)] transition-all duration-700 bg-white border border-gray-100 hover:border-[#B9D3C4]">
                                    <div className="absolute inset-0">
                                        <img
                                            src={item.image || heroImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-10 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent group-hover:from-[#04330B]/90 group-hover:via-[#04330B]/40 group-hover:to-transparent transition-all duration-700" />
                                    </div>

                                    <div className="absolute inset-0 p-12 flex flex-col justify-between z-20 text-left">
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-sm
                                            ${tColor.bg} ${tColor.accent} group-hover:bg-white group-hover:text-[#04330B] group-hover:-rotate-12`}>
                                            <item.icon size={32} />
                                        </div>

                                        <div className="transform transition-all duration-700">
                                            <h3 className="text-[32px] font-bold text-[#04330B] group-hover:text-white mb-6 leading-tight tracking-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-[#587E67] group-hover:text-white/80 text-lg leading-relaxed font-medium translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute top-12 right-12 w-12 h-12 rounded-full border border-[#0D5229]/10 flex items-center justify-center text-[#0D5229] group-hover:bg-white group-hover:text-[#04330B] group-hover:border-white transition-all duration-500 font-bold">
                                        0{i + 1}
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. FINAL CTA - High Impact */}
            <section className="py-[100px] lg:py-[200px] px-8 flex justify-center">
                <div className="w-full max-w-[1400px] relative overflow-hidden rounded-[80px] bg-[#04330B] p-12 lg:p-32 group">
                    <div className="absolute inset-0 opacity-10 scale-150 animate-slow-spin" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-[#10B981]/20 to-transparent blur-[120px] rounded-full" />

                    <div className="relative z-10 text-center">
                        <ScrollReveal animation="fade-up">
                            <h2 className="text-[52px] md:text-[82px] lg:text-[110px] font-bold text-white tracking-tighter leading-[0.9] mb-12">
                                Be the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#E85C2F]">Change.</span>
                            </h2>
                            <p className="text-white/60 text-xl lg:text-2xl max-w-[800px] mx-auto mb-16 font-medium leading-relaxed">
                                Join our movement to bring transparency, nature conservation, and prosperity back to the heart of Rajasthan.
                            </p>
                            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                                <Link
                                    href="/join"
                                    className="px-12 py-6 bg-white text-[#04330B] rounded-full font-bold text-xl hover:bg-[#EAF7EE] transition-all transform hover:scale-110 flex items-center gap-4 shadow-2xl"
                                >
                                    GET INVOLVED NOW <MousePointer2 size={24} />
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

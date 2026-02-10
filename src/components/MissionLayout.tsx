"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import ScrollReveal from './ScrollReveal';
import { ArrowRight, CheckCircle2, Globe, Shield, Leaf, Target, Info, ArrowUpRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface MissionLayoutProps {
    title: string;
    subtitle: string;
    heroImage: string;
    content: string;
    tags?: string[];
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
    initiatives,
    secondaryTitle,
    secondaryContent
}: MissionLayoutProps) => {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen bg-white font-['Familjen_Grotesk']">
            <Navbar />

            {/* 1. SPLIT HERO SECTION - PGP Theme Version */}
            <section className="relative w-full pt-[90px] flex justify-center">
                <div className="w-full max-w-[1400px] px-4 lg:px-8 py-10 lg:py-20">
                    <div className="relative w-full bg-[#EAF7EE] rounded-[40px] overflow-hidden flex flex-col lg:flex-row min-h-[500px] lg:h-[650px] shadow-2xl border border-[#B9D3C4]/30">

                        {/* Left: Cinematic Image */}
                        <div className="w-full lg:w-[45%] h-[350px] lg:h-full relative shrink-0 overflow-hidden">
                            <img
                                src={heroImage}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-110"
                            />
                            {/* Blend to PGP Light Green */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#EAF7EE] hidden lg:block" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#EAF7EE] lg:hidden" />
                        </div>

                        {/* Right: Content with PGP Green Typography */}
                        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center items-start bg-[#EAF7EE]">
                            <ScrollReveal animation="fade-up" duration={1000}>
                                <h1 className="text-[42px] md:text-[56px] lg:text-[76px] font-bold leading-[1] text-[#04330B] mb-8 tracking-tighter">
                                    {title}
                                </h1>
                            </ScrollReveal>

                            <ScrollReveal animation="fade-up" duration={1000} delay={200}>
                                <p className="text-[18px] lg:text-[22px] font-medium text-[#587E67] max-w-[600px] mb-12 leading-relaxed">
                                    {subtitle}
                                </p>
                            </ScrollReveal>

                            <ScrollReveal animation="fade-up" duration={1000} delay={400} className="flex flex-wrap gap-4 items-center">
                                {tags.map((tag, idx) => (
                                    <div key={idx} className="px-5 py-2.5 rounded-full border border-[#B9D3C4] text-[#0D5229] text-xs font-bold uppercase tracking-widest bg-white/50 backdrop-blur-sm">
                                        {tag}
                                    </div>
                                ))}
                                <Link
                                    href="/join"
                                    className="ml-0 lg:ml-4 px-8 py-3.5 bg-[#0D5229] text-white rounded-full font-bold text-sm tracking-wide hover:bg-[#04330B] transition-all flex items-center gap-2 group shadow-xl"
                                >
                                    LEARN MORE <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. OBJECTIVE SECTION - Premium Quote with PGP Style */}
            <section className="py-[60px] lg:py-[100px] px-4 lg:px-8 flex justify-center">
                <div className="w-full max-w-[1100px] bg-[#F8FBF9] rounded-[40px] p-10 lg:p-24 shadow-sm border border-[#EAF7EE] relative overflow-hidden">
                    {/* Decorative Watermark */}
                    <div className="absolute -top-10 -right-10 opacity-[0.05] text-[#0D5229] pointer-events-none">
                        <Globe size={300} strokeWidth={1} />
                    </div>

                    <ScrollReveal animation="fade-up">
                        <div className="flex flex-col items-center text-center gap-8">
                            <div className="w-12 h-1 bg-[#E85C2F] rounded-full" />
                            <h2 className="text-[24px] lg:text-[36px] leading-[1.4] text-[#04330B] font-bold max-w-[900px]">
                                "{content}"
                            </h2>
                            <div className="flex items-center gap-3 text-[#587E67] font-bold text-sm uppercase tracking-[0.2em] pt-4">
                                <Info size={18} className="text-[#E85C2F]" />
                                The Core Objective
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 3. KEY INITIATIVES - Bento PGP Green Version */}
            <section className="py-[100px] px-4 lg:px-8 flex justify-center bg-white">
                <div className="w-full max-w-[1400px]">
                    <div className="flex flex-col lg:flex-row items-end justify-between mb-16 px-4">
                        <ScrollReveal animation="slide-right">
                            <h2 className="text-[40px] lg:text-[64px] font-bold text-[#04330B] tracking-tighter leading-none mb-4">
                                Strategic Pillars
                            </h2>
                            <p className="text-[#587E67] text-lg font-medium">Driving transformation through targeted action.</p>
                        </ScrollReveal>
                        <div className="h-[2px] flex-1 mx-12 bg-[#EAF7EE] mb-4 hidden lg:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {initiatives.map((item, i) => (
                            <ScrollReveal key={i} animation="scale-up" delay={i * 100} className="h-full">
                                <div className="group relative w-full h-[450px] lg:h-[500px] rounded-[32px] overflow-hidden shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(13,82,41,0.2)] transition-all duration-500 cursor-pointer border border-transparent hover:border-[#B9D3C4]">
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={item.image || heroImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-[10s] ease-in-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-[#04330B]/20 group-hover:bg-[#04330B]/40 transition-colors duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#04330B]/90 via-[#04330B]/30 to-transparent" />
                                    </div>

                                    {/* Number Badge */}
                                    <div className="absolute top-8 left-8 w-12 h-12 rounded-full border border-white/40 backdrop-blur-md flex items-center justify-center text-white font-bold text-sm z-20">
                                        0{i + 1}
                                    </div>

                                    {/* Card Content Overlay */}
                                    <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
                                        <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-xl">
                                                <item.icon size={26} strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-[32px] lg:text-[42px] font-bold text-white mb-4 leading-tight tracking-tighter">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/80 text-lg leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Arrow Overlay */}
                                    <div className="absolute top-8 right-8 w-14 h-14 bg-[#E85C2F] rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl z-20">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. SECONDARY CONTENT - Immersive PGP Layout */}
            {secondaryTitle && (
                <section className="py-[100px] lg:py-[150px] px-4 lg:px-8 border-t border-[#EAF7EE]">
                    <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-20 items-center">
                        <div className="w-full lg:w-1/2">
                            <ScrollReveal animation="slide-right">
                                <h2 className="text-[48px] lg:text-[72px] font-bold text-[#04330B] leading-[1] mb-10 tracking-tighter">
                                    {secondaryTitle}
                                </h2>
                                <div className="flex flex-col gap-8">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-6 items-start p-6 bg-[#F8FBF9] border border-[#EAF7EE] rounded-[24px] hover:shadow-lg hover:border-[#0D5229]/20 transition-all duration-300 group">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0D5229] shrink-0 border border-[#B9D3C4] group-hover:bg-[#0D5229] group-hover:text-white transition-colors duration-300">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <p className="text-[18px] lg:text-[20px] text-[#587E67] font-medium leading-relaxed group-hover:text-[#04330B] transition-colors">
                                                We are implementing statewide policies that prioritize citizen welfare through transparent governance and technological integration.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <ScrollReveal animation="scale-up" delay={200}>
                                <div className="relative rounded-[40px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(13,82,41,0.2)] aspect-[4/5] lg:aspect-[3/4]">
                                    <img
                                        src={heroImage}
                                        className="w-full h-full object-cover"
                                        alt="Mission aesthetic"
                                    />
                                    <div className="absolute inset-0 bg-[#0D5229]/10 mix-blend-overlay" />
                                    {/* floating info badge */}
                                    <div className="absolute bottom-10 left-10 p-8 bg-white/95 backdrop-blur-md rounded-[24px] border border-white/20 shadow-2xl max-w-[80%]">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-10 h-10 bg-[#0D5229] rounded-full flex items-center justify-center text-white">
                                                <Target size={20} />
                                            </div>
                                            <p className="font-bold text-[#0D5229] uppercase tracking-widest text-xs">Our Commitment</p>
                                        </div>
                                        <p className="text-[#04330B] font-semibold text-lg leading-snug">Sustainable progress built on foundations of trust and innovation.</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* 5. CALL TO ACTION - Signature PGP Green */}
            <section className="py-[100px] px-4">
                <div className="w-full max-w-[1400px] mx-auto bg-[#04330B] rounded-[50px] p-8 lg:p-24 text-center relative overflow-hidden group shadow-[0_40px_100px_-20px_rgba(4,51,11,0.4)]">
                    {/* Atmospheric Glows */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E85C2F] opacity-[0.15] rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#10B981] opacity-[0.1] rounded-full blur-[150px] animate-pulse" />

                    <ScrollReveal animation="fade-up">
                        <h2 className="text-[40px] lg:text-[80px] font-bold text-white mb-8 leading-none tracking-tighter">
                            Shape the Future <br /> of Rajasthan
                        </h2>
                        <p className="text-white/70 text-[18px] lg:text-[24px] max-w-[750px] mx-auto mb-14 leading-relaxed font-medium">
                            Step forward today to be a part of the movement that prioritizes nature, humanity, and progress for every citizen.
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                            <Link
                                href="/join"
                                className="w-full md:w-auto px-12 py-5 bg-white text-[#04330B] rounded-full font-bold text-xl hover:bg-[#EAF7EE] transition-all transform hover:scale-[1.05] flex items-center justify-center gap-3 shadow-2xl"
                            >
                                Join Now <ArrowRight size={24} />
                            </Link>
                            <Link
                                href="/donation"
                                className="w-full md:w-auto px-12 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-bold text-xl hover:bg-white/10 transition-all shadow-xl"
                            >
                                Invest in Change
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <Footer />
        </div>
    );
};

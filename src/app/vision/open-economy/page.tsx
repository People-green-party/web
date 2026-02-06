"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Globe, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';

// Theme for Open-Economy
const theme = {
    primary: "bg-slate-800",
    secondary: "bg-slate-100",
    accent: "text-slate-700",
    gradient: "from-slate-800 to-gray-900",
    button: "bg-slate-700 hover:bg-slate-800",
    iconBg: "bg-slate-200",
};

// Data for Open-Economy
const pageData = {
    en: {
        title: "Open Economy Policy",
        subtitle: "Individual Freedom, Faster Growth",
        description: "PGP supports a liberal economic policy with minimum government interference. We advocate for respect for private property, an end to License Raj, and rapid growth through Liberalization, Privatization, and Globalization.",
        image: "/herosection/hero3.svg",
        icon: Globe,
        points: [
            "Respect for private property & end of License Raj.",
            "Minimum regulation in trade & business.",
            "Fast growth via LPG (Lib/Priv/Glob).",
            "Uplift Poor -> Middle -> High Class."
        ]
    },
    hi: {
        title: "खुली अर्थव्यवस्था और न्यून सरकार",
        subtitle: "व्यक्ति की आज़ादी, तेज़ विकास",
        description: "पीपल्स ग्रीन पार्टी उदार आर्थिक नीति और न्यूनतम सरकारी हस्तक्षेप में विश्वास रखती है।",
        image: "/herosection/hero3.svg",
        icon: Globe,
        points: [
            "निजी संपत्ति का सम्मान और लाइसेंस-राज का अंत।",
            "व्यापार में न्यूनतम रेगुलेशन।",
            "लिबरलाइजेशन, प्राइवेटाइजेशन और ग्लोबलाइजेशन के माध्यम से तेज़ विकास।",
            "गरीब को मध्यम वर्ग और मध्यम वर्ग को उच्च वर्ग में बदलने की नीति।"
        ]
    }
};

export default function OpenEconomyPage() {
    const { language } = useLanguage();
    const currentLang = language === 'hi' ? 'hi' : 'en';
    const content = pageData[currentLang];
    const Icon = content.icon;

    return (
        <div className={`bg-white min-h-screen font-sans selection:${theme.primary} selection:text-white`}>
            <Navbar />

            {/* 1. IMMERSIVE HERO SECTION WITH THEME GRADIENT */}
            <div className={`relative w-full min-h-[85vh] lg:h-[85vh] flex items-center overflow-hidden mt-[70px] lg:mt-[90px] pb-16 lg:pb-0`}>
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={content.image}
                        alt={content.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                </div>

                {/* Themed Overlay */}
                <div className={`absolute inset-0 z-10 opacity-90 bg-gradient-to-r ${theme.gradient}`} />

                {/* Content */}
                <div className="relative z-20 w-full max-w-[1320px] mx-auto px-4 lg:px-8 pt-10">
                    <ScrollReveal animation="fade-up" duration={800}>
                        <Link
                            href="/#vision"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-medium group px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm w-fit border border-white/10"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            {currentLang === 'hi' ? 'सभी विज़न देखें' : 'View All Visions'}
                        </Link>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="slide-right" delay={200} className="text-white">
                            <div className={`w-16 h-16 rounded-2xl ${theme.button} flex items-center justify-center mb-8 shadow-lg shadow-black/20 border border-white/20`}>
                                <Icon size={32} className="text-white" />
                            </div>
                            <h1 className="font-['Familjen_Grotesk'] font-bold text-[36px] md:text-[56px] lg:text-[64px] leading-[1.1] mb-6 drop-shadow-md">
                                {content.title}
                            </h1>
                            <p className="font-['Familjen_Grotesk'] text-[18px] lg:text-[24px] text-white/90 font-light tracking-wide max-w-xl leading-relaxed">
                                {content.subtitle}
                            </p>
                        </ScrollReveal>

                        {/* Decorative Graphic Element based on Theme */}
                        <ScrollReveal animation="fade-in" delay={400} className="hidden lg:flex justify-center opacity-60">
                            <div className={`w-[400px] h-[400px] rounded-full border-2 border-white/20 flex items-center justify-center relative`}>
                                <div className="absolute inset-0 rounded-full border border-white/10 scale-125 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border border-white/5 scale-150" />
                                <Icon size={200} className="text-white/20" />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* 2. OVERLAP CONTENT CARD SECTION */}
            <div className={`relative z-30 -mt-12 lg:-mt-32 px-4 pb-20`}>
                <div className="max-w-[1320px] mx-auto">
                    <ScrollReveal animation="fade-up" delay={300}>
                        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">

                            {/* Left: Image Side (Desktop) */}
                            <div className="lg:w-2/5 h-[300px] lg:h-auto relative">
                                <Image
                                    src={content.image}
                                    alt="Vision Details"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className={`absolute inset-0 ${theme.primary} opacity-20 mix-blend-multiply`} />
                            </div>

                            {/* Right: Text Content */}
                            <div className="lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`h-[2px] w-12 ${theme.primary}`} />
                                    <span className={`font-bold uppercase tracking-wider text-sm ${theme.accent}`}>
                                        {currentLang === 'hi' ? 'हमारा मिशन' : 'Our Mission'}
                                    </span>
                                </div>
                                <h3 className="font-['Familjen_Grotesk'] text-3xl font-bold text-gray-900 mb-6">
                                    {content.subtitle}
                                </h3>
                                <p className="font-['Familjen_Grotesk'] text-lg text-gray-600 leading-[1.8] text-justify">
                                    {content.description}
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* 3. KEY INITIATIVES - STYLED GRID */}
            <div className={`w-full ${theme.secondary} py-20 px-4`}>
                <div className="max-w-[1320px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                            {currentLang === 'hi' ? 'मुख्य पहल' : 'Key Initiatives'}
                        </h2>
                        <div className={`w-20 h-1 ${theme.primary} mx-auto rounded-full`} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
                        {content.points.map((point: string, idx: number) => (
                            <ScrollReveal
                                key={idx}
                                animation="fade-up"
                                delay={idx * 100}
                                className={`group p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 left-0 w-2 h-full ${theme.primary} transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300`} />
                                <div className="flex items-start gap-5">
                                    <div className={`w-12 h-12 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 text-${theme.accent}`}>
                                        <CheckCircle2 size={24} className={`${theme.accent}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-['Familjen_Grotesk'] font-bold text-lg text-gray-800 mb-2">
                                            {currentLang === 'hi' ? `लक्ष्य ${idx + 1}` : `Goal ${idx + 1}`}
                                        </h4>
                                        <p className="font-['Familjen_Grotesk'] text-gray-600 leading-relaxed">
                                            {point}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. MORE VISIONS SECTION */}
            <div className="w-full bg-gray-50 py-20 px-4">
                <div className="max-w-[1320px] mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                            {currentLang === 'hi' ? 'अन्य विज़न' : "Our Vision's"}
                        </h2>
                        <div className={`w-20 h-1 ${theme.primary} mx-auto rounded-full`} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: currentLang === 'hi' ? "आन्त्रेप्रेन्योर क्रांति" : "Entrepreneurial Revolution", image: "/herosection/hero1.svg", link: "/vision/entrepreneurship" },
                            { title: currentLang === 'hi' ? "नई खेती – समर्थ किसान" : "New Farming – Capable Farmer", image: "/herosection/hero2.svg", link: "/vision/farming" },
                            { title: currentLang === 'hi' ? "कमजोर वर्ग का सशक्तिकरण" : "Empowerment of Vulnerable Groups", image: "/ourvision/VisionImage.svg", link: "/vision/empowerment" },
                            { title: currentLang === 'hi' ? "शहरी–ग्रामीण समग्र विकास" : "Holistic Urban-Rural Development", image: "/herosection/hero4.svg", link: "/vision/urban-rural" },
                            { title: currentLang === 'hi' ? "नागरिक स्वतंत्रता और संस्कृति" : "Civil Liberties and Culture", image: "/herosection/hero5.svg", link: "/vision/civil-liberties" },
                            { title: currentLang === 'hi' ? "खुली अर्थव्यवस्था" : "Open Economy", image: "/herosection/hero3.svg", link: "/vision/open-economy" },
                            { title: currentLang === 'hi' ? "विश्व स्तरीय जीवन स्तर" : "World-Class Standard of Living", image: "/ourvision/VisionImage.svg", link: "/vision/living-standards" },
                            { title: currentLang === 'hi' ? "प्रकृति संरक्षण" : "Nature Conservation", image: "/herosection/hero2.svg", link: "/vision/nature" }
                        ].map((card, idx) => (
                            <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
                                <Link href={card.link} className="block group h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className={`absolute inset-0 ${theme.primary} opacity-0 group-hover:opacity-20 transition-opacity z-10`} />
                                        <Image
                                            src={card.image}
                                            alt={card.title}
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-['Familjen_Grotesk'] font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                                            {card.title}
                                        </h3>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. CTA SECTION */}
            <div className="w-full py-20 px-4 bg-white">
                <div className="max-w-[1000px] mx-auto text-center">
                    <ScrollReveal animation="scale-up" className={`bg-gradient-to-br ${theme.gradient} rounded-[40px] p-10 lg:p-16 shadow-2xl text-white relative overflow-hidden`}>
                        {/* Background Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />

                        <div className="relative z-10">
                            <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-5xl mb-6">
                                {currentLang === 'hi' ? 'परिवर्तन का हिस्सा बनें' : 'Join the Movement'}
                            </h2>
                            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                                {currentLang === 'hi'
                                    ? 'हम साथ मिलकर एक बेहतर, निष्पक्ष और अधिक समृद्ध भविष्य का निर्माण कर सकते हैं।'
                                    : 'Together we can build a better, fairer, and more prosperous future. Your voice matters.'}
                            </p>
                            <Link
                                href="/join"
                                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                            >
                                {currentLang === 'hi' ? 'आज ही जुड़ें' : 'Join Us Today'}
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <Footer />
        </div>
    );
}

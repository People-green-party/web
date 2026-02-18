"use client";

import React, { useState } from 'react';
import { MapPin, Users, Sun, Leaf, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const RajasthanImpactMap = ({ language }: { language: string }) => {
    const [activeCity, setActiveCity] = useState<string | null>("Jaipur");

    const translations: any = {
        en: {
            tag: "State-Wide Presence",
            watermark: "RAJASTHAN",
            quote: "Our mission reaches the farthest corners of the desert & the heart of the Aravallis.",
            reportBtn: "View Regional Report",
            reportSub: "Deep dive into local initiatives",
            cities: {
                "Jaipur": {
                    name: "Jaipur",
                    title: "The Capital Revolution",
                    desc: "Implementing smart waste management and heritage conservation projects across the Pink City.",
                    stats: "150+ Wards Covered"
                },
                "Jodhpur": {
                    name: "Jodhpur",
                    title: "Sun City Solar Hub",
                    desc: "Transforming the Thar landscape into a community-owned solar grid providing free energy.",
                    stats: "2.5 GW Capacity"
                },
                "Udaipur": {
                    name: "Udaipur",
                    title: "Lake City Conservation",
                    desc: "Nature-first water filtration systems and sustainable tourism models for the Aravallis.",
                    stats: "12 Lakes Revitalized"
                },
                "Bikaner": {
                    name: "Bikaner",
                    title: "Rural Agri-Tech",
                    desc: "Modern organic farming clusters and direct-to-market logistics for desert farmers.",
                    stats: "50K+ Farmers Joined"
                },
                "Alwar": {
                    name: "Alwar",
                    title: "Aravali Green Wall",
                    desc: "Massive afforestation drive to stop desertification and protect the ancient Aravalli range.",
                    stats: "5M+ Trees Planted"
                }
            }
        },
        hi: {
            tag: "राजस्थान भर में उपस्थिति",
            watermark: "राजस्थान",
            quote: "हमारा मिशन रेगिस्तान के सुदूर कोनों और अरावली के हृदय तक पहुँचता है।",
            reportBtn: "क्षेत्रीय रिपोर्ट देखें",
            reportSub: "स्थानीय पहलों की विस्तृत जानकारी",
            cities: {
                "Jaipur": {
                    name: "जयपुर",
                    title: "राजधानी क्रांति",
                    desc: "पिंक सिटी में स्मार्ट कचरा प्रबंधन और विरासत संरक्षण परियोजनाओं को लागू करना।",
                    stats: "150+ वार्ड कवर किए गए"
                },
                "Jodhpur": {
                    name: "जोधपुर",
                    title: "सन सिटी सोलर हब",
                    desc: "थार के परिदृश्य को समुदाय के स्वामित्व वाले सोलर ग्रिड में बदलना जो मुफ्त ऊर्जा प्रदान करता है।",
                    stats: "2.5 GW क्षमता"
                },
                "Udaipur": {
                    name: "उदयपुर",
                    title: "लेक सिटी संरक्षण",
                    desc: "अरावली के लिए प्रकृति-प्रथम जल निस्पंदन प्रणाली और टिकाऊ पर्यटन मॉडल।",
                    stats: "12 झीलें पुनर्जीवित"
                },
                "Bikaner": {
                    name: "बीकानेर",
                    title: "ग्रामीण एग्री-टेक",
                    desc: "रेगिस्तानी किसानों के लिए आधुनिक जैविक खेती क्लस्टर और प्रत्यक्ष-बाजार रसद।",
                    stats: "50K+ किसान जुड़े"
                },
                "Alwar": {
                    name: "अलवर",
                    title: "अरावली ग्रीन वॉल",
                    desc: "मरुस्थलीकरण को रोकने और प्राचीन अरावली श्रृंखला की रक्षा के लिए बड़े पैमाने पर वनीकरण अभियान।",
                    stats: "5M+ पेड़ लगाए गए"
                }
            }
        }
    };

    const t = translations[language] || translations.en;

    const cityIcons: any = {
        "Jaipur": ShieldCheck,
        "Jodhpur": Sun,
        "Udaipur": Leaf,
        "Bikaner": Zap,
        "Alwar": Users
    };

    const cityImages: any = {
        "Jaipur": "/herosection/1.png",
        "Jodhpur": "/herosection/hero5.svg",
        "Udaipur": "/herosection/6.jpg",
        "Bikaner": "/herosection/5.jpg",
        "Alwar": "/herosection/4.jpg"
    };

    return (
        <section className="py-[100px] lg:py-[180px] bg-[#FFFFFF] relative overflow-hidden flex justify-center">
            {/* Background Watermark Section Title */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none select-none">
                <h2 className="text-[150px] lg:text-[250px] font-bold text-[#04330B] leading-none whitespace-nowrap">{t.watermark}</h2>
            </div>

            <div className="w-full max-w-[1400px] px-4 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">

                    {/* Left: Interactive Map Visual (Stylized) */}
                    <div className="w-full lg:w-1/2 relative bg-white/40 backdrop-blur-sm rounded-[60px] p-12 lg:p-20 border border-[#B9D3C4]/30 shadow-xl">
                        <ScrollReveal animation="scale-up">
                            <h3 className="text-[#587E67] font-bold text-lg md:text-xl tracking-[0.4em] uppercase mb-10 text-center lg:text-left">
                                {t.tag}
                            </h3>

                            {/* Stylized Map Container */}
                            <div className="relative aspect-square w-full max-w-[500px] mx-auto">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
                                    <path
                                        d="M30,20 L70,15 L85,40 L90,70 L70,90 L40,95 L15,80 L10,50 Z"
                                        fill="#EAF7EE"
                                        stroke="#B9D3C4"
                                        strokeWidth="0.5"
                                        className="transition-colors duration-500"
                                    />

                                    {/* Map Pins */}
                                    {Object.keys(t.cities).map((cityKey, i) => {
                                        const coords = [
                                            { x: 50, y: 45 }, // Jaipur
                                            { x: 35, y: 55 }, // Jodhpur
                                            { x: 45, y: 75 }, // Udaipur
                                            { x: 32, y: 38 }, // Bikaner
                                            { x: 65, y: 42 }  // Alwar
                                        ][i];

                                        const isActive = activeCity === cityKey;

                                        return (
                                            <g
                                                key={cityKey}
                                                className="cursor-pointer"
                                                onClick={() => setActiveCity(cityKey)}
                                                onMouseEnter={() => setActiveCity(cityKey)}
                                            >
                                                {/* ONLY THE PIN CIRCLE - NO ANIMATIONS */}
                                                {/* SUBTLE HIGHLIGHT RING FOR ACTIVE CITY */}
                                                {isActive && (
                                                    <circle
                                                        cx={coords.x}
                                                        cy={coords.y}
                                                        r="5"
                                                        fill="#E85C2F"
                                                        className="opacity-20"
                                                    />
                                                )}
                                                <circle
                                                    cx={coords.x}
                                                    cy={coords.y}
                                                    r={isActive ? "2.5" : "1.8"}
                                                    fill={isActive ? "#E85C2F" : "#0D5229"}
                                                    className="transition-all duration-300"
                                                />
                                                <text
                                                    x={coords.x}
                                                    y={coords.y - 4}
                                                    className={`text-[3.5px] font-bold fill-[#04330B] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                                                    textAnchor="middle"
                                                >
                                                    {t.cities[cityKey].name}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            <p className="mt-12 text-center text-[#587E67] font-medium text-sm lg:text-base italic">
                                "{t.quote}"
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Right: Dynamic Info Card */}
                    <div className="w-full lg:w-1/2">
                        {Object.entries(t.cities).map(([cityKey, data]: [string, any]) => {
                            if (activeCity !== cityKey) return null;
                            const Icon = cityIcons[cityKey];

                            return (
                                <div key={cityKey} className="animate-in fade-in slide-in-from-right-10 duration-700">
                                    <h2 className="text-[52px] lg:text-[86px] font-bold text-[#04330B] tracking-tighter leading-none mb-6">
                                        {data.name}
                                    </h2>

                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="px-6 py-2 rounded-full bg-[#E85C2F] text-white font-bold text-xs uppercase tracking-widest">
                                            {data.stats}
                                        </div>
                                        <div className="h-[1px] flex-1 bg-[#B9D3C4]" />
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-bold text-[#04330B] mb-6 flex items-center gap-4">
                                        <Icon size={36} className="text-[#E85C2F]" />
                                        {data.title}
                                    </h3>

                                    <p className="text-lg lg:text-2xl text-[#587E67] font-medium leading-relaxed mb-12">
                                        {data.desc}
                                    </p>

                                    <div className="relative group cursor-pointer">
                                        <div className="absolute inset-0 bg-[#04330B] rounded-[40px] translate-y-2 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform" />
                                        <div className="relative bg-white border-2 border-[#04330B] rounded-[40px] p-8 lg:p-10 flex items-center justify-between group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg shrink-0">
                                                    <img src={cityImages[cityKey]} alt={data.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#04330B] text-xl">{t.reportBtn}</p>
                                                    <p className="text-[#587E67] font-medium">{t.reportSub}</p>
                                                </div>
                                            </div>
                                            <div className="w-14 h-14 rounded-full bg-[#04330B] flex items-center justify-center text-white">
                                                <ArrowRight size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

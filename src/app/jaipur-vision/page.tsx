"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../components/LanguageContext";
import { translations } from "../../components/translations";
import { ArrowRight, Leaf, MapPin, Recycle, Zap } from "lucide-react";

export default function JaipurVisionPage() {
    const [language, setLanguage] = useState("en");

    // Since we are setting up a new page context, we need to wrap content or just use the layout's provider if applicable.
    // RootLayout uses LanguageProvider. So we can use useLanguage directly inside a component.
    // HOWEVER: Navbar expects us to pass links sometimes, or uses defaults.
    // And Navbar is designed to control the language state in some previous implementation locally in page.tsx.
    // But wait, page.tsx had its own LanguageContext.Provider!
    // Checks: src/app/layout.tsx -> wraps children in LanguageProvider.
    // So I can use `useLanguage` here directly comfortably.

    return (
        <JaipurVisionContent />
    );
}

const JaipurVisionContent = () => {
    const { language, t } = useLanguage();

    // If translations are not updated in the context immediately (static file), we might need to fallback or ensure types.
    // For now, let's assume t.jaipurVisionPage exists as we just added it.
    // We might need to cast `t` to `any` if Typescript complains about missing keys since they were just added.
    const pageData = (t as any).jaipurVisionPage || {
        title: "Jaipur Vision 2030",
        subtitle: "Restoring Glory, Building Future",
        intro: "Our vision for Jaipur balances its rich heritage with the needs of a modern, sustainable metropolis.",
        points: []
    };

    const icons = [Zap, MapPin, Recycle, Leaf];

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 mt-[70px] lg:mt-[90px]">
                {/* Hero Section */}
                <section className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center bg-[#04330B] overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        {/* Use a real party image for Jaipur Vision */}
                        <img src="/party-images/DSC_0041.JPG" alt="Jaipur Vision" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative z-10 px-4 text-center max-w-[800px]">
                        <h1 className="font-['Familjen_Grotesk'] font-bold text-[40px] md:text-[56px] lg:text-[72px] text-white leading-[1.1] mb-4">
                            {pageData.title}
                        </h1>
                        <p className="font-['Familjen_Grotesk'] text-[18px] lg:text-[24px] text-white/90">
                            {pageData.subtitle}
                        </p>
                    </div>
                </section>

                {/* Intro Section */}
                <section className="py-[60px] lg:py-[100px] px-4">
                    <div className="w-full max-w-[1000px] mx-auto text-center">
                        <p className="font-['Familjen_Grotesk'] text-[20px] lg:text-[28px] text-[#04330B] leading-[1.4] font-medium">
                            "{pageData.intro}"
                        </p>
                    </div>
                </section>

                {/* Points Grid */}
                <section className="pb-[80px] lg:pb-[120px] px-4">
                    <div className="w-full max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[32px]">
                        {pageData.points.map((point: any, index: number) => {
                            const Icon = icons[index % icons.length];
                            return (
                                <div key={index} className="bg-[#F3F9F6] p-[32px] rounded-[16px] border border-[#E4F2EA] hover:shadow-lg transition-shadow group">
                                    <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center text-[#0D5229] mb-[24px] shadow-sm group-hover:scale-110 transition-transform">
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="font-['Familjen_Grotesk'] font-bold text-[24px] text-[#04330B] mb-[12px]">
                                        {point.title}
                                    </h3>
                                    <p className="font-['Familjen_Grotesk'] text-[16px] lg:text-[18px] text-[#587E67] leading-[1.5]">
                                        {point.desc}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-[#04330B] py-[60px] px-4 text-center">
                    <h2 className="text-white font-['Familjen_Grotesk'] text-[32px] font-bold mb-[24px]">Join the Movement for a Better Jaipur</h2>
                    <Link href="/join" className="inline-flex items-center gap-2 bg-white text-[#04330B] px-8 py-4 rounded-[8px] font-bold text-[18px] hover:bg-green-50 transition-colors">
                        Join Us <ArrowRight />
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
};

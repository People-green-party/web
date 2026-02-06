"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../components/LanguageContext";
import { Facebook, Instagram, X } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import Image from "next/image";

export default function LeadersPage() {
    const { t } = useLanguage();
    const [showMoreCommittee, setShowMoreCommittee] = useState(false);

    // Committee Members Data
    const initialCommittee = [
        { name: "Dr. Sudhanshu", role: "President", image: "/Members/CM.png" },
        { name: "Bhanwar Lal Nayak", role: "Vice President", image: "/leadersection/Bhanwar-lal-ji.png" },
        { name: "Naseem Ansari", role: "Vice President", image: "/nassem-removebg-preview.png" },
        { name: "Adv. Kapil", role: "Gen. Secretary", image: "/kapil-removebg-preview.png" },
        { name: "Er. Gaurav", role: "Secretary", image: "/Gaurav-removebg-preview.png" },
        { name: "Dr. Tanmay", role: "Gen. Secretary", image: "/Tanmay-removebg-preview.png" },
        { name: "Satish Nagpal", role: "Pradesh Adhyaksh Rajasthan", image: "/Satish-removebg-preview.png" },
        { name: "Dr. Hari Singh Chauhan", role: "Vice President", image: "/Hari-removebg-preview.png" }
    ];

    const extraCommittee = [
        { name: "Amit Verma", role: "Executive Member", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
        { name: "Sunita Gupta", role: "Secretary", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
        { name: "Rajesh Kumar", role: "Coordinator", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
        { name: "Priya Singh", role: "Spokesperson", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" }
    ];

    const allCommittee = [...initialCommittee, ...extraCommittee];

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />

            {/* Spacer for Navbar */}
            <div className="h-[70px] lg:h-[90px]"></div>

            <section className="bg-white mt-[40px] lg:mt-[60px] w-full flex justify-center pb-20">
                <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-center">

                    {/* Header First */}
                    <div className="flex flex-col items-center gap-[16px] mb-[32px] lg:mb-[64px]">
                        <ScrollReveal animation="fade-up" duration={800}>
                            <h2 className="w-full text-center font-[family-name:var(--font-inter)] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] whitespace-normal lg:whitespace-nowrap">
                                {t.committee.title}
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-up" duration={800} delay={200}>
                            <p className="max-w-[572px] w-full text-center font-[family-name:var(--font-inter)] font-semibold text-[16px] lg:text-[24px] leading-[24px] lg:leading-[30px] tracking-[-0.3px] text-[#587E67]">
                                {t.committee.sub}
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                        {/* Show only initial or all based on state */}
                        {(showMoreCommittee ? allCommittee : initialCommittee).map((member, index) => (
                            <ScrollReveal key={index} animation="scale-up" delay={index * 100} className="w-full mx-auto max-w-[312px]">
                                <div className="w-full h-[322px] rounded-[8px] border border-[#B9D3C4] p-[20px] flex flex-col justify-between bg-white shadow-md lg:shadow-[0px_4px_20px_0px_#0000001A] transition-all duration-300 ease-out hover:shadow-[0px_8px_30px_0px_#00000020] hover:-translate-y-1 cursor-pointer">
                                    <div className="flex flex-col gap-[4px] mb-[20px]">
                                        <h3 className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                                            {member.name}
                                        </h3>
                                        <p className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
                                            {member.role}
                                        </p>
                                    </div>
                                    <div className="relative w-full h-[226px] rounded-[8px] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)' }}>
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-contain object-bottom"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                        {index === 0 && (
                                            <div className="absolute bottom-[16px] left-[16px] flex gap-[12px] z-10">
                                                <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <Facebook size={16} className="text-[#04330B]" />
                                                </div>
                                                <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <Instagram size={16} className="text-[#04330B]" />
                                                </div>
                                                <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <X size={16} className="text-[#04330B]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <div className="flex justify-center mt-[48px] lg:mt-[64px]">
                        <button
                            onClick={() => setShowMoreCommittee(!showMoreCommittee)}
                            className="px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors duration-300 shadow-xl"
                        >
                            {showMoreCommittee ? 'View Less' : t.committee.button}
                        </button>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}

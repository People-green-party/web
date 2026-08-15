"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../components/LanguageContext";
import { Facebook, Instagram, X } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function LeadersPage() {
    const { t } = useLanguage();
    const [showMoreCommittee, setShowMoreCommittee] = useState(false);

    const initialCommittee = [
        { name: t.committee.members.drSudhanshu, role: t.committee.roles.president, image: "/Members/Dr.Sudhanshu.png", rawName: "Dr. Sudhanshu" },
        { name: t.committee.members.bhanwarLal, role: t.committee.roles.vicePresident, image: "/Members/BhanwarLal.png", rawName: "Bhanwar Lal Nayak" },
        { name: t.committee.members.naseemAnsari, role: t.committee.roles.vicePresident, image: "/Members/NaseemAnsari.png", rawName: "Naseem Ansari" },
        { name: t.committee.members.advKapil, role: t.committee.roles.generalSecretary, image: "/Members/Adv.Kapil.png", rawName: "Adv. Kapil" },
        { name: t.committee.members.erGaurav, role: t.committee.roles.secretaryAndTreasurer, image: "/Members/Er.Gaurav.png", rawName: "Er. Gaurav" },
        { name: t.committee.members.drTanmay, role: t.committee.roles.generalSecretary, image: "/Members/Dr.Tanmay.png", rawName: "Dr. Tanmay" },
        { name: t.committee.members.satishNagpal, role: t.committee.roles.pradeshAdhyaksh, image: "/Satish-removebg-preview.png", rawName: "Satish Nagpal" },
        { name: t.committee.members.drHariSingh, role: t.committee.roles.vicePresident, image: "/Hari-removebg-preview.png", rawName: "Dr. Hari Singh Chauhan" }
    ];

    const extraCommittee = [
        { name: t.committee.members.satyanarayan, role: t.committee.roles.statePresident, image: "/Members/satyanrayan.png", rawName: "Satyanarayan Saini" },
        { name: t.committee.members.dineshSaraf, role: t.committee.roles.executiveMember, image: "/Members/dineshsaraf.png", rawName: "Dinesh Saraf" },
        { name: t.committee.members.drSuchi, role: t.committee.roles.executiveMember, image: "/Members/Dr.suchi.png", rawName: "Dr. Suchi" },
        { name: t.committee.members.rajaram, role: t.committee.roles.executiveMember, image: "/Members/RajaramNayak.png", rawName: "Rajaram Nayak" },
        { name: t.committee.members.rajendra, role: t.committee.roles.executiveMember, image: "/Members/RajendraMeena.png", rawName: "Rajendra Meena" },
        { name: t.committee.members.shankerLal, role: t.committee.roles.executiveMember, image: "/Members/shankerlal.png", rawName: "Shanker Lal" },
        { name: t.committee.members.pawanMehar, role: t.committee.roles.executiveMember, image: "/Members/PawanMehar.png", rawName: "Pawan Mehar" }
    ];

    const allCommittee = [...initialCommittee, ...extraCommittee];

    return (
        <div className="bg-white min-h-screen font-['Familjen_Grotesk']">
            <Navbar />

            {/* Spacer for Navbar */}
            <div className="h-[70px] lg:h-[90px]"></div>

            <section className="bg-white mt-[40px] lg:mt-[60px] w-full flex justify-center pb-20">
                <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-center">

                    {/* Header First */}
                    <div className="flex flex-col items-center gap-[16px] mb-[32px] lg:mb-[64px]">
                        <ScrollReveal animation="fade-up" duration={800}>
                            <h2 className="w-full text-center font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] whitespace-normal lg:whitespace-nowrap">
                                {t.committee.title}
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-up" duration={800} delay={200}>
                            <p className="w-full text-center font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[24px] whitespace-normal md:whitespace-nowrap tracking-[-0.3px] text-[#587E67]">
                                {t.committee.sub}
                            </p>
                        </ScrollReveal>
                        <ScrollReveal animation="fade-up" duration={800} delay={300}>
                            <div className="mt-8 w-full max-w-[800px] flex justify-center">
                                <img src="/Members/Leaders.jpeg" alt="Leaders" className="w-full h-auto object-contain rounded-lg shadow-md" />
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                        {/* Show only initial or all based on state */}
                        {(showMoreCommittee ? allCommittee : initialCommittee).map((member, index) => (
                            <ScrollReveal key={index} animation="scale-up" delay={index * 100} className="w-full mx-auto max-w-[312px]">
                                <div className="w-full h-[322px] rounded-[8px] border border-[#B9D3C4] p-[20px] flex flex-col justify-between bg-white shadow-md lg:shadow-[0px_4px_20px_0px_#0000001A] transition-all duration-300 ease-out hover:shadow-[0px_8px_30px_0px_#00000020] hover:-translate-y-1 cursor-pointer">
                                    <div className="flex flex-col gap-[4px] mb-[20px]">
                                        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                                            {member.name}
                                        </h3>
                                        <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
                                            {member.role}
                                        </p>
                                    </div>
                                    <div className="relative w-full h-[226px] rounded-[8px] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 100%)' }}>
                                        <img src={member.image} alt={member.rawName} className={`absolute bottom-0 w-full h-[95%] object-contain object-bottom ${member.rawName === 'Satish Nagpal' ? 'scale-[1.2] origin-bottom -translate-y-3' : ['Dr. Hari Singh Chauhan', 'Rajaram Nayak'].includes(member.rawName) ? 'scale-110 origin-bottom' : ''}`} onError={(e) => (e.currentTarget.src = 'https://placehold.co/272x226/E8F3EC/587E67?text=Photo')} />
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

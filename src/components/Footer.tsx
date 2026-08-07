"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    MapPin, Phone, Mail, Youtube, Facebook, Instagram, X
} from 'lucide-react';
import { useLanguage } from "./LanguageContext";
import ScrollReveal from './ScrollReveal';

const SocialIcon = ({ Icon, href }: { Icon: any, href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-[48px] h-[48px] rounded-[8px] border border-[#E4F2EA] bg-white p-[12px] flex items-center justify-center text-[#04330B] hover:bg-[#EAF7EE] transition-colors cursor-pointer">
        <Icon size={24} strokeWidth={1.5} />
    </a>
);

export const Footer = () => {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (typeof window !== 'undefined') {
                window.sessionStorage.setItem('scroll-to-top', 'true');
            }
            router.push('/');
        }
    };

    return (
        <footer className="bg-white pt-[60px] lg:pt-[120px] pb-[40px]">
            <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-start lg:justify-between">

                <ScrollReveal animation="fade-up" duration={800} className="flex flex-col w-full lg:w-[20%]">
                    <Link href="/" onClick={handleLogoClick}>
                        <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[150px] lg:w-[255px] h-auto lg:h-[136px] object-contain mb-[24px] cursor-pointer" />
                    </Link>

                    <div className="flex flex-col gap-[20px] w-full lg:w-[228px]">
                        <h3 className="w-full h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                            {t.footer.follow}
                        </h3>

                        <div className="w-full h-[48px] flex gap-[12px]">
                            {[
                                { Icon: Youtube, href: "https://www.youtube.com/channel/UCI6LEG8xFb2EvwvyG4qnwGg" },
                                { Icon: Facebook, href: "https://www.facebook.com/peoplesgreen" },
                                { Icon: Instagram, href: "https://www.instagram.com/drsudhanshu_green/?__pwa=1#" },
                                { Icon: X, href: "https://x.com/drsudhanshupgp" }
                            ].map((social, i) => (
                                <SocialIcon key={i} Icon={social.Icon} href={social.href} />
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" duration={800} delay={200} className="flex flex-col w-full lg:w-[35%] shrink-0 mt-10 lg:mt-0">
                    <div className="flex flex-col gap-[20px] w-full lg:w-[330px]">
                        <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                            {t.footer.useful}
                        </h3>
                        <div className="w-full flex flex-col lg:flex-row gap-[16px] lg:gap-[40px] items-start lg:items-center">
                            {[
                                { label: t.nav.home, href: "/" },
                                { label: t.nav.about, href: "/about" },
                                { label: t.nav.constitution, href: "/constitution" },
                                { label: t.nav.academy || "Academy", href: "/leadership-academy" },
                                { label: t.nav.join, href: "/join" }
                            ].map((link, i) => (
                                <a key={i} href={link.href} className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] whitespace-nowrap transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="h-[32px] lg:h-[48px]"></div>

                    <div className="flex flex-col gap-[20px] w-full lg:w-[312px]">
                        <h3 className="w-[200px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] whitespace-nowrap">
                            {t.footer.additional}
                        </h3>

                        <div className="w-full lg:w-[312px] flex flex-col gap-2 lg:gap-1">
                            {[
                                t.footer.audit,
                                t.footer.eci,
                                t.footer.criminal
                            ].map((text, i) => (
                                <a
                                    key={i}
                                    onClick={() => setIsModalOpen(true)}
                                    className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] block cursor-pointer"
                                >
                                    {text}
                                </a>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" duration={800} delay={400} className="flex flex-col w-full lg:w-[35%] shrink-0 mt-10 lg:mt-0">
                    <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] mb-[20px]">
                        {t.footer.contact}
                    </h3>

                    <div className="flex flex-col gap-[24px] lg:gap-[32px] w-full">
                        <div className="flex items-center gap-[12px] w-full">
                            <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                                <MapPin size={24} strokeWidth={1.5} />
                            </div>
                            <p className="w-full lg:w-[321px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                                {t.footer.address || "Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan"}
                            </p>
                        </div>

                        <div className="flex items-center gap-[16px]">
                            <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                                <Phone size={24} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col w-[151px]">
                                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">9521627701</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-[16px]">
                            <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                                <Mail size={24} strokeWidth={1.5} />
                            </div>
                            <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                                partypeoplesgreen@gmail.com
                            </p>
                        </div>

                    </div>
                </ScrollReveal>

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-[16px] p-6 lg:p-8 w-full max-w-[500px] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] text-[#04330B] mb-6 text-center">
                            Select Document Year
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            {['2016', '2017', '2018', '2020', '2021', '2022', '2023', '2024', '2025'].map((year) => (
                                <a
                                    key={year}
                                    href={`/${year}.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center py-3 rounded-[8px] bg-[#E4F2EA] text-[#04330B] font-semibold text-[16px] hover:bg-[#04330B] hover:text-white transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {year}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

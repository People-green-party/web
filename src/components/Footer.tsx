"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    MapPin, Phone, Mail, Youtube, Facebook, Instagram, X
} from 'lucide-react';
import { useLanguage } from "./LanguageContext";
import ScrollReveal from './ScrollReveal';
import { SITE_DETAILS } from "../lib/siteDetails";

const SocialIcon = ({ Icon, href }: { Icon: any, href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-[48px] h-[48px] rounded-[8px] border border-[#E4F2EA] bg-white p-[12px] flex items-center justify-center text-[#04330B] hover:bg-[#EAF7EE] transition-colors cursor-pointer">
        <Icon size={24} strokeWidth={1.5} />
    </a>
);

export const Footer = () => {
    const { language, t } = useLanguage();
    const address = language === "hi" ? SITE_DETAILS.addressHi : SITE_DETAILS.address;
    const addressLines = language === "hi" ? SITE_DETAILS.addressLinesHi : SITE_DETAILS.addressLines;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docTitle, setDocTitle] = useState("Select Document Year");
    const pathname = usePathname();
    const router = useRouter();

    const openDocModal = (title: string) => {
        setDocTitle(title);
        setIsModalOpen(true);
    };

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
        <footer className="bg-white pt-[60px] lg:pt-[120px] overflow-x-hidden">
            <div className="w-full max-w-[1380px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.05fr_0.85fr_1.25fr_1.35fr] gap-10 xl:gap-8 items-start">

                <ScrollReveal animation="fade-up" duration={800} className="flex flex-col w-full min-w-0">
                    <Link href="/" onClick={handleLogoClick}>
                        <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[150px] lg:w-[220px] h-auto object-contain mb-[24px] cursor-pointer" />
                    </Link>

                    <div className="flex flex-col gap-[20px] w-full max-w-[280px]">
                        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                            {t.footer.follow}
                        </h3>

                        <div className="flex flex-nowrap gap-[8px]">
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

                <ScrollReveal animation="fade-up" duration={800} delay={200} className="flex flex-col w-full min-w-0">
                    <div className="flex flex-col gap-[20px] w-full">
                        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                            {t.footer.useful}
                        </h3>
                        <div className="grid w-full grid-cols-2 gap-x-5 gap-y-3 xl:auto-rows-[40px] xl:gap-y-0">
                            {[
                                { label: t.nav.home, href: "/" },
                                { label: t.nav.about, href: "/about" },
                                { label: t.nav.join, href: "/join" },
                                { label: language === "hi" ? "हमारा विजन" : "Our Vision", href: "/our-vision" },
                                { label: t.nav.leaders, href: "/leaders" },
                                { label: t.nav.news, href: "/news" },
                                { label: t.nav.constitution, href: "/constitution" },
                                { label: language === "hi" ? "दान करें" : "Donate", href: "/donation" },
                                { label: language === "hi" ? "वी आर अरावली" : "We Are Aravali", href: "https://wearearavali.org/" },
                                { label: language === "hi" ? "संपर्क करें" : "Contact Us", href: "/contact" },
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    target={link.href.startsWith("http") ? "_blank" : undefined}
                                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className="whitespace-nowrap font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" duration={800} delay={300} className="flex flex-col gap-[20px] w-full min-w-0">
                    <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                        {t.footer.additional}
                    </h3>

                    <div className="grid w-full items-start gap-2 xl:auto-rows-[64px] xl:gap-0">
                        {[
                            { label: t.footer.audit, title: "Audit reports and donation information — select year" },
                            { label: t.footer.eci, title: "Election Commission disclosures — select year" },
                            { label: t.footer.criminal, title: "Criminal cases disclosure — select year" },
                        ].map((item, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => openDocModal(item.title)}
                                className="flex h-fit w-fit items-start p-0 text-left font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" duration={800} delay={400} className="flex flex-col w-full min-w-0">
                    <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] mb-[20px]">
                        {t.footer.contact}
                    </h3>

                    <div className="grid w-full gap-[24px] lg:gap-[32px] xl:auto-rows-[64px] xl:gap-0">
                        <div className="flex items-start gap-[12px] w-full">
                            <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                                <MapPin size={24} strokeWidth={1.5} />
                            </div>
                            <p className="min-w-0 flex-1 font-['Familjen_Grotesk'] font-semibold text-[15px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70 break-words">
                                {addressLines.map((line) => (
                                    <span key={line} className="block lg:whitespace-nowrap">{line}</span>
                                ))}
                            </p>
                        </div>

                        <div className="flex items-center gap-[16px]">
                            <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                                <Phone size={24} strokeWidth={1.5} />
                            </div>
                            <a href={`tel:+91${SITE_DETAILS.phone}`} className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70 hover:opacity-100">
                                +91 {SITE_DETAILS.phone}
                            </a>
                        </div>

                        <div className="flex items-center gap-[16px]">
                            <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                                <Mail size={24} strokeWidth={1.5} />
                            </div>
                            <a href={`mailto:${SITE_DETAILS.email}`} className="min-w-0 break-all font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70 hover:opacity-100">
                                {SITE_DETAILS.email}
                            </a>
                        </div>

                    </div>
                </ScrollReveal>

            </div>

            <div className="mt-12 bg-[#04330B] text-white lg:mt-16">
                <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-7 lg:px-8">
                    <nav aria-label="Legal and policy links" className="flex flex-wrap items-center gap-y-3">
                        {[
                            { label: language === "hi" ? "गोपनीयता नीति" : "Privacy Policy", href: "/privacy-policy" },
                            { label: language === "hi" ? "नियम और शर्तें" : "Terms & Conditions", href: "/terms-and-conditions" },
                            { label: language === "hi" ? "रिफंड और रद्दीकरण" : "Refund & Cancellation", href: "/refund-cancellation-policy" },
                            { label: language === "hi" ? "डिलीवरी और शिपिंग नीति" : "Delivery & Shipping Policy", href: "/delivery-shipping-policy" },
                            { label: language === "hi" ? "संपर्क करें" : "Contact Us", href: "/contact" },
                        ].map((link, index) => (
                            <React.Fragment key={link.href}>
                                {index > 0 && <span aria-hidden="true" className="mx-4 h-5 w-px bg-white/35" />}
                                <Link
                                    href={link.href}
                                    className="font-['Familjen_Grotesk'] text-[15px] font-semibold text-white/75 transition-colors hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </nav>

                    <div className="flex flex-col gap-2 border-t border-white/15 pt-5 font-['Familjen_Grotesk'] text-[14px] font-medium leading-6 text-white/65 lg:flex-row lg:items-center lg:justify-between">
                        <p>{address}</p>
                        <p className="shrink-0">Copyright © {new Date().getFullYear()} {SITE_DETAILS.legalName}</p>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsModalOpen(false)}
                    role="presentation"
                >
                    <div
                        className="bg-white rounded-[16px] p-6 lg:p-8 w-full max-w-[500px] shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="document-modal-title"
                    >
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                            aria-label="Close document year selection"
                        >
                            <X size={24} />
                        </button>

                        <h3 id="document-modal-title" className="font-['Familjen_Grotesk'] font-semibold text-[24px] text-[#04330B] mb-6 text-center">
                            {docTitle}
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

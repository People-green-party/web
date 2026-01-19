"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, User, LogOut } from 'lucide-react'; // Added User icon
import { useLanguage } from "./LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { fetchApi } from "../lib/api";

interface NavbarProps {
    links?: { name: string; href: string }[];
    showAuthButtons?: boolean;
    showProfileButton?: boolean; // New Prop
    isDashboard?: boolean; // New Prop to control alignment
}

export const Navbar = ({ links: customLinks, showAuthButtons = true, showProfileButton = false, isDashboard = false }: NavbarProps) => {
    const { language, setLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('devUserId');
        }
        router.push('/');
    };

    const defaultLinks = [
        { name: t.nav.home, href: '/' },
        { name: t.nav.about, href: '/about' },
        { name: t.nav.constitution, href: '/constitution' },
        { name: t.nav.donate, href: '/donation' },
        { name: t.nav.declaration, href: '/declaration' },
    ];

    const links = customLinks || defaultLinks;

    useEffect(() => {
        let cancelled = false;

        const loadRole = async () => {
            try {
                const res: any = await fetchApi('users/me/summary');
                const role = res?.user?.role;
                if (!cancelled && role === 'Admin') {
                    setIsAdmin(true);
                }
            } catch {
                if (!cancelled) setIsAdmin(false);
            }
        };

        loadRole();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <nav className={`bg-white fixed top-0 z-50 w-full flex justify-center ${isDashboard ? '' : 'border-b border-[#E4F2EA]'}`}>
            <div className={`w-full max-w-[1320px] lg:h-[92px] h-[70px] flex items-center justify-between px-4 lg:px-0 bg-white`}>

                {/* Left Side: Logo */}
                {/* For Dashboard, we want Dashboard/Election buttons centered. 
                    The current layout is Flex Justify-Between.
                    Logo is Left, Lang/Profile is Right. 
                    Center content implies absolute centering or Flex Grow logic.
                */}

                {isDashboard ? (
                    // Dashboard Layout: Logo Left, Buttons Center, Profile/Lang Right
                    <>
                        <Link href="/" className="flex flex-col items-center leading-none cursor-pointer shrink-0">
                            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[80px] lg:w-[114px] lg:h-[60px] h-[42px] object-cover" />
                        </Link>

                        <div className="hidden lg:flex items-center justify-center gap-[12px] h-[46px] absolute left-1/2 -translate-x-1/2">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className={`w-[100px] h-[46px] flex items-center justify-center rounded-[8px] p-[12px] transition-colors font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-center whitespace-nowrap ${isActive
                                            ? 'bg-[#E8F3EC] text-[#04330B]'
                                            : 'bg-transparent text-[#587E67] hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    // Default Layout: Logo + Links Grouped Left
                    <div className="flex items-center">
                        <Link href="/" className="flex flex-col items-center leading-none cursor-pointer shrink-0">
                            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[80px] lg:w-[114px] lg:h-[60px] h-[42px] object-cover" />
                        </Link>

                        {/* Standard Links - Margin Left from Logo */}
                        <div className="hidden lg:flex items-center gap-[12px] ml-[131px] h-[46px]">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className={`w-[106px] h-[46px] flex items-center justify-center rounded-[8px] p-[12px] transition-colors font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-center whitespace-nowrap ${isActive
                                            ? 'bg-[#EAF7EE] text-[#04330B]' // Default active color
                                            : 'bg-transparent text-[#587E67] hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-[10px] lg:gap-[20px]">

                    {/* Language Toggle */}
                    <div
                        className="hidden lg:flex relative w-[84px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[4px] bg-white cursor-pointer"
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    >
                        <div className={`flex-1 rounded-[4px] text-[16px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'hi' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'}`}>
                            {language === 'hi' ? 'हि' : ''}
                        </div>
                        <div className={`flex-1 rounded-[4px] text-[16px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'en' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'}`}>
                            {language === 'en' ? 'En' : ''}
                        </div>
                    </div>

                    <div
                        className="flex lg:hidden relative w-[50px] h-[36px] rounded-[8px] border border-[#B9D3C4] items-center justify-center font-bold text-[#04330B] cursor-pointer text-sm"
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    >
                        {language === 'en' ? 'HI' : 'EN'}
                    </div>

                    {/* Admin Panel (desktop) */}
                    {isAdmin && (
                        <Link
                            href="/admin/elections"
                            className="hidden lg:flex items-center justify-center px-4 h-[38px] rounded-[8px] border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[14px] leading-[20px] tracking-[-0.2px] hover:bg-green-50 transition-colors whitespace-nowrap"
                        >
                            Admin Panel
                        </Link>
                    )}

                    {/* Profile Button with Dropdown */}
                    {showProfileButton && (
                        <div className="relative">
                            <div
                                className="hidden lg:flex items-center justify-center w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] cursor-pointer hover:bg-gray-50 text-[#04330B]"
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            >
                                <User size={24} />
                            </div>

                            {isProfileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {showAuthButtons && (
                        <>
                            <Link
                                href="/join"
                                className="hidden lg:flex w-[124px] h-[46px] items-center justify-center bg-[#0D5229] text-white font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-[#0a4220] transition-colors whitespace-nowrap"
                            >
                                {t.nav.join}
                            </Link>
                            <Link
                                href="/login"
                                className="hidden lg:flex w-[118px] h-[46px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-green-50 transition-colors whitespace-nowrap"
                            >
                                {t.nav.login}
                            </Link>
                        </>
                    )}

                    <button
                        className="lg:hidden p-2 text-gray-700 ml-auto"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg h-screen z-50">
                    {isAdmin && (
                        <Link href="/admin/elections" className="text-gray-800 font-semibold py-2 border-b border-gray-100 text-lg">
                            Admin Panel
                        </Link>
                    )}

                    {links.map((link) => (
                        <a key={link.name} href={link.href} className="text-gray-700 font-medium py-2 border-b border-gray-50 text-lg">{link.name}</a>
                    ))}

                    {showProfileButton && (
                        <button
                            onClick={handleLogout}
                            className="w-full text-left font-medium py-2 border-b border-gray-50 text-lg text-red-600 flex items-center gap-2"
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>
                    )}

                    {showAuthButtons && (
                        <div className="flex flex-col gap-4 mt-2">
                            <Link href="/join" className="w-full py-3 bg-green-900 text-white text-center rounded font-medium">
                                {t.nav.join}
                            </Link>
                            <Link href="/login" className="w-full py-3 border border-gray-300 text-gray-700 rounded font-medium text-center block">
                                {t.nav.login}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

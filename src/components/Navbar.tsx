"use client";

// Cache invalidation comment to clear Next.js server-side component pre-render caches
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, User, LogOut } from 'lucide-react'; // Added User icon
import { useLanguage } from "./LanguageContext";

interface NavbarProps {
    links?: { name: string; href: string; target?: string }[];
    showAuthButtons?: boolean;
    showProfileButton?: boolean; // New Prop
    isDashboard?: boolean; // New Prop to control alignment
}

export const Navbar = ({ links: customLinks, showAuthButtons = true, showProfileButton = false, isDashboard = false }: NavbarProps) => {
    const { language, setLanguage, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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

    const handleLogout = async () => {
        // Removed direct supabase call to avoid needing Anon Key on frontend for public pages
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('devUserId');
            window.localStorage.removeItem('access_token');
            // Manually clear Supabase auth tokens to prevent auto-login
            Object.keys(window.localStorage).forEach((key) => {
                if (key.startsWith('sb-')) {
                    window.localStorage.removeItem(key);
                }
            });
        }
        router.push('/');
        // Force reload to ensure state is cleared
        window.location.reload();
    };

    const defaultLinks = [
        { name: t.nav.home, href: '/' },
        { name: t.nav.leaders, href: '/leaders' },
        { name: t.nav.news, href: '/news' },
        { name: t.nav.constitution, href: '/constitution' },
        { name: t.nav.union || 'Unions', href: '/union' },
        { name: t.nav.youth || 'Jinda Youth', href: '/jinda-youth' },
        { name: t.nav.academy || 'Internships', href: '/leadership-academy' },
        { name: t.nav.weAreAravali, href: 'https://wearearavali.org/', target: '_blank' },
    ];

    const links = customLinks || defaultLinks;

    const isLinkActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <nav className={`bg-white fixed top-0 z-50 w-full ${isDashboard ? 'border-b border-[#04330B]/5' : ''}`}>
            <div className={`w-full relative ${isDashboard ? 'lg:h-[92px]' : 'lg:h-[90px]'} h-[70px] flex items-center justify-between gap-3 px-4 lg:px-6 xl:px-8 bg-white`}>

                {/* Left Side: Logo */}
                {/* For Dashboard, we want Dashboard/Election buttons centered. 
                    The current layout is Flex Justify-Between.
                    Logo is Left, Lang/Profile is Right. 
                    Center content implies absolute centering or Flex Grow logic.
                */}

                {/* Default Layout: Logo + Links Absolute Center */}
                {isDashboard ? (
                    // Dashboard Layout (keep as is or update if needed, but user asked for "home page jaisa")
                    // Assuming user meant mainly the public pages.
                    // For now, let's keep dashboard distinct or minimally touch it if not requested.
                    // ACTUALLY, "dashboard buttons" structure is separate block above.
                    // This block handles non-dashboard "default" layout.
                    <>
                        <div className="flex items-center shrink-0">
                            <Link href="/" onClick={handleLogoClick} className="flex flex-col items-center leading-none cursor-pointer shrink-0">
                                <img src="/PGPlogo.svg" alt="PGP Logo" className="w-auto h-[48px] sm:h-[54px] lg:h-[86px] object-contain" />
                            </Link>
                        </div>

                        <div className="hidden lg:flex flex-1 items-center justify-center gap-[4px] xl:gap-[8px] px-2 min-w-0">
                            {links.map((link) => {
                                const isActive = isLinkActive(link.href);
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target={(link as any).target}
                                        rel={(link as any).target === '_blank' ? "noopener noreferrer" : undefined}
                                        className={`flex items-center justify-center rounded-[6px] px-[8px] xl:px-[12px] 2xl:px-[16px] h-[42px] transition-colors font-['Familjen_Grotesk'] font-semibold text-[13px] xl:text-[14px] 2xl:text-[16px] leading-[22px] tracking-[-0.2px] text-center whitespace-nowrap ${isActive
                                            ? 'bg-[#EAF7EE] text-[#04330B]'
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
                    <>
                        <div className="flex items-center shrink-0">
                            <Link href="/" onClick={handleLogoClick} className="flex flex-col items-center leading-none cursor-pointer shrink-0">
                                <img src="/PGPlogo.svg" alt="PGP Logo" className="w-auto h-[48px] sm:h-[54px] lg:h-[86px] object-contain" />
                            </Link>
                        </div>

                        <div className="hidden lg:flex flex-1 items-center justify-center gap-[4px] xl:gap-[8px] px-2 min-w-0">
                            {links.map((link) => {
                                const isActive = isLinkActive(link.href);
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target={(link as any).target}
                                        rel={(link as any).target === '_blank' ? "noopener noreferrer" : undefined}
                                        className={`flex items-center justify-center rounded-[6px] px-[8px] xl:px-[12px] 2xl:px-[16px] h-[42px] transition-colors font-['Familjen_Grotesk'] font-semibold text-[13px] xl:text-[14px] 2xl:text-[16px] leading-[22px] tracking-[-0.2px] text-center whitespace-nowrap ${isActive
                                            ? 'bg-[#EAF7EE] text-[#04330B]'
                                            : 'bg-transparent text-[#587E67] hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-[8px] lg:gap-[10px] shrink-0">

                    {/* Language Toggle */}
                    <div
                        className="hidden lg:flex relative w-[60px] h-[30px] rounded-[6px] border border-[#B9D3C4] p-[2px] bg-white cursor-pointer"
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    >
                        <div className={`flex-1 rounded-[4px] text-[12px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'hi' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'}`}>
                            {language === 'hi' ? 'हि' : ''}
                        </div>
                        <div className={`flex-1 rounded-[4px] text-[12px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'en' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'}`}>
                            {language === 'en' ? 'En' : ''}
                        </div>
                    </div>

                    <div
                        className="flex lg:hidden relative w-[50px] h-[36px] rounded-[8px] border border-[#B9D3C4] items-center justify-center font-bold text-[#04330B] cursor-pointer text-sm"
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    >
                        {language === 'en' ? 'HI' : 'EN'}
                    </div>

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

                    <Link
                        href="/donation"
                        className="hidden lg:flex px-[12px] xl:px-[14px] 2xl:px-[20px] h-[42px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[13px] xl:text-[14px] 2xl:text-[16px] leading-[22px] tracking-[-0.2px] rounded-[6px] hover:bg-green-50 transition-colors whitespace-nowrap"
                    >
                        {t.nav.donate}
                    </Link>

                    {showAuthButtons && (
                        <>
                            <Link
                                href="/join"
                                className="hidden lg:flex px-[12px] xl:px-[14px] 2xl:px-[20px] h-[42px] items-center justify-center bg-[#0D5229] text-white font-['Familjen_Grotesk'] font-semibold text-[13px] xl:text-[14px] 2xl:text-[16px] leading-[22px] tracking-[-0.2px] rounded-[6px] hover:bg-[#0a4220] transition-colors whitespace-nowrap"
                            >
                                {t.nav.join}
                            </Link>
                            <Link
                                href="/login"
                                className="hidden lg:flex px-[12px] xl:px-[14px] 2xl:px-[20px] h-[42px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[13px] xl:text-[14px] 2xl:text-[16px] leading-[22px] tracking-[-0.2px] rounded-[6px] hover:bg-green-50 transition-colors whitespace-nowrap"
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
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg h-[calc(100vh-70px)] overflow-y-auto z-50">
                    {links.map((link) => {
                        const isActive = isLinkActive(link.href);
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                target={(link as any).target}
                                rel={(link as any).target === '_blank' ? "noopener noreferrer" : undefined}
                                className={`font-medium py-3 rounded-lg text-lg text-center w-full transition-colors ${isActive ? 'bg-[#EAF7EE] text-[#04330B]' : 'text-gray-700 border-b border-gray-50'
                                    }`}
                            >
                                {link.name}
                            </a>
                        );
                    })}

                    {showProfileButton && (
                        <button
                            onClick={handleLogout}
                            className="w-full font-medium py-2 border-b border-gray-50 text-lg text-red-600 flex items-center justify-center gap-2"
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>
                    )}

                    <div className="flex flex-col gap-4 mt-2">
                        <Link href="/donation" className="w-full py-3 border border-[#0D5229] text-[#0D5229] rounded font-medium text-center block">
                            {t.nav.donate}
                        </Link>
                        {showAuthButtons && (
                            <>
                                <Link href="/join" className="w-full py-3 bg-green-900 text-white text-center rounded font-medium">
                                    {t.nav.join}
                                </Link>
                                <Link href="/login" className="w-full py-3 border border-gray-300 text-gray-700 rounded font-medium text-center block">
                                    {t.nav.login}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

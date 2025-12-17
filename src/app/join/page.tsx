"use client";

import React, { useState, useContext, createContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  X,
  Play,
  Menu,
} from "lucide-react";

// --- Translations ---
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      constitution: "Constitution",
      donate: "Donate",
      declaration: "Declaration",
      join: "Join Us",
      login: "Login"
    },
    footer: {
      follow: "Follow Us",
      useful: "Useful Links",
      additional: "Additional Links",
      contact: "Contact Us",
      address: "Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan",
      audit: "Audit Report and Information About Donation",
      eci: "ECI Disclosure",
      criminal: "Declaration about criminal antecedents of candidates set up by the party"
    },
    joinPage: {
      header: {
        title: "Join Peoples Green Party",
        subtitle: "Unite for Progress, Stand for a Better Tomorrow"
      },
      form: {
        title: "Registration Form",
        subtitle: "Fill the form below to begin your journey with us.",
        firstName: "First Name",
        lastName: "Last Name",
        mobile: "Mobile Number",
        state: "State",
        district: "District",
        constituency: "Your legislative assembly constituency",
        zip: "ZIP/Postal Code",
        agreeJoin: "Do you agree to join the party?",
        agreeResponsibility: "Do you want to take any responsibility or position in the party?",
        submit: "Join Us"
      }
    }
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      constitution: "संविधान",
      donate: "दान करें",
      declaration: "घोषणा पत्र",
      join: "जुड़ें",
      login: "लॉगिन"
    },
    footer: {
      follow: "हमें फॉलो करें",
      useful: "उपयोगी लिंक",
      additional: "अतिरिक्त लिंक",
      contact: "संपर्क करें",
      address: "हम बदलेंगे भवन, 02 मिशन कंपाउंड, अजमेर पुलिया, जयपुर, राजस्थान",
      audit: "ऑडिट रिपोर्ट और दान के बारे में जानकारी",
      eci: "ECI प्रकटीकरण",
      criminal: "उम्मीदवारों के आपराधिक पूर्ववृत्त के बारे में घोषणा"
    },
    joinPage: {
      header: {
        title: "पीपल्स ग्रीन पार्टी से जुड़ें",
        subtitle: "प्रगति के लिए एकजुट हों, बेहतर कल के लिए खड़े हों"
      },
      form: {
        title: "पंजीकरण फॉर्म",
        subtitle: "हमारे साथ अपनी यात्रा शुरू करने के लिए नीचे दिया गया फॉर्म भरें।",
        firstName: "पहला नाम",
        lastName: "अंतिम नाम",
        mobile: "मोबाइल नंबर",
        state: "राज्य",
        district: "ज़िला",
        constituency: "आपकी विधान सभा निर्वाचन क्षेत्र",
        zip: "पिन कोड",
        agreeJoin: "क्या आप पार्टी में शामिल होने के लिए सहमत हैं?",
        agreeResponsibility: "क्या आप पार्टी में कोई जिम्मेदारी या पद लेना चाहते हैं?",
        submit: "जुड़ें"
      }
    }
  }
};

// --- Context Setup ---

const LanguageContext = createContext<any>(null);

const useLanguage = () => useContext(LanguageContext);

// --- Navbar Component ---
const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.constitution, href: '/constitution' },
    { name: t.nav.donate, href: '/donation' },
    { name: t.nav.declaration, href: '/declaration' },
  ];

  return (
    <nav className="bg-white fixed top-0 z-50 w-full flex justify-center">
      <div className="w-full max-w-[1320px] lg:h-[92px] h-[70px] flex items-center justify-between px-4 lg:px-0 bg-white">

        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-center leading-none cursor-pointer shrink-0">
            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[80px] lg:w-[114px] lg:h-[60px] h-[42px] object-cover" />
          </Link>

          <div className="hidden lg:flex items-center gap-[12px] ml-[131px] h-[46px]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`w-[106px] h-[46px] flex items-center justify-center rounded-[8px] p-[12px] transition-colors font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-center whitespace-nowrap ${isActive
                    ? 'bg-[#EAF7EE] text-[#04330B]'
                    : 'bg-transparent text-[#587E67] hover:bg-gray-50'
                    }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions: Mobile optimized */}
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

          <Link
            href="/join"
            className="hidden lg:flex w-[124px] h-[46px] items-center justify-center bg-[#0D5229] text-white font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-[#0a4220] transition-colors whitespace-nowrap"
          >
            {t.nav.join}
          </Link>
          <button
            className="hidden lg:flex w-[118px] h-[46px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            {t.nav.login}
          </button>

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
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-700 font-medium py-2 border-b border-gray-50 text-lg">{link.name}</a>
          ))}
          <div className="flex flex-col gap-4 mt-2">
            <Link href="/join" className="w-full py-3 bg-green-900 text-white text-center rounded font-medium">
              {t.nav.join}
            </Link>
            <button className="w-full py-3 border border-gray-300 text-gray-700 rounded font-medium">
              {t.nav.login}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Footer Component ---
const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white pt-[120px] pb-[40px] w-full">
      <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-0 flex flex-col lg:flex-row items-start">

        {/* Col 1: Logo & Socials */}
        <div className="flex flex-col w-full lg:w-[255px]">
          <Link href="/">
            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[255px] h-[136px] object-contain mb-[24px] cursor-pointer" />
          </Link>

          <div className="flex flex-col gap-[20px] w-full lg:w-[228px]">
            <h3 className="w-[228px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
              {t.footer.follow}
            </h3>

            <div className="w-[228px] h-[48px] flex gap-[12px]">
              {[Linkedin, Facebook, Instagram, X].map((Icon, i) => (
                <div key={i} className="w-[48px] h-[48px] rounded-[8px] border border-[#E4F2EA] bg-white p-[12px] flex items-center justify-center text-[#04330B] hover:bg-[#EAF7EE] transition-colors cursor-pointer">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Middle Section: Useful & Additional Links (Width 380) */}
        <div className="flex flex-col w-full lg:w-[380px] shrink-0 lg:ml-[152px] mt-10 lg:mt-0">

          {/* Useful Links Block */}
          <div className="flex flex-col gap-[20px] w-full lg:w-[330px]">
            <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
              {t.footer.useful}
            </h3>
            <div className="w-[330px] h-[22px] flex gap-[40px] items-center">
              {[
                { label: t.nav.home, href: "/" },
                { label: t.nav.about, href: "/about" },
                { label: t.nav.constitution, href: "/constitution" },
                { label: t.nav.join, href: "/join" }
              ].map((link, i) => (
                <a key={i} href={link.href} className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] whitespace-nowrap transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="h-[48px]"></div>

          {/* Additional Links Block */}
          <div className="flex flex-col gap-[20px] w-full lg:w-[312px]">
            <h3 className="w-[200px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] whitespace-nowrap">
              {t.footer.additional}
            </h3>

            <div className="w-[312px] flex flex-col gap-1">
              {[
                t.footer.audit,
                t.footer.eci,
                t.footer.criminal
              ].map((text, i) => (
                <a key={i} href="#" className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] block">
                  {text}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* 3. Right Section: Contact Us (Width 381) */}
        <div className="flex flex-col w-full lg:w-[381px] shrink-0 lg:ml-auto mt-10 lg:mt-0">
          <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] mb-[20px]">
            {t.footer.contact}
          </h3>

          <div className="flex flex-col gap-[32px] w-full lg:w-[381px]">

            {/* Address Section */}
            <div className="flex items-start gap-[12px] w-full lg:w-[381px]">
              <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <p className="flex-1 lg:w-[321px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                {t.footer.address}
              </p>
            </div>

            {/* Phone Section */}
            <div className="flex items-start gap-[16px]">
              <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                <Phone size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col w-[151px]">
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">9521627701</p>
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">9950008786</p>
              </div>
            </div>

            {/* Email Section */}
            <div className="flex items-center gap-[16px]">
              <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                joinus@peoplesgreen.org
              </p>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

// --- Join Page Content ---

const JoinPageContent = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      {/* MAIN CONTENT WRAPPER */}
      {/* Gap from Navbar: 12px */}
      <main className="w-full max-w-[1320px] px-4 lg:px-0 mt-[12px] flex flex-col items-center">

        {/* 1. Page Header Section */}
        <div className="flex flex-col items-center gap-[16px] w-full max-w-[676px] text-center">
          <h1 className="w-full font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
            {t.joinPage.header.title}
          </h1>
          <p className="w-full font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
            {t.joinPage.header.subtitle}
          </p>
        </div>

        {/* Gap between Header and Content */}
        <div className="h-[64px] w-full"></div>

        {/* 2. Content Section (Video + Form) */}
        <section className="w-full h-auto lg:h-[698px] flex flex-col lg:flex-row gap-[40px]">

          {/* Left: Video Section */}
          <div className="relative w-full lg:w-[768px] h-[400px] lg:h-[698px] rounded-[8px] overflow-hidden">
            <img
              src="/Frame 2087326335.svg"
              alt="People gathering"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: 'linear-gradient(269.13deg, rgba(0, 0, 0, 0) 2.53%, rgba(0, 0, 0, 0.15) 99.37%)'
              }}
            />
            {/* Play Button */}
            <button
              type="button"
              className="absolute inset-0 z-20 m-auto flex items-center justify-center w-[100px] h-[100px] rounded-full bg-white/90 shadow-md hover:scale-105 transition-transform"
            >
              <Play className="w-[40px] h-[40px] text-green-700 ml-1" />
            </button>
          </div>

          {/* Right: Registration Form */}
          {/* Layout: Width 512, Height 698, Gap 28, Padding 32, specific border/shadow */}
          <div
            className="w-full lg:w-[512px] h-auto lg:h-[698px] bg-white rounded-[8px] border border-[#E4F2EA] p-[32px] flex flex-col gap-[28px] shadow-[0px_4px_20px_0px_#0000001A]"
          >
            {/* Form Header Section: Width 448, Height 72, Gap 12 */}
            <div className="w-full lg:w-[448px] h-auto lg:h-[72px] flex flex-col gap-[12px] items-center">
              {/* Title: Width 448, Height 38, Size 32, Leading 38 */}
              <h2 className="w-full text-center text-[32px] leading-[38px] font-semibold tracking-[-0.3px] text-[#04330B] font-['Familjen_Grotesk']">
                {t.joinPage.form.title}
              </h2>
              {/* Subtitle: Width 380, Height 22, Size 16, Leading 22 */}
              <p className="w-full lg:w-[380px] text-center text-[16px] leading-[22px] font-semibold tracking-[-0.3px] text-[#587E67] font-['Familjen_Grotesk']">
                {t.joinPage.form.subtitle}
              </p>
            </div>

            {/* Form Content Section: Width 448, Height 534, Gap 24 */}
            <form
              className="w-full lg:w-[448px] flex flex-col items-center overflow-y-auto custom-noscroll"
              onSubmit={(e) => e.preventDefault()}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Visual Fix for scrollbar hiding using standard React pattern */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  .custom-noscroll::-webkit-scrollbar {
                    display: none;
                  }
                `}} />

              {/* Main Section: Width 448, Height ~534 (Inputs + Gap + Checkboxes) */}
              <div className="flex flex-col w-full gap-[20px]">

                {/* Input Fields Section: Width 448, Height ~464, Gap 20 */}
                <div className="flex flex-col gap-[20px] w-full">
                  {/* 1. First Name */}
                  <input
                    type="text"
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                    placeholder={t.joinPage.form.firstName}
                  />

                  {/* 2. Last Name */}
                  <input
                    type="text"
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                    placeholder={t.joinPage.form.lastName}
                  />

                  {/* 3. Mobile */}
                  <div className="w-full h-[46px] flex gap-[8px]">
                    <div className="relative h-full w-[80px]">
                      <select className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[12px] py-[12px] text-[16px] bg-white text-[#587E67] font-semibold tracking-[-0.3px] outline-none cursor-pointer">
                        <option>+91</option>
                        <option>+1</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                    <input
                      type="tel"
                      className="flex-1 h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                      placeholder={t.joinPage.form.mobile}
                    />
                  </div>

                  {/* 4. State & District - Side by Side with 14px gap */}
                  <div className="w-full h-[46px] flex gap-[14px]">
                    {/* State: flex-1 to verify ~217px width in 448px container */}
                    <div className="relative flex-1 h-full">
                      <select className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk']">
                        <option value="">{t.joinPage.form.state}</option>
                        <option>Rajasthan</option>
                        <option>Uttar Pradesh</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>

                    {/* District: flex-1 */}
                    <div className="relative flex-1 h-full">
                      <select className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk']">
                        <option value="">{t.joinPage.form.district}</option>
                        <option>Jaipur</option>
                        <option>Agra</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* 6. Constituency */}
                  <div className="relative w-full h-[46px]">
                    <select className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk']">
                      <option value="">{t.joinPage.form.constituency}</option>
                      <option>Constituency 1</option>
                      <option>Constituency 2</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                  {/* 7. ZIP */}
                  <input
                    type="text"
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                    placeholder={t.joinPage.form.zip}
                  />
                </div>

                <div className="w-full flex flex-col gap-[12px]">

                  {/* First Checkbox Item */}
                  <label className="flex items-start gap-[12px] cursor-pointer group select-none">
                    {/* Checkbox Container - 20x20 as requested */}
                    <div className="relative flex items-center justify-center shrink-0 w-[20px] h-[20px] mt-[1px]">
                      <input
                        type="checkbox"
                        className="peer h-full w-full appearance-none bg-white border-[2px] border-[#587E67] rounded-[4px] checked:bg-[#587E67] checked:border-[#587E67] focus:outline-none transition-all cursor-pointer"
                      />
                      {/* Checkmark Icon (SVG) - Scaled to 14px for 20px box */}
                      <svg
                        className="absolute w-[14px] h-[14px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>

                    <span className="flex-1 text-[14px] leading-[20px] font-semibold text-[#587E67] tracking-[-0.3px] font-['Familjen_Grotesk']">
                      {t.joinPage.form.agreeJoin}
                    </span>
                  </label>

                  {/* Second Checkbox Item */}
                  <label className="flex items-start gap-[12px] cursor-pointer group select-none">
                    {/* Checkbox Container - 20x20 as requested */}
                    <div className="relative flex items-center justify-center shrink-0 w-[20px] h-[20px] mt-[1px]">
                      <input
                        type="checkbox"
                        className="peer h-full w-full appearance-none bg-white border-[2px] border-[#587E67] rounded-[4px] checked:bg-[#587E67] checked:border-[#587E67] focus:outline-none transition-all cursor-pointer"
                      />
                      {/* Checkmark Icon (SVG) */}
                      <svg
                        className="absolute w-[14px] h-[14px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>

                    <span className="flex-1 text-[14px] leading-[20px] font-semibold text-[#587E67] tracking-[-0.3px] font-['Familjen_Grotesk']">
                      {t.joinPage.form.agreeResponsibility}
                    </span>
                  </label>

                </div>
              </div>

              {/* Gap 24px before Button */}
              <div className="h-[24px] w-full shrink-0"></div>

              {/* Join Us Button */}
              <button
                type="submit"
                className="w-full h-[46px] rounded-[8px] bg-[#0D5229] flex items-center justify-center gap-[10px] hover:bg-[#0a4220] transition-colors"
              >
                <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-white">
                  {t.joinPage.form.submit}
                </span>
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default function JoinPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: translations[language]
    }}>
      <JoinPageContent />
    </LanguageContext.Provider>
  );
}
"use client";

import Link from "next/link";
import React, { useState, useContext, createContext } from "react";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Trophy,
  HandHeart,
  Globe,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  X,
  ArrowRight,
  ArrowLeft,
  Menu,
  ChevronDown,
  Check,
} from 'lucide-react';
import { usePathname } from "next/navigation";

// --- 1. Translation Data ---

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
    hero: {
      title: "Be the Force Behind the Change",
      subtitle: "Your support turns vision into reality. Contribute today and make an impact that lasts."
    },
    form: {
      title: "Donation Form",
      subtitle: "Every Donation Brings Us Closer to a Better Tomorrow",
      existingMember: "If you are existing member?",
      placeholders: {
        name: "Name",
        mobile: "Mobile Number",
        email: "Email",
        amount: "Amount",
        country: "Country",
        state: "State",
        city: "City",
        pincode: "Pincode",
        address: "Address"
      },
      submit: "Submit"
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
    hero: {
      title: "परिवर्तन के पीछे की शक्ति बनें",
      subtitle: "आपका सहयोग विजन को हकीकत में बदलता है। आज ही योगदान करें और एक स्थायी प्रभाव डालें।"
    },
    form: {
      title: "दान फॉर्म",
      subtitle: "हर दान हमें बेहतर कल के करीब लाता है",
      existingMember: "क्या आप मौजूदा सदस्य हैं?",
      placeholders: {
        name: "नाम",
        mobile: "मोबाइल नंबर",
        email: "ईमेल",
        amount: "राशि",
        country: "देश",
        state: "राज्य",
        city: "शहर",
        pincode: "पिनकोड",
        address: "पता"
      },
      submit: "दान करें"
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
    }
  }
};

// --- 2. Context Setup ---

const LanguageContext = createContext<any>(null);

const useLanguage = () => useContext(LanguageContext);

// --- 3. Reusable Components ---

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.constitution, href: '/constitution' },
    { name: t.nav.donate, href: '/donation' },
    // { name: t.nav.declaration, href: '/declaration' },
  ];

  return (
    <nav className="bg-white fixed top-0 z-50 w-full flex justify-center">
      <div className="w-full max-w-[1320px] lg:h-[92px] h-[70px] relative flex items-center justify-between px-4 lg:px-0 bg-white">

        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-center leading-none cursor-pointer shrink-0">
            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[80px] lg:w-[114px] lg:h-[60px] h-[42px] object-cover" />
          </Link>

          <div className="hidden lg:flex items-center gap-[12px] absolute left-1/2 -translate-x-1/2 h-[46px]">
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
          <Link
            href="/login"
            className="hidden lg:flex w-[118px] h-[46px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            {t.nav.login}
          </Link>

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
            <Link href="/login" className="w-full py-3 border border-gray-300 text-gray-700 rounded font-medium text-center block">
              {t.nav.login}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white pt-[120px] pb-[40px]">
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
        {/* Gap from Left: 152px */}
        <div className="flex flex-col w-full lg:w-[380px] shrink-0 lg:ml-[152px] mt-10 lg:mt-0">

          {/* Useful Links Block */}
          <div className="flex flex-col gap-[20px] w-full lg:w-[330px]">
            <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
              {t.footer.useful}
            </h3>
            {/* Links Row: Height 22, Gap 40 */}
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

          {/* Gap: 48px */}
          <div className="h-[48px]"></div>

          {/* Additional Links Block */}
          <div className="flex flex-col gap-[20px] w-full lg:w-[312px]">
            <h3 className="w-[200px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] whitespace-nowrap">
              {t.footer.additional}
            </h3>

            {/* Content Layout: 312x88 */}
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
        {/* Gap from Middle: 152px (implied by flex spacing or explicit margin) */}
        <div className="flex flex-col w-full lg:w-[381px] shrink-0 lg:ml-auto mt-10 lg:mt-0">
          <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] mb-[20px]">
            {t.footer.contact}
          </h3>

          {/* Content Container: Gap 32px */}
          <div className="flex flex-col gap-[32px] w-full lg:w-[381px]">

            {/* Address Section */}
            <div className="flex items-start gap-[12px] w-full lg:w-[381px]">
              <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <p className="flex-1 lg:w-[321px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                {t.footer.address || "Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan"}
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

const DonationPageContent = () => {
  const { t } = useLanguage();
  const [isExistingMember, setIsExistingMember] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full flex justify-center mt-[12px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-0 flex flex-col items-center gap-[16px]">
          {/* Title */}
          <h1 className="max-w-[874px] w-full text-center font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
            {t.hero.title}
          </h1>
          {/* Subtitle */}
          <p className="max-w-[874px] w-full text-center font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Gap */}
      <div className="h-[64px] w-full"></div>

      {/* Main Content: Video + Form */}
      <section className="w-full flex justify-center">
        <div className="w-full max-w-[1320px] px-4 lg:px-0 flex flex-col lg:flex-row gap-[40px] items-stretch">

          {/* LEFT: Video Section */}
          <div className="w-full lg:w-[768px] min-h-[500px] lg:min-h-[716px] rounded-[8px] flex items-center justify-center relative bg-gray-100 overflow-hidden">
            <img
              src="/donation.png"
              alt="Donation Video Thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Optional Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Play Button */}
            <button
              type="button"
              className="absolute inset-0 z-20 m-auto flex items-center justify-center w-[100px] h-[100px] hover:scale-105 transition-transform"
            >
              <img src="/Play-Button.svg" alt="Play" className="w-full h-full" />
            </button>
          </div>

          {/* RIGHT: Donation Form */}
          <div className="flex-1 bg-white rounded-[16px] p-[32px] shadow-[0px_4px_32px_0px_#00000014] border border-[#EFF5F1] flex flex-col justify-center">
            <h2 className="text-center font-['Familjen_Grotesk'] font-bold text-[32px] text-[#04330B] mb-[8px]">
              {t.form.title}
            </h2>
            <p className="text-center font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] mb-[32px]">
              {t.form.subtitle}
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-[24px]">

              {/* Existing Member Checkbox */}
              <div
                className="flex items-center gap-[12px] cursor-pointer group"
                onClick={() => setIsExistingMember(!isExistingMember)}
              >
                <div className={`
                  w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center transition-all shrink-0
                  ${isExistingMember ? 'bg-[#587E67] border-[#587E67]' : 'border-[#587E67] bg-white'}
                `}>
                  {isExistingMember && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <label className="font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] cursor-pointer select-none">
                  {t.form.existingMember}
                </label>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="text"
                  placeholder={t.form.placeholders.name}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Mobile */}
              <div className="flex gap-[16px]">
                <div className="w-[100px] h-[56px] relative">
                  <select className="w-full h-full rounded-[8px] border border-[#C5DCCF] px-[16px] text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B]">
                    <option>+91</option>
                    <option>+1</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder={t.form.placeholders.mobile}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="email"
                  placeholder={t.form.placeholders.email}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="number"
                  placeholder={t.form.placeholders.amount}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Country & State */}
              <div className="flex gap-[16px]">
                <div className="flex-1 relative">
                  <select className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B]">
                    <option>{t.form.placeholders.country}</option>
                    <option>India</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1 relative">
                  <select className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B]">
                    <option>{t.form.placeholders.state}</option>
                    <option>Rajasthan</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
              </div>

              {/* City & Pincode */}
              <div className="flex gap-[16px]">
                <div className="flex-1 relative">
                  <select className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B]">
                    <option>{t.form.placeholders.city}</option>
                    <option>Jaipur</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t.form.placeholders.pincode}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="text"
                  placeholder={t.form.placeholders.address}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Submit */}
              <button className="w-full h-[56px] rounded-[8px] bg-[#04330B] font-['Familjen_Grotesk'] font-bold text-[18px] text-white hover:bg-[#064e11] transition-colors mt-[8px]">
                {t.form.submit}
              </button>

            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default function DonationPage() {
  const [language, setLanguage] = useState("en");

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: translations[language as keyof typeof translations]
    }}>
      <DonationPageContent />
    </LanguageContext.Provider>
  );
}
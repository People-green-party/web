"use client";

import Link from "next/link";
import React, { useState, useContext, createContext } from "react";
import {
  Play, ChevronLeft, ChevronRight, Trophy, HandHeart, Globe, Leaf,
  MapPin, Phone, Mail, Linkedin, Facebook, Instagram, X, ArrowRight, ArrowLeft, Menu
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
      titleLine1: "Constitution: Indian Peoples",
      titleLine2: "Green Party",
      subtitle: "Guiding Principles and Vision for a Just, Prosperous, and Sustainable India.",
    },
    slogan: {
      label: "The Slogan of the party is",
      text: "“Jai Bharat, Jai Jan, Jai Manavta”"
    },
    preamble: {
      title: "Article I-A : Preamble",
      subtitle: "Empowering Learners Through Online Education",
      text: "The Indian Peoples Green Party will work on the principle to develop India as a utopian state where citizens live as a single Community and a common society by peaceful means. The party will strive to construct a developed nation where citizens will follow true morals and ethics with nationalistic spirit as their religion, they will be enterprising and innovative while being honest, laborious and courageous thus provide true services for the betterment of humanity and well being of our people and as the sequel, India will lead the world."
    },
    vision: {
      title: "Article I-B: Vision, Policies and Aims",
      subtitle: "Defining the Party’s Core Philosophy for a Prosperous, Equal, and Sustainable Nation",
      items: [
        {
          heading: "People-Centric Governance & Shared Prosperity",
          text: "Jan-Khushali or Peoples Green aims to establish a political philosophy that prioritizes the happiness, well-being, and dignified life of citizens. The party advocates for education for all, healthy citizens, quality housing, fair income, and human dignity and liberty as guaranteed provisions fulfilling citizens’ basic needs. They propose that government businesses and profit-making activities be conducted through a disciplined professional limited company, making every citizen a non-transferable shareholder with annual benefits. This ensures that the people benefit from profits and prevents exploitation by executives and representatives."
        }
      ]
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
      titleLine1: "बेहतर भविष्य के लिए",
      titleLine2: "नवाचार को प्रेरित करना",
      subtitle: "सतत प्रगति और परिवर्तनकारी विचारों के लिए प्रतिबद्ध।",
    },
    slogan: {
      label: "पार्टी का नारा है",
      text: "“जय भारत, जय जन, जय मानवता”"
    },
    preamble: {
      title: "अनुच्छेद I-A: प्रस्तावना",
      subtitle: "ऑनलाइन शिक्षा के माध्यम से शिक्षार्थियों को सशक्त बनाना",
      text: "इंडियन पीपल्स ग्रीन पार्टी भारत को एक आदर्श राज्य के रूप में विकसित करने के सिद्धांत पर काम करेगी जहां नागरिक एक समुदाय और एक सामान्य समाज के रूप में शांतिपूर्ण तरीके से रहें। पार्टी एक विकसित राष्ट्र के निर्माण के लिए प्रयास करेगी जहां नागरिक अपने धर्म के रूप में राष्ट्रवादी भावना के साथ सच्चे नैतिकता और नैतिकता का पालन करेंगे, वे ईमानदार, परिश्रमी और साहसी होने के साथ-साथ उद्यमशील और नवीन होंगे, इस प्रकार मानवता की बेहतरी और हमारे लोगों की भलाई के लिए सच्ची सेवाएं प्रदान करेंगे और परिणामस्वरूप, भारत दुनिया का नेतृत्व करेगा।"
    },
    vision: {
      title: "अनुच्छेद I-B: दृष्टि, नीतियां और उद्देश्य",
      subtitle: "एक समृद्ध, समान और टिकाऊ राष्ट्र के लिए पार्टी के मुख्य दर्शन को परिभाषित करना",
      items: [
        {
          heading: "जन-केंद्रित शासन और साझा समृद्धि",
          text: "जन-खुशाली या पीपल्स ग्रीन का उद्देश्य एक ऐसा राजनीतिक दर्शन स्थापित करना है जो नागरिकों की खुशी, भलाई और गरिमापूर्ण जीवन को प्राथमिकता देता है। पार्टी सभी के लिए शिक्षा, स्वस्थ नागरिक, गुणवत्तापूर्ण आवास, उचित आय और नागरिकों की बुनियादी जरूरतों को पूरा करने वाले गारंटीकृत प्रावधानों के रूप में मानवीय गरिमा और स्वतंत्रता की वकालत करती है। उनका प्रस्ताव है कि सरकारी व्यवसायों और लाभ कमाने वाले उद्यमों को लाभ के उद्देश्यों के बजाय लोगों के हितों की सेवा करनी चाहिए।"
        }
      ]
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

// --- 4. Main Page Component ---

const ConstitutionPageContent = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pt-[70px] lg:pt-[92px]">

      <Navbar />

      {/* 1. HERO SECTION (FROM HOME PAGE) */}
      <section className="w-full flex justify-center mt-[12px]">
        <div className="w-full max-w-[1320px] relative px-4 lg:px-0 flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-[703px] shrink-0 lg:justify-between">
            {/* Image 1: Width 703, Height 246, Radius 8 */}
            <div className="flex flex-col gap-[16px] w-full mb-[48px] lg:mb-0">
              <h1 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                {t.hero.titleLine1} {t.hero.titleLine2}
              </h1>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] max-w-[476px]">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="w-full h-[246px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/herosection/hero1.svg" alt="Hero 1" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Gap: 34px */}
          <div className="hidden lg:block w-[34px] shrink-0"></div>

          {/* --- MIDDLE COLUMN: Width 291px --- 
                Contains: Image 2 + Gap 24px + Image 3
            */}
          <div className="hidden lg:flex flex-col w-[291px] shrink-0 gap-[24px]">
            {/* Image 2: Width 291, Height 256 */}
            <div className="w-full h-[256px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/herosection/hero2.svg" alt="Hero 2" className="w-full h-full object-cover" />
            </div>
            {/* Image 3: Width 291, Height 222 */}
            <div className="w-full h-[222px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/herosection/hero3.svg" alt="Hero 3" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Gap: 24px */}
          <div className="hidden lg:block w-[24px] shrink-0"></div>

          {/* --- RIGHT COLUMN: Width 278px --- 
                Contains: Image 4 + Gap 24px + Image 5
            */}
          <div className="hidden lg:flex flex-col w-[278px] shrink-0 gap-[24px]">
            {/* Image 4: Width 278, Height 230 */}
            <div className="w-full h-[230px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/herosection/hero4.svg" alt="Hero 4" className="w-full h-full object-cover" />
            </div>
            {/* Image 5: Width 278, Height 246 */}
            <div className="w-full h-[246px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/herosection/hero5.svg" alt="Hero 5" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PREAMBLE SECTION (New Layout) */}
      <section className="w-full flex flex-col items-center mt-[40px] lg:mt-[120px] relative h-auto lg:min-h-[948px] pb-[40px] lg:pb-0">

        {/* Layer 1: Image (Z-Index 10) */}
        {/* Width 1240, Height 533, Radius 16, centered */}
        <div className="relative z-10 w-full max-w-[1240px] h-auto aspect-[1240/533] rounded-[16px] overflow-hidden shadow-lg mx-4 lg:mx-0">
          <img
            src="/Constitution/Constitution-1.svg"
            alt="Preamble Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Layer 2: Green Background Section (Z-Index 0) */}
        {/* Mobile: Top 100px, Bottom 0. Desktop: Top 314px, Height 634px. */}
        <div className="absolute top-[100px] lg:top-[314px] bottom-0 lg:bottom-auto w-full lg:h-[634px] bg-[#C6E0D1] -z-0"></div>

        {/* Layer 3: Text Content (Z-Index 10) */}
        <div className="relative z-10 mt-[32px] lg:mt-[53px] flex flex-col items-center w-full max-w-[972px] px-4 lg:px-0 text-center">

          {/* Title & Subtitle Block */}
          <div className="flex flex-col items-center gap-[0px] mb-[24px] lg:mb-[44px]">
            {/* Title */}
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#0D5229]">
              {t.preamble.title}
            </h2>
            {/* Subtitle */}
            <h3 className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] mt-[8px]">
              {t.preamble.subtitle}
            </h3>
          </div>

          {/* Paragraph */}
          <p className="font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] text-center max-w-[972px]">
            {t.preamble.text}
          </p>
        </div>

      </section>

      {/* 4. VISION SECTION (Article I-B) */}
      <section className="w-full max-w-[1320px] mx-auto px-4 lg:px-0 flex flex-col mt-[40px] lg:mt-[120px]">

        {/* Header Block: Reduce gap on mobile */}
        <div className="flex flex-col gap-[0px] w-full text-left mb-[24px] lg:mb-[61px]">
          <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
            {t.vision.title}
          </h2>
          <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] mt-[0px]">
            {t.vision.subtitle}
          </p>
        </div>

        {/* Content Block: Height 304, Width 1320 (Flex Container) */}
        {/* Left: Text (882px) + Right: Image (394px) + Gap 44px */}
        <div className="w-full flex flex-col lg:flex-row items-start">
          {/* Left Column: Text & Buttons - Order 2 on Mobile */}
          <div className="flex flex-col w-full lg:max-w-[882px] order-2 lg:order-1">
            {/* Item Title */}
            <h3 className="max-w-[490px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
              {t.vision.items[0].heading}
            </h3>
            {/* Item Description */}
            <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] text-left min-h-[132px] flex items-center mt-[12px] lg:mt-0">
              {t.vision.items[0].text}
            </p>

            {/* Buttons: Gap 4px below text (from prompt) */}
            <div className="flex gap-[12px] mt-[14px]">
              <button className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#04330B] hover:bg-green-50 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <button className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#04330B] hover:bg-green-50 transition-colors">
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

          {/* Gap 44px */}
          <div className="hidden lg:block w-[44px] shrink-0 lg:order-2"></div>

          {/* Right Column: Image - Order 1 on Mobile */}
          <div className="w-full lg:w-[394px] h-[304px] rounded-[8px] shadow-[0px_4px_20px_0px_#0000001A] overflow-hidden shrink-0 order-1 lg:order-3 mb-[24px] lg:mb-0">
            <img
              src="/Constitution/Constitution-2.svg"
              alt="Vision"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. FOOTER (FROM HOME PAGE) */}
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
          <div className="flex flex-col w-full lg:w-[380px] shrink-0 lg:ml-[152px] mt-10 lg:mt-0">

            {/* Useful Links Block */}
            <div className="flex flex-col gap-[20px] w-full lg:w-[330px]">
              <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                {t.footer.useful}
              </h3>
              {/* Links Row */}
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

              {/* Content Layout */}
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

            {/* Content Container */}
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

    </div>
  );
};

export default function ConstitutionPage() {
  const [language, setLanguage] = useState("en");

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: translations[language as keyof typeof translations]
    }}>
      <ConstitutionPageContent />
    </LanguageContext.Provider>
  );
}
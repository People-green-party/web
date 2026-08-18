"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Play, ChevronLeft, ChevronRight, Trophy, HandHeart, Globe, Leaf,
  MapPin, Phone, Mail, Facebook, Instagram, X, Menu, Youtube,
  Landmark, Briefcase, HeartHandshake, BookOpen,
  Plus, ImageIcon, Users, Trees, ArrowUpRight, Info
} from 'lucide-react';
import { RajasthanImpactMap } from '@/components/RajasthanImpactMap';
import { PolicyImpactToggle } from '@/components/PolicyImpactToggle';
import { SynergyEngine } from '@/components/SynergyEngine';
import { visionCards } from '@/data/visionData';
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/components/LanguageContext";
import { translations } from "@/components/translations";
import ScrollReveal from '@/components/ScrollReveal';
import SocialMediaFeed from '@/components/SocialMediaFeed';
import VisionCarousel from '@/components/VisionCarousel';
import { HomeProgramsSection } from '@/components/HomeProgramsSection';
import { HomePgpVisionTeaser } from '@/components/HomePgpVisionTeaser';
import { Footer } from '@/components/Footer';



// --- Hero Slides Data (clubbed image + text for consistency) ---

const heroSlides = [
  {
    img: "/herosection/hero-1.jpg",
    en: {
      titleLine1: "Catalyzing innovation",
      titleLine2: "for a better future",
      subtitle: "Committed to sustainable progress and transformative ideas."
    },
    hi: {
      titleLine1: "बेहतर भविष्य के लिए",
      titleLine2: "नवाचार को प्रेरित करना",
      subtitle: "सतत प्रगति और परिवर्तनकारी विचारों के लिए प्रतिबद्ध।"
    }
  },
  {
    img: "/herosection/hero-2.jpg",
    en: {
      titleLine1: "Empowering Rural",
      titleLine2: "Communities Together",
      subtitle: "Building self-reliant villages through modern agriculture."
    },
    hi: {
      titleLine1: "ग्रामीण समुदायों को",
      titleLine2: "सशक्त बनाना",
      subtitle: "आधुनिक कृषि के माध्यम से आत्मनिर्भर गांव बनाना।"
    }
  },
  {
    img: "/herosection/hero-3.jpg",
    en: {
      titleLine1: "Green Energy",
      titleLine2: "Revolution Begins",
      subtitle: "Adopting sustainable energy for a cleaner tomorrow."
    },
    hi: {
      titleLine1: "हरित ऊर्जा",
      titleLine2: "क्रांति की शुरुआत",
      subtitle: "स्वच्छ कल के लिए स्थायी ऊर्जा अपनाना।"
    }
  },
  {
    img: "/herosection/hero-4.jpg",
    en: {
      titleLine1: "Education for All",
      titleLine2: "Knowledge is Power",
      subtitle: "Ensuring quality education reaches every child."
    },
    hi: {
      titleLine1: "सभी के लिए शिक्षा",
      titleLine2: "ज्ञान ही शक्ति है",
      subtitle: "हर बच्चे तक गुणवत्तापूर्ण शिक्षा सुनिश्चित करना।"
    }
  },
  {
    img: "/herosection/hero-5.jpg",
    en: {
      titleLine1: "Justice & Equality",
      titleLine2: "For Every Citizen",
      subtitle: "Standing up for the rights of the people."
    },
    hi: {
      titleLine1: "न्याय और समानता",
      titleLine2: "हर नागरिक के लिए",
      subtitle: "जनता के अधिकारों के लिए खड़े होना।"
    }
  }
];

// Removed local translations and context to use global ones

// --- 3. Dynamic Data Helpers ---

const getVisionCards = (lang: string) => {
  const t = lang === 'hi' ? translations.hi : translations.en;
  const cards = t.visionSection.cards;
  return cards.map((card) => ({ ...card }));
};

const CountUp = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const match = value.match(/([\d.]+)(.*)/);
          if (!match) {
            setDisplayValue(value);
            return;
          }

          const end = parseFloat(match[1]);
          const suffix = match[2];
          const duration = 3000;
          const startTime = Date.now();

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = end * ease;
            const isFloat = end % 1 !== 0;
            const formatted = isFloat ? current.toFixed(1) : Math.floor(current).toString();

            setDisplayValue(`${formatted}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(value);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{displayValue}</span>;
};

const getStats = (lang: string) => {
  const tr = lang === 'hi' ? translations.hi : translations.en;
  const t = tr.stats.items;
  const numbers = ["35K+", "60K+", "32%+", "1.2 Lakhs+"];
  return t.map((item, i) => ({ ...item, number: numbers[i] }));
};

const getCommitteeMembers = (lang: string) => {
  const tr = lang === 'hi' ? translations.hi : translations.en;
  const roles = tr.committee.roles;
  return [
    { name: "Dr. Sudhanshu", role: roles.president, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400", showSocials: true },
    { name: "Bhanwar Lal Nayak", role: roles.vicePresident, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
    { name: "Naseem Ansari", role: roles.vicePresident, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
    { name: "Adv. Kapil", role: roles.genSecretary, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    { name: "Er. Gaurav", role: roles.secretary, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { name: "Dr. Tanmay", role: roles.genSecretary, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
    { name: "Satish Nagpal", role: roles.pradeshAdhyaksh, img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400" },
    { name: "Dr. Hari Singh Chauhan", role: roles.vicePresident, img: "https://images.unsplash.com/photo-1618077553760-44ec800a6c6e?auto=format&fit=crop&q=80&w=400" },
  ];
};

// Using shared Navbar component

// --- 5. Main Page Component ---

// heroSlides array is now defined at the top of the file for easy management

const LandingPageContent = () => {
  const { language, t } = useLanguage();
  const [rotatedCards, setRotatedCards] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [offset, setOffset] = useState(-384);
  const [useMobileCards, setUseMobileCards] = useState(false);
  const [desktopTransform, setDesktopTransform] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Auto-rotate Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [t]); // Sync with language/translations

  // State for "View More" sections
  const [showMoreVision, setShowMoreVision] = useState(false);
  const [showMoreGallery, setShowMoreGallery] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setDesktopTransform(isDesktop);
      setUseMobileCards(!isDesktop);
    };

    handleResize(); // Set initial client state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldScroll = window.sessionStorage.getItem('scroll-to-top');
      if (shouldScroll === 'true') {
        window.sessionStorage.removeItem('scroll-to-top');
        // Small delay to ensure page rendering has completed
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  // Sync cards when language changes
  React.useEffect(() => {
    setRotatedCards(getVisionCards(language));
  }, [language]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset(-768);
    setTimeout(() => {
      setIsAnimating(false);
      setRotatedCards((prev) => {
        const copy = [...prev];
        const first = copy.shift();
        if (first) copy.push(first);
        return copy;
      });
      setOffset(-384);
    }, 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset(0);
    setTimeout(() => {
      setIsAnimating(false);
      setRotatedCards((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        if (last) copy.unshift(last);
        return copy;
      });
      setOffset(-384);
    }, 500);
  };

  const displayCards = rotatedCards.length > 0
    ? [rotatedCards[rotatedCards.length - 1], ...rotatedCards, rotatedCards[0]]
    : [];

  const stats = getStats(language);

  const heroIcons = [Landmark, Briefcase, HeartHandshake, BookOpen, Leaf];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-clip">

      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="w-full relative h-[650px] md:h-[700px] lg:h-[800px] mt-[70px] lg:mt-[90px]">
        {/* Slider: Each slide clubs its own image + text together */}
        <div className="absolute inset-0 overflow-hidden bg-black">
          {heroSlides.map((slide, index) => {
            // Only keep nearby slides in the DOM to cut decode/memory cost
            const isNear =
              index === currentHeroIndex ||
              index === (currentHeroIndex + 1) % heroSlides.length ||
              index === (currentHeroIndex - 1 + heroSlides.length) % heroSlides.length;
            if (!isNear && index !== 0) return null;

            return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0 pointer-events-none'
                }`}
            >
              {/* Background Image */}
              <Image
                src={slide.img}
                alt={`Hero ${index + 1}`}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
                sizes="100vw"
                quality={75}
              />
              <div className="absolute inset-0 bg-black/40 z-20" />

              {/* Text Overlay — lives INSIDE the slide so image+text are always paired */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4 pb-[180px] md:pb-[140px]">
                <div className="w-full max-w-[1320px] flex flex-col items-center text-center gap-[12px] lg:gap-[24px]">
                  <h1 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[48px] lg:text-[72px] leading-[1.1] tracking-[-0.3px] text-white max-w-[900px]">
                    {slide[language as 'en' | 'hi'].titleLine1} <br className="hidden md:block" /> {slide[language as 'en' | 'hi'].titleLine2}
                  </h1>
                  <p className="font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[24px] leading-[24px] lg:leading-[32px] tracking-[-0.3px] text-white/90 max-w-[600px]">
                    {slide[language as 'en' | 'hi'].subtitle}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Overlapping Quick Action Cards & Highlight */}
        <div className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center justify-center translate-y-[50%]">
          {/* Cards Grid */}
          <div className="w-full max-w-[1320px] bg-white/95 backdrop-blur-sm shadow-xl grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-200/50 border-t-4 border-[#0D5229] rounded-t-[4px]">
            {t.quickLinks.map((item: any, i: number) => {
              const Icon = heroIcons[i];
              return (
                <ScrollReveal key={i} animation="fade-in" delay={i * 40} className={i === 4 ? 'col-span-2 md:col-span-1 border-t md:border-t-0 border-gray-200/50' : ''}>
                  <Link
                    href={item.path}
                    className={`group flex flex-col items-center justify-center gap-2 p-4 md:p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer min-h-[160px] md:min-h-[180px] h-full bg-transparent hover:bg-white w-full`}
                  >
                    <div className="text-[#0D5229] group-hover:scale-110 transition-transform duration-300">
                      <Icon size={40} strokeWidth={1.5} />
                    </div>
                    <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[18px] leading-tight text-center text-[#04330B] px-2 whitespace-pre-line">
                      {item.title}
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Highlight Line */}
          <div className="w-full max-w-[1320px] bg-[#E85C2F] py-3 lg:py-4 flex items-center justify-center shadow-lg">
            <ScrollReveal animation="slide-left" delay={80} distance={30}>
              <h3 className="font-['Familjen_Grotesk'] font-bold text-[18px] md:text-[24px] leading-tight text-white text-center px-4">
                {t.heroTagline}
              </h3>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. VISION FOR BETTER TOMORROW */}
      <section
        id="vision"
        className="bg-white px-4 mt-[340px] md:mt-[220px] lg:mt-[200px] pb-[40px] lg:pb-[60px]"
      >
        <div className="w-full max-w-[1320px] mx-auto flex flex-col items-center">
          {/* Official PGP vision teaser (CM sir content) */}
          <HomePgpVisionTeaser />

          {/* Topic vision cards */}
          <div className="flex flex-col gap-[16px] w-full items-center text-center mb-[40px] lg:mb-[60px] pt-2 lg:pt-4">
            <ScrollReveal animation="fade-up" duration={800} className="w-full">
              <h3 className="font-['Familjen_Grotesk'] font-semibold text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] tracking-[-0.3px] text-[#04330B] text-center px-4 max-w-4xl mx-auto">
                {t.visionSection.title}
              </h3>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200} className="w-full">
              <p className="font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[18px] text-[#587E67] max-w-[800px] mx-auto text-center px-4">
                {t.visionSection.sub}
              </p>
            </ScrollReveal>
          </div>

          {/* New Image Grid Layout */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {/* Render 8 vision cards */}
            {(showMoreVision ? t.visionSection.cards : t.visionSection.cards.slice(0, 4)).map((card: any, idx: number) => (
              <ScrollReveal key={idx} animation="scale-up" delay={idx * 150} className="h-full">
                <Link
                  href={card.link || '#'}
                  className="group relative w-full min-h-[380px] lg:min-h-[420px] transition-all duration-500 cursor-pointer block"
                >
                  {/* Background Image Container */}
                  <div className="absolute inset-0 overflow-hidden rounded-[16px] shadow-md hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>

                  {/* Floating Title Box */}
                  <div className="absolute bottom-[16px] left-[50%] translate-x-[-50%] w-[92%] bg-white rounded-[12px] p-3 lg:p-4 shadow-xl flex flex-col items-center transition-all duration-500 ease-out group-hover:bottom-[24px] group-hover:scale-[1.02] border border-gray-100 z-10">
                    <div className="w-full flex items-center justify-center min-h-[42px] mb-1">
                      <h3 className="font-['Familjen_Grotesk'] font-semibold text-[15px] lg:text-[16px] leading-[1.3] text-center text-[#04330B] line-clamp-2">
                        {card.title}
                      </h3>
                    </div>
                    <div className="w-full min-h-[32px]">
                      <p className="font-['Familjen_Grotesk'] text-[11px] lg:text-[12px] leading-[1.3] text-center text-[#587E67] line-clamp-2">
                        {card.desc}
                      </p>
                    </div>
                    {/* Optional: Explore Indicator */}
                    <div className="h-0 overflow-hidden group-hover:h-[18px] transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center mt-0 group-hover:mt-1 shrink-0">
                      <span className="text-[10px] font-bold text-[#E85C2F] uppercase tracking-wider">Explore</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-[40px] lg:mt-[60px] flex justify-center w-full">
            <button
              onClick={() => setShowMoreVision(!showMoreVision)}
              className="px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors duration-300 shadow-xl"
            >
              {showMoreVision ? t.visionSection.viewLess : t.visionSection.viewMore}
            </button>
          </div>
        </div>
      </section>

      {/* 3. OUR VISION - New Carousel Section */}
      <VisionCarousel language={language} />

      {/* 3b. Unions · Jinda Youth · Internships */}
      <HomeProgramsSection
        title={t.homePrograms.title}
        subtitle={t.homePrograms.subtitle}
        cards={[
          {
            title: t.homePrograms.items.unions.title,
            description: t.homePrograms.items.unions.description,
            cta: t.homePrograms.viewMore,
            href: "/union",
            image: "/union_hero_graphic.png",
            imageAlt: t.homePrograms.items.unions.title,
            tone: "dark",
            objectFit: "cover",
          },
          {
            title: t.homePrograms.items.youth.title,
            description: t.homePrograms.items.youth.description,
            cta: t.homePrograms.viewMore,
            href: "/jinda-youth",
            image:
              language === "hi"
                ? "/jinda_youth_hero_blend_hi.png"
                : "/jinda_youth_hero_blend.png",
            imageAlt: t.homePrograms.items.youth.title,
            tone: "dark",
            objectFit: "contain",
          },
          {
            title: t.homePrograms.items.internships.title,
            description: t.homePrograms.items.internships.description,
            cta: t.homePrograms.viewMore,
            href: "/internship",
            image: "/internship/hero-students.jpg",
            imageAlt: t.homePrograms.items.internships.title,
            tone: "light",
            objectFit: "cover",
          },
        ]}
      />

      {/* 4. MEET OUR IDEOLOGICAL LEADER */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-[32px] lg:gap-0">

          {/* Text First on Mobile via flex-col order (DOM order) */}
          <div className="flex flex-col items-start text-left w-full lg:max-w-[810px] pb-0 lg:pb-[40px]">
            <div className="flex flex-col gap-[12px] lg:gap-[16px] mb-[24px] lg:mb-[40px] order-1 lg:order-none">
              <ScrollReveal animation="fade-up" duration={800}>
                <h2 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                  {t.leader.title}
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" duration={800} delay={200}>
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                  {t.leader.sub}
                </p>
              </ScrollReveal>
            </div>

            <div className="flex flex-col gap-[4px] mb-[16px] lg:mb-[24px] order-4 lg:order-none">
              <h3 className="font-['Familjen_Grotesk'] font-semibold text-[20px] lg:text-[32px] leading-[1.2] tracking-[-0.3px] text-[#0D5229]">
                {t.leader.quote}
              </h3>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                {t.leader.role}
              </p>
            </div>

            <div className="w-full mb-[24px] order-5 lg:order-none flex flex-col gap-4">
              {t.leader.bio.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[26px] lg:leading-[28px] tracking-[-0.3px] text-[#587E67] text-justify lg:text-left">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex gap-[10px] order-3 lg:order-none mb-[24px] lg:mb-0">
              <a href="https://www.facebook.com/sudhanshu.pgp1" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
                <img src="/leadersection/fb.svg" alt="Facebook" className="w-[29px] h-[29px]" />
              </a>
              <a href="https://www.instagram.com/drsudhanshu_green/?__pwa=1#" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
                <img src="/leadersection/insta.svg" alt="Instagram" className="w-[29px] h-[29px]" />
              </a>
              <a href="https://x.com/drsudhanshupgp" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
                <img src="/leadersection/x.svg" alt="X" className="w-[25px] h-[25px]" />
              </a>
              <a href="https://www.youtube.com/channel/UCI6LEG8xFb2EvwvyG4qnwGg" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
                <Youtube size={24} />
              </a>
            </div>

            {/* Mobile Image */}
            <div className="order-2 lg:hidden w-full flex justify-center mb-[24px]">
              <div className="relative w-full max-w-[400px] h-auto aspect-square group">
                <Image
                  src="/Members/Dr.Sudhanshu.png"
                  alt="Dr Sudhanshu"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 419px, 100vw"
                  className="rounded-[8px] bg-white border border-[#E8F3EC] object-cover shadow-md group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Image Second */}
          <div className="hidden lg:flex w-full lg:w-auto justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] h-auto aspect-square lg:w-[419px] lg:h-[444px] group">
              <ScrollReveal animation="fade-in" duration={1000} delay={300} className="w-full h-full">
                <Image
                  src="/Members/Dr.Sudhanshu.png"
                  alt="Dr Sudhanshu"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 419px, 100vw"
                  className="rounded-[8px] bg-white border border-[#E8F3EC] object-cover shadow-md group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-500"
                />
              </ScrollReveal>
            </div>
          </div>

        </div>
      </section >





      {/* 5. IMPACT STATS - WHITE & IMPRESSIVE */}
      {/* 
      <section className="bg-white w-full flex flex-col items-center py-[60px] lg:py-[100px] relative">

        <div className="absolute inset-0 bg-white pointer-events-none"></div>

        <div className="w-full max-w-[1320px] px-4 lg:px-8 relative z-10 flex flex-col items-start">

          <div className="w-full flex flex-col items-start text-left gap-[16px] mb-[60px]">



            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <h2 className="w-full font-['Familjen_Grotesk'] font-bold text-[36px] md:text-[48px] lg:text-[64px] leading-[1.1] text-[#04330B] lg:whitespace-nowrap">
                {t.stats.header}
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="w-full font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[20px] leading-[1.6] text-[#587E67] lg:whitespace-nowrap">
                {t.stats.sub}
              </p>
            </ScrollReveal>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat: any, idx: number) => {

              const icons = [Users, MapPin, Trees, HandHeart];
              const Icon = icons[idx] || Users;

              return (
                <ScrollReveal
                  key={idx}
                  animation="fade-up"
                  delay={idx * 100}
                  className="h-full"
                >
                  <div className="group relative h-full bg-white rounded-[20px] border border-gray-100 p-8 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(13,82,41,0.15)] hover:border-[#B9D3C4] hover:-translate-y-2">

                    <div className="absolute -right-6 -top-6 text-[#EAF7EE] opacity-50 group-hover:opacity-100 group-hover:text-[#E4F2EA] group-hover:scale-110 transition-all duration-700 pointer-events-none">
                      <Icon size={140} strokeWidth={1} />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">

                      <div>
                        <div className="w-12 h-12 mb-6 rounded-xl bg-[#F8FBF9] border border-[#E4F2EA] flex items-center justify-center text-[#0D5229] group-hover:bg-[#0D5229] group-hover:text-white transition-colors duration-300">
                          <Icon size={24} strokeWidth={2} />
                        </div>

                        <h3 className="font-['Familjen_Grotesk'] font-bold text-[42px] lg:text-[52px] leading-none tracking-tight text-[#04330B] mb-2 group-hover:text-[#0D5229] transition-colors">
                          <CountUp value={stat.number} />
                        </h3>

                        <h4 className="font-['Familjen_Grotesk'] font-bold text-[18px] text-[#587E67] uppercase tracking-wide mb-4">
                          {stat.label}
                        </h4>
                      </div>

                      <div>
                        <div className="w-12 h-[2px] bg-[#E4F2EA] group-hover:w-full group-hover:bg-[#0D5229] transition-all duration-500 mb-4" />
                        <p className="font-['Familjen_Grotesk'] text-[15px] leading-relaxed text-gray-500 group-hover:text-[#04330B] transition-colors">
                          {stat.sub}
                        </p>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>
      */}

      {/* RAJASTHAN IMPACT MAP - Visualizing state-wide presence */}
      {/* <RajasthanImpactMap language={language} /> */}

      {/* POLICY IMPACT TOGGLE - Comparative choice after seeing the map */}
      {/* <PolicyImpactToggle language={language} /> */}

      {/* 6. NEWS AND PUBLICATIONS - Responsive Fix */}
      {/* 6. SOCIAL MEDIA FEED - Replaced News Section */}
      <SocialMediaFeed language={language} />

      {/* 7. GALLERY SECTION - REDESIGNED */}
      <section className="bg-[#FFFFFF] w-full flex flex-col items-center py-[30px] lg:py-[50px] relative overflow-hidden">

        {/* Decorative Background Elements (Consistent with other sections) */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFFFFF] rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFFFFF] rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-center relative z-10">

          {/* Header */}
          <div className="flex flex-col gap-[16px] w-full items-center text-center mb-[50px] lg:mb-[70px]">


            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <h2 className="font-['Familjen_Grotesk'] font-bold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] tracking-[-0.3px] text-[#04330B]">
                {t.gallery.title}
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[20px] text-[#587E67] max-w-[800px]">
                {t.gallery.sub}
              </p>
            </ScrollReveal>
          </div>

          {/* Bento Grid Layout */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] lg:auto-rows-[240px] gap-4 lg:gap-6">
            {[
              "/GIF/GIF-1.gif",
              "/GIF/GIF-2.gif",
              "/GIF/GIF-3.gif",
              "/GIF/GIF-4.gif",
              "/GIF/GIF-5.gif",
              "/GIF/GIF-6.gif",
              "/GIF/GIF-7.gif",
              "/party-images/hero_trophy.jpg",
              "/party-images/hero_press.jpg",
              "/party-images/hero_stage_1.jpg",
              "/party-images/hero_stage_2.jpg",
              "/party-images/DSC_0006.JPG",
              "/party-images/DSC_0007.JPG",
              "/party-images/DSC_0008.JPG",
              "/party-images/DSC_0009.JPG",
              "/party-images/DSC_0014.JPG",
              "/party-images/DSC_0019.JPG",
              "/party-images/DSC_0020.JPG",
              "/party-images/DSC_0023.JPG",
              "/party-images/DSC_0024.JPG",
              "/party-images/DSC_0030.JPG",
              "/party-images/DSC_0031.JPG",
              "/party-images/DSC_0035.JPG",
              "/party-images/DSC_0037.JPG",
              "/party-images/DSC_0038.JPG",
              "/party-images/DSC_0039.JPG",
              "/party-images/DSC_0040.JPG",
              "/party-images/DSC_0041.JPG",
              "/party-images/DSC_0042.JPG",
              "/party-images/DSC_0043.JPG",
              "/party-images/DSC_0044.JPG",
              "/party-images/DSC_0045.JPG",
              "/party-images/DSC_0046.JPG",
              "/party-images/DSC_0047.JPG",
              "/party-images/DSC_0048.JPG",
              "/party-images/DSC_0056.JPG",
              "/party-images/DSC_0057.JPG",
              "/party-images/DSC_0059.JPG",
              "/party-images/DSC_0060.JPG",
              "/party-images/DSC_0061.JPG",
              "/party-images/DSC_0062.JPG",
              "/party-images/DSC_0063.JPG",
              "/party-images/DSC_0064.JPG",
              "/party-images/DSC_0067.JPG",
              "/party-images/DSC_0068.JPG",
              "/party-images/DSC_0072.JPG",
              "/party-images/DSC_0073.JPG",
              "/party-images/DSC_0074.JPG",
              "/party-images/DSC_0076.JPG",
              "/party-images/DSC_0078.JPG",
              "/party-images/DSC_0079.JPG",
              "/party-images/DSC_0081.JPG",
              "/party-images/DSC_0082.JPG",
              "/party-images/DSC_0085.JPG",
              "/party-images/DSC_0086.JPG",
              "/party-images/DSC_0087.JPG",
              "/party-images/DSC_0091.JPG",
              "/party-images/DSC_0092.JPG",
              "/party-images/DSC_0095.JPG",
              "/party-images/DSC_0097.JPG",
              "/party-images/DSC_0102.JPG",
              "/party-images/DSC_0103.JPG",
              "/party-images/DSC_0104.JPG",
              "/party-images/DSC_0105.JPG",
              "/party-images/DSC_0106.JPG",
              "/party-images/DSC_0107.JPG"
            ].slice(0, showMoreGallery ? 66 : 7).map((src, index) => {

              // Dynamic Class Logic for Bento Layout
              // This creates a pattern: Big, Tall, Wide, Normal, etc.
              let gridClass = "col-span-1 row-span-1"; // Default

              if (index === 0) gridClass = "md:col-span-2 md:row-span-2"; // Big Feature
              else if (index === 2) gridClass = "md:col-span-1 md:row-span-2"; // Tall
              else if (index === 5) gridClass = "md:col-span-2 md:row-span-1"; // Wide

              return (
                <ScrollReveal
                  key={index}
                  animation="fade-up"
                  delay={index * 50}
                  className={`relative group rounded-[20px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-200 ${gridClass}`}
                >
                  {/* Image */}
                  <Image
                    src={src}
                    alt={`Gallery ${index + 1}`}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    unoptimized={src.endsWith('.gif')}
                  />

                  {/* Overlay Gradient (Always there but subtle, stronger on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04330B]/90 via-[#04330B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[#EAF7EE] text-xs font-bold uppercase tracking-wider mb-1">PGP Event</p>
                        <h4 className="text-white font-['Familjen_Grotesk'] font-semibold text-lg leading-tight">
                          {index === 0 ? (language === 'hi' ? 'इवेंट हाइलाइट 1' : 'Event Highlight 1')
                            : index === 1 ? (language === 'hi' ? 'इवेंट हाइलाइट 2' : 'Event Highlight 2')
                              : index === 2 ? (language === 'hi' ? 'इवेंट हाइलाइट 3' : 'Event Highlight 3')
                                : index === 3 ? (language === 'hi' ? 'इवेंट हाइलाइट 4' : 'Event Highlight 4')
                                  : index === 4 ? (language === 'hi' ? 'इवेंट हाइलाइट 5' : 'Event Highlight 5')
                                    : index === 5 ? (language === 'hi' ? 'इवेंट हाइलाइट 6' : 'Event Highlight 6')
                                      : index === 6 ? (language === 'hi' ? 'भ्रष्टाचार के खिलाफ प्रदर्शन' : 'Protest Against Corruption')
                                        : index === 7 ? (language === 'hi' ? 'सम्मान समारोह' : 'Trophy Ceremony')
                                          : index === 8 ? (language === 'hi' ? 'प्रेस वार्ता' : 'Press Conference')
                                            : index === 9 ? (language === 'hi' ? 'महिला सशक्तीकरण' : 'Women Empowerment')
                                              : index === 10 ? (language === 'hi' ? 'जन सभा' : 'Public Gathering')
                                                : `${language === 'hi' ? 'गैलरी क्षण' : 'Gallery Moment'} ${index + 1}`}
                        </h4>
                      </div>

                      {/* Icon Button */}
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#04330B] transition-colors duration-300">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Default State Icon (Center Plus) - Disappears on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-0 pointer-events-none">
                    {/* Optional: You can keep this empty if you want a clean look, 
                    or add a subtle watermark logo here */}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="mt-[50px] lg:mt-[80px] flex justify-center w-full relative z-20">
            <ScrollReveal animation="scale-up" delay={200}>
              <button
                onClick={() => setShowMoreGallery(!showMoreGallery)}
                className="group relative px-[40px] py-[16px] bg-[#04330B] overflow-hidden rounded-full shadow-lg hover:shadow-[#0D5229]/40 transition-shadow duration-300"
              >
                {/* Button Hover Fill Effect */}
                <div className="absolute inset-0 w-full h-full bg-[#0D5229] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                <div className="relative flex items-center gap-3">
                  <span className="font-['Familjen_Grotesk'] font-bold text-[16px] text-white">
                    {showMoreGallery ? t.gallery.viewLess : t.gallery.viewMore}
                  </span>
                  {showMoreGallery ? (
                    <Plus size={20} className="text-white rotate-45 transition-transform duration-300" />
                  ) : (
                    <Plus size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                  )}
                </div>
              </button>
            </ScrollReveal>
          </div>

        </div>
      </section>



      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
};

export default function Home() {
  return <LandingPageContent />;
}
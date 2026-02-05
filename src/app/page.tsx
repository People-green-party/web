"use client";

import Link from "next/link";
import React, { useState, useContext, createContext, useRef, useEffect } from "react";
import {
  Play, ChevronLeft, ChevronRight, Trophy, HandHeart, Globe, Leaf,
  MapPin, Phone, Mail, Linkedin, Facebook, Instagram, X, ArrowRight, ArrowLeft, Menu,
  Landmark, Briefcase, HeartHandshake, BookOpen
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
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
      login: "Login",
      weAreAravali: "We are Aravali",
      leaders: "Leaders"
    },
    heroSlides: [
      {
        titleLine1: "Catalyzing innovation",
        titleLine2: "for a better future",
        subtitle: "Committed to sustainable progress and transformative ideas."
      },
      {
        titleLine1: "Empowering Rural",
        titleLine2: "Communities Together",
        subtitle: "Building self-reliant villages through modern agriculture."
      },
      {
        titleLine1: "Green Energy",
        titleLine2: "Revolution Begins",
        subtitle: "Adopting sustainable energy for a cleaner tomorrow."
      },
      {
        titleLine1: "Education for All",
        titleLine2: "Knowledge is Power",
        subtitle: "Ensuring quality education reaches every child."
      },
      {
        titleLine1: "Justice & Equality",
        titleLine2: "For Every Citizen",
        subtitle: "Standing up for the rights of the people."
      }
    ],
    quickLinks: [
      { title: "Join the New Era\nof Politics", path: "/constitution" },
      { title: "Our New Rajasthan Bill Will Change the World", path: "/join" },
      { title: "War on Corruption\nHonest Government", path: "/donation" },
      { title: "Nature Conservation\nProtection of Humanity", path: "/about" },
      { title: "A Small Donation\nBoon for Change", path: "/declaration" }
    ],
    heroTagline: "Now the people's front will defeat the dishonest",
    visionSection: {
      title: "Our Vision for a Better Tomorrow",
      sub: "Advocating for change, fostering growth, and ensuring a prosperous and just society.",
      cards: [
        {
          title: "Entrepreneurial Revolution",
          desc: "Not just jobs, but creating opportunities. Every youth an entrepreneur, every panchayat a development hub.",
          image: "/herosection/hero1.svg",
          link: "/vision/agriculture"
        },
        {
          title: "New Farming – Capable Farmer",
          desc: "Less water • More production • Prosperous farmer. Transforming farming into a dignified, profitable profession.",
          image: "/herosection/hero2.svg",
          link: "/vision/conservation"
        },
        {
          title: "Empowerment of Vulnerable Groups",
          desc: "Equality is not just a promise, it's a system. Women, Dalits, and vulnerable groups at the center of power.",
          image: "/ourvision/VisionImage.svg",
          link: "/vision/population"
        },
        {
          title: "Holistic Urban-Rural Development",
          desc: "Progress where you are born. Decentralization of development, putting a stop to migration.",
          image: "/herosection/hero4.svg",
          link: "/vision/education"
        },
        {
          title: "Civil Liberties and Culture",
          desc: "Freedom is both a right and a responsibility. Building a sensitive, tolerant, and aware India.",
          image: "/herosection/hero5.svg",
          link: "/vision/energy"
        },
        {
          title: "Open Economy – Minimum Government",
          desc: "Minimum government, maximum opportunity. Freedom from License Raj, promoting individual growth.",
          image: "/herosection/hero3.svg",
          link: "/vision/women"
        },
        {
          title: "World-Class Standard of Living",
          desc: "Living with dignity is every citizen's right. Guaranteeing quality education, health, and life.",
          image: "/ourvision/VisionImage.svg",
          link: "/vision/youth"
        },
        {
          title: "Nature Conservation and Sustainable Development",
          desc: "Only if nature survives, the future survives. Today's development is tomorrow's responsibility.",
          image: "/herosection/hero2.svg",
          link: "/vision/health"
        }
      ],
      footerText: "Now the people's PGP will defeat the dishonest.",
      viewMore: "View More",
      viewLess: "View Less"
    },
    overlappingSection: {
      title: "Jaipur Vision",
      desc: "Together, we can make Jaipur a model of sustainable development and ecological harmony. Join our green movement today.",
      cards: [
        { title: "New farming capable farmer", desc: "Assist patients in recovering from injuries and surgeries." },
        { title: "Sustainable Use and Conservation", desc: "Ensuring balanced development while protecting nature." },
        { title: "Control Over Population Growth", desc: "Ensuring a Balanced Future Through Population Control." },
        { title: "Safe & Empowered Women", desc: "Ensuring safety and equal opportunities for women in all sectors." }
      ],
      expandedCards: [
        { title: "Youth Employment", desc: "Creating job opportunities for the young generation." },
        { title: "Healthcare Access", desc: "Ensuring affordable medical care for every citizen." },
        { title: "Cultural Heritage", desc: "Preserving Rajasthan's rich history and traditions." },
        { title: "Digital Literacy", desc: "Empowering rural areas with digital skills and connectivity." }
      ],
      button: "View More"
    },
    leader: {
      title: "Meet Your Ideological Leader",
      sub: "The Face of Change, The Voice of the People.",
      quote: "“The Green Talks with Dr. Sudhanshu.”",
      role: "– Dr. Sudhanshu Sharma, President",
      bio: "Dr. Sudhanshu is an Indian academician, politician, green activist, and climate change scientist. He is the co-founder of Suresh Gyan Vihar University, one of the NAAC 'A+' graded universities in Rajasthan. He also served as the founding First Vice-President of Suresh Gyan Vihar University between 2008–2010. In 2011, he founded the Bharatiya People's Green Party, based in Rajasthan, as its national president. The party is affiliated with the Naya Rajasthan think-tank and promotes the formation of a people's green zone."
    },
    stats: {
      header: "Our Growing Impact Across Rajasthan",
      sub: "Together, we can make Rajasthan a model of sustainable development and ecological harmony. Join our green movement today.",
      items: [
        { label: "Working Volunteers", sub: "People dedicated to driving impactful change across all major regions." },
        { label: "Explored Rajasthan Cities", sub: "Expanding our reach across the state through continuous field efforts." },
        { label: "Private & Domestic Land", sub: "Promoting sustainable green development within urban residential zones." },
        { label: "People Engaged", sub: "Communities actively participating in our initiatives commitment." },
      ]
    },
    news: {
      title: "News and Publications",
      sub: "Stay updated with the party’s latest statements and announcements."
    },
    committee: {
      title: "Meet Our Committee Members",
      sub: "Dedicated leaders working together to guide our vision for a sustainable future.",
      button: "View More",
      roles: {
        president: "President",
        vicePresident: "Vice President",
        genSecretary: "Gen. Secretary",
        secretary: "Secretary",
        pradeshAdhyaksh: "Pradesh Adhyaksh Rajasthan"
      }
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
  // --- HINDI TRANSLATIONS ---
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      constitution: "संविधान",
      donate: "दान करें",
      declaration: "घोषणा पत्र",
      join: "जुड़ें",
      login: "लॉगिन",
      weAreAravali: "वी आर अरावली",
      leaders: "नेतृत्व"
    },
    heroSlides: [
      {
        titleLine1: "बेहतर भविष्य के लिए",
        titleLine2: "नवाचार को प्रेरित करना",
        subtitle: "सतत प्रगति और परिवर्तनकारी विचारों के लिए प्रतिबद्ध।"
      },
      {
        titleLine1: "ग्रामीण समुदायों को",
        titleLine2: "सशक्त बनाना",
        subtitle: "आधुनिक कृषि के माध्यम से आत्मनिर्भर गांव बनाना।"
      },
      {
        titleLine1: "हरित ऊर्जा",
        titleLine2: "क्रांति की शुरुआत",
        subtitle: "स्वच्छ कल के लिए स्थायी ऊर्जा अपनाना।"
      },
      {
        titleLine1: "सभी के लिए शिक्षा",
        titleLine2: "ज्ञान ही शक्ति है",
        subtitle: "हर बच्चे तक गुणवत्तापूर्ण शिक्षा सुनिश्चित करना।"
      },
      {
        titleLine1: "न्याय और समानता",
        titleLine2: "हर नागरिक के लिए",
        subtitle: "जनता के अधिकारों के लिए खड़े होना।"
      }
    ],
    quickLinks: [
      { title: "नए युग की राजनीति\nसे जुड़िए", path: "/constitution" },
      { title: "हमारा नया राजस्थान बिल बदलेगा दुनिया", path: "/join" },
      { title: "करप्शन पर वार\nईमानदार सरकार", path: "/donation" },
      { title: "प्रकृति का संरक्षण\nमानवता की रक्षा", path: "/about" },
      { title: "थोड़ा सा दान\nबदलाव के लिए वरदान", path: "/declaration" }
    ],
    heroTagline: "अब जनता का मोर्चा पराजित करेगा बेईमानों को",
    visionSection: {
      title: "बेहतर कल के लिए हमारा दृष्टिकोण",
      sub: "बदलाव की वकालत, विकास को बढ़ावा देना और एक समृद्ध व न्यायपूर्ण समाज सुनिश्चित करना।",
      cards: [
        {
          title: "आन्त्रेप्रेन्योर क्रांति",
          desc: "नौकरी नहीं, अवसर पैदा करेंगे हर युवा बनेगा उद्यमी, हर पंचायत बनेगी विकास केंद्र",
          image: "/herosection/hero1.svg",
          link: "/vision/agriculture"
        },
        {
          title: "नई खेती – समर्थ किसान",
          desc: "कम पानी • ज़्यादा उत्पादन • समृद्ध किसान खेती को घाटे से निकालकर सम्मानजनक व्यवसाय बनाएँ",
          image: "/herosection/hero2.svg",
          link: "/vision/conservation"
        },
        {
          title: "कमजोर वर्ग का सशक्तिकरण",
          desc: "बराबरी सिर्फ़ वादा नहीं, व्यवस्था होगी महिला, दलित और कमजोर वर्ग — शक्ति के केंद्र में ",
          image: "/ourvision/VisionImage.svg",
          link: "/vision/population"
        },
        {
          title: "शहरी–ग्रामीण समग्र विकास",
          desc: "जहाँ पैदा हुए, वहीं प्रगति हो विकास का विकेंद्रीकरण, पलायन पर विराम",
          image: "/herosection/hero4.svg",
          link: "/vision/education"
        },
        {
          title: "नागरिक स्वतंत्रता और संस्कृति",
          desc: "आज़ादी अधिकार भी है, जिम्मेदारी भी संवेदनशील, सहिष्णु और जागरूक भारत",
          image: "/herosection/hero5.svg",
          link: "/vision/energy"
        },
        {
          title: "खुली अर्थव्यवस्था – न्यून सरकार",
          desc: "सरकार कम, अवसर ज़्यादा लाइसेंस-राज से मुक्ति, व्यक्ति की उड़ान।",
          image: "/herosection/hero3.svg",
          link: "/vision/women"
        },
        {
          title: "विश्व स्तरीय जीवन स्तर",
          desc: "गरिमा के साथ जीना, हर नागरिक का हक़ शिक्षा, स्वास्थ्य और जीवन की गारंटी।",
          image: "/ourvision/VisionImage.svg",
          link: "/vision/youth"
        },
        {
          title: "प्रकृति संरक्षण और सतत विकास",
          desc: "प्रकृति बचेगी, तभी भविष्य बचेगा आज का विकास, कल की ज़िम्मेदारी।",
          image: "/herosection/hero2.svg",
          link: "/vision/health"
        }
      ],
      footerText: "अब जनता की PGP बेईमानों को हराएगी।",
      viewMore: "और देखें",
      viewLess: "कम देखें"
    },
    overlappingSection: {
      title: "जयपुर विजन",
      desc: "साथ मिलकर, हम जयपुर को सतत विकास और पारिस्थितिक संतुलन का एक मॉडल बना सकते हैं। आज ही हमारे हरित आंदोलन में शामिल हों।",
      cards: [
        { title: "नई खेती में सक्षम किसान", desc: "चोटों और सर्जरी से उबरने में रोगियों की सहायता करें।" },
        { title: "प्राकृतिक संसाधनों का संरक्षण", desc: "प्रकृति की रक्षा करते हुए संतुलित विकास सुनिश्चित करना।" },
        { title: "जनसंख्या वृद्धि पर नियंत्रण", desc: "जनसंख्या नियंत्रण के माध्यम से एक संतुलित भविष्य सुनिश्चित करना।" },
        { title: "सुरक्षित और सशक्त महिलाएं", desc: "सभी क्षेत्रों में महिलाओं के लिए सुरक्षा और समान अवसर सुनिश्चित करना।" }
      ],
      expandedCards: [
        { title: "युवा रोजगार", desc: "युवा पीढ़ी के लिए नौकरी के अवसर पैदा करना।" },
        { title: "स्वास्थ्य सेवा तक पहुंच", desc: "हर नागरिक के लिए सस्ती चिकित्सा देखभाल सुनिश्चित करना।" },
        { title: "सांस्कृतिक विरासत", desc: "राजस्थान के समृद्ध इतिहास और परंपराओं का संरक्षण।" },
        { title: "डिजिटल साक्षरता", desc: "डिजिटल कौशल और कनेक्टिविटी के साथ ग्रामीण क्षेत्रों को सशक्त बनाना।" }
      ],
      button: "और देखें"
    },
    leader: {
      title: "अपने वैचारिक नेता से मिलें",
      sub: "बदलाव का चेहरा, जनता की आवाज़।",
      quote: "“डॉ. सुधांशु के साथ द ग्रीन टॉक्स।”",
      role: "– डॉ. सुधांशु शर्मा, अध्यक्ष",
      bio: "डॉ. सुधांशु एक भारतीय शिक्षाविद, राजनीतिज्ञ, हरित कार्यकर्ता और जलवायु परिवर्तन वैज्ञानिक हैं। वह सुरेश ज्ञान विहार विश्वविद्यालय के सह-संस्थापक हैं, जो राजस्थान में NAAC 'A+' ग्रेडेड विश्वविद्यालयों में से एक है। उन्होंने 2008-2010 के बीच सुरेश ज्ञान विहार विश्वविद्यालय के संस्थापक प्रथम उपाध्यक्ष के रूप में भी काम किया। 2011 में, उन्होंने राजस्थान में स्थित भारतीय पीपुल्स ग्रीन पार्टी की स्थापना की।"
    },
    stats: {
      header: "राजस्थान में हमारा बढ़ता प्रभाव",
      sub: "साथ मिलकर, हम राजस्थान को सतत विकास और पारिस्थितिक संतुलन का मॉडल बना सकते हैं।",
      items: [
        { label: "कार्यरत स्वयंसेवक", sub: "सभी प्रमुख क्षेत्रों में प्रभावशाली परिवर्तन लाने के लिए समर्पित लोग।" },
        { label: "राजस्थान के शहरों का अन्वेषण", sub: "निरंतर क्षेत्रीय प्रयासों के माध्यम से राज्य भर में अपनी पहुंच का विस्तार।" },
        { label: "निजी और घरेलू भूमि", sub: "शहरी आवासीय क्षेत्रों में सतत हरित विकास को बढ़ावा देना।" },
        { label: "जुड़े हुए लोग", sub: "समुदाय सक्रिय रूप से हमारी पहल और प्रतिबद्धता में भाग ले रहे हैं।" },
      ]
    },
    news: {
      title: "समाचार और प्रकाशन",
      sub: "पार्टी के नवीनतम बयानों और घोषणाओं से अपडेट रहें।"
    },
    committee: {
      title: "हमारी समिति के सदस्यों से मिलें",
      sub: "एक स्थायी भविष्य के लिए हमारे दृष्टिकोण का मार्गदर्शन करने वाले समर्पित नेता।",
      button: "और देखें",
      roles: {
        president: "अध्यक्ष",
        vicePresident: "उपाध्यक्ष",
        genSecretary: "महासचिव",
        secretary: "सचिव",
        pradeshAdhyaksh: "प्रदेश अध्यक्ष राजस्थान"
      }
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

// --- 3. Dynamic Data Helpers ---

const getVisionCards = (lang: string) => {
  const t = translations[lang as keyof typeof translations].visionSection.cards;
  const images = [
    "/cardsection/card-logo-1.svg",
    "/cardsection/card-logo-2.svg",
    "/cardsection/card-logo-3.svg",
    "/cardsection/card-logo-4.svg"
  ];
  return t.map((card, i) => ({ ...card, image: images[i] }));
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
  const t = translations[lang as keyof typeof translations].stats.items;
  const numbers = ["35K+", "60K+", "32%+", "1.2 Lakh+"];
  return t.map((item, i) => ({ ...item, number: numbers[i] }));
};

const getCommitteeMembers = (lang: string) => {
  const roles = translations[lang as keyof typeof translations].committee.roles;
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

// --- 4. Reusable Components ---

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.leaders, href: '/leaders' },
    { name: t.nav.constitution, href: '/constitution' },
    { name: t.nav.weAreAravali, href: 'https://wearearavali.org/', target: '_blank' },
  ];

  return (
    <nav className="bg-white fixed top-0 z-50 w-full">
      <div className="w-full lg:h-[90px] h-[70px] relative flex items-center justify-between px-4 lg:px-8 bg-white">

        {/* 1. Logo - Left */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex flex-col items-center leading-none cursor-pointer shrink-0">
            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-auto h-[60px] lg:h-[86px] object-contain" />
          </Link>
        </div>

        {/* 2. Links - Absolute Center */}
        <div className="hidden xl:flex items-center justify-center gap-[8px] absolute left-1/2 -translate-x-1/2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                target={(link as any).target}
                rel={(link as any).target === '_blank' ? "noopener noreferrer" : undefined}
                className={`flex items-center justify-center rounded-[6px] px-[20px] h-[42px] transition-colors font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.2px] text-center whitespace-nowrap ${isActive
                  ? 'bg-[#EAF7EE] text-[#04330B]'
                  : 'bg-transparent text-[#587E67] hover:bg-gray-50'
                  }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* 3. Right Side Actions - Right */}
        <div className="flex items-center gap-[10px] lg:gap-[12px] shrink-0">

          {/* Language Toggle - Smallest */}
          <div
            className="hidden xl:flex relative w-[60px] h-[30px] rounded-[6px] border border-[#B9D3C4] p-[2px] bg-white cursor-pointer"
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
            className="flex xl:hidden relative w-[50px] h-[36px] rounded-[8px] border border-[#B9D3C4] items-center justify-center font-bold text-[#04330B] cursor-pointer text-sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            {language === 'en' ? 'HI' : 'EN'}
          </div>

          {/* Buttons: Compact, auto width */}
          <Link
            href="/donation"
            className="hidden xl:flex px-[20px] h-[42px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.2px] rounded-[6px] hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            {t.nav.donate}
          </Link>

          <Link
            href="/join"
            className="hidden xl:flex px-[20px] h-[42px] items-center justify-center bg-[#0D5229] text-white font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.2px] rounded-[6px] hover:bg-[#0a4220] transition-colors whitespace-nowrap"
          >
            {t.nav.join}
          </Link>
          <Link
            href="/login"
            className="hidden xl:flex px-[20px] h-[42px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.2px] rounded-[6px] hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            {t.nav.login}
          </Link>

          <button
            className="xl:hidden p-2 text-gray-700 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg h-screen z-50">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-700 font-medium py-2 border-b border-gray-50 text-lg text-center w-full">{link.name}</a>
          ))}
          <div className="flex flex-col gap-4 mt-2">
            <Link href="/donation" className="w-full py-3 border border-[#0D5229] text-[#0D5229] rounded font-medium text-center block">
              {t.nav.donate}
            </Link>
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

// --- 5. Main Page Component ---

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
      setCurrentHeroIndex((prev) => (prev + 1) % 5); // 5 is number of hero images
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // State for "View More" sections
  const [showMoreVision, setShowMoreVision] = useState(false);
  const [showMoreOverlap, setShowMoreOverlap] = useState(false);


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
  const overlapCards = translations[language as keyof typeof translations].overlappingSection.cards;

  const heroIcons = [Landmark, Briefcase, HeartHandshake, BookOpen, Leaf];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">

      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="w-full relative h-[650px] md:h-[700px] lg:h-[800px] mt-[70px] lg:mt-[90px]">
        {/* Slider Images */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            "/herosection/hero1.svg",
            "/herosection/hero2.svg",
            "/herosection/hero3.svg",
            "/herosection/hero4.svg",
            "/herosection/hero5.svg"
          ].map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" /> {/* Dark Overlay for text readability */}
            </div>
          ))}
        </div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 pb-[180px] md:pb-[140px]"> {/* pb increased to avoid overlap */}
          <div className="w-full max-w-[1320px] flex flex-col items-center text-center gap-[12px] lg:gap-[24px]">
            <ScrollReveal animation="fade-up" duration={1000} delay={200}>
              <h1 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[48px] lg:text-[72px] leading-[1.1] tracking-[-0.3px] text-white max-w-[900px]">
                {t.heroSlides[currentHeroIndex].titleLine1} <br className="hidden md:block" /> {t.heroSlides[currentHeroIndex].titleLine2}
              </h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={1000} delay={400}>
              <p className="font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[24px] leading-[24px] lg:leading-[32px] tracking-[-0.3px] text-white/90 max-w-[600px]">
                {t.heroSlides[currentHeroIndex].subtitle}
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Overlapping Quick Action Cards & Highlight */}
        <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center justify-center translate-y-[50%]">
          {/* Cards Grid */}
          <div className="w-full max-w-[1320px] bg-white/95 backdrop-blur-sm shadow-xl grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-200/50 border-t-4 border-[#0D5229] rounded-t-[4px]">
            {t.quickLinks.map((item: any, i: number) => {
              const Icon = heroIcons[i];
              return (
                <ScrollReveal key={i} animation="fade-in" delay={600 + (i * 100)} className={i === 4 ? 'col-span-2 md:col-span-1 border-t md:border-t-0 border-gray-200/50' : ''}>
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
            <ScrollReveal animation="slide-left" delay={1200} distance={50}>
              <h3 className="font-['Familjen_Grotesk'] font-bold text-[18px] md:text-[24px] leading-tight text-white text-center px-4">
                {t.heroTagline}
              </h3>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. VISION FOR BETTER TOMORROW (Cards) */}
      {/* 2. VISION FOR BETTER TOMORROW (Replaced with Image Grid) */}
      <section className="bg-white px-4 mt-[350px] lg:mt-[280px] mb-20">
        <div className="w-full max-w-[1320px] mx-auto flex flex-col items-center">

          {/* Header */}
          <div className="flex flex-col gap-[16px] w-full items-center text-center mb-[40px] lg:mb-[60px]">
            <ScrollReveal animation="fade-up" duration={800}>
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] tracking-[-0.3px] text-[#04330B]">
                {t.visionSection.title}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[20px] text-[#587E67] max-w-[800px]">
                {t.visionSection.sub}
              </p>
            </ScrollReveal>
          </div>

          {/* New Image Grid Layout */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {(showMoreVision ? t.visionSection.cards : t.visionSection.cards.slice(0, 4)).map((card: any, idx: number) => (
              <ScrollReveal key={idx} animation="scale-up" delay={idx * 150} className="h-full">
                <Link
                  href={card.link || '#'}
                  className="group relative w-full h-[300px] lg:h-[350px] rounded-[12px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer block"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  </div>

                  {/* Floating Title Box */}
                  <div className="absolute bottom-[16px] left-[50%] translate-x-[-50%] w-[90%] bg-white rounded-[8px] p-[10px] shadow-lg flex flex-col items-center transition-all duration-500 ease-out group-hover:bottom-[24px] group-hover:scale-105">
                    <h3 className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[1.3] text-center text-[#04330B] whitespace-nowrap overflow-hidden text-ellipsis w-full py-0.5 px-2">
                      {card.title}
                    </h3>
                    <p className="font-['Familjen_Grotesk'] text-[12px] leading-[1.3] text-center text-[#587E67] line-clamp-2 mt-0.5 px-1">
                      {card.desc}
                    </p>
                    {/* Optional: Explore Indicator */}
                    <div className="h-0 overflow-hidden group-hover:h-[18px] transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center mt-0 group-hover:mt-1.5">
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

      {/* 3. OUR VISION (Restored Overlapping Layout) */}
      <section className="bg-white mt-[60px] lg:mt-[120px] w-full flex flex-col items-center">
        {/* Text First */}
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-start lg:pl-[16px]">
          <div className="flex flex-col gap-[16px] items-start text-left w-full max-w-[631px]">
            <ScrollReveal animation="fade-up" duration={800}>
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                {t.overlappingSection.title}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[26px] lg:leading-[33px] tracking-[-0.3px] text-[#587E67]">
                {t.overlappingSection.desc}
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="h-[32px] lg:h-[64px]"></div>

        <div className="w-full max-w-[1320px] relative px-4 lg:px-8">
          {/* Mobile: Stacked | Desktop: Absolute/Overlap */}
          <div className="relative w-full h-auto lg:h-[600px] flex flex-col lg:block">
            {/* Image */}
            <ScrollReveal animation="scale-up" duration={1000} className="relative lg:absolute top-0 left-0 w-full lg:w-[920px] h-[250px] md:h-[350px] lg:h-[600px] rounded-[8px] overflow-hidden bg-gray-100 z-0 mb-6 lg:mb-0">
              <img src="/ourvision/VisionImage.svg" alt="Vision" className="w-full h-full object-cover" />
            </ScrollReveal>

            {/* Cards */}
            <div className="relative lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-0 w-full lg:w-[636px] h-auto z-10 flex flex-col gap-[16px] lg:gap-[24px]">
              {overlapCards.map((item: any, i: number) => (
                <ScrollReveal
                  key={i}
                  animation="slide-left"
                  delay={i * 150}
                  className="w-full lg:w-[636px] h-auto min-h-[100px] lg:h-[116px] bg-white border border-[#E4F2EA] rounded-[8px] flex items-center shadow-md lg:shadow-[0px_4px_20px_0px_#0000001A] px-[20px] py-[24px] hover:shadow-[0px_8px_30px_0px_#00000020] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col gap-[4px]">
                    <h3 className="font-['Familjen_Grotesk'] font-bold text-[20px] lg:text-[24px] text-[#04330B]">{item.title}</h3>
                    <p className="font-['Familjen_Grotesk'] font-medium text-[14px] lg:text-[16px] text-[#587E67]">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded Vision Section - Restored */}
        {showMoreOverlap && (
          <div className="w-full max-w-[1320px] relative px-4 lg:px-8 mt-[60px] lg:mt-[100px] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="relative w-full h-auto lg:h-[600px] flex flex-col lg:block">
              {/* Image */}
              <div className="relative lg:absolute top-0 left-0 w-full lg:w-[920px] h-[250px] md:h-[350px] lg:h-[600px] rounded-[8px] overflow-hidden bg-gray-100 z-0 mb-6 lg:mb-0">
                <img src="/herosection/hero4.svg" alt="Vision Expanded" className="w-full h-full object-cover" />
              </div>

              {/* Cards */}
              <div className="relative lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-0 w-full lg:w-[636px] h-auto z-10 flex flex-col gap-[16px] lg:gap-[24px]">
                {(translations[language as keyof typeof translations].overlappingSection.expandedCards || []).map((item: any, i: number) => (
                  <div
                    key={i}
                    className="w-full lg:w-[636px] h-auto min-h-[100px] lg:h-[116px] bg-white border border-[#E4F2EA] rounded-[8px] flex items-center shadow-md lg:shadow-[0px_4px_20px_0px_#0000001A] px-[20px] py-[24px] hover:shadow-[0px_8px_30px_0px_#00000020] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col gap-[4px]">
                      <h3 className="font-['Familjen_Grotesk'] font-bold text-[20px] lg:text-[24px] text-[#04330B]">{item.title}</h3>
                      <p className="font-['Familjen_Grotesk'] font-medium text-[14px] lg:text-[16px] text-[#587E67]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Button */}
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-center mt-[32px] lg:mt-[48px]">
          <div className="hidden lg:block h-[50px] w-full"></div>
          <button
            onClick={() => setShowMoreOverlap(!showMoreOverlap)}
            className="px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors duration-300 shadow-xl"
          >
            {showMoreOverlap ? 'View Less' : t.overlappingSection.button}
          </button>
        </div>
      </section>

      {/* 4. MEET YOUR IDEOLOGICAL LEADER */}
      < section className="bg-white mt-[60px] lg:mt-[120px] w-full flex justify-center" >
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col lg:flex-row items-end justify-between gap-[32px] lg:gap-0">

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

            <div className="w-full mb-[24px] order-5 lg:order-none">
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[26px] lg:leading-[28px] tracking-[-0.3px] text-[#587E67] text-justify lg:text-left">
                {t.leader.bio}
              </p>
            </div>

            <div className="flex gap-[10px] order-3 lg:order-none mb-[24px] lg:mb-0">
              <a href="https://www.facebook.com/sudhanshu.pgp1" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
                <img src="/leadersection/fb.svg" alt="Facebook" className="w-[29px] h-[29px]" />
              </a>
              <a href="https://www.instagram.com/drsudhanshu_green/?__pwa=1#" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
                <img src="/leadersection/insta.svg" alt="Instagram" className="w-[29px] h-[29px]" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-green-50 transition-all duration-300">
                <img src="/leadersection/x.svg" alt="X" className="w-[25px] h-[25px]" />
              </a>
            </div>

            {/* Mobile Image */}
            <div className="order-2 lg:hidden w-full flex justify-center mb-[24px]">
              <div className="relative w-full max-w-[400px] h-auto aspect-square group">
                <img src="Shudhanshu.svg" alt="Dr Sudhanshu" className="w-full h-full rounded-[8px] bg-white border border-[#E8F3EC] object-cover shadow-md group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Image Second */}
          <div className="hidden lg:flex w-full lg:w-auto justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] h-auto aspect-square lg:w-[419px] lg:h-[444px] group">
              <ScrollReveal animation="fade-in" duration={1000} delay={300} className="w-full h-full">
                <img src="Shudhanshu.svg" alt="Dr Sudhanshu" className="w-full h-full rounded-[8px] bg-white border border-[#E8F3EC] object-cover shadow-md group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-500" />
              </ScrollReveal>
            </div>
          </div>

        </div>
      </section >

      {/* 5. IMPACT STATS */}
      < section className="bg-white mt-[60px] lg:mt-[120px] w-full flex flex-col items-center" >
        <div className="w-full max-w-[1320px] flex flex-col items-center px-4 lg:px-8">

          {/* Header First */}
          <div className="w-full flex flex-col items-start text-left gap-[16px] mb-[32px] lg:mb-[64px]">
            <ScrollReveal animation="fade-up" duration={800}>
              <h2 className="max-w-[1054px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                {t.stats.header}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="max-w-[1039px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                {t.stats.sub}
              </p>
            </ScrollReveal>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[24px]">
            {stats.map((stat: any, idx: number) => (
              <ScrollReveal key={idx} animation="scale-up" delay={idx * 150} className="w-full h-auto min-h-[180px] lg:min-h-[216px] bg-white border border-[#B9D3C4] rounded-[8px] px-[24px] py-[20px] flex flex-col items-start hover:shadow-lg transition-shadow">
                <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[32px] lg:text-[48px] leading-[1.2] lg:leading-[54px] tracking-[-0.1px] text-[#0D5229] mb-[8px] lg:mb-[12px]">
                  <CountUp value={stat.number} />
                </h3>
                <h4 className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[18px] lg:text-[24px] leading-[26px] lg:leading-[30px] tracking-[-0.1px] text-[#04330B] mb-[8px]">
                  {stat.label}
                </h4>
                <p className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[14px] lg:text-[20px] leading-[20px] lg:leading-[24px] tracking-[-0.1px] text-[#587E67]">
                  {stat.sub}
                </p>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section >

      {/* 6. NEWS AND PUBLICATIONS - Responsive Fix */}
      <section className="bg-white mt-[60px] lg:mt-[120px] w-full flex justify-center">
        {/* On Mobile: Flex Col / Grid. On Desktop: Absolute. */}
        <div className="relative w-full max-w-[1320px] h-auto lg:h-[45vw] xl:h-[600px] rounded-[8px] px-4 lg:px-8 mx-auto">

          {/* Header Block - Relative/Static on Mobile, Absolute on Desktop */}
          <div className="relative lg:absolute top-0 left-0 flex flex-col items-start gap-[12px] lg:gap-[16px] mb-[32px] lg:mb-0">
            <ScrollReveal animation="fade-up" duration={800}>
              <h2 className="w-full max-w-[637px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] text-left">
                {t.news.title}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="w-full max-w-[572px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[16px] lg:text-[24px] leading-[22px] lg:leading-[30px] tracking-[-0.3px] text-[#587E67] text-left">
                {t.news.sub}
              </p>
            </ScrollReveal>
          </div>

          {/* Image Grid Wrapper for Mobile / Absolute Wrapper for Desktop */}
          {/* Changed: Use percentage-based positioning for LG+ screens to be responsive */}
          <ScrollReveal animation="fade-in" duration={1200} delay={300} className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:block lg:relative lg:w-full lg:h-full">
            <div className="relative w-full aspect-[244/280] lg:absolute lg:left-[0%] lg:top-[53.3%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news1.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/188] lg:absolute lg:left-[20.3%] lg:top-[40%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news2.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/148] lg:absolute lg:left-[20.3%] lg:top-[75.3%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news3.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/141] lg:absolute lg:left-[40.7%] lg:top-[26.6%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news4.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/275] lg:absolute lg:left-[40.7%] lg:top-[54.1%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news5.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/350] lg:absolute lg:left-[61%] lg:top-[13.3%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news6.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/146] lg:absolute lg:left-[61%] lg:top-[75.6%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news7.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/178] lg:absolute lg:left-[81.4%] lg:top-[0%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news8.svg" className="w-full h-full object-fill" />
            </div>

            <div className="relative w-full aspect-[245/398] lg:absolute lg:left-[81.4%] lg:top-[33.6%] lg:w-[18.5%] lg:h-auto rounded-[8px] overflow-hidden">
              <img src="/news9.svg" className="w-full h-full object-fill" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white pt-[60px] lg:pt-[120px] pb-[40px]">
        <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-start lg:justify-between">
          <ScrollReveal animation="fade-up" duration={800} className="flex flex-col w-full lg:w-[20%]">
            <Link href="/">
              <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[150px] lg:w-[255px] h-auto lg:h-[136px] object-contain mb-[24px] cursor-pointer" />
            </Link>

            <div className="flex flex-col gap-[20px] w-full lg:w-[228px]">
              <h3 className="w-full h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                {t.footer.follow}
              </h3>

              <div className="w-full h-[48px] flex gap-[12px]">
                {[Linkedin, Facebook, Instagram, X].map((Icon, i) => (
                  <div key={i} className="w-[48px] h-[48px] rounded-[8px] border border-[#E4F2EA] bg-white p-[12px] flex items-center justify-center text-[#04330B] hover:bg-[#EAF7EE] transition-colors cursor-pointer">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
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
                  <a key={i} href="#" className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] block">
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
              <div className="flex items-start gap-[12px] w-full">
                <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                  <MapPin size={24} strokeWidth={1.5} />
                </div>
                <p className="w-full lg:w-[321px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                  {t.footer.address || "Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan"}
                </p>
              </div>

              <div className="flex items-start gap-[16px]">
                <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                  <Phone size={24} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col w-[151px]">
                  <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">9521627701</p>
                  <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">9950008786</p>
                </div>
              </div>

              <div className="flex items-center gap-[16px]">
                <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                  <Mail size={24} strokeWidth={1.5} />
                </div>
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                  joinus@peoplesgreen.org
                </p>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </footer>
    </div>
  );
};

export default function LandingPage() {
  const [language, setLanguage] = useState("en");

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: translations[language as keyof typeof translations]
    }}>
      <LandingPageContent />
    </LanguageContext.Provider>
  );
}
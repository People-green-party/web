"use client";

import Link from "next/link";
import React, { useState, useContext, createContext, useRef } from "react";
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
      titleLine1: "Catalyzing innovation",
      titleLine2: "for a better future",
      subtitle: "Committed to sustainable progress and transformative ideas.",
    },
    visionSection: {
      title: "Our Vision for a Better Tomorrow",
      sub: "Advocating for change, fostering growth, and ensuring a prosperous and just society.",
      cards: [
        {
          title: "We will achieve victory through a strategy of knowledge.",
          desc: "Building a stronger future begins with expanding access to information and learning opportunities. By encouraging critical thinking and informed decision-making, communities become more capable and confident. A knowledge-driven approach promotes growth and prosperity."
        },
        {
          title: "Your small donation will ultimately prove to be a boon for change.",
          desc: "Even the smallest contribution helps support meaningful initiatives that uplift communities. When individuals participate, the collective strength creates visible transformation. Each act of giving adds momentum to ongoing development efforts. Together, these efforts make it possible."
        },
        {
          title: "We will grow stronger! We will struggle, fight, and win till end!",
          desc: "Strength comes from unity, resilience, and a shared commitment to progress. Challenges become easier to overcome when people stand together. Continuous effort and perseverance lead to steady improvement in life. With collective courage, success becomes not just possible but inevitable."
        },
        {
          title: "Save the environment now! Increase collective sensitivity today!",
          desc: "Protecting nature requires awareness, responsibility, and timely action from every individual. By embracing sustainable habits, communities help preserve vital resources for the future. Environmental sensitivity encourages mindful choices that reduce harm and promote balance."
        }
      ],
      footerText: "Now the people's PGP will defeat the dishonest."
    },
    overlappingSection: {
      title: "Our Vision",
      desc: "Together, we can make Rajasthan a model of sustainable development and ecological harmony. Join our green movement today.",
      cards: [
        { title: "New farming capable farmer", desc: "Assist patients in recovering from injuries and surgeries." },
        { title: "Sustainable Use and Conservation", desc: "Ensuring balanced development while protecting nature." },
        { title: "Control Over Population Growth", desc: "Ensuring a Balanced Future Through Population Control." }
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
      login: "लॉगिन"
    },
    hero: {
      titleLine1: "बेहतर भविष्य के लिए",
      titleLine2: "नवाचार को प्रेरित करना",
      subtitle: "सतत प्रगति और परिवर्तनकारी विचारों के लिए प्रतिबद्ध।",
    },
    visionSection: {
      title: "बेहतर कल के लिए हमारा दृष्टिकोण",
      sub: "बदलाव की वकालत, विकास को बढ़ावा देना और एक समृद्ध व न्यायपूर्ण समाज सुनिश्चित करना।",
      cards: [
        {
          title: "हम ज्ञान की रणनीति के माध्यम से जीत हासिल करेंगे।",
          desc: "मजबूत भविष्य का निर्माण सूचना और सीखने के अवसरों तक पहुंच बढ़ाने से शुरू होता है। महत्वपूर्ण सोच और सूचित निर्णय लेने को प्रोत्साहित करके, समुदाय अधिक सक्षम और आत्मविश्वासी बनते हैं। ज्ञान-संचालित दृष्टिकोण विकास और समृद्धि को बढ़ावा देता है।"
        },
        {
          title: "आपका छोटा सा दान अंततः बदलाव के लिए वरदान साबित होगा।",
          desc: "छोटा सा योगदान भी समुदायों के उत्थान में मदद करता है। जब व्यक्ति भाग लेते हैं, तो सामूहिक शक्ति दृश्य परिवर्तन पैदा करती है। देने का प्रत्येक कार्य चल रहे विकास प्रयासों को गति देता है। साथ मिलकर, ये प्रयास इसे संभव बनाते हैं।"
        },
        {
          title: "हम मजबूत बनेंगे! हम संघर्ष करेंगे, लड़ेंगे और अंत तक जीतेंगे!",
          desc: "एकता और प्रगति के प्रति साझा प्रतिबद्धता से शक्ति आती है। जब लोग साथ खड़े होते हैं तो चुनौतियों को पार करना आसान होता है। निरंतर प्रयास और दृढ़ता जीवन में स्थिर सुधार की ओर ले जाती है। सामूहिक साहस के साथ, सफलता न केवल संभव है बल्कि अपरिहार्य हो जाती है।"
        },
        {
          title: "अब पर्यावरण बचाओ! आज ही सामूहिक संवेदनशीलता बढ़ाएं!",
          desc: "प्रकृति की रक्षा के लिए हर व्यक्ति से जागरूकता, जिम्मेदारी और समय पर कार्रवाई की आवश्यकता है। स्थायी आदतों को अपनाकर, समुदाय भविष्य के लिए महत्वपूर्ण संसाधनों को संरक्षित करने में मदद करते हैं। पर्यावरणीय संवेदनशीलता उन सचेत विकल्पों को प्रोत्साहित करती है जो नुकसान को कम करते हैं और संतुलन को बढ़ावा देते हैं।"
        }
      ],
      footerText: "अब जनता की PGP बेईमानों को हराएगी।"
    },
    overlappingSection: {
      title: "हमारा नज़रिया",
      desc: "साथ मिलकर, हम राजस्थान को सतत विकास और पारिस्थितिक संतुलन का एक मॉडल बना सकते हैं। आज ही हमारे हरित आंदोलन में शामिल हों।",
      cards: [
        { title: "नई खेती में सक्षम किसान", desc: "चोटों और सर्जरी से उबरने में रोगियों की सहायता करें।" },
        { title: "प्राकृतिक संसाधनों का संरक्षण", desc: "प्रकृति की रक्षा करते हुए संतुलित विकास सुनिश्चित करना।" },
        { title: "जनसंख्या वृद्धि पर नियंत्रण", desc: "जनसंख्या नियंत्रण के माध्यम से एक संतुलित भविष्य सुनिश्चित करना।" }
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
    { name: t.nav.about, href: '/about' },
    { name: t.nav.constitution, href: '/constitution' },
    { name: t.nav.donate, href: '/donation' },
    { name: t.nav.declaration, href: '/declaration' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 w-full flex justify-center">
      <div className="w-full max-w-[1320px] h-[92px] flex items-center justify-between px-4 lg:px-0 bg-white">

        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-center leading-none cursor-pointer shrink-0">
            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[114px] h-[60px] object-cover" />
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

        {/* Right Side Actions: Width 366, Height 46, Gap 20 */}
        <div className="flex items-center gap-[20px] w-[366px] h-[46px]">

          {/* Language Toggle: Width 84, Height 46, Gap 10, Border #B9D3C4, Padding 4px */}
          <div
            className="relative w-[84px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[4px] flex bg-white cursor-pointer"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            {/* Left Text (Hindi) - Only visible/styled if active */}
            <div className={`flex-1 rounded-[4px] text-[16px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'hi' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'
              }`}
            >
              {language === 'hi' ? 'हि' : ''}
            </div>

            {/* Right Text (English) - Only visible/styled if active */}
            <div className={`flex-1 rounded-[4px] text-[16px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'en' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'
              }`}
            >
              {language === 'en' ? 'En' : ''}
            </div>
          </div>

          <Link
            href="/join"
            className="w-[124px] h-[46px] flex items-center justify-center bg-[#0D5229] text-white font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-[#0a4220] transition-colors whitespace-nowrap"
          >
            {t.nav.join}
          </Link>
          <button
            className="w-[118px] h-[46px] flex items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-green-50 transition-colors whitespace-nowrap"
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
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-700 font-medium py-2 border-b border-gray-50">{link.name}</a>
          ))}
          <div className="flex gap-4 mt-2">
            <Link href="/join" className="flex-1 py-2 bg-green-900 text-white text-center rounded font-medium">
              {t.nav.join}
            </Link>
            <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded font-medium">
              {t.nav.login}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const SectionHeader = ({ title, sub }: { title: string, sub?: string }) => (
  <div className="text-center mb-12 max-w-3xl mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-green-950 mb-4">{title}</h2>
    {sub && <p className="text-gray-500 text-sm md:text-base">{sub}</p>}
  </div>
);

// --- 5. Main Page Component ---

const LandingPageContent = () => {
  const { language, t } = useLanguage();
  const [rotatedCards, setRotatedCards] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [offset, setOffset] = useState(-384); // Start at -384 to show the first "real" card (after the clone)

  // Sync cards when language changes
  React.useEffect(() => {
    setRotatedCards(getVisionCards(language));
  }, [language]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset(-768); // Slide Left
    setTimeout(() => {
      setIsAnimating(false);
      setRotatedCards((prev) => {
        const copy = [...prev];
        const first = copy.shift();
        if (first) copy.push(first);
        return copy;
      });
      setOffset(-384); // Reset Position instantly
    }, 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset(0); // Slide Right
    setTimeout(() => {
      setIsAnimating(false);
      setRotatedCards((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        if (last) copy.unshift(last);
        return copy;
      });
      setOffset(-384); // Reset Position instantly
    }, 500);
  };

  // Prepare display cards: [Last, ...Cards, First] for seamless transition
  const displayCards = rotatedCards.length > 0
    ? [rotatedCards[rotatedCards.length - 1], ...rotatedCards, rotatedCards[0]]
    : [];

  const stats = getStats(language);
  const committeeMembers = getCommitteeMembers(language);
  const overlapCards = translations[language as keyof typeof translations].overlappingSection.cards;

  // List of news images for sequence mapping
  const newsImages = [
    "/news1.svg", "/news2.svg", "/news3.svg",
    "/news4.svg", "/news5.svg", "/news6.svg",
    "/news7.svg", "/news8.svg", "/news9.svg"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      <Navbar />

      {/* 1. HERO SECTION */}
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

      {/* 2. VISION FOR BETTER TOMORROW (Cards) */}
      {/* Gap from Hero Section: 120px */}
      <section className="bg-white px-4 mt-[120px]">
        {/* Layout: Width 1320 (max), centered */}
        <div className="w-full max-w-[1320px] mx-auto flex flex-col items-center">

          {/* Header Section: Width 1320, Height 112, Gap 16 */}
          <div className="flex flex-col gap-[16px] w-full items-center text-center">
            {/* Title: Width 1010, Height 72 */}
            <h2 className="w-full max-w-[1010px] font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
              {t.visionSection.title}
            </h2>
            {/* Subtitle: Width 1320, Height 24 */}
            <p className="w-full font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
              {t.visionSection.sub}
            </p>
          </div>

          {/* Gap below header: 64px */}
          <div className="w-full h-[64px]"></div>

          {/* Cards Section: Hidden Overflow Container */}
          <div className="w-full overflow-hidden">
            <div
              className={`flex gap-[16px] ${isAnimating ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ transform: `translateX(${offset}px)` }}
            >
              {displayCards.slice(0, 6).map((card: any, idx: number) => (
                /* Card Layout: Width 360, Height 364. Border #B9D3C4. Padding 24px. */
                <div
                  key={idx}
                  className="w-[360px] h-[364px] border border-[#B9D3C4] rounded-[8px] p-[24px] flex flex-col items-start bg-white hover:shadow-lg transition-shadow shrink-0"
                >
                  {/* Logo: Width 48, Height 48 */}
                  <div className="w-[48px] h-[48px] flex items-center justify-center mb-[16px]">
                    <img src={card.image} alt="icon" className="w-[48px] h-[48px] object-contain" />
                  </div>

                  {/* Content Container: Width 312 */}
                  <div className="flex flex-col gap-[8px] w-full">
                    {/* Title */}
                    <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] min-h-[60px] lg:min-h-[90px]">
                      {card.title}
                    </h3>

                    {/* Desc */}
                    <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Section: Gap 48px from cards */}
          <div className="w-full flex flex-col items-center mt-[48px]">
            {/* Text: Width 415, Height 24 */}
            <p className="w-[415px] text-center font-['Inter'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] whitespace-nowrap">
              {t.visionSection.footerText}
            </p>

            {/* Gap: 24px */}
            <div className="h-[24px]"></div>

            {/* Buttons: Width 104, Height 46 (gap 12) -> Two 46x46 buttons */}
            <div className="flex gap-[12px]">
              <button
                onClick={handlePrev}
                className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#04330B] hover:bg-green-50 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#04330B] hover:bg-green-50 transition-colors"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR VISION (Overlapping Layout) */}
      <section className="bg-white mt-[120px] w-full flex flex-col items-center">
        {/* Header Container: Width 1320, Left Aligned with 16px Padding */}
        <div className="w-full max-w-[1320px] px-4 lg:px-0 flex flex-col items-start pl-[16px]">
          {/* Header Section: Width 631, Height 136, Gap 16 */}
          <div className="flex flex-col gap-[16px] items-start text-left w-full max-w-[631px]">
            {/* Title: Width 286, Height 72, Font 64px, Weight 600 */}
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[64px] leading-[72px] tracking-[-0.3px] text-[#04330B]">
              {t.overlappingSection.title}
            </h2>
            {/* Subtitle: Width 631, Height 48, Font 20px, Weight 600 */}
            <p className="font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
              {t.overlappingSection.desc}
            </p>
          </div>
        </div>

        {/* Gap: 64px */}
        <div className="h-[64px]"></div>

        {/* Main Content Area: Width 1320 */}
        <div className="w-full max-w-[1320px] relative px-4 lg:px-0">

          {/* Container for Image + Overlap: Height 594 (Image 500 + Gap 48 + Button 46) */}
          <div className="relative w-full h-[500px]">
            {/* Image: Width 920, Height 500, Radius 8, Left Aligned (z-0) */}
            <div className="absolute top-0 left-0 w-[920px] h-[500px] rounded-[8px] overflow-hidden bg-gray-100 z-0">
              <img src="/ourvision/VisionImage.svg" alt="Vision" className="w-full h-full object-cover" />
            </div>

            {/* Overlapping Cards Container: Width 636, Height 396 */}
            {/* Position: Overlapping image. Aligned Right? User didn't specify X, apart from "overlap". 
                Standard design suggests Right alignment with overlap.
                Cards H: 396. Image H: 500. Centered Vertically? Or Top aligned?
                "gap: 64px" from text above suggests Top of image starts there.
                I will Vertically Center the cards relative to the Image (Top: (500-396)/2 = 52px).
                And Right Align to container (Right: 0).
                1320 - 920 = 400 space. Cards 636. Overlap = 236. Correct.
            */}
            <div className="absolute top-[52px] right-0 w-[636px] h-[396px] z-10 flex flex-col gap-[24px]">
              {overlapCards.map((item: any, i: number) => (
                /* Card: Width 636, Height 116. Padding 24y 20x. Border #E4F2EA. Shadow. */
                <div
                  key={i}
                  className="w-[636px] h-[116px] bg-white border border-[#E4F2EA] rounded-[8px] flex items-center shadow-[0px_4px_20px_0px_#0000001A] px-[20px] py-[24px]"
                >
                  {/* Content */}
                  <div className="flex flex-col gap-[4px]">
                    <h3 className="font-['Familjen_Grotesk'] font-bold text-[24px] text-[#04330B]">{item.title}</h3>
                    <p className="font-['Familjen_Grotesk'] font-medium text-[16px] text-[#587E67]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Button: Below Image (Gap 48px). Width 153, Height 46. */}
          {/* Since Image is absolute 500px, we place button relative below header+gap+50+gap */}
          {/* Actually simpler: Put button inside a flex layout or absolute below? 
              Let's use a spacer div since we are in flow for the section height.
              The parent div height is driven by content? No, image is absolute.
              I should make the container height explicit or use flow.
              Let's use flow for the Container Main Block.
          */}
        </div>

        {/* Helper Div to maintain flow height since Image is absolute */}
        {/* Image Height 500. + Gap 48 + Button 46 */}
        <div className="w-full max-w-[1320px] px-4 lg:px-0 flex flex-col items-center">
          <div className="h-[50px] w-full"></div> {/* Spacer for Absolute Image */}

          {/* Gap: 48px */}
          <div className="h-[1px]"></div>

          {/* Button */}
          <button className="w-[153px] h-[46px] rounded-[8px] border border-[#0D5229] flex items-center justify-center gap-[12px] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] hover:bg-green-50 transition-colors">
            {t.overlappingSection.button}
          </button>
        </div>
      </section>

      {/* 4. MEET YOUR IDEOLOGICAL LEADER */}
      <section className="bg-white mt-[120px] w-full flex justify-center">
        {/* Main Content Container: Width 1320 */}
        <div className="w-full max-w-[1320px] px-4 lg:px-0 flex flex-col lg:flex-row items-end justify-between gap-[48px] lg:gap-0">

          {/* LEFT COLUMN: Text Content (Width ~800px based on previous reqs, or flex-1) */}
          <div className="flex flex-col items-start text-left w-full lg:max-w-[810px] pb-[40px]">

            {/* Title & Subtitle Block */}
            <div className="flex flex-col gap-[16px] mb-[40px]">
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                {t.leader.title}
              </h2>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                {t.leader.sub}
              </p>
            </div>

            {/* Quote Block */}
            <div className="flex flex-col gap-[4px] mb-[24px]">
              <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] lg:text-[32px] leading-[1.2] tracking-[-0.3px] text-[#0D5229]">
                {t.leader.quote}
              </h3>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                {t.leader.role}
              </p>
            </div>

            {/* Bio Block */}
            <div className="w-full mb-[24px]">
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[28px] tracking-[-0.3px] text-[#587E67] text-justify lg:text-left">
                {t.leader.bio}
              </p>
            </div>

            {/* Social Icons: Width 114 (approx), Height 30. Gap 10. */}
            <div className="flex gap-[10px]">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/sudhanshu.pgp1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-[0px_4px_20px_0px_#0000001A] hover:bg-green-50 transition-colors"
              >
                <img src="/leadersection/fb.svg" alt="Facebook" className="w-[29px] h-[29px]" />
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/drsudhanshu_green/?__pwa=1#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-[0px_4px_20px_0px_#0000001A] hover:bg-green-50 transition-colors"
              >
                <img src="/leadersection/insta.svg" alt="Instagram" className="w-[29px] h-[29px]" />
              </a>
              {/* X */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[40px] h-[40px] rounded-[8px] bg-white border border-[#E8F3EC] flex items-center justify-center text-[#04330B] shadow-[0px_4px_20px_0px_#0000001A] hover:bg-green-50 transition-colors"
              >
                <img src="/leadersection/x.svg" alt="X" className="w-[25px] h-[25px]" />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Image */}
          {/* Dr Sudhanshu Image: Width 419, Height 444 */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[318px] lg:w-[419px] lg:h-[444px]">
              <img src="Shudhanshu.svg" alt="Dr Sudhanshu" className="w-[440px] h-[400px] rounded-[8px] bg-white border border-[#E8F3EC] object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* 5. IMPACT STATS */}
      <section className="bg-white mt-[120px] w-full flex flex-col items-center">
        {/* Header Section: Width 1320 (max), Gap 64px below header */}
        <div className="w-full max-w-[1320px] flex flex-col items-center px-4 lg:px-0">

          {/* Text Container: Gap 16 between Title and Subtitle. Left Aligned. */}
          <div className="w-full flex flex-col items-start text-left gap-[16px] mb-[64px]">
            {/* Title: Width 1054, Font 64px */}
            <h2 className="max-w-[1054px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
              {t.stats.header}
            </h2>
            {/* Subtitle: Width 1039, Font 20px */}
            <p className="max-w-[1039px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
              {t.stats.sub}
            </p>
          </div>

          {/* Cards Grid: Width 1320, Height 216, Gap 24 */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {stats.map((stat: any, idx: number) => (
              <div key={idx} className="w-full lg:w-[312px] h-auto min-h-[216px] bg-white border border-[#B9D3C4] rounded-[8px] px-[24px] py-[20px] flex flex-col items-start hover:shadow-lg transition-shadow">

                {/* Number: Height 54, Gap below 12 */}
                <h3 className="font-[family-name:var(--font-inter)] font-semibold text-[40px] lg:text-[48px] leading-[54px] tracking-[-0.3px] text-[#0D5229] mb-[12px]">
                  {stat.number}
                </h3>

                {/* Label: Height 30, Gap below 8 */}
                <h4 className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[20px] lg:text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] mb-[8px]">
                  {stat.label}
                </h4>

                {/* Description: Height 72 */}
                <p className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. NEWS AND PUBLICATIONS */}
      <section className="bg-white mt-[120px] w-full flex justify-center">
        {/* Main Relative Container: Width 1320, Height 600, No Border, Centered */}
        <div className="relative w-full max-w-[1320px] h-[600px] rounded-[8px] px-0 lg:px-0 mx-4 lg:mx-0">

          <div className="absolute top-0 left-0 flex flex-col items-start gap-[16px]">
            {/* Title: Width 637, Height 72 */}
            <h2 className="w-full max-w-[637px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] text-left">
              {t.news.title}
            </h2>
            {/* Subtitle: Width 572, Height 60 */}
            <p className="w-full max-w-[572px] font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[18px] lg:text-[24px] leading-[30px] tracking-[-0.3px] text-[#587E67] text-left">
              {t.news.sub}
            </p>
          </div>

          {/* Image 1: Top 320, Left 0 */}
          <div className="absolute top-[320px] left-0 w-[244px] h-[280px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news1.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 2: Top 240, Left 268 */}
          <div className="absolute top-[240px] left-[268px] w-[245px] h-[188px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_4px_20px_0px_#0000001A]">
            <img src="/news2.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 3: Top 452, Left 268 */}
          <div className="absolute top-[452px] left-[268px] w-[245px] h-[148px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news3.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 4: Top 160, Left 537 */}
          <div className="absolute top-[160px] left-[537px] w-[245px] h-[141px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news4.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 5: Top 325, Left 537 */}
          <div className="absolute top-[325px] left-[537px] w-[245px] h-[275px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news5.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 6: Top 80, Left 806 */}
          <div className="absolute top-[80px] left-[806px] w-[245px] h-[350px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news6.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 7: Top 454, Left 806 */}
          <div className="absolute top-[454px] left-[806px] w-[245px] h-[146px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news7.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 8: Top 0, Left 1075 */}
          <div className="absolute top-[0px] left-[1075px] w-[245px] h-[178px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news8.svg" className="w-full h-full object-fill" />
          </div>

          {/* Image 9: Top 202, Left 1075 */}
          <div className="absolute top-[202px] left-[1075px] w-[245px] h-[398px] rounded-[8px] border border-[#B9D3C4] overflow-hidden shadow-[0px_8px_12px_0px_#00000033]">
            <img src="/news9.svg" className="w-full h-full object-fill" />
          </div>

        </div>
      </section>

      {/* 7. COMMITTEE MEMBERS - REFINE: Text Top, Image Bottom, Socials, Specific Data */}
      <section className="bg-white mt-[120px] w-full flex justify-center">
        {/* Main Container: 1320px Wide, Centered */}
        <div className="w-full max-w-[1320px] px-0 lg:px-0 mx-4 lg:mx-0 flex flex-col items-center">

          {/* Header Section: Gap 64px to grid */}
          <div className="flex flex-col items-center gap-[16px] mb-[64px]">
            {/* Title: Width 885, Height 72 */}

            <h2 className="w-full text-center font-[family-name:var(--font-inter)] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] whitespace-nowrap">
              {t.committee.title}
            </h2>
            {/* Subtitle: Width 572, Height 60 */}
            <p className="max-w-[572px] w-full text-center font-[family-name:var(--font-inter)] font-semibold text-[18px] lg:text-[24px] leading-[30px] tracking-[-0.3px] text-[#587E67]">
              {t.committee.sub}
            </p>
          </div>

          {/* Grid Section: Width 1320, 4 Cols, Gap 24px Horiz, 48px Vert */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[48px]">
            {[
              { name: "Dr. Sudhanshu", role: "President", image: "/Members/CM.png" },
              { name: "Bhanwar Lal Nayak", role: "Vice President", image: "/leadersection/Bhanwar-lal-ji.png" },
              { name: "Naseem Ansari", role: "Vice President", image: "/nassem-removebg-preview.png" },
              { name: "Adv. Kapil", role: "Gen. Secretary", image: "/kapil-removebg-preview.png" },
              { name: "Er. Gaurav", role: "Secretary", image: "/gaurav-removebg-preview.png" },
              { name: "Dr. Tanmay", role: "Gen. Secretary", image: "/Tanmay-removebg-preview.png" },
              { name: "Satish Nagpal", role: "Pradesh Adhyaksh Rajasthan", image: "/Satish-removebg-preview.png" },
              { name: "Dr. Hari Singh Chauhan", role: "Vice President", image: "/hari-removebg-preview.png" }
            ].map((member, index) => (
              /* Card: Width 312, Height 322 */
              <div key={index} className="w-full max-w-[312px] h-[322px] rounded-[8px] border border-[#B9D3C4] p-[20px] flex flex-col justify-between transition-transform hover:-translate-y-1 bg-white">

                {/* Text Layout (Top) */}
                <div className="flex flex-col gap-[4px] mb-[20px]">
                  {/* Name: 24px Familjen */}
                  <h3 className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
                    {member.name}
                  </h3>
                  {/* Role: 16px Familjen */}
                  <p className="font-[family-name:var(--font-familjen-grotesk)] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
                    {member.role}
                  </p>
                </div>

                {/* Image Placeholder (Bottom): 226px height */}
                <div className="relative w-full h-[226px] rounded-[8px] overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)' }}>
                  {/* Member Image */}
                  <img src={member.image} alt={member.name} className="w-full h-full object-contain object-bottom" onError={(e) => (e.currentTarget.src = 'https://placehold.co/272x226/E8F3EC/587E67?text=Photo')} />


                  {/* Social Icons Overlay (Bottom Left) */}
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
            ))}
          </div>

          {/* View More Button */}
          <div className="flex justify-center mt-[64px]">
            <button className="w-[153px] h-[46px] flex items-center justify-center gap-[12px] bg-white border border-[#0D5229] rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#0D5229] hover:bg-green-50 transition-colors">
              {t.committee.button}
            </button>
          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white pt-[120px] pb-[40px]">
        <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-0 flex flex-col lg:flex-row items-start">

          {/* Col 1: Logo & Socials */}
          <div className="flex flex-col w-[255px]">
            <Link href="/">
              <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[255px] h-[136px] object-contain mb-[24px] cursor-pointer" />
            </Link>

            <div className="flex flex-col gap-[20px] w-[228px]">
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
          <div className="flex flex-col w-[380px] shrink-0 lg:ml-[152px] mt-10 lg:mt-0">

            {/* Useful Links Block */}
            <div className="flex flex-col gap-[20px] w-[330px]">
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
            <div className="flex flex-col gap-[20px] w-[312px]">
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
          <div className="flex flex-col w-[381px] shrink-0 lg:ml-auto mt-10 lg:mt-0">
            <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] mb-[20px]">
              {t.footer.contact}
            </h3>

            {/* Content Container: Gap 32px */}
            <div className="flex flex-col gap-[32px] w-[381px]">

              {/* Address Section */}
              <div className="flex items-start gap-[12px] w-[381px]">
                <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                  <MapPin size={24} strokeWidth={1.5} />
                </div>
                <p className="w-[321px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
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
    </div >
  );
};

// --- 6. Root Export ---

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
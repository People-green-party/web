'use client';

import React, { useState, useContext, createContext, useRef } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Leaf,
  Building2,
  TrendingUp,
  Share2,
  ShieldCheck,
  Gem,
  Landmark,
  Scale,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  X, // Twitter icon
  Menu
} from 'lucide-react';

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
    hero: {
      title: "Indian Peoples Green Party",
      subtitle: "Learn about the Indian Peoples Green Party — working towards sustainable growth and social justice.",
      readMore: "Read More",
      overviewTitle: "Overview",
      overviewText: "Indian Peoples Green Party is working for social, economic, and political change. Through a new vision and a broader perspective, the fight for “Equality for All and Happiness for Everyone” has begun. We consider timeliness, excellence, and all-round development as our mission, and human dignity as our religion. We believe that caste and religion are threats to human freedom.\nWe believe that inequality, slow development, miserable conditions, and poverty may have corruption and dynastic politics as one of the reasons, but the main reason behind all these is our thoughtless, inactive, and inefficient leadership and their status quo mindset. They know how to win elections by taking votes, but they can never win the hearts of the people through their work. They know how to use the power of the people to increase their own power — or in simple words, they know how to take, not how to give. Sacrifice, perhaps, is not even a word in their dictionary."
    },
    principles: {
      title: "Eight Principles of the Green Vision",
      subtitle: "Our Commitment to Balance, Progress, and Nature.",
      items: [
        "The biggest priority of the Peoples Green Party is to give maximum representation to women, youth, and the working class. The party believes...",
        "The Peoples Green Party has introduced a new working style that emphasizes honesty, transparency, and accountability in administration...",
        "Through the Green Movement, efforts are being made to make people aware of environmental protection and to establish a balance between...",
        "he Peoples Green Party believes that the development of rural and tribal areas is the real development of the country. The party has given...",
        "against corruption, nepotism, and black money, the party has launched a strong movement. The party believes that corruption has hollowed the...",
        "On the completion of 75 years of independence, the party has taken a pledge to establish a new governance system — one that will ensure true...",
        "To strengthen national unity and brotherhood, the party has started a social harmony campaign. The party believes that religious and caste-base...",
        "The Peoples Green Party is committed to removing unemployment and poverty by promoting cottage industries and self-employe..."
      ]
    },
    vision: {
      mainTitle: "Our Vision",
      mainText: "In five years — 1875 days — we will transform the living standards of every citizen of the state, ensuring equality and happiness for all, doubling the GDP, and creating a Green State.",
      footerText: "Now the people's front will defeat the dishonest.",
      cards: [
        {
          title: "Human Dignity and Equality",
          text: "The Peoples Green Movement believes that human dignity is the greatest religion. Therefore, the party is determined to ensure equality in every sphere of life. The exploitation of the poor, weak, and backward will be stopped, and a society based on equality will be created."
        },
        {
          title: "Open Economy",
          text: "Under the Green Economic Model, a completely new economic structure will be established that connects villages and cities through green industries. The party will promote small and medium industries, and the youth will be made self-reliant by linking them to entrepreneurship."
        },
        {
          title: "Agro-Industrial Revolution",
          text: "The Peoples Green Movement believes that the future lies in the integration of agriculture and industry. Therefore, by connecting agricultural produce with industries, the party will create new employment opportunities and build a strong economic base nationwide."
        },
        {
          title: "Superior Standard of Living",
          text: "After 75 years of independence, the goal is to make every citizen prosperous and dignified. By ensuring quality housing, education, health, and employment, the standard of living for all will rise. The party envisions a society where comfort, equality, and opportunity reach every home."
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
      home: "मुखपृष्ठ",
      about: "हमारे बारे में",
      constitution: "संविधान",
      donate: "दान करें",
      declaration: "घोषणा पत्र",
      join: "जुड़ें",
      login: "लॉगिन"
    },
    hero: {
      title: "इंडियन पीपल्स ग्रीन\nपार्टी",
      subtitle: "इंडियन पीपल्स ग्रीन पार्टी के बारे में जानें — सतत विकास और सामाजिक न्याय की दिशा में कार्यरत।",
      readMore: "और पढ़ें",
      overviewTitle: "अवलोकन",
      overviewText: "इंडियन पीपल्स ग्रीन पार्टी सामाजिक, आर्थिक और राजनीतिक परिवर्तन के लिए काम कर रही है। एक नई दृष्टि और व्यापक दृष्टिकोण के माध्यम से, 'सभी के लिए समानता और सभी के लिए खुशी' की लड़ाई शुरू हो गई है। हम समयबद्धता, उत्कृष्टता और सर्वांगीण विकास को अपना मिशन और मानवीय गरिमा को अपना धर्म मानते हैं। हमारा मानना है कि जाति और धर्म मानव स्वतंत्रता के लिए खतरा हैं।\n\nहम मानते हैं कि असमानता, धीमा विकास, दयनीय स्थिति और गरीबी के पीछे भ्रष्टाचार और वंशवाद एक कारण हो सकता है, लेकिन इन सबके पीछे मुख्य कारण हमारा विचारहीन, निष्क्रिय और अक्षम नेतृत्व और उनकी यथास्थितिवादी मानसिकता है। वे वोट लेकर चुनाव जीतना जानते हैं, लेकिन अपने काम से जनता का दिल कभी नहीं जीत सकते। वे जनता की शक्ति का उपयोग अपनी शक्ति बढ़ाने के लिए करना जानते हैं — या सीधे शब्दों में कहें तो वे लेना जानते हैं, देना नहीं। शायद 'त्याग' शब्द उनके शब्दकोश में ही नहीं है।"
    },
    principles: {
      title: "ग्रीन विजन के आठ सिद्धांत",
      subtitle: "संतुलन, प्रगति और प्रकृति के प्रति हमारी प्रतिबद्धता।",
      items: [
        "पीपल्स ग्रीन पार्टी की सबसे बड़ी प्राथमिकता महिलाओं, युवाओं और श्रमिक वर्ग को अधिकतम प्रतिनिधित्व देना है। पार्टी का मानना है की...",
        "पीपल्स ग्रीन पार्टी ने एक नई कार्यशैली पेश की है जो प्रशासन में ईमानदारी, पारदर्शिता और जवाबदेही पर जोर देती है...",
        "ग्रीन मूवमेंट के माध्यम से, लोगों को पर्यावरण संरक्षण के प्रति जागरूक करने और संतुलन स्थापित करने के प्रयास किए जा रहे हैं...",
        "पीपल्स ग्रीन पार्टी का मानना है कि ग्रामीण और आदिवासी क्षेत्रों का विकास ही देश का वास्तविक विकास है। पार्टी ने दिया है...",
        "भ्रष्टाचार, भाई-भतीजावाद और काले धन के खिलाफ पार्टी ने एक मजबूत आंदोलन शुरू किया है। पार्टी का मानना है कि भ्रष्टाचार ने खोखला कर दिया है...",
        "आजादी के 75 साल पूरे होने पर, पार्टी ने एक नई शासन प्रणाली स्थापित करने का संकल्प लिया है — जो सुनिश्चित करेगी सच्ची...",
        "राष्ट्रीय एकता और भाईचारे को मजबूत करने के लिए, पार्टी ने सामाजिक सद्भाव अभियान शुरू किया है। पार्टी का मानना है कि धार्मिक और जाति-आधारित...",
        "पीपल्स ग्रीन पार्टी कुटीर उद्योगों और स्वरोजगार को बढ़ावा देकर बेरोजगारी और गरीबी को दूर करने के लिए प्रतिबद्ध है..."
      ]
    },
    vision: {
      mainTitle: "हमारा विजन",
      mainText: "पांच वर्षों में — 1875 दिनों में — हम राज्य के प्रत्येक नागरिक के जीवन स्तर को बदल देंगे, सभी के लिए समानता और खुशी सुनिश्चित करेंगे, जीडीपी को दोगुना करेंगे और एक ग्रीन स्टेट बनाएंगे।",
      footerText: "अब जनता का मोर्चा बेईमानों को हराएगा।",
      cards: [
        {
          title: "मानवीय गरिमा और समानता",
          text: "पीपल्स ग्रीन मूवमेंट का मानना है कि मानवीय गरिमा सबसे बड़ा धर्म है। इसलिए, पार्टी जीवन के हर क्षेत्र में समानता सुनिश्चित करने के लिए दृढ़ संकल्पित है। गरीबों, कमजोरों और पिछड़ों का शोषण रोका जाएगा।"
        },
        {
          title: "खुली अर्थव्यवस्था",
          text: "ग्रीन इकोनॉमिक मॉडल के तहत, एक पूरी तरह से नई आर्थिक संरचना स्थापित की जाएगी जो हरित उद्योगों के माध्यम से गांवों और शहरों को जोड़ेगी। पार्टी छोटे और मध्यम उद्योगों को बढ़ावा देगी, और युवा आत्मनिर्भर होंगे।"
        },
        {
          title: "कृषि-औद्योगिक क्रांति",
          text: "पीपल्स ग्रीन मूवमेंट का मानना है कि भविष्य कृषि और उद्योग के एकीकरण में निहित है। इसलिए, कृषि उपज को उद्योगों से जोड़कर, पार्टी रोजगार के नए अवसर पैदा करेगी।"
        },
        {
          title: "उत्कृष्ट बुनियादी ढांचा",
          text: "आजादी के 75 साल बाद, हम हर गांव और शहर को विश्वस्तरीय बनाने की योजना बना रहे हैं, जिससे गुणवत्तापूर्ण जीवन सुनिश्चित हो सके। पार्टी शिक्षा, स्वास्थ्य और परिवहन पर ध्यान केंद्रित करेगी ताकि हर घर का आराम और सर्वांगीण विकास सुनिश्चित हो सके।"
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

// --- Context Setup ---

const LanguageContext = createContext<any>(null);
const useLanguage = () => useContext(LanguageContext);

// --- Navbar (from Home Page) ---

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

// --- Helper Components ---

const PrincipleItem = ({ iconUrl, text }: { iconUrl: string, text: string }) => (
  <div className="w-full lg:w-[405px] min-h-[66px] flex items-center gap-[10px]">
    <div className="w-[48px] h-[48px] rounded-[8px] border border-[#B9D3C4] bg-white flex items-center justify-center p-[10px] shrink-0">
      <img src={iconUrl} alt="icon" className="w-[24px] h-[24px] object-contain" />
    </div>
    <p className="flex-1 font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] lg:line-clamp-3">
      {text}
    </p>
  </div>
);

const VisionCard = ({ iconUrl, title, text }: { iconUrl: string, title: string, text: string }) => (
  /* Card Layout: Responsive Width, Auto Height, Padding 24, Gap 16 */
  <div className="w-full lg:w-[377px] min-h-[304px] shrink-0 rounded-[8px] border border-[#B9D3C4] bg-white p-[24px] flex flex-col gap-[16px] hover:shadow-lg transition-shadow">
    {/* Logo: Width 48, Height 48 */}
    <div className="w-[48px] h-[48px] rounded-[8px] bg-white text-green-700 flex items-center justify-center">
      <img src={iconUrl} alt="icon" className="w-[48px] h-[48px] object-contain" />
    </div>

    {/* Text Section */}
    <div className="w-full flex flex-col gap-[8px]">
      {/* Title */}
      <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
        {title}
      </h3>
      {/* Description */}
      <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
        {text}
      </p>
    </div>
  </div>
);

// --- Footer (from Home Page) ---
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

// --- Main Page Component ---

const AboutPageContent = () => {
  const { language, t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // card width (377) + gap (24) approx
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col items-center pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Main Content Wrapper - Centered, Width 1320 */}
      <main className="w-full max-w-[1320px] px-4 lg:px-0 flex flex-col mt-[12px]">

        {/* --- Hero Section --- */}
        <div className="w-full flex flex-col lg:flex-row justify-between h-auto lg:h-[672px]">

          {/* Left Column: Width 747 */}
          <div className="flex flex-col w-full lg:w-[747px] gap-[44px]">
            {/* Text Section: Height 208 */}
            <div className="flex flex-col gap-[16px] h-auto lg:h-[208px]">
              {/* Title */}
              <h1 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] whitespace-pre-line">
                {t.hero.title}
              </h1>
              {/* Subtitle */}
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                {t.hero.subtitle}
              </p>
            </div>

            {/* Image Section: Height 420 */}
            <div className="w-full h-[420px] rounded-[8px] overflow-hidden bg-gray-100">
              <img
                src="/About/about-1.svg"
                alt="Conference"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Width 533 */}
          {/* Gap from Left: 40px (Handled by justify-between on container 1320 - 747 - 533 = 40) */}
          <div className="w-full lg:w-[533px] h-auto lg:h-[672px] rounded-[8px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A] p-[28px_32px] flex flex-col justify-between mt-8 lg:mt-0">

            {/* Inner Content Section: Width 469 (auto inside padding) */}
            <div className="flex flex-col gap-[16px]">
              {/* Overview Title */}
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[32px] leading-[38px] tracking-[-0.3px] text-[#04330B]">
                {t.hero.overviewTitle}
              </h2>
              {/* Overview Text */}
              <p className="font-['Familjen_Grotesk'] font-semibold text-[18px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] text-justify lg:text-left whitespace-pre-line">
                {t.hero.overviewText}
              </p>
            </div>

            {/* Read More Button */}
            <button className="w-[154px] h-[46px] rounded-[8px] border border-[#0D5229] flex items-center justify-center gap-[12px] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] hover:bg-green-50 transition-colors shrink-0">
              {t.hero.readMore}
            </button>

          </div>

        </div>

        {/* --- Eight Principles Section --- */}
        {/* Gap from Hero Section: 120px */}
        <div className="w-full mt-[120px] flex flex-col gap-[64px]">

          {/* Header Section: Width 960 (aligned with layout reqs), Height 112, Gap 16 */}
          {/* Note: User asked for Width 1320 cont, then width 960 section. Left aligned? 
              User didn't specify alignment, but standard design flows from left. */}
          <div className="flex flex-col gap-[16px] w-full max-w-[960px]">
            {/* Title: Height 72 */}
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
              {t.principles.title}
            </h2>
            {/* Subtitle: Width 525, Height 24 */}
            <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
              {t.principles.subtitle}
            </p>
          </div>

          {/* Cards Container: Width 1320, Height 444, Gap 48px */}
          <div className="w-full flex flex-col lg:flex-row h-auto lg:h-[444px]">

            {/* Left Column (4 Cards): Width 405, Height 444, Gap 60px */}
            {/* Note: Gap 60px for 4 cards in 444px height seems large.
                Card height 66. 4 cards = 264. Space left = 180. 3 gaps = 60px. perfect. */}
            <div className="w-full lg:w-[405px] flex flex-col gap-[60px]">
              <PrincipleItem iconUrl="/About/about-Icon-1.svg" text={t.principles.items[0]} />
              <PrincipleItem iconUrl="/About/about-Icon-2.svg" text={t.principles.items[1]} />
              <PrincipleItem iconUrl="/About/about-Icon-3.svg" text={t.principles.items[2]} />
              <PrincipleItem iconUrl="/About/about-Icon-4.svg" text={t.principles.items[3]} />
            </div>

            {/* Middle Image: Width 414, Height 444. Gap 48px from left and right */}
            {/* Margins handled by flex gap or rigid spacer div */}
            <div className="hidden lg:block w-[48px] shrink-0"></div>

            <div className="w-full lg:w-[414px] h-[300px] lg:h-[444px] rounded-[8px] overflow-hidden bg-gray-100 my-8 lg:my-0">
              <img
                src="/About/about-2.svg"
                alt="Principles Image"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="hidden lg:block w-[48px] shrink-0"></div>

            {/* Right Column (4 Cards): Width 405, Height 444, Gap 60px */}
            <div className="w-full lg:w-[405px] flex flex-col gap-[60px]">
              <PrincipleItem iconUrl="/About/about-Icon-5.svg" text={t.principles.items[4]} />
              <PrincipleItem iconUrl="/About/about-Icon-6.svg" text={t.principles.items[5]} />
              <PrincipleItem iconUrl="/About/about-Icon-7.svg" text={t.principles.items[6]} />
              <PrincipleItem iconUrl="/About/about-Icon-8.svg" text={t.principles.items[7]} />
            </div>

          </div>

        </div>

        {/* --- Vision Section --- */}
        {/* Gap from Principles: 120px */}
        <div className="w-full mt-[120px] flex flex-col items-center">

          {/* Header Text Block: Width 920, Height 136, Gap 16 */}
          <div className="w-full max-w-[920px] flex flex-col gap-[16px] mb-[64px]">
            {/* Title: Height 72 */}
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-center text-[#04330B]">
              {t.vision.mainTitle}
            </h2>
            {/* Text: Height 48 */}
            <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-center text-[#587E67]">
              {t.vision.mainText}
            </p>
          </div>

          {/* Cards Grid/Carousel Container */}
          {/* User asked for Section width: 3586, Height 304, Gap 24px */}
          {/* Used overflow-x-hidden for smooth custom scroll */}
          <div
            className="w-full lg:overflow-x-hidden pb-4 no-scrollbar"
            ref={scrollContainerRef}
          >
            <div className="flex flex-col lg:flex-row lg:w-max gap-[24px]">
              <VisionCard
                iconUrl="/About/about-Icon-9.svg"
                title={t.vision.cards[0].title}
                text={t.vision.cards[0].text}
              />
              <VisionCard
                iconUrl="/About/about-Icon-10.svg"
                title={t.vision.cards[1].title}
                text={t.vision.cards[1].text}
              />
              <VisionCard
                iconUrl="/About/about-Icon-11.svg"
                title={t.vision.cards[2].title}
                text={t.vision.cards[2].text}
              />
              <VisionCard
                iconUrl="/About/about-Icon-12.svg"
                title={t.vision.cards[3].title}
                text={t.vision.cards[3].text}
              />
              {/* Duplicate cards if needed for fuller scrolling effect or just these 4 */}
            </div>
          </div>

          {/* Footer Text */}
          {/* Gap from cards: 48px */}
          <div className="mt-[48px] w-full max-w-[404px]">
            <p className="font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-center text-[#587E67]">
              {t.vision.footerText}
            </p>
          </div>

          {/* Navigation Arrows */}
          {/* Gap from text: 24px */}
          <div className="hidden lg:flex mt-[24px] justify-center gap-[12px]">
            {/* Left Button */}
            <button
              onClick={() => scroll('left')}
              className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#0D5229] hover:bg-green-50 transition-colors cursor-pointer"
            >
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
            {/* Right Button */}
            <button
              onClick={() => scroll('right')}
              className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#0D5229] hover:bg-green-50 transition-colors cursor-pointer"
            >
              <ArrowRight size={24} strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AboutPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: translations[language]
    }}>
      <AboutPageContent />
    </LanguageContext.Provider>
  );
}
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Users,
  Shield,
  Phone,
  Scale,
  Megaphone,
  IdCard,
  Smartphone,
  UserCheck,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { WhatsAppFab } from "../../components/WhatsAppFab";
import { useLanguage } from "@/components/LanguageContext";

const translations = {
  en: {
    hero: {
      titlePre: "PGP",
      titleHighlight: "Union",
      titlePost: "Network",
      subtitle: "Strength in Unity",
      description:
        "PGP Union Network empowers unorganized workers — e-rickshaw drivers, gig workers, street vendors, and daily wage earners — to organize, protect their rights, and build collective strength.",
      join: "Join Union",
      login: "Login",
      feeNote: "Join online in a few minutes — get your digital ID and union support.",
    },
    trust: {
      items: [
        { val: "6+", label: "Worker categories" },
        { val: "Digital ID", label: "Official membership" },
        { val: "24×7", label: "Support channel" },
        { val: "On ground", label: "Local representation" },
      ],
    },
    about: {
      title: "What is PGP Union Network?",
      desc1:
        "Unorganized workers are the backbone of our economy, yet they have no collective voice, no legal protection, and no bargaining power.",
      desc2: "PGP Union Network brings these workers together into a unified force.",
      desc3:
        "We organise e-rickshaw drivers, gig workers, street vendors, daily wage earners, construction workers, and domestic workers under one trusted platform — so dignity, fair treatment, and legal protection are not privileges, but rights.",
      desc4:
        "From digital membership IDs to on-ground support and government representation, the network turns isolated workers into a collective that can negotiate, raise issues, and demand accountability.",
      features: [
        { title: "Legal protection and rights awareness", text: "Know your rights and get practical safeguards for everyday workplace challenges." },
        { title: "Collective bargaining power", text: "Negotiate wages, conditions, and fairness together — not alone." },
        { title: "Digital ID cards and documentation", text: "Official member ID with your photo and verified details." },
        { title: "Direct communication and support", text: "Reach union support quickly when you need help most." },
        { title: "Legal aid", text: "Guidance and assistance for workplace disputes and unfair treatment." },
        { title: "Awareness campaigns", text: "Training and campaigns that keep every worker informed and ready." },
      ],
    },
    join: {
      title: "Who can join?",
      subtitle: "If you work in the unorganized sector, this network is for you.",
      roles: [
        { title: "E-rickshaw Drivers", desc: "Drivers seeking fair fares, safer routes, and a collective voice against harassment and unfair rules." },
        { title: "Gig Workers", desc: "Delivery and platform workers who want dignity, timely payments, and protection from sudden account cuts." },
        { title: "Street Vendors", desc: "Vendors fighting for legal vending rights, secure spaces, and protection from arbitrary eviction." },
        { title: "Daily Wage Earners", desc: "Workers who need fair wages, safer workplaces, and support when payments are delayed or denied." },
        { title: "Construction Workers", desc: "Site workers seeking safety, wage security, and representation for on-site disputes." },
        { title: "Domestic Workers", desc: "Home-based workers looking for recognition, fair pay, and a trusted channel for workplace issues." },
      ],
    },
    benefits: {
      title: "Union Benefits",
      items: [
        { title: "Digital ID Card", desc: "Get an official union ID card with your photo and details." },
        { title: "Legal Support", desc: "Access to legal advice and support for workplace issues." },
        { title: "Collective Voice", desc: "Your voice matters when thousands stand together." },
        { title: "Government Representation", desc: "Direct channel to raise issues with authorities." },
      ],
    },
    howTo: {
      title: "How to join?",
      subtitle: "Four simple steps to become a PGP Union Network member.",
      steps: [
        { title: "Register online", desc: "Fill a short form with your basic details." },
        { title: "Complete verification", desc: "Confirm your identity and worker category." },
        { title: "Get your digital ID", desc: "Receive your official union membership ID." },
        { title: "Access support", desc: "Use legal help, helpline, and collective voice." },
      ],
    },
    cta: {
      title: "Together we are stronger",
      desc: "Alone we are vulnerable. Together we are powerful. Join the PGP Union Network today.",
      join: "Join Union",
      login: "Member Login",
      support: "Need help? Talk to support",
      feeNote: "Simple online joining — no complicated paperwork.",
    },
    sticky: {
      label: "PGP Union Network",
      join: "Join Now",
    },
    whatsappMsg: "Hello! I need help with PGP Union Network. Please guide me.",
  },
  hi: {
    hero: {
      titlePre: "PGP",
      titleHighlight: "यूनियन",
      titlePost: "नेटवर्क",
      subtitle: "एकता में ही शक्ति है",
      description:
        "PGP यूनियन नेटवर्क असंगठित क्षेत्र के कामगारों — जैसे ई-रिक्शा चालक, गिग वर्कर्स, रेहड़ी-पटरी विक्रेता और दैनिक वेतन भोगी मजदूरों — को संगठित होने, उनके अधिकारों की रक्षा करने और सामूहिक शक्ति का निर्माण करने में सशक्त बनाता है।",
      join: "यूनियन से जुड़ें",
      login: "लॉगिन करें",
      feeNote: "कुछ ही मिनटों में ऑनलाइन जुड़ें — डिजिटल ID और यूनियन सहायता पाएं।",
    },
    trust: {
      items: [
        { val: "6+", label: "कामगार श्रेणियाँ" },
        { val: "डिजिटल ID", label: "आधिकारिक सदस्यता" },
        { val: "24×7", label: "सहायता चैनल" },
        { val: "जमीनी", label: "स्थानीय प्रतिनिधित्व" },
      ],
    },
    about: {
      title: "PGP यूनियन नेटवर्क क्या है?",
      desc1:
        "असंगठित कामगार हमारी अर्थव्यवस्था की रीढ़ हैं, फिर भी उनकी कोई सामूहिक आवाज, कोई कानूनी सुरक्षा और कोई सौदेबाजी की शक्ति नहीं है।",
      desc2: "PGP यूनियन नेटवर्क इन सभी कामगारों को एक संगठित और एकीकृत शक्ति के रूप में साथ लाता है।",
      desc3:
        "हम ई-रिक्शा चालक, गिग वर्कर्स, रेहड़ी-पटरी विक्रेता, दैनिक वेतनभोगी, निर्माण मजदूर और घरेलू कामगारों को एक भरोसेमंद मंच पर संगठित करते हैं — ताकि गरिमा, उचित व्यवहार और कानूनी सुरक्षा विशेषाधिकार नहीं, अधिकार बनें।",
      desc4:
        "डिजिटल सदस्यता ID से लेकर जमीनी सहायता और सरकारी प्रतिनिधित्व तक, यह नेटवर्क अकेले कामगारों को एक सामूहिक शक्ति में बदलता है जो बातचीत कर सके, मुद्दे उठा सके और जवाबदेही मांग सके।",
      features: [
        { title: "कानूनी सुरक्षा और अधिकार जागरूकता", text: "अपने अधिकार जानें और रोजमर्रा की चुनौतियों के लिए व्यावहारिक सुरक्षा पाएं।" },
        { title: "सामूहिक सौदेबाजी की शक्ति", text: "अकेले नहीं — एक साथ मजदूरी, शर्तों और न्याय के लिए बातचीत करें।" },
        { title: "डिजिटल ID कार्ड और दस्तावेजीकरण", text: "फोटो और सत्यापित विवरण के साथ आधिकारिक सदस्य ID।" },
        { title: "सीधा संपर्क और सहायता", text: "जरूरत पड़ने पर यूनियन सहायता तक तुरंत पहुँच।" },
        { title: "कानूनी सहायता", text: "कार्यस्थल विवादों और अन्यायपूर्ण व्यवहार के लिए मार्गदर्शन।" },
        { title: "जागरूकता अभियान", text: "प्रशिक्षण और अभियान जो हर कामगार को सूचित और तैयार रखते हैं।" },
      ],
    },
    join: {
      title: "कौन जुड़ सकता है?",
      subtitle: "यदि आप असंगठित क्षेत्र में काम करते हैं, तो यह नेटवर्क आपके लिए है।",
      roles: [
        { title: "ई-रिक्शा चालक", desc: "उचित किराया, सुरक्षित मार्ग और उत्पीड़न व अन्यायपूर्ण नियमों के खिलाफ सामूहिक आवाज चाहने वाले चालक।" },
        { title: "गिग वर्कर्स", desc: "डिलीवरी और प्लेटफ़ॉर्म वर्कर्स जो गरिमा, समय पर भुगतान और अचानक अकाउंट कटौती से सुरक्षा चाहते हैं।" },
        { title: "रेहड़ी-पटरी विक्रेता", desc: "कानूनी विक्रय अधिकार, सुरक्षित स्थान और मनमाने निष्कासन से सुरक्षा के लिए संघर्षरत विक्रेता।" },
        { title: "दैनिक वेतनभोगी मजदूर", desc: "उचित मजदूरी, सुरक्षित कार्यस्थल और भुगतान में देरी या इनकार पर सहायता चाहने वाले मजदूर।" },
        { title: "निर्माण मजदूर", desc: "साइट पर सुरक्षा, मजदूरी सुरक्षा और विवादों के लिए प्रतिनिधित्व चाहने वाले मजदूर।" },
        { title: "घरेलू कामगार", desc: "मान्यता, उचित वेतन और कार्यस्थल मुद्दों के लिए भरोसेमंद माध्यम चाहने वाले घरेलू कामगार।" },
      ],
    },
    benefits: {
      title: "यूनियन के लाभ",
      items: [
        { title: "डिजिटल ID कार्ड", desc: "अपनी फोटो और विवरण के साथ आधिकारिक यूनियन ID कार्ड प्राप्त करें।" },
        { title: "कानूनी सहायता", desc: "कार्यस्थल की समस्याओं के लिए कानूनी सलाह व सहायता।" },
        { title: "सामूहिक आवाज", desc: "जब हजारों लोग एक साथ खड़े होते हैं, तो आपकी आवाज मायने रखती है।" },
        { title: "सरकारी प्रतिनिधित्व", desc: "अधिकारियों के समक्ष समस्याएँ उठाने का सीधा माध्यम।" },
      ],
    },
    howTo: {
      title: "कैसे जुड़ें?",
      subtitle: "PGP यूनियन नेटवर्क सदस्य बनने के चार आसान कदम।",
      steps: [
        { title: "ऑनलाइन रजिस्टर करें", desc: "अपने मूल विवरण के साथ छोटा फॉर्म भरें।" },
        { title: "सत्यापन पूरा करें", desc: "अपनी पहचान और कामगार श्रेणी की पुष्टि करें।" },
        { title: "डिजिटल ID पाएं", desc: "अपनी आधिकारिक यूनियन सदस्यता ID प्राप्त करें।" },
        { title: "सहायता का उपयोग करें", desc: "कानूनी मदद, हेल्पलाइन और सामूहिक आवाज का लाभ लें।" },
      ],
    },
    cta: {
      title: "साथ मिलकर हम मजबूत हैं",
      desc: "अकेले हम असुरक्षित हैं। साथ मिलकर हम शक्तिशाली हैं। आज ही PGP यूनियन नेटवर्क से जुड़ें।",
      join: "यूनियन से जुड़ें",
      login: "सदस्य लॉगिन",
      support: "मदद चाहिए? सपोर्ट से बात करें",
      feeNote: "सरल ऑनलाइन जॉइनिंग — जटिल कागजी कार्रवाई नहीं।",
    },
    sticky: {
      label: "PGP यूनियन नेटवर्क",
      join: "अभी जुड़ें",
    },
    whatsappMsg: "नमस्ते! मुझे PGP यूनियन नेटवर्क में मदद चाहिए। कृपया गाइड करें।",
  },
};

const FEATURE_ICONS = [Shield, Users, IdCard, Phone, Scale, Megaphone];
const HOW_TO_ICONS = [Smartphone, UserCheck, IdCard, Headphones];
const ROLE_IMAGES = [
  "/union_role_erickshaw.png?v=2",
  "/union_role_gig.png?v=2",
  "/union_role_vendor.png?v=2",
  "/union_role_dailywage.png?v=2",
  "/union_role_construction.png?v=2",
  "/union_role_domestic.png?v=2",
];
const BENEFIT_IMAGES = [
  "/union_benefit_idcard.png?v=2",
  "/union_benefit_legal.png?v=2",
  "/union_benefit_voice.png?v=2",
  "/union_benefit_gov.png?v=2",
];
function HeroIllustration() {
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto lg:ml-auto">
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(0,217,95,0.32)_0%,rgba(0,217,95,0.08)_45%,transparent_70%)]" />
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(0,217,95,0.4)_0%,transparent_60%)] blur-2xl" />
      <div className="absolute inset-[6%] rounded-full border border-[#00D95F]/12" />
      <div className="absolute inset-[14%] rounded-full border border-[#00D95F]/18" />
      <div className="absolute inset-[22%] rounded-full border border-[#00D95F]/22" />
      <div className="absolute inset-[30%] rounded-full border border-[#00D95F]/10" />

      <svg className="absolute bottom-[8%] left-[6%] w-24 h-24 text-[#00D95F]/30" viewBox="0 0 100 100" fill="none" aria-hidden>
        <path d="M18 82 C28 42 52 22 84 12 C68 40 54 60 46 82" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-[6%] right-[4%] w-28 h-28 text-[#00D95F]/25" viewBox="0 0 100 100" fill="none" aria-hidden>
        <path d="M82 88 C70 48 46 26 14 14 C36 40 50 62 58 88" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none" aria-hidden>
        <g opacity="0.5" stroke="#00D95F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M68 255 L68 188 C68 172 82 162 96 166 L104 169 L104 142 C104 132 114 126 122 132 C128 136 130 144 130 150 L130 170 L136 170 L136 146 C136 136 146 130 152 136 C158 140 160 148 160 154 L160 174 L166 176 C174 180 178 188 176 196 L164 255" fill="rgba(0,217,95,0.05)" />
          <path d="M332 255 L332 188 C332 172 318 162 304 166 L296 169 L296 142 C296 132 286 126 278 132 C272 136 270 144 270 150 L270 170 L264 170 L264 146 C264 136 254 130 248 136 C242 140 240 148 240 154 L240 174 L234 176 C226 180 222 188 224 196 L236 255" fill="rgba(0,217,95,0.05)" />
        </g>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[46%] aspect-[4/5]">
          <div className="absolute -inset-5 rounded-full bg-[#00D95F]/25 blur-3xl" />
          <svg viewBox="0 0 200 240" className="relative w-full h-full drop-shadow-[0_0_40px_rgba(0,217,95,0.55)]" aria-hidden>
            <defs>
              <linearGradient id="uShieldStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5EFFA3" />
                <stop offset="100%" stopColor="#00D95F" />
              </linearGradient>
              <linearGradient id="uShieldFill" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="rgba(0,217,95,0.2)" />
                <stop offset="100%" stopColor="rgba(4,30,20,0.45)" />
              </linearGradient>
            </defs>
            <path
              d="M100 12 C140 28 168 32 184 36 C184 110 168 170 100 228 C32 170 16 110 16 36 C32 32 60 28 100 12 Z"
              fill="url(#uShieldFill)"
              stroke="url(#uShieldStroke)"
              strokeWidth="5"
            />
            <circle cx="100" cy="88" r="16" fill="#00D95F" />
            <circle cx="68" cy="96" r="12" fill="#00D95F" opacity="0.85" />
            <circle cx="132" cy="96" r="12" fill="#00D95F" opacity="0.85" />
            <path d="M70 150 C70 128 85 118 100 118 C115 118 130 128 130 150 Z" fill="#00D95F" />
            <path d="M42 158 C42 140 54 132 68 132 C78 132 86 138 88 148" fill="#00D95F" opacity="0.85" />
            <path d="M158 158 C158 140 146 132 132 132 C122 132 114 138 112 148" fill="#00D95F" opacity="0.85" />
          </svg>
        </div>
      </div>

      {["top-[16%] left-[20%]", "top-[26%] right-[16%]", "top-[48%] left-[10%]", "bottom-[28%] right-[12%]", "top-[12%] right-[30%]"].map((pos, i) => (
        <span key={i} className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-[#00D95F] shadow-[0_0_8px_#00D95F]`} />
      ))}
    </div>
  );
}

export default function UnionPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#041E14] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_78%_42%,rgba(0,217,95,0.2),transparent_55%),linear-gradient(115deg,#041E14_0%,#0B2F1F_55%,#041E14_100%)]" />

          <div className="relative mx-auto max-w-[1280px] px-6 md:px-16 py-12 sm:pt-16 sm:pb-20 lg:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight text-white font-['Familjen_Grotesk']">
                  {t.hero.titlePre}{" "}
                  <span className="text-[#00D95F]">{t.hero.titleHighlight}</span>{" "}
                  {t.hero.titlePost}
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white mb-6 font-['Familjen_Grotesk']">
                  {t.hero.subtitle}
                </p>
                <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl font-medium font-['Familjen_Grotesk'] line-clamp-3">
                  {t.hero.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/union/join"
                    className="bg-[#00D95F] text-[#041E14] font-extrabold px-8 py-3.5 rounded-full hover:bg-white transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#00D95F]/25 text-sm sm:text-base font-['Familjen_Grotesk']"
                  >
                    {t.hero.join} <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/union/login"
                    className="border border-gray-600/80 bg-white/5 text-white font-extrabold px-8 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base font-['Familjen_Grotesk']"
                  >
                    {t.hero.login} <Users size={18} />
                  </Link>
                </div>
                <p className="mt-5 text-sm sm:text-base font-medium text-white/65 font-['Familjen_Grotesk']">
                  {t.hero.feeNote}
                </p>
              </div>
              <HeroIllustration />
            </div>

            {/* Trust strip */}
            <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-t border-white/10 pt-8">
              {t.trust.items.map((item) => (
                <div key={item.label} className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#00D95F] font-['Familjen_Grotesk']">{item.val}</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-white/60 font-['Familjen_Grotesk']">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT IS */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-[1.15] tracking-tight font-['Familjen_Grotesk']">
                  {t.about.title}
                </h2>
                <div className="mt-4 w-12 h-1 rounded-full bg-[#00D95F]" />
                <p className="mt-8 text-base sm:text-lg font-medium text-[#587E67] leading-relaxed font-['Familjen_Grotesk']">
                  {t.about.desc1}
                </p>
                <p className="mt-4 text-base sm:text-lg font-bold text-[#04330B] leading-relaxed font-['Familjen_Grotesk']">
                  {t.about.desc2}
                </p>
                <p className="mt-4 text-base sm:text-lg font-medium text-[#587E67] leading-relaxed font-['Familjen_Grotesk']">
                  {t.about.desc3}
                </p>
                <p className="mt-4 text-base sm:text-lg font-medium text-[#587E67] leading-relaxed font-['Familjen_Grotesk']">
                  {t.about.desc4}
                </p>
              </div>

              <div className="rounded-[24px] bg-white border border-[#E8EEEA] p-8 sm:p-10 shadow-[0_12px_40px_rgba(4,30,20,0.06)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                  {t.about.features.map((feature, i) => {
                    const Icon = FEATURE_ICONS[i];
                    return (
                      <div key={feature.title} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#E8FBF0] text-[#00D95F] flex items-center justify-center shrink-0">
                          <Icon size={22} strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug font-['Familjen_Grotesk']">{feature.title}</p>
                          <p className="mt-2 text-sm sm:text-base font-medium text-[#587E67] leading-relaxed font-['Familjen_Grotesk']">{feature.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO CAN JOIN */}
        <section className="bg-[#F7FAF8] py-20 lg:py-28">
          <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-['Familjen_Grotesk']">{t.join.title}</h2>
              <div className="mx-auto mt-4 w-12 h-1 rounded-full bg-[#00D95F]" />
              <p className="mt-5 text-base sm:text-lg font-medium text-[#587E67] font-['Familjen_Grotesk']">{t.join.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.join.roles.map((role, i) => (
                <div
                  key={role.title}
                  className="rounded-[24px] bg-white border border-[#E8EEEA] overflow-hidden shadow-[0_8px_28px_rgba(4,30,20,0.04)] flex flex-col group"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#041E14]">
                    <img
                      src={ROLE_IMAGES[i]}
                      alt={role.title}
                      className="w-full h-full object-cover object-[center_20%] group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-['Familjen_Grotesk']">{role.title}</h3>
                    <p className="mt-3 text-sm sm:text-base font-medium text-[#587E67] leading-relaxed font-['Familjen_Grotesk']">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-['Familjen_Grotesk']">{t.benefits.title}</h2>
              <div className="mx-auto mt-4 w-12 h-1 rounded-full bg-[#00D95F]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.benefits.items.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-[24px] bg-white border border-[#E8EEEA] overflow-hidden shadow-[0_8px_28px_rgba(4,30,20,0.05)] flex flex-col group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#041E14]">
                    <img
                      src={BENEFIT_IMAGES[i]}
                      alt={item.title}
                      className="w-full h-full object-cover object-[center_25%] group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-['Familjen_Grotesk']">{item.title}</h3>
                    <p className="mt-3 text-sm sm:text-base font-medium text-[#587E67] leading-relaxed font-['Familjen_Grotesk']">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO JOIN */}
        <section className="bg-[#F7FAF8] py-20 lg:py-28">
          <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-['Familjen_Grotesk']">{t.howTo.title}</h2>
              <div className="mx-auto mt-4 w-12 h-1 rounded-full bg-[#00D95F]" />
              <p className="mt-5 text-base sm:text-lg font-medium text-[#587E67] font-['Familjen_Grotesk']">{t.howTo.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.howTo.steps.map((step, i) => {
                const Icon = HOW_TO_ICONS[i];
                return (
                  <div key={step.title} className="rounded-[24px] bg-white border border-[#E8EEEA] p-6 sm:p-8 shadow-[0_8px_28px_rgba(4,30,20,0.04)]">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-full bg-[#041E14] text-[#00D95F] font-extrabold text-sm flex items-center justify-center font-['Familjen_Grotesk']">
                        {i + 1}
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#E8FBF0] text-[#00D95F] flex items-center justify-center">
                        <Icon size={22} strokeWidth={2} />
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 font-['Familjen_Grotesk']">{step.title}</h3>
                    <p className="mt-3 text-sm sm:text-base font-medium text-[#587E67] leading-relaxed font-['Familjen_Grotesk']">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
            <div className="relative overflow-hidden rounded-[40px] bg-[#041E14] min-h-[380px] flex items-center justify-center text-center shadow-[0_20px_60px_rgba(4,30,20,0.2)]">
              <img src="/union_cta_hands.png" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-[#041E14]/70" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,95,0.25),transparent_55%)]" />
              <div className="relative z-10 px-6 py-16 max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Familjen_Grotesk']">
                  {t.cta.title}
                </h2>
                <p className="mt-4 text-gray-300 text-sm sm:text-base font-medium leading-relaxed font-['Familjen_Grotesk']">{t.cta.desc}</p>
                <p className="mt-3 text-[#00D95F] text-sm sm:text-base font-bold font-['Familjen_Grotesk']">{t.cta.feeNote}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/union/join" className="bg-[#00D95F] text-[#041E14] font-extrabold px-8 py-3.5 rounded-full hover:bg-white transition-colors text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-[#00D95F]/25 font-['Familjen_Grotesk']">
                    {t.cta.join} <ArrowRight size={18} />
                  </Link>
                  <Link href="/union/login" className="border border-gray-600 bg-white/5 text-white font-extrabold px-8 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-colors text-sm sm:text-base font-['Familjen_Grotesk']">
                    {t.cta.login}
                  </Link>
                </div>
                <a
                  href={`https://wa.me/919521627701?text=${encodeURIComponent(t.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-white/80 hover:text-[#00D95F] text-sm sm:text-base font-bold font-['Familjen_Grotesk']"
                >
                  <CheckCircle2 size={18} /> {t.cta.support}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <div className="sm:hidden h-20" aria-hidden />

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#041E14]/95 backdrop-blur-md border-t border-[#00D95F]/30 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2 font-['Familjen_Grotesk']">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D95F] animate-pulse" />
          <span className="text-white text-xs font-bold">{t.sticky.label}</span>
        </div>
        <Link
          href="/union/join"
          className="bg-[#00D95F] text-[#041E14] font-extrabold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-transform font-['Familjen_Grotesk']"
        >
          {t.sticky.join} <ArrowRight size={14} />
        </Link>
      </div>

      <WhatsAppFab message={t.whatsappMsg} />
    </div>
  );
}

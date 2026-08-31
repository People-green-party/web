"use client";

import React from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  Sparkles,
  AlertCircle,
  IdCard,
  Camera,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { WhatsAppFab } from '../../components/WhatsAppFab';
import { useLanguage } from '@/components/LanguageContext';

const joinHref = '/youth-front/join';
const loginHref = '/youth-front/login';
const reportHref = '/youth-front/report-issue';

const translations = {
  en: {
    hero: {
      tag: "ZINDA YOUTH",
      title: "Don't just watch politics.",
      titleHighlight: "Build it.",
      subtitle: "Join India's largest Zinda Youth-powered movement to shape policy, lead change, and build the future we all deserve.",
      pill1: "Be the Change",
      pill2: "Build Your Network",
      pill3: "Create Real Impact",
      btnJoin: "Join Zinda Youth",
      btnReportIssue: "Report an Issue",
      btnLogin: "Login",
      feeNote: "Free to join — pick a track and start creating impact.",
    },
    game: {
      heading: "Your mission, your identity—a new Level at every step!",
      sub: "With Zinda Youth's gamification model, bringing change is now as easy as winning a video game.",
      sub2: "There's no hierarchy here, no boss — you yourself are the leader.",
      level: "Level",
      identity: "Identity",
    },
    tracks: {
      titlePre: "Choose",
      titleHighlight: "your track",
      subtitle: "Find your space. Use your skills. Create impact.",
    },
    cta: {
      titlePre: "The nation needs",
      titleHighlight: "Zinda Youth who act",
      subtitle: "Your skills. Your voice. Your time. No shortcuts. No politics. Just purpose & impact.",
      btnJoin: "Join Zinda Youth",
      btnLogin: "Login",
    },
    sticky: {
      label: "Zinda Youth Movement",
      join: "Join Now",
    },
    whatsappMsg: "Hello! I need help with Zinda Youth. Please guide me.",
  },
  hi: {
    hero: {
      tag: "जिंदा यूथ",
      title: "केवल राजनीति मत देखो।",
      titleHighlight: "बदलाव लाओ।",
      subtitle: "नीति को आकार देने, बदलाव का नेतृत्व करने और भविष्य का निर्माण करने के लिए भारत के सबसे बड़े जिंदा यूथ आंदोलन से जुड़ें।",
      pill1: "बदलाव का हिस्सा बनें",
      pill2: "अपना नेटवर्क बनाएं",
      pill3: "वास्तविक प्रभाव पैदा करें",
      btnJoin: "जिंदा यूथ से जुड़ें",
      btnReportIssue: "मुद्दा रिपोर्ट करें",
      btnLogin: "लॉगिन करें",
      feeNote: "मुफ़्त में जुड़ें — ट्रैक चुनें और प्रभाव बनाना शुरू करें।",
    },
    game: {
      heading: "मिशन आपका, पहचान आपकी—हर कदम पर नया Level!",
      sub: "ज़िंदा यूथ के Gamification मॉडल के साथ, बदलाव लाना अब बस एक वीडियो गेम जीतने जितना आसान है।",
      sub2: "यहाँ कोई ऊँच-नीच नहीं, कोई बॉस नहीं है, आप खुद लीडर हैं।",
      level: "Level",
      identity: "Identity",
    },
    tracks: {
      titlePre: "अपना",
      titleHighlight: "ट्रैक चुनें",
      subtitle: "अपना स्थान खोजें। अपने कौशल का उपयोग करें। प्रभाव बनाएं।",
    },
    cta: {
      titlePre: "देश को ऐसे",
      titleHighlight: "जिंदा यूथ की जरूरत है जो काम करते हैं",
      subtitle: "आपके कौशल। आपकी आवाज। आपका समय। कोई शॉर्टकट नहीं। केवल उद्देश्य और प्रभाव।",
      btnJoin: "जिंदा यूथ से जुड़ें",
      btnLogin: "लॉगिन करें",
    },
    sticky: {
      label: "जिंदा यूथ आंदोलन",
      join: "अभी जुड़ें",
    },
    whatsappMsg: "नमस्ते! मुझे जिंदा यूथ में मदद चाहिए। कृपया गाइड करें।",
  },
};

const CARD_ART = "1020 / 572";

const TRACKS = [
  {
    image: "/zinda-youth/jinda-level-3-report.png?v=11",
    objectPosition: "center",
    en: { title: "Issue Reporter", desc: "Report real issues on the ground via our app." },
    hi: { title: "मुद्दा रिपोर्टर", desc: "हमारे ऐप के माध्यम से जमीन पर वास्तविक मुद्दों की रिपोर्ट करें।" },
  },
  {
    image: "/zinda-youth/zinda-track-digital.png?v=11",
    objectPosition: "center 42%",
    en: { title: "Digital Volunteer", desc: "Create reels, posters, memes, explainers & build our digital reach." },
    hi: { title: "डिजिटल स्वयंसेवक", desc: "रील्स, पोस्टर, मीम्स, व्याख्याकार बनाएं और हमारी पहुंच बढ़ाएं।" },
  },
  {
    image: "/zinda-youth/zinda-track-ground.png?v=11",
    objectPosition: "center 40%",
    en: { title: "Ground Volunteer", desc: "Help with events, campaigns, public interactions & service." },
    hi: { title: "ग्राउंड स्वयंसेवक", desc: "कार्यक्रमों, अभियानों, सार्वजनिक संपर्कों में सहायता करें।" },
  },
  {
    image: "/zinda-youth/jinda-level-4-commander.png?v=11",
    objectPosition: "center",
    en: { title: "Environment Volunteer", desc: "Work on pollution, water, clean-ups & awareness drives." },
    hi: { title: "पर्यावरण स्वयंसेवक", desc: "प्रदूषण, जल, स्वच्छता और जागरूकता अभियानों पर काम करें।" },
  },
  {
    image: "/zinda-youth/zinda-track-research-wide.png?v=12",
    objectPosition: "left 16%",
    en: { title: "Research Volunteer", desc: "Help us by finding data, RTIs, policy info & case studies." },
    hi: { title: "अनुसंधान स्वयंसेवक", desc: "डेटा, आरटीआई, नीति जानकारी और केस स्टडी खोजने में मदद करें।" },
  },
  {
    image: "/zinda-youth/jinda-level-5-legend.png?v=11",
    objectPosition: "center",
    en: { title: "Public Speaker", desc: "Join debates, deliver talks, and communicate our mission." },
    hi: { title: "सार्वजनिक वक्ता", desc: "बहस में शामिल हों, भाषण दें और हमारे मिशन का संचार करें।" },
  },
] as const;

function FittedArt({
  src,
  alt,
  aspect,
  fill = false,
  objectPosition = "center",
  objectFit = "cover",
  className = "",
}: {
  src: string;
  alt: string;
  aspect: string;
  fill?: boolean;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${fill ? "h-full min-h-full" : ""} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-[1.03]`}
        style={{ objectPosition }}
      />
    </div>
  );
}

const LEVELS = [
  {
    n: 1,
    identity: "Zinda",
    image: "/zinda-youth/zinda-level-1-member.png?v=11",
    aspect: "16 / 9",
    imageAlt: "Zinda Youth member holding a Zinda ID card",
    en: {
      title: "Become a member",
      body: "Register and get your Zinda ID. While others are still sleeping — you are alive!",
    },
    hi: {
      title: "Register करके सदस्य बनिए",
      body: "अपना ज़िंदा पहचान पत्र पाइए। देश अभी सो रहा है, लेकिन अब आप ज़िंदा हैं!",
    },
  },
  {
    n: 2,
    identity: "Squadmember",
    image: "/zinda-youth/zinda-level-2-squad-wide.png?v=15",
    aspect: "16 / 9",
    objectPosition: "center",
    imageAlt: "Four Zinda Youth friends standing together as a squad",
    en: {
      title: "Make a square",
      body: "Bring 3 friends who share the passion. Make them Zinda with you!",
    },
    hi: {
      title: "अपने तीन दोस्तों को जोड़िए",
      body: "जिनमें आपके जैसा जज़्बा हो! उन्हें ज़िंदा बनाइए।",
    },
  },
  {
    n: 3,
    identity: "Quester",
    image: "/zinda-youth/zinda-level-3-choose-track.png?v=12",
    aspect: "1020 / 572",
    objectPosition: "center",
    imageAlt: "Zinda Youth leaders choosing a track",
    en: {
      title: "You are now a leader — choose your track",
      body: "Actions as simple as reporting issues valuable for democracy. Click a photo and report potholes, illegal waste, faulty electricity wires, VIP movement causing jams.",
      emphasis: "Or whatever you want to change!",
    },
    hi: {
      title: "अब आप लीडर हैं — अपना ट्रैक चुनिए",
      body: "आप एक तस्वीर लेकर समस्या बताने से शुरू कर सकते हैं — जैसे सड़क पर खतरनाक गड्ढे, बिजली के खतरनाक तार, सड़क पर कचरा, VIP movement के कारण जाम।",
      emphasis: "या जो कुछ भी आप बदलना चाहते हैं!",
    },
  },
  {
    n: 4,
    identity: "Commander",
    image: "/zinda-youth/jinda-level-4-commander.png?v=11",
    aspect: "1020 / 572",
    imageAlt: "A Zinda Youth squad cleaning the street together",
    en: {
      title: "Do 5 such dynamic activities for your nation",
      body: "Five positive actions. Same energy. Bigger proof that you are building the change.",
    },
    hi: {
      title: "देश के लिए इसी तरह के 5 सकारात्मक काम कीजिए",
      body: "पाँच ठोस काम। वही जज़्बा। अब आप बदलाव को साबित करते हैं।",
    },
  },
  {
    n: 5,
    identity: "Legend",
    image: "/zinda-youth/jinda-level-5-legend.png?v=11",
    aspect: "1020 / 572",
    imageAlt: "A Zinda Youth leader speaking to a large cheering crowd",
    en: {
      title: "Make a bigger team",
      body: "Bring new members or existing members together to coordinate a bigger impact.",
    },
    hi: {
      title: "एक बड़ी टीम बनाइए",
      body: "नए सदस्यों के साथ मिलकर एक बड़ी टीम बनाइए और एक बड़े बदलाव पर काम कीजिए।",
    },
  },
] as const;

export default function ZindaYouthPage() {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const t = translations[isHi ? 'hi' : 'en'];

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-white text-gray-800 antialiased font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />

      <main>
        <section className="bg-[#032115] text-white pt-12 sm:pt-16 pb-20 sm:pb-28 px-6 md:px-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#22c55e] opacity-15 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#22c55e] opacity-10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-0 md:right-[8%] -translate-y-1/2 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] bg-[#22c55e] opacity-20 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8 lg:gap-6">
            {/* Left Content */}
            <div className="md:w-[50%] pr-0 md:pr-4 relative z-20">
              <p className="text-[#22c55e] uppercase tracking-[0.2em] text-xs sm:text-sm font-extrabold mb-4 flex items-center gap-2 font-['Familjen_Grotesk']">
                {t.hero.tag}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight font-['Familjen_Grotesk']">
                {t.hero.title} <span className="text-[#22c55e]">{t.hero.titleHighlight}</span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl font-medium font-['Familjen_Grotesk']">
                {t.hero.subtitle}
              </p>
              
              {/* 3 small features */}
              <div className="flex flex-wrap gap-6 mb-8 text-sm font-semibold text-gray-200 font-['Familjen_Grotesk']">
                <div className="flex items-center gap-2"><CheckCircle2 className="text-[#22c55e]" size={18} /> {t.hero.pill1}</div>
                <div className="flex items-center gap-2"><Users className="text-[#22c55e]" size={18} /> {t.hero.pill2}</div>
                <div className="flex items-center gap-2"><Zap className="text-[#22c55e]" size={18} /> {t.hero.pill3}</div>
              </div>

              {/* Buttons — stacked full-width on mobile, wrap on larger screens */}
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 sm:gap-4 mb-4 w-full max-w-md sm:max-w-none">
                <Link 
                  href={joinHref} 
                  className="w-full sm:w-auto justify-center bg-[#22c55e] text-black font-extrabold px-8 py-3.5 rounded-full hover:bg-white transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#22c55e]/25 text-sm sm:text-base font-['Familjen_Grotesk']"
                >
                  {t.hero.btnJoin} <Sparkles size={18} />
                </Link>
                <Link 
                  href={loginHref} 
                  className="w-full sm:w-auto justify-center border border-gray-600/80 bg-white/5 text-white font-extrabold px-8 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base font-['Familjen_Grotesk']"
                >
                  {t.hero.btnLogin} <ArrowRight size={18} />
                </Link>
                <Link 
                  href={reportHref} 
                  className="w-full sm:w-auto justify-center border border-[#22c55e]/50 bg-[#22c55e]/10 text-[#22c55e] font-extrabold px-8 py-3.5 rounded-full hover:bg-[#22c55e]/20 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base font-['Familjen_Grotesk']"
                >
                  {t.hero.btnReportIssue} <AlertCircle size={18} />
                </Link>
              </div>
              <p className="mb-2 md:mb-0 text-sm sm:text-base font-medium text-white/65 font-['Familjen_Grotesk']">
                {t.hero.feeNote}
              </p>
            </div>
            
            {/* Right — live-site merge, new #ZINDAHAI emblem */}
            <div className="md:w-[50%] relative flex justify-center items-center -mt-4 md:mt-0 md:-mr-6 lg:-mr-10">
              <img
                src="/zinda-youth/hero-logo-hi.png?v=11"
                alt="ज़िंदा यूथ — #ZINDAHAI — ज़िद्दी. ज़िंदा. बेखौफ़."
                className="relative z-10 w-full max-w-[560px] lg:max-w-[640px] h-auto object-contain select-none pointer-events-none scale-110 md:scale-125 origin-center mix-blend-lighten [mask-image:radial-gradient(ellipse_70%_76%_at_50%_48%,#000_32%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_70%_76%_at_50%_48%,#000_32%,transparent_72%)]"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
          <section className="mb-24">
            <div className="mx-auto mb-12 w-full text-center">
              <h2 className="w-full max-w-full px-1 text-center text-[clamp(1.15rem,4.4vw,2.25rem)] font-extrabold leading-tight text-gray-900 font-['Familjen_Grotesk'] text-balance">
                {t.game.heading}
              </h2>
              <p
                className="mt-4 w-full px-1 text-center font-medium leading-snug text-gray-700 font-['Familjen_Grotesk'] text-[11px] min-[400px]:text-xs sm:text-[13px] md:text-sm lg:text-[15px] xl:text-base whitespace-nowrap"
              >
                {t.game.sub}
              </p>
              <p className="mt-3 w-full max-w-4xl mx-auto px-1 text-center text-[clamp(0.9rem,3.2vw,1.15rem)] font-semibold leading-snug text-gray-800 font-['Familjen_Grotesk']">
                {t.game.sub2}
              </p>
            </div>

            <div className="relative">
              <div className="space-y-6">
                {LEVELS.map((level, idx) => {
                  const copy = isHi ? level.hi : level.en;
                  const reverse = idx % 2 === 1;

                  return (
                    <React.Fragment key={level.n}>
                      <article
                        className={`relative grid lg:grid-cols-2 overflow-hidden rounded-[28px] bg-[#021d12] text-white ${
                          reverse ? 'lg:[&>div:first-child]:order-2' : ''
                        }`}
                      >
                        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                          <div className="mb-4 flex min-h-8 flex-wrap items-center gap-3">
                            <span className="inline-flex h-8 min-w-[88px] items-center justify-center rounded-md bg-[#22c55e] px-3 text-xs font-black tracking-[0.12em] text-black">
                              {t.game.level} {level.n}
                            </span>
                            <span className="inline-flex h-8 min-w-[188px] items-center justify-center gap-1.5 rounded-md border border-[#22c55e]/50 bg-[#22c55e]/10 px-3 text-xs font-extrabold tracking-[0.08em] text-[#22c55e]">
                              {level.n === 1 ? <IdCard size={13} /> : level.n === 3 ? <Camera size={13} /> : null}
                              {t.game.identity} · {level.identity}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight font-['Familjen_Grotesk']">
                            {copy.title}
                          </h3>
                          <p className="mt-4 text-gray-200 text-[15px] sm:text-base font-medium leading-relaxed font-['Familjen_Grotesk']">
                            {copy.body}
                          </p>
                          {"emphasis" in copy && copy.emphasis ? (
                            <p className="mt-3 text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug text-white font-['Familjen_Grotesk']">
                              {copy.emphasis}
                            </p>
                          ) : null}
                          {level.n === 1 ? (
                            <Link
                              href={joinHref}
                              className="mt-6 inline-flex h-11 min-w-[180px] w-fit items-center justify-center gap-2 rounded-full bg-[#22c55e] px-5 text-sm font-extrabold text-black hover:bg-white transition-colors"
                            >
                              {isHi ? 'सदस्य बनिए' : 'Become a member'} <ArrowRight size={16} />
                            </Link>
                          ) : null}
                        </div>

                        <div className="relative w-full h-full">
                          <FittedArt
                            src={level.image}
                            alt={level.imageAlt}
                            aspect={level.aspect}
                            objectPosition={"objectPosition" in level ? level.objectPosition : "center"}
                            fill
                          />
                        </div>
                      </article>

                      {level.n === 3 ? (
                        <div className="rounded-[28px] border border-gray-200 bg-white p-6 sm:p-8 lg:p-10">
                          <div className="text-center max-w-2xl mx-auto mb-8">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-['Familjen_Grotesk']">
                              {t.tracks.titlePre} <span className="text-[#22c55e]">{t.tracks.titleHighlight}</span>
                            </h3>
                            <p className="mt-2 text-gray-600 text-base font-medium font-['Familjen_Grotesk']">{t.tracks.subtitle}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {TRACKS.map((role) => {
                              const roleCopy = isHi ? role.hi : role.en;
                              return (
                              <Link
                                key={roleCopy.title}
                                href={joinHref}
                                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-[#22c55e] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                              >
                                <FittedArt
                                  src={role.image}
                                  alt={roleCopy.title}
                                  aspect={CARD_ART}
                                  objectPosition={role.objectPosition}
                                />
                                <div className="p-5 flex flex-col justify-between flex-1">
                                  <div>
                                    <h4 className="font-extrabold text-gray-900 text-lg mb-2 group-hover:text-[#22c55e] transition-colors font-['Familjen_Grotesk']">{roleCopy.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium font-['Familjen_Grotesk']">{roleCopy.desc}</p>
                                  </div>
                                  <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
                                    <div className="w-8 h-8 rounded-full bg-[#22c55e] text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                                      <ArrowRight size={16} />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      {idx < LEVELS.length - 1 ? (
                        <div className="flex justify-center py-1" aria-hidden>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/30">
                            <ArrowDown size={20} strokeWidth={3} />
                          </div>
                        </div>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <section className="bg-[#021d12] text-white rounded-[32px] overflow-hidden relative shadow-2xl border border-[#22c55e]/20 min-h-[380px] flex items-center justify-between">
            <div className="hidden xl:block absolute -left-10 top-0 bottom-0 w-[24%] z-10 pointer-events-none">
              <div className="relative w-full h-full rounded-r-full overflow-hidden border-r-[4px] border-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <img
                  src="/jinda_cta_left.png"
                  alt="Passionate Indian Youth"
                  className="w-full h-full object-cover filter saturate-[1.1] brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#021d12]/30 to-[#021d12]" />
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22c55e] opacity-15 blur-[140px] rounded-full pointer-events-none z-0" />

            <div className="relative z-20 max-w-lg sm:max-w-xl mx-auto text-center py-12 px-6 sm:px-8 flex flex-col items-center justify-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-4 tracking-tight leading-tight font-['Familjen_Grotesk']">
                {t.cta.titlePre} <span className="text-[#22c55e]">{t.cta.titleHighlight}</span>
              </h2>

              <p className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium mb-8 max-w-sm sm:max-w-md leading-relaxed font-['Familjen_Grotesk']">
                {t.cta.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={joinHref}
                  className="bg-[#22c55e] text-black font-extrabold px-8 py-3.5 rounded-full hover:bg-white transition-colors text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-[#22c55e]/25 font-['Familjen_Grotesk']"
                >
                  {t.cta.btnJoin} <ArrowRight size={18} />
                </Link>
                <Link
                  href={loginHref}
                  className="border border-gray-600 bg-white/5 text-white font-extrabold px-8 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-colors text-sm sm:text-base font-['Familjen_Grotesk']"
                >
                  {t.cta.btnLogin}
                </Link>
              </div>
            </div>

            <div className="hidden xl:block absolute -right-10 top-0 bottom-0 w-[24%] z-10 pointer-events-none">
              <div className="relative w-full h-full rounded-l-full overflow-hidden border-l-[4px] border-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <img
                  src="/jinda_cta_right.png"
                  alt="Ground Youth Action"
                  className="w-full h-full object-cover filter saturate-[1.1] brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#021d12]/30 to-[#021d12]" />
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <div className="sm:hidden h-20" aria-hidden />

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#032115]/95 backdrop-blur-md border-t border-[#22c55e]/30 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2 font-['Familjen_Grotesk']">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-white text-xs font-bold font-['Familjen_Grotesk']">{t.sticky.label}</span>
        </div>
        <Link
          href={joinHref}
          className="bg-[#22c55e] text-black font-extrabold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-transform font-['Familjen_Grotesk']"
        >
          {t.sticky.join} <ArrowRight size={14} />
        </Link>
      </div>

      <WhatsAppFab message={t.whatsappMsg} />
    </div>
  );
}

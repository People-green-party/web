"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Megaphone, 
  ShieldCheck, 
  Users, 
  Zap, 
  Sparkles,
  Trophy,
  Target,
  UserCheck,
  Cog,
  Smartphone,
  GraduationCap,
  Presentation,
  Landmark,
  Home,
  Video,
  Rocket,
  AlertCircle,
  TrendingUp,
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
      tag: "JINDA YOUTH",
      title: "Don't just watch politics.",
      titleHighlight: "Build it.",
      subtitle: "Join India's largest Jinda Youth-powered movement to shape policy, lead change, and build the future we all deserve.",
      pill1: "Be the Change",
      pill2: "Build Your Network",
      pill3: "Create Real Impact",
      btnJoin: "Join Jinda Youth",
      btnReportIssue: "Report an Issue",
      btnLogin: "Login",
      feeNote: "Free to join — pick a track and start creating impact.",
      stat1Val: "Growing",
      stat1Lbl: "Active Jinda Youth",
      stat2Val: "RJ-wide",
      stat2Lbl: "Districts & campuses",
      stat3Val: "Daily",
      stat3Lbl: "Issues & actions"
    },
    scope: {
      titlePre: "This is not",
      titleHighlight: "only for college students",
      subtitle: "You can join from:",
      items: [
        { image: "/card_college.svg", icon: GraduationCap, text: "College or\nUniversity" },
        { image: "/card_coaching.svg", icon: Presentation, text: "Coaching /\nSkill Labs" },
        { image: "/card_kendra.svg", icon: Landmark, text: "Kendras /\nInstitutes" },
        { image: "/card_village.svg", icon: Home, text: "Villages or\nDistricts" },
        { image: "/card_creator.svg", icon: Video, text: "Digital creator\ncommunity" },
        { image: "/card_startup.svg", icon: Rocket, text: "Entrepreneurs /\nstartup group" },
        { image: "/card_mentor.svg", icon: Users, text: "The experienced\nconnect" }
      ],
      notice: "Wherever you are, whatever your background — if you care, you belong."
    },
    timeline: {
      titlePre: "What will",
      titleHighlight: "you do",
      titlePost: "after joining?",
      steps: [
        { num: 1, icon: Smartphone, title: "Complete your\nverification", color: "bg-green-100 text-green-700" },
        { num: 2, icon: Target, title: "Choose your\ntrack", color: "bg-red-100 text-red-700" },
        { num: 3, icon: Users, title: "Join your district\nJinda Youth cell", color: "bg-green-100 text-green-800" },
        { num: 4, icon: Users, title: "Work in teams on\nreal ground tasks", color: "bg-blue-100 text-blue-700" },
        { num: 5, icon: TrendingUp, title: "Report and rise\nthrough the ranks", color: "bg-emerald-100 text-emerald-700" },
        { num: 6, icon: Trophy, title: "Help build a\nbetter tomorrow", color: "bg-amber-100 text-amber-700" }
      ]
    },
    tracks: {
      titlePre: "Choose",
      titleHighlight: "your track",
      subtitle: "Find your space. Use your skills. Create impact.",
      roles: [
        { 
          image: "/jinda_track_reporter.png", 
          title: 'Issue Reporter', 
          desc: 'Report real issues on the ground via our app.' 
        },
        { 
          image: "/jinda_track_digital.png", 
          title: 'Digital Volunteer', 
          desc: 'Create reels, posters, memes, explainers & build our digital reach.' 
        },
        { 
          image: "/jinda_track_ground.png", 
          title: 'Ground Volunteer', 
          desc: 'Help with events, campaigns, public interactions & service.' 
        },
        { 
          image: "/jinda_track_environment.png", 
          title: 'Environment Volunteer', 
          desc: 'Work on pollution, water, clean-ups & awareness drives.' 
        },
        { 
          image: "/jinda_track_research.png", 
          title: 'Research Volunteer', 
          desc: 'Help us by finding data, RTIs, policy info & case studies.' 
        },
        { 
          image: "/jinda_track_speaker.png", 
          title: 'Public Speaker', 
          desc: 'Join debates, deliver talks, and communicate our mission.' 
        }
      ]
    },
    issueFlow: {
      titlePre: "Your issue will not",
      titleHighlight: "disappear",
      titlePost: "into a form",
      steps: [
        { icon: Smartphone, label: "Report your issue\nvia app or portal" },
        { icon: UserCheck, label: "Verified by\nlocal Jinda Youth" },
        { icon: Users, label: "Assigned to\naction team" },
        { icon: Cog, label: "Update & follow\nprogress" },
        { icon: CheckCircle2, label: "Resolution\nconfirmed" }
      ],
      notice: "Not every issue will become public news. But together, we'll solve what matters - issue after issue.",
      footnote: "This is not a form. Your voice sparks a real change in the system."
    },
    impact: {
      titlePre: "Young voices.",
      titleHighlight: "Real impact.",
      stats: [
        { val: "Growing", label: "Active Jinda Youth" },
        { val: "RJ-wide", label: "Districts & campuses" },
        { val: "Daily", label: "Issues & actions" },
        { val: "Open", label: "Squads forming now" }
      ]
    },
    cta: {
      titlePre: "The nation needs",
      titleHighlight: "Jinda Youth who act",
      subtitle: "Your skills. Your voice. Your time. No shortcuts. No politics. Just purpose & impact.",
      btnJoin: "Join Jinda Youth",
      btnLogin: "Login",
      btnRegisterLater: "Register Later"
    },
    sticky: {
      label: "Jinda Youth Movement",
      join: "Join Now",
    },
    whatsappMsg: "Hello! I need help with Jinda Youth. Please guide me.",
  },
  hi: {
    hero: {
      tag: "जिंदा यूथ",
      title: "केवल राजनीति मत देखो।",
      titleHighlight: "बदलाव बनाओ।",
      subtitle: "नीति को आकार देने, बदलाव का नेतृत्व करने और भविष्य का निर्माण करने के लिए भारत के सबसे बड़े जिंदा यूथ आंदोलन से जुड़ें।",
      pill1: "बदलाव का हिस्सा बनें",
      pill2: "अपना नेटवर्क बनाएं",
      pill3: "वास्तविक प्रभाव पैदा करें",
      btnJoin: "जिंदा यूथ से जुड़ें",
      btnReportIssue: "मुद्दा रिपोर्ट करें",
      btnLogin: "लॉगिन करें",
      feeNote: "मुफ़्त में जुड़ें — ट्रैक चुनें और प्रभाव बनाना शुरू करें।",
      stat1Val: "बढ़ते हुए",
      stat1Lbl: "सक्रिय जिंदा यूथ",
      stat2Val: "पूरा RJ",
      stat2Lbl: "जिले और कैंपस",
      stat3Val: "रोज़",
      stat3Lbl: "मुद्दे और कार्य"
    },
    scope: {
      titlePre: "यह केवल",
      titleHighlight: "कॉलेज छात्रों के लिए नहीं है",
      subtitle: "आप जुड़ सकते हैं:",
      items: [
        { image: "/card_college.svg", icon: GraduationCap, text: "कॉलेज या\nविश्वविद्यालय से" },
        { image: "/card_coaching.svg", icon: Presentation, text: "कोचिंग /\nस्किल लैब से" },
        { image: "/card_kendra.svg", icon: Landmark, text: "संस्थानों से" },
        { image: "/card_village.svg", icon: Home, text: "गांवों या\nजिले से" },
        { image: "/card_creator.svg", icon: Video, text: "डिजिटल क्रिएटर\nकम्युनिटी से" },
        { image: "/card_startup.svg", icon: Rocket, text: "उद्यमियों /\nस्टार्टअप समूह से" },
        { image: "/card_mentor.svg", icon: Users, text: "अनुभवी नेटवर्क से" }
      ],
      notice: "आप जहां भी हैं, आपकी पृष्ठभूमि जो भी हो — यदि आप ध्यान रखते हैं, तो आप हमारे हैं।"
    },
    timeline: {
      titlePre: "जुड़ने के बाद",
      titleHighlight: "आप क्या करेंगे?",
      titlePost: "",
      steps: [
        { num: 1, icon: Smartphone, title: "सत्यापन पूरा करें", color: "bg-green-100 text-green-700" },
        { num: 2, icon: Target, title: "अपना ट्रैक चुनें", color: "bg-red-100 text-red-700" },
        { num: 3, icon: Users, title: "अपने जिला जिंदा यूथ\nसेल में शामिल हों", color: "bg-green-100 text-green-800" },
        { num: 4, icon: Users, title: "जमीनी कार्यों पर\nटीमों में काम करें", color: "bg-blue-100 text-blue-700" },
        { num: 5, icon: TrendingUp, title: "रिपोर्ट करें और\nआगे बढ़ें", color: "bg-emerald-100 text-emerald-700" },
        { num: 6, icon: Trophy, title: "एक बेहतर कल\nबनाने में मदद करें", color: "bg-amber-100 text-amber-700" }
      ]
    },
    tracks: {
      titlePre: "अपना",
      titleHighlight: "ट्रैक चुनें",
      subtitle: "अपना स्थान खोजें। अपने कौशल का उपयोग करें। प्रभाव बनाएं।",
      roles: [
        { image: "/jinda_track_reporter.png", title: 'मुद्दा रिपोर्टर', desc: 'हमारे ऐप के माध्यम से जमीन पर वास्तविक मुद्दों की रिपोर्ट करें।' },
        { image: "/jinda_track_digital.png", title: 'डिजिटल स्वयंसेवक', desc: 'रील्स, पोस्टर, मीम्स, व्याख्याकार बनाएं और हमारी पहुंच बढ़ाएं।' },
        { image: "/jinda_track_ground.png", title: 'ग्राउंड स्वयंसेवक', desc: 'कार्यक्रमों, अभियानों, सार्वजनिक संपर्कों में सहायता करें।' },
        { image: "/jinda_track_environment.png", title: 'पर्यावरण स्वयंसेवक', desc: 'प्रदूषण, जल, स्वच्छता और जागरूकता अभियानों पर काम करें।' },
        { image: "/jinda_track_research.png", title: 'अनुसंधान स्वयंसेवक', desc: 'डेटा, आरटीआई, नीति जानकारी और केस स्टडी खोजने में मदद करें।' },
        { image: "/jinda_track_speaker.png", title: 'सार्वजनिक वक्ता', desc: 'बहस में शामिल हों, भाषण दें और हमारे मिशन का संचार करें।' }
      ]
    },
    issueFlow: {
      titlePre: "आपका मुद्दा फॉर्म में",
      titleHighlight: "गायब नहीं",
      titlePost: "होगा",
      steps: [
        { icon: Smartphone, label: "ऐप या पोर्टल से\nमुद्दा सबमिट करें" },
        { icon: UserCheck, label: "स्थानीय जिंदा यूथ द्वारा\nसत्यापित" },
        { icon: Users, label: "एक्शन टीम को\nआवंटित" },
        { icon: Cog, label: "अपडेट और\nफॉलो-अप करें" },
        { icon: CheckCircle2, label: "समाधान की\nपुष्टि" }
      ],
      notice: "हर मुद्दा सार्वजनिक समाचार नहीं बनेगा। लेकिन साथ मिलकर, हम हर महत्वपूर्ण समस्या का समाधान करेंगे।",
      footnote: "यह केवल एक फॉर्म नहीं है। आपकी आवाज व्यवस्था में वास्तविक बदलाव लाती है।"
    },
    impact: {
      titlePre: "युवा आवाज।",
      titleHighlight: "वास्तविक प्रभाव।",
      stats: [
        { val: "बढ़ते हुए", label: "सक्रिय जिंदा यूथ" },
        { val: "पूरा RJ", label: "जिले और कैंपस" },
        { val: "रोज़", label: "मुद्दे और कार्य" },
        { val: "खुला", label: "स्क्वाड बन रहे हैं" }
      ]
    },
    cta: {
      titlePre: "देश को ऐसे",
      titleHighlight: "जिंदा यूथ की जरूरत है जो काम करते हैं",
      subtitle: "आपके कौशल। आपकी आवाज। आपका समय। कोई शॉर्टकट नहीं। केवल उद्देश्य और प्रभाव।",
      btnJoin: "जिंदा यूथ से जुड़ें",
      btnLogin: "लॉगिन करें",
      btnRegisterLater: "बाद में पंजीकरण करें"
    },
    sticky: {
      label: "जिंदा यूथ आंदोलन",
      join: "अभी जुड़ें",
    },
    whatsappMsg: "नमस्ते! मुझे जिंदा यूथ में मदद चाहिए। कृपया गाइड करें।",
  }
};

export default function JindaYouthPage() {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'hi'] || translations.en;

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />

      <main>
        {/* 1. HERO SECTION */}
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
            
            {/* Right — logo merged into hero (no rectangular frame) */}
            <div className="md:w-[50%] relative flex justify-center items-center -mt-4 md:mt-0 md:-mr-6 lg:-mr-10">
              <img 
                key={language}
                src={language === 'hi' ? '/jinda_youth_hero_blend_hi.png' : '/jinda_youth_hero_blend.png'} 
                alt={language === 'hi' ? 'जिंदा यूथ — ज़िद्दी. ज़िंदा. बेखौफ़.' : 'Jinda Youth — Ziddi. Zinda. Bekhauf.'} 
                className="relative z-10 w-full max-w-[560px] lg:max-w-[640px] h-auto object-contain select-none pointer-events-none scale-110 md:scale-125 origin-center transition-opacity duration-300"
              />
            </div>
          </div>
        </section>

        {/* MAIN CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">

          {/* 2. THIS IS NOT ONLY FOR COLLEGE STUDENTS */}
          <section className="mb-24">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 font-['Familjen_Grotesk']">
              {t.scope.titlePre} <span className="text-[#22c55e]">{t.scope.titleHighlight}</span>
            </h2>
            <p className="text-[#032115] font-bold text-lg sm:text-xl mb-8 font-['Familjen_Grotesk']">{t.scope.subtitle}</p>

            {/* Row 1: 4 Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {t.scope.items.slice(0, 4).map((item, idx) => {
                return (
                  <div 
                    key={idx} 
                    className="border border-gray-200/90 rounded-2xl overflow-hidden hover:border-[#15803d] hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-[#032115]">
                      <img 
                        src={item.image} 
                        alt={item.text.replace('\n', ' ')} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-sm sm:text-base font-extrabold text-gray-900 whitespace-pre-line leading-tight font-['Familjen_Grotesk']">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row 2: 3 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {t.scope.items.slice(4, 7).map((item, idx) => {
                return (
                  <div 
                    key={idx} 
                    className="border border-gray-200/90 rounded-2xl overflow-hidden hover:border-[#15803d] hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-[#032115]">
                      <img 
                        src={item.image} 
                        alt={item.text.replace('\n', ' ')} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-sm sm:text-base font-extrabold text-gray-900 whitespace-pre-line leading-tight font-['Familjen_Grotesk']">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Green Notice Bar */}
            <div className="rounded-2xl bg-[#eaf7ee] p-2 flex items-center gap-4 border border-[#bbf7d0] overflow-hidden shadow-sm">
              <div className="bg-[#032115] text-[#22c55e] p-3.5 sm:p-4 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck size={26} />
              </div>
              <p className="text-base sm:text-lg text-[#04330b] font-medium leading-tight pr-4 font-['Familjen_Grotesk']">
                Wherever you are, whatever your background — <strong className="font-extrabold text-[#032115]">if you care, <span className="text-[#15803d]">you belong.</span></strong>
              </p>
            </div>
          </section>

          {/* 3. WHAT WILL YOU DO AFTER JOINING? */}
          <section className="mb-24">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Title Column */}
              <div className="lg:col-span-3">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight font-['Familjen_Grotesk']">
                  What will <span className="text-[#22c55e]">you do</span><br />after joining?
                </h2>
                <div className="w-12 h-1 bg-[#22c55e] rounded-full mt-3" />
              </div>

              {/* Right 6 Steps Row */}
              <div className="lg:col-span-9">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                  
                  {t.timeline.steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.num} className="flex flex-col items-center text-center group relative">
                        
                        {/* Step Number Badge + Arrow Header */}
                        <div className="flex items-center justify-center w-full mb-3 relative">
                          <div className="w-8 h-8 rounded-full bg-[#04330b] text-[#22c55e] font-extrabold text-sm flex items-center justify-center shadow-sm z-10 font-['Familjen_Grotesk']">
                            {step.num}
                          </div>

                          {/* Connecting Dotted Line */}
                          {idx < t.timeline.steps.length - 1 && (
                            <div className="hidden lg:block absolute left-[55%] right-[-45%] top-1/2 -translate-y-1/2 h-[2px] border-b-2 border-dashed border-[#22c55e]/60 z-0">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-[#22c55e]" />
                            </div>
                          )}
                        </div>

                        {/* Circular Light-Green Badge */}
                        <div className="w-24 h-24 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] shadow-[0_4px_20px_rgba(34,197,94,0.12)] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-green-100">
                            <StepIcon className="text-[#22c55e] group-hover:scale-110 transition-transform" size={28} />
                          </div>
                        </div>

                        {/* Text */}
                        <p className="text-sm font-bold text-gray-800 whitespace-pre-line leading-tight px-1 font-['Familjen_Grotesk']">
                          {step.title}
                        </p>

                      </div>
                    );
                  })}

                </div>
              </div>

            </div>
          </section>

          {/* 4. CHOOSE YOUR TRACK (6 PHOTO CARDS) */}
          <section className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 font-['Familjen_Grotesk']">
                {t.tracks.titlePre} <span className="text-[#22c55e]">{t.tracks.titleHighlight}</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg font-medium font-['Familjen_Grotesk']">{t.tracks.subtitle}</p>
            </div>
            
            {/* 6 Photo Cards Grid — 3x2 on desktop for readable text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {t.tracks.roles.map((role, idx) => (
                <Link 
                  key={idx}
                  href={joinHref}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-[#22c55e] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={role.image} 
                      alt={role.title} 
                      className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-lg mb-2 group-hover:text-[#22c55e] transition-colors font-['Familjen_Grotesk']">{role.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium font-['Familjen_Grotesk']">{role.desc}</p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-[#22c55e] text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 5. YOUR ISSUE WILL NOT DISAPPEAR INTO A FORM (Contains the ONLY Report Issue Action Button) */}
          <section className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 leading-tight font-['Familjen_Grotesk']">
                    {t.issueFlow.titlePre} <span className="text-[#15803d]">{t.issueFlow.titleHighlight}</span>{" "}
                    {t.issueFlow.titlePost}
                  </h2>

                  <div className="flex items-start justify-between gap-1 sm:gap-2 mb-8 overflow-x-auto pb-2">
                    {t.issueFlow.steps.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isLast = idx === t.issueFlow.steps.length - 1;

                      return (
                        <React.Fragment key={idx}>
                          <div className="flex flex-col items-center text-center shrink-0 min-w-[70px] sm:min-w-[85px] max-w-[95px]">
                            {isLast ? (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#15803d] text-white flex items-center justify-center mb-3 shadow-md shadow-[#15803d]/30">
                                <CheckCircle2 size={26} strokeWidth={2.5} />
                              </div>
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#eaf7ee] border border-[#bbf7d0] text-[#032115] flex items-center justify-center mb-3 shadow-sm">
                                <StepIcon size={22} strokeWidth={2} />
                              </div>
                            )}
                            <p className="text-xs sm:text-sm font-extrabold text-gray-800 whitespace-pre-line leading-tight font-['Familjen_Grotesk']">
                              {step.label}
                            </p>
                          </div>

                          {!isLast && (
                            <div className="flex items-center justify-center shrink-0 text-gray-300 mt-4 sm:mt-5">
                              <ArrowRight size={14} strokeWidth={2} />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div>
                  {/* Notice Box with Report an Issue Button */}
                  <div className="bg-[#fff5eb] border border-[#ffedd5] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 mb-4">
                    <div className="flex items-center gap-3">
                      <Megaphone size={26} className="text-[#ea580c] shrink-0" />
                      <p className="text-sm sm:text-base font-bold text-[#c2410c] leading-snug font-['Familjen_Grotesk']">
                        {t.issueFlow.notice}
                      </p>
                    </div>
                    <Link 
                      href={reportHref}
                      className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold px-5 py-2.5 rounded-xl transition-colors text-sm shrink-0 flex items-center gap-1.5 shadow-md shadow-orange-500/20 font-['Familjen_Grotesk']"
                    >
                      {t.hero.btnReportIssue} <AlertCircle size={14} />
                    </Link>
                  </div>

                  <p className="text-sm text-gray-400 font-medium font-['Familjen_Grotesk']">
                    {t.issueFlow.footnote}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[360px] lg:min-h-full border border-gray-200 shadow-md group">
                <img 
                  src="/jinda_issue_action.png" 
                  alt="Real Ground Issue Action" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute bottom-5 left-5 right-5 bg-[#032115]/85 backdrop-blur-md border border-[#22c55e]/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
                  <div className="w-11 h-11 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e] shrink-0">
                    <Users size={22} strokeWidth={2} />
                  </div>
                  <div className="font-['Familjen_Grotesk']">
                    <p className="text-sm sm:text-base font-bold text-white leading-tight">Real People.</p>
                    <p className="text-sm sm:text-base font-bold text-white leading-tight">Real Problems.</p>
                    <p className="text-sm sm:text-base font-extrabold text-[#22c55e] leading-tight">Real Change.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* IMPACT / TRUST STATS */}
          <section className="mb-24">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-['Familjen_Grotesk']">
                {t.impact.titlePre} <span className="text-[#22c55e]">{t.impact.titleHighlight}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {t.impact.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-6 sm:p-8 text-center"
                >
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#15803d] font-['Familjen_Grotesk']">{stat.val}</p>
                  <p className="mt-2 text-sm sm:text-base font-bold text-gray-700 font-['Familjen_Grotesk']">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* 6. BOTTOM CTA SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <section className="bg-[#021d12] text-white rounded-[32px] overflow-hidden relative shadow-2xl border border-[#22c55e]/20 min-h-[380px] flex items-center justify-between">
            
            {/* Left Curved Image */}
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

            {/* Background green glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22c55e] opacity-15 blur-[140px] rounded-full pointer-events-none z-0" />

            {/* Center Content */}
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

            {/* Right Curved Image */}
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

      {/* Spacer so sticky bar doesn't cover footer links on mobile */}
      <div className="sm:hidden h-20" aria-hidden />

      {/* Sticky Mobile Action Bar */}
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

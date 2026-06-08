"use client";

import Link from 'next/link';
import { ArrowRight, Users, Shield, FileText, Phone } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { useLanguage } from '@/components/LanguageContext';

const translations = {
  hi: {
    hero: {
      title: "PGP यूनियन नेटवर्क",
      subtitle: "एकता में ही शक्ति है",
      description: "PGP यूनियन नेटवर्क असंगठित क्षेत्र के कामगारों — जैसे ई-रिक्शा चालक, गिग वर्कर्स, रेहड़ी-पटरी विक्रेता और दैनिक वेतन भोगी मजदूरों — को संगठित होने, उनके अधिकारों की रक्षा करने और सामूहिक शक्ति का निर्माण करने में सशक्त बनाता है।"
    },
    buttons: {
      join: "यूनियन से जुड़ें",
      login: "लॉगिन करें"
    },
    about: {
      title: "PGP यूनियन नेटवर्क क्या है?",
      desc1: "असंगठित कामगार हमारी अर्थव्यवस्था की रीढ़ हैं, फिर भी उनकी कोई सामूहिक आवाज, कोई कानूनी सुरक्षा और कोई सौदेबाजी की शक्ति नहीं है।",
      desc2: "PGP यूनियन नेटवर्क इन सभी कामगारों को एक संगठित और एकीकृत शक्ति के रूप में साथ लाता है।",
      bullet1: "कानूनी सुरक्षा और अधिकारों के प्रति जागरूकता",
      bullet2: "सामूहिक सौदेबाजी की शक्ति",
      bullet3: "डिजिटल ID कार्ड और दस्तावेजीकरण",
      bullet4: "सीधा संपर्क और सहायता"
    },
    eligibility: {
      title: "कौन जुड़ सकता है?",
      items: [
        'ई-रिक्शा चालक',
        'गिग वर्कर्स (डिलिवरी/कैब)',
        'रेहड़ी-पटरी विक्रेता',
        'दैनिक वेतनभोगी मजदूर',
        'निर्माण मजदूर',
        'घरेलू कामगार'
      ]
    },
    benefits: {
      title: "यूनियन के लाभ",
      items: [
        { title: 'डिजिटल ID कार्ड', desc: 'अपनी फोटो और विवरण के साथ एक आधिकारिक यूनियन ID कार्ड प्राप्त करें' },
        { title: 'कानूनी सहायता', desc: 'कार्यस्थल की समस्याओं के लिए कानूनी सलाह व सहायता तक पहुंच' },
        { title: 'सामूहिक आवाज', desc: 'जब हजारों लोग एक साथ खड़े होते हैं, तो आपकी आवाज मायने रखती है' },
        { title: 'सरकारी प्रतिनिधित्व', desc: 'अधिकारियों के समक्ष अपनी समस्याओं को उठाने का सीधा माध्यम' }
      ]
    },
    cta: {
      title: "साथ मिलकर हम मजबूत हैं",
      desc: "अकेले हम असुरक्षित हैं। साथ मिलकर हम शक्तिशाली हैं। आज ही PGP यूनियन नेटवर्क से जुड़ें।",
      login: "सदस्य लॉगिन"
    }
  },
  en: {
    hero: {
      title: "PGP Union Network",
      subtitle: "Strength in Unity",
      description: "PGP Union Network empowers unorganized workers — e-rickshaw drivers, gig workers, street vendors, and daily wage earners — to organize, protect their rights, and build collective strength."
    },
    buttons: {
      join: "Join Union",
      login: "Login"
    },
    about: {
      title: "What is PGP Union Network?",
      desc1: "Unorganized workers are the backbone of our economy, yet they have no collective voice, no legal protection, and no bargaining power.",
      desc2: "PGP Union Network brings these workers together into a unified force.",
      bullet1: "Legal protection and rights awareness",
      bullet2: "Collective bargaining power",
      bullet3: "Digital ID cards and documentation",
      bullet4: "Direct communication and support"
    },
    eligibility: {
      title: "Who can join?",
      items: [
        'E-rickshaw drivers',
        'Gig workers',
        'Street vendors',
        'Daily wage earners',
        'Construction workers',
        'Domestic workers'
      ]
    },
    benefits: {
      title: "Union Benefits",
      items: [
        { title: 'Digital ID Card', desc: 'Get an official union ID card with your photo and details' },
        { title: 'Legal Support', desc: 'Access to legal advice and support for workplace issues' },
        { title: 'Collective Voice', desc: 'Your voice matters when thousands stand together' },
        { title: 'Government Representation', desc: 'Direct channel to raise issues with authorities' }
      ]
    },
    cta: {
      title: "Together we are stronger",
      desc: "Alone we are vulnerable. Together we are powerful. Join the PGP Union Network today.",
      login: "Member Login"
    }
  }
};

export default function UnionPage() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
            <h1 className="text-4xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-2xl lg:text-3xl font-bold text-[#BBF7D0]">
              {t.hero.subtitle}
            </p>
            <p className="mt-6 max-w-3xl text-lg text-white/78 leading-8">
              {t.hero.description}
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link href="/union/join" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-7 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                {t.buttons.join} <ArrowRight size={20} />
              </Link>
              <Link href="/union/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 font-black text-white">
                {t.buttons.login} <Users size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* What is Union Network */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.about.title}</h2>
          <div className="rounded-[32px] bg-white border border-[#DDEEE4] p-8 lg:p-12">
            <p className="text-lg text-[#04330B] font-semibold leading-8 mb-4">
              {t.about.desc1}
            </p>
            <p className="text-lg text-[#04330B] font-bold leading-8 mb-4">
              {t.about.desc2}
            </p>
            <div className="grid gap-3 mt-6">
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <Shield size={20} className="text-[#16A34A]" /> {t.about.bullet1}
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <Users size={20} className="text-[#16A34A]" /> {t.about.bullet2}
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <FileText size={20} className="text-[#16A34A]" /> {t.about.bullet3}
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <Phone size={20} className="text-[#16A34A]" /> {t.about.bullet4}
              </div>
            </div>
          </div>
        </section>

        {/* Who can join */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.eligibility.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.eligibility.items.map((item) => (
              <div key={item} className="rounded-2xl bg-white border border-[#DDEEE4] p-5 font-bold text-[#04330B]">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.benefits.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.benefits.items.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-white border border-[#DDEEE4] p-6">
                <h3 className="text-xl font-black text-[#04330B]">{benefit.title}</h3>
                <p className="mt-3 text-[#587E67] font-semibold leading-7">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24 text-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.cta.title}</h2>
            <p className="max-w-3xl mx-auto text-lg text-white/78 leading-8 mb-8">
              {t.cta.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/union/join" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-8 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                {t.buttons.join} <ArrowRight size={20} />
              </Link>
              <Link href="/union/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-black text-white">
                {t.cta.login} <Users size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

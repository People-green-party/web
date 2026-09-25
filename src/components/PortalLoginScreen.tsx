"use client";

import React from "react";
import Link from "next/link";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LockKeyhole,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";

export type PortalLoginVariant = "member" | "union" | "youth" | "internship";

type Copy = {
  portal: string;
  leftTitle: string;
  leftSubtitle: string;
  welcomeText: string;
  leftSlogan: string;
  rightSlogan: string;
  footerLine: string;
  joinPrompt: string;
  joinLabel: string;
  benefits: Array<[string, string]>;
};

const copy: Record<PortalLoginVariant, Record<"hi" | "en", Copy>> = {
  member: {
    en: {
      portal: "MEMBER PORTAL",
      leftTitle: "Member Login",
      leftSubtitle: "Login to access your member dashboard",
      welcomeText: "Login with your mobile number to continue to your member dashboard.",
      leftSlogan: "People\nPlanet\nProgress",
      rightSlogan: "Stronger People\nA Greener India",
      footerLine: "For a Sustainable Tomorrow",
      joinPrompt: "New to PGP?",
      joinLabel: "Become a Member",
      benefits: [["View membership details", "Stay updated with your profile"], ["Access party updates", "News, events and initiatives"], ["Be part of the change", "Together for a greener India"]],
    },
    hi: {
      portal: "सदस्य पोर्टल",
      leftTitle: "सदस्य लॉगिन",
      leftSubtitle: "अपने सदस्य डैशबोर्ड में जाने के लिए लॉगिन करें",
      welcomeText: "अपने सदस्य डैशबोर्ड पर जाने के लिए मोबाइल नंबर से लॉगिन करें।",
      leftSlogan: "People\nPlanet\nProgress",
      rightSlogan: "Stronger People\nA Greener India",
      footerLine: "एक टिकाऊ कल के लिए",
      joinPrompt: "PGP में नए हैं?",
      joinLabel: "सदस्य बनें",
      benefits: [["सदस्यता विवरण देखें", "अपनी प्रोफाइल की जानकारी पाएँ"], ["पार्टी अपडेट प्राप्त करें", "समाचार, कार्यक्रम और पहल"], ["बदलाव का हिस्सा बनें", "हरित भारत के लिए साथ आएँ"]],
    },
  },
  union: {
    en: {
      portal: "UNION PORTAL",
      leftTitle: "Union Member Login",
      leftSubtitle: "Login to access your union dashboard",
      welcomeText: "Login with your mobile number to access your union dashboard.",
      leftSlogan: "“The strength of organisation,\nthe direction of a better India”",
      rightSlogan: "United\nfor a\nGreener\nTomorrow",
      footerLine: "People  |  Planet  |  Progress",
      joinPrompt: "Not a union member yet?",
      joinLabel: "Join Union Member",
      benefits: [["Union information", "Get the latest union updates"], ["Documents and resources", "Access important documents"], ["Meetings and events", "View upcoming events"], ["Communication and updates", "Stay connected"]],
    },
    hi: {
      portal: "यूनियन पोर्टल",
      leftTitle: "यूनियन सदस्य लॉगिन",
      leftSubtitle: "अपने यूनियन डैशबोर्ड में जाने के लिए लॉगिन करें",
      welcomeText: "अपने यूनियन डैशबोर्ड पर जाने के लिए मोबाइल नंबर से लॉगिन करें।",
      leftSlogan: "“संगठन की शक्ति,\nबेहतर भारत की दिशा”",
      rightSlogan: "United\nfor a\nGreener\nTomorrow",
      footerLine: "पीपल  |  प्लैनेट  |  प्रोग्रेस",
      joinPrompt: "अभी यूनियन सदस्य नहीं हैं?",
      joinLabel: "यूनियन सदस्य बनें",
      benefits: [["यूनियन से जुड़ी जानकारी", "नवीनतम यूनियन अपडेट पाएँ"], ["दस्तावेज और संसाधन", "महत्वपूर्ण दस्तावेज देखें"], ["बैठक और कार्यक्रम", "आगामी कार्यक्रम देखें"], ["संचार और अपडेट", "हमसे जुड़े रहें"]],
    },
  },
  youth: {
    en: {
      portal: "ZINDA YOUTH",
      leftTitle: "Zinda Youth Login",
      leftSubtitle: "Login to access your Zinda Youth dashboard",
      welcomeText: "Login with your mobile number to access your Zinda Youth dashboard.",
      leftSlogan: "#ZINDAHAI",
      rightSlogan: "Yuva\nSoch\nHarit Kal",
      footerLine: "Youth  |  Diversity  |  Opportunity",
      joinPrompt: "New to Zinda Youth?",
      joinLabel: "Join Zinda Youth",
      benefits: [["Join youth initiatives", "Take part in youth campaigns"], ["Events and opportunities", "Get event updates"], ["Track your participation", "See your activity and progress"], ["Be part of the community", "Create change together"]],
    },
    hi: {
      portal: "जिंदा यूथ",
      leftTitle: "जिंदा युवा लॉगिन",
      leftSubtitle: "अपने जिंदा यूथ डैशबोर्ड में जाने के लिए लॉगिन करें",
      welcomeText: "अपने जिंदा यूथ डैशबोर्ड पर जाने के लिए मोबाइल नंबर से लॉगिन करें।",
      leftSlogan: "#ZINDAHAI",
      rightSlogan: "Yuva\nSoch\nHarit Kal",
      footerLine: "युवा  |  विविधता  |  अवसर",
      joinPrompt: "जिंदा यूथ में नए हैं?",
      joinLabel: "जिंदा यूथ से जुड़ें",
      benefits: [["युवा अभियानों से जुड़ें", "युवा पहलों में भाग लें"], ["इवेंट्स और अवसर", "कार्यक्रमों की जानकारी पाएँ"], ["अपनी सहभागिता देखें", "गतिविधि और प्रगति देखें"], ["समुदाय का हिस्सा बनें", "मिलकर बदलाव लाएँ"]],
    },
  },
  internship: {
    en: {
      portal: "INTERNSHIP PORTAL",
      leftTitle: "Internship Portal",
      leftSubtitle: "Login to access your internship portal and explore opportunities with PGP.",
      welcomeText: "Login with your mobile number to access your internship portal.",
      leftSlogan: "Learn\nGrow\nMake an Impact",
      rightSlogan: "Build Your\nFuture, with\nPGP",
      footerLine: "Youth  |  Leadership  |  Change",
      joinPrompt: "New to the PGP Internship Portal?",
      joinLabel: "Create an Account",
      benefits: [["Internship opportunities", "Explore the latest openings"], ["Application and tracking", "Apply and track your status"], ["Profile management", "Manage your profile and details"], ["Learn and grow", "Gain experience and build your future"]],
    },
    hi: {
      portal: "इंटर्नशिप पोर्टल",
      leftTitle: "इंटर्नशिप पोर्टल",
      leftSubtitle: "अपने इंटर्नशिप पोर्टल में लॉगिन करें और PGP के साथ अवसर खोजें।",
      welcomeText: "अपने इंटर्नशिप पोर्टल पर जाने के लिए मोबाइल नंबर से लॉगिन करें।",
      leftSlogan: "Learn\nGrow\nMake an Impact",
      rightSlogan: "Build Your\nFuture, with\nPGP",
      footerLine: "युवा  |  नेतृत्व  |  बदलाव",
      joinPrompt: "PGP इंटर्नशिप पोर्टल पर नए हैं?",
      joinLabel: "आवेदन करें",
      benefits: [["इंटर्नशिप अवसरों की जानकारी", "नवीनतम अवसर देखें"], ["आवेदन और ट्रैकिंग", "आवेदन करें और स्थिति देखें"], ["प्रोफाइल प्रबंधन", "अपनी जानकारी सँभालें"], ["सीखें और बढ़ें", "अनुभव पाएँ और भविष्य बनाएँ"]],
    },
  },
};

const variantImages: Record<PortalLoginVariant, string> = {
  member: "/login-portals/member-bg.png",
  union: "/login-portals/union-bg.png",
  youth: "/login-portals/youth-bg.png",
  internship: "/login-portals/internship-bg.png",
};

const mobileImagePosition: Record<PortalLoginVariant, string> = {
  member: "78% center",
  union: "82% center",
  youth: "84% center",
  internship: "82% center",
};

const benefitIcons = [ShieldCheck, FileText, UsersRound, CalendarDays, MessageCircle, BriefcaseBusiness, UserRound, Star, Rocket];

type Props = {
  variant: PortalLoginVariant;
  language: string;
  step: "phone" | "otp";
  phone: string;
  otp: string;
  loading: boolean;
  error?: string;
  info?: string;
  sendLabel: string;
  sendingLabel: string;
  verifyLabel: string;
  verifyingLabel: string;
  onPhoneChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onSend: (event: React.FormEvent) => void;
  onVerify: (event: React.FormEvent) => void;
  onChangeNumber: () => void;
  joinHref: string;
  resendLabel?: string;
  onResend?: () => void;
  resendDisabled?: boolean;
};

export function PortalLoginScreen(props: Props) {
  const isHi = props.language === "hi";
  const c = copy[props.variant][isHi ? "hi" : "en"];
  const LeftIcon = props.variant === "union" ? BriefcaseBusiness : props.variant === "internship" ? UserRound : UsersRound;
  const displayPhone = `+91 ${props.phone.slice(0, 5)} ${props.phone.slice(5)}`.trim();

  return (
    <div className="min-h-screen bg-[#f7fcf9] font-['Familjen_Grotesk'] text-[#062c1b]">
      <Navbar />
      <main className="relative min-h-[calc(100svh-70px)] overflow-hidden pt-[70px] lg:min-h-[calc(100vh-92px)] lg:pt-[92px]">
        <img src={variantImages[props.variant]} alt="" className="absolute inset-0 hidden h-full w-full object-cover object-center lg:block" />
        <img
          src={variantImages[props.variant]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70 lg:hidden"
          style={{ objectPosition: mobileImagePosition[props.variant] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-[#f7fcf9]/70 to-[#f7fcf9] lg:bg-white/5" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-70px)] w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-8 sm:px-5 lg:min-h-[calc(100vh-92px)] lg:grid-cols-[minmax(270px,.82fr)_minmax(480px,1.15fr)_minmax(270px,.82fr)] lg:px-14 lg:py-12">
        <aside className="hidden self-stretch py-6 lg:flex lg:flex-col lg:justify-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dff4e7] text-[#05602c]"><LeftIcon size={32} /></div>
          <h1 className="text-[34px] font-black leading-tight tracking-[-.03em]">{c.leftTitle}</h1>
          <p className="mt-2 max-w-[300px] text-lg font-medium leading-6 text-[#587267]">{c.leftSubtitle}</p>
          <div className="mt-8 space-y-5">
            {c.benefits.map(([title, body], index) => {
              const Icon = benefitIcons[index % benefitIcons.length];
              return <div key={title} className="flex items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e4f6eb] text-[#05602c]"><Icon size={23} /></span><span><strong className="block text-[16px] leading-5">{title}</strong><small className="mt-1 block text-sm font-medium text-[#61776e]">{body}</small></span></div>;
            })}
          </div>
          <div className="mt-8 border-t border-[#ccdfd3] pt-6">
            <div className="whitespace-pre-line text-[40px] font-bold italic leading-[.9] text-[#05602c] [font-family:var(--font-handwritten)]">
              {c.leftSlogan}
            </div>
            <span aria-hidden="true" className="mt-2 block h-[4px] w-40 -rotate-3 rounded-full bg-[#08713c]" />
          </div>
        </aside>

        <section className="mx-auto w-full max-w-[590px] rounded-[22px] border border-[#d9e9df] bg-white/95 px-5 py-8 shadow-[0_24px_70px_rgba(5,77,35,.13)] backdrop-blur-md sm:rounded-[26px] sm:px-11 sm:py-11">
          <div className="text-center">
            <p className="text-[13px] font-black uppercase tracking-[.28em] text-[#0d7940]">{c.portal}</p>
            <h2 className="mt-3 text-[34px] font-black tracking-[-.035em] text-[#092c25]">{props.step === "phone" ? (isHi ? "फिर से स्वागत है" : "Welcome Back") : (isHi ? "OTP सत्यापन" : "OTP Verification")}</h2>
            <p className="mx-auto mt-2 max-w-[420px] text-[17px] font-medium leading-6 text-[#607381]">{props.step === "phone" ? c.welcomeText : (isHi ? `OTP ${displayPhone} पर भेजा गया है।` : `OTP has been sent to ${displayPhone}.`)}</p>
          </div>

          {props.error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{props.error}</div> : null}
          {props.info && !props.error ? <div className="mt-6 rounded-xl border border-[#b9d3c4] bg-[#eaf7ee] px-4 py-3 text-sm font-semibold text-[#0d5229]">{props.info}</div> : null}

          {props.step === "phone" ? (
            <form onSubmit={props.onSend} className="mt-8">
              <label className="text-sm font-bold">{isHi ? "मोबाइल नंबर" : "Mobile Number"}</label>
              <div className="mt-2 flex h-[58px] overflow-hidden rounded-xl border border-[#9fb6aa] bg-white focus-within:border-[#08703a]">
                <span className="flex w-[82px] items-center justify-center border-r border-[#b8c9c0] text-lg font-black text-[#075a30]">+91</span>
                <input value={props.phone} onChange={(e) => props.onPhoneChange(e.target.value)} inputMode="numeric" maxLength={10} autoComplete="tel" className="min-w-0 flex-1 px-4 text-lg font-semibold outline-none" placeholder={isHi ? "10 अंकों का मोबाइल नंबर दर्ज करें" : "Enter your 10 digit mobile number"} />
              </div>
              <button disabled={props.loading || props.phone.length !== 10} className="mt-5 flex h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#045426] to-[#08763b] text-lg font-black text-white shadow-[0_8px_20px_rgba(4,84,38,.18)] disabled:opacity-50">{props.loading ? props.sendingLabel : props.sendLabel}<ArrowRight size={21} /></button>
            </form>
          ) : (
            <form onSubmit={props.onVerify} className="mt-8">
              <label className="text-sm font-bold">OTP</label>
              <input value={props.otp} onChange={(e) => props.onOtpChange(e.target.value)} inputMode="numeric" maxLength={6} autoComplete="one-time-code" className="mt-2 h-[58px] w-full rounded-xl border border-[#9fb6aa] px-4 text-center text-2xl font-black tracking-[.45em] outline-none focus:border-[#08703a]" placeholder="••••••" />
              <button disabled={props.loading || props.otp.length !== 6} className="mt-5 flex h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#045426] to-[#08763b] text-lg font-black text-white disabled:opacity-50">{props.loading ? props.verifyingLabel : props.verifyLabel}<ArrowRight size={21} /></button>
              {props.onResend ? <button type="button" onClick={props.onResend} disabled={props.resendDisabled || props.loading} className="mt-4 w-full text-sm font-bold text-[#587267] underline disabled:opacity-40">{props.resendLabel}</button> : null}
              <button type="button" onClick={props.onChangeNumber} className="mt-3 w-full text-sm font-bold text-[#075a30] underline">{isHi ? "मोबाइल नंबर बदलें" : "Change mobile number"}</button>
            </form>
          )}

          <div className="my-7 flex items-center gap-5 text-sm font-bold text-[#5b6f78] before:h-px before:flex-1 before:bg-[#d7e2dc] after:h-px after:flex-1 after:bg-[#d7e2dc]">{isHi ? "या" : "OR"}</div>
          <p className="text-center text-[15px] font-medium text-[#607381]">{c.joinPrompt}</p>
          <Link href={props.joinHref} className="mt-3 flex h-[52px] items-center justify-center rounded-xl border-2 border-[#08703a] text-base font-black text-[#075a30] hover:bg-[#edf8f1]">{c.joinLabel}</Link>
          <p className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-[#607381]"><LockKeyhole size={18} className="text-[#07813f]" />{isHi ? "आपकी जानकारी हमारे पास सुरक्षित है" : "Your data is secure with us"}</p>
        </section>

        <aside className="relative hidden h-full lg:block">
          <div className="absolute right-0 top-[12%] w-[270px] text-[#086237] drop-shadow-[0_2px_0_white]">
            <div className="whitespace-pre-line text-[38px] font-bold italic leading-[.9] [font-family:var(--font-handwritten)]">
              {c.rightSlogan}
            </div>
            <span aria-hidden="true" className="mt-3 block h-[4px] w-40 -rotate-6 rounded-full bg-[#08713c]" />
          </div>
          <div className="absolute bottom-4 right-2 text-right text-white drop-shadow"><strong className="block text-base">Indian Peoples Green Party</strong><span className="text-sm">{c.footerLine}</span></div>
        </aside>
      </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Check,
} from 'lucide-react';
import { useLanguage } from "../../components/LanguageContext";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

// --- 1. Translation Data ---

const translations = {
  en: {
    hero: {
      title: "Be the Force Behind the Change",
      subtitle: "Your support turns vision into reality. Contribute today and make an impact that lasts."
    },
    form: {
      title: "Donation Form",
      subtitle: "Every Donation Brings Us Closer to a Better Tomorrow",
      existingMember: "If you are existing member?",
      placeholders: {
        name: "Name",
        mobile: "Mobile Number",
        email: "Email",
        amount: "Amount",
        country: "Country",
        state: "State",
        city: "City",
        pincode: "Pincode",
        address: "Address",
        pan: "PAN Card Number (Mandatory)",
        occupation: "Occupation / Profession"
      },
      declaration: "I hereby declare that I am an Indian citizen and this donation is made through my own legitimate funds. I am aware of the legal provisions regarding political donations.",
      submit: "Submit"
    }
  },
  hi: {
    hero: {
      title: "परिवर्तन के पीछे की शक्ति बनें",
      subtitle: "आपका सहयोग विजन को हकीकत में बदलता है। आज ही योगदान करें और एक स्थायी प्रभाव डालें।"
    },
    form: {
      title: "दान फॉर्म",
      subtitle: "हर दान हमें बेहतर कल के करीब लाता है",
      existingMember: "क्या आप मौजूदा सदस्य हैं?",
      placeholders: {
        name: "नाम",
        mobile: "मोबाइल नंबर",
        email: "ईमेल",
        amount: "राशि",
        country: "देश",
        state: "राज्य",
        city: "शहर",
        pincode: "पिनकोड",
        address: "पता",
        pan: "पैन कार्ड नंबर (अनिवार्य)",
        occupation: "व्यवसाय / पेशा"
      },
      declaration: "मैं इसके द्वारा घोषणा करता हूँ कि मैं एक भारतीय नागरिक हूँ और यह दान मेरे अपने वैध धन के माध्यम से किया गया है। मैं राजनीतिक दान के संबंध में कानूनी प्रावधानों से अवगत हूँ।",
      submit: "दान करें"
    }
  }
};


// --- 4. Main Page Component ---

const DonationPageContent = () => {
  // Use the global language context, but fall back to 'en' content from local translations 
  // because global translations file doesn't have form labels yet.
  // Wait, if I use global `useLanguage` it returns global `t`.
  // I need to use the `language` string from context and pick from local `translations` object.
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [isExistingMember, setIsExistingMember] = useState(false);
  const [isDeclared, setIsDeclared] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full flex justify-center mt-[12px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-center gap-[16px]">
          {/* Title */}
          <h1 className="w-full text-center font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[48px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] lg:whitespace-nowrap">
            {t.hero.title}
          </h1>
          {/* Subtitle */}
          <p className="max-w-[874px] w-full text-center font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Gap */}
      <div className="h-[64px] w-full"></div>

      {/* Main Content: Video + Form */}
      <section className="w-full flex justify-center pb-[80px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col lg:flex-row gap-[40px] items-stretch">

          {/* LEFT: Video Section */}
          <div className="w-full lg:w-[60%] min-h-[500px] lg:min-h-[716px] rounded-[8px] flex items-center justify-center relative bg-gray-100 overflow-hidden shrink-0">
            <img
              src="/donation.png"
              alt="Donation Video Thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Optional Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Play Button */}
            <button
              type="button"
              className="absolute inset-0 z-20 m-auto flex items-center justify-center w-[100px] h-[100px] hover:scale-105 transition-transform"
            >
              <img src="/Play-Button.svg" alt="Play" className="w-full h-full" />
            </button>
          </div>

          {/* RIGHT: Donation Form with Premium Effects */}
          <div className="flex-1 bg-white rounded-[16px] p-[24px] lg:p-[32px] shadow-[0px_20px_60px_rgba(0,0,0,0.1)] border border-[#EFF5F1] flex flex-col justify-center relative">

            <div className="relative z-10">
              <h2 className="text-center font-['Familjen_Grotesk'] font-bold text-[32px] text-[#04330B] mb-[8px]">
                {t.form.title}
              </h2>
              <p className="text-center font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] mb-[32px]">
                {t.form.subtitle}
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-[24px] relative z-10">

              {/* Existing Member Checkbox */}
              <div
                className="flex items-center gap-[12px] cursor-pointer group"
                onClick={() => setIsExistingMember(!isExistingMember)}
              >
                <div className={`
                  w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center transition-all shrink-0
                  ${isExistingMember ? 'bg-[#587E67] border-[#587E67]' : 'border-[#587E67] bg-white'}
                `}>
                  {isExistingMember && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <label className="font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] cursor-pointer select-none">
                  {t.form.existingMember}
                </label>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="text"
                  placeholder={t.form.placeholders.name}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Mobile */}
              <div className="flex gap-[16px]">
                <div className="w-[100px] h-[56px] relative">
                  <select className="w-full h-full rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate">
                    <option>+91</option>
                    <option>+1</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder={t.form.placeholders.mobile}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="email"
                  placeholder={t.form.placeholders.email}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Amount & PAN */}
              <div className="flex gap-[16px]">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder={t.form.placeholders.amount}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t.form.placeholders.pan}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors uppercase"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="text"
                  placeholder={t.form.placeholders.occupation}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Country & State */}
              <div className="flex gap-[16px]">
                <div className="flex-1 relative">
                  <select className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate">
                    <option>{t.form.placeholders.country}</option>
                    <option>India</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1 relative">
                  <select className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate">
                    <option>{t.form.placeholders.state}</option>
                    <option>Rajasthan</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
              </div>

              {/* City & Pincode */}
              <div className="flex gap-[16px]">
                <div className="flex-1 relative">
                  <select className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate">
                    <option>{t.form.placeholders.city}</option>
                    <option>Jaipur</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t.form.placeholders.pincode}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="text"
                  placeholder={t.form.placeholders.address}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Legal Declaration Checkbox */}
              <div
                className="flex items-start gap-[12px] cursor-pointer group mt-[8px]"
                onClick={() => setIsDeclared(!isDeclared)}
              >
                <div className={`
                  w-[20px] h-[20px] rounded-[4px] border-[2px] flex items-center justify-center transition-all shrink-0 mt-[2px]
                  ${isDeclared ? 'bg-[#BE1E2D] border-[#BE1E2D]' : 'border-[#C5DCCF] bg-white'}
                `}>
                  {isDeclared && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <label className="font-['Familjen_Grotesk'] font-medium text-[13px] leading-[1.4] text-[#587E67] cursor-pointer select-none">
                  {t.form.declaration}
                </label>
              </div>

              {/* Submit */}
              <button 
                className={`
                  w-full h-[60px] rounded-[12px] font-['Familjen_Grotesk'] font-bold text-[18px] text-white transition-all shadow-lg
                  ${isDeclared ? 'bg-[#04330B] hover:bg-[#064e11] hover:scale-[1.02]' : 'bg-gray-400 cursor-not-allowed'}
                `}
                disabled={!isDeclared}
              >
                {t.form.submit}
              </button>

            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default function DonationPage() {
  return <DonationPageContent />;
}
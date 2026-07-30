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
      titleLines: [
        "Fight for Bringing",
        "the Change. Fight for",
        "Democracy."
      ],
      subTitle: "Every Indian Deserves a System That Works For Them",
      p1: "You have watched it happen. A VIP convoy brings an entire road to a standstill while hundreds of ordinary citizens sit waiting — late for work, late for school, late for a hospital appointment. Nobody is held accountable. Nobody is even questioned.",
      p2: "You have read about it. A forest that communities depended on for generations, cleared overnight for a project that somehow bypassed every environmental safeguard that existed to prevent exactly this. The paperwork was approved. The trees are gone.",
      p3: "You have lived it. A road, a bridge, a civic facility promised to your neighbourhood — funded, announced, inaugurated — and then abandoned. The money was spent. The work was not done. And nothing happened to anyone responsible.",
      p4: "This is not bad luck. This is a system operating exactly as it has been allowed to operate — without consequence, without transparency, and without fear of accountability.",
      p5: "Peoples Green Party is changing that.",
      p6: "We are a political and civic movement rooted in Rajasthan, fighting for every Indian citizen’s constitutional right to equality, dignity, and a government that answers to the people who fund it.",
      p7: "Fight with us. Fight for Bringing the Change."
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
    },
    campaigns: {
      title: "Fund for democracy"
    }
  },
  hi: {
    hero: {
      titleLines: [
        "बदलाव लाने के लिए",
        "संघर्ष करें। लोकतंत्र के लिए",
        "संघर्ष करें।"
      ],
      subTitle: "हर भारतीय एक ऐसे सिस्टम का हकदार है जो उनके लिए काम करे",
      p1: "आपने इसे होते हुए देखा है। एक वीआईपी काफिला पूरी सड़क को ठप कर देता है जबकि सैकड़ों आम नागरिक बैठे इंतजार करते हैं — काम के लिए देर, स्कूल के लिए देर, अस्पताल के अपॉइंटमेंट के लिए देर। किसी को जवाबदेह नहीं ठहराया जाता। किसी से पूछताछ तक नहीं की जाती।",
      p2: "आपने इसके बारे में पढ़ा है। एक जंगल जिस पर पीढ़ियों से समुदाय निर्भर थे, रातों-रात एक ऐसी परियोजना के लिए साफ कर दिया गया जिसने किसी तरह हर उस पर्यावरणीय सुरक्षा उपाय को बायपास कर दिया जो इसे रोकने के लिए बनाया गया था। कागजी कार्रवाई मंजूर हो गई। पेड़ गायब हो गए।",
      p3: "आपने इसे जिया है। आपके पड़ोस में वादा की गई एक सड़क, एक पुल, एक नागरिक सुविधा — वित्त पोषित, घोषित, उद्घाटित — और फिर लावारिस छोड़ दी गई। पैसा खर्च हो गया। काम नहीं हुआ। और जिम्मेदार किसी भी व्यक्ति का कुछ नहीं बिगड़ा।",
      p4: "यह दुर्भाग्य नहीं है। यह एक ऐसी व्यवस्था है जो ठीक वैसे ही चल रही है जैसे उसे चलने की अनुमति दी गई है — बिना किसी परिणाम के, बिना किसी पारदर्शिता के, और बिना किसी जवाबदेही के डर के।",
      p5: "पीपल्स ग्रीन पार्टी इसे बदल रही है।",
      p6: "हम राजस्थान में निहित एक राजनीतिक और नागरिक आंदोलन हैं, जो हर भारतीय नागरिक के समानता, गरिमा के संवैधानिक अधिकार और एक ऐसी सरकार के लिए लड़ रहे हैं जो उन लोगों को जवाब देती है जो इसे वित्तपोषित करते हैं।",
      p7: "हमारे साथ लड़ें। बदलाव लाने के लिए लड़ें।"
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
    },
    campaigns: {
      title: "लोकतंत्र के लिए फंड"
    }
  }
};

// --- Helper Component: Image with Fallback ---
const ImageWithFallback = ({
  src,
  fallback,
  alt,
  className
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
};

// --- 4. Main Page Component ---

const DonationPageContent = () => {
  // Use the global language context, but fall back to 'en' content from local translations 
  // because global translations file doesn't have form labels yet.
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [isExistingMember, setIsExistingMember] = useState(false);
  const [isDeclared, setIsDeclared] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Main Content: Text + Form */}
      <section className="w-full flex justify-center py-[40px] lg:py-[80px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col-reverse lg:flex-row gap-[48px] lg:gap-[64px] items-start justify-between">

          {/* LEFT: Text Section */}
          <div className="w-full lg:w-[53%] flex flex-col gap-[20px]">
            <h1 className="font-['Familjen_Grotesk'] font-bold text-[36px] md:text-[48px] lg:text-[73px] leading-[1.15] text-[#04330B] tracking-[-0.5px]">
              {t.hero.titleLines[0]}
              <br className="hidden lg:inline" />
              {" "}
              {t.hero.titleLines[1]}
              <br className="hidden lg:inline" />
              {" "}
              {t.hero.titleLines[2]}
            </h1>

            <p className="font-['Familjen_Grotesk'] font-bold text-[16px] lg:text-[20px] text-[#04330B] leading-[1.4]">
              {t.hero.subTitle}
            </p>

            <div className="flex flex-col gap-[18px] font-sans text-[15px] lg:text-[17.5px] leading-[1.6] text-[#2D3A31]">
              <p>{t.hero.p1}</p>
              <p>{t.hero.p2}</p>
              <p>{t.hero.p3}</p>
              <p>{t.hero.p4}</p>
              <p className="font-bold text-[#04330B]">{t.hero.p5}</p>
              <p>{t.hero.p6}</p>
              <p className="font-bold text-[#04330B]">{t.hero.p7}</p>
            </div>
          </div>

          {/* RIGHT: Donation Form with Premium Effects */}
          <div className="w-full lg:w-[43%] lg:max-w-[500px] shrink-0 bg-white rounded-[16px] p-[24px] lg:p-[32px] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] border border-[#EFF5F1] flex flex-col justify-center relative">

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

      {/* Campaigns section */}
      <section className="w-full flex justify-center bg-[#F9FBF9] py-[64px] lg:py-[80px] border-t border-[#EFF5F1]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-center">
          <h2 className="text-center font-['Familjen_Grotesk'] font-bold text-[28px] md:text-[36px] lg:text-[44px] text-[#04330B] mb-[40px] lg:mb-[48px]">
            {t.campaigns.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] lg:gap-[32px] w-full">
            {[
              { en: "/Donation/Accountable.jpeg", hi: "/Donation/Accountable(hindi).png", alt: "Accountable" },
              { en: "/Donation/Democracy.jpeg", hi: "/Donation/Democracy(hindi).png", alt: "Democracy" },
              { en: "/Donation/Envronment.jpeg", hi: "/Donation/Envronment(hindi).png", alt: "Environment" }
            ].map((item, index) => {
              const currentSrc = language === 'hi' ? item.hi : item.en;

              return (
                <div
                  key={index}
                  className="bg-white rounded-[16px] overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-[#EFF5F1] group transition-all duration-300 hover:shadow-[0px_20px_40px_rgba(4,51,11,0.1)] hover:-translate-y-[4px]"
                >
                  <div className="aspect-[959/512] relative overflow-hidden bg-gray-50">
                    <ImageWithFallback
                      src={currentSrc}
                      fallback={item.en}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
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
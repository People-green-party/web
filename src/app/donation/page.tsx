"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Check,
} from 'lucide-react';
import { useLanguage } from "../../components/LanguageContext";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { fetchApi } from "../../lib/api";
import { FormFieldLabel, RequiredMark } from "../../components/FormFieldLabel";

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
      title: "Donation Interest Form",
      subtitle: "Share your pledge — our team will contact you for the secure payment process",
      notice: "Online payment gateway is not live yet. Submitting this form does not charge your account. It is a pledge / callback request only.",
      existingMember: "If you are existing member?",
      placeholders: {
        name: "Name",
        mobile: "Mobile Number",
        email: "Email",
        amount: "Pledge amount (₹)",
        country: "Country",
        state: "State",
        city: "City",
        pincode: "Pincode",
        address: "Address",
        pan: "PAN Card Number (Mandatory)",
        occupation: "Occupation / Profession"
      },
      declaration: "I hereby declare that I am an Indian citizen and this donation interest is made through my own legitimate funds. I am aware of the legal provisions regarding political donations.",
      submit: "Submit pledge request"
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
      title: "दान रुचि फॉर्म",
      subtitle: "अपना वचन दर्ज करें — सुरक्षित भुगतान प्रक्रिया के लिए हमारी टीम संपर्क करेगी",
      notice: "ऑनलाइन भुगतान अभी लाइव नहीं है। यह फॉर्म जमा करने से आपके खाते से पैसे नहीं कटेंगे। यह केवल वचन / कॉलबैक अनुरोध है।",
      existingMember: "क्या आप मौजूदा सदस्य हैं?",
      placeholders: {
        name: "नाम",
        mobile: "मोबाइल नंबर",
        email: "ईमेल",
        amount: "वचन राशि (₹)",
        country: "देश",
        state: "राज्य",
        city: "शहर",
        pincode: "पिनकोड",
        address: "पता",
        pan: "पैन कार्ड नंबर (अनिवार्य)",
        occupation: "व्यवसाय / पेशा"
      },
      declaration: "मैं इसके द्वारा घोषणा करता हूँ कि मैं एक भारतीय नागरिक हूँ और यह दान रुचि मेरे अपने वैध धन के माध्यम से की गई है। मैं राजनीतिक दान के संबंध में कानूनी प्रावधानों से अवगत हूँ।",
      submit: "वचन अनुरोध जमा करें"
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
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    amount: "",
    pan: "",
    occupation: "",
    country: "India",
    state: "Rajasthan",
    city: "Jaipur",
    pincode: "",
    address: "",
  });

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMsg(null);
    if (!isDeclared) {
      setSubmitMsg({ type: "err", text: "Please accept the declaration to continue." });
      return;
    }
    const amount = parseInt(form.amount, 10);
    const phoneDigits = form.phone.replace(/\D/g, "").slice(-10);
    const pan = form.pan.trim().toUpperCase();
    if (!form.fullName.trim() || !phoneDigits || !amount) {
      setSubmitMsg({ type: "err", text: "Name, mobile and amount are required." });
      return;
    }
    if (phoneDigits.length !== 10) {
      setSubmitMsg({ type: "err", text: "Please enter a valid 10-digit mobile number." });
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      setSubmitMsg({ type: "err", text: "Please enter a valid PAN (e.g. ABCDE1234F)." });
      return;
    }
    setSubmitting(true);
    try {
      await fetchApi("donations", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: phoneDigits,
          email: form.email.trim() || undefined,
          amount,
          pan,
          occupation: form.occupation.trim() || undefined,
          country: form.country || undefined,
          state: form.state || undefined,
          city: form.city || undefined,
          pincode: form.pincode.trim() || undefined,
          address: form.address.trim() || undefined,
          isExistingMember,
        }),
      });
      setSubmitMsg({
        type: "ok",
        text: "Thank you! Your pledge request was received. No payment was taken — our team will contact you for the secure donation process.",
      });
      setForm({
        fullName: "",
        phone: "",
        email: "",
        amount: "",
        pan: "",
        occupation: "",
        country: "India",
        state: "Rajasthan",
        city: "Jaipur",
        pincode: "",
        address: "",
      });
      setIsDeclared(false);
      setIsExistingMember(false);
    } catch (err: any) {
      setSubmitMsg({ type: "err", text: err?.message || "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

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
              <p className="text-center font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] mb-[12px]">
                {t.form.subtitle}
              </p>
              <p className="text-center font-['Familjen_Grotesk'] font-medium text-[13px] leading-snug text-[#854D0E] bg-[#FEFCE8] border border-yellow-200 rounded-[10px] px-3 py-2 mb-[24px]">
                {t.form.notice}
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-[24px] relative z-10">

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

              <div className="flex flex-col gap-[8px]">
                <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">
                  {t.form.placeholders.name}
                </FormFieldLabel>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder={t.form.placeholders.name}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              <div>
                <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B] mb-2">
                  {t.form.placeholders.mobile}
                </FormFieldLabel>
                <div className="flex gap-[16px]">
                  <div className="w-[100px] h-[56px] relative">
                    <select className="w-full h-full rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate">
                      <option>+91</option>
                    </select>
                    <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder={t.form.placeholders.mobile}
                      className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <FormFieldLabel className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">
                  {t.form.placeholders.email}
                </FormFieldLabel>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder={t.form.placeholders.email}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              <div className="flex gap-[16px]">
                <div className="flex-1">
                  <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B] mb-2">
                    {t.form.placeholders.amount}
                  </FormFieldLabel>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setField("amount", e.target.value)}
                    placeholder={t.form.placeholders.amount}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B] mb-2">
                    PAN
                  </FormFieldLabel>
                  <input
                    type="text"
                    value={form.pan}
                    onChange={(e) => setField("pan", e.target.value)}
                    placeholder={t.form.placeholders.pan}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors uppercase"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="text"
                  value={form.occupation}
                  onChange={(e) => setField("occupation", e.target.value)}
                  placeholder={t.form.placeholders.occupation}
                  className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                />
              </div>

              {/* Country & State */}
              <div className="flex gap-[16px]">
                <div className="flex-1 relative">
                  <select
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate"
                  >
                    <option value="India">India</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1 relative">
                  <select
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate"
                  >
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
              </div>

              {/* City & Pincode */}
              <div className="flex gap-[16px]">
                <div className="flex-1 relative">
                  <select
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] pr-10 text-[16px] font-medium text-[#587E67] appearance-none bg-white focus:outline-none focus:border-[#04330B] truncate"
                  >
                    <option value="Jaipur">Jaipur</option>
                  </select>
                  <ChevronDown className="absolute right-[12px] top-[16px] text-[#587E67] pointer-events-none" size={24} />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setField("pincode", e.target.value)}
                    placeholder={t.form.placeholders.pincode}
                    className="w-full h-[56px] rounded-[8px] border border-[#C5DCCF] px-[16px] font-['Familjen_Grotesk'] font-medium text-[16px] text-[#04330B] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-[8px]">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
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
                  <RequiredMark />
                </label>
              </div>

              {submitMsg ? (
                <p
                  className={`text-sm font-semibold rounded-[8px] px-3 py-2 ${
                    submitMsg.type === "ok"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {submitMsg.text}
                </p>
              ) : null}

              {/* Submit */}
              <button
                type="submit"
                className={`
                  w-full h-[60px] rounded-[12px] font-['Familjen_Grotesk'] font-bold text-[18px] text-white transition-all shadow-lg
                  ${isDeclared && !submitting ? 'bg-[#04330B] hover:bg-[#064e11] hover:scale-[1.02]' : 'bg-gray-400 cursor-not-allowed'}
                `}
                disabled={!isDeclared || submitting}
              >
                {submitting ? "Submitting…" : t.form.submit}
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
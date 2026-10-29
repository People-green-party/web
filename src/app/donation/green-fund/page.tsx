"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { useLanguage } from "../../../components/LanguageContext";
import { OCCASIONS, DedicationOccasion } from "../../../data/fundsData";
import { PlantSponsorshipForm } from "../../../components/donation/PlantSponsorshipForm";
import { ApiRequestError, fetchApi } from "../../../lib/api";
import {
  ArrowLeft,
  TreePine,
  Compass,
  Leaf,
  BarChart3,
  MapPin,
  Sparkles,
  Heart,
  Cake,
  Gift,
  Baby,
  Trophy,
  Share2,
  Award,
  Shield,
  Download,
  Users,
  Clock,
} from "lucide-react";

type GreenFundProgress = {
  plantsSponsored: number;
  plantsPlanted: number | null;
  verifiedSurvival: number | null;
  maintenanceProgress: number | null;
};

export default function GreenFundPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const sponsorRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const excuseRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const heroBadgeRef = useRef<HTMLDivElement | null>(null);

  const [selectedOccasion, setSelectedOccasion] = useState<DedicationOccasion>("Birthday");
  const [copiedShare, setCopiedShare] = useState(false);
  const [badgeDonorName, setBadgeDonorName] = useState("Nature Supporter");
  
  const heroImages = [
    { src: "/green-wall/carbon-hero-female.jpg", gender: "female" },
    { src: "/green-wall/carbon-hero-male.jpg", gender: "male" },
  ];
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const [progress, setProgress] = useState<GreenFundProgress | null>(null);
  const [progressStatus, setProgressStatus] = useState<"loading" | "loaded" | "error" | "unavailable">("loading");
  const [progressRetry, setProgressRetry] = useState(0);

  const progressLoading = progressStatus === "loading";
  const progressError = progressStatus === "error";
  const progressUnavailable = progressStatus === "unavailable";

  useEffect(() => {
    let cancelled = false;

    fetchApi("donations/green-fund/progress", {
      method: "GET",
      skipAuth: true,
      suppressErrorLog: true,
    })
      .then((result) => {
        const data = result as Partial<GreenFundProgress>;
        if (
          !Number.isSafeInteger(data.plantsSponsored) ||
          (data.plantsSponsored ?? -1) < 0
        ) {
          throw new Error("Invalid Green Fund progress response");
        }
        if (!cancelled) {
          setProgress(data as GreenFundProgress);
          setProgressStatus("loaded");
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setProgressStatus(
            error instanceof ApiRequestError && error.status === 404
              ? "unavailable"
              : "error"
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [progressRetry]);

  const scrollToSponsor = () =>
    sponsorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToStory = () =>
    storyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToExcuse = () =>
    excuseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToBadge = () =>
    heroBadgeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSelectOccasion = (occ: DedicationOccasion) => {
    setSelectedOccasion(occ);
    scrollToSponsor();
  };

  const handleShareBadge = () => {
    const shareText = isHi
      ? `मैंने द ग्रेट ग्रीन वॉल मिशन में पौधा प्रायोजित कर कार्बन हीरो बैज अनलॉक किया है! आप भी जुड़ें:`
      : `I just unlocked my Carbon Hero badge on The Great Green Wall Mission! Sponsor a plant:`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://peoplesgreen.org/donation/green-fund";

    if (navigator.share) {
      navigator.share({ title: "Carbon Hero · Great Green Wall", text: shareText, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const getOccasionIcon = (value: DedicationOccasion) => {
    switch (value) {
      case "Birthday":
        return <Cake className="size-4 text-[#0D5229]" />;
      case "Wedding":
        return <Heart className="size-4 text-[#0D5229]" />;
      case "Anniversary":
        return <Sparkles className="size-4 text-[#0D5229]" />;
      case "Festival":
        return <Gift className="size-4 text-[#0D5229]" />;
      case "New Baby":
        return <Baby className="size-4 text-[#0D5229]" />;
      case "Congratulations":
        return <Trophy className="size-4 text-[#0D5229]" />;
      case "In Memory Of":
        return <Leaf className="size-4 text-[#0D5229]" />;
      case "Just Because":
      default:
        return <TreePine className="size-4 text-[#0D5229]" />;
    }
  };

  const currentHeroImg = heroImages[heroImageIndex].src;

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#EFF5F1] bg-[#F9FBF9] py-3">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/donation"
            className="inline-flex items-center gap-1.5 font-bold text-[#0D5229] hover:underline"
          >
            <ArrowLeft size={15} />
            {isHi ? "सभी कोष देखें" : "Back to Funds"}
          </Link>
          <span className="font-semibold text-[#587E67] hidden sm:inline">
            {isHi ? "महान हरित दीवार मिशन · अरावली" : "The Great Green Wall Mission · Aravalli"}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. HERO SECTION (Left-aligned matching reference image) */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex items-center text-white bg-[#03230a]">
        {/* Background Image with rich horizontal vignette allowing sunrise on right to shine */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/funds/green-fund-aravalli-restoration.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left flex flex-col items-start">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#bef264] text-[#04330b] font-black text-[11px] sm:text-[12px] px-3.5 py-1.5 uppercase tracking-wider mb-5 shadow-md">
            <TreePine size={13} className="text-[#04330b]" />
            <span>{isHi ? "महान हरित दीवार मिशन" : "GREAT GREEN WALL MISSION"}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-['Familjen_Grotesk'] text-[36px] sm:text-[54px] lg:text-[66px] font-black leading-[1.06] tracking-tight max-w-2xl text-white">
            {isHi ? "ईंटों की नहीं।" : "Not a wall of bricks."}
            <br />
            <span className="text-[#bef264]">
              {isHi ? "ज़िंदगी की दीवार।" : "A wall of life."}
            </span>
          </h1>

          {/* Subtext Paragraph */}
          <p className="mt-5 max-w-xl text-[15.5px] sm:text-[17px] leading-relaxed text-white/90 font-medium">
            {isHi
              ? "अरावली सदियों से खड़ी है। अब उसके आसपास के नाज़ुक इलाकों को हमारी ज़रूरत है। हम अरावली के संवेदनशील भूभाग में हरियाली की एक जीवित दीवार विकसित करने की दिशा में काम कर रहे हैं। सीमेंट से नहीं। देशी पौधों से। उनकी जड़ों से। और उन्हें जीवित रखने वाली लगातार देखभाल से।"
              : "The Aravallis have stood for ages. Now the landscapes around them need a little help from us. We're working towards a living green barrier in vulnerable areas around the Aravalli landscape. Not with concrete. With native plants. Living roots. And the care it takes to keep them alive."}
          </p>

          {/* Dream Quote */}
          <div className="mt-3.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[12px] sm:text-[13.5px] font-semibold text-[#bef264]">
            {isHi
              ? "पहले चरण का सपना है एक करोड़ पौधे। शुरुआत आपके एक पौधे से भी हो सकती है।"
              : "One crore plants is our dream for Phase One. Your one plant can be where it begins."}
          </div>

          {/* Dual Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-3.5">
            <button
              type="button"
              onClick={scrollToSponsor}
              className="h-11 sm:h-12 px-7 rounded-full bg-[#bef264] text-[#04330b] font-['Familjen_Grotesk'] text-[14.5px] sm:text-[15.5px] font-black shadow-lg hover:bg-[#a7e847] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>{isHi ? "हरित दीवार में अपना हिस्सा जोड़ें" : "Build my part of the wall"}</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={scrollToStory}
              className="h-11 sm:h-12 px-6 rounded-full border border-white/60 text-white font-['Familjen_Grotesk'] text-[14px] sm:text-[15px] font-bold hover:bg-white/10 hover:border-white transition-all flex items-center"
            >
              {isHi ? "विचार के बारे में पढ़ें" : "Why this matters"}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. HIGHLIGHTS STRIP (Clean light mint bar with 4 features) */}
      {/* ========================================================= */}
      <section className="bg-[#F9FAF8] text-[#0D3820] py-3.5 px-4 sm:px-6 lg:px-8 border-b border-[#E2ECE4]">
        <div className="mx-auto w-full max-w-[1240px] flex flex-wrap items-center justify-between gap-4 font-['Familjen_Grotesk'] font-bold text-[13px] sm:text-[14px]">
          <div className="flex items-center gap-2">
            <Leaf className="size-4 text-[#16A34A]" />
            <span>{isHi ? "देशी प्रजातियाँ" : "Native Species"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#16A34A]" />
            <span>{isHi ? "स्थानीय समुदायों के साथ" : "With Local Communities"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#16A34A]" />
            <span>{isHi ? "दीर्घकालिक देखभाल" : "Long-Term Care"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-[#16A34A]" />
            <span>{isHi ? "अरावली के आसपास संवेदनशील क्षेत्र" : "Vulnerable Areas Around Aravalli"}</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. ONE GOOD QUESTION & STORY (2-Column Desktop Grid) */}
      {/* ========================================================= */}
      <section ref={storyRef} className="py-16 sm:py-20 bg-white border-b border-[#E8EFE9]">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Question Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block rounded-full bg-[#E5F5E8] text-[#0D5229] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider">
                {isHi ? "एक बात पूछूँ?" : "ONE GOOD QUESTION"}
              </span>

              <h2 className="font-['Familjen_Grotesk'] text-[28px] sm:text-[38px] lg:text-[44px] font-black text-[#04330B] leading-[1.14]">
                {isHi
                  ? "आखिरी बार आपने ऐसा तोहफ़ा कब दिया था, जो दस साल बाद भी बढ़ रहा हो?"
                  : "When did you last give a gift that could grow for ten years?"}
              </h2>

              <div className="space-y-3 text-[15px] sm:text-[16.5px] leading-relaxed text-[#2C3F33] font-normal">
                <p>
                  {isHi
                    ? "हम फूल भेजते हैं। मिठाइयाँ बाँटते हैं। कॉफ़ी पिलाते हैं। सब अच्छा लगता है, लेकिन वह पल गुज़र जाता है।"
                    : "We send flowers. We buy sweets. We order another coffee. And they're lovely. Until the moment passes."}
                </p>
                <p className="font-bold text-[#04330B]">
                  {isHi ? "अब ज़रा कुछ और सोचिए।" : "But imagine this instead."}
                </p>
                <p>
                  {isHi
                    ? "अगले जन्मदिन पर एक पौधा। सालगिरह पर एक नई हरियाली। शादी का तोहफ़ा, जो यादों के साथ बढ़े। त्योहार की खुशियाँ धरती तक पहुँचें।"
                    : "Your next birthday comes with a tree. Your anniversary leaves something alive behind. A wedding gift becomes a little patch of green. A festival lights up a home and helps green a landscape."}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={scrollToExcuse}
                  className="h-11 px-7 rounded-full bg-[#0D3820] text-white font-['Familjen_Grotesk'] text-[14.5px] font-bold shadow-md hover:bg-[#072414] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
                >
                  <span>{isHi ? "पौधे का चुनाव करें" : "Find your reason to plant"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right: Soft Sage Quote Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[24px] bg-[#F1F8F3] border border-[#DCEBE0] p-6 sm:p-8 space-y-3.5 relative overflow-hidden shadow-sm">
                <div className="size-10 rounded-xl bg-[#E2F0E5] flex items-center justify-center text-[#16A34A] mb-1">
                  <TreePine size={22} />
                </div>
                <p className="text-[14.5px] sm:text-[15.5px] text-[#0D3820] font-medium leading-relaxed">
                  {isHi
                    ? "अच्छा काम करने के लिए किसी खास दिन की ज़रूरत नहीं। लेकिन बहाना चाहिए, तो हमारे पास बहुत हैं।"
                    : "You don't need a special occasion to do something good. But if you're looking for an excuse, we'll give you plenty."}
                </p>
                <div className="h-px w-10 bg-[#0D3820]/20 my-2" />
                <p className="text-[13px] text-[#3E5646] leading-relaxed">
                  {isHi
                    ? "यह हरित दीवार दूर से देखने की चीज़ नहीं है। इसे हम सब मिलकर बड़ा सकते हैं।"
                    : "This Green Wall isn't something to admire from a distance. It's something we can help grow, together."}
                </p>
                <p className="font-['Familjen_Grotesk'] font-bold text-[#04330B] text-[16.5px] sm:text-[18px] leading-snug pt-1">
                  {isHi
                    ? "बहाना आपका। जड़ें जमाने की कोशिश हमारी।"
                    : "You bring the reason. We'll work on the roots."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FIND AN EXCUSE · MAKE IT GROW (8 Gift Occasion Cards) */}
      {/* ========================================================= */}
      <section ref={excuseRef} className="py-16 sm:py-24 bg-[#F3F7F4] border-b border-[#D8EADB]">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-10 sm:mb-14">
            <span className="inline-block rounded-full bg-[#DCEEE0] text-[#0D5229] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider">
              {isHi ? "अवसर" : "OCCASIONS"}
            </span>
            <h2 className="font-['Familjen_Grotesk'] text-[32px] sm:text-[46px] font-black text-[#04330B] leading-tight">
              {isHi ? "बहाना ढूँढ़िए। हरियाली बढ़ाइए।" : "Find an excuse. Make it grow."}
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#34523F] font-medium leading-relaxed">
              {isHi
                ? "एक ऐसा तोहफ़ा, जो उस दिन के बाद भी ज़िंदा रहे।"
                : "A gift that doesn't end when the day does."}
            </p>
          </div>

          {/* 8 Occasions Cards Grid (Image on top, Title & Tagline below matching reference image) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {OCCASIONS.filter((occ) => occ.value !== "Other").map((occ) => {
              const hasArtwork = Boolean(occ.image);

              return (
                <div
                  key={occ.value}
                  onClick={() => handleSelectOccasion(occ.value)}
                  className="group relative rounded-[20px] bg-white text-gray-800 p-3 sm:p-3.5 flex flex-col justify-between border border-[#E2ECE4] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  {/* Artwork Container (Top of card) */}
                  {hasArtwork ? (
                    <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#F4F8F5] border border-[#E2ECE4] relative shadow-sm group-hover:border-[#0D5229]/40 transition-all">
                      <img
                        src={occ.image}
                        alt={`${occ.label.en} Gift Card Artwork`}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2.5">
                        <span className="text-[11px] font-bold text-white bg-[#04330B]/90 px-3 py-1 rounded-full border border-white/20">
                          {isHi ? "यह कार्ड चुनें" : "Select this gift"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#F4F8F5] border border-[#E2ECE4] aspect-[4/3] flex flex-col items-center justify-center p-3 text-center transition-all group-hover:border-[#0D5229]/40 overflow-hidden relative">
                      <div className="size-9 rounded-full bg-[#EBF5EE] flex items-center justify-center mb-1.5 text-[#0D5229]">
                        {getOccasionIcon(occ.value)}
                      </div>
                      <span className="text-[11px] sm:text-xs font-semibold text-[#0D3820] line-clamp-1">
                        {isHi ? occ.label.hi : occ.label.en}
                      </span>
                    </div>
                  )}

                  {/* Occasion Title & Tagline below Image */}
                  <div className="pt-2.5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-['Familjen_Grotesk'] text-[15px] sm:text-[16px] font-bold text-[#04330B] truncate">
                        {isHi ? occ.label.hi : occ.label.en}
                      </h3>
                      <p className="text-[12px] sm:text-[12.5px] text-[#557862] leading-snug font-medium line-clamp-2 mt-0.5">
                        {isHi ? occ.tagline.hi : occ.tagline.en}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Card Summary & Action */}
          <div className="mt-10 text-center max-w-xl mx-auto space-y-4">
            <p className="text-[14px] sm:text-[15px] text-[#34523F] font-semibold">
              {isHi
                ? "अवसर चुनिए। किसी के नाम पौधा समर्पित कीजिए। अपना संदेश लिखिए। और एक खूबसूरत डिजिटल गिफ्ट कार्ड भेजिए।"
                : "Choose the occasion. Dedicate a plant. Add your message. Send someone a beautiful digital gift card that represents a living contribution."}
            </p>
            <button
              type="button"
              onClick={scrollToSponsor}
              className="h-11 px-8 rounded-full bg-[#04330B] text-white font-['Familjen_Grotesk'] text-[14.5px] font-bold shadow-md hover:bg-[#064e11] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <Gift size={16} />
              <span>{isHi ? "पौधे का उपहार दें" : "GIFT A PLANT"}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CONTRIBUTION TARGETS (Horizontal Stats on Dark Green) */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-[#063A1D] text-white relative text-center">
        <div className="mx-auto w-full max-w-[1140px] px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Headline */}
          <div className="space-y-2.5">
            <span className="inline-block rounded-full bg-[#C3F53C] text-[#04330B] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider">
              {isHi ? "योगदान लक्ष्य" : "CONTRIBUTION TARGETS"}
            </span>
            <h2 className="font-['Familjen_Grotesk'] text-[28px] sm:text-[40px] font-black text-white leading-tight">
              {isHi
                ? "आपका छोटा-सा योगदान। कल की एक हरी दुनिया।"
                : "A little from you. A greener world for tomorrow."}
            </h2>
          </div>

          {/* 3 Horizontal Stats with Icons matching reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto my-8 items-center text-left">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 bg-white/5 md:bg-transparent p-4 md:p-0 rounded-xl">
              <div className="size-11 rounded-full bg-[#C3F53C]/15 border border-[#C3F53C]/30 flex items-center justify-center text-[#C3F53C] shrink-0">
                <TreePine size={22} />
              </div>
              <div>
                <span className="block font-['Familjen_Grotesk'] text-[24px] sm:text-[30px] font-black text-white leading-tight">
                  {isHi ? "1 करोड़ पौधे" : "1 CRORE PLANTS"}
                </span>
                <span className="block text-[12px] sm:text-[13px] text-white/80 font-medium">
                  {isHi ? "हमारे पहले चरण का लक्ष्य।" : "Our Phase One ambition."}
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 bg-white/5 md:bg-transparent p-4 md:p-0 rounded-xl">
              <div className="size-11 rounded-full bg-[#C3F53C]/15 border border-[#C3F53C]/30 flex items-center justify-center text-[#C3F53C] shrink-0">
                <Award size={22} />
              </div>
              <div>
                <span className="block font-['Familjen_Grotesk'] text-[24px] sm:text-[30px] font-black text-white leading-tight">
                  {isHi ? "₹1,500 प्रति पौधा" : "₹1,500 PER PLANT"}
                </span>
                <span className="block text-[12px] sm:text-[13px] text-white/80 font-medium leading-snug">
                  {isHi
                    ? "रोपण एवं नियोजित देखभाल हेतु अनुमानित योगदान।"
                    : "Estimated contribution per plant towards planting and planned care."}
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 bg-white/5 md:bg-transparent p-4 md:p-0 rounded-xl">
              <div className="size-11 rounded-full bg-[#C3F53C]/15 border border-[#C3F53C]/30 flex items-center justify-center text-[#C3F53C] shrink-0">
                <BarChart3 size={22} />
              </div>
              <div>
                <span className="block font-['Familjen_Grotesk'] text-[24px] sm:text-[30px] font-black text-white leading-tight">
                  {isHi ? "₹1,500 करोड़" : "₹1,500 CRORE"}
                </span>
                <span className="block text-[12px] sm:text-[13px] text-white/80 font-medium">
                  {isHi ? "पूरे प्रथम चरण का अनुमानित बजट।" : "Indicative budget for the complete first phase."}
                </span>
              </div>
            </div>
          </div>

          {/* Inspirational Narrative */}
          <div className="max-w-2xl mx-auto text-[15px] sm:text-[16.5px] text-white/85 font-medium leading-relaxed">
            <p>
              {isHi
                ? "एक पौधा शुरुआत है। पाँच पौधे एक छोटे-से भूभाग की हरियाली में योगदान दे सकते हैं। सौ पौधे उससे बड़ी बात हैं। एक करोड़ पौधे एक असाधारण सपना है।"
                : "One plant is a beginning. Five plants make a difference to a small patch of land. A hundred plants make a bigger contribution. A crore plants is an extraordinary ambition."}
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <button
              type="button"
              onClick={scrollToSponsor}
              className="h-12 px-8 rounded-full bg-[#C3F53C] text-[#04330B] font-['Familjen_Grotesk'] text-[15px] font-black shadow-lg hover:bg-[#b0e82c] transition-all inline-flex items-center gap-2"
            >
              <span>{isHi ? "पौधों का प्रायोजन करें" : "SPONSOR YOUR PLANTS"}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SPONSORSHIP FORM & PROGRESS TRACKER */}
      {/* ========================================================= */}
      <section ref={sponsorRef} className="py-16 sm:py-24 bg-[#F9FAF8] border-b border-[#E8EFE9]">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT: Live Mission Details & 2 Feature Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2.5">
                <span className="inline-block rounded-full bg-[#DCEEE0] text-[#0D5229] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                  {isHi ? "सहभागिता" : "SPONSORSHIP"}
                </span>
                <h2 className="font-['Familjen_Grotesk'] text-[30px] sm:text-[42px] font-black text-[#04330B] leading-tight">
                  {isHi ? "हरित दीवार में अपना पौधा जोड़ें" : "Plant Your Part of the Green Wall"}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#34523F] leading-relaxed">
                  {isHi
                    ? "अपने नाम से, या किसी खास व्यक्ति के नाम से, या किसी अवसर पर एक पौधे का प्रायोजन करें और इस ऐतिहासिक मिशन का हिस्सा बनें।"
                    : "Sponsor a plant in your name, in honour of someone special, or to mark an occasion, and become part of this historic mission."}
                </p>
              </div>

              {/* 2 Feature Cards (Digital Certificate & Plantation Records) */}
              <div className="space-y-3.5">
                <div className="rounded-[18px] bg-white border border-[#E2ECE4] p-4 sm:p-5 flex items-start gap-4 shadow-sm">
                  <div className="size-11 rounded-xl bg-[#E8F8EE] text-[#0D5229] flex items-center justify-center shrink-0">
                    <Award size={22} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-['Familjen_Grotesk'] text-[16px] sm:text-[17px] font-bold text-[#04330B]">
                      {isHi ? "डिजिटल समर्पण प्रमाणपत्र" : "Digital Dedication Certificate"}
                    </h3>
                    <p className="text-[13px] sm:text-[13.5px] text-[#557862] leading-relaxed">
                      {isHi
                        ? "हर सफल प्रायोजन पर आपको एक डिजिटल समर्पण प्रमाणपत्र प्राप्त होगा।"
                        : "Every successful sponsorship includes an official digital dedication certificate."}
                    </p>
                  </div>
                </div>

                <div className="rounded-[18px] bg-white border border-[#E2ECE4] p-4 sm:p-5 flex items-start gap-4 shadow-sm">
                  <div className="size-11 rounded-xl bg-[#E8F8EE] text-[#0D5229] flex items-center justify-center shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-['Familjen_Grotesk'] text-[16px] sm:text-[17px] font-bold text-[#04330B]">
                      {isHi ? "सत्यापित रोपण रिकॉर्ड" : "Plantation Records & Tracking"}
                    </h3>
                    <p className="text-[13px] sm:text-[13.5px] text-[#557862] leading-relaxed">
                      {isHi
                        ? "पौधा लगाए जाने के बाद उसका स्थान और देखभाल योजना रिकॉर्ड से जुड़ी रहेगी।"
                        : "Location and long-term care plans are systematically linked to your dedication."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Counters (Connected to API) */}
              <div ref={progressRef} className="rounded-[20px] bg-white border border-[#E2ECE4] p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-black uppercase tracking-wider text-[#0D5229] flex items-center gap-1.5">
                    <BarChart3 size={14} />
                    {isHi ? "पारदर्शिता डैशबोर्ड" : "Public Progress Tracker"}
                  </span>
                  <span className="text-[11px] font-semibold text-[#587E67]">
                    {isHi ? "सत्यापित डेटा" : "Verified API"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: isHi ? "प्रायोजित पौधे" : "Plants Sponsored",
                      val: progress?.plantsSponsored ?? null,
                      icon: <TreePine size={15} className="text-[#0D5229]" />,
                    },
                    {
                      label: isHi ? "लगाए गए पौधे" : "Plants Planted",
                      val: progress?.plantsPlanted ?? null,
                      icon: <MapPin size={15} className="text-[#587E67]" />,
                    },
                    {
                      label: isHi ? "सत्यापित जीवित" : "Verified Survival",
                      val: progress?.verifiedSurvival ?? null,
                      icon: <Leaf size={15} className="text-[#0D5229]" />,
                    },
                    {
                      label: isHi ? "रखरखाव की स्थिति" : "Planned Care",
                      val: progress?.maintenanceProgress ?? null,
                      icon: <BarChart3 size={15} className="text-[#587E67]" />,
                    },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-[12px] bg-[#F8FAF8] border border-[#E2ECE4] p-3 space-y-1">
                      <div className="size-6 rounded-md bg-[#E4F5E9] flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <span className="block text-[10.5px] font-bold text-[#587E67]">
                        {stat.label}
                      </span>
                      <span className="block font-black text-[#04330B] text-[18px] leading-tight">
                        {progressLoading
                          ? "..."
                          : progressError
                            ? "—"
                            : stat.val === null
                              ? "—"
                              : stat.val.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Plant Sponsorship Form */}
            <div className="lg:col-span-5 lg:sticky lg:top-[110px] w-full">
              <PlantSponsorshipForm
                selectedOccasion={selectedOccasion}
                onOccasionChange={setSelectedOccasion}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. THE GOAL ISN'T JUST TO PLANT · IT'S TO HELP PLANTS SURVIVE */}
      {/* (2-Column Layout matching reference image) */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E8EFE9]">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Narrative, Quote Callout & 4 Pillars */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="inline-block rounded-full bg-[#DCEEE0] text-[#0D5229] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                  {isHi ? "रोपण और देखभाल" : "PLANTING & CARE"}
                </span>
                <h2 className="font-['Familjen_Grotesk'] text-[30px] sm:text-[42px] font-black text-[#04330B] leading-tight">
                  {isHi ? "पौधा लगाना तो बस शुरुआत है।" : "Planting is only the beginning."}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[#34523F] font-normal leading-relaxed pt-1">
                  {isHi
                    ? "नए लगाए गए पौधे की तस्वीर खींच लेना मंज़िल नहीं है। असली मेहनत उसे जीवित रखना है। इसके लिए सही जगह का चुनाव, स्थानीय परिस्थितियों के अनुकूल देशी प्रजातियाँ, पानी और देखभाल की योजना, और लगातार निगरानी ज़रूरी है।"
                    : "A photograph of a newly planted sapling is not the finish line. The real work is helping it survive. That means selecting suitable land, choosing locally appropriate native species, planning for water and maintenance, and monitoring results."}
                </p>
              </div>

              {/* Callout Box */}
              <div className="rounded-xl bg-[#F2F8F4] border border-[#DCEBE0] p-4 flex items-center gap-3.5 shadow-sm">
                <div className="size-9 rounded-full bg-[#E2F0E5] text-[#16A34A] flex items-center justify-center shrink-0">
                  <Leaf size={18} />
                </div>
                <p className="font-['Familjen_Grotesk'] text-[14.5px] sm:text-[16px] font-bold text-[#0D3820] leading-snug">
                  {isHi
                    ? "हम सिर्फ लगाए गए पौधे नहीं गिनना चाहते। हम चाहते हैं कि जीवित पौधे गिने जाएँ।"
                    : "Let's count more than the plants we put in the ground. Let's count the ones that live."}
                </p>
              </div>

              {/* 4 Pillars Grid (2x2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  {
                    num: "01",
                    title: isHi ? "सही जगह" : "Right place",
                    desc: isHi
                      ? "भूमि की अनुमति और पारिस्थितिक आकलन।"
                      : "Site permissions and ecological assessment.",
                  },
                  {
                    num: "02",
                    title: isHi ? "सही प्रजाति" : "Right species",
                    desc: isHi
                      ? "स्थानीय परिस्थितियों के अनुकूल देशी पौधे।"
                      : "Locally appropriate native plants.",
                  },
                  {
                    num: "03",
                    title: isHi ? "सच्ची देखभाल" : "Real care",
                    desc: isHi
                      ? "सुरक्षा, रखरखाव और आवश्यकतानुसार सिंचाई।"
                      : "Protection, maintenance and watering where needed.",
                  },
                  {
                    num: "04",
                    title: isHi ? "पारदर्शी प्रगति" : "Visible progress",
                    desc: isHi
                      ? "प्रायोजन रिकॉर्ड, रोपण और जीवित पौधों की निरंतर रिपोर्ट।"
                      : "Sponsorship records, planting and survival updates as available.",
                  },
                ].map((card) => (
                  <div
                    key={card.num}
                    className="rounded-[16px] bg-[#F9FAF8] border border-[#E2ECE4] p-4 space-y-1.5 shadow-sm"
                  >
                    <span className="font-['Familjen_Grotesk'] font-black text-[18px] text-[#16A34A] block">
                      {card.num}
                    </span>
                    <h3 className="font-['Familjen_Grotesk'] text-[16px] font-bold text-[#04330B]">
                      {card.title}
                    </h3>
                    <p className="text-[12.5px] text-[#557862] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: High-Res Photo of hands tending to sapling */}
            <div className="lg:col-span-5">
              <div className="rounded-[22px] overflow-hidden shadow-lg border border-[#E2ECE4] aspect-[4/3] lg:aspect-auto lg:h-[420px] w-full bg-[#F4F8F5] relative">
                <img
                  src="/green-wall/new-baby.jpg"
                  alt="Care for planting"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. BECOME A CARBON HERO (3-Part Balanced Layout on Deep Green) */}
      {/* ========================================================= */}
      <section ref={heroBadgeRef} className="py-16 sm:py-24 bg-[#063A1D] text-white border-b border-[#0D5229]">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block rounded-full bg-[#C3F53C] text-[#04330B] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider">
                {isHi ? "कार्बन हीरो" : "CARBON HERO"}
              </span>

              <h2 className="font-['Familjen_Grotesk'] text-[28px] sm:text-[38px] font-black leading-[1.12] text-white tracking-tight">
                {isHi ? "पर्दे पर बहुत सुपरहीरो हैं।" : "The world has enough superheroes on screens."}
                <br />
                <span className="text-[#C3F53C]">
                  {isHi ? "धरती को कुछ असली हीरो भी चाहिए।" : "It could use a few on the ground."}
                </span>
              </h2>

              <div className="space-y-3 text-[14.5px] sm:text-[15.5px] text-white/85 leading-relaxed font-normal">
                <p>
                  {isHi
                    ? "न उड़ने की शक्ति चाहिए। न कोई गुप्त पहचान। बस एक छोटा-सा फैसला कि दुनिया का कुछ हिस्सा और हरा होना चाहिए। एक पौधे का प्रायोजन कीजिए और पाइए अपना कार्बन हीरो डिजिटल बैज।"
                    : "No flying. No superpowers. No secret identity. Just one person deciding that a little more of the world should be green. Sponsor a plant and unlock your own Carbon Hero digital badge."}
                </p>
                <p>
                  {isHi
                    ? "अपना इंस्टाग्राम पोस्ट बनाइए। अपनी स्टोरी तैयार कीजिए। दोस्तों के साथ अपना योगदान साझा कीजिए।"
                    : "Make a personalised Instagram post. Create your own Story. Share your green contribution with friends."}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={scrollToSponsor}
                  className="h-12 px-7 rounded-full bg-[#C3F53C] text-[#04330B] font-['Familjen_Grotesk'] text-[14.5px] font-black shadow-lg hover:bg-[#b0e82c] transition-all inline-flex items-center gap-2"
                >
                  <Shield size={16} />
                  <span>{isHi ? "मेरा कार्बन हीरो बैज बनाएं" : "UNLOCK MY CARBON HERO BADGE"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Center Column: Emblem Artwork Carousel */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="rounded-[24px] bg-[#0A4825] p-5 border border-[#C3F53C]/30 shadow-2xl space-y-4 text-center max-w-[320px] w-full">
                <div className="relative mx-auto w-full aspect-square rounded-2xl overflow-hidden shadow-md border border-white/20 bg-black/40">
                  {heroImages.map((img, idx) => (
                    <img
                      key={img.src}
                      src={img.src}
                      alt="Official Carbon Hero Artwork"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        heroImageIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                      }`}
                    />
                  ))}
                  <div className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/25 p-2.5 text-left z-10">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-[#C3F53C]">
                      VERIFIED CARBON HERO
                    </span>
                    <span className="block font-black text-white text-[13px] truncate">
                      {badgeDonorName}
                    </span>
                  </div>
                </div>

                {/* Supporter Name Input */}
                <input
                  type="text"
                  maxLength={40}
                  value={badgeDonorName}
                  onChange={(e) => setBadgeDonorName(e.target.value || "Nature Supporter")}
                  className="w-full h-9 rounded-lg bg-white/10 border border-white/20 px-3 text-center text-xs font-semibold text-white placeholder-white/40 focus:outline-none focus:border-[#C3F53C]"
                  placeholder="Enter name on badge"
                />

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShareBadge}
                  className="w-full h-10 rounded-lg bg-[#C3F53C] text-[#04330B] font-bold text-xs hover:bg-[#b0e82c] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Share2 size={14} />
                  <span>
                    {copiedShare
                      ? isHi
                        ? "लिंक कॉपी हो गया!"
                        : "Link Copied!"
                      : isHi
                        ? "स्टोरी पर शेयर करें"
                        : "Share on Instagram / Story"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Checklist & Cape Quote */}
            <div className="lg:col-span-3 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-white/90 text-[13.5px] font-medium">
                  <div className="size-5 rounded-full bg-[#C3F53C] text-[#04330B] flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span>{isHi ? "अपना इंस्टाग्राम पोस्ट बनाइए।" : "Make a personalised Instagram post."}</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 text-[13.5px] font-medium">
                  <div className="size-5 rounded-full bg-[#C3F53C] text-[#04330B] flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span>{isHi ? "अपनी स्टोरी तैयार कीजिए।" : "Create your own Story."}</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90 text-[13.5px] font-medium">
                  <div className="size-5 rounded-full bg-[#C3F53C] text-[#04330B] flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span>{isHi ? "दोस्तों के साथ अपना योगदान साझा कीजिए।" : "Share your green contribution with friends."}</span>
                </div>
              </div>

              {/* Cape Quote */}
              <div className="pt-3 border-t border-white/15">
                <p className="font-['Familjen_Grotesk'] text-[17px] sm:text-[19px] font-bold text-[#C3F53C] leading-snug">
                  {isHi
                    ? "केप हो या न हो। दिल हरा होना चाहिए।"
                    : "Your cape is optional. Your green side is not."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. CARBON CREDITS EXPLAINER (2-Column Grid matching reference) */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 bg-[#F9FAF8] border-b border-[#E8EFE9]">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block rounded-full bg-[#DCEEE0] text-[#0D5229] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                {isHi ? "कार्बन क्रेडिट" : "CARBON CREDITS"}
              </span>

              <h2 className="font-['Familjen_Grotesk'] text-[26px] sm:text-[36px] font-black text-[#04330B] leading-tight">
                {isHi
                  ? "क्या इन पौधों से असली कार्बन क्रेडिट बन सकते हैं?"
                  : "Could these plants generate real carbon credits?"}
              </h2>

              <div className="space-y-3 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#2D3A31]">
                <p>
                  {isHi
                    ? "इस संभावना को भी हम आगे बढ़ाना चाहते हैं। बढ़ते हुए पौधे वातावरण से कार्बन डाइऑक्साइड ग्रहण कर सकते हैं। लेकिन प्रमाणित कार्बन क्रेडिट के लिए पात्र परियोजना, वैज्ञानिक मापन, स्वतंत्र सत्यापन और अधिकृत प्रणाली से क्रेडिट जारी होना आवश्यक है।"
                    : "That's another possibility we want to develop. Growing plants can remove carbon dioxide from the atmosphere. However, recognised carbon credits require eligible projects, measurement, independent verification and formal issuance."}
                </p>
                <p>
                  {isHi
                    ? "हम हरित दीवार के उपयुक्त स्थलों को भविष्य में प्रमाणित कार्बन-क्रेडिट कार्यक्रम के लिए परखना चाहते हैं। अभी पौधे के प्रायोजन पर कार्बन हीरो सम्मान-बैज मिलेगा। प्रमाणित कार्बन क्रेडिट, जहाँ पात्रता संभव हुई, भविष्य का अलग कार्यक्रम होगा।"
                    : "Our aim is to evaluate suitable Green Wall sites for a verified carbon-credit programme. For now, sponsoring a plant earns a Carbon Hero recognition badge. Verified carbon credits, where eligible, would be a separate future offering."}
                </p>
              </div>
            </div>

            {/* Right Column: Dark Eco-Cycle Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[22px] bg-[#16221A] p-6 text-center space-y-5 border border-[#23382A] shadow-md">
                {/* 4 Pillars Around Center Sprout */}
                <div className="grid grid-cols-2 gap-3 max-w-[260px] mx-auto py-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[11px] font-bold text-[#C3F53C]">CO₂</span>
                    <span className="text-[10px] text-white/70">{isHi ? "अवशोषण" : "Capture"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[11px] font-bold text-[#C3F53C]">{isHi ? "मापन" : "Measure"}</span>
                    <span className="text-[10px] text-white/70">{isHi ? "वैज्ञानिक" : "Scientific"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[11px] font-bold text-[#C3F53C]">{isHi ? "सत्यापन" : "Verify"}</span>
                    <span className="text-[10px] text-white/70">{isHi ? "स्वतंत्र" : "Audited"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <span className="text-[11px] font-bold text-[#C3F53C]">{isHi ? "क्रेडिट" : "Issuance"}</span>
                    <span className="text-[10px] text-white/70">{isHi ? "प्रमाणित" : "Standard"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToSponsor}
                  className="h-11 px-6 rounded-full bg-[#C3F53C] text-[#04330B] font-['Familjen_Grotesk'] text-xs font-bold uppercase tracking-wider hover:bg-[#b0e82c] transition-all inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isHi ? "कार्बन क्रेडिट के बारे में जानें" : "Learn About Carbon Credits"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. ONE LAST THOUGHT · HEROIC FINALE (Matching reference) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#042B14] text-white relative text-center">
        <div className="relative z-10 mx-auto w-full max-w-[840px] px-4 sm:px-6 space-y-7">
          <span className="inline-block rounded-full bg-[#C3F53C] text-[#04330B] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider">
            {isHi ? "अंतिम विचार" : "ONE LAST THOUGHT"}
          </span>

          <h2 className="font-['Familjen_Grotesk'] text-[32px] sm:text-[46px] font-black text-white leading-tight">
            {isHi ? "जाते-जाते एक आखिरी बात।" : "One last thought."}
          </h2>

          <div className="space-y-3.5 text-[16px] sm:text-[17.5px] text-white/90 leading-relaxed font-normal max-w-2xl mx-auto">
            <p>
              {isHi
                ? "एक दिन कोई उस पेड़ की छाँव में बैठेगा, जिसे उसने कभी नहीं लगाया होगा। शायद उसे कभी पता भी न चले कि उस पेड़ को उगाने में किसका योगदान था।"
                : "Someday, someone will stand in the shade of a tree they never planted. They may never know who helped make it possible."}
            </p>
            <p>
              {isHi
                ? "क्या पता, उसकी शुरुआत आपसे हुई हो। महान हरित दीवार एक बड़ा सपना है। लेकिन बड़े सपनों की शुरुआत आम लोगों के छोटे-छोटे खूबसूरत फैसलों से होती है।"
                : "What if that tree began with you? The Great Green Wall is a big idea. But big ideas begin with ordinary people making one beautiful choice at a time."}
            </p>
            <p className="font-bold text-[#C3F53C] pt-1">
              {isHi
                ? "अगला तोहफ़ा ऐसा दीजिए, जो जीवित रहे।"
                : "Make your next gift a living one."}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={scrollToSponsor}
              className="h-13 sm:h-14 px-9 sm:px-11 rounded-full bg-[#C3F53C] text-[#04330B] font-['Familjen_Grotesk'] text-[15px] sm:text-[17px] font-black shadow-2xl hover:bg-[#b0e82c] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <span>
                {isHi
                  ? "महान हरित दीवार में अपना हिस्सा जोड़ें"
                  : "BUILD YOUR PART OF THE GREAT GREEN WALL"}
              </span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

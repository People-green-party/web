"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { useLanguage } from "../../../components/LanguageContext";
import { FUNDS_DATA } from "../../../data/fundsData";
import { PlantSponsorshipForm } from "../../../components/donation/PlantSponsorshipForm";
import { ApiRequestError, fetchApi } from "../../../lib/api";
import {
  ArrowLeft,
  TreePine,
  Compass,
  Award,
  Leaf,
  BarChart3,
  MapPin,
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
  const fund = FUNDS_DATA["green-fund"];

  const sponsorRef = useRef<HTMLDivElement | null>(null);
  const missionRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
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
              : "error",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [progressRetry]);

  const scrollToSponsor = () =>
    sponsorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToMission = () =>
    missionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToProgress = () =>
    progressRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-[#EFF5F1] bg-[#F9FBF9] py-3">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/donation"
            className="inline-flex items-center gap-1.5 font-bold text-[#0D5229] hover:underline"
          >
            <ArrowLeft size={15} />
            {isHi ? "सभी कोष देखें" : "Back to Three Funds"}
          </Link>
          <span className="font-semibold text-[#587E67] hidden sm:inline">
            {isHi ? "महान हरित दीवार मिशन · अरावली" : "Great Green Wall Mission · Aravalli"}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#04330B] text-white">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 lg:gap-12 items-center">

            {/* Left */}
            <div className="space-y-5">
              <span className="inline-block rounded-full bg-emerald-500/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-300 border border-emerald-500/30">
                {isHi ? fund.category.hi : fund.category.en}
              </span>

              <div>
                <h1 className="font-['Familjen_Grotesk'] text-[42px] sm:text-[54px] lg:text-[64px] font-black leading-[1.0] tracking-tight text-white">
                  {isHi ? "ग्रीन फंड" : "GREEN FUND"}
                </h1>
                <p className="mt-2 text-emerald-400 font-['Familjen_Grotesk'] text-[18px] sm:text-[20px] font-bold">
                  {isHi ? "महान हरित दीवार मिशन" : "The Great Green Wall Mission"}
                </p>
              </div>

              <p className="font-['Familjen_Grotesk'] text-[18px] sm:text-[20px] font-semibold text-white/90 leading-snug">
                {isHi
                  ? "एक करोड़ पौधे। दीर्घकालीन हरित पुनर्स्थापन अभियान।"
                  : "One Crore Plants. A Long-Term Restoration Mission."}
              </p>

              <p className="text-white/75 text-[15px] leading-relaxed max-w-lg">
                {isHi
                  ? "महान हरित दीवार मिशन अरावली पर्वतमाला और उससे जुड़े शुष्क एवं संवेदनशील भूभागों में प्रस्तावित पर्यावरणीय पुनर्स्थापन की पहल है।"
                  : "The Great Green Wall Mission is a proposed ecological restoration initiative focused on vulnerable landscapes around the Aravalli range and adjoining semi-arid regions."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToSponsor}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-['Familjen_Grotesk'] text-[14.5px] font-bold text-white shadow-lg transition-all active:scale-[0.98]"
                >
                  <TreePine size={17} />
                  {isHi ? "पौधे का प्रायोजन करें" : "Sponsor a Plant"}
                </button>
                <button
                  type="button"
                  onClick={scrollToMission}
                  className="h-11 px-5 rounded-xl border border-white/25 text-[13.5px] font-bold text-white/90 hover:bg-white/10 transition-all"
                >
                  {isHi ? "मिशन देखें" : "View the Mission"}
                </button>
                <button
                  type="button"
                  onClick={scrollToProgress}
                  className="h-11 px-5 rounded-xl border border-white/25 text-[13.5px] font-bold text-white/90 hover:bg-white/10 transition-all"
                >
                  {isHi ? "प्रगति देखें" : "Track Progress"}
                </button>
              </div>
            </div>

            {/* Right – Cover Image */}
            <div className="relative rounded-[20px] overflow-hidden shadow-2xl border border-white/15 aspect-[16/10] bg-black/30">
              <img
                src={fund.coverImage}
                alt={isHi ? "अरावली क्षेत्र का हरित पुनर्स्थापन परिदृश्य" : "Aravalli landscape with native vegetation and ecological restoration"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-[11px] font-medium text-white/85 leading-snug">
                {isHi
                  ? "अरावली पर्वतमाला और शुष्क क्षेत्रों में हरित पुनर्स्थापन अभियान"
                  : "Ecological restoration corridor along the Aravalli range and landscape"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + SPONSOR FORM */}
      <section ref={missionRef} className="py-12 lg:py-16 bg-white">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">

            {/* LEFT: Mission Content */}
            <div className="space-y-10">

              {/* Narrative */}
              <div className="space-y-4">
                <h2 className="font-['Familjen_Grotesk'] text-[28px] sm:text-[34px] font-bold text-[#04330B] leading-tight tracking-tight">
                  {isHi
                    ? "एक करोड़ पौधे। दीर्घकालीन हरित पुनर्स्थापन अभियान।"
                    : "One Crore Plants. A Long-Term Restoration Mission."}
                </h2>
                <div className="space-y-3 text-[15.5px] leading-[1.75] text-[#2D3A31]">
                  <p>
                    {isHi
                      ? "महान हरित दीवार मिशन अरावली पर्वतमाला और उससे जुड़े शुष्क एवं संवेदनशील भूभागों में प्रस्तावित पर्यावरणीय पुनर्स्थापन की पहल है।"
                      : "The Great Green Wall Mission is a proposed ecological restoration initiative focused on vulnerable landscapes around the Aravalli range and adjoining semi-arid regions."}
                  </p>
                  <p>
                    {isHi
                      ? "अरावली का भूभाग पश्चिमी और उत्तर-पश्चिमी भारत के पर्यावरण में महत्वपूर्ण भूमिका निभाता है। भूमि क्षरण, वनस्पति में कमी और मरुस्थलीकरण के जोखिमों को देखते हुए वैज्ञानिक योजना तथा दीर्घकालीन देखभाल आवश्यक है।"
                      : "The Aravalli landscape plays an important ecological role in western and northwestern India. Land degradation, loss of vegetation and desertification risks require scientifically planned restoration and long-term care."}
                  </p>
                  <p>
                    {isHi
                      ? "इस मिशन में स्थानीय परिस्थितियों के अनुसार उपयुक्त देशी प्रजातियों का रोपण और पारिस्थितिक पुनर्स्थापन प्रस्तावित है।"
                      : "The mission proposes site-specific plantations and ecological restoration, using suitable native species and maintenance practices."}
                  </p>
                </div>
              </div>

              {/* Phase One Goal */}
              <div className="rounded-[20px] bg-[#F6FAF7] border border-[#C5DCCF] p-6 sm:p-7 space-y-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800 flex items-center gap-2">
                  <Leaf size={13} className="text-emerald-700" />
                  {isHi ? "प्रथम चरण का लक्ष्य" : "Our Phase One Goal"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      value: "1,00,00,000",
                      label: isHi ? "पौधे — प्रथम चरण का लक्ष्य" : "Plants — Target for Phase One",
                      icon: <TreePine size={16} className="text-emerald-700" />,
                    },
                    {
                      value: "₹1,500",
                      label: isHi ? "प्रति पौधा — अनुमानित योगदान" : "Per Plant — Estimated contribution",
                      icon: <Leaf size={16} className="text-emerald-700" />,
                    },
                    {
                      value: "₹1,500 " + (isHi ? "करोड़" : "Crore"),
                      label: isHi ? "प्रथम चरण का अनुमानित कुल बजट" : "Indicative total budget for Phase One",
                      icon: <BarChart3 size={16} className="text-emerald-700" />,
                    },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-[14px] bg-white border border-[#DCEBE2] p-4 space-y-2">
                      <div className="size-7 rounded-lg bg-[#E4F5E9] flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <span className="block text-[20px] sm:text-[24px] font-black text-[#04330B] leading-none">
                        {stat.value}
                      </span>
                      <span className="block text-[11px] sm:text-xs font-semibold text-[#587E67] leading-snug">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Dedication */}
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {isHi ? "व्यक्तिगत समर्पण" : "Personal Dedication"}
                </span>
                <h2 className="font-['Familjen_Grotesk'] text-[24px] sm:text-[30px] font-bold text-[#04330B] leading-tight">
                  {isHi
                    ? "अपने नाम पर पौधा। अपनों के नाम समर्पण।"
                    : "Plant in Your Name. Dedicate to Someone Special."}
                </h2>
                <p className="text-[15px] leading-relaxed text-[#2D3A31]">
                  {isHi
                    ? "अपने नाम पर एक पौधे के रोपण को प्रायोजित करें या किसी प्रियजन के नाम समर्पित करें। जन्मदिन, विवाह, सालगिरह, त्योहार अथवा किसी विशेष अवसर को पौधे के समर्पण के माध्यम से यादगार बनाया जा सकता है।"
                    : "Sponsor a plant in your name, or dedicate one to someone important in your life. Mark a birthday, wedding, anniversary, festival or other special occasion with a personalised plant dedication."}
                </p>

                <div className="rounded-[16px] bg-white border border-[#DCEBE2] divide-y divide-[#F0F5F2]">
                  {[
                    {
                      icon: <Award size={17} />,
                      title: isHi ? "डिजिटल समर्पण प्रमाणपत्र" : "Digital Dedication Certificate",
                      desc: isHi
                        ? "सफल प्रायोजन के बाद एक डिजिटल समर्पण प्रमाणपत्र दिया जाएगा। पौधा लगाए जाने और उसका रिकॉर्ड तैयार होने पर प्रमाणपत्र को रोपण स्थल और पहचान संख्या से जोड़ा जा सकेगा।"
                        : "Each successful sponsorship will receive a digital dedication certificate. Once planting is completed and documented, the record can be linked to the plantation location and identification number.",
                    },
                    {
                      icon: <Compass size={17} />,
                      title: isHi ? "रोपण स्थल और पहचान संख्या" : "Plantation Location and Identification",
                      desc: isHi
                        ? "रोपण पूरा होने और उसका रिकॉर्ड तैयार होने पर प्रमाणपत्र को स्थान और पहचान संख्या से जोड़ा जा सकेगा।"
                        : "Once planting is completed and documented, the certificate record can be linked to its plantation location and identification number.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4">
                      <div className="size-8 rounded-lg bg-[#E4F5E9] flex items-center justify-center text-[#04330B] shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#04330B] text-sm">{item.title}</h4>
                        <p className="text-[12px] text-[#587E67] leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Sponsorship Form */}
            <div ref={sponsorRef} className="scroll-mt-[100px] lg:sticky lg:top-[100px]">
              <PlantSponsorshipForm />
            </div>
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION ROADMAP */}
      <section className="py-12 lg:py-16 bg-white border-t border-[#EFF5F1]">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8 space-y-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
              {isHi ? "कार्यप्रणाली" : "Implementation Roadmap"}
            </span>
            <h2 className="font-['Familjen_Grotesk'] text-[26px] sm:text-[32px] font-bold text-[#04330B] mt-1 tracking-tight">
              {isHi ? "मिशन की प्रस्तावित कार्ययोजना" : "How the Mission Is Planned"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: 1,
                icon: <MapPin size={15} />,
                title: isHi ? "उपयुक्त क्षेत्र का चयन" : "Identify the Landscape",
                desc: isHi
                  ? "अरावली और आसपास के संवेदनशील क्षेत्रों में वैज्ञानिक आकलन एवं भूमि संबंधी अनुमतियों के आधार पर स्थानों का चयन।"
                  : "Select suitable restoration areas in and around vulnerable Aravalli landscapes, based on ecological assessment and land permissions.",
              },
              {
                num: 2,
                icon: <Leaf size={15} />,
                title: isHi ? "देशी प्रजातियों का चयन" : "Select Native Species",
                desc: isHi
                  ? "प्रत्येक स्थान की प्राकृतिक परिस्थितियों के अनुसार उपयुक्त पेड़, झाड़ियाँ और अन्य वनस्पतियाँ चुनना।"
                  : "Choose locally appropriate trees, shrubs and other vegetation rather than using a single species everywhere.",
              },
              {
                num: 3,
                icon: <TreePine size={15} />,
                title: isHi ? "रोपण एवं रखरखाव" : "Plant and Maintain",
                desc: isHi
                  ? "क्षेत्रीय टीमों और सहयोगी संस्थाओं के माध्यम से रोपण, संरक्षण, आवश्यकता अनुसार सिंचाई और नियमित देखभाल।"
                  : "Undertake planting, protection, watering where required, and scheduled maintenance through field teams and implementation partners.",
              },
              {
                num: 4,
                icon: <BarChart3 size={15} />,
                title: isHi ? "निगरानी एवं रिपोर्टिंग" : "Measure and Report",
                desc: isHi
                  ? "रोपण के रिकॉर्ड, जीवित पौधों की स्थिति, रखरखाव और परियोजना के खर्च का विवरण प्रकाशित करना।"
                  : "Publish plantation records, survival information, maintenance updates and project expenditure.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-[18px] border border-[#DDEEE4] bg-[#F9FBF9] p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[#04330B] text-white font-bold text-sm shrink-0">
                    {step.num}
                  </span>
                  <div className="size-7 rounded-lg bg-[#E4F5E9] flex items-center justify-center text-emerald-700">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-bold text-[#04330B] text-[15px]">{step.title}</h3>
                <p className="text-[12.5px] leading-relaxed text-[#587E67]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACK PROGRESS */}
      <section ref={progressRef} className="py-12 lg:py-16 bg-[#F6FAF7] border-t border-[#DDEEE4]">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8 space-y-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              {isHi ? "पारदर्शिता डैशबोर्ड" : "Public Dashboard"}
            </span>
            <h2 className="font-['Familjen_Grotesk'] text-[26px] sm:text-[32px] font-bold text-[#04330B] mt-1 tracking-tight">
              {isHi ? "प्रगति की जानकारी" : "Track the Progress"}
            </h2>
            <p className="text-[13.5px] text-[#587E67] max-w-2xl mt-2 leading-relaxed">
              {isHi
                ? "मिशन के डैशबोर्ड पर प्रायोजित पौधों, लगाए गए पौधों, सत्यापित जीवित पौधों और रखरखाव की जानकारी उपलब्ध कराई जाएगी।"
                : "The mission dashboard will report plants sponsored, plants planted, verified survival and maintenance progress, as data becomes available."}
            </p>
          </div>

          {progressError && (
            <div role="alert" className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-[#587E67]">
              <span>
                {isHi
                  ? "प्रगति की जानकारी अभी लोड नहीं हो सकी। कृपया फिर से प्रयास करें।"
                  : "Progress data could not be loaded right now. Please try again."}
              </span>
              <button
                type="button"
                onClick={() => {
                  setProgressStatus("loading");
                  setProgressRetry((value) => value + 1);
                }}
                className="ml-2 font-bold text-[#04330B] underline underline-offset-2"
              >
                {isHi ? "फिर प्रयास करें" : "Retry"}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <TreePine size={19} className="text-emerald-700" />,
                label: isHi ? "प्रायोजित पौधे" : "Plants Sponsored",
                value: progress?.plantsSponsored ?? null,
              },
              {
                icon: <MapPin size={19} className="text-[#587E67]" />,
                label: isHi ? "लगाए गए पौधे" : "Plants Planted",
                value: progress?.plantsPlanted ?? null,
              },
              {
                icon: <Leaf size={19} className="text-emerald-700" />,
                label: isHi ? "सत्यापित जीवित पौधे" : "Verified Survival",
                value: progress?.verifiedSurvival ?? null,
              },
              {
                icon: <BarChart3 size={19} className="text-[#587E67]" />,
                label: isHi ? "रखरखाव की प्रगति" : "Maintenance Progress",
                value: progress?.maintenanceProgress ?? null,
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[18px] bg-white border border-[#DCEBE2] p-5 space-y-2">
                <div className="size-9 rounded-xl bg-[#F0F9F3] flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="block text-[11px] font-bold text-[#587E67]">{stat.label}</span>
                <span className={`block min-h-[28px] font-black text-[#04330B] leading-tight ${stat.value === null && !progressLoading ? "text-sm" : "text-[22px] sm:text-[26px]"}`}>
                  {progressLoading
                    ? (isHi ? "लोड हो रहा है…" : "Loading…")
                    : progressError
                      ? (isHi ? "अभी अनुपलब्ध" : "Unavailable")
                      : progressUnavailable
                        ? (isHi ? "रिपोर्टिंग शुरू नहीं हुई" : "Reporting not connected")
                      : stat.value === null
                        ? (isHi ? "जानकारी लंबित" : "Updates pending")
                        : stat.value.toLocaleString(isHi ? "hi-IN" : "en-IN")}
                </span>
                <span className="block min-h-[32px] text-[11px] font-semibold text-[#587E67]">
                  {progressLoading
                    ? (isHi ? "सत्यापित प्रगति जानकारी लाई जा रही है" : "Loading verified progress data")
                    : progressError
                      ? (isHi ? "जानकारी फिर से लोड करने का प्रयास करें" : "Try reloading the progress data")
                      : progressUnavailable
                        ? (isHi ? "मिशन की प्रगति के साथ जानकारी अपडेट होगी" : "Data will be updated as the mission progresses")
                      : stat.value === null
                        ? (isHi ? "मिशन की प्रगति के साथ जानकारी अपडेट होगी" : "Data will be updated as the mission progresses")
                        : (isHi ? "सत्यापित भुगतान रिकॉर्ड" : "Verified payment records")}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={scrollToSponsor}
              className="inline-flex h-12 items-center justify-center gap-2 px-8 rounded-xl bg-[#04330B] font-['Familjen_Grotesk'] text-[15px] font-bold text-white shadow-md hover:bg-[#064e11] hover:scale-[1.02] transition-all"
            >
              <TreePine size={16} />
              {isHi ? "पौधा प्रायोजित करें और प्रमाणपत्र पाएं →" : "Sponsor a Plant & Get Certificate →"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

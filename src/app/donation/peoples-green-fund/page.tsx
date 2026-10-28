"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { useLanguage } from "../../../components/LanguageContext";
import { FUNDS_DATA } from "../../../data/fundsData";
import { DonationModal } from "../../../components/donation/DonationModal";
import { ArrowLeft, HeartHandshake } from "lucide-react";

export default function PeoplesGreenFundPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const fund = FUNDS_DATA["peoples-green-fund"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const supports = isHi
    ? [
        { title: "राजनीतिक संगठन", text: "पार्टी के संगठनात्मक ढाँचे, स्थानीय कार्यक्रमों और नेतृत्व संबंधी पहलों का विकास।" },
        { title: "जनसभाएँ एवं अभियान", text: "जनसभाओं, शांतिपूर्ण प्रदर्शनों, सम्मेलनों और सार्वजनिक चर्चाओं का आयोजन।" },
        { title: "अध्ययन एवं नीति निर्माण", text: "सरकारी निर्णयों और उनके प्रभावों का अध्ययन, नीतिगत सुझाव और दस्तावेज़ आधारित विश्लेषण।" },
        { title: "जनसंपर्क एवं संवाद", text: "संचार माध्यमों, प्रकाशनों, जनसंपर्क गतिविधियों तथा जनहित के मुद्दे सामने रखने के अवसरों का विकास।" },
      ]
    : [
        { title: "Political Organisation", text: "Building the party's organisational capacity, local programmes and leadership initiatives." },
        { title: "Public Meetings and Campaigns", text: "Organising public meetings, peaceful demonstrations, conferences and public discussions." },
        { title: "Research and Policy", text: "Preparing research, policy proposals and documented analysis of government decisions and their consequences." },
        { title: "Communication and Public Engagement", text: "Maintaining communication platforms, publications, outreach activities and opportunities for citizens to raise public-interest concerns." },
      ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Top Breadcrumb & Navigation */}
      <div className="border-b border-[#EFF5F1] bg-[#F9FBF9] py-3.5">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/donation"
            className="inline-flex items-center gap-1.5 font-bold text-[#0D5229] hover:underline"
          >
            <ArrowLeft size={16} />
            {isHi ? "सभी कोष देखें" : "Back to Three Funds"}
          </Link>
          <span className="font-semibold text-[#587E67]">
            {isHi ? "राजनीतिक संगठन एवं सार्वजनिक जवाबदेही" : "Political Organisation & Public Accountability"}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#04330B] text-white py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            {/* Left Content */}
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-sm border border-white/10">
                {isHi ? fund.category.hi : fund.category.en}
              </span>
              <h1 className="font-['Familjen_Grotesk'] text-[32px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.1] tracking-tight">
                {isHi ? fund.heroHeading.hi : fund.heroHeading.en}
              </h1>
              <p className="text-emerald-300 font-['Familjen_Grotesk'] text-lg sm:text-xl font-bold">
                {isHi ? fund.heroTagline.hi : fund.heroTagline.en}
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-white/95">
                {isHi ? fund.heroSubheading.hi : fund.heroSubheading.en}
              </h2>
              <p className="text-white/80 text-[15px] sm:text-[16.5px] leading-relaxed max-w-xl">
                {isHi
                  ? "पीपुल्स ग्रीन फंड, डॉ. सुधांशु द्वारा स्थापित इंडियन पीपुल्स ग्रीन पार्टी की राजनीतिक और संगठनात्मक गतिविधियों के लिए है।"
                  : "The People's Green Fund supports the political and organisational activities of the Indian Peoples Green Party, founded by Dr Sudhanshu."}
              </p>

              <div className="pt-3 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="h-12 px-7 rounded-xl bg-white font-['Familjen_Grotesk'] text-[16px] font-bold text-[#04330B] shadow-lg hover:bg-emerald-50 transition-all active:scale-[0.98]"
                >
                  {isHi ? "कोष में योगदान करें →" : "Contribute to Fund →"}
                </button>
                <Link
                  href="#fund-details"
                  className="h-12 px-6 rounded-xl border border-white/30 text-[14.5px] font-bold text-white hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  {isHi ? "कोष का विवरण देखें" : "View Fund Details"}
                </Link>
              </div>
            </div>

            {/* Right Cover Image */}
            <div className="relative rounded-[22px] overflow-hidden shadow-2xl border-2 border-white/15 aspect-[16/10] bg-black/30">
              <img
                src={fund.coverImage}
                alt="People's Green Party Protest and Rally"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            {/* Fund details */}
            <div id="fund-details" className="scroll-mt-28 space-y-7">
              <h2 className="font-['Familjen_Grotesk'] text-[26px] sm:text-[32px] font-bold text-[#04330B] tracking-tight">
                {isHi ? "राजनीतिक संगठन एवं सार्वजनिक जवाबदेही" : "Political Organisation & Public Accountability"}
              </h2>
              <h3 className="font-['Familjen_Grotesk'] text-xl font-bold text-[#0D5229]">
                {isHi ? "एक वैकल्पिक राजनीतिक आवाज़" : "An Alternative Political Voice"}
              </h3>
              <div className="space-y-4 text-[16px] sm:text-[17px] leading-[1.75] text-[#2D3A31]">
                <p>{isHi
                  ? "पीपुल्स ग्रीन फंड, डॉ. सुधांशु द्वारा स्थापित इंडियन पीपुल्स ग्रीन पार्टी की राजनीतिक और संगठनात्मक गतिविधियों के लिए है।"
                  : "The People's Green Fund supports the political and organisational activities of the Indian Peoples Green Party, founded by Dr Sudhanshu."}</p>
                <p>{isHi
                  ? "हमारे कार्य के प्रमुख विषय हैं सार्वजनिक जवाबदेही, भ्रष्टाचार, प्रशासनिक मनमानी, भेदभावपूर्ण नीतियाँ तथा नागरिकों और सरकारी संस्थाओं के बीच संबंध।"
                  : "Our work focuses on issues of public accountability, corruption, arbitrary administrative decisions, discriminatory policies and the relationship between citizens and public institutions."}</p>
                <p>{isHi
                  ? "इन विषयों पर हमारा उद्देश्य राजनीतिक भागीदारी, नीतिगत अध्ययन, जनसंवाद और शांतिपूर्ण लोकतांत्रिक गतिविधियों के माध्यम से कार्य करना है।"
                  : "We seek to examine these issues through political participation, policy research, public dialogue and peaceful democratic activity."}</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-['Familjen_Grotesk'] text-xl font-bold text-[#04330B]">
                  {isHi ? "इस कोष का उपयोग" : "What This Fund Supports"}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {supports.map((item) => (
                    <article key={item.title} className="rounded-xl border border-[#DCEBE2] bg-[#F8FBF9] p-4">
                      <h4 className="font-bold text-[#0D5229]">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-[#587E67]">{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-['Familjen_Grotesk'] text-xl font-bold text-[#04330B]">
                  {isHi ? "कोष के बारे में" : "About the Fund"}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#2D3A31]">{isHi
                  ? "इस कोष में दिया गया योगदान संबंधित विधिक प्राप्तकर्ता संस्था को राजनीतिक योगदान होगा। इसका लेखा-जोखा ग्रीन फंड और लोकतंत्र फंड से अलग रखा जाएगा।"
                  : "Contributions to this fund are political contributions to the legally identified receiving organisation. They will be recorded separately from contributions to the Green Fund and Democracy Fund."}</p>
              </div>
            </div>

            {/* Contribution Callout Box */}
            <div className="rounded-2xl border border-[#C5DCCF] bg-[#F6FAF7] p-7 shadow-sm space-y-5 sticky top-28">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <HeartHandshake size={18} />
                <span>{isHi ? "पीपुल्स ग्रीन फंड" : "People's Green Fund"}</span>
              </div>
              <h3 className="font-['Familjen_Grotesk'] text-2xl font-bold text-[#04330B] leading-snug">
                {isHi ? "एक वैकल्पिक राजनीतिक आवाज़" : "An Alternative Political Voice"}
              </h3>
              <p className="text-sm text-[#587E67] leading-relaxed">
                {isHi ? "राजनीतिक भागीदारी, जनसंवाद और जवाबदेह शासन के लिए।" : "Political participation, public dialogue and accountable governance."}
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="h-12 w-full rounded-xl bg-[#04330B] font-['Familjen_Grotesk'] text-[16px] font-bold text-white shadow-md hover:bg-[#064e11] transition-all"
              >
                {isHi ? "पीपुल्स ग्रीन फंड में दान करें →" : "Donate to People's Green Fund →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Donation Modal */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultFund="peoples-green-fund"
      />
    </div>
  );
}

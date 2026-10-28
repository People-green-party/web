"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { useLanguage } from "../../../components/LanguageContext";
import { FUNDS_DATA } from "../../../data/fundsData";
import { DonationModal } from "../../../components/donation/DonationModal";
import { ArrowLeft, HeartHandshake } from "lucide-react";

export default function DemocracyFundPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const fund = FUNDS_DATA["democracy-fund"];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Top Breadcrumb */}
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
            {isHi ? "संवैधानिक अधिकार और जवाबदेही" : "Constitutional Rights & Accountability"}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#04330B] text-white py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            {/* Left Column */}
            <div className="space-y-4">
              <h1 className="font-['Familjen_Grotesk'] text-[32px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.1] tracking-tight">
                {isHi ? fund.heroHeading.hi : fund.heroHeading.en}
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-emerald-300">
                {isHi ? fund.heroSubheading.hi : fund.heroSubheading.en}
              </h2>
              <p className="text-white/80 text-[15px] sm:text-[16.5px] leading-relaxed max-w-xl">
                {isHi
                  ? "समानता, भ्रष्टाचार और सार्वजनिक जवाबदेही से जुड़े कानूनी अध्ययन और नागरिक पहलों के लिए।"
                  : "Legal research, civic initiatives and documented work on equality, corruption and public accountability."}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="h-12 px-7 rounded-xl bg-white font-['Familjen_Grotesk'] text-[16px] font-bold text-[#04330B] shadow-lg hover:bg-emerald-50 transition-all active:scale-[0.98]"
                >
                  {isHi ? "लोकतंत्र फंड में दान करें →" : "Contribute to Democracy Fund →"}
                </button>
                <Link
                  href="/donation"
                  className="h-12 px-6 rounded-xl border border-white/30 text-[14.5px] font-bold text-white hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  {isHi ? "अन्य कोष देखें" : "View All Funds"}
                </Link>
              </div>
            </div>

            {/* Right Column Cover Image */}
            <div className="relative rounded-[22px] overflow-hidden shadow-2xl border-2 border-white/15 aspect-[16/10] bg-black/30">
              <img
                src={fund.coverImage}
                alt="Indian national flag and people marching at India Gate"
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
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="font-['Familjen_Grotesk'] text-[26px] sm:text-[32px] font-bold text-[#04330B] tracking-tight">
                {isHi ? "संवैधानिक अधिकार और जवाबदेही" : "Constitutional Rights & Accountability"}
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[17px] leading-[1.75] text-[#2D3A31]">
                {(isHi ? fund.descriptionParagraphs.hi : fund.descriptionParagraphs.en).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

            </div>

            {/* Right Contribution Box */}
            <div className="rounded-2xl border border-[#C5DCCF] bg-[#F6FAF7] p-7 shadow-sm space-y-5 sticky top-28">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <HeartHandshake size={18} />
                <span>{isHi ? "लोकतंत्र फंड" : "Democracy Fund"}</span>
              </div>
              <h3 className="font-['Familjen_Grotesk'] text-2xl font-bold text-[#04330B] leading-snug">
                {isHi ? "संवैधानिक अधिकार और जवाबदेही" : "Constitutional Rights & Accountability"}
              </h3>
              <p className="text-sm text-[#587E67] leading-relaxed">
                {isHi
                  ? "समानता, भ्रष्टाचार और सार्वजनिक जवाबदेही से जुड़े कानूनी अध्ययन और नागरिक पहलों के लिए।"
                  : "Legal research, civic initiatives and documented work on equality, corruption and public accountability."}
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="h-12 w-full rounded-xl bg-[#04330B] font-['Familjen_Grotesk'] text-[16px] font-bold text-white shadow-md hover:bg-[#064e11] transition-all"
              >
                {isHi ? "लोकतंत्र फंड में योगदान करें →" : "Contribute to Democracy Fund →"}
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
        defaultFund="democracy-fund"
      />
    </div>
  );
}

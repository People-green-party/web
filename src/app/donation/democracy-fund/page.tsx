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
  const initiatives = isHi
    ? [
        { title: "01. नो-वीआईपी आंदोलन", paragraphs: ["विशेषाधिकारों, सार्वजनिक सेवाओं तक असमान पहुँच और कुछ व्यक्तियों को विशेष सुविधाएँ देने के लिए सार्वजनिक संसाधनों के उपयोग की समीक्षा करने की पहल।", "इस कार्यक्रम में समान व्यवहार, वैध आधिकारिक सुविधाओं तथा संबंधित कानूनों और प्रशासनिक नियमों का अध्ययन किया जाएगा।"] },
        { title: "02. भ्रष्टाचार की कहानियों की दीवार", paragraphs: ["भ्रष्टाचार और सार्वजनिक पद के दुरुपयोग से संबंधित अनुभवों तथा आरोपों को दस्तावेज़ों के साथ प्रस्तुत करने का सार्वजनिक मंच।", "प्रकाशन से पहले प्रत्येक प्रस्तुति की स्वतंत्र समीक्षा की जाएगी। आरोपों और प्रमाणित तथ्यों में स्पष्ट अंतर रखा जाएगा, संवेदनशील व्यक्तिगत जानकारी की सुरक्षा की जाएगी तथा संबंधित पक्षों को उपयुक्त अवसर दिया जाएगा।"] },
        { title: "03. धारा 17A और भ्रष्टाचार-निरोधक कानून", paragraphs: ["भ्रष्टाचार निवारण अधिनियम, 1988 की धारा 17A से संबंधित कानूनी अध्ययन। यह प्रावधान लोक सेवकों से संबंधित कुछ मामलों में जाँच से पहले अनुमति की व्यवस्था करता है।", "कार्यक्रम में मौजूदा संवैधानिक मुकदमों की स्थिति पर नज़र रखी जाएगी तथा कानून के अनुसार उपलब्ध उपायों और लंबित मामलों में संभावित हस्तक्षेप का परीक्षण किया जाएगा।"] },
        { title: "04. समानता एवं आर्थिक न्याय", paragraphs: ["सरकारी विवेकाधीन शक्तियों, सार्वजनिक सेवाओं तक निष्पक्ष पहुँच, सार्वजनिक धन के उपयोग, पारदर्शिता और आर्थिक समानता से संबंधित अध्ययन एवं जनसंवाद।"] },
        { title: "05. शांतिपूर्ण जनभागीदारी", paragraphs: ["प्रचलित कानूनी प्रावधानों के अनुसार जनसभाओं, सम्मेलनों, संवैधानिक जागरूकता कार्यक्रमों और शांतिपूर्ण मार्च का आयोजन।"] },
      ]
    : [
        { title: "01. No-VIP Movement", paragraphs: ["An initiative to examine preferential treatment, unequal access to public services and the use of public resources for special privileges.", "The programme will research laws, administrative rules and practices relating to equal treatment and legitimate official privileges."] },
        { title: "02. Wall of Corruption Stories", paragraphs: ["A public platform for submitting documented experiences and allegations concerning corruption and misuse of public office.", "Submissions will be independently reviewed before publication. The platform will distinguish allegations from established findings, protect sensitive personal information and provide appropriate opportunities for response."] },
        { title: "03. Section 17A and Anti-Corruption Law", paragraphs: ["Legal research concerning Section 17A of the Prevention of Corruption Act, 1988, which regulates prior approval for certain investigations involving public servants.", "The programme will track existing constitutional litigation and examine appropriate legal steps, including intervention in pending proceedings where legally permissible."] },
        { title: "04. Equality and Economic Justice", paragraphs: ["Research and public discussion on discretionary government powers, fair access to public services, public expenditure, transparency and economic equity."] },
        { title: "05. Peaceful Public Action", paragraphs: ["Public meetings, conferences, constitutional-awareness programmes and peaceful marches conducted in accordance with applicable legal requirements."] },
      ];

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
            {isHi ? "संवैधानिक अधिकार एवं सार्वजनिक जवाबदेही" : "Constitutional Rights & Public Accountability"}
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
              <p className="text-emerald-300 font-semibold text-lg sm:text-xl">
                {isHi ? fund.heroTagline.hi : fund.heroTagline.en}
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold text-white/95">
                {isHi ? fund.heroSubheading.hi : fund.heroSubheading.en}
              </h2>
              <p className="text-white/80 text-[15px] sm:text-[16.5px] leading-relaxed max-w-xl">
                {isHi ? fund.descriptionParagraphs.hi[0] : fund.descriptionParagraphs.en[0]}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="h-12 px-7 rounded-xl bg-white font-['Familjen_Grotesk'] text-[16px] font-bold text-[#04330B] shadow-lg hover:bg-emerald-50 transition-all active:scale-[0.98]"
                >
                  {isHi ? "योगदान करें →" : "Contribute →"}
                </button>
                <Link
                  href="#initiatives"
                  className="h-12 px-6 rounded-xl border border-white/30 text-[14.5px] font-bold text-white hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  {isHi ? "हमारी पहलें देखें" : "Explore the Initiatives"}
                </Link>
                <a href="#legal-updates" className="h-12 px-6 rounded-xl border border-white/30 text-[14.5px] font-bold text-white hover:bg-white/10 flex items-center justify-center transition-all">
                  {isHi ? "कानूनी अपडेट देखें" : "View Legal Updates"}
                </a>
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
                {isHi ? "समानता। जवाबदेही। संवैधानिक अधिकार।" : "Equality. Accountability. Constitutional Rights."}
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[17px] leading-[1.75] text-[#2D3A31]">
                {(isHi ? fund.descriptionParagraphs.hi : fund.descriptionParagraphs.en).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div id="initiatives" className="scroll-mt-28 space-y-4">
                <h3 className="font-['Familjen_Grotesk'] text-2xl font-bold text-[#04330B]">
                  {isHi ? "हमारी पाँच प्रमुख पहलें" : "Our Five Initiatives"}
                </h3>
                <div className="space-y-4">
                  {initiatives.map((initiative) => (
                    <article key={initiative.title} className="rounded-2xl border border-[#DCEBE2] bg-[#F8FBF9] p-5 sm:p-6">
                      <h4 className="font-['Familjen_Grotesk'] text-lg font-bold text-[#0D5229]">{initiative.title}</h4>
                      <div className="mt-2 space-y-2 text-[14px] sm:text-[15px] leading-relaxed text-[#2D3A31]">
                        {initiative.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div id="legal-updates" className="scroll-mt-28 space-y-3">
                <h3 className="font-['Familjen_Grotesk'] text-xl font-bold text-[#04330B]">
                  {isHi ? "कानूनी कार्य एवं सार्वजनिक जानकारी" : "Legal Work and Public Reporting"}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#2D3A31]">{isHi
                  ? "संबंधित न्यायिक कार्यवाहियों, शोध पत्रों, सार्वजनिक गतिविधियों और व्यय का सत्यापित विवरण प्रकाशित किया जाएगा।"
                  : "The programme will publish verified updates on relevant legal proceedings, research papers, public activities and expenditure."}</p>
                <p className="text-[15px] leading-relaxed text-[#2D3A31]">{isHi
                  ? "प्रस्तावित कानूनी कार्यवाहियों और न्यायालय में वास्तव में दायर मामलों को अलग-अलग दर्शाया जाएगा।"
                  : "Proposed legal proceedings will be identified separately from matters that have actually been filed before a court."}</p>
              </div>
            </div>

            {/* Right Contribution Box */}
            <div className="rounded-2xl border border-[#C5DCCF] bg-[#F6FAF7] p-7 shadow-sm space-y-5 sticky top-28">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <HeartHandshake size={18} />
                <span>{isHi ? "लोकतंत्र फंड" : "Democracy Fund"}</span>
              </div>
              <h3 className="font-['Familjen_Grotesk'] text-2xl font-bold text-[#04330B] leading-snug">
                {isHi ? "समानता। जवाबदेही। संवैधानिक अधिकार।" : "Equality. Accountability. Constitutional Rights."}
              </h3>
              <p className="text-sm text-[#587E67] leading-relaxed">
                {isHi
                  ? "जनहित से जुड़े कानूनी अध्ययन, संवैधानिक अधिकारों और नागरिक जागरूकता की पहल।"
                  : "Public-interest legal research, constitutional rights initiatives and civic education."}
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="h-12 w-full rounded-xl bg-[#04330B] font-['Familjen_Grotesk'] text-[16px] font-bold text-white shadow-md hover:bg-[#064e11] transition-all"
              >
                {isHi ? "योगदान करें →" : "Contribute →"}
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

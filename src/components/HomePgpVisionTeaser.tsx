"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import {
  pgpVisionGifts,
  pgpVisionMeta,
} from "@/data/pgpVisionContent";

export function HomePgpVisionTeaser() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const meta = isHi ? pgpVisionMeta.hi : pgpVisionMeta.en;

  return (
    <div className="w-full mb-[72px] lg:mb-[110px]">
      <div className="relative w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 md:-top-28 h-[440px] opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.10), transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center pt-3 md:pt-4">
          <ScrollReveal animation="fade-up" duration={800} className="w-full">
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[44px] lg:text-[64px] leading-[1.2] tracking-[-0.3px] text-[#04330B] max-w-4xl mx-auto px-2 pt-2">
              {meta.homeTitle}
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" duration={800} delay={120} className="w-full">
            <p className="mt-5 md:mt-6 font-['Familjen_Grotesk'] font-medium text-[16px] md:text-[18px] lg:text-[20px] leading-[1.65] text-[#587E67] max-w-[820px] mx-auto px-2">
              {meta.homeIntro}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="fade-up" duration={800} delay={200} className="w-full">
          <div className="mt-10 md:mt-14 max-w-[1100px] mx-auto">
            <div className="flex flex-col items-center text-center mb-6 md:mb-8">
              <h3 className="font-['Familjen_Grotesk'] font-semibold text-[20px] md:text-[24px] text-[#04330B]">
                {meta.giftsHeading}
              </h3>
              <p className="mt-2 font-['Familjen_Grotesk'] text-[14px] md:text-[15px] text-[#587E67] max-w-[640px]">
                {meta.giftsLead}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-y border-[#B9D3C4] divide-y sm:divide-y-0 sm:divide-x divide-[#B9D3C4]">
              {pgpVisionGifts.map((gift, idx) => {
                const copy = isHi ? gift.hi : gift.en;
                return (
                  <div
                    key={gift.id}
                    className="group flex flex-col items-center justify-start gap-3 px-4 py-7 md:py-8 text-center transition-colors duration-300 hover:bg-[#F1FBF6]"
                  >
                    <span className="font-['Familjen_Grotesk'] text-[12px] font-bold tracking-[0.2em] text-[#E85C2F]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] md:text-[17px] leading-snug text-[#04330B]">
                      {copy.title}
                    </p>
                    <p className="font-['Familjen_Grotesk'] text-[12px] md:text-[13px] text-[#587E67]">
                      {copy.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" duration={800} delay={280} className="w-full">
          <div className="mt-10 md:mt-12 flex justify-center">
            <Link
              href="/our-vision"
              className="group inline-flex items-center gap-2 px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
            >
              {meta.cta}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Clear separator before the next homepage block */}
      <div className="mt-14 lg:mt-20 mx-auto w-full max-w-[240px] border-t border-[#B9D3C4]" />
    </div>
  );
}

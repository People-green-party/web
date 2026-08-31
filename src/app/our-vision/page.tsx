"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import {
  pgpVisionGifts,
  pgpVisionIntro,
  pgpVisionMeta,
  pgpVisionSections,
} from "@/data/pgpVisionContent";

export default function OurVisionPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const meta = isHi ? pgpVisionMeta.hi : pgpVisionMeta.en;
  const intro = isHi ? pgpVisionIntro.hi : pgpVisionIntro.en;

  return (
    <div className="min-h-screen bg-[#F7FBF8] text-[#04330B]">
      <Navbar />

      <main className="pt-[90px]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#D7EBDF]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #04330B 0%, #0D5229 42%, #145C32 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(187,247,208,0.15), transparent 35%)",
            }}
          />
          <div className="relative z-10 max-w-[1100px] mx-auto px-4 py-14 md:py-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-['Familjen_Grotesk'] text-[14px] font-semibold mb-6"
            >
              <ArrowLeft size={16} />
              {meta.backHome}
            </Link>
            <p className="font-['Familjen_Grotesk'] text-[13px] md:text-[14px] font-bold tracking-[0.16em] uppercase text-[#BBF7D0] mb-3">
              {meta.brandLine}
            </p>
            <h1 className="font-['Familjen_Grotesk'] font-semibold text-[34px] md:text-[52px] lg:text-[60px] leading-[1.08] tracking-[-0.3px] text-white max-w-[900px]">
              {meta.pageTitle}
            </h1>
            <p className="mt-5 font-['Familjen_Grotesk'] text-[16px] md:text-[18px] leading-relaxed text-white/85 max-w-[820px]">
              {meta.readSections}
            </p>
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-4 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
          {/* TOC — pinned; page content scrolls */}
          <aside className="lg:relative">
            <div className="lg:sticky lg:top-[102px] lg:self-start">
              <p className="font-['Familjen_Grotesk'] text-[12px] font-bold tracking-[0.12em] uppercase text-[#587E67] mb-3">
                {meta.tocTitle}
              </p>
              <nav className="flex flex-col gap-1 rounded-[14px] border border-[#D7EBDF] bg-white p-3">
                <a
                  href="#intro"
                  className="rounded-[8px] px-3 py-2 text-[14px] font-['Familjen_Grotesk'] font-semibold text-[#04330B] hover:bg-[#F1FBF6]"
                >
                  {isHi ? "परिचय" : "Introduction"}
                </a>
                <a
                  href="#gifts"
                  className="rounded-[8px] px-3 py-2 text-[14px] font-['Familjen_Grotesk'] font-semibold text-[#04330B] hover:bg-[#F1FBF6]"
                >
                  {meta.giftsHeading}
                </a>
                {pgpVisionSections.map((section) => {
                  const title = isHi ? section.hi.title : section.en.title;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-[8px] px-3 py-2 text-[14px] font-['Familjen_Grotesk'] font-semibold text-[#04330B] hover:bg-[#F1FBF6]"
                    >
                      {title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 space-y-10 md:space-y-12">
            <ScrollReveal animation="fade-up">
              <section
                id="intro"
                className="rounded-[16px] border border-[#D7EBDF] bg-white px-5 py-7 md:px-8 md:py-9 scroll-mt-[110px]"
              >
                {intro.map((p, i) => (
                  <p
                    key={i}
                    className="font-['Familjen_Grotesk'] text-[16px] md:text-[18px] leading-[1.75] text-[#234832] mb-4 last:mb-0"
                  >
                    {p}
                  </p>
                ))}
              </section>
            </ScrollReveal>

            <ScrollReveal animation="fade-up">
              <section
                id="gifts"
                className="rounded-[16px] border border-[#D7EBDF] bg-white px-5 py-7 md:px-8 md:py-9 scroll-mt-[110px]"
              >
                <h2 className="font-['Familjen_Grotesk'] font-semibold text-[26px] md:text-[32px] text-[#04330B] mb-3">
                  {meta.giftsHeading}
                </h2>
                <p className="font-['Familjen_Grotesk'] text-[16px] md:text-[17px] leading-relaxed text-[#3F6B50] mb-6">
                  {meta.giftsLead}
                </p>
                <ol className="space-y-3">
                  {pgpVisionGifts.map((gift, idx) => {
                    const copy = isHi ? gift.hi : gift.en;
                    return (
                      <li
                        key={gift.id}
                        className="flex items-start gap-3 rounded-[12px] border border-[#E4F2EA] bg-[#F8FCF9] px-4 py-3"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#04330B] text-white text-[13px] font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#04330B]">
                            {copy.title}
                            <span className="font-medium text-[#587E67]">
                              {" "}
                              {isHi ? "यानी" : "—"} {copy.subtitle}
                            </span>
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            </ScrollReveal>

            {pgpVisionSections.map((section) => {
              const copy = isHi ? section.hi : section.en;
              return (
                <ScrollReveal key={section.id} animation="fade-up">
                  <section
                    id={section.id}
                    className="rounded-[16px] border border-[#D7EBDF] bg-white px-5 py-7 md:px-8 md:py-9 scroll-mt-[110px]"
                  >
                    <h2 className="font-['Familjen_Grotesk'] font-semibold text-[26px] md:text-[32px] text-[#04330B] mb-5">
                      {copy.title}
                    </h2>
                    {copy.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className="font-['Familjen_Grotesk'] text-[16px] md:text-[17px] leading-[1.8] text-[#234832] mb-4 last:mb-0"
                      >
                        {p}
                      </p>
                    ))}
                    {copy.bullets && copy.bullets.length > 0 && (
                      <ul className="mt-2 space-y-3">
                        {copy.bullets.map((b, i) => (
                          <li
                            key={i}
                            className="flex gap-3 font-['Familjen_Grotesk'] text-[16px] md:text-[17px] leading-[1.75] text-[#234832]"
                          >
                            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D5229]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </ScrollReveal>
              );
            })}

            <div className="flex justify-center pt-2 pb-6">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 px-[28px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
              >
                {isHi ? "पार्टी से जुड़ें" : "Join the Party"}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

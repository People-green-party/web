"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export type HomeProgramCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  /** Dark hero assets (union / jinda) need a matching fill behind transparent edges */
  tone?: "dark" | "light";
  objectFit?: "cover" | "contain";
};

type Props = {
  title: string;
  subtitle: string;
  cards: HomeProgramCard[];
};

export function HomeProgramsSection({ title, subtitle, cards }: Props) {
  return (
    <section className="w-full bg-white py-[60px] lg:py-[100px]">
      <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center text-center gap-3 mb-10 lg:mb-14">
          <ScrollReveal animation="fade-up" duration={800}>
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[40px] lg:text-[56px] leading-[1.1] tracking-[-0.3px] text-[#04330B]">
              {title}
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={120}>
            <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[26px] tracking-[-0.3px] text-[#587E67] max-w-2xl">
              {subtitle}
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {cards.map((card, i) => (
            <ScrollReveal key={card.href} animation="fade-up" duration={800} delay={i * 120}>
              <Link
                href={card.href}
                className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[#B9D3C4] bg-white transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className={`relative aspect-[5/4] w-full overflow-hidden ${
                    card.tone === "dark" ? "bg-[#032115]" : "bg-[#EAF7EE]"
                  }`}
                >
                  <div
                    className={
                      card.objectFit === "contain"
                        ? "absolute inset-[18px] sm:inset-6"
                        : "absolute inset-0"
                    }
                  >
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className={`h-full w-full max-w-none ${
                        card.objectFit === "contain"
                          ? "object-contain object-center"
                          : "object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      }`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                  <h3 className="font-['Familjen_Grotesk'] font-semibold text-[22px] lg:text-[24px] leading-tight tracking-[-0.3px] text-[#04330B]">
                    {card.title}
                  </h3>
                  <p className="font-['Familjen_Grotesk'] font-medium text-[15px] lg:text-[16px] leading-[24px] text-[#587E67] line-clamp-3">
                    {card.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-['Familjen_Grotesk'] font-semibold text-[15px] text-[#0D5229] group-hover:gap-3 transition-all">
                    {card.cta}
                    <ArrowRight size={18} className="shrink-0" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

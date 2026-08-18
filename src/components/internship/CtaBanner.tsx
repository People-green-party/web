"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { InternshipImage } from "./InternshipImage";

type Props = {
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  image?: string;
  points?: string[];
};

export function CtaBanner({
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  image,
  points,
}: Props) {
  return (
    <article className="relative overflow-hidden rounded-[20px] min-h-[300px] flex items-stretch bg-[#04330B]">
      {image ? (
        <InternshipImage
          src={image}
          alt=""
          sizes="100vw"
          className="object-cover opacity-35"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04330B] via-[#04330B]/90 to-[#04330B]/55" />

      <div className="relative z-10 p-8 sm:p-10 lg:p-12 flex flex-col justify-center max-w-2xl">
        {points?.length ? (
          <div className="mb-4 inline-flex items-center gap-2 self-start rounded-[8px] bg-white/10 border border-white/20 px-3 py-1.5">
            <Award size={16} className="text-white" />
            <span className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-white/90">
              {points.join(" · ")}
            </span>
          </div>
        ) : null}
        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.15] tracking-[-0.3px] text-white">
          {title}
        </h3>
        <p className="mt-3 font-['Familjen_Grotesk'] font-medium text-[15px] lg:text-[16px] leading-relaxed text-white/85">
          {subtitle}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 px-[32px] py-[12px] bg-white hover:bg-[#EAF7EE] text-[#04330B] rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors duration-300 shadow-xl"
          >
            {primaryLabel} <ArrowRight size={18} />
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 px-[28px] py-[12px] border border-white/40 text-white hover:bg-white/10 rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors duration-300"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

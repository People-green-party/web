"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { AcademyImage } from "./AcademyImage";

type Props = {
  title: string;
  icon: LucideIcon;
  image: string;
  points: string[];
};

export function ComparisonCard({ title, icon: Icon, image, points }: Props) {
  return (
    <article className="group h-full bg-white rounded-[20px] border border-[#B9D3C4] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(13,82,41,0.15)] hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden">
        <AcademyImage
          src={image}
          alt={title}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04330B]/80 via-[#04330B]/20 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/95 text-[#0D5229] flex items-center justify-center">
            <Icon size={22} strokeWidth={2} />
          </div>
          <h3 className="font-['Familjen_Grotesk'] font-semibold text-[22px] text-white tracking-[-0.3px]">
            {title}
          </h3>
        </div>
      </div>
      <ul className="p-6 sm:p-8 space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 font-['Familjen_Grotesk'] font-medium text-[15px] leading-relaxed text-[#587E67]"
          >
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0D5229] shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
}

"use client";

import React from "react";
import { AcademyImage } from "./AcademyImage";

type Props = {
  title: string;
  description: string;
  image: string;
  points: string[];
};

export function CertificateCard({ title, description, image, points }: Props) {
  return (
    <article className="h-full bg-white rounded-[20px] border border-[#B9D3C4] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="p-6 sm:p-8">
        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[28px] lg:text-[32px] leading-[1.15] tracking-[-0.3px] text-[#04330B]">
          {title}
        </h3>
        <p className="mt-3 font-['Familjen_Grotesk'] font-medium text-[15px] lg:text-[16px] leading-relaxed text-[#587E67]">
          {description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {points.map((point) => (
            <li
              key={point}
              className="font-['Familjen_Grotesk'] text-[12px] font-bold px-3 py-1.5 rounded-[8px] bg-[#EAF7EE] text-[#0D5229] border border-[#E4F2EA]"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
        <div className="relative rounded-[12px] overflow-hidden border border-[#E4F2EA] shadow-md aspect-[16/10]">
          <AcademyImage src={image} alt={title} sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      </div>
    </article>
  );
}

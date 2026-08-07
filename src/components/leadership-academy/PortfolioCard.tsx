"use client";

import React from "react";
import { AcademyImage } from "./AcademyImage";

type Props = {
  image: string;
  title: string;
  description: string;
};

export function PortfolioCard({ image, title, description }: Props) {
  return (
    <article className="group relative rounded-[16px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white border border-[#B9D3C4]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <AcademyImage
          src={image}
          alt={title}
          sizes="(max-width: 768px) 50vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="absolute bottom-[12px] left-[50%] translate-x-[-50%] w-[90%] min-h-[64px] bg-white rounded-[12px] px-2.5 py-2.5 shadow-xl border border-[#B9D3C4] flex flex-col items-center justify-center transition-all duration-500 group-hover:bottom-[16px]">
        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[12px] sm:text-[13px] leading-tight text-center text-[#04330B] whitespace-nowrap overflow-hidden text-ellipsis w-full">
          {title}
        </h3>
        <p className="mt-1 font-['Familjen_Grotesk'] text-[10px] sm:text-[11px] leading-tight text-center text-[#587E67] whitespace-nowrap overflow-hidden text-ellipsis w-full">
          {description}
        </p>
      </div>
    </article>
  );
}

"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { InternshipImage } from "./InternshipImage";

type Props = {
  image: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ image, icon: Icon, title, description }: Props) {
  return (
    <article className="group relative h-full bg-white rounded-[20px] border border-[#B9D3C4] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(13,82,41,0.15)] hover:-translate-y-1">
      <div className="relative aspect-[5/4] overflow-hidden">
        <InternshipImage
          src={image}
          alt={title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5 lg:p-6">
        <div className="w-11 h-11 mb-4 rounded-xl bg-[#F8FBF9] border border-[#E4F2EA] flex items-center justify-center text-[#0D5229] group-hover:bg-[#0D5229] group-hover:text-white transition-colors duration-300">
          <Icon size={20} strokeWidth={2} />
        </div>
        <h3 className="font-['Familjen_Grotesk'] font-semibold text-[18px] leading-[1.3] text-[#04330B]">
          {title}
        </h3>
        <p className="mt-2 font-['Familjen_Grotesk'] font-medium text-[14px] lg:text-[15px] leading-relaxed text-[#587E67]">
          {description}
        </p>
      </div>
    </article>
  );
}

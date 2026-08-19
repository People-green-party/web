"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { InternshipImage } from "./InternshipImage";

type Skill = {
  label: string;
  icon: LucideIcon;
  image?: string;
};

type Props = {
  skills: Skill[];
};

export function SkillsGrid({ skills }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
      {skills.map(({ label, icon: Icon, image }) => (
        <div
          key={label}
          className="group flex flex-col rounded-[16px] border border-[#B9D3C4] bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          {image ? (
            <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF7EE]">
              <InternshipImage
                src={image}
                alt={label}
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04330B]/35 to-transparent" />
              <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 border border-white text-[#0D5229] flex items-center justify-center shadow-sm">
                <Icon size={18} strokeWidth={1.8} />
              </div>
            </div>
          ) : (
            <div className="pt-6 flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-[#F8FBF9] border border-[#E4F2EA] flex items-center justify-center text-[#0D5229] group-hover:bg-[#0D5229] group-hover:text-white transition-colors duration-300">
                <Icon size={22} strokeWidth={1.8} />
              </div>
            </div>
          )}
          <p className="px-4 py-4 text-center font-['Familjen_Grotesk'] font-semibold text-[15px] text-[#04330B]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

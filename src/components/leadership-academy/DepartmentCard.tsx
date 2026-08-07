"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AcademyImage } from "./AcademyImage";

type Props = {
  number: number;
  name: string;
  description: string;
  image: string;
  href: string;
  skills?: string[];
  viewDetailsLabel?: string;
  departmentLabel?: string;
};

export function DepartmentCard({
  number,
  name,
  description,
  image,
  href,
  viewDetailsLabel = "View Details",
  departmentLabel,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex flex-col sm:flex-row bg-white rounded-[16px] border border-[#B9D3C4] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative sm:w-[40%] aspect-[16/11] sm:aspect-auto sm:min-h-[170px] overflow-hidden bg-[#EAF7EE]">
        <AcademyImage
          src={image}
          alt={name}
          sizes="(max-width: 640px) 100vw, 40vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
        <p className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#0D5229]">
          {departmentLabel || `Department ${number}`}
        </p>
        <h3 className="mt-1 font-['Familjen_Grotesk'] font-semibold text-[18px] lg:text-[20px] leading-[1.25] tracking-[-0.3px] text-[#04330B]">
          {name}
        </h3>
        <p className="mt-2 font-['Familjen_Grotesk'] font-medium text-[14px] lg:text-[15px] leading-relaxed text-[#587E67] line-clamp-4 min-h-[4.5rem]">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-['Familjen_Grotesk'] text-[14px] font-bold text-[#04330B] group-hover:text-[#0D5229] transition-colors">
          {viewDetailsLabel} <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}

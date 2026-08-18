"use client";

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: "center" | "left";
  className?: string;
  /** Slightly smaller type — useful for longer Hindi headings. */
  compact?: boolean;
};

export function SectionHeading({
  title,
  subtitle,
  light = false,
  align = "center",
  className = "",
  compact = false,
}: Props) {
  return (
    <div
      className={`flex flex-col gap-[16px] ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      <h2
        className={`font-['Familjen_Grotesk'] font-semibold leading-[1.15] tracking-[-0.3px] ${
          compact
            ? "text-[28px] md:text-[36px] lg:text-[44px]"
            : "text-[32px] md:text-[40px] lg:text-[56px] leading-[1.1]"
        } ${light ? "text-white" : "text-[#04330B]"}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`font-['Familjen_Grotesk'] font-medium leading-[1.5] tracking-[-0.3px] max-w-[800px] ${
            compact ? "text-[15px] lg:text-[18px]" : "text-[16px] lg:text-[20px]"
          } ${light ? "text-white/85" : "text-[#587E67]"}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

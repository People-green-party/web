"use client";

import React, { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { InternshipImage } from "./InternshipImage";

type Step = {
  num: number;
  title: string;
  blurb: string;
  week: string;
  icon: LucideIcon;
  image?: string;
};

type Props = {
  steps: Step[];
  labels?: {
    stepOf?: string;
    previous?: string;
    next?: string;
  };
};

export function JourneyTimeline({ steps, labels }: Props) {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const skipScrollRef = useRef(true);
  const ActiveIcon = steps[active]?.icon;
  const activeImage = steps[active]?.image;

  const stepOfTemplate = labels?.stepOf || "Step {current} of {total}";
  const previousLabel = labels?.previous || "Previous";
  const nextLabel = labels?.next || "Next step";

  useEffect(() => {
    // Don't scroll the page on first mount (navbar → Internships was jumping to this section)
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    const el = cardRefs.current[active];
    const strip = stripRef.current;
    if (!el || !strip) return;
    const left = el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  return (
    <div className="rounded-[20px] border border-[#B9D3C4] bg-white shadow-sm overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center rounded-[8px] bg-[#EAF7EE] border border-[#E4F2EA] px-3 py-1.5 font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#0D5229]">
              {steps[active]?.week}
            </span>
            <span className="font-['Familjen_Grotesk'] text-[13px] font-semibold text-[#587E67]">
              {stepOfTemplate
                .replace("{current}", String(active + 1))
                .replace("{total}", String(steps.length))}
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#EAF7EE] overflow-hidden mb-8">
            <div
              className="h-full rounded-full bg-[#0D5229] transition-all duration-500"
              style={{ width: `${((active + 1) / steps.length) * 100}%` }}
            />
          </div>

          <p className="font-['Familjen_Grotesk'] font-bold text-[48px] lg:text-[64px] leading-none tracking-tight text-[#EAF7EE]">
            {String(steps[active]?.num).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-['Familjen_Grotesk'] font-semibold text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.15] tracking-[-0.3px] text-[#04330B]">
            {steps[active]?.title}
          </h3>
          <p className="mt-4 max-w-xl font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[18px] leading-relaxed text-[#587E67]">
            {steps[active]?.blurb}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              disabled={active === 0}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[8px] border border-[#E4F2EA] text-[#04330B] font-['Familjen_Grotesk'] font-semibold text-[14px] hover:bg-[#EAF7EE] disabled:opacity-35 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft size={16} /> {previousLabel}
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => Math.min(steps.length - 1, i + 1))}
              disabled={active === steps.length - 1}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[8px] bg-[#04330B] hover:bg-[#0D5229] text-white font-['Familjen_Grotesk'] font-semibold text-[14px] disabled:opacity-35 disabled:pointer-events-none transition-colors shadow-md"
            >
              {nextLabel} <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative min-h-[260px] lg:min-h-full bg-white overflow-hidden">
          {activeImage ? (
            <>
              <InternshipImage
                key={activeImage}
                src={activeImage}
                alt={steps[active]?.title || ""}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04330B]/70 via-[#04330B]/15 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white text-[#0D5229] flex items-center justify-center shadow-md">
                  {ActiveIcon ? <ActiveIcon size={22} strokeWidth={1.8} /> : null}
                </div>
                <p className="font-['Familjen_Grotesk'] font-semibold text-[15px] text-white leading-snug">
                  {steps[active]?.title}
                </p>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-[20px] bg-white border border-[#E4F2EA] shadow-md flex items-center justify-center text-[#0D5229]">
                {ActiveIcon ? <ActiveIcon size={44} strokeWidth={1.6} /> : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        ref={stripRef}
        className="flex gap-3 overflow-x-auto p-4 sm:p-5 border-t border-gray-100 bg-white"
        style={{ scrollbarWidth: "none" }}
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === active;
          return (
            <button
              key={step.num}
              type="button"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => setActive(i)}
              className={`shrink-0 w-[150px] sm:w-[160px] rounded-[12px] border p-3.5 text-left transition-all duration-300 font-['Familjen_Grotesk'] ${
                isActive
                  ? "bg-[#04330B] border-[#04330B] text-white shadow-md"
                  : "bg-white border-[#B9D3C4] text-[#04330B] hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold tracking-wider ${
                    isActive ? "text-white/70" : "text-[#0D5229]"
                  }`}
                >
                  {String(step.num).padStart(2, "0")}
                </span>
                <Icon size={16} className={isActive ? "text-white/80" : "text-[#587E67]"} />
              </div>
              <p className={`text-[13px] font-semibold leading-snug ${isActive ? "text-white" : "text-[#04330B]"}`}>
                {step.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

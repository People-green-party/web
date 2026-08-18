"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

type Item = { q: string; a: string };

type Props = {
  items: Item[];
};

export function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="rounded-[16px] border border-[#B9D3C4] bg-white overflow-hidden transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[18px] text-[#04330B] tracking-[-0.3px]">
                {item.q}
              </span>
              <span className="shrink-0 w-10 h-10 rounded-[8px] bg-[#EAF7EE] border border-[#E4F2EA] text-[#0D5229] flex items-center justify-center">
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 sm:px-6 pb-5 font-['Familjen_Grotesk'] font-medium text-[15px] lg:text-[16px] leading-relaxed text-[#587E67]">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

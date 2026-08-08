"use client";

import React from "react";

export function HeroShield() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:ml-auto">
      <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(0,217,95,0.28)_0%,transparent_65%)] blur-2xl" />

      <div className="relative">
        <div className="relative rounded-[22px] overflow-hidden aspect-[5/4] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <img
            src="/leadership-academy/hero-students.jpg"
            alt="Students collaborating at PGP Internship"
            className="w-full h-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#041E14]/45 via-transparent to-transparent" />
        </div>

        <div className="absolute -right-1 sm:-right-3 top-[18%] w-[34%] max-w-[150px]">
          <div className="absolute inset-0 rounded-full bg-[#00D95F]/40 blur-2xl scale-110" />
          <svg
            viewBox="0 0 200 240"
            className="relative w-full drop-shadow-[0_0_28px_rgba(0,217,95,0.7)]"
            aria-hidden
          >
            <defs>
              <linearGradient id="laShieldStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9CFFC8" />
                <stop offset="100%" stopColor="#00D95F" />
              </linearGradient>
              <linearGradient id="laShieldFill" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="rgba(0,217,95,0.3)" />
                <stop offset="100%" stopColor="rgba(4,30,20,0.65)" />
              </linearGradient>
            </defs>
            <path
              d="M100 12 C140 28 168 32 184 36 C184 110 168 170 100 228 C32 170 16 110 16 36 C32 32 60 28 100 12 Z"
              fill="url(#laShieldFill)"
              stroke="url(#laShieldStroke)"
              strokeWidth="5"
            />
            <circle cx="100" cy="88" r="15" fill="#00D95F" />
            <circle cx="70" cy="96" r="11" fill="#00D95F" opacity="0.85" />
            <circle cx="130" cy="96" r="11" fill="#00D95F" opacity="0.85" />
            <path d="M72 148 C72 128 86 118 100 118 C114 118 128 128 128 148 Z" fill="#00D95F" />
            <path d="M44 156 C44 140 55 132 68 132 C77 132 85 138 87 147" fill="#00D95F" opacity="0.85" />
            <path d="M156 156 C156 140 145 132 132 132 C123 132 115 138 113 147" fill="#00D95F" opacity="0.85" />
          </svg>
        </div>

        <span className="absolute top-[10%] left-[6%] w-2 h-2 rounded-full bg-[#00D95F] shadow-[0_0_12px_#00D95F]" />
        <span className="absolute bottom-[18%] left-[10%] w-1.5 h-1.5 rounded-full bg-[#00D95F]/80" />
        <span className="absolute top-[8%] right-[30%] w-1.5 h-1.5 rounded-full bg-[#00D95F]/70" />
      </div>
    </div>
  );
}

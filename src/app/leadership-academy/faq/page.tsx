"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { SectionHeading } from "@/components/leadership-academy/SectionHeading";
import { FaqAccordion } from "@/components/leadership-academy/FaqAccordion";
import { CtaBanner } from "@/components/leadership-academy/CtaBanner";
import { DEPARTMENTS } from "@/data/leadership-academy/departments";
import { getAcademyI18n } from "@/data/leadership-academy/i18n";
import { useLanguage } from "@/components/LanguageContext";

export default function LeadershipAcademyFaqPage() {
  const { language } = useLanguage();
  const t = getAcademyI18n(language);
  const f = t.faqPage;

  return (
    <AcademyShell>
      <section className="bg-white w-full flex justify-center pt-[40px] lg:pt-[70px] pb-[40px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <p className="font-['Familjen_Grotesk'] text-[12px] lg:text-[14px] font-bold uppercase tracking-wider text-[#E85C2F]">
            {f.tag}
          </p>
          <h1 className="mt-3 font-['Familjen_Grotesk'] font-semibold text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.3px] text-[#04330B]">
            {f.title}
          </h1>
          <p className="mt-4 max-w-2xl font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[18px] text-[#587E67]">
            {f.intro}
          </p>
        </div>
      </section>

      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[880px] px-4 lg:px-8">
          <SectionHeading title={f.sectionTitle} className="mb-[40px]" />
          <FaqAccordion items={[...t.faqs]} />
        </div>
      </section>

      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <SectionHeading title={f.deptTitle} subtitle={f.deptSubtitle} className="mb-[40px]" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.slug}
                href={`/leadership-academy/${dept.slug}`}
                className="rounded-[16px] border border-[#B9D3C4] bg-white p-5 hover:shadow-lg transition-all font-['Familjen_Grotesk']"
              >
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#0D5229]">
                  {t.departments.departmentLabel.replace("{n}", String(dept.number))}
                </p>
                <p className="mt-1 text-[18px] font-semibold text-[#04330B]">
                  {t.deptNames[dept.slug].name}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-bold text-[#04330B]">
                  {f.viewDetails} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white w-full flex justify-center pb-[60px] lg:pb-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <CtaBanner
            title={f.ctaTitle}
            subtitle={f.ctaSubtitle}
            primaryHref="/leadership-academy/apply"
            primaryLabel={f.apply}
            secondaryHref="/leadership-academy"
            secondaryLabel={f.back}
          />
        </div>
      </section>
    </AcademyShell>
  );
}

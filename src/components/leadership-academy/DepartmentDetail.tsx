"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Department } from "@/data/leadership-academy/types";
import { getAcademyI18n } from "@/data/leadership-academy/i18n";
import { localizeDepartment } from "@/data/leadership-academy/localize-department";
import { useLanguage } from "@/components/LanguageContext";
import { AcademyShell } from "./AcademyShell";
import { SectionHeading } from "./SectionHeading";
import { FaqAccordion } from "./FaqAccordion";
import { CtaBanner } from "./CtaBanner";
import { AcademyImage } from "./AcademyImage";

type Props = {
  department: Department;
};

export function DepartmentDetail({ department }: Props) {
  const { language } = useLanguage();
  const t = getAcademyI18n(language);
  const d = t.deptPage;
  const localized = t.deptNames[department.slug];
  const content = localizeDepartment(department, language);
  const [mode, setMode] = useState<"offline" | "hybrid">("offline");
  const milestones = mode === "offline" ? content.offline : content.hybrid;
  const displayName = localized.name;
  const displayShort = localized.shortName;
  const displayDescription = localized.description;
  const displayOverview = content.overview;
  const isHi = language === "hi";

  return (
    <AcademyShell>
      {/* HERO */}
      <section className="bg-white w-full flex justify-center pt-[40px] lg:pt-[70px] pb-[50px] lg:pb-[80px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <nav className="flex items-center gap-1.5 font-['Familjen_Grotesk'] text-[14px] font-medium text-[#587E67] mb-6">
            <Link href="/leadership-academy" className="hover:text-[#04330B] transition-colors">
              {d.breadcrumb}
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#04330B]">{displayShort}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="font-['Familjen_Grotesk'] text-[12px] lg:text-[14px] font-bold uppercase tracking-wider text-[#E85C2F]">
                {d.department.replace("{n}", String(department.number).padStart(2, "0"))}
              </p>
              <h1
                className={`mt-3 font-['Familjen_Grotesk'] font-semibold leading-[1.15] tracking-[-0.3px] text-[#04330B] ${
                  isHi
                    ? "text-[30px] md:text-[40px] lg:text-[48px]"
                    : "text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1]"
                }`}
              >
                {displayName}
              </h1>
              <p className="mt-5 font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[18px] leading-relaxed text-[#587E67] max-w-xl">
                {displayOverview}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-['Familjen_Grotesk'] text-[12px] font-bold px-3 py-1.5 rounded-[8px] bg-[#EAF7EE] text-[#0D5229] border border-[#E4F2EA]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/leadership-academy/apply?department=${department.slug}`}
                  className="inline-flex items-center gap-2 px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
                >
                  {d.apply} <ArrowRight size={18} />
                </Link>
                <Link
                  href="/leadership-academy#departments"
                  className="inline-flex items-center gap-2 px-[28px] py-[12px] border border-[#E4F2EA] text-[#04330B] hover:bg-[#EAF7EE] rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors"
                >
                  {d.allDepartments}
                </Link>
              </div>
            </div>

            <div className="relative rounded-[16px] overflow-hidden shadow-xl border border-[#B9D3C4] aspect-[5/4]">
              <AcademyImage
                src={department.image}
                alt={displayName}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading title={d.whatYoullDo} align="left" compact={isHi} />
              <p className="mt-6 font-['Familjen_Grotesk'] font-semibold text-[18px] lg:text-[20px] leading-snug text-[#04330B]">
                {displayDescription}
              </p>
              <p className="mt-4 font-['Familjen_Grotesk'] font-medium text-[16px] leading-relaxed text-[#587E67]">
                {d.aboutSupport}
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[20px] border border-[#B9D3C4] p-6 sm:p-8">
                <h3 className="font-['Familjen_Grotesk'] font-semibold text-[22px] text-[#04330B] mb-6">
                  {d.objectives}
                </h3>
                <ol className="space-y-5">
                  {content.objectives.map((obj, i) => (
                    <li key={obj} className="flex gap-4">
                      <span className="font-['Inter'] font-bold text-[20px] text-[#0D5229] leading-none pt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-['Familjen_Grotesk'] font-medium text-[15px] lg:text-[16px] leading-relaxed text-[#587E67]">
                        {obj}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <SectionHeading
            title={d.skillsTitle}
            subtitle={d.skillsSubtitle}
            className="mb-[50px]"
            compact={isHi}
          />
          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { label: d.professional, items: content.professionalSkills },
              { label: d.technical, items: content.technicalSkills },
              { label: d.workplace, items: content.workplaceSkills },
            ].map((group) => (
              <div
                key={group.label}
                className="rounded-[20px] border border-[#B9D3C4] bg-white p-6 sm:p-8"
              >
                <h3 className="font-['Familjen_Grotesk'] font-semibold text-[18px] text-[#04330B] mb-4">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-['Familjen_Grotesk'] text-[13px] font-semibold px-3 py-2 rounded-[8px] bg-white text-[#0D5229] border border-[#E4F2EA]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME STRUCTURE */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[880px] px-4 lg:px-8">
          <SectionHeading title={d.programmeStructure} className="mb-[40px]" compact={isHi} />
          <div className="space-y-3">
            {content.programmeStructure.map((step, i) => (
              <div
                key={step}
                className="flex gap-4 items-start rounded-[16px] bg-white border border-[#B9D3C4] px-5 py-5"
              >
                <span className="shrink-0 w-10 h-10 rounded-[8px] bg-[#04330B] text-white font-['Familjen_Grotesk'] font-bold text-[14px] flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="pt-2 font-['Familjen_Grotesk'] font-semibold text-[15px] lg:text-[16px] text-[#04330B] leading-snug">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MILESTONES */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1100px] px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
            <SectionHeading
              title={d.milestonesTitle}
              subtitle={d.milestonesSubtitle}
              align="left"
              compact={isHi}
            />
            <div className="inline-flex p-1 rounded-[8px] bg-[#EAF7EE] border border-[#E4F2EA] self-start">
              {(["offline", "hybrid"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className={`px-4 py-2 rounded-[6px] text-[13px] font-['Familjen_Grotesk'] font-bold transition-all ${
                    mode === key
                      ? "bg-[#04330B] text-white shadow-sm"
                      : "text-[#0D5229] hover:bg-white"
                  }`}
                >
                  {key === "offline" ? d.offline : d.hybrid}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((m, i) => (
              <article
                key={`${mode}-${m.title}`}
                className="rounded-[20px] border border-[#B9D3C4] bg-white p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#0D5229]">
                    {d.milestone.replace("{n}", String(i + 1))}
                  </span>
                  <span className="font-['Familjen_Grotesk'] text-[12px] font-bold px-2.5 py-1 rounded-[8px] bg-white border border-[#E4F2EA] text-[#04330B]">
                    {m.hours}
                  </span>
                </div>
                <h3 className="font-['Familjen_Grotesk'] font-semibold text-[20px] lg:text-[22px] text-[#04330B] tracking-[-0.3px]">
                  {m.title.replace(/^Milestone \d+ — /, "")}
                </h3>
                <div className="mt-5 grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#587E67] mb-2">
                      {d.activities}
                    </p>
                    <ul className="space-y-2">
                      {m.activities.map((a) => (
                        <li key={a} className="font-['Familjen_Grotesk'] text-[14px] font-medium text-[#587E67]">
                          – {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#587E67] mb-2">
                      {d.youDeliver}
                    </p>
                    <ul className="space-y-2">
                      {m.deliverables.map((item) => (
                        <li key={item} className="font-['Familjen_Grotesk'] text-[14px] font-semibold text-[#04330B]">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES + SUCCESS */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-[20px] bg-white border border-[#B9D3C4] p-7 sm:p-9">
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[24px] sm:text-[28px] text-[#04330B] tracking-[-0.3px]">
                {d.learningOutcomes}
              </h2>
              <ul className="mt-6 space-y-4">
                {content.learningOutcomes.map((item, i) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-['Inter'] font-bold text-[18px] text-[#0D5229] shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-['Familjen_Grotesk'] font-medium text-[15px] lg:text-[16px] text-[#587E67] leading-snug">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[20px] bg-[#04330B] p-7 sm:p-9 text-white">
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[24px] sm:text-[28px] tracking-[-0.3px]">
                {d.successMetrics}
              </h2>
              <p className="mt-2 font-['Familjen_Grotesk'] text-[14px] text-white/70">
                {d.successIntro}
              </p>
              <ul className="mt-6 space-y-3">
                {content.successMetrics.map((item) => (
                  <li key={item} className="flex gap-3 font-['Familjen_Grotesk'] text-[15px] font-medium text-white/90">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <SectionHeading
            title={d.portfolioTitle}
            subtitle={d.portfolioSubtitle}
            className="mb-[40px]"
            compact={isHi}
          />
          <div className="grid sm:grid-cols-3 gap-5">
            {content.portfolio.map((item) => (
              <figure
                key={item.title}
                className="group relative rounded-[16px] overflow-hidden shadow-md border border-[#B9D3C4]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <AcademyImage
                    src={item.image}
                    alt={item.title}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="absolute bottom-[12px] left-[50%] translate-x-[-50%] w-[90%] min-h-[64px] bg-white rounded-[12px] px-2.5 py-2.5 shadow-xl border border-[#B9D3C4] flex flex-col items-center justify-center">
                  <p className="font-['Familjen_Grotesk'] font-semibold text-[13px] sm:text-[14px] text-center text-[#04330B] whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {item.title}
                  </p>
                  <p className="mt-1 font-['Familjen_Grotesk'] text-[11px] text-center text-[#587E67] whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {item.description}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[760px] px-4 lg:px-8">
          <SectionHeading title={d.faqTitle} className="mb-[40px]" compact={isHi} />
          <FaqAccordion items={content.faqs} />
          <p className="mt-8 text-center">
            <Link
              href="/leadership-academy/faq"
              className="font-['Familjen_Grotesk'] text-[14px] font-bold text-[#04330B] hover:text-[#0D5229]"
            >
              {d.allFaqs}
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <CtaBanner
            title={d.ctaTitle.replace("{name}", displayShort)}
            subtitle={d.ctaSubtitle}
            primaryHref={`/leadership-academy/apply?department=${department.slug}`}
            primaryLabel={d.apply}
            secondaryHref="/leadership-academy"
            secondaryLabel={d.back}
            image={department.image}
          />
        </div>
      </section>
    </AcademyShell>
  );
}

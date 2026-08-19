"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Users,
  GraduationCap,
  FolderKanban,
  Award,
  Rocket,
  UserPlus,
  Building2,
  Target,
  ClipboardCheck,
  MessageSquare,
  Presentation,
  Trophy,
  Landmark,
  Laptop,
  Megaphone,
} from "lucide-react";
import { InternshipShell } from "@/components/internship/InternshipShell";
import { SectionHeading } from "@/components/internship/SectionHeading";
import { FeatureCard } from "@/components/internship/FeatureCard";
import { DepartmentCard } from "@/components/internship/DepartmentCard";
import { JourneyTimeline } from "@/components/internship/JourneyTimeline";
import { ComparisonCard } from "@/components/internship/ComparisonCard";
import { CtaBanner } from "@/components/internship/CtaBanner";
import { InternshipImage } from "@/components/internship/InternshipImage";
import { DEPARTMENTS } from "@/data/internship/departments";
import { getInternshipI18n } from "@/data/internship/i18n";
import { useLanguage } from "@/components/LanguageContext";

const WHY_ICONS = [Briefcase, Users, GraduationCap, FolderKanban, Award, Rocket];
const WHY_IMAGES = [
  "/internship/why-practical.jpg",
  "/internship/why-leadership.jpg",
  "/internship/why-mentor.jpg",
  "/internship/why-portfolio.jpg",
  "/internship/why-certificate.jpg",
  "/internship/why-career.jpg",
];
const JOURNEY_ICONS = [
  UserPlus,
  Presentation,
  Building2,
  Target,
  ClipboardCheck,
  MessageSquare,
  FolderKanban,
  Megaphone,
  Trophy,
];
const JOURNEY_IMAGES = [
  "/internship/journey-register.jpg",
  "/internship/journey-orientation.jpg",
  "/internship/journey-allocation.jpg",
  "/internship/journey-training.jpg",
  "/internship/journey-milestones.jpg",
  "/internship/journey-mentor.jpg",
  "/internship/journey-portfolio.jpg",
  "/internship/journey-presentation.jpg",
  "/internship/journey-certificate.jpg",
];

export default function InternshipPage() {
  const { language } = useLanguage();
  const t = getInternshipI18n(language);
  const isHi = language === "hi";

  const whyJoin = t.whyJoin.items.map((item, i) => ({
    ...item,
    image: WHY_IMAGES[i],
    icon: WHY_ICONS[i],
  }));

  const journey = t.journey.steps.map((step, i) => ({
    num: i + 1,
    title: step.title,
    blurb: step.blurb,
    week: i < 5 ? t.journey.week1 : t.journey.week2,
    icon: JOURNEY_ICONS[i],
    image: JOURNEY_IMAGES[i],
  }));

  return (
    <InternshipShell>
      {/* Light PGP-aligned hero */}
      <section className="relative overflow-hidden bg-white w-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_90%_10%,rgba(13,82,41,0.08),transparent_55%)]" />
        <div className="relative mx-auto max-w-[1320px] px-4 lg:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="font-['Familjen_Grotesk'] text-[12px] lg:text-[14px] font-bold uppercase tracking-wider text-[#E85C2F]">
                {t.hero.tag}
              </p>
              <h1
                className={`mt-3 font-['Familjen_Grotesk'] font-semibold tracking-[-0.3px] text-[#04330B] ${
                  isHi
                    ? "text-[34px] sm:text-5xl lg:text-[56px] leading-[1.15] sm:whitespace-nowrap"
                    : "text-[40px] sm:text-5xl lg:text-[64px] leading-[1.1]"
                }`}
              >
                {t.hero.titlePre}{" "}
                <span className="text-[#0D5229]">{t.hero.titleHighlight}</span>{" "}
                {t.hero.titlePost}
              </h1>
              <p className="mt-5 font-['Familjen_Grotesk'] font-semibold text-[18px] lg:text-[20px] text-[#04330B]">
                {t.hero.subtitle}
              </p>
              <p className="mt-3 font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[18px] leading-relaxed text-[#587E67] max-w-xl">
                {t.hero.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {t.hero.checks.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#04330B] font-['Familjen_Grotesk']"
                  >
                    <CheckCircle2 size={16} className="text-[#0D5229]" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/internship/apply"
                  className="inline-flex items-center gap-2 px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
                >
                  {t.hero.apply} <ArrowRight size={18} />
                </Link>
                <Link
                  href="/internship/status"
                  className="inline-flex items-center gap-2 px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
                >
                  {isHi ? "इंटर्नशिप लॉगिन" : "Intern Login"}
                </Link>
                <Link
                  href="#departments"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("departments")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
                >
                  {t.hero.knowMore}
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {t.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[12px] border border-[#B9D3C4] bg-white px-3 py-3 text-center"
                  >
                    <p className="font-['Familjen_Grotesk'] font-bold text-[22px] text-[#04330B]">
                      {stat.val}
                    </p>
                    <p className="mt-0.5 font-['Familjen_Grotesk'] text-[11px] font-semibold text-[#587E67]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[16px] overflow-hidden shadow-xl border border-[#B9D3C4] aspect-[5/4]">
              <InternshipImage
                src="/internship/hero-students.jpg"
                alt={t.hero.tag}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                objectPosition="center 30%"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="why-join" className="bg-white w-full flex justify-center py-[60px] lg:py-[100px] scroll-mt-28">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <SectionHeading title={t.whyJoin.title} className="mb-[50px] lg:mb-[70px]" compact={isHi} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {whyJoin.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <SectionHeading
            title={t.journey.title}
            subtitle={t.journey.subtitle}
            className="mb-[40px] lg:mb-[50px]"
            compact={isHi}
          />
          <JourneyTimeline
            steps={journey}
            labels={{
              stepOf: t.journey.stepOf,
              previous: t.journey.previous,
              next: t.journey.next,
            }}
          />
        </div>
      </section>

      <section id="departments" className="bg-white w-full flex justify-center py-[60px] lg:py-[100px] scroll-mt-28">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <SectionHeading
            title={t.departments.title}
            subtitle={t.departments.subtitle}
            className="mb-[50px] lg:mb-[70px]"
            compact={isHi}
          />
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {DEPARTMENTS.map((dept) => {
              const localized = t.deptNames[dept.slug];
              return (
                <DepartmentCard
                  key={dept.slug}
                  number={dept.number}
                  name={localized.name}
                  description={localized.description}
                  image={dept.image}
                  href={`/internship/${dept.slug}`}
                  viewDetailsLabel={t.departments.viewDetails}
                  departmentLabel={t.departments.departmentLabel.replace("{n}", String(dept.number))}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <SectionHeading title={t.modes.title} className="mb-[50px] lg:mb-[70px]" compact={isHi} />
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
            <ComparisonCard
              title={t.modes.offline.title}
              icon={Landmark}
              image="/internship/mode-offline.jpg"
              points={[...t.modes.offline.points]}
            />
            <ComparisonCard
              title={t.modes.hybrid.title}
              icon={Laptop}
              image="/internship/mode-hybrid.jpg"
              points={[...t.modes.hybrid.points]}
            />
          </div>
        </div>
      </section>

      {/* Merged certificate + CTA */}
      <section className="bg-white w-full flex justify-center py-[60px] lg:py-[100px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <CtaBanner
            title={t.cta.title}
            subtitle={`${t.certificate.description} ${t.cta.subtitle}`}
            primaryHref="/internship/apply"
            primaryLabel={t.cta.apply}
            secondaryHref="/internship/status"
            secondaryLabel={isHi ? "इंटर्नशिप लॉगिन" : "Intern Login"}
            image="/internship/cta-student.jpg"
            points={[...t.certificate.points]}
          />
        </div>
      </section>
    </InternshipShell>
  );
}

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
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { SectionHeading } from "@/components/leadership-academy/SectionHeading";
import { FeatureCard } from "@/components/leadership-academy/FeatureCard";
import { DepartmentCard } from "@/components/leadership-academy/DepartmentCard";
import { JourneyTimeline } from "@/components/leadership-academy/JourneyTimeline";
import { ComparisonCard } from "@/components/leadership-academy/ComparisonCard";
import { CtaBanner } from "@/components/leadership-academy/CtaBanner";
import { AcademyImage } from "@/components/leadership-academy/AcademyImage";
import { DEPARTMENTS } from "@/data/leadership-academy/departments";
import { getAcademyI18n } from "@/data/leadership-academy/i18n";
import { useLanguage } from "@/components/LanguageContext";

const WHY_ICONS = [Briefcase, Users, GraduationCap, FolderKanban, Award, Rocket];
const WHY_IMAGES = [
  "/leadership-academy/why-practical.jpg",
  "/leadership-academy/why-leadership.jpg",
  "/leadership-academy/why-mentor.jpg",
  "/leadership-academy/why-portfolio.jpg",
  "/leadership-academy/why-certificate.jpg",
  "/leadership-academy/why-career.jpg",
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
  "/leadership-academy/journey-register.jpg",
  "/leadership-academy/journey-orientation.jpg",
  "/leadership-academy/journey-allocation.jpg",
  "/leadership-academy/journey-training.jpg",
  "/leadership-academy/journey-milestones.jpg",
  "/leadership-academy/journey-mentor.jpg",
  "/leadership-academy/journey-portfolio.jpg",
  "/leadership-academy/journey-presentation.jpg",
  "/leadership-academy/journey-certificate.jpg",
];

export default function LeadershipAcademyPage() {
  const { language } = useLanguage();
  const t = getAcademyI18n(language);
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
    <AcademyShell>
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
                  href="/leadership-academy/apply"
                  className="inline-flex items-center gap-2 px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
                >
                  {t.hero.apply} <ArrowRight size={18} />
                </Link>
                <Link
                  href="#departments"
                  className="inline-flex items-center gap-2 px-[28px] py-[12px] border border-[#E4F2EA] text-[#04330B] hover:bg-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors"
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
              <AcademyImage
                src="/leadership-academy/hero-students.jpg"
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
                  href={`/leadership-academy/${dept.slug}`}
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
              image="/leadership-academy/mode-offline.jpg"
              points={[...t.modes.offline.points]}
            />
            <ComparisonCard
              title={t.modes.hybrid.title}
              icon={Laptop}
              image="/leadership-academy/mode-hybrid.jpg"
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
            primaryHref="/leadership-academy/apply"
            primaryLabel={t.cta.apply}
            secondaryHref="/leadership-academy/faq"
            secondaryLabel={t.cta.knowMore}
            image="/leadership-academy/cta-student.jpg"
            points={[...t.certificate.points]}
          />
        </div>
      </section>
    </AcademyShell>
  );
}

import type { Department } from "./types";
import { DEPARTMENTS_HI } from "./departments-hi";

/** Merge English department shell with Hindi body when language is hi. */
export function localizeDepartment(department: Department, language: string): Department {
  if (language !== "hi") return department;

  const hi = DEPARTMENTS_HI[department.slug];
  if (!hi) return department;

  return {
    ...department,
    overview: hi.overview,
    skills: hi.skills,
    objectives: hi.objectives,
    professionalSkills: hi.professionalSkills,
    technicalSkills: hi.technicalSkills,
    workplaceSkills: hi.workplaceSkills,
    programmeStructure: hi.programmeStructure,
    offline: hi.offline,
    hybrid: hi.hybrid,
    learningOutcomes: hi.learningOutcomes,
    successMetrics: hi.successMetrics,
    faqs: hi.faqs,
    portfolio: department.portfolio.map((item, i) => ({
      ...item,
      title: hi.portfolio[i]?.title ?? item.title,
      description: hi.portfolio[i]?.description ?? item.description,
    })),
  };
}

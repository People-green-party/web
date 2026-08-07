export type AcademySlug =
  | "digital-growth-media"
  | "research-policy"
  | "community-outreach"
  | "membership-campus-outreach"
  | "fundraising-partnerships"
  | "events-operations";

export type Milestone = {
  title: string;
  hours: string;
  activities: string[];
  deliverables: string[];
};

export type Department = {
  slug: AcademySlug;
  number: number;
  name: string;
  shortName: string;
  description: string;
  overview: string;
  image: string;
  skills: string[];
  objectives: string[];
  professionalSkills: string[];
  technicalSkills: string[];
  workplaceSkills: string[];
  programmeStructure: string[];
  offline: Milestone[];
  hybrid: Milestone[];
  learningOutcomes: string[];
  portfolio: { title: string; description: string; image: string }[];
  successMetrics: string[];
  faqs: { q: string; a: string }[];
};

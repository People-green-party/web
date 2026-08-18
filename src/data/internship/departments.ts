import type { InternshipSlug, Department } from "./types";

const img = (name: string) => `/internship/${name}`;

export const DEPARTMENTS: Department[] = [
  {
    slug: "digital-growth-media",
    number: 1,
    name: "Digital Growth & Media",
    shortName: "Digital Growth",
    description:
      "Create posters, reels, explainers and grow the digital presence of PGP across platforms.",
    overview:
      "The Digital Growth & Media department trains volunteers to design campaign creatives, produce short-form video, manage social content calendars, and measure digital reach — building a professional media portfolio through live PGP projects.",
    image: img("dept-digital.jpg"),
    skills: ["Graphic Design", "Reels & Video", "Content Strategy", "Analytics"],
    objectives: [
      "Design campaign-ready posters, carousels and stories for PGP initiatives",
      "Produce short-form reels and explainers aligned with campaign messaging",
      "Plan and schedule content calendars across key social platforms",
      "Track basic performance metrics and iterate creatives based on feedback",
      "Build a personal digital portfolio of published campaign assets",
    ],
    professionalSkills: [
      "Campaign messaging",
      "Brand consistency",
      "Stakeholder briefing",
      "Creative critique",
    ],
    technicalSkills: [
      "Canva / Figma basics",
      "Reel editing (CapCut / Premiere)",
      "Image export & sizing",
      "Hashtag & caption writing",
    ],
    workplaceSkills: [
      "Deadline management",
      "Remote collaboration",
      "Version control of assets",
      "Mentor feedback loops",
    ],
    programmeStructure: [
      "Week 1 — Tools orientation, brand kit, poster & carousel sprint",
      "Week 1 — Reel scripting, filming support and first edit review",
      "Week 2 — Campaign content pack, analytics check-in, mentor review",
      "Week 2 — Portfolio curation and final presentation of digital pack",
    ],
    offline: [
      {
        title: "Milestone 1 — Brand & Tools Bootcamp",
        hours: "12 hrs",
        activities: [
          "Brand kit walkthrough and visual guidelines",
          "Hands-on Canva/Figma poster workshop",
          "Peer review of first poster drafts",
        ],
        deliverables: ["2 campaign posters", "1 story set (3 frames)"],
      },
      {
        title: "Milestone 2 — Video & Content Sprint",
        hours: "14 hrs",
        activities: [
          "Reel script writing session",
          "On-campus shoot support",
          "Edit lab with mentor checkpoints",
        ],
        deliverables: ["2 reels / short videos", "Caption bank for 1 week"],
      },
      {
        title: "Milestone 3 — Campaign Pack & Portfolio",
        hours: "10 hrs",
        activities: [
          "Assemble a mini digital campaign pack",
          "Basic reach & engagement review",
          "Final presentation to mentors",
        ],
        deliverables: ["Campaign content pack", "Portfolio PDF / drive folder"],
      },
    ],
    hybrid: [
      {
        title: "Milestone 1 — Brand & Tools (Hybrid)",
        hours: "10 hrs",
        activities: [
          "Offline brand orientation",
          "Online tool practice sessions",
          "Async draft submissions on shared drive",
        ],
        deliverables: ["2 campaign posters", "1 story set"],
      },
      {
        title: "Milestone 2 — Video Sprint (Hybrid)",
        hours: "12 hrs",
        activities: [
          "Offline scripting clinic",
          "Remote filming / phone-shot reels",
          "Online edit review with mentor",
        ],
        deliverables: ["2 reels", "Caption bank"],
      },
      {
        title: "Milestone 3 — Pack & Portfolio (Hybrid)",
        hours: "10 hrs",
        activities: [
          "Online collaboration on campaign pack",
          "Offline final presentation day",
        ],
        deliverables: ["Campaign content pack", "Portfolio folder"],
      },
    ],
    learningOutcomes: [
      "Ship production-ready campaign creatives under real deadlines",
      "Tell a campaign story through posters, reels and captions",
      "Present a LinkedIn-ready digital media portfolio",
    ],
    portfolio: [
      { title: "Graphics & Posters", description: "Campaign posters and story sets", image: img("port-graphics.jpg") },
      { title: "Reels & Videos", description: "Short-form explainers and hooks", image: img("port-reels.jpg") },
      { title: "Campaign Plans", description: "One-week content calendar packs", image: img("skill-creative.jpg") },
    ],
    successMetrics: [
      "All milestone deliverables submitted and approved by mentor",
      "Minimum 2 posters + 2 reels published or approved for publishing",
      "Portfolio folder organised with titles, dates and captions",
      "Final presentation delivered with clear campaign narrative",
      "Attendance requirement met for chosen programme mode",
    ],
    faqs: [
      {
        q: "Do I need prior design experience?",
        a: "No. Basic tool training is included. Prior Canva or phone-editing experience helps but is not required.",
      },
      {
        q: "What software will I use?",
        a: "Primarily Canva/Figma for design and CapCut or similar for reels. Mentors will confirm the exact stack during orientation.",
      },
    ],
  },
  {
    slug: "research-policy",
    number: 2,
    name: "Research & Policy",
    shortName: "Research",
    description:
      "Analyse data, draft briefs and support evidence-based policy conversations for PGP.",
    overview:
      "Research & Policy trains volunteers to gather primary and secondary evidence, structure findings into clear briefs, and present recommendations that support PGP’s civic and policy work.",
    image: img("dept-research.jpg"),
    skills: ["Research Methods", "Data Analysis", "Policy Briefs", "Survey Design"],
    objectives: [
      "Frame a focused research question linked to a live PGP theme",
      "Collect and organise secondary data and field inputs",
      "Draft clear policy / research briefs for non-expert readers",
      "Visualise key findings for presentations and reports",
      "Build a research portfolio with at least one complete brief",
    ],
    professionalSkills: [
      "Issue framing",
      "Evidence synthesis",
      "Brief writing",
      "Presentation of findings",
    ],
    technicalSkills: [
      "Desk research & source logging",
      "Survey / form basics",
      "Spreadsheet analysis",
      "Slide and report formatting",
    ],
    workplaceSkills: [
      "Citation discipline",
      "Peer review",
      "Time-boxed research sprints",
      "Mentor check-ins",
    ],
    programmeStructure: [
      "Week 1 — Research question, source map, survey/desk plan",
      "Week 1 — Data collection sprint and interim findings",
      "Week 2 — Brief drafting, visuals, mentor review",
      "Week 2 — Final research report and presentation",
    ],
    offline: [
      {
        title: "Milestone 1 — Frame & Source Map",
        hours: "12 hrs",
        activities: [
          "Issue framing workshop",
          "Source quality checklist practice",
          "Research plan peer review",
        ],
        deliverables: ["Research question one-pager", "Source map"],
      },
      {
        title: "Milestone 2 — Evidence Sprint",
        hours: "14 hrs",
        activities: [
          "Desk research lab",
          "Field / survey support (as assigned)",
          "Interim findings review",
        ],
        deliverables: ["Evidence log", "Interim findings note"],
      },
      {
        title: "Milestone 3 — Brief & Presentation",
        hours: "10 hrs",
        activities: [
          "Policy brief drafting clinic",
          "Chart / slide polish session",
          "Final presentation to mentors",
        ],
        deliverables: ["Research / policy brief", "Presentation deck"],
      },
    ],
    hybrid: [
      {
        title: "Milestone 1 — Frame & Source Map (Hybrid)",
        hours: "10 hrs",
        activities: [
          "Offline framing session",
          "Online source mapping",
          "Async mentor feedback",
        ],
        deliverables: ["Research question one-pager", "Source map"],
      },
      {
        title: "Milestone 2 — Evidence Sprint (Hybrid)",
        hours: "12 hrs",
        activities: [
          "Remote desk research",
          "Online interim review",
          "Optional offline field day",
        ],
        deliverables: ["Evidence log", "Interim findings note"],
      },
      {
        title: "Milestone 3 — Brief & Presentation (Hybrid)",
        hours: "10 hrs",
        activities: [
          "Online draft reviews",
          "Offline final presentation",
        ],
        deliverables: ["Research brief", "Presentation deck"],
      },
    ],
    learningOutcomes: [
      "Produce a structured research or policy brief",
      "Defend recommendations with cited evidence",
      "Present findings clearly to a mixed audience",
    ],
    portfolio: [
      { title: "Research Reports", description: "Briefs and evidence summaries", image: img("port-research.jpg") },
      { title: "Campaign Plans", description: "Issue framing for campaigns", image: img("skill-problem.jpg") },
      { title: "Presentations", description: "Finding decks for mentors", image: img("journey-presentation.jpg") },
    ],
    successMetrics: [
      "Approved research question and source map",
      "Complete brief with citations and recommendations",
      "Presentation delivered within time limit",
      "Portfolio includes brief + deck + evidence log",
      "Attendance requirement met for chosen programme mode",
    ],
    faqs: [
      {
        q: "Is this only for students with a research background?",
        a: "No. Curiosity, structured thinking and willingness to cite sources matter more than prior research experience.",
      },
      {
        q: "Will I do field surveys?",
        a: "Field components depend on the live project assigned. Desk research is always part of the track.",
      },
    ],
  },
  {
    slug: "community-outreach",
    number: 3,
    name: "Community Outreach",
    shortName: "Community Outreach",
    description:
      "Run awareness drives, talk to citizens and convert conversations into organised action.",
    overview:
      "Community Outreach prepares volunteers to plan ground campaigns, engage citizens respectfully, document interactions, and turn outreach into measurable participation for PGP initiatives.",
    image: img("dept-community.jpg"),
    skills: ["Field Outreach", "Awareness Drives", "Public Engagement", "Documentation"],
    objectives: [
      "Plan a focused outreach activity with clear goals",
      "Engage citizens with respectful, on-message conversations",
      "Document interactions and turnout accurately",
      "Coordinate with team leads on logistics and safety",
      "Reflect learnings into an outreach activity report",
    ],
    professionalSkills: [
      "Public speaking basics",
      "Message delivery",
      "Conflict-aware engagement",
      "Team coordination",
    ],
    technicalSkills: [
      "Outreach checklist design",
      "Attendance / lead logging",
      "Photo & consent documentation",
      "Activity report writing",
    ],
    workplaceSkills: [
      "Punctuality on ground",
      "Safety awareness",
      "Peer support",
      "Post-activity debriefs",
    ],
    programmeStructure: [
      "Week 1 — Messaging, role-play, outreach plan",
      "Week 1 — First supervised outreach activity",
      "Week 2 — Second drive, documentation quality review",
      "Week 2 — Outreach report and final presentation",
    ],
    offline: [
      {
        title: "Milestone 1 — Plan & Message",
        hours: "10 hrs",
        activities: [
          "Outreach messaging workshop",
          "Role-play conversations",
          "Logistics & safety briefing",
        ],
        deliverables: ["Outreach plan", "Talking-points card"],
      },
      {
        title: "Milestone 2 — Ground Execution",
        hours: "16 hrs",
        activities: [
          "Supervised awareness drive",
          "Citizen conversation practice",
          "Live documentation on ground",
        ],
        deliverables: ["Activity log", "Photo set with consent notes"],
      },
      {
        title: "Milestone 3 — Report & Present",
        hours: "8 hrs",
        activities: [
          "Activity report clinic",
          "Lessons-learned circle",
          "Final presentation",
        ],
        deliverables: ["Outreach activity report", "Presentation summary"],
      },
    ],
    hybrid: [
      {
        title: "Milestone 1 — Plan & Message (Hybrid)",
        hours: "8 hrs",
        activities: [
          "Offline messaging workshop",
          "Online plan review",
        ],
        deliverables: ["Outreach plan", "Talking-points card"],
      },
      {
        title: "Milestone 2 — Ground Execution (Hybrid)",
        hours: "14 hrs",
        activities: [
          "Offline supervised drives",
          "Online documentation check-ins",
        ],
        deliverables: ["Activity log", "Photo set"],
      },
      {
        title: "Milestone 3 — Report & Present (Hybrid)",
        hours: "8 hrs",
        activities: [
          "Online draft review",
          "Offline final presentation",
        ],
        deliverables: ["Outreach report", "Presentation summary"],
      },
    ],
    learningOutcomes: [
      "Plan and execute a respectful community outreach activity",
      "Document turnout and conversations with care",
      "Present ground learnings with clear next steps",
    ],
    portfolio: [
      { title: "Outreach Activities", description: "Drive plans and field reports", image: img("port-outreach.jpg") },
      { title: "Campaign Plans", description: "Awareness campaign outlines", image: img("dept-community.jpg") },
      { title: "Presentations", description: "Ground learning summaries", image: img("why-practical.jpg") },
    ],
    successMetrics: [
      "Outreach plan approved before first ground day",
      "Minimum assigned outreach hours completed",
      "Complete activity log and report submitted",
      "Final presentation covers goals, turnout and learnings",
      "Attendance requirement met for chosen programme mode",
    ],
    faqs: [
      {
        q: "Will I work alone in the field?",
        a: "No. Ground activities are team-based and supervised. Safety briefings are mandatory.",
      },
      {
        q: "What if I am new to public speaking?",
        a: "Role-play and talking-points training are part of Week 1 before any ground activity.",
      },
    ],
  },
  {
    slug: "membership-campus-outreach",
    number: 4,
    name: "Membership & Campus Outreach",
    shortName: "Membership",
    description:
      "Grow membership on campuses — registration desks, student conversations and onboarding.",
    overview:
      "Membership & Campus Outreach trains volunteers to run campus desks, explain PGP pathways clearly, onboard new members, and build repeatable campus engagement systems.",
    image: img("dept-membership.jpg"),
    skills: ["Campus Activation", "Onboarding", "Lead Tracking", "Student Engagement"],
    objectives: [
      "Set up and run an effective campus registration desk",
      "Explain membership pathways in clear, honest language",
      "Capture and follow up on student leads systematically",
      "Support onboarding of new members into next steps",
      "Document campus activation results for the portfolio",
    ],
    professionalSkills: [
      "Persuasive but honest pitch",
      "Desk hospitality",
      "Follow-up etiquette",
      "Team shift coordination",
    ],
    technicalSkills: [
      "Registration form workflows",
      "Lead sheet / CRM basics",
      "ID / QR check-in support",
      "Campus activation report",
    ],
    workplaceSkills: [
      "Shift discipline",
      "Peer handovers",
      "Problem escalation",
      "Mentor reporting",
    ],
    programmeStructure: [
      "Week 1 — Pitch training, desk setup, lead sheet practice",
      "Week 1 — First campus desk day",
      "Week 2 — Follow-ups, onboarding support, second activation",
      "Week 2 — Campus report and final presentation",
    ],
    offline: [
      {
        title: "Milestone 1 — Pitch & Desk Setup",
        hours: "10 hrs",
        activities: [
          "Membership FAQ & pitch clinic",
          "Desk layout and materials checklist",
          "Lead-sheet practice",
        ],
        deliverables: ["Pitch script", "Desk checklist"],
      },
      {
        title: "Milestone 2 — Campus Activation",
        hours: "16 hrs",
        activities: [
          "Live registration desk shifts",
          "Student conversation practice",
          "Same-day lead hygiene",
        ],
        deliverables: ["Lead sheet", "Shift log"],
      },
      {
        title: "Milestone 3 — Onboarding & Report",
        hours: "8 hrs",
        activities: [
          "Follow-up call / message clinic",
          "Onboarding handoff practice",
          "Final presentation",
        ],
        deliverables: ["Campus activation report", "Onboarding tracker"],
      },
    ],
    hybrid: [
      {
        title: "Milestone 1 — Pitch & Desk (Hybrid)",
        hours: "8 hrs",
        activities: [
          "Offline pitch clinic",
          "Online FAQ practice",
        ],
        deliverables: ["Pitch script", "Desk checklist"],
      },
      {
        title: "Milestone 2 — Campus Activation (Hybrid)",
        hours: "14 hrs",
        activities: [
          "Offline desk days",
          "Online lead hygiene reviews",
        ],
        deliverables: ["Lead sheet", "Shift log"],
      },
      {
        title: "Milestone 3 — Onboarding & Report (Hybrid)",
        hours: "8 hrs",
        activities: [
          "Remote follow-ups",
          "Offline final presentation",
        ],
        deliverables: ["Campus report", "Onboarding tracker"],
      },
    ],
    learningOutcomes: [
      "Run a campus desk that converts interest into clean leads",
      "Follow up professionally and support onboarding",
      "Report campus results with clear numbers and learnings",
    ],
    portfolio: [
      { title: "Outreach Activities", description: "Campus desk plans and logs", image: img("dept-membership.jpg") },
      { title: "Campaign Plans", description: "Campus activation outlines", image: img("journey-allocation.jpg") },
      { title: "Presentations", description: "Activation result decks", image: img("skill-communication.jpg") },
    ],
    successMetrics: [
      "Pitch script approved before first desk day",
      "Assigned desk shifts completed",
      "Lead sheet accuracy verified by mentor",
      "Campus activation report submitted",
      "Attendance requirement met for chosen programme mode",
    ],
    faqs: [
      {
        q: "Do I need to be a student leader already?",
        a: "No. Training covers pitch, desk ops and follow-up. Campus access depends on assigned activations.",
      },
      {
        q: "How are leads handled?",
        a: "You will use the internship’s approved lead sheet / form process. Personal contact lists are not used.",
      },
    ],
  },
  {
    slug: "fundraising-partnerships",
    number: 5,
    name: "Fundraising & Partnerships",
    shortName: "Fundraising",
    description:
      "Prepare proposals, support partnership meetings and learn ethical fundraising basics.",
    overview:
      "Fundraising & Partnerships introduces ethical fundraising, proposal structure, partner research and meeting support — so volunteers can contribute to sustainable resource building for PGP programmes.",
    image: img("dept-fundraising.jpg"),
    skills: ["Proposals", "Partner Research", "Pitch Support", "Follow-ups"],
    objectives: [
      "Understand ethical fundraising principles used by PGP",
      "Research potential partners and map fit",
      "Draft a clear one-page proposal or partnership brief",
      "Support meeting prep, notes and follow-ups",
      "Present a partnership case in the final review",
    ],
    professionalSkills: [
      "Professional communication",
      "Meeting etiquette",
      "Value proposition framing",
      "Follow-up writing",
    ],
    technicalSkills: [
      "Partner research sheets",
      "One-pager / proposal formatting",
      "CRM-style tracking basics",
      "Deck support for pitches",
    ],
    workplaceSkills: [
      "Confidentiality",
      "Accuracy in notes",
      "Mentor escalation",
      "Deadline ownership",
    ],
    programmeStructure: [
      "Week 1 — Ethics, research methods, one-pager structure",
      "Week 1 — Partner map and first draft proposal",
      "Week 2 — Meeting simulation, revisions, follow-up pack",
      "Week 2 — Final partnership case presentation",
    ],
    offline: [
      {
        title: "Milestone 1 — Ethics & Research",
        hours: "10 hrs",
        activities: [
          "Ethical fundraising briefing",
          "Partner research workshop",
          "Fit-scoring practice",
        ],
        deliverables: ["Partner research sheet", "Ethics checklist acknowledgement"],
      },
      {
        title: "Milestone 2 — Proposal Sprint",
        hours: "14 hrs",
        activities: [
          "One-pager drafting clinic",
          "Peer critique",
          "Mentor revision round",
        ],
        deliverables: ["Partnership one-pager", "Talk track"],
      },
      {
        title: "Milestone 3 — Meeting & Follow-up",
        hours: "10 hrs",
        activities: [
          "Meeting simulation",
          "Notes & follow-up writing",
          "Final case presentation",
        ],
        deliverables: ["Follow-up email pack", "Partnership case deck"],
      },
    ],
    hybrid: [
      {
        title: "Milestone 1 — Ethics & Research (Hybrid)",
        hours: "8 hrs",
        activities: [
          "Offline ethics session",
          "Online research sprint",
        ],
        deliverables: ["Partner research sheet", "Ethics acknowledgement"],
      },
      {
        title: "Milestone 2 — Proposal Sprint (Hybrid)",
        hours: "12 hrs",
        activities: [
          "Online drafting reviews",
          "Offline critique clinic",
        ],
        deliverables: ["Partnership one-pager", "Talk track"],
      },
      {
        title: "Milestone 3 — Meeting & Follow-up (Hybrid)",
        hours: "10 hrs",
        activities: [
          "Online meeting simulation",
          "Offline final presentation",
        ],
        deliverables: ["Follow-up pack", "Case deck"],
      },
    ],
    learningOutcomes: [
      "Draft a clear, ethical partnership one-pager",
      "Support a partnership conversation with strong notes",
      "Present a partnership case with next-step clarity",
    ],
    portfolio: [
      { title: "Campaign Plans", description: "Partnership case outlines", image: img("dept-fundraising.jpg") },
      { title: "Research Reports", description: "Partner research sheets", image: img("why-portfolio.jpg") },
      { title: "Presentations", description: "Pitch support decks", image: img("why-career.jpg") },
    ],
    successMetrics: [
      "Ethics briefing completed",
      "Partner research sheet approved",
      "One-pager revised after mentor feedback",
      "Final partnership case presented",
      "Attendance requirement met for chosen programme mode",
    ],
    faqs: [
      {
        q: "Will I ask strangers for money?",
        a: "No cold solicitation. You work on research, proposals and supervised meeting support under mentor guidance.",
      },
      {
        q: "Is prior business experience required?",
        a: "No. Clear writing, curiosity and professionalism are the main requirements.",
      },
    ],
  },
  {
    slug: "events-operations",
    number: 6,
    name: "Events & Operations",
    shortName: "Events",
    description:
      "Plan events, manage registrations, coordinate volunteers and keep operations on track.",
    overview:
      "Events & Operations trains volunteers in run-of-show planning, registration desks, volunteer coordination and on-ground problem solving for PGP programmes and public events.",
    image: img("dept-events.jpg"),
    skills: ["Event Planning", "Registration Ops", "Volunteer Coord", "Run-of-Show"],
    objectives: [
      "Build a clear run-of-show for a sample PGP event",
      "Operate registration and crowd-flow checkpoints",
      "Coordinate volunteer roles and shift handovers",
      "Document incidents and resolutions calmly",
      "Deliver an operations report after the event cycle",
    ],
    professionalSkills: [
      "Situational leadership",
      "Calm communication",
      "Vendor / venue liaison basics",
      "Guest handling",
    ],
    technicalSkills: [
      "Run-of-show documents",
      "Registration desk systems",
      "Checklist & inventory tracking",
      "Post-event report writing",
    ],
    workplaceSkills: [
      "Punctuality",
      "Radio / phone discipline",
      "Escalation paths",
      "Team briefings",
    ],
    programmeStructure: [
      "Week 1 — Ops basics, run-of-show, desk simulation",
      "Week 1 — Live event / activation support",
      "Week 2 — Second ops cycle, incident notes, improvements",
      "Week 2 — Operations report and final presentation",
    ],
    offline: [
      {
        title: "Milestone 1 — Plan & Simulate",
        hours: "12 hrs",
        activities: [
          "Run-of-show workshop",
          "Registration desk simulation",
          "Role assignment drill",
        ],
        deliverables: ["Run-of-show draft", "Role matrix"],
      },
      {
        title: "Milestone 2 — Live Ops",
        hours: "16 hrs",
        activities: [
          "Live event / activation support",
          "Registration & flow management",
          "Incident logging practice",
        ],
        deliverables: ["Shift logs", "Incident notes"],
      },
      {
        title: "Milestone 3 — Report & Improve",
        hours: "8 hrs",
        activities: [
          "Debrief circle",
          "Ops report clinic",
          "Final presentation",
        ],
        deliverables: ["Operations report", "Improvement checklist"],
      },
    ],
    hybrid: [
      {
        title: "Milestone 1 — Plan & Simulate (Hybrid)",
        hours: "10 hrs",
        activities: [
          "Offline simulation",
          "Online run-of-show review",
        ],
        deliverables: ["Run-of-show draft", "Role matrix"],
      },
      {
        title: "Milestone 2 — Live Ops (Hybrid)",
        hours: "14 hrs",
        activities: [
          "Offline event support",
          "Online daily ops check-in",
        ],
        deliverables: ["Shift logs", "Incident notes"],
      },
      {
        title: "Milestone 3 — Report & Improve (Hybrid)",
        hours: "8 hrs",
        activities: [
          "Online draft review",
          "Offline final presentation",
        ],
        deliverables: ["Operations report", "Improvement checklist"],
      },
    ],
    learningOutcomes: [
      "Own a section of event operations with a clear run-of-show",
      "Coordinate volunteers and desk flow under time pressure",
      "Report what worked, what failed and what to improve",
    ],
    portfolio: [
      { title: "Presentations", description: "Run-of-show and ops decks", image: img("dept-events.jpg") },
      { title: "Campaign Plans", description: "Event operation plans", image: img("journey-milestones.jpg") },
      { title: "Outreach Activities", description: "Activation support logs", image: img("mode-offline.jpg") },
    ],
    successMetrics: [
      "Run-of-show approved before live support day",
      "Assigned ops shifts completed",
      "Shift and incident logs submitted",
      "Operations report presented to mentors",
      "Attendance requirement met for chosen programme mode",
    ],
    faqs: [
      {
        q: "Are late nights required?",
        a: "Some events may run into evenings. Shift timings are shared in advance during allocation.",
      },
      {
        q: "Do I need prior event experience?",
        a: "No. Simulations and checklists prepare you before live support days.",
      },
    ],
  },
];

export const DEPARTMENTS_BY_SLUG: Record<InternshipSlug, Department> = DEPARTMENTS.reduce(
  (acc, dept) => {
    acc[dept.slug] = dept;
    return acc;
  },
  {} as Record<InternshipSlug, Department>
);

export function getDepartment(slug: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug === slug);
}

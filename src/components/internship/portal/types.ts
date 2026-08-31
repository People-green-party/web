"use client";

/** Module state is decided by the API from real work, never guessed here. */
export type InternModule = {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  resourceUrl?: string | null;
  sortOrder: number;
  department?: string | null;
  status: "not_started" | "in_progress" | "done";
  locked: boolean;
  /** "sequence" = an earlier module is unfinished, "schedule" = it opens later. */
  lockReason?: "sequence" | "schedule" | null;
  unlockAfterDays?: number | null;
  unlocksAt?: string | null;
  taskTotal: number;
  taskCompleted: number;
  progressPct: number;
  completedAt?: string | null;
};

/** Where the intern is in the paced programme calendar. */
export type ProgrammeSchedule = {
  startAt?: string | null;
  endAt?: string | null;
  dayNumber?: number | null;
  totalDays: number;
  workingDayNumber?: number | null;
  workingDaysTotal?: number;
  isSundayOff?: boolean;
  unlockTime?: string;
  rules?: {
    sundayOff: boolean;
    workingDays: string;
    unlockTime: string;
    noteEn: string;
    noteHi: string;
  };
  todayTask?: {
    title: string;
    opensAt: string;
    weekdayEn: string;
  } | null;
  nextOpen?: {
    title: string;
    opensAt: string;
    weekdayEn: string;
  } | null;
  timeline?: {
    title: string;
    opensAt: string;
    weekdayEn: string;
    open: boolean;
  }[];
};

export type CertificateStatus = {
  eligible: boolean;
  approved: boolean;
  issued: boolean;
  unmet: string[];
  requirements: {
    tasks: { done: number; total: number; met: boolean };
    attendance: {
      present: number;
      total: number;
      pct: number;
      required: number;
      /** Floor on sessions actually attended; older API builds omit it. */
      requiredClasses?: number;
      met: boolean;
    };
    modules: { done: number; total: number; met: boolean };
  };
};

export type InternDash = {
  application: {
    id: number;
    fullName: string;
    department: string;
    mode: string;
    status: string;
    certificateUrl?: string | null;
    city?: string | null;
    college?: string | null;
    email?: string | null;
    phone?: string | null;
    photoUrl?: string | null;
    createdAt?: string;
  };
  /** Absent on older API builds — treat a missing value as granted. */
  access?: {
    granted: boolean;
    status: string;
  };
  schedule?: ProgrammeSchedule;
  classes: {
    recorded: {
      id: number;
      title: string;
      description?: string | null;
      url?: string | null;
      venue?: string | null;
    }[];
    live: {
      id: number;
      title: string;
      description?: string | null;
      url?: string | null;
      venue?: string | null;
      scheduledAt?: string | null;
    }[];
  };
  tasks: {
    assignmentId: number;
    status: string;
    proofUrl?: string | null;
    notes?: string | null;
    submittedAt?: string | null;
    completedAt?: string | null;
    /** True when the parent module has not opened yet. */
    locked?: boolean;
    lockReason?: "sequence" | "schedule" | null;
    opensAt?: string | null;
    task: {
      id: number;
      title: string;
      description?: string | null;
      /** Already resolved against the intern's start date by the API. */
      dueAt?: string | null;
      dueAfterDays?: number | null;
      moduleId?: number | null;
      department?: string | null;
    };
  }[];
  attendance?: {
    id: number;
    date: string;
    present: boolean;
    notes?: string | null;
    class?: { id: number; title: string; type: string } | null;
  }[];
  mentors?: {
    id: number;
    name: string;
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    photoUrl?: string | null;
    bio?: string | null;
    department?: string | null;
  }[];
  announcements?: {
    id: number;
    title: string;
    body: string;
    department?: string | null;
    pinned: boolean;
    createdAt: string;
  }[];
  resources?: {
    id: number;
    title: string;
    description?: string | null;
    url: string;
    type: string;
    department?: string | null;
    createdAt: string;
  }[];
  modules?: InternModule[];
  notifications?: {
    id: number;
    title: string;
    body?: string | null;
    href?: string | null;
    readAt?: string | null;
    createdAt: string;
  }[];
  summary?: {
    tasksTotal: number;
    tasksCompleted: number;
    tasksSubmitted: number;
    attendancePresent: number;
    attendanceTotal: number;
    unreadNotifications?: number;
    certificateEligible?: boolean;
    certificate?: CertificateStatus;
  };
};

export const DEPT_LABELS: Record<"en" | "hi", Record<string, string>> = {
  en: {
    "research-policy": "Research & Policy",
    "digital-growth-media": "Digital Growth & Media",
    "media-communications": "Digital Growth & Media",
    "community-outreach": "Community Outreach",
    "membership-campus-outreach": "Membership & Campus Outreach",
    "fundraising-partnerships": "Fundraising & Partnerships",
    "events-operations": "Events & Operations",
  },
  hi: {
    "research-policy": "रिसर्च और पॉलिसी",
    "digital-growth-media": "डिजिटल ग्रोथ और मीडिया",
    "media-communications": "डिजिटल ग्रोथ और मीडिया",
    "community-outreach": "कम्युनिटी आउटरीच",
    "membership-campus-outreach": "मेंबरशिप और कैंपस आउटरीच",
    "fundraising-partnerships": "फंडरेज़िंग और पार्टनरशिप",
    "events-operations": "इवेंट्स और ऑपरेशंस",
  },
};

export function deptLabel(slug: string, lang: "en" | "hi") {
  return DEPT_LABELS[lang][slug] || slug || "—";
}

/** Canonical values from InternTaskAssignment.status in the API schema. */
export const TASK_STATUS_LABELS: Record<"en" | "hi", Record<string, string>> = {
  en: {
    assigned: "Assigned",
    submitted: "Submitted",
    completed: "Completed",
    rejected: "Rejected",
  },
  hi: {
    assigned: "असाइन किया गया",
    submitted: "जमा किया गया",
    completed: "पूर्ण",
    rejected: "अस्वीकृत",
  },
};

/** Canonical values from UpdateInternshipStatusDto in the API. */
export const APPLICATION_STATUS_LABELS: Record<"en" | "hi", Record<string, string>> = {
  en: {
    pending: "Application received",
    reviewed: "Under review",
    accepted: "Accepted",
    rejected: "Not selected",
    waitlisted: "Waitlisted",
  },
  hi: {
    pending: "आवेदन प्राप्त हुआ",
    reviewed: "समीक्षा जारी",
    accepted: "चयनित",
    rejected: "चयन नहीं हुआ",
    waitlisted: "प्रतीक्षा सूची में",
  },
};

/** Canonical values from CreateInternshipApplicationDto.mode in the API. */
export const MODE_LABELS: Record<"en" | "hi", Record<string, string>> = {
  en: {
    offline: "Offline",
    hybrid: "Hybrid",
  },
  hi: {
    offline: "ऑफलाइन",
    hybrid: "हाइब्रिड",
  },
};

/** Canonical values from InternHelpTicket.status in the API schema. */
export const TICKET_STATUS_LABELS: Record<"en" | "hi", Record<string, string>> = {
  en: {
    open: "Open",
    in_progress: "In progress",
    resolved: "Resolved",
  },
  hi: {
    open: "खुला",
    in_progress: "प्रक्रिया में",
    resolved: "हल हो गया",
  },
};

/** Canonical values from InternResource.type in the API schema. */
export const RESOURCE_TYPE_LABELS: Record<"en" | "hi", Record<string, string>> = {
  en: {
    link: "Link",
    pdf: "PDF",
    video: "Video",
    doc: "Document",
  },
  hi: {
    link: "लिंक",
    pdf: "PDF",
    video: "वीडियो",
    doc: "दस्तावेज़",
  },
};

/** Canonical values from InternClass.type in the API schema. */
export const CLASS_TYPE_LABELS: Record<"en" | "hi", Record<string, string>> = {
  en: {
    recorded: "Recorded",
    live: "Live",
  },
  hi: {
    recorded: "रिकॉर्डेड",
    live: "लाइव",
  },
};

function labelFrom(
  map: Record<"en" | "hi", Record<string, string>>,
  value: string | null | undefined,
  lang: "en" | "hi",
) {
  const key = String(value || "").trim();
  return map[lang][key] || key || "—";
}

export function taskStatusLabel(value: string | null | undefined, lang: "en" | "hi") {
  return labelFrom(TASK_STATUS_LABELS, value, lang);
}

export function applicationStatusLabel(value: string | null | undefined, lang: "en" | "hi") {
  return labelFrom(APPLICATION_STATUS_LABELS, value, lang);
}

export function modeLabel(value: string | null | undefined, lang: "en" | "hi") {
  return labelFrom(MODE_LABELS, value, lang);
}

export function ticketStatusLabel(value: string | null | undefined, lang: "en" | "hi") {
  return labelFrom(TICKET_STATUS_LABELS, value, lang);
}

export function resourceTypeLabel(value: string | null | undefined, lang: "en" | "hi") {
  return labelFrom(RESOURCE_TYPE_LABELS, value, lang);
}

export function classTypeLabel(value: string | null | undefined, lang: "en" | "hi") {
  return labelFrom(CLASS_TYPE_LABELS, value, lang);
}

export function initialsFromName(name?: string) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "IN";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function firstName(name?: string) {
  return String(name || "").trim().split(/\s+/)[0] || "Intern";
}

export function upcomingLiveSessions(data: InternDash | null) {
  const now = Date.now();
  return (data?.classes.live || [])
    .filter((c) => {
      if (!c.scheduledAt) return true;
      return new Date(c.scheduledAt).getTime() >= now - 60 * 60 * 1000;
    })
    .sort((a, b) => {
      const ta = a.scheduledAt ? new Date(a.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
      const tb = b.scheduledAt ? new Date(b.scheduledAt).getTime() : Number.MAX_SAFE_INTEGER;
      return ta - tb;
    });
}

const SESSION_PLATFORMS: { host: string; label: string }[] = [
  { host: "meet.google.com", label: "Google Meet" },
  { host: "zoom.us", label: "Zoom" },
  { host: "teams.microsoft.com", label: "Microsoft Teams" },
  { host: "youtube.com", label: "YouTube" },
  { host: "youtu.be", label: "YouTube" },
];

/** Proper nouns, so the same label works in every language. */
export function sessionPlatformLabel(url?: string | null) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  let host = "";
  try {
    host = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).hostname.toLowerCase();
  } catch {
    return "";
  }
  const match = SESSION_PLATFORMS.find(
    (p) => host === p.host || host.endsWith(`.${p.host}`),
  );
  return match ? match.label : host.replace(/^www\./, "");
}

export function taskProgress(data: InternDash | null) {
  const tasks = data?.tasks || [];
  const total = data?.summary?.tasksTotal ?? tasks.length;
  const completed =
    data?.summary?.tasksCompleted ?? tasks.filter((t) => t.status === "completed").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pct };
}

export function attendanceProgress(data: InternDash | null) {
  const rows = data?.attendance || [];
  const total = data?.summary?.attendanceTotal ?? rows.length;
  const present =
    data?.summary?.attendancePresent ?? rows.filter((r) => r.present).length;
  return { total, present };
}

export function sortedModules(data: InternDash | null) {
  return [...(data?.modules || [])].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

/**
 * The API decides lock and completion from the intern's actual tasks, so this
 * only reshapes that answer for the UI.
 */
export function moduleUnlockState(mod: InternModule) {
  const done = mod.status === "done";
  return {
    unlocked: !mod.locked,
    done,
    locked: mod.locked,
    /** Waiting on the calendar rather than on unfinished work. */
    scheduled: mod.locked && mod.lockReason === "schedule",
    unlocksAt: mod.unlocksAt || null,
    current: !mod.locked && !done,
    inProgress: mod.status === "in_progress",
  };
}

/** Reads "Day 4 of 14" for the dashboard, or null before an intern has started. */
export function programmeDay(data: InternDash | null) {
  const schedule = data?.schedule;
  if (!schedule?.startAt || !schedule.dayNumber) return null;
  return { day: schedule.dayNumber, total: schedule.totalDays, endAt: schedule.endAt };
}

export function formatDayMonth(value: string | null | undefined, lang: "en" | "hi") {
  if (!value) return "";
  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return "";
  return at.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
  });
}

/** e.g. "Monday, 24 Aug · 9:00 AM IST" */
export function formatUnlockWhen(value: string | null | undefined, lang: "en" | "hi") {
  if (!value) return "";
  const at = new Date(value);
  if (Number.isNaN(at.getTime())) return "";
  const locale = lang === "hi" ? "hi-IN" : "en-IN";
  const day = at.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
  const time = at.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  return lang === "hi" ? `${day} · ${time} IST` : `${day} · ${time} IST`;
}

/** A task whose module has not opened yet cannot be submitted. */
export function taskIsLocked(task: InternDash["tasks"][number]) {
  return Boolean(task.locked);
}

export function currentModule(data: InternDash | null) {
  return sortedModules(data).find((m) => !m.locked && m.status !== "done") || null;
}

/** Open incomplete tasks for today (unlocked, not done). */
export function todaysOpenTasks(data: InternDash | null) {
  return (data?.tasks || [])
    .filter((t) => !taskIsLocked(t) && t.status !== "completed")
    .sort((a, b) => (a.task.dueAfterDays ?? 0) - (b.task.dueAfterDays ?? 0));
}

export function upcomingLockedTasks(data: InternDash | null) {
  return (data?.tasks || [])
    .filter((t) => taskIsLocked(t) && t.status !== "completed")
    .sort((a, b) => {
      const ta = a.opensAt ? new Date(a.opensAt).getTime() : 0;
      const tb = b.opensAt ? new Date(b.opensAt).getTime() : 0;
      return ta - tb;
    });
}

export function completedTasks(data: InternDash | null) {
  return (data?.tasks || []).filter((t) => t.status === "completed");
}

/**
 * Task/module copy is often EN then Hindi separated by a blank line.
 * Show only the language the intern is using.
 */
export function pickLocaleText(
  raw: string | null | undefined,
  lang: "en" | "hi",
): string {
  const text = String(raw || "").trim();
  if (!text) return "";
  const parts = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return text;
  const hasDevanagari = (s: string) => /[\u0900-\u097F]/.test(s);
  const hi = parts.find(hasDevanagari);
  const en = parts.find((p) => !hasDevanagari(p));
  if (lang === "hi") return hi || en || text;
  return en || hi || text;
}

/** Working-day label from dueAfterDays (0 → Day 1). */
export function taskDayLabel(
  dueAfterDays: number | null | undefined,
  isHi: boolean,
): string {
  if (dueAfterDays === null || dueAfterDays === undefined) return "";
  const n = dueAfterDays + 1;
  return isHi ? `दिन ${n}` : `Day ${n}`;
}

export function taskKindLabel(
  department: string | null | undefined,
  internDept: string | undefined,
  isHi: boolean,
): { label: string; hint: string } {
  if (!department) {
    return {
      label: isHi ? "सबके लिए" : "For everyone",
      hint: isHi
        ? "शुरुआत / अंत के साझा कदम — हर ट्रैक को ये करने हैं।"
        : "Shared start/end steps — every track does these.",
    };
  }
  return {
    label: isHi ? "आपके ट्रैक का काम" : "Your track work",
    hint: isHi
      ? "आवेदन पर चुने विभाग का असली PGP काम — इसलिए यही टास्क मिले।"
      : "Real PGP work for the department you chose at apply — that is why you see this.",
  };
}

export function journeyTitle(title: string) {
  return String(title || "").replace(/^\d+\.\s*/, "").trim();
}

/** Working-day index shown on the journey (Day 1 = first Mon–Sat). */
export function journeyDayNumber(mod: InternModule) {
  if (mod.unlockAfterDays !== null && mod.unlockAfterDays !== undefined) {
    return mod.unlockAfterDays + 1;
  }
  return mod.sortOrder;
}

export type SessionMode = "online" | "offline" | "hybrid";

export function sessionMode(session: {
  url?: string | null;
  venue?: string | null;
}): SessionMode {
  const online = Boolean(String(session.url || "").trim());
  const offline = Boolean(String(session.venue || "").trim());
  if (online && offline) return "hybrid";
  if (offline) return "offline";
  return "online";
}

export function sessionModeLabel(mode: SessionMode, isHi: boolean) {
  if (mode === "hybrid") return isHi ? "हाइब्रिड" : "Hybrid";
  if (mode === "offline") return isHi ? "ऑफलाइन" : "Offline";
  return isHi ? "ऑनलाइन" : "Online";
}

export function moduleProgress(data: InternDash | null) {
  const modules = data?.modules || [];
  const done = modules.filter((m) => m.status === "done").length;
  return {
    total: modules.length,
    done,
    pct: modules.length ? Math.round((done / modules.length) * 100) : 0,
  };
}

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
  taskTotal: number;
  taskCompleted: number;
  progressPct: number;
  completedAt?: string | null;
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
  classes: {
    recorded: {
      id: number;
      title: string;
      description?: string | null;
      url?: string | null;
    }[];
    live: {
      id: number;
      title: string;
      description?: string | null;
      url?: string | null;
      scheduledAt?: string | null;
    }[];
  };
  tasks: {
    assignmentId: number;
    status: string;
    proofUrl?: string | null;
    notes?: string | null;
    task: {
      id: number;
      title: string;
      description?: string | null;
      dueAt?: string | null;
      moduleId?: number | null;
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
    current: !mod.locked && !done,
    inProgress: mod.status === "in_progress",
  };
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

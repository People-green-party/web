/**
 * Admin notification helpers (backed by audit logs + local read state).
 */

export type AdminNotification = {
  id: number;
  action?: string;
  entityType?: string;
  entityId?: string | null;
  reason?: string | null;
  createdAt?: string;
  actor?: { name?: string | null } | null;
  metadata?: Record<string, unknown> | null;
};

const READ_KEY = "admin_notif_read_state_v1";

type ReadState = {
  /** Explicitly marked-read IDs */
  ids: number[];
  /** Everything at or below this ID is treated as read (Mark all) */
  allReadThroughId: number;
};

function emptyState(): ReadState {
  return { ids: [], allReadThroughId: 0 };
}

export function loadNotifReadState(): ReadState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      ids: Array.isArray(parsed?.ids)
        ? parsed.ids.map(Number).filter((n: number) => Number.isFinite(n))
        : [],
      allReadThroughId: Number(parsed?.allReadThroughId) || 0,
    };
  } catch {
    return emptyState();
  }
}

function saveNotifReadState(state: ReadState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(READ_KEY, JSON.stringify(state));
}

export function isNotificationRead(id: number, state?: ReadState): boolean {
  const s = state || loadNotifReadState();
  if (id <= s.allReadThroughId) return true;
  return s.ids.includes(id);
}

export function markNotificationRead(id: number): ReadState {
  const s = loadNotifReadState();
  if (id <= s.allReadThroughId || s.ids.includes(id)) return s;
  const next = { ...s, ids: [...s.ids, id].slice(-500) };
  saveNotifReadState(next);
  return next;
}

export function markAllNotificationsRead(notifications: AdminNotification[]): ReadState {
  const maxId = notifications.reduce((m, n) => Math.max(m, Number(n.id) || 0), 0);
  const next: ReadState = {
    ids: [],
    allReadThroughId: Math.max(loadNotifReadState().allReadThroughId, maxId),
  };
  saveNotifReadState(next);
  return next;
}

export function formatNotificationTitle(action?: string) {
  if (!action) return "Activity";
  return action.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export function formatNotificationBody(n: AdminNotification) {
  return (
    [n.entityType, n.entityId, n.reason].filter(Boolean).join(" · ") || "Admin action"
  );
}

/** Map an audit/notification item to the best admin destination. */
export function notificationHref(n: AdminNotification): string {
  const action = String(n.action || "").toUpperCase();
  const entity = String(n.entityType || "").toUpperCase();
  const id = String(n.entityId || "").trim();
  const numericId = /^\d+$/.test(id) ? id : "";

  if (action.includes("ELECTION") || action.includes("CANDIDATE") || entity === "ELECTION") {
    if (numericId) {
      if (action.includes("CLOSE") || action.includes("PROMOTE") || action.includes("RESULT")) {
        return `/admin/elections/${numericId}/results`;
      }
      if (action.includes("CANDIDATE")) {
        return `/admin/elections/${numericId}/candidates`;
      }
      return `/admin/elections/${numericId}/candidates`;
    }
    return "/admin/elections";
  }

  if (action.includes("SQUAD_MISSION") || entity === "SQUADMISSION") {
    return "/admin/youth/squad-missions";
  }
  if (action.includes("MISSION") && !action.includes("SQUAD")) {
    return "/admin/youth/missions";
  }
  if (action.includes("SQUAD") || entity === "SQUAD") {
    return "/admin/youth/squads";
  }

  if (
    action.includes("ISSUE") ||
    entity === "ISSUEREPORT" ||
    entity === "ISSUEACTION" ||
    action.includes("ESCALAT")
  ) {
    return "/admin/youth/action-queue";
  }

  if (action.includes("CAMPUS") || entity === "CAMPUSUNIT") {
    return "/admin/youth";
  }

  if (
    action.includes("YOUTH") ||
    action.includes("POINTS") ||
    action.includes("XP_") ||
    entity === "YOUTHPROFILE"
  ) {
    return "/admin/youth";
  }

  if (action.includes("COMMITTEE") || entity === "COMMITTEE") {
    return "/admin/committees";
  }

  if (action.includes("DONATION") || entity === "DONATION") {
    return "/admin/donations";
  }

  if (action.includes("ROLE") || action.includes("USER") || entity === "USER") {
    return "/admin/users";
  }

  if (action.includes("INTERNSHIP") || action.includes("LEADERSHIP") || entity.includes("ACADEMY")) {
    return "/admin/leadership-academy";
  }

  if (action.includes("NEWS") || entity === "NEWSARTICLE") {
    return "/admin/news";
  }

  return "/admin/notifications";
}

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ClipboardCheck, FileText, Layers, Loader2, Megaphone, Pencil, Search, Trash2, UserRound, UserMinus, Users, Video, X } from "lucide-react";
import { adminFetch, getAdminToken } from "@/lib/adminApi";
import { DEPARTMENTS } from "@/data/leadership-academy/departments";

type Application = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  college: string | null;
  department: string;
  mode: string;
  motivation?: string;
  status: string;
  certificateUrl?: string | null;
  photoUrl?: string | null;
  createdAt: string;
};

type HelpTicket = {
  id: number;
  subject: string;
  message: string;
  status: string;
  adminReply?: string | null;
  createdAt: string;
  application: {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    department: string;
    photoUrl?: string | null;
    status: string;
  };
};

type InternClass = {
  id: number;
  title: string;
  type: string;
  description?: string | null;
  url?: string | null;
  department?: string | null;
  scheduledAt?: string | null;
};

type InternTask = {
  id: number;
  title: string;
  description?: string | null;
  dueAt?: string | null;
  department?: string | null;
  moduleId?: number | null;
  _count?: { assignments: number };
};

type Assignment = {
  id: number;
  status: string;
  proofUrl?: string | null;
  notes?: string | null;
  task: { id: number; title: string };
  application: { id: number; fullName: string; phone: string; department: string };
};

type AttendanceRow = {
  id: number;
  present: boolean;
  date: string;
  notes?: string | null;
  application: { id: number; fullName: string; phone: string };
  class?: { title: string } | null;
};

type Mentor = {
  id: number;
  name: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  bio?: string | null;
  department?: string | null;
  active: boolean;
  _count?: { assignments: number };
  assignments?: {
    application: { id: number; fullName: string; department: string; status: string };
  }[];
};

type Announcement = {
  id: number;
  title: string;
  body: string;
  department?: string | null;
  pinned: boolean;
  createdAt: string;
};

type Resource = {
  id: number;
  title: string;
  url: string;
  description?: string | null;
  type: string;
  department?: string | null;
  createdAt: string;
};

type ModuleRow = {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  resourceUrl?: string | null;
  sortOrder: number;
  department?: string | null;
};

type RosterEntry = {
  id: number;
  fullName: string;
  department: string;
  photoUrl?: string | null;
  markedToday: boolean;
  present: boolean | null;
};

type EditField = {
  name: string;
  label: string;
  kind: "text" | "textarea" | "url" | "select" | "datetime" | "number" | "checkbox";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

type EditTarget = {
  endpoint: string;
  id: number;
  heading: string;
  fields: EditField[];
  values: Record<string, unknown>;
};

const DEPT_FIELD: EditField = {
  name: "department",
  label: "Department",
  kind: "select",
  options: [
    { value: "", label: "All departments" },
    ...DEPARTMENTS.map((d) => ({ value: d.slug, label: d.shortName })),
  ],
};

/** Quote every cell so commas, quotes and newlines in free text stay inside it. */
function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  // The BOM keeps Excel from mangling non-ASCII names.
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** datetime-local needs a local wall-clock string, not the ISO the API returns. */
function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function fromLocalInput(value: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const PAGE_SIZE = 50;

const STATUSES = ["pending", "reviewed", "accepted", "rejected", "waitlisted"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-sky-50 text-sky-700 border-sky-200",
  reviewed: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  waitlisted: "bg-purple-50 text-purple-700 border-purple-200",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "New",
  reviewed: "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
};

type Tab = "applications" | "classes" | "tasks" | "attendance" | "mentors" | "announcements" | "resources" | "modules" | "help";

function deptName(slug: string) {
  return DEPARTMENTS.find((d) => d.slug === slug)?.shortName || slug || "All";
}

function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminLeadershipAcademyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("applications");
  const [items, setItems] = useState<Application[]>([]);
  const [classes, setClasses] = useState<InternClass[]>([]);
  const [tasks, setTasks] = useState<InternTask[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [helpTickets, setHelpTickets] = useState<HelpTicket[]>([]);
  const [helpReplyDrafts, setHelpReplyDrafts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "submitted" | "assigned" | "completed" | "rejected">(
    "submitted",
  );
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [report, setReport] = useState<any>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);
  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
  const [acceptedInterns, setAcceptedInterns] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalApps, setTotalApps] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [assignmentTotal, setAssignmentTotal] = useState(0);
  const [attendanceTotal, setAttendanceTotal] = useState(0);
  const [helpTotal, setHelpTotal] = useState(0);

  const [classForm, setClassForm] = useState({
    title: "",
    type: "recorded",
    url: "",
    description: "",
    department: "",
    scheduledAt: "",
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueAt: "",
    department: "",
    moduleId: "",
    assignToAllAccepted: true,
  });
  const [attForm, setAttForm] = useState({
    applicationId: "",
    classId: "",
    date: todayISO(),
    present: true,
    notes: "",
  });
  const [certDrafts, setCertDrafts] = useState<Record<number, string>>({});

  const [assignTaskId, setAssignTaskId] = useState("");
  const [assignInternIds, setAssignInternIds] = useState<number[]>([]);

  const [mentorForm, setMentorForm] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    whatsapp: "",
    bio: "",
    department: "",
    active: true,
  });
  const [assignMentorId, setAssignMentorId] = useState("");
  const [assignMentorInternIds, setAssignMentorInternIds] = useState<number[]>([]);

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    body: "",
    department: "",
    pinned: false,
  });

  const [resourceForm, setResourceForm] = useState({
    title: "",
    url: "",
    type: "link",
    description: "",
    department: "",
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    content: "",
    resourceUrl: "",
    sortOrder: "0",
    department: "",
  });

  // A view-only admin should never be shown a control that will 403.
  const [canEdit, setCanEdit] = useState(true);
  useEffect(() => {
    const scope = sessionStorage.getItem("admin_access_scope");
    setCanEdit(scope !== "view");
  }, []);

  const [rosterClassId, setRosterClassId] = useState("");
  const [rosterPresent, setRosterPresent] = useState(true);
  const [rosterIds, setRosterIds] = useState<number[]>([]);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /** One mutation at a time, so a double click cannot create the record twice. */
  const run = async (key: string, fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy("");
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!getAdminToken()) {
        router.replace("/admin/login");
        return;
      }

      // A tab that fails to load must say so rather than look empty.
      const failed: string[] = [];
      const section = async <T,>(label: string, path: string): Promise<T[]> => {
        try {
          const rows = await adminFetch<T[]>(path);
          return Array.isArray(rows) ? rows : [];
        } catch {
          failed.push(label);
          return [];
        }
      };

      // These endpoints are paginated, so unwrap the envelope and keep the total.
      const paged = async <T,>(
        label: string,
        path: string,
      ): Promise<{ items: T[]; total: number }> => {
        try {
          const res = await adminFetch<{ items: T[]; total: number }>(path);
          return {
            items: Array.isArray(res?.items) ? res.items : [],
            total: Number(res?.total || 0),
          };
        } catch {
          failed.push(label);
          return { items: [], total: 0 };
        }
      };

      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (filter !== "All") query.set("status", filter);
      if (deptFilter !== "All") query.set("department", deptFilter);
      if (debouncedSearch.trim()) query.set("search", debouncedSearch.trim());

      const [apps, accepted, cls, tsk, asg, att, mnt, ann, res, mod, help] =
        await Promise.all([
          adminFetch<{ items: Application[]; total: number; pageCount: number }>(
            `leadership-academy/applications?${query}`,
          ),
          paged<Application>(
            "Accepted interns",
            "leadership-academy/applications?status=accepted&pageSize=200",
          ),
          section<InternClass>("Classes", "leadership-academy/classes"),
          section<InternTask>("Tasks", "leadership-academy/tasks"),
          paged<Assignment>("Submissions", "leadership-academy/task-assignments"),
          paged<AttendanceRow>("Attendance", "leadership-academy/attendance"),
          section<Mentor>("Mentors", "leadership-academy/mentors"),
          section<Announcement>("Announcements", "leadership-academy/announcements"),
          section<Resource>("Resources", "leadership-academy/resources"),
          section<ModuleRow>("Modules", "leadership-academy/modules"),
          paged<HelpTicket>("Help desk", "leadership-academy/help-tickets"),
        ]);

      setItems(Array.isArray(apps?.items) ? apps.items : []);
      setTotalApps(Number(apps?.total || 0));
      setPageCount(Math.max(1, Number(apps?.pageCount || 1)));
      setAcceptedInterns(accepted.items);
      setClasses(cls);
      setTasks(tsk);
      setAssignments(asg.items);
      setAssignmentTotal(asg.total);
      setAttendance(att.items);
      setAttendanceTotal(att.total);
      setMentors(mnt);
      setAnnouncements(ann);
      setResources(res);
      setModules(mod);
      setHelpTickets(help.items);
      setHelpTotal(help.total);
      setError(
        failed.length
          ? `Could not load: ${failed.join(", ")}. Those tabs are showing as empty — refresh to try again.`
          : "",
      );
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [router, page, filter, deptFilter, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  // Typing should not fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // A changed filter invalidates the page number.
  useEffect(() => {
    setPage(1);
  }, [filter, deptFilter, debouncedSearch]);

  const pendingReviewCount = useMemo(
    () => assignments.filter((a) => a.status === "submitted").length,
    [assignments],
  );

  // Filtering and search happen server side now, so the page is the list.
  const filtered = items;

  const shownIds = useMemo(() => filtered.map((a) => a.id), [filtered]);
  const allShownSelected =
    shownIds.length > 0 && shownIds.every((id) => selectedApps.includes(id));
  const someShownSelected = shownIds.some((id) => selectedApps.includes(id));

  const toggleSelectAllShown = () =>
    setSelectedApps((ids) =>
      allShownSelected
        ? ids.filter((id) => !shownIds.includes(id))
        : [...new Set([...ids, ...shownIds])],
    );

  // A hidden row must not stay silently selected when filters change.
  useEffect(() => {
    setSelectedApps((ids) => ids.filter((id) => shownIds.includes(id)));
  }, [shownIds]);

  const filteredAssignments = useMemo(() => {
    if (assignmentFilter === "all") return assignments;
    return assignments.filter((a) => a.status === assignmentFilter);
  }, [assignments, assignmentFilter]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await adminFetch(`leadership-academy/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      showToast(`#${id} → ${STATUS_LABEL[status] || status}`);
      await load();
    } catch (e: any) {
      showToast(e.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const bulkUpdateStatus = (status: string) => {
    if (!selectedApps.length) return;
    const label = STATUS_LABEL[status] || status;
    if (
      !window.confirm(
        `Set ${selectedApps.length} application(s) to “${label}”? Each person is emailed and notified.`,
      )
    )
      return;
    return run("bulk-status", async () => {
      try {
        const res = await adminFetch<{
          updated: number;
          unchanged: number;
          emailed: number;
          failed: { id: number; reason: string }[];
        }>("leadership-academy/applications/bulk-status", {
          method: "PATCH",
          body: JSON.stringify({ applicationIds: selectedApps, status }),
        });
        const parts = [`${res.updated} set to ${label}`];
        if (res.unchanged) parts.push(`${res.unchanged} already were`);
        if (res.emailed) parts.push(`${res.emailed} emailed`);
        if (res.failed?.length) parts.push(`${res.failed.length} failed`);
        showToast(parts.join(" · "));
        setSelectedApps([]);
        await load();
      } catch (e: any) {
        showToast(e.message || "Bulk update failed");
      }
    });
  };

  const certValue = (app: Application) => certDrafts[app.id] ?? app.certificateUrl ?? "";

  const saveCertificate = (app: Application) =>
    run(`cert-${app.id}`, async () => {
      const next = certValue(app).trim();
      const current = (app.certificateUrl || "").trim();
      if (next === current) {
        showToast("Certificate link unchanged");
        return;
      }
      if (!next && current) {
        const ok = window.confirm(
          `Remove the certificate link for ${app.fullName} (#${app.id})?`,
        );
        if (!ok) return;
      }
      try {
        await adminFetch(`leadership-academy/applications/${app.id}/certificate`, {
          method: "PATCH",
          body: JSON.stringify({ certificateUrl: next || null }),
        });
        setCertDrafts((d) => {
          const rest = { ...d };
          delete rest[app.id];
          return rest;
        });
        showToast(next ? `Certificate saved for #${app.id}` : `Certificate removed for #${app.id}`);
        await load();
      } catch (e: any) {
        showToast(e.message || "Certificate save failed");
      }
    });

  const editClass = (c: InternClass) =>
    setEditing({
      endpoint: "leadership-academy/classes",
      id: c.id,
      heading: "Edit class",
      fields: [
        { name: "title", label: "Title", kind: "text", required: true },
        {
          name: "type",
          label: "Type",
          kind: "select",
          options: [
            { value: "recorded", label: "Recorded" },
            { value: "live", label: "Live" },
          ],
        },
        { name: "description", label: "Description", kind: "textarea" },
        { name: "url", label: "Link", kind: "url", placeholder: "https://…" },
        DEPT_FIELD,
        { name: "scheduledAt", label: "Scheduled at", kind: "datetime" },
      ],
      values: {
        title: c.title,
        type: c.type,
        description: c.description || "",
        url: c.url || "",
        department: c.department || "",
        scheduledAt: toLocalInput(c.scheduledAt),
      },
    });

  const editTask = (t: InternTask) =>
    setEditing({
      endpoint: "leadership-academy/tasks",
      id: t.id,
      heading: "Edit task",
      fields: [
        { name: "title", label: "Title", kind: "text", required: true },
        { name: "description", label: "Description", kind: "textarea" },
        DEPT_FIELD,
        {
          name: "moduleId",
          label: "Module",
          kind: "select",
          options: [
            { value: "", label: "Not part of a module" },
            ...[...modules]
              .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
              .map((m) => ({ value: String(m.id), label: `#${m.sortOrder} · ${m.title}` })),
          ],
        },
        { name: "dueAt", label: "Due at", kind: "datetime" },
      ],
      values: {
        title: t.title,
        description: t.description || "",
        department: t.department || "",
        moduleId: t.moduleId ? String(t.moduleId) : "",
        dueAt: toLocalInput(t.dueAt),
      },
    });

  const editMentor = (m: Mentor) =>
    setEditing({
      endpoint: "leadership-academy/mentors",
      id: m.id,
      heading: "Edit mentor",
      fields: [
        { name: "name", label: "Name", kind: "text", required: true },
        { name: "title", label: "Role / title", kind: "text" },
        { name: "email", label: "Email", kind: "text" },
        { name: "phone", label: "Phone", kind: "text" },
        { name: "whatsapp", label: "WhatsApp", kind: "text" },
        { name: "bio", label: "Bio", kind: "textarea" },
        DEPT_FIELD,
        {
          name: "active",
          label: "Status",
          kind: "checkbox",
          placeholder: "Active — shown to interns",
        },
      ],
      values: {
        name: m.name,
        title: m.title || "",
        email: m.email || "",
        phone: m.phone || "",
        whatsapp: m.whatsapp || "",
        bio: m.bio || "",
        department: m.department || "",
        active: m.active,
      },
    });

  const editAnnouncement = (a: Announcement) =>
    setEditing({
      endpoint: "leadership-academy/announcements",
      id: a.id,
      heading: "Edit announcement",
      fields: [
        { name: "title", label: "Title", kind: "text", required: true },
        { name: "body", label: "Body", kind: "textarea", required: true },
        DEPT_FIELD,
        { name: "pinned", label: "Pinned", kind: "checkbox", placeholder: "Pin to the top" },
      ],
      values: {
        title: a.title,
        body: a.body,
        department: a.department || "",
        pinned: a.pinned,
      },
    });

  const editResource = (r: Resource) =>
    setEditing({
      endpoint: "leadership-academy/resources",
      id: r.id,
      heading: "Edit resource",
      fields: [
        { name: "title", label: "Title", kind: "text", required: true },
        { name: "url", label: "Link", kind: "url", required: true },
        { name: "description", label: "Description", kind: "textarea" },
        {
          name: "type",
          label: "Type",
          kind: "select",
          options: [
            { value: "link", label: "Link" },
            { value: "doc", label: "Document" },
            { value: "video", label: "Video" },
          ],
        },
        DEPT_FIELD,
      ],
      values: {
        title: r.title,
        url: r.url,
        description: r.description || "",
        type: r.type || "link",
        department: r.department || "",
      },
    });

  const editModule = (m: ModuleRow) =>
    setEditing({
      endpoint: "leadership-academy/modules",
      id: m.id,
      heading: "Edit module",
      fields: [
        { name: "title", label: "Title", kind: "text", required: true },
        { name: "description", label: "Short description", kind: "textarea" },
        { name: "content", label: "Module content", kind: "textarea" },
        { name: "resourceUrl", label: "Resource link", kind: "url" },
        { name: "sortOrder", label: "Sort order", kind: "number" },
        DEPT_FIELD,
      ],
      values: {
        title: m.title,
        description: m.description || "",
        content: m.content || "",
        resourceUrl: m.resourceUrl || "",
        sortOrder: m.sortOrder,
        department: m.department || "",
      },
    });

  const openReport = async (id: number) => {
    try {
      const data = await adminFetch(`leadership-academy/applications/${id}/report`);
      setReport(data);
    } catch (e: any) {
      showToast(e.message || "Report failed");
    }
  };

  const setCertificateApproval = (id: number, approved: boolean) =>
    run("cert-approve", async () => {
      try {
        await adminFetch(`leadership-academy/applications/${id}/certificate-approval`, {
          method: "PATCH",
          body: JSON.stringify({ approved }),
        });
        showToast(approved ? "Certificate approved" : "Approval withdrawn");
        await openReport(id);
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });

  const createClass = (e: React.FormEvent) => {
    e.preventDefault();
    return run("class", async () => {
      try {
        await adminFetch("leadership-academy/classes", {
          method: "POST",
          body: JSON.stringify({
            ...classForm,
            department: classForm.department || undefined,
            scheduledAt: classForm.scheduledAt || undefined,
          }),
        });
        setClassForm({ title: "", type: "recorded", url: "", description: "", department: "", scheduledAt: "" });
        showToast("Class created");
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });
  };

  const deleteClass = (id: number, title: string) => {
    if (!window.confirm(`Delete class “${title}”?`)) return;
    return run(`class-${id}`, async () => {
      try {
        await adminFetch(`leadership-academy/classes/${id}`, { method: "DELETE" });
        showToast("Class deleted");
        await load();
      } catch (err: any) {
        showToast(err.message || "Delete failed");
      }
    });
  };

  const deleteTask = (task: InternTask) => {
    const count = task._count?.assignments || 0;
    const warning = count
      ? `Delete task “${task.title}”? This also removes ${count} assignment(s) and any proof already submitted.`
      : `Delete task “${task.title}”?`;
    if (!window.confirm(warning)) return;
    return run(`task-${task.id}`, async () => {
      try {
        await adminFetch(`leadership-academy/tasks/${task.id}`, { method: "DELETE" });
        showToast("Task deleted");
        await load();
      } catch (err: any) {
        showToast(err.message || "Delete failed");
      }
    });
  };

  const createTask = (e: React.FormEvent) => {
    e.preventDefault();
    return run("task", async () => {
      try {
        await adminFetch("leadership-academy/tasks", {
          method: "POST",
          body: JSON.stringify({
            ...taskForm,
            department: taskForm.department || undefined,
            dueAt: taskForm.dueAt || undefined,
            moduleId: taskForm.moduleId ? Number(taskForm.moduleId) : undefined,
          }),
        });
        setTaskForm({
          title: "",
          description: "",
          dueAt: "",
          department: "",
          moduleId: "",
          assignToAllAccepted: true,
        });
        showToast("Task created");
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });
  };

  const reviewAssignment = (id: number, status: "completed" | "rejected") => {
    let notes: string | undefined;
    if (status === "rejected") {
      const typed = window.prompt("Feedback for the intern (required for reject):", "");
      notes = String(typed || "").trim();
      if (!notes) {
        showToast("Reject cancelled — feedback note is required");
        return;
      }
    } else {
      const typed = window.prompt("Optional mentor note for the intern:", "");
      notes = String(typed || "").trim() || undefined;
    }
    return run(`review-${id}`, async () => {
      try {
        await adminFetch(`leadership-academy/task-assignments/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status, notes }),
        });
        showToast(`Assignment #${id} → ${status}`);
        await load();
      } catch (e: any) {
        showToast(e.message || "Failed");
      }
    });
  };

  const assignSelectedInterns = () => {
    const taskId = Number(assignTaskId);
    if (!taskId || assignInternIds.length === 0) {
      showToast("Pick a task and at least one intern");
      return;
    }
    return run("assign-task", async () => {
      try {
        await adminFetch(`leadership-academy/tasks/${taskId}/assign`, {
          method: "POST",
          body: JSON.stringify({ applicationIds: assignInternIds }),
        });
        showToast(`Assigned to ${assignInternIds.length} intern(s)`);
        setAssignInternIds([]);
        await load();
      } catch (e: any) {
        showToast(e.message || "Assign failed");
      }
    });
  };

  const markAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    return run("attendance", async () => {
      try {
        const saved = await adminFetch<{ duplicate?: boolean }>("leadership-academy/attendance", {
          method: "POST",
          body: JSON.stringify({
            applicationId: Number(attForm.applicationId),
            classId: attForm.classId ? Number(attForm.classId) : undefined,
            date: attForm.date || undefined,
            present: attForm.present,
            notes: attForm.notes || undefined,
          }),
        });
        showToast(
          saved?.duplicate
            ? "Attendance already recorded for that day — updated it"
            : "Attendance saved",
        );
        setAttForm({ applicationId: "", classId: "", date: todayISO(), present: true, notes: "" });
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });
  };

  const loadRoster = useCallback(async (classId: string) => {
    setRosterLoading(true);
    try {
      const query = classId ? `?classId=${classId}` : "";
      const data = await adminFetch<{ items: RosterEntry[] }>(
        `leadership-academy/attendance/roster${query}`,
      );
      const items = Array.isArray(data?.items) ? data.items : [];
      setRoster(items);
      // Pre-select whoever is not marked yet, since that is the usual intent.
      setRosterIds(items.filter((i) => !i.markedToday).map((i) => i.id));
    } catch (err: any) {
      showToast(err.message || "Could not load the roster");
      setRoster([]);
    } finally {
      setRosterLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "attendance") loadRoster(rosterClassId);
  }, [tab, rosterClassId, loadRoster]);

  const markRoster = () =>
    run("roster", async () => {
      if (!rosterIds.length) {
        showToast("Select at least one intern");
        return;
      }
      try {
        const res = await adminFetch<{ created: number; updated: number; failed: any[] }>(
          "leadership-academy/attendance/bulk",
          {
            method: "POST",
            body: JSON.stringify({
              applicationIds: rosterIds,
              classId: rosterClassId ? Number(rosterClassId) : undefined,
              present: rosterPresent,
            }),
          },
        );
        const failed = res.failed?.length ? `, ${res.failed.length} failed` : "";
        showToast(`${res.created} marked, ${res.updated} updated${failed}`);
        await Promise.all([loadRoster(rosterClassId), load()]);
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });

  const exportApplicationsCsv = () =>
    run("export", async () => {
      try {
        const query = new URLSearchParams({ page: "1", pageSize: "1000" });
        if (filter !== "All") query.set("status", filter);
        if (deptFilter !== "All") query.set("department", deptFilter);
        if (debouncedSearch.trim()) query.set("search", debouncedSearch.trim());

        const data = await adminFetch<{ items: Application[] }>(
          `leadership-academy/applications?${query}`,
        );
        const rows = Array.isArray(data?.items) ? data.items : [];
        if (!rows.length) {
          showToast("Nothing to export");
          return;
        }

        downloadCsv(
          `internship-applications-${todayISO()}.csv`,
          ["ID", "Name", "Email", "Phone", "City", "College", "Department", "Mode", "Status", "Applied"],
          rows.map((r) => [
            r.id,
            r.fullName,
            r.email,
            r.phone,
            r.city,
            r.college || "",
            deptName(r.department),
            r.mode,
            r.status,
            fmtDate(r.createdAt),
          ]),
        );
        showToast(`Exported ${rows.length} applications`);
      } catch (err: any) {
        showToast(err.message || "Export failed");
      }
    });

  const exportReportCsv = () => {
    if (!report) return;
    const app = report.application || {};
    const tasks = Array.isArray(report.tasks) ? report.tasks : [];
    const attendanceRows = Array.isArray(report.attendance) ? report.attendance : [];
    const moduleRows = Array.isArray(report.modules) ? report.modules : [];

    downloadCsv(
      `intern-${app.id}-report.csv`,
      ["Section", "Item", "Status", "Detail"],
      [
        ...moduleRows.map((m: any) => [
          "Module",
          m.title,
          m.status,
          `${m.taskCompleted}/${m.taskTotal} tasks`,
        ]),
        ...tasks.map((t: any) => [
          "Task",
          t.task?.title || "",
          t.status,
          t.proofUrl || "",
        ]),
        ...attendanceRows.map((a: any) => [
          "Attendance",
          a.class?.title || "General",
          a.present ? "present" : "absent",
          fmtDate(a.date),
        ]),
      ],
    );
  };

  const createMentor = (e: React.FormEvent) => {
    e.preventDefault();
    return run("mentor", async () => {
      try {
        await adminFetch("leadership-academy/mentors", {
          method: "POST",
          body: JSON.stringify({
            ...mentorForm,
            department: mentorForm.department || undefined,
            title: mentorForm.title || undefined,
            email: mentorForm.email || undefined,
            phone: mentorForm.phone || undefined,
            whatsapp: mentorForm.whatsapp || undefined,
            bio: mentorForm.bio || undefined,
          }),
        });
        setMentorForm({
          name: "",
          title: "",
          email: "",
          phone: "",
          whatsapp: "",
          bio: "",
          department: "",
          active: true,
        });
        showToast("Mentor created");
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });
  };

  const deleteMentor = (id: number, name: string) => {
    if (!window.confirm(`Delete mentor “${name}”?`)) return;
    return run(`mentor-${id}`, async () => {
      try {
        await adminFetch(`leadership-academy/mentors/${id}`, { method: "DELETE" });
        showToast("Mentor deleted");
        await load();
      } catch (err: any) {
        showToast(err.message || "Delete failed");
      }
    });
  };

  const unassignMentor = (mentorId: number, applicationId: number, internName: string) => {
    if (!window.confirm(`Remove ${internName} from this mentor?`)) return;
    return run(`unassign-${mentorId}-${applicationId}`, async () => {
      try {
        await adminFetch(
          `leadership-academy/mentors/${mentorId}/assignments/${applicationId}`,
          { method: "DELETE" },
        );
        showToast(`${internName} unassigned`);
        await load();
      } catch (err: any) {
        showToast(err.message || "Unassign failed");
      }
    });
  };

  const assignMentorToInterns = () => {
    const mentorId = Number(assignMentorId);
    if (!mentorId || assignMentorInternIds.length === 0) {
      showToast("Pick a mentor and at least one intern");
      return;
    }
    return run("assign-mentor", async () => {
      try {
        await adminFetch(`leadership-academy/mentors/${mentorId}/assign`, {
          method: "POST",
          body: JSON.stringify({ applicationIds: assignMentorInternIds }),
        });
        showToast(`Assigned mentor to ${assignMentorInternIds.length} intern(s)`);
        setAssignMentorInternIds([]);
        await load();
      } catch (e: any) {
        showToast(e.message || "Assign failed");
      }
    });
  };

  const createAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    return run("announcement", async () => {
      try {
        await adminFetch("leadership-academy/announcements", {
          method: "POST",
          body: JSON.stringify({
            ...announcementForm,
            department: announcementForm.department || undefined,
          }),
        });
        setAnnouncementForm({ title: "", body: "", department: "", pinned: false });
        showToast("Announcement posted");
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });
  };

  const deleteAnnouncement = (id: number, title: string) => {
    if (!window.confirm(`Delete announcement “${title}”?`)) return;
    return run(`announcement-${id}`, async () => {
      try {
        await adminFetch(`leadership-academy/announcements/${id}`, { method: "DELETE" });
        showToast("Announcement deleted");
        await load();
      } catch (err: any) {
        showToast(err.message || "Delete failed");
      }
    });
  };

  const createResource = (e: React.FormEvent) => {
    e.preventDefault();
    return run("resource", async () => {
      try {
        await adminFetch("leadership-academy/resources", {
          method: "POST",
          body: JSON.stringify({
            ...resourceForm,
            department: resourceForm.department || undefined,
            description: resourceForm.description || undefined,
          }),
        });
        setResourceForm({ title: "", url: "", type: "link", description: "", department: "" });
        showToast("Resource created");
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });
  };

  const deleteResource = (id: number, title: string) => {
    if (!window.confirm(`Delete resource “${title}”?`)) return;
    return run(`resource-${id}`, async () => {
      try {
        await adminFetch(`leadership-academy/resources/${id}`, { method: "DELETE" });
        showToast("Resource deleted");
        await load();
      } catch (err: any) {
        showToast(err.message || "Delete failed");
      }
    });
  };

  const createModule = (e: React.FormEvent) => {
    e.preventDefault();
    return run("module", async () => {
      try {
        await adminFetch("leadership-academy/modules", {
          method: "POST",
          body: JSON.stringify({
            title: moduleForm.title,
            description: moduleForm.description || undefined,
            content: moduleForm.content || undefined,
            resourceUrl: moduleForm.resourceUrl || undefined,
            sortOrder: Number(moduleForm.sortOrder) || 0,
            department: moduleForm.department || undefined,
          }),
        });
        setModuleForm({
          title: "",
          description: "",
          content: "",
          resourceUrl: "",
          sortOrder: "0",
          department: "",
        });
        showToast("Module created");
        await load();
      } catch (err: any) {
        showToast(err.message || "Failed");
      }
    });
  };

  const deleteModule = (id: number, title: string) => {
    if (!window.confirm(`Delete module “${title}”?`)) return;
    return run(`module-${id}`, async () => {
      try {
        await adminFetch(`leadership-academy/modules/${id}`, { method: "DELETE" });
        showToast("Module deleted");
        await load();
      } catch (err: any) {
        showToast(err.message || "Delete failed");
      }
    });
  };

  const tabs: { key: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "applications", label: "Applications", count: items.length, icon: <Users size={14} /> },
    { key: "classes", label: "Classes", count: classes.length, icon: <Video size={14} /> },
    {
      key: "tasks",
      label: "Tasks",
      count: pendingReviewCount,
      icon: <ClipboardCheck size={14} />,
    },
    {
      key: "attendance",
      label: "Attendance",
      count: attendance.length,
      icon: <FileText size={14} />,
    },
    { key: "mentors", label: "Mentors", count: mentors.length, icon: <UserRound size={14} /> },
    {
      key: "announcements",
      label: "Announcements",
      count: announcements.length,
      icon: <Megaphone size={14} />,
    },
    { key: "resources", label: "Resources", count: resources.length, icon: <BookOpen size={14} /> },
    { key: "modules", label: "Modules", count: modules.length, icon: <Layers size={14} /> },
    {
      key: "help",
      label: "Help Desk",
      count: helpTickets.filter((h) => h.status !== "resolved").length,
      icon: <Megaphone size={14} />,
    },
  ];

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 font-['Familjen_Grotesk']">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#04330B]">Internships Admin</h2>
          <p className="text-sm text-[#587E67] font-medium mt-1">
            Review applications → accept interns → assign classes/tasks → mark attendance → issue certificates.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="shrink-0 h-10 px-4 rounded-xl border border-[#B9D3C4] text-sm font-bold text-[#04330B] hover:bg-[#F8FBF9]"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
          <p className="text-[11px] font-bold uppercase text-[#587E67]">Pending apps</p>
          <p className="mt-1 text-2xl font-black text-[#0D5229]">
            {items.filter((a) => a.status === "pending").length}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
          <p className="text-[11px] font-bold uppercase text-[#587E67]">Accepted interns</p>
          <p className="mt-1 text-2xl font-black text-[#0D5229]">{acceptedInterns.length}</p>
        </div>
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
          <p className="text-[11px] font-bold uppercase text-[#587E67]">Proofs to review</p>
          <p className="mt-1 text-2xl font-black text-amber-700">{pendingReviewCount}</p>
        </div>
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-4">
          <p className="text-[11px] font-bold uppercase text-[#587E67]">Classes live</p>
          <p className="mt-1 text-2xl font-black text-[#0D5229]">{classes.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              tab === t.key
                ? "bg-[#04330B] text-white border-[#04330B]"
                : "bg-white border-[#DDEEE4] text-[#04330B] hover:bg-[#F8FBF9]"
            }`}
          >
            {t.icon}
            {t.label}
            <span
              className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] ${
                tab === t.key ? "bg-white/20" : "bg-[#F1FBF6] text-[#0D5229]"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {!canEdit ? (
        <p className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm font-semibold">
          You are signed in with view-only access. You can read and export everything
          here, but creating and editing is turned off.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-semibold">
          {error}
        </p>
      ) : null}

      {tab === "applications" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: "All", label: "Total", count: items.length },
              ...STATUSES.map((s) => ({
                key: s,
                label: STATUS_LABEL[s],
                count: items.filter((a) => a.status === s).length,
              })),
            ].map((card) => (
              <button
                key={card.key}
                type="button"
                onClick={() => setFilter(card.key)}
                className={`rounded-2xl border p-4 text-left ${
                  filter === card.key ? "border-[#16A34A] bg-[#EAF7EE]" : "border-[#E4F2EA] bg-white"
                }`}
              >
                <p className="text-[11px] font-bold text-[#587E67] uppercase">{card.label}</p>
                <p className="mt-2 text-2xl font-black text-[#0D5229]">{card.count}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 md:max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, email…"
                className="w-full h-10 rounded-xl border border-[#DDEEE4] bg-white pl-9 pr-3 text-sm font-medium outline-none focus:border-[#16A34A]"
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 rounded-xl border border-[#DDEEE4] bg-white px-3 text-sm font-semibold text-[#04330B]"
            >
              <option value="All">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.shortName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={exportApplicationsCsv}
              disabled={busy === "export"}
              className="h-10 px-4 rounded-xl border border-[#DDEEE4] bg-white text-sm font-bold text-[#04330B] hover:bg-[#F8FBF9] disabled:opacity-50"
            >
              {busy === "export" ? "Exporting…" : "Export CSV"}
            </button>
          </div>

          {selectedApps.length > 0 && canEdit ? (
            <div className="rounded-2xl border border-[#B9D3C4] bg-[#F8FBF9] p-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#04330B]">
                {selectedApps.length} selected
              </span>
              <div className="flex-1" />
              {(["accepted", "waitlisted", "rejected", "reviewed"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => bulkUpdateStatus(s)}
                  disabled={busy === "bulk-status"}
                  className="h-9 px-3 rounded-lg border border-[#B9D3C4] bg-white text-xs font-bold text-[#04330B] hover:bg-[#F0F5F2] disabled:opacity-50"
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedApps([])}
                disabled={busy === "bulk-status"}
                className="h-9 px-3 rounded-lg text-xs font-bold text-[#587E67] hover:underline disabled:opacity-50"
              >
                Clear
              </button>
              {busy === "bulk-status" ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#587E67]">
                  <Loader2 className="animate-spin" size={13} /> Updating and emailing…
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-2xl border border-[#E4F2EA] bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#587E67] gap-2 font-semibold">
                <Loader2 className="animate-spin" size={18} /> Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto h-24 w-24 portal-empty-float">
                  <img
                    src="/internship/portal/empty/empty-mentors.png"
                    alt=""
                    aria-hidden
                    className="h-full w-full object-contain select-none"
                    draggable={false}
                  />
                </div>
                <p className="mt-4 text-[#04330B] font-bold">No applications found.</p>
                <p className="mt-1 text-sm font-semibold text-[#587E67]">
                  Try clearing the filters or search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-[#F8FBF9] border-b border-[#E4F2EA] text-[11px] uppercase text-[#587E67]">
                    <tr>
                      <th className="pl-4 py-3 font-bold w-8">
                        <input
                          type="checkbox"
                          aria-label="Select all shown"
                          checked={allShownSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someShownSelected && !allShownSelected;
                          }}
                          onChange={toggleSelectAllShown}
                        />
                      </th>
                      <th className="px-4 py-3 font-bold sticky left-0 bg-[#F8FBF9]">Applicant</th>
                      <th className="px-4 py-3 font-bold">Department</th>
                      <th className="px-4 py-3 font-bold">Applied</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app) => (
                      <tr key={app.id} className="border-b border-[#F0F5F2] align-top hover:bg-[#FAFCFB]">
                        <td className="pl-4 py-4">
                          <input
                            type="checkbox"
                            aria-label={`Select ${app.fullName}`}
                            checked={selectedApps.includes(app.id)}
                            onChange={() =>
                              setSelectedApps((ids) =>
                                ids.includes(app.id)
                                  ? ids.filter((x) => x !== app.id)
                                  : [...ids, app.id],
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-4 sticky left-0 bg-white">
                          <div className="flex items-start gap-3">
                            {app.photoUrl ? (
                              <img src={app.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover border border-[#DCEBE2] shrink-0" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#0B5A2A] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {(app.fullName || "?").split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "IN"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-[#04330B]">
                                #{app.id} · {app.fullName}
                              </p>
                              <p className="text-xs text-[#587E67] font-semibold mt-0.5">{app.phone}</p>
                              <p className="text-xs text-[#587E67]">{app.email}</p>
                              <p className="text-xs text-[#94A3B8] mt-0.5">
                                {app.city}
                                {app.college ? ` · ${app.college}` : ""} · {app.mode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-[#04330B]">{deptName(app.department)}</p>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-[#587E67]">
                          {fmtDate(app.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex text-[11px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                              STATUS_STYLE[app.status] || "bg-gray-100"
                            }`}
                          >
                            {STATUS_LABEL[app.status] || app.status}
                          </span>
                          <select
                            value={app.status}
                            disabled={updatingId === app.id}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            className="mt-2 block w-full max-w-[160px] h-9 rounded-lg border border-[#DDEEE4] px-2 text-xs font-semibold disabled:opacity-50"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 space-y-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailApp(app)}
                            className="block text-xs font-bold text-[#04330B] hover:underline"
                          >
                            View details
                          </button>
                          <button
                            type="button"
                            onClick={() => openReport(app.id)}
                            className="block text-xs font-bold text-[#0D5229] hover:underline"
                          >
                            Progress report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && totalApps > 0 ? (
              <div className="border-t border-[#F0F5F2] px-4 py-3 flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold text-[#587E67]">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, totalApps)} of {totalApps}
                </p>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="h-9 px-3 rounded-lg border border-[#B9D3C4] text-xs font-bold text-[#04330B] disabled:opacity-40 hover:bg-[#F8FBF9]"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-bold text-[#587E67]">
                    Page {page} of {pageCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={page >= pageCount}
                    className="h-9 px-3 rounded-lg border border-[#B9D3C4] text-xs font-bold text-[#04330B] disabled:opacity-40 hover:bg-[#F8FBF9]"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}

      {tab === "classes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form hidden={!canEdit} onSubmit={createClass} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Add class</h3>
            <input
              required
              placeholder="Title"
              value={classForm.title}
              onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <select
              value={classForm.type}
              onChange={(e) => setClassForm({ ...classForm, type: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="recorded">Recorded</option>
              <option value="live">Live</option>
            </select>
            <select
              value={classForm.department}
              onChange={(e) => setClassForm({ ...classForm, department: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.shortName}
                </option>
              ))}
            </select>
            <input
              placeholder="URL (video / meet link)"
              value={classForm.url}
              onChange={(e) => setClassForm({ ...classForm, url: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <input
              type="datetime-local"
              value={classForm.scheduledAt}
              onChange={(e) => setClassForm({ ...classForm, scheduledAt: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <textarea
              placeholder="Description"
              value={classForm.description}
              onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
              className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
              rows={3}
            />
            <button
              type="submit"
              disabled={busy === "class"}
              className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy === "class" ? "Creating…" : "Create class"}
            </button>
          </form>
          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">All classes ({classes.length})</h3>
            {classes.length === 0 ? (
              <p className="text-sm text-[#94A3B8] font-semibold">No classes yet.</p>
            ) : (
              classes.map((c) => (
                <div key={c.id} className="rounded-xl border border-[#F0F5F2] p-3 flex gap-3 justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#04330B]">
                      {c.title}{" "}
                      <span className="text-[10px] uppercase text-[#16A34A]">{c.type}</span>
                    </p>
                    <p className="text-xs text-[#587E67] mt-0.5">
                      {c.department ? deptName(c.department) : "All departments"}
                      {c.scheduledAt ? ` · ${fmtDate(c.scheduledAt)}` : ""}
                    </p>
                    {c.url && (
                      <a
                        href={c.url}
                        className="text-xs text-[#0D5229] underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open link
                      </a>
                    )}
                  </div>
                  <div hidden={!canEdit} className="shrink-0 flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={() => editClass(c)}
                      className="p-2 rounded-lg border border-[#DDEEE4] text-[#0D5229] hover:bg-[#F8FBF9]"
                      title="Edit class"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteClass(c.id, c.title)}
                      disabled={busy === `class-${c.id}`}
                      className="p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40"
                      title="Delete class"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "tasks" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <form hidden={!canEdit} onSubmit={createTask} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
              <h3 className="font-black text-[#04330B]">Create & assign task</h3>
              <input
                required
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
              <textarea
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
                rows={3}
              />
              <select
                value={taskForm.department}
                onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              >
                <option value="">All departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.shortName}
                  </option>
                ))}
              </select>
              <select
                value={taskForm.moduleId}
                onChange={(e) => setTaskForm({ ...taskForm, moduleId: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              >
                <option value="">Not part of a module</option>
                {[...modules]
                  .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      #{m.sortOrder} · {m.title}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-[#94A3B8] font-semibold">
                Tasks linked to a module drive that module&apos;s progress for the intern.
              </p>
              <input
                type="datetime-local"
                value={taskForm.dueAt}
                onChange={(e) => setTaskForm({ ...taskForm, dueAt: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-[#04330B]">
                <input
                  type="checkbox"
                  checked={taskForm.assignToAllAccepted}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, assignToAllAccepted: e.target.checked })
                  }
                />
                Auto-assign to all accepted interns
              </label>
              <button
                type="submit"
                disabled={busy === "task"}
                className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
              >
                {busy === "task" ? "Creating…" : "Create task"}
              </button>
            </form>

            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
              <h3 className="font-black text-[#04330B]">Task templates ({tasks.length})</h3>
              {tasks.length === 0 ? (
                <p className="text-sm text-[#94A3B8] font-semibold">No tasks created yet.</p>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-[#F0F5F2] p-3 flex gap-3 justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#04330B]">{t.title}</p>
                      <p className="text-xs text-[#587E67] mt-0.5">
                        {t.department ? deptName(t.department) : "All"} ·{" "}
                        {t._count?.assignments ?? 0} assignments
                        {t.dueAt ? ` · due ${fmtDate(t.dueAt)}` : ""}
                      </p>
                    </div>
                    <div hidden={!canEdit} className="shrink-0 flex items-start gap-1.5">
                      <button
                        type="button"
                        onClick={() => editTask(t)}
                        className="p-2 rounded-lg border border-[#DDEEE4] text-[#0D5229] hover:bg-[#F8FBF9]"
                        title="Edit task"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(t)}
                        disabled={busy === `task-${t.id}`}
                        className="p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40"
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Assign existing task to specific interns</h3>
            <select
              value={assignTaskId}
              onChange={(e) => setAssignTaskId(e.target.value)}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm font-semibold"
            >
              <option value="">Select task…</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  #{t.id} · {t.title}
                </option>
              ))}
            </select>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-[#F0F5F2] divide-y divide-[#F0F5F2]">
              {acceptedInterns.length === 0 ? (
                <p className="p-3 text-xs text-[#94A3B8] font-semibold">No accepted interns yet.</p>
              ) : (
                acceptedInterns.map((a) => {
                  const checked = assignInternIds.includes(a.id);
                  return (
                    <label key={a.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#F8FBF9]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setAssignInternIds((ids) =>
                            checked ? ids.filter((x) => x !== a.id) : [...ids, a.id],
                          )
                        }
                      />
                      <span className="font-semibold text-[#04330B]">
                        {a.fullName} <span className="text-[#587E67] font-medium">#{a.id} · {deptName(a.department)}</span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            <button
              type="button"
              onClick={assignSelectedInterns}
              disabled={busy === "assign-task"}
              className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy === "assign-task"
                ? "Assigning…"
                : `Assign selected (${assignInternIds.length})`}
            </button>
          </div>

          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <h3 className="font-black text-[#04330B]">Task submissions</h3>
              <div className="flex flex-wrap gap-1.5">
                {(["submitted", "assigned", "completed", "rejected", "all"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setAssignmentFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize border ${
                      assignmentFilter === f
                        ? "bg-[#04330B] text-white border-[#04330B]"
                        : "bg-white border-[#DDEEE4] text-[#04330B]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {assignmentTotal > assignments.length ? (
                <p className="text-xs font-semibold text-[#94A3B8]">
                  Showing the {assignments.length} most recently updated of {assignmentTotal}.
                </p>
              ) : null}
              {filteredAssignments.length === 0 ? (
                <p className="text-sm text-[#94A3B8] font-semibold">No submissions in this filter.</p>
              ) : (
                filteredAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-[#F0F5F2] p-3 flex flex-wrap gap-3 justify-between"
                  >
                    <div>
                      <p className="font-bold text-sm text-[#04330B]">
                        {a.task.title} → {a.application.fullName}
                      </p>
                      <p className="text-xs text-[#587E67]">
                        #{a.application.id} · {a.application.phone} ·{" "}
                        <span className="font-bold capitalize">{a.status}</span>
                        {a.proofUrl ? (
                          <>
                            {" · "}
                            <a href={a.proofUrl} target="_blank" rel="noreferrer" className="underline">
                              proof
                            </a>
                          </>
                        ) : null}
                      </p>
                      {a.notes ? (
                        <p className="mt-1 text-xs text-[#92400E] font-semibold">Mentor note: {a.notes}</p>
                      ) : null}
                    </div>
                    {(a.status === "submitted" || a.status === "assigned") && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => reviewAssignment(a.id, "completed")}
                          disabled={busy === `review-${a.id}`}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-[#EAF7EE] text-[#0D5229] disabled:opacity-50"
                        >
                          Mark complete
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewAssignment(a.id, "rejected")}
                          disabled={busy === `review-${a.id}`}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-red-50 text-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "attendance" && canEdit && (
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-[#04330B]">Take today&apos;s register</h3>
              <p className="text-xs text-[#587E67] font-semibold">
                Mark the whole cohort in one go. Anyone already marked today is unticked.
              </p>
            </div>
            <select
              value={rosterClassId}
              onChange={(e) => setRosterClassId(e.target.value)}
              className="h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="">No class link</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {rosterLoading ? (
            <p className="text-sm font-semibold text-[#587E67]">Loading roster…</p>
          ) : roster.length === 0 ? (
            <p className="text-sm font-semibold text-[#587E67]">
              No accepted interns to mark yet.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRosterIds(roster.map((r) => r.id))}
                  className="px-3 h-8 rounded-lg bg-[#EEF7F1] text-[#04330B]"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => setRosterIds([])}
                  className="px-3 h-8 rounded-lg bg-[#EEF7F1] text-[#04330B]"
                >
                  Clear
                </button>
                <label className="flex items-center gap-2 text-[#04330B]">
                  <input
                    type="radio"
                    checked={rosterPresent}
                    onChange={() => setRosterPresent(true)}
                  />
                  Mark present
                </label>
                <label className="flex items-center gap-2 text-[#04330B]">
                  <input
                    type="radio"
                    checked={!rosterPresent}
                    onChange={() => setRosterPresent(false)}
                  />
                  Mark absent
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto">
                {roster.map((r) => {
                  const checked = rosterIds.includes(r.id);
                  return (
                    <label
                      key={r.id}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                        checked ? "border-[#04330B] bg-[#F5FBF7]" : "border-[#E4F2EA]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setRosterIds((prev) =>
                            e.target.checked
                              ? [...prev, r.id]
                              : prev.filter((id) => id !== r.id),
                          )
                        }
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-[#04330B]">
                          {r.fullName}
                        </span>
                        <span className="block truncate text-[11px] text-[#587E67]">
                          {deptName(r.department)}
                        </span>
                      </span>
                      {r.markedToday && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.present
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {r.present ? "Present" : "Absent"}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={markRoster}
                disabled={busy === "roster" || !rosterIds.length}
                className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
              >
                {busy === "roster"
                  ? "Saving…"
                  : `Mark ${rosterIds.length} ${rosterPresent ? "present" : "absent"}`}
              </button>
            </>
          )}
        </div>
      )}

      {tab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form hidden={!canEdit} onSubmit={markAttendance} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Mark one intern</h3>
            <p className="text-xs text-[#587E67] font-semibold">
              Only accepted interns appear here ({acceptedInterns.length}).
            </p>
            <select
              required
              value={attForm.applicationId}
              onChange={(e) => setAttForm({ ...attForm, applicationId: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="">Select accepted intern</option>
              {acceptedInterns.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} {a.fullName} · {deptName(a.department)}
                </option>
              ))}
            </select>
            <select
              value={attForm.classId}
              onChange={(e) => setAttForm({ ...attForm, classId: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="">No class link</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <label className="block text-xs font-bold text-[#587E67]">
              Date
              <input
                type="date"
                required
                max={todayISO()}
                value={attForm.date}
                onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
                className="mt-1 w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm font-semibold text-[#04330B]"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={attForm.present}
                onChange={(e) => setAttForm({ ...attForm, present: e.target.checked })}
              />
              Present
            </label>
            <input
              placeholder="Notes (optional)"
              value={attForm.notes}
              onChange={(e) => setAttForm({ ...attForm, notes: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <p className="text-xs text-[#94A3B8] font-semibold">
              Marking the same intern and class on a date you already recorded updates that
              record instead of adding a second one.
            </p>
            <button
              type="submit"
              disabled={busy === "attendance"}
              className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy === "attendance" ? "Saving…" : "Save attendance"}
            </button>
          </form>
          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-2 max-h-[520px] overflow-y-auto">
            <h3 className="font-black text-[#04330B]">
              Attendance log ({attendance.length}
              {attendanceTotal > attendance.length ? ` of ${attendanceTotal}` : ""})
            </h3>
            {attendanceTotal > attendance.length ? (
              <p className="text-xs font-semibold text-[#94A3B8]">
                Showing the most recent {attendance.length}. Filter by intern to see older
                records.
              </p>
            ) : null}
            {attendance.length === 0 ? (
              <p className="text-sm text-[#94A3B8] font-semibold">No attendance marked yet.</p>
            ) : (
              attendance.map((row) => (
                <div key={row.id} className="text-sm border-b border-[#F0F5F2] py-2">
                  <p className="font-bold text-[#04330B]">
                    {row.application.fullName}{" "}
                    <span className={row.present ? "text-[#16A34A]" : "text-red-600"}>
                      {row.present ? "Present" : "Absent"}
                    </span>
                  </p>
                  <p className="text-xs text-[#587E67]">
                    {fmtDate(row.date)}
                    {row.class ? ` · ${row.class.title}` : ""}
                  </p>
                  {row.notes ? (
                    <p className="text-xs text-[#94A3B8] font-semibold">{row.notes}</p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "mentors" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <form hidden={!canEdit} onSubmit={createMentor} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
              <h3 className="font-black text-[#04330B]">Add mentor</h3>
              <input
                required
                placeholder="Name *"
                value={mentorForm.name}
                onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
              <input
                placeholder="Title"
                value={mentorForm.title}
                onChange={(e) => setMentorForm({ ...mentorForm, title: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={mentorForm.email}
                onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
              <input
                placeholder="Phone"
                value={mentorForm.phone}
                onChange={(e) => setMentorForm({ ...mentorForm, phone: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
              <input
                placeholder="WhatsApp"
                value={mentorForm.whatsapp}
                onChange={(e) => setMentorForm({ ...mentorForm, whatsapp: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
              <select
                value={mentorForm.department}
                onChange={(e) => setMentorForm({ ...mentorForm, department: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              >
                <option value="">All departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.shortName}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Bio"
                value={mentorForm.bio}
                onChange={(e) => setMentorForm({ ...mentorForm, bio: e.target.value })}
                className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
                rows={3}
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-[#04330B]">
                <input
                  type="checkbox"
                  checked={mentorForm.active}
                  onChange={(e) => setMentorForm({ ...mentorForm, active: e.target.checked })}
                />
                Active
              </label>
              <button
                type="submit"
                disabled={busy === "mentor"}
                className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
              >
                {busy === "mentor" ? "Creating…" : "Create mentor"}
              </button>
            </form>

            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
              <h3 className="font-black text-[#04330B]">Mentors ({mentors.length})</h3>
              {mentors.length === 0 ? (
                <p className="text-sm text-[#94A3B8] font-semibold">No mentors yet.</p>
              ) : (
                mentors.map((m) => (
                  <div key={m.id} className="rounded-xl border border-[#F0F5F2] p-3 flex gap-3 justify-between">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#04330B]">
                        {m.name}{" "}
                        {!m.active ? (
                          <span className="text-[10px] uppercase text-amber-700">inactive</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-[#587E67] mt-0.5">
                        {m.title || "—"}
                        {m.department ? ` · ${deptName(m.department)}` : " · All"}
                        {m._count?.assignments != null ? ` · ${m._count.assignments} assigned` : ""}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        {[m.email, m.phone, m.whatsapp].filter(Boolean).join(" · ") || "No contact"}
                      </p>
                      {m.assignments?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.assignments.map((as) => (
                            <span
                              key={as.application.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#F0F5F2] pl-2 pr-1 py-1 text-[11px] font-semibold text-[#04330B]"
                            >
                              {as.application.fullName}
                              <button
                                type="button"
                                onClick={() =>
                                  unassignMentor(m.id, as.application.id, as.application.fullName)
                                }
                                disabled={busy === `unassign-${m.id}-${as.application.id}`}
                                className="p-0.5 rounded text-[#587E67] hover:text-red-600 hover:bg-white disabled:opacity-40"
                                title={`Unassign ${as.application.fullName}`}
                              >
                                <UserMinus size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div hidden={!canEdit} className="shrink-0 flex items-start gap-1.5">
                      <button
                        type="button"
                        onClick={() => editMentor(m)}
                        className="p-2 rounded-lg border border-[#DDEEE4] text-[#0D5229] hover:bg-[#F8FBF9]"
                        title="Edit mentor"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMentor(m.id, m.name)}
                        disabled={busy === `mentor-${m.id}`}
                        className="p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40"
                        title="Delete mentor"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Assign mentor to accepted interns</h3>
            <select
              value={assignMentorId}
              onChange={(e) => setAssignMentorId(e.target.value)}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm font-semibold"
            >
              <option value="">Select mentor…</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>
                  #{m.id} · {m.name}
                </option>
              ))}
            </select>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-[#F0F5F2] divide-y divide-[#F0F5F2]">
              {acceptedInterns.length === 0 ? (
                <p className="p-3 text-xs text-[#94A3B8] font-semibold">No accepted interns yet.</p>
              ) : (
                acceptedInterns.map((a) => {
                  const checked = assignMentorInternIds.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#F8FBF9]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setAssignMentorInternIds((ids) =>
                            checked ? ids.filter((x) => x !== a.id) : [...ids, a.id],
                          )
                        }
                      />
                      <span className="font-semibold text-[#04330B]">
                        {a.fullName}{" "}
                        <span className="text-[#587E67] font-medium">
                          #{a.id} · {deptName(a.department)}
                        </span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            <button
              type="button"
              onClick={assignMentorToInterns}
              disabled={busy === "assign-mentor"}
              className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy === "assign-mentor"
                ? "Assigning…"
                : `Assign selected (${assignMentorInternIds.length})`}
            </button>
          </div>
        </div>
      )}

      {tab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form hidden={!canEdit} onSubmit={createAnnouncement} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Post announcement</h3>
            <input
              required
              placeholder="Title *"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <textarea
              required
              placeholder="Body *"
              value={announcementForm.body}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, body: e.target.value })}
              className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
              rows={5}
            />
            <select
              value={announcementForm.department}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, department: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.shortName}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#04330B]">
              <input
                type="checkbox"
                checked={announcementForm.pinned}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, pinned: e.target.checked })}
              />
              Pinned
            </label>
            <button
              type="submit"
              disabled={busy === "announcement"}
              className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy === "announcement" ? "Publishing…" : "Publish"}
            </button>
          </form>
          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Announcements ({announcements.length})</h3>
            {announcements.length === 0 ? (
              <p className="text-sm text-[#94A3B8] font-semibold">No announcements yet.</p>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="rounded-xl border border-[#F0F5F2] p-3 flex gap-3 justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#04330B]">
                      {a.title}{" "}
                      {a.pinned ? (
                        <span className="text-[10px] uppercase text-[#16A34A]">pinned</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-[#587E67] mt-0.5 line-clamp-2">{a.body}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {fmtDate(a.createdAt)}
                      {a.department ? ` · ${deptName(a.department)}` : " · All"}
                    </p>
                  </div>
                  <div hidden={!canEdit} className="shrink-0 flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={() => editAnnouncement(a)}
                      className="p-2 rounded-lg border border-[#DDEEE4] text-[#0D5229] hover:bg-[#F8FBF9]"
                      title="Edit announcement"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(a.id, a.title)}
                      disabled={busy === `announcement-${a.id}`}
                      className="p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40"
                      title="Delete announcement"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "resources" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form hidden={!canEdit} onSubmit={createResource} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Add resource</h3>
            <input
              required
              placeholder="Title *"
              value={resourceForm.title}
              onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <input
              required
              type="url"
              placeholder="URL *"
              value={resourceForm.url}
              onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <select
              value={resourceForm.type}
              onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="link">link</option>
              <option value="pdf">pdf</option>
              <option value="video">video</option>
              <option value="doc">doc</option>
            </select>
            <select
              value={resourceForm.department}
              onChange={(e) => setResourceForm({ ...resourceForm, department: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.shortName}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={resourceForm.description}
              onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
              className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
              rows={3}
            />
            <button
              type="submit"
              disabled={busy === "resource"}
              className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy === "resource" ? "Creating…" : "Create resource"}
            </button>
          </form>
          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Resources ({resources.length})</h3>
            {resources.length === 0 ? (
              <p className="text-sm text-[#94A3B8] font-semibold">No resources yet.</p>
            ) : (
              resources.map((r) => (
                <div key={r.id} className="rounded-xl border border-[#F0F5F2] p-3 flex gap-3 justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#04330B]">
                      {r.title}{" "}
                      <span className="text-[10px] uppercase text-[#16A34A]">{r.type}</span>
                    </p>
                    <p className="text-xs text-[#587E67] mt-0.5">
                      {r.department ? deptName(r.department) : "All departments"}
                    </p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#0D5229] underline break-all"
                    >
                      {r.url}
                    </a>
                  </div>
                  <div hidden={!canEdit} className="shrink-0 flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={() => editResource(r)}
                      className="p-2 rounded-lg border border-[#DDEEE4] text-[#0D5229] hover:bg-[#F8FBF9]"
                      title="Edit resource"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteResource(r.id, r.title)}
                      disabled={busy === `resource-${r.id}`}
                      className="p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40"
                      title="Delete resource"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "modules" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form hidden={!canEdit} onSubmit={createModule} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Add module</h3>
            <input
              required
              placeholder="Title *"
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <textarea
              placeholder="Short description"
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
              className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
              rows={2}
            />
            <textarea
              placeholder="Module content — what the intern reads on the module page"
              value={moduleForm.content}
              onChange={(e) => setModuleForm({ ...moduleForm, content: e.target.value })}
              className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
              rows={5}
            />
            <input
              placeholder="Resource link (optional)"
              value={moduleForm.resourceUrl}
              onChange={(e) => setModuleForm({ ...moduleForm, resourceUrl: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <input
              type="number"
              placeholder="Sort order"
              value={moduleForm.sortOrder}
              onChange={(e) => setModuleForm({ ...moduleForm, sortOrder: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            />
            <select
              value={moduleForm.department}
              onChange={(e) => setModuleForm({ ...moduleForm, department: e.target.value })}
              className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.shortName}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={busy === "module"}
              className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
            >
              {busy === "module" ? "Creating…" : "Create module"}
            </button>
          </form>
          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Modules ({modules.length})</h3>
            {modules.length === 0 ? (
              <p className="text-sm text-[#94A3B8] font-semibold">No modules yet.</p>
            ) : (
              [...modules]
                .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
                .map((m) => (
                  <div key={m.id} className="rounded-xl border border-[#F0F5F2] p-3 flex gap-3 justify-between">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#04330B]">
                        #{m.sortOrder} · {m.title}
                      </p>
                      <p className="text-xs text-[#587E67] mt-0.5">
                        {m.department ? deptName(m.department) : "All departments"}
                      </p>
                      {m.description ? (
                        <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{m.description}</p>
                      ) : null}
                    </div>
                    <div hidden={!canEdit} className="shrink-0 flex items-start gap-1.5">
                      <button
                        type="button"
                        onClick={() => editModule(m)}
                        className="p-2 rounded-lg border border-[#DDEEE4] text-[#0D5229] hover:bg-[#F8FBF9]"
                        title="Edit module"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteModule(m.id, m.title)}
                        disabled={busy === `module-${m.id}`}
                        className="p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40"
                        title="Delete module"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {detailApp && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setDetailApp(null)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-6 space-y-3 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-[#587E67]">Application</p>
                <h3 className="font-black text-[#04330B] text-lg">
                  #{detailApp.id} · {detailApp.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailApp(null)}
                className="p-2 rounded-lg border border-[#DDEEE4]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-[#587E67]">Phone</p>
              <p className="font-semibold text-[#04330B]">{detailApp.phone}</p>
              <p className="text-[#587E67]">Email</p>
              <p className="font-semibold text-[#04330B] break-all">{detailApp.email}</p>
              <p className="text-[#587E67]">City</p>
              <p className="font-semibold text-[#04330B]">{detailApp.city}</p>
              <p className="text-[#587E67]">College</p>
              <p className="font-semibold text-[#04330B]">{detailApp.college || "—"}</p>
              <p className="text-[#587E67]">Department</p>
              <p className="font-semibold text-[#04330B]">{deptName(detailApp.department)}</p>
              <p className="text-[#587E67]">Mode</p>
              <p className="font-semibold text-[#04330B] capitalize">{detailApp.mode}</p>
              <p className="text-[#587E67]">Status</p>
              <p className="font-semibold text-[#04330B]">
                {STATUS_LABEL[detailApp.status] || detailApp.status}
              </p>
              <p className="text-[#587E67]">Applied</p>
              <p className="font-semibold text-[#04330B]">{fmtDate(detailApp.createdAt)}</p>
            </div>
            {detailApp.motivation ? (
              <div>
                <p className="text-[11px] font-bold uppercase text-[#587E67] mb-1">Motivation</p>
                <p className="text-sm text-[#04330B] whitespace-pre-wrap rounded-xl bg-[#F8FBF9] border border-[#E4F2EA] p-3">
                  {detailApp.motivation}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {report && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setReport(null)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-[#587E67]">Progress report</p>
                <h3 className="font-black text-[#04330B] text-lg">
                  {report.application?.fullName || "Intern"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReport(null)}
                className="p-2 rounded-lg border border-[#DDEEE4]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#E4F2EA] bg-[#F8FBF9] p-3">
                <p className="text-[11px] font-bold text-[#587E67] uppercase">Tasks done</p>
                <p className="text-xl font-black text-[#0D5229]">
                  {report.summary?.tasksCompleted ?? 0}/{report.summary?.tasksTotal ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-[#E4F2EA] bg-[#F8FBF9] p-3">
                <p className="text-[11px] font-bold text-[#587E67] uppercase">Attendance</p>
                <p className="text-xl font-black text-[#0D5229]">
                  {report.summary?.attendancePresent ?? 0}/{report.summary?.attendanceTotal ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-[#E4F2EA] bg-[#F8FBF9] p-3">
                <p className="text-[11px] font-bold text-[#587E67] uppercase">Modules</p>
                <p className="text-xl font-black text-[#0D5229]">
                  {report.summary?.modulesDone ?? 0}/{report.summary?.modulesTotal ?? 0}
                </p>
              </div>
            </div>

            {report.application && (
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-[#587E67]">Dept:</span>{" "}
                  <span className="font-semibold">{deptName(report.application.department)}</span>
                </p>
                <p>
                  <span className="text-[#587E67]">Status:</span>{" "}
                  <span className="font-semibold">
                    {STATUS_LABEL[report.application.status] || report.application.status}
                  </span>
                </p>
                {report.mentors?.length ? (
                  <p>
                    <span className="text-[#587E67]">Mentor:</span>{" "}
                    <span className="font-semibold">
                      {report.mentors.map((m: any) => m.name).join(", ")}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            {report.modules?.length ? (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-[#587E67]">Learning path</p>
                {report.modules.map((m: any) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#F0F5F2] px-3 py-2"
                  >
                    <span className="text-sm font-semibold text-[#04330B] truncate">
                      #{m.sortOrder} · {m.title}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === "done"
                          ? "bg-emerald-50 text-emerald-700"
                          : m.status === "in_progress"
                            ? "bg-amber-50 text-amber-700"
                            : m.locked
                              ? "bg-slate-100 text-slate-500"
                              : "bg-[#F1FBF6] text-[#0D5229]"
                      }`}
                    >
                      {m.status === "done"
                        ? "Done"
                        : m.status === "in_progress"
                          ? `${m.taskCompleted}/${m.taskTotal}`
                          : m.locked
                            ? "Locked"
                            : "Not started"}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {report.tasks?.length ? (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase text-[#587E67]">
                  Tasks ({report.tasks.length})
                </p>
                {report.tasks.map((t: any) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#F0F5F2] px-3 py-2"
                  >
                    <span className="text-sm text-[#04330B] truncate">{t.task?.title}</span>
                    <span className="shrink-0 text-[10px] font-bold uppercase text-[#587E67]">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {report.certificate && (
              <div className="rounded-xl border border-[#E4F2EA] bg-[#F8FBF9] p-3 space-y-2">
                <p className="text-[11px] font-bold uppercase text-[#587E67]">Certificate</p>
                <p className="text-sm font-semibold text-[#04330B]">
                  {report.certificate.eligible
                    ? report.certificate.approved
                      ? "Approved"
                      : "Eligible — awaiting approval"
                    : `Not eligible yet (${report.certificate.unmet.join(", ")})`}
                </p>
                <p className="text-xs text-[#587E67] font-semibold">
                  Attendance {report.certificate.requirements.attendance.pct}% of{" "}
                  {report.certificate.requirements.attendance.required}% required
                </p>
                {report.application?.certificateUrl ? (
                  <a
                    href={report.application.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[#0D5229] font-bold underline text-sm"
                  >
                    Open certificate
                  </a>
                ) : null}

                {canEdit && report.certificate.eligible ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCertificateApproval(
                        report.application.id,
                        !report.certificate.approved,
                      )
                    }
                    disabled={busy === "cert-approve"}
                    className="h-9 px-3 rounded-lg bg-[#04330B] text-white text-xs font-bold disabled:opacity-50"
                  >
                    {report.certificate.approved ? "Withdraw approval" : "Approve certificate"}
                  </button>
                ) : null}

                {canEdit && report.certificate.approved ? (
                  <div className="space-y-1 pt-1">
                    <input
                      type="url"
                      placeholder="https://… certificate link"
                      value={certValue(report.application)}
                      onChange={(e) =>
                        setCertDrafts((d) => ({
                          ...d,
                          [report.application.id]: e.target.value,
                        }))
                      }
                      className="w-full h-9 rounded-lg border border-[#DDEEE4] px-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await saveCertificate(report.application);
                        await openReport(report.application.id);
                      }}
                      disabled={busy === `cert-${report.application.id}`}
                      className="text-[11px] font-bold text-[#0D5229] hover:underline disabled:opacity-50"
                    >
                      {busy === `cert-${report.application.id}`
                        ? "Saving…"
                        : "Save certificate link"}
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            <button
              type="button"
              onClick={exportReportCsv}
              className="h-9 px-3 rounded-lg border border-[#DDEEE4] text-xs font-bold text-[#04330B]"
            >
              Export report CSV
            </button>
          </div>
        </div>
      )}


      {tab === "help" && (
        <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-black text-[#04330B]">
              Help Desk ({helpTickets.length}
              {helpTotal > helpTickets.length ? ` of ${helpTotal}` : ""})
            </h3>
            <p className="text-xs font-semibold text-[#587E67]">
              Questions raised from intern Need Help
            </p>
          </div>
          {helpTickets.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto h-20 w-20 portal-empty-float">
                <img
                  src="/internship/portal/empty/empty-sprout.png"
                  alt=""
                  aria-hidden
                  className="h-full w-full object-contain select-none"
                  draggable={false}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-[#04330B]">No help requests yet.</p>
              <p className="mt-1 text-xs font-semibold text-[#587E67]">
                Questions raised by interns will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {helpTickets.map((ticket) => (
                <article key={ticket.id} className="rounded-xl border border-[#EAF2EC] p-4">
                  <div className="flex items-start gap-3">
                    {ticket.application.photoUrl ? (
                      <img src={ticket.application.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover border border-[#DCEBE2]" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#0B5A2A] text-white text-xs font-bold flex items-center justify-center">
                        {(ticket.application.fullName || "?").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-[#04330B]">{ticket.subject}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#0B5A2A]">
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#587E67] mt-0.5">
                        #{ticket.application.id} · {ticket.application.fullName} · {ticket.application.phone}
                      </p>
                      <p className="text-sm font-medium text-[#4F6B5C] mt-2">{ticket.message}</p>
                      {ticket.adminReply ? (
                        <p className="mt-2 text-sm font-semibold text-[#04330B] bg-[#F5FBF7] rounded-lg px-3 py-2">
                          Reply: {ticket.adminReply}
                        </p>
                      ) : null}
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          value={helpReplyDrafts[ticket.id] || ""}
                          onChange={(e) =>
                            setHelpReplyDrafts((d) => ({ ...d, [ticket.id]: e.target.value }))
                          }
                          placeholder="Admin reply…"
                          className="flex-1 h-10 rounded-xl border border-[#DCEBE2] px-3 text-sm font-medium"
                        />
                        <select
                          className="h-10 rounded-xl border border-[#DCEBE2] px-3 text-sm font-semibold"
                          defaultValue={ticket.status}
                          id={`help-status-${ticket.id}`}
                        >
                          <option value="open">open</option>
                          <option value="in_progress">in_progress</option>
                          <option value="resolved">resolved</option>
                        </select>
                        <button
                          type="button"
                          disabled={busy === `help-${ticket.id}`}
                          className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
                          onClick={() =>
                            run(`help-${ticket.id}`, async () => {
                            const statusEl = document.getElementById(`help-status-${ticket.id}`) as HTMLSelectElement | null;
                            try {
                              await adminFetch(`leadership-academy/help-tickets/${ticket.id}`, {
                                method: "PATCH",
                                body: JSON.stringify({
                                  status: statusEl?.value || ticket.status,
                                  adminReply: helpReplyDrafts[ticket.id] || ticket.adminReply || "",
                                }),
                              });
                              showToast(`Ticket #${ticket.id} updated`);
                              await load();
                            } catch (e: any) {
                              showToast(e.message || "Update failed");
                            }
                            })
                          }
                        >
                          {busy === `help-${ticket.id}` ? "Saving…" : "Save reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {editing ? (
        <EditDialog
          target={editing}
          onClose={() => setEditing(null)}
          onSaved={async (message) => {
            setEditing(null);
            showToast(message);
            await load();
          }}
          onError={showToast}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 right-5 bg-[#04330B] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function EditDialog({
  target,
  onClose,
  onSaved,
  onError,
}: {
  target: EditTarget;
  onClose: () => void;
  onSaved: (message: string) => void | Promise<void>;
  onError: (message: string) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(target.values);
  const [saving, setSaving] = useState(false);

  const set = (name: string, value: unknown) =>
    setValues((v) => ({ ...v, [name]: value }));

  // Only send what actually changed, so a partial update stays partial.
  const changed = target.fields.filter(
    (f) => String(values[f.name] ?? "") !== String(target.values[f.name] ?? ""),
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changed.length) {
      onError("Nothing changed");
      return;
    }
    const payload: Record<string, unknown> = {};
    for (const f of changed) {
      const raw = values[f.name];
      if (f.kind === "datetime") payload[f.name] = fromLocalInput(String(raw || ""));
      else if (f.kind === "checkbox") payload[f.name] = !!raw;
      else if (f.kind === "number") payload[f.name] = Number(raw) || 0;
      else payload[f.name] = String(raw ?? "").trim();
    }

    setSaving(true);
    try {
      await adminFetch(`${target.endpoint}/${target.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await onSaved(`${target.heading.replace("Edit ", "")} updated`);
    } catch (err: any) {
      onError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-5 space-y-3 my-auto"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-black text-[#04330B]">{target.heading}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#587E67] hover:bg-[#F0F5F2]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {target.fields.map((f) => (
          <label key={f.name} className="block space-y-1">
            <span className="text-[11px] font-bold uppercase text-[#587E67]">
              {f.label}
            </span>
            {f.kind === "textarea" ? (
              <textarea
                required={f.required}
                rows={3}
                value={String(values[f.name] ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full rounded-xl border border-[#DDEEE4] px-3 py-2 text-sm"
              />
            ) : f.kind === "select" ? (
              <select
                value={String(values[f.name] ?? "")}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              >
                {(f.options || []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.kind === "checkbox" ? (
              <span className="flex items-center gap-2 text-sm font-semibold text-[#04330B]">
                <input
                  type="checkbox"
                  checked={!!values[f.name]}
                  onChange={(e) => set(f.name, e.target.checked)}
                />
                {f.placeholder || f.label}
              </span>
            ) : (
              <input
                required={f.required}
                type={
                  f.kind === "datetime"
                    ? "datetime-local"
                    : f.kind === "number"
                      ? "number"
                      : f.kind === "url"
                        ? "url"
                        : "text"
                }
                value={String(values[f.name] ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm"
              />
            )}
          </label>
        ))}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={saving || !changed.length}
            className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-[#B9D3C4] text-sm font-bold text-[#04330B]"
          >
            Cancel
          </button>
          {!changed.length ? (
            <span className="text-xs text-[#94A3B8] font-semibold">No changes yet</span>
          ) : null}
        </div>
      </form>
    </div>
  );
}

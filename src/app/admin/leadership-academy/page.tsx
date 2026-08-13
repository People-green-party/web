"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, FileText, Loader2, Search, Trash2, Users, Video, X } from "lucide-react";
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
  createdAt: string;
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

type Tab = "applications" | "classes" | "tasks" | "attendance";

function deptName(slug: string) {
  return DEPARTMENTS.find((d) => d.slug === slug)?.shortName || slug || "All";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "submitted" | "assigned" | "completed" | "rejected">(
    "submitted",
  );
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [report, setReport] = useState<any>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);

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
    assignToAllAccepted: true,
  });
  const [attForm, setAttForm] = useState({
    applicationId: "",
    classId: "",
    present: true,
    notes: "",
  });
  const [certDrafts, setCertDrafts] = useState<Record<number, string>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!getAdminToken()) {
        router.replace("/admin/login");
        return;
      }
      const [apps, cls, tsk, asg, att] = await Promise.all([
        adminFetch<Application[]>("leadership-academy/applications"),
        adminFetch<InternClass[]>("leadership-academy/classes").catch(() => []),
        adminFetch<InternTask[]>("leadership-academy/tasks").catch(() => []),
        adminFetch<Assignment[]>("leadership-academy/task-assignments").catch(() => []),
        adminFetch<AttendanceRow[]>("leadership-academy/attendance").catch(() => []),
      ]);
      setItems(Array.isArray(apps) ? apps : []);
      setClasses(Array.isArray(cls) ? cls : []);
      setTasks(Array.isArray(tsk) ? tsk : []);
      setAssignments(Array.isArray(asg) ? asg : []);
      setAttendance(Array.isArray(att) ? att : []);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const acceptedInterns = useMemo(
    () => items.filter((a) => a.status === "accepted"),
    [items],
  );

  const pendingReviewCount = useMemo(
    () => assignments.filter((a) => a.status === "submitted").length,
    [assignments],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((a) => {
      if (filter !== "All" && a.status !== filter) return false;
      if (deptFilter !== "All" && a.department !== deptFilter) return false;
      if (!q) return true;
      return [a.fullName, a.email, a.phone, a.city, a.department, a.college || "", a.mode]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, search, filter, deptFilter]);

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

  const saveCertificate = async (id: number) => {
    try {
      await adminFetch(`leadership-academy/applications/${id}/certificate`, {
        method: "PATCH",
        body: JSON.stringify({ certificateUrl: certDrafts[id] || null }),
      });
      showToast(`Certificate saved for #${id}`);
      await load();
    } catch (e: any) {
      showToast(e.message || "Certificate save failed");
    }
  };

  const openReport = async (id: number) => {
    try {
      const data = await adminFetch(`leadership-academy/applications/${id}/report`);
      setReport(data);
    } catch (e: any) {
      showToast(e.message || "Report failed");
    }
  };

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const deleteClass = async (id: number, title: string) => {
    if (!window.confirm(`Delete class “${title}”?`)) return;
    try {
      await adminFetch(`leadership-academy/classes/${id}`, { method: "DELETE" });
      showToast("Class deleted");
      await load();
    } catch (err: any) {
      showToast(err.message || "Delete failed");
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminFetch("leadership-academy/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...taskForm,
          department: taskForm.department || undefined,
          dueAt: taskForm.dueAt || undefined,
        }),
      });
      setTaskForm({ title: "", description: "", dueAt: "", department: "", assignToAllAccepted: true });
      showToast("Task created");
      await load();
    } catch (err: any) {
      showToast(err.message || "Failed");
    }
  };

  const reviewAssignment = async (id: number, status: "completed" | "rejected") => {
    try {
      await adminFetch(`leadership-academy/task-assignments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      showToast(`Assignment #${id} → ${status}`);
      await load();
    } catch (e: any) {
      showToast(e.message || "Failed");
    }
  };

  const markAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminFetch("leadership-academy/attendance", {
        method: "POST",
        body: JSON.stringify({
          applicationId: Number(attForm.applicationId),
          classId: attForm.classId ? Number(attForm.classId) : undefined,
          present: attForm.present,
          notes: attForm.notes || undefined,
        }),
      });
      showToast("Attendance saved");
      setAttForm({ applicationId: "", classId: "", present: true, notes: "" });
      await load();
    } catch (err: any) {
      showToast(err.message || "Failed");
    }
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
          </div>

          <div className="rounded-2xl border border-[#E4F2EA] bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#587E67] gap-2 font-semibold">
                <Loader2 className="animate-spin" size={18} /> Loading…
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center py-16 text-[#587E67] font-semibold">No applications found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead className="bg-[#F8FBF9] border-b border-[#E4F2EA] text-[11px] uppercase text-[#587E67]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Applicant</th>
                      <th className="px-4 py-3 font-bold">Department</th>
                      <th className="px-4 py-3 font-bold">Applied</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold">Certificate</th>
                      <th className="px-4 py-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app) => (
                      <tr key={app.id} className="border-b border-[#F0F5F2] align-top hover:bg-[#FAFCFB]">
                        <td className="px-4 py-4">
                          <p className="font-bold text-[#04330B]">
                            #{app.id} · {app.fullName}
                          </p>
                          <p className="text-xs text-[#587E67] font-semibold mt-0.5">{app.phone}</p>
                          <p className="text-xs text-[#587E67]">{app.email}</p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            {app.city}
                            {app.college ? ` · ${app.college}` : ""} · {app.mode}
                          </p>
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
                        <td className="px-4 py-4">
                          <input
                            type="url"
                            placeholder="https://… certificate link"
                            defaultValue={app.certificateUrl || ""}
                            onChange={(e) =>
                              setCertDrafts((d) => ({ ...d, [app.id]: e.target.value }))
                            }
                            className="w-full min-w-[180px] h-9 rounded-lg border border-[#DDEEE4] px-2 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => saveCertificate(app.id)}
                            className="mt-1 text-[11px] font-bold text-[#0D5229] hover:underline"
                          >
                            Save certificate
                          </button>
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
          </div>
        </>
      )}

      {tab === "classes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form onSubmit={createClass} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
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
            <button type="submit" className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold">
              Create class
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
                  <button
                    type="button"
                    onClick={() => deleteClass(c.id, c.title)}
                    className="shrink-0 p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50"
                    title="Delete class"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "tasks" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <form onSubmit={createTask} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
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
              <button type="submit" className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold">
                Create task
              </button>
            </form>

            <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
              <h3 className="font-black text-[#04330B]">Task templates ({tasks.length})</h3>
              {tasks.length === 0 ? (
                <p className="text-sm text-[#94A3B8] font-semibold">No tasks created yet.</p>
              ) : (
                tasks.map((t) => (
                  <div key={t.id} className="rounded-xl border border-[#F0F5F2] p-3">
                    <p className="font-bold text-sm text-[#04330B]">{t.title}</p>
                    <p className="text-xs text-[#587E67] mt-0.5">
                      {t.department ? deptName(t.department) : "All"} ·{" "}
                      {t._count?.assignments ?? 0} assignments
                      {t.dueAt ? ` · due ${fmtDate(t.dueAt)}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
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
                    </div>
                    {(a.status === "submitted" || a.status === "assigned") && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => reviewAssignment(a.id, "completed")}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-[#EAF7EE] text-[#0D5229]"
                        >
                          Mark complete
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewAssignment(a.id, "rejected")}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-red-50 text-red-700"
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

      {tab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form onSubmit={markAttendance} className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-3">
            <h3 className="font-black text-[#04330B]">Mark attendance</h3>
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
            <button type="submit" className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold">
              Save attendance
            </button>
          </form>
          <div className="rounded-2xl border border-[#E4F2EA] bg-white p-5 space-y-2 max-h-[520px] overflow-y-auto">
            <h3 className="font-black text-[#04330B]">Attendance log ({attendance.length})</h3>
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
                    {new Date(row.date).toLocaleString("en-IN")}
                    {row.class ? ` · ${row.class.title}` : ""}
                  </p>
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
            <div className="grid grid-cols-2 gap-3">
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
                {report.application.certificateUrl ? (
                  <a
                    href={report.application.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[#0D5229] font-bold underline text-sm"
                  >
                    Open certificate
                  </a>
                ) : (
                  <p className="text-xs text-[#94A3B8] font-semibold">No certificate uploaded yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {toast ? (
        <div className="fixed bottom-5 right-5 bg-[#04330B] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

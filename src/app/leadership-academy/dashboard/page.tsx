"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  LogOut,
  PlayCircle,
  Radio,
  ClipboardList,
} from "lucide-react";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { clearInternSession, getInternToken, internFetch } from "@/lib/internApi";

type Dash = {
  application: {
    id: number;
    fullName: string;
    department: string;
    mode: string;
    status: string;
    certificateUrl?: string | null;
  };
  classes: {
    recorded: { id: number; title: string; description?: string | null; url?: string | null }[];
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
    task: { id: number; title: string; description?: string | null; dueAt?: string | null };
  }[];
};

export default function InternDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Dash | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proofDrafts, setProofDrafts] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!getInternToken()) {
      router.replace("/leadership-academy/status");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const dash = await internFetch<Dash>("leadership-academy/me/dashboard");
      setData(dash);
    } catch (e: any) {
      setError(e?.message || "Failed to load dashboard");
      if (String(e?.message || "").toLowerCase().includes("unauthorized")) {
        clearInternSession();
        router.replace("/leadership-academy/status");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const submitProof = async (assignmentId: number) => {
    const proofUrl = (proofDrafts[assignmentId] || "").trim();
    if (!proofUrl) return;
    setBusyId(assignmentId);
    try {
      await internFetch(`leadership-academy/me/tasks/${assignmentId}/proof`, {
        method: "POST",
        body: JSON.stringify({ proofUrl }),
      });
      await load();
    } catch (e: any) {
      alert(e?.message || "Submit failed");
    } finally {
      setBusyId(null);
    }
  };

  const logout = () => {
    clearInternSession();
    router.push("/leadership-academy/status");
  };

  if (loading) {
    return (
      <AcademyShell>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center text-[#587E67] font-semibold">
          Loading your internship dashboard…
        </div>
      </AcademyShell>
    );
  }

  if (!data) {
    return (
      <AcademyShell>
        <div className="mx-auto max-w-lg px-5 py-16">
          <p className="text-[#DC2626] font-semibold">{error || "Not logged in"}</p>
          <Link href="/leadership-academy/status" className="mt-4 inline-block text-[#0D5229] font-bold">
            Go to Internship Login →
          </Link>
        </div>
      </AcademyShell>
    );
  }

  const app = data.application;

  return (
    <AcademyShell>
      <section className="mx-auto max-w-4xl px-5 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">Intern dashboard</p>
            <h1 className="mt-1 text-3xl font-black text-[#04330B]">Hi, {app.fullName.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-[#587E67] font-semibold">
              #{app.id} · {app.department} · {app.mode}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-[#DDEEE4] px-4 py-2 text-sm font-bold text-[#04330B]"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {error && (
          <div className="flex gap-2 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626] font-semibold text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="rounded-3xl border border-[#BBF7D0] bg-[#F5FBF7] p-6">
          <p className="text-xs font-black uppercase tracking-wider text-[#16A34A]">Application status</p>
          <p className="mt-2 text-2xl font-black text-[#04330B] uppercase">{app.status}</p>
          {app.certificateUrl ? (
            <a
              href={app.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0D5229] hover:underline"
            >
              Download certificate <ExternalLink size={14} />
            </a>
          ) : (
            <p className="mt-2 text-sm text-[#587E67] font-medium">
              Certificate will appear here when admin issues it.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-[#E4F2EA] bg-white p-6">
            <h2 className="font-black text-[#04330B] flex items-center gap-2">
              <PlayCircle size={18} className="text-[#16A34A]" /> Recorded classes
            </h2>
            <div className="mt-4 space-y-3">
              {data.classes.recorded.length === 0 ? (
                <p className="text-sm text-[#94A3B8] font-semibold">No recorded classes yet.</p>
              ) : (
                data.classes.recorded.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-[#F0F5F2] p-4">
                    <p className="font-bold text-[#04330B]">{c.title}</p>
                    {c.description && <p className="text-xs text-[#587E67] mt-1">{c.description}</p>}
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-sm font-bold text-[#0D5229] hover:underline"
                      >
                        Watch <ExternalLink size={12} className="ml-1" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-[#E4F2EA] bg-white p-6">
            <h2 className="font-black text-[#04330B] flex items-center gap-2">
              <Radio size={18} className="text-[#16A34A]" /> Live classes
            </h2>
            <div className="mt-4 space-y-3">
              {data.classes.live.length === 0 ? (
                <p className="text-sm text-[#94A3B8] font-semibold">No live sessions scheduled.</p>
              ) : (
                data.classes.live.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-[#F0F5F2] p-4">
                    <p className="font-bold text-[#04330B]">{c.title}</p>
                    {c.scheduledAt && (
                      <p className="text-xs text-[#587E67] mt-1">
                        {new Date(c.scheduledAt).toLocaleString("en-IN")}
                      </p>
                    )}
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-sm font-bold text-[#0D5229] hover:underline"
                      >
                        Join link <ExternalLink size={12} className="ml-1" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-[#E4F2EA] bg-white p-6">
          <h2 className="font-black text-[#04330B] flex items-center gap-2">
            <ClipboardList size={18} className="text-[#16A34A]" /> Your tasks
          </h2>
          <div className="mt-4 space-y-4">
            {data.tasks.length === 0 ? (
              <p className="text-sm text-[#94A3B8] font-semibold">No tasks assigned yet.</p>
            ) : (
              data.tasks.map((t) => (
                <div key={t.assignmentId} className="rounded-2xl border border-[#F0F5F2] p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-[#04330B]">{t.task.title}</p>
                    <span className="text-[11px] font-black uppercase px-2 py-1 rounded-full bg-[#F1FBF6] text-[#0D5229]">
                      {t.status}
                    </span>
                  </div>
                  {t.task.description && (
                    <p className="text-sm text-[#587E67]">{t.task.description}</p>
                  )}
                  {t.task.dueAt && (
                    <p className="text-xs text-[#587E67]">
                      Due {new Date(t.task.dueAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                  {t.status === "completed" ? (
                    <p className="text-sm font-semibold text-[#16A34A] flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </p>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <input
                        type="url"
                        placeholder="Paste proof link (Drive / Docs / etc.)"
                        value={proofDrafts[t.assignmentId] || t.proofUrl || ""}
                        onChange={(e) =>
                          setProofDrafts((d) => ({ ...d, [t.assignmentId]: e.target.value }))
                        }
                        className="flex-1 h-10 rounded-xl border border-[#DDEEE4] px-3 text-sm font-medium outline-none focus:border-[#16A34A]"
                      />
                      <button
                        type="button"
                        disabled={busyId === t.assignmentId}
                        onClick={() => submitProof(t.assignmentId)}
                        className="h-10 px-4 rounded-xl bg-[#04330B] text-white text-sm font-bold disabled:opacity-50"
                      >
                        {busyId === t.assignmentId ? "…" : "Submit"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </AcademyShell>
  );
}

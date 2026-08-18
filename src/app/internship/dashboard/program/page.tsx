"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  deptLabel,
  moduleProgress,
  moduleUnlockState,
  sortedModules,
  taskProgress,
} from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

export default function InternProgramPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data, loading } = useInternPortal();
  const tasks = taskProgress(data);
  const track = data ? deptLabel(data.application.department, isHi ? "hi" : "en") : "—";
  const modules = useMemo(() => sortedModules(data), [data]);
  const progress = moduleProgress(data);

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl space-y-5">
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "मेरा प्रोग्राम" : "My Program"}</h1>

      <div className="rounded-2xl border border-[#DCEBE2] bg-white p-6 shadow-sm">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#6B8F7A]">
          {isHi ? "विभाग ट्रैक" : "Department track"}
        </p>
        <p className="mt-1 text-[20px] font-bold text-[#04330B]">{track}</p>
        <div className="mt-4 flex items-center justify-between text-[12px] font-semibold text-[#6B8F7A]">
          <span>{isHi ? "कार्य प्रगति" : "Task progress"}</span>
          <span className="text-[#0B5A2A]">{tasks.pct}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[#E8F5EC] overflow-hidden">
          <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${tasks.pct}%` }} />
        </div>

        {progress.total > 0 ? (
          <>
            <div className="mt-4 flex items-center justify-between text-[12px] font-semibold text-[#6B8F7A]">
              <span>{isHi ? "मॉड्यूल पूरे" : "Modules completed"}</span>
              <span className="text-[#0B5A2A]">
                {progress.done}/{progress.total}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#E8F5EC] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0B5A2A]"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/internship/dashboard/tasks"
            className="rounded-xl bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white"
          >
            {isHi ? "सीखना जारी रखें" : "Continue learning"}
          </Link>
          <Link
            href="/internship/dashboard/classes"
            className="rounded-xl border border-[#DCEBE2] px-4 py-2.5 text-[13px] font-bold text-[#04330B]"
          >
            {isHi ? "कक्षाएँ" : "Classes"}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-[#DCEBE2] bg-white p-6 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#04330B]">{isHi ? "मॉड्यूल" : "Modules"}</h2>
        <ul className="mt-4 space-y-3">
          {modules.length === 0 ? (
            <li>
              <PortalEmptyState
                size="sm"
                art="sprout"
                title={isHi ? "अभी कोई मॉड्यूल नहीं जोड़ा गया" : "No modules added yet"}
                description={
                  isHi
                    ? "आपका लर्निंग पाथ जल्द ही यहाँ बढ़ना शुरू होगा।"
                    : "Your learning path will start growing here soon."
                }
              />
            </li>
          ) : (
            modules.map((mod) => {
              const state = moduleUnlockState(mod);
              const body = (
                <div className="flex items-start gap-3">
                  {state.done ? (
                    <CheckCircle2 size={18} className="text-[#16A34A] mt-0.5 shrink-0" />
                  ) : state.locked ? (
                    <Lock size={16} className="text-[#94A3B8] mt-0.5 shrink-0" />
                  ) : (
                    <Circle size={18} className="text-[#0B5A2A] mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-[14px] font-bold ${
                          state.locked ? "text-[#94A3B8]" : "text-[#04330B]"
                        }`}
                      >
                        {mod.title}
                      </p>
                      {state.inProgress ? (
                        <span className="rounded-full bg-[#E8F5EC] px-2 py-0.5 text-[10px] font-bold text-[#0B5A2A]">
                          {isHi ? "जारी है" : "In progress"}
                        </span>
                      ) : null}
                      {state.locked ? (
                        <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#64748B]">
                          {isHi ? "लॉक" : "Locked"}
                        </span>
                      ) : null}
                    </div>
                    {mod.description ? (
                      <p className="mt-1 text-[12.5px] font-medium text-[#4F6B5C]">
                        {mod.description}
                      </p>
                    ) : null}
                    {mod.taskTotal > 0 ? (
                      <p className="mt-1.5 text-[11.5px] font-semibold text-[#6B8F7A]">
                        {isHi
                          ? `${mod.taskCompleted}/${mod.taskTotal} कार्य पूरे`
                          : `${mod.taskCompleted} of ${mod.taskTotal} tasks done`}
                      </p>
                    ) : null}
                  </div>
                </div>
              );

              const className = `block rounded-xl border px-4 py-3.5 ${
                state.locked
                  ? "border-[#EAF2EC] bg-[#F8FBF9] opacity-70"
                  : state.current
                    ? "border-[#86EFAC] bg-[#F7FDF9] hover:bg-[#F1FBF5]"
                    : "border-[#DCEBE2] bg-white hover:bg-[#FAFCFB]"
              }`;

              return (
                <li key={mod.id}>
                  {state.locked ? (
                    <div className={className} aria-disabled="true">
                      {body}
                    </div>
                  ) : (
                    <Link href={`/internship/dashboard/program/${mod.id}`} className={className}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

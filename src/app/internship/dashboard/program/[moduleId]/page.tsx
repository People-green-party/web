"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, Lock } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  moduleUnlockState,
  sortedModules,
} from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

export default function InternModulePage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const params = useParams<{ moduleId: string }>();
  const moduleId = Number(params?.moduleId);
  const { data, loading } = useInternPortal();

  const modules = useMemo(() => sortedModules(data), [data]);
  const mod = modules.find((m) => m.id === moduleId);

  const moduleTasks = useMemo(
    () => (data?.tasks || []).filter((t) => t.task.moduleId === moduleId),
    [data, moduleId],
  );

  if (loading && !data) {
    return (
      <div className="p-8 text-[#6B8F7A] font-semibold">
        {isHi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  const back = (
    <Link
      href="/internship/dashboard/program"
      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B5A2A] hover:underline"
    >
      <ArrowLeft size={15} />
      {isHi ? "सभी मॉड्यूल" : "All modules"}
    </Link>
  );

  if (!mod) {
    return (
      <div className="p-4 sm:p-6 lg:p-7 max-w-3xl space-y-5">
        {back}
        <PortalEmptyState
          art="sprout"
          title={isHi ? "यह मॉड्यूल नहीं मिला" : "That module could not be found"}
          description={
            isHi
              ? "यह हटा दिया गया हो सकता है, या यह आपके विभाग के लिए नहीं है।"
              : "It may have been removed, or it is not part of your department track."
          }
        />
      </div>
    );
  }

  const state = moduleUnlockState(mod);

  if (state.locked) {
    return (
      <div className="p-4 sm:p-6 lg:p-7 max-w-3xl space-y-5">
        {back}
        <div className="rounded-2xl border border-[#EAF2EC] bg-[#F8FBF9] p-6 text-center">
          <Lock size={22} className="mx-auto text-[#94A3B8]" />
          <h1 className="mt-3 text-[18px] font-bold text-[#04330B]">{mod.title}</h1>
          <p className="mt-2 text-[13px] font-medium text-[#4F6B5C]">
            {isHi
              ? "यह मॉड्यूल तब खुलेगा जब आप इससे पहले वाले मॉड्यूल पूरे कर लेंगे।"
              : "This module opens once you finish the ones before it."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl space-y-5">
      {back}

      <div className="rounded-2xl border border-[#DCEBE2] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          {state.done ? (
            <CheckCircle2 size={20} className="text-[#16A34A] mt-0.5 shrink-0" />
          ) : (
            <Circle size={20} className="text-[#0B5A2A] mt-0.5 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-[12px] font-bold uppercase tracking-wide text-[#6B8F7A]">
              {isHi ? `मॉड्यूल ${mod.sortOrder}` : `Module ${mod.sortOrder}`}
            </p>
            <h1 className="mt-0.5 text-[20px] font-bold text-[#04330B]">{mod.title}</h1>
            {mod.description ? (
              <p className="mt-1.5 text-[13.5px] font-medium text-[#4F6B5C]">
                {mod.description}
              </p>
            ) : null}
          </div>
        </div>

        {mod.taskTotal > 0 ? (
          <>
            <div className="mt-5 flex items-center justify-between text-[12px] font-semibold text-[#6B8F7A]">
              <span>{isHi ? "प्रगति" : "Progress"}</span>
              <span className="text-[#0B5A2A]">
                {mod.taskCompleted}/{mod.taskTotal}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#E8F5EC] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#16A34A]"
                style={{ width: `${mod.progressPct}%` }}
              />
            </div>
          </>
        ) : null}
      </div>

      {mod.content ? (
        <div className="rounded-2xl border border-[#DCEBE2] bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#04330B]">
            {isHi ? "इस मॉड्यूल के बारे में" : "About this module"}
          </h2>
          <div className="mt-3 space-y-3 text-[13.5px] leading-relaxed font-medium text-[#3F5A4B] whitespace-pre-wrap">
            {mod.content}
          </div>
        </div>
      ) : null}

      {mod.resourceUrl ? (
        <a
          href={mod.resourceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm hover:bg-[#FAFCFB]"
        >
          <span className="text-[14px] font-bold text-[#04330B]">
            {isHi ? "मॉड्यूल सामग्री खोलें" : "Open module material"}
          </span>
          <ExternalLink size={16} className="text-[#0B5A2A] shrink-0" />
        </a>
      ) : null}

      <div className="rounded-2xl border border-[#DCEBE2] bg-white p-6 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#04330B]">
          {isHi ? "इस मॉड्यूल के कार्य" : "Tasks in this module"}
        </h2>
        {moduleTasks.length === 0 ? (
          <p className="mt-3 text-[13px] font-medium text-[#6B8F7A]">
            {isHi
              ? "इस मॉड्यूल के लिए अभी कोई कार्य नहीं सौंपा गया है।"
              : "No tasks have been assigned for this module yet."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {moduleTasks.map((t) => (
              <li key={t.assignmentId}>
                <Link
                  href="/internship/dashboard/tasks"
                  className="flex items-start gap-3 rounded-xl border border-[#DCEBE2] px-4 py-3 hover:bg-[#FAFCFB]"
                >
                  {t.status === "completed" ? (
                    <CheckCircle2 size={17} className="text-[#16A34A] mt-0.5 shrink-0" />
                  ) : (
                    <Circle size={17} className="text-[#0B5A2A] mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-[#04330B]">{t.task.title}</p>
                    {t.task.description ? (
                      <p className="mt-0.5 text-[12.5px] font-medium text-[#4F6B5C] line-clamp-2">
                        {t.task.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

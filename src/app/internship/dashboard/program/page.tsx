"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  currentModule,
  deptLabel,
  formatUnlockWhen,
  journeyDayNumber,
  journeyTitle,
  pickLocaleText,
  programmeDay,
  sortedModules,
} from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

export default function InternProgramPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const lang = isHi ? "hi" : "en";
  const { data, loading } = useInternPortal();

  const modules = useMemo(() => sortedModules(data), [data]);
  const current = currentModule(data);
  const day = programmeDay(data);
  const calendarDay = data?.schedule?.dayNumber ?? day?.day ?? 1;
  const calendarTotal = data?.schedule?.totalDays ?? day?.total ?? 14;
  const pct = Math.min(100, Math.round((calendarDay / calendarTotal) * 100));
  const track = data ? deptLabel(data.application.department, lang) : "—";

  if (loading && !data) {
    return (
      <div className="p-8 font-semibold text-[#6B8F7A]">
        {isHi ? "लोड हो रहा है…" : "Loading…"}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <p className="text-[13px] font-bold text-[#0B5A2A]">{track}</p>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#04330B]">
          {isHi ? "14-दिन की इंटर्नशिप यात्रा" : "14-Day Internship Programme"}
        </h1>
        <p className="mt-1 text-[13px] font-medium text-[#4F6B5C]">
          {isHi
            ? "यह रोडमैप है — आज का काम जमा करने के लिए My Tasks खोलें।"
            : "This is your roadmap — submit today’s work on My Tasks."}
        </p>
      </header>

      <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <p className="text-[18px] font-bold text-[#04330B]">
            {isHi
              ? `दिन ${calendarDay} / ${calendarTotal}`
              : `Day ${calendarDay} of ${calendarTotal}`}
          </p>
          <p className="text-[13px] font-bold text-[#0B5A2A]">{pct}%</p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E8F5EC]">
          <div
            className="h-full rounded-full bg-[#0B5A2A] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        {data?.schedule?.isSundayOff ? (
          <p className="mt-2 text-[12px] font-semibold text-[#B45309]">
            {isHi ? "आज रविवार — छुट्टी" : "Sunday today — day off"}
          </p>
        ) : current ? (
          <p className="mt-2 text-[12.5px] font-semibold text-[#0B5A2A]">
            {isHi ? "अभी: " : "Now: "}
            {journeyTitle(pickLocaleText(current.title, lang))}
          </p>
        ) : null}
      </div>

      {modules.length === 0 ? (
        <PortalEmptyState
          art="sprout"
          title={isHi ? "अभी प्रोग्राम नहीं मिला" : "Programme not ready yet"}
          description={
            isHi
              ? "स्वीकार होते ही यात्रा यहाँ दिखेगी।"
              : "Once accepted, your journey appears here."
          }
        />
      ) : (
        <section>
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wide text-[#6B8F7A]">
            {isHi ? "यात्रा" : "Journey"}
          </h2>
          <ol className="overflow-hidden rounded-2xl border border-[#DCEBE2] bg-white">
            {modules.map((m, i) => {
              const done = m.status === "done";
              const isCurrent = current?.id === m.id;
              const locked = m.locked && !done;
              const title = journeyTitle(pickLocaleText(m.title, lang));
              const dayN = journeyDayNumber(m);

              return (
                <li
                  key={m.id}
                  className={`flex items-stretch gap-0 border-b border-[#E8F0EB] last:border-b-0 ${
                    isCurrent ? "bg-[#F0FDF4]" : ""
                  }`}
                >
                  <div
                    className={`w-1.5 shrink-0 ${
                      done
                        ? "bg-[#16A34A]"
                        : isCurrent
                          ? "bg-[#0B5A2A]"
                          : "bg-[#E8F0EB]"
                    }`}
                  />
                  {isCurrent && !locked ? (
                    <Link
                      href={`/internship/dashboard/program/${m.id}`}
                      className="flex min-w-0 flex-1 items-center gap-4 px-4 py-4"
                    >
                      <StepBody
                        dayN={dayN}
                        title={title}
                        done={done}
                        isCurrent={isCurrent}
                        locked={locked}
                        unlocksAt={m.unlocksAt}
                        lang={lang}
                        isHi={isHi}
                        last={i === modules.length - 1}
                      />
                    </Link>
                  ) : (
                    <div className="flex min-w-0 flex-1 items-center gap-4 px-4 py-4">
                      <StepBody
                        dayN={dayN}
                        title={title}
                        done={done}
                        isCurrent={isCurrent}
                        locked={locked}
                        unlocksAt={m.unlocksAt}
                        lang={lang}
                        isHi={isHi}
                        last={i === modules.length - 1}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[12.5px] font-medium text-[#6B8F7A]">
            {isHi
              ? "अगला अनलॉक सोम–शनि सुबह 9:00 IST। असली जमा My Tasks पर।"
              : "Next steps unlock Mon–Sat at 9:00 AM IST. Real submissions live on My Tasks."}
          </p>
          <Link
            href="/internship/dashboard/tasks"
            className="mt-3 inline-flex rounded-xl bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white"
          >
            {isHi ? "आज के कार्य खोलें" : "Open today’s tasks"}
          </Link>
        </section>
      )}
    </div>
  );
}

function StepBody({
  dayN,
  title,
  done,
  isCurrent,
  locked,
  unlocksAt,
  lang,
  isHi,
}: {
  dayN: number;
  title: string;
  done: boolean;
  isCurrent: boolean;
  locked: boolean;
  unlocksAt?: string | null;
  lang: "en" | "hi";
  isHi: boolean;
  last: boolean;
}) {
  return (
    <>
      <div className="w-16 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B8F7A]">
          {isHi ? `दिन ${dayN}` : `DAY ${dayN}`}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[15px] font-bold ${
            locked ? "text-[#6B8F7A]" : "text-[#04330B]"
          }`}
        >
          {title}
        </p>
        {locked && unlocksAt ? (
          <p className="mt-0.5 text-[11.5px] font-medium text-[#9AB5A4]">
            {formatUnlockWhen(unlocksAt, lang)}
          </p>
        ) : isCurrent ? (
          <p className="mt-0.5 text-[11.5px] font-medium text-[#0B5A2A]">
            {isHi ? "यहाँ हैं आप — चरण खोलें" : "You are here — open this step"}
          </p>
        ) : null}
      </div>
      <span className="shrink-0">
        {done ? (
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#16A34A]">
            <CheckCircle2 size={15} />
            {isHi ? "पूरा" : "Completed"}
          </span>
        ) : isCurrent ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B5A2A] px-2.5 py-1 text-[11px] font-bold text-white">
            <Circle size={10} className="fill-white text-white" />
            {isHi ? "अभी" : "CURRENT"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#94A3B8]">
            <Lock size={13} />
            {isHi ? "लॉक" : "Locked"}
          </span>
        )}
      </span>
    </>
  );
}

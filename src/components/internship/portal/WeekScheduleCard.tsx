"use client";

import { CalendarClock, Sun } from "lucide-react";
import {
  formatUnlockWhen,
  programmeDay,
  type InternDash,
} from "./types";

export default function WeekScheduleCard({
  isHi,
  data,
}: {
  isHi: boolean;
  data?: InternDash | null;
}) {
  const schedule = data?.schedule;
  const day = programmeDay(data || null);
  const next = schedule?.nextOpen;
  const timeline = schedule?.timeline || [];
  const unlockTime = schedule?.unlockTime || "09:00 IST";
  const sundayOff = schedule?.isSundayOff;

  return (
    <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-start gap-2.5">
        <CalendarClock size={16} className="mt-0.5 shrink-0 text-[#0B5A2A]" />
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-[#04330B]">
            {isHi ? "दो हफ़्ते का समय-सारणी" : "Your two-week timetable"}
          </p>
          <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#4F6B5C]">
            {isHi
              ? `सोमवार से शनिवार काम चलता है। रविवार छुट्टी — कुछ नया नहीं खुलता। हर काम के दिन सुबह ${unlockTime} पर नए मॉड्यूल/कार्य खुलते हैं।`
              : `Mon–Sat are working days. Sunday is a holiday — nothing new opens. On working days, new modules/tasks open at ${unlockTime}.`}
          </p>
          {day ? (
            <p className="mt-1.5 text-[12px] font-semibold text-[#0B5A2A]">
              {isHi
                ? `आज कार्य-दिन ${schedule?.workingDayNumber ?? day.day} / ${schedule?.workingDaysTotal ?? 12} (कुल ${day.total} कैलेंडर दिन)`
                : `Working day ${schedule?.workingDayNumber ?? day.day} of ${schedule?.workingDaysTotal ?? 12} (${day.total} calendar days)`}
            </p>
          ) : null}
        </div>
      </div>

      {sundayOff ? (
        <div className="flex items-start gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-3">
          <Sun size={15} className="mt-0.5 shrink-0 text-[#B45309]" />
          <p className="text-[12.5px] font-semibold text-[#92400E]">
            {isHi
              ? "आज रविवार है — छुट्टी। सोमवार सुबह 9:00 IST पर अगला काम खुलेगा।"
              : "Today is Sunday — holiday. Next work opens Monday at 9:00 AM IST."}
          </p>
        </div>
      ) : null}

      {next?.opensAt ? (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#166534]">
            {schedule?.todayTask
              ? isHi
                ? "आज का काम"
                : "Today’s task"
              : isHi
                ? "अगला खुलेगा"
                : "Opens next"}
          </p>
          <p className="mt-1 text-[14px] font-bold text-[#04330B]">
            {(schedule?.todayTask || next).title}
          </p>
          <p className="mt-0.5 text-[12.5px] font-semibold text-[#0B5A2A]">
            {formatUnlockWhen((schedule?.todayTask || next).opensAt, isHi ? "hi" : "en")}
          </p>
        </div>
      ) : null}

      {timeline.length > 0 ? (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B8F7A]">
            {isHi ? "आने वाले दिन" : "Coming up"}
          </p>
          <ul className="mt-2 space-y-2">
            {timeline.slice(0, 6).map((row) => (
              <li
                key={`${row.title}-${row.opensAt}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-[#EAF2EC] px-3 py-2"
              >
                <div className="min-w-0">
                  <p
                    className={`text-[13px] font-bold truncate ${
                      row.open ? "text-[#0B5A2A]" : "text-[#04330B]"
                    }`}
                  >
                    {row.title}
                  </p>
                  <p className="text-[11.5px] font-medium text-[#6B8F7A]">
                    {formatUnlockWhen(row.opensAt, isHi ? "hi" : "en")}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    row.open
                      ? "bg-[#E8F5EC] text-[#0B5A2A]"
                      : "bg-[#EEF2FF] text-[#4338CA]"
                  }`}
                >
                  {row.open ? (isHi ? "खुला" : "Open") : isHi ? "जल्द" : "Soon"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

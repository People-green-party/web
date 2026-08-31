"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
import {
  formatUnlockWhen,
  programmeDay,
  type InternDash,
} from "./types";

type Page = "program" | "tasks" | "attendance";

export default function ProgrammeGuide({
  page,
  isHi,
  data,
}: {
  page: Page;
  isHi: boolean;
  data?: InternDash | null;
}) {
  const schedule = data?.schedule;
  const day = programmeDay(data || null);
  const next = schedule?.nextOpen;
  const unlockTime = schedule?.unlockTime || "09:00 IST";
  const sundayOff = schedule?.isSundayOff;

  const body =
    page === "attendance"
      ? isHi
        ? "उपस्थिति लाइव सत्र की है। My Classes से चेक-इन करें (सत्र से 2 घंटे पहले से 6 घंटे बाद तक)। प्रमाणपत्र के लिए कम से कम 3 सत्र और 75% उपस्थिति।"
        : "Attendance is for live sessions. Check in from My Classes (2 hours before until 6 hours after). Certificate needs at least 3 sessions and 75% presence."
      : isHi
        ? `सोम–शनि काम के दिन हैं। रविवार छुट्टी। हर काम के दिन सुबह ${unlockTime} पर नए मॉड्यूल/कार्य खुलते हैं — आज का काम खत्म करने के बाद अगला दिन/समय नीचे साफ़ दिखता है।`
        : `Mon–Sat are working days. Sunday is off. New modules/tasks open at ${unlockTime} each working day — after today’s work, the next open day and time is shown clearly below.`;

  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-[#DCEBE2] bg-[#F7FDF9] px-4 py-3.5">
      <CalendarClock size={16} className="mt-0.5 shrink-0 text-[#0B5A2A]" />
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-[#04330B]">
          {isHi ? "नियमित दो हफ़्ते का शेड्यूल" : "Regular two-week schedule"}
        </p>
        <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#4F6B5C]">{body}</p>
        {sundayOff ? (
          <p className="mt-1.5 text-[12px] font-bold text-[#B45309]">
            {isHi
              ? "आज रविवार — छुट्टी। सोमवार सुबह 9:00 IST पर काम फिर खुलेगा।"
              : "Sunday today — holiday. Work opens again Monday 9:00 AM IST."}
          </p>
        ) : day ? (
          <p className="mt-1.5 text-[12px] font-semibold text-[#0B5A2A]">
            {isHi
              ? `आज कार्य-दिन ${schedule?.workingDayNumber ?? day.day} / ${schedule?.workingDaysTotal ?? 12}`
              : `Working day ${schedule?.workingDayNumber ?? day.day} of ${schedule?.workingDaysTotal ?? 12}`}
          </p>
        ) : null}
        {next?.opensAt && page !== "attendance" ? (
          <p className="mt-1.5 text-[12.5px] font-bold text-[#04330B]">
            {isHi ? "अगला: " : "Next: "}
            {next.title}
            {" — "}
            {formatUnlockWhen(next.opensAt, isHi ? "hi" : "en")}
          </p>
        ) : null}
        {page === "attendance" ? (
          <Link
            href="/internship/dashboard/classes"
            className="mt-2 inline-block text-[12.5px] font-bold text-[#0B5A2A] hover:underline"
          >
            {isHi ? "लाइव सत्र देखें →" : "Open My Classes →"}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

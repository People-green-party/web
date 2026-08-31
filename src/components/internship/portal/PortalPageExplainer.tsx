"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck, Route } from "lucide-react";
import { deptLabel, type InternDash } from "./types";

/**
 * One clear story for both Program and Tasks so interns know why each page exists.
 */
export default function PortalPageExplainer({
  page,
  isHi,
  data,
}: {
  page: "program" | "tasks";
  isHi: boolean;
  data?: InternDash | null;
}) {
  const track = data
    ? deptLabel(data.application.department, isHi ? "hi" : "en")
    : "—";

  if (page === "program") {
    return (
      <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm space-y-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B8F7A]">
            {isHi ? "यह पेज क्या है?" : "What is this page?"}
          </p>
          <h2 className="mt-1 text-[17px] font-bold text-[#04330B]">
            {isHi ? "आपकी 9-चरण यात्रा का नक्शा" : "Your 9-step journey map"}
          </h2>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#4F6B5C]">
            {isHi
              ? `यहाँ असली काम जमा नहीं होता। यह बताता है आप दो हफ़्ते में कहाँ हो। असली PGP काम “मेरे कार्य” पर है — आपका ट्रैक: ${track}।`
              : `You do not submit work here. This shows where you are in the two weeks. Real PGP work is on My Tasks — your track: ${track}.`}
          </p>
        </div>
        <ol className="space-y-2.5">
          {(isHi
            ? [
                "नीचे आज का चरण खोलें — थोड़ी रीडिंग।",
                "फिर “मेरे कार्य” पर जाएँ — आज का टास्क जमा करें।",
                "सोम–शनि सुबह 9:00 IST पर अगला चरण/टास्क खुलता है। रविवार छुट्टी।",
              ]
            : [
                "Open today’s step below — short reading.",
                "Then go to My Tasks — submit today’s assignment.",
                "Mon–Sat at 9:00 AM IST the next step/task opens. Sunday is off.",
              ]
          ).map((line, i) => (
            <li key={line} className="flex gap-3 text-[13px] font-medium text-[#04330B]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5EC] text-[11px] font-bold text-[#0B5A2A]">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-snug">{line}</span>
            </li>
          ))}
        </ol>
        <Link
          href="/internship/dashboard/tasks"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#04330B] px-4 py-2.5 text-[13px] font-bold text-white"
        >
          <ClipboardCheck size={15} />
          {isHi ? "आज के कार्य पर जाएँ" : "Go to today’s tasks"}
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#DCEBE2] bg-white p-5 shadow-sm space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B8F7A]">
          {isHi ? "यह पेज क्या है?" : "What is this page?"}
        </p>
        <h2 className="mt-1 text-[17px] font-bold text-[#04330B]">
          {isHi ? `आज का असली काम · ${track}` : `Today’s real work · ${track}`}
        </h2>
        <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#4F6B5C]">
          {isHi
            ? "आवेदन पर जो विभाग चुना, उसी ट्रैक के टास्क यहाँ आते हैं। “सबके लिए” = शुरुआत/अंत के साझा कदम। “आपके ट्रैक का काम” = पोस्टर, ब्रीफ़, आउटरीच वगैरह।"
            : "Tasks match the department you chose at apply. “For everyone” = shared start/end steps. “Your track work” = posters, briefs, outreach, etc. for your field."}
        </p>
      </div>
      <ol className="space-y-2.5">
        {(isHi
          ? [
              "सिर्फ़ “आज” वाले टास्क खोलें और प्रूफ जमा करें — जमा होते ही कार्य पूरा।",
              "लॉक वाले कल/बाद में 9:00 IST पर खुलेंगे — पहले से करने की ज़रूरत नहीं।",
              "सारे टास्क + 3 लाइव चेक-इन पूरे → प्रमाणपत्र।",
            ]
          : [
              "Open only “Today” tasks and submit proof — it completes immediately, no mentor review.",
              "Locked ones open later at 9:00 AM IST — you cannot finish the internship in one day.",
              "All tasks + 3 live check-ins → certificate.",
            ]
        ).map((line, i) => (
          <li key={line} className="flex gap-3 text-[13px] font-medium text-[#04330B]">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5EC] text-[11px] font-bold text-[#0B5A2A]">
              {i + 1}
            </span>
            <span className="pt-0.5 leading-snug">{line}</span>
          </li>
        ))}
      </ol>
      <Link
        href="/internship/dashboard/program"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B5A2A] hover:underline"
      >
        <Route size={15} />
        {isHi ? "यात्रा का नक्शा देखें (मेरा प्रोग्राम)" : "See journey map (My Program)"}
      </Link>
    </div>
  );
}

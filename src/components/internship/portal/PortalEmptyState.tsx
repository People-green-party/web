"use client";

import React from "react";

export type PortalEmptyArt =
  | "sprout"
  | "sessions"
  | "tasks"
  | "library"
  | "mentors"
  | "announcements"
  | "attendance"
  | "certificate";

const ART: Record<PortalEmptyArt, string> = {
  sprout: "/internship/portal/empty/empty-sprout.png",
  sessions: "/internship/portal/empty/empty-sessions.png",
  tasks: "/internship/portal/empty/empty-tasks.png",
  library: "/internship/portal/empty/empty-library.png",
  mentors: "/internship/portal/empty/empty-mentors.png",
  announcements: "/internship/portal/empty/empty-announcements.png",
  attendance: "/internship/portal/empty/empty-attendance.png",
  certificate: "/internship/portal/empty/empty-certificate.png",
};

const SIZES = {
  sm: { box: "h-20 w-20", pad: "px-5 py-8", gap: "mt-4" },
  md: { box: "h-28 w-28", pad: "px-5 py-11", gap: "mt-5" },
  lg: { box: "h-36 w-36", pad: "px-6 py-14", gap: "mt-6" },
} as const;

export default function PortalEmptyState({
  art = "sprout",
  title,
  description,
  action,
  size = "md",
  className = "",
  bordered = true,
}: {
  art?: PortalEmptyArt;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
  bordered?: boolean;
}) {
  const s = SIZES[size];
  return (
    <div
      className={[
        "relative overflow-hidden text-center",
        bordered
          ? "rounded-2xl border border-dashed border-[#DCEBE2] bg-white"
          : "",
        s.pad,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* soft mint atmosphere behind the artwork */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/3 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(22,163,74,0.16) 0%, rgba(232,245,236,0) 70%)",
        }}
      />
      <div className="relative">
        <div className={`mx-auto ${s.box} portal-empty-float`}>
          <img
            src={ART[art]}
            alt=""
            aria-hidden
            className="h-full w-full object-contain select-none"
            draggable={false}
          />
        </div>
        <p className={`${s.gap} text-[14.5px] font-bold text-[#04330B]`}>{title}</p>
        {description ? (
          <p className="mx-auto mt-2 max-w-sm text-[13px] font-medium leading-relaxed text-[#6B8F7A]">
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

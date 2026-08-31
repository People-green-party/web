"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ExternalLink, FileText, Link2, PlayCircle, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import { deptLabel, resourceTypeLabel } from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

function typeIcon(type: string) {
  const t = type.toLowerCase();
  if (t === "video") return PlayCircle;
  if (t === "pdf" || t === "doc") return FileText;
  return Link2;
}

export default function InternResourcesPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const locale = isHi ? "hi-IN" : "en-IN";
  const { data, loading } = useInternPortal();
  const internDept = data?.application.department;
  const track = internDept ? deptLabel(internDept, isHi ? "hi" : "en") : "—";

  const { shared, trackItems } = useMemo(() => {
    const resources = data?.resources || [];
    return {
      shared: resources.filter((r) => !r.department),
      trackItems: resources.filter((r) => r.department && r.department === internDept),
    };
  }, [data?.resources, internDept]);

  const extras = [
    { href: "/internship/faq", label: isHi ? "इंटर्नशिप FAQ" : "Internship FAQ" },
    { href: "/internship", label: isHi ? "प्रोग्राम गाइडलाइन्स" : "Programme guidelines" },
    { href: "/internship/dashboard/classes", label: isHi ? "कक्षा रिकॉर्डिंग" : "Class recordings" },
  ];

  if (loading && !data) {
    return <div className="p-8 font-semibold text-[#6B8F7A]">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="w-full max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-[22px] font-bold text-[#04330B]">
          {isHi ? "रिसोर्स लाइब्रेरी" : "Resource Library"}
        </h1>
        <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
          {isHi
            ? `साझा गाइड + ${track} के ट्रैक रिसोर्स।`
            : `Shared guides plus ${track} track resources.`}
        </p>
      </div>

      <ResourceGroup
        title={isHi ? `${track} — ट्रैक रिसोर्स` : `${track} — track resources`}
        items={trackItems}
        isHi={isHi}
        locale={locale}
        empty={
          isHi
            ? "इस ट्रैक के खास रिसोर्स अभी नहीं जुड़े।"
            : "No track-specific resources yet."
        }
      />

      <ResourceGroup
        title={isHi ? "सबके लिए" : "For everyone"}
        items={shared}
        isHi={isHi}
        locale={locale}
        empty={isHi ? "अभी कोई साझा रिसोर्स नहीं।" : "No shared resources yet."}
      />

      <section>
        <h2 className="mb-3 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-[#6B8F7A]">
          <BookOpen size={14} /> {isHi ? "महत्वपूर्ण लिंक" : "Important links"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {extras.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-2xl border border-[#DCEBE2] bg-white px-4 py-3.5 text-[14px] font-bold text-[#04330B] hover:border-[#B9D3C4]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

type PortalResource = NonNullable<
  NonNullable<ReturnType<typeof useInternPortal>["data"]>["resources"]
>[number];

function ResourceGroup({
  title,
  items,
  isHi,
  locale,
  empty,
}: {
  title: string;
  items: PortalResource[];
  isHi: boolean;
  locale: string;
  empty: string;
}) {
  return (
    <section>
      <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-[#6B8F7A]">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-[#EAF2EC] bg-[#F8FBF9] px-4 py-3 text-[13px] font-medium text-[#6B8F7A]">
          {empty}
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const Icon = typeIcon(r.type);
            return (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 rounded-2xl border border-[#DCEBE2] bg-white px-4 py-3.5 hover:border-[#B9D3C4]"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#0B5A2A]">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-[14px] font-bold text-[#04330B]">{r.title}</span>
                    <ExternalLink size={14} className="mt-0.5 shrink-0 text-[#6B8F7A]" />
                  </span>
                  {r.description ? (
                    <span className="mt-1 block text-[12.5px] font-medium text-[#4F6B5C]">
                      {r.description}
                    </span>
                  ) : null}
                  <span className="mt-1.5 block text-[11px] font-semibold text-[#6B8F7A]">
                    {resourceTypeLabel(r.type, isHi ? "hi" : "en")}
                    {" · "}
                    {new Date(r.createdAt).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ExternalLink, FileText, Link2, PlayCircle, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { useInternPortal } from "@/components/internship/portal/InternPortalContext";
import {
  deptLabel,
  resourceTypeLabel,
} from "@/components/internship/portal/types";
import PortalEmptyState from "@/components/internship/portal/PortalEmptyState";

const TYPE_ORDER = ["video", "pdf", "doc", "link"];

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

  const grouped = useMemo(() => {
    const resources = data?.resources || [];
    const map = new Map<string, typeof resources>();
    for (const r of resources) {
      const key = (r.type || "link").toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    const keys = [...map.keys()].sort((a, b) => {
      const ia = TYPE_ORDER.indexOf(a);
      const ib = TYPE_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return keys.map((key) => ({ type: key, items: map.get(key)! }));
  }, [data?.resources]);

  const extras = [
    { href: "/internship", label: isHi ? "इंटर्नशिप होम" : "Internship home" },
    { href: "/internship/faq", label: isHi ? "FAQ" : "FAQ" },
    { href: "/internship/dashboard/classes", label: isHi ? "कक्षा लाइब्रेरी" : "Class library" },
  ];

  if (loading && !data) {
    return <div className="p-8 text-[#6B8F7A] font-semibold">{isHi ? "लोड हो रहा है…" : "Loading…"}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl">
      <h1 className="text-[22px] font-bold text-[#04330B]">{isHi ? "रिसोर्स लाइब्रेरी" : "Resource Library"}</h1>
      <p className="mt-1 text-[13.5px] font-medium text-[#6B8F7A]">
        {isHi ? "उपयोगी लिंक, दस्तावेज़ और गाइड।" : "Helpful links, documents, and guides."}
      </p>

      <div className="mt-6 space-y-6">
        {grouped.length === 0 ? (
          <PortalEmptyState
            art="library"
            title={isHi ? "अभी कोई क्यूरेटेड रिसोर्स नहीं" : "No curated resources yet"}
            description={
              isHi
                ? "तब तक नीचे दिए अतिरिक्त लिंक देखें।"
                : "Meanwhile, explore the extra links below."
            }
          />
        ) : (
          grouped.map((group) => (
            <section key={group.type}>
              <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#6B8F7A] mb-3">
                {resourceTypeLabel(group.type, isHi ? "hi" : "en")}
              </h2>
              <div className="space-y-3">
                {group.items.map((r) => {
                  const Icon = typeIcon(r.type);
                  return (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-3 rounded-2xl border border-[#DCEBE2] bg-white px-4 py-3.5 hover:border-[#B9D3C4]"
                    >
                      <span className="mt-0.5 h-9 w-9 rounded-xl bg-[#EAF7EE] text-[#0B5A2A] flex items-center justify-center shrink-0">
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-[14px] font-bold text-[#04330B]">{r.title}</span>
                          <ExternalLink size={14} className="text-[#6B8F7A] shrink-0 mt-0.5" />
                        </span>
                        {r.description ? (
                          <span className="mt-1 block text-[12.5px] font-medium text-[#4F6B5C]">
                            {r.description}
                          </span>
                        ) : null}
                        <span className="mt-1.5 block text-[11px] font-semibold text-[#6B8F7A]">
                          {new Date(r.createdAt).toLocaleDateString(locale, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {r.department ? ` · ${deptLabel(r.department, isHi ? "hi" : "en")}` : ""}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          ))
        )}

        <section>
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#6B8F7A] mb-3 flex items-center gap-1.5">
            <BookOpen size={14} /> {isHi ? "अतिरिक्त लिंक" : "Extra links"}
          </h2>
          <div className="space-y-3">
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
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  ClipboardCheck,
  Flag,
  School,
  Users,
} from "lucide-react";
import { ADMIN_API, getAdminToken } from "@/lib/adminApi";

const API = ADMIN_API;

type YouthDashboard = {
  totalYouth: number;
  ageGroup16to17: number;
  ageGroup18Plus: number;
  memberTypeStudent: number;
  memberTypeProfessional: number;
  memberTypeVolunteer: number;
  pendingIssues: number;
  escalatedIssues: number;
  flaggedMembers: number;
};

const cards: {
  key: keyof YouthDashboard;
  title: string;
  icon: typeof Users;
  href?: string;
}[] = [
  { key: "totalYouth", title: "Total Youth Members", icon: Users, href: "/admin/youth/members" },
  {
    key: "ageGroup16to17",
    title: "Age 16-17 (Civic Volunteers)",
    icon: Users,
    href: "/admin/youth/members?youthAgeGroup=16-17",
  },
  {
    key: "ageGroup18Plus",
    title: "Age 18+ (Active Members)",
    icon: Users,
    href: "/admin/youth/members?youthAgeGroup=18%2B",
  },
  {
    key: "memberTypeStudent",
    title: "Students",
    icon: School,
    href: "/admin/youth/members?memberType=student",
  },
  {
    key: "memberTypeProfessional",
    title: "Professionals",
    icon: Building2,
    href: "/admin/youth/members?memberType=professional",
  },
  {
    key: "memberTypeVolunteer",
    title: "Volunteers",
    icon: ClipboardCheck,
    href: "/admin/youth/members?memberType=volunteer",
  },
  { key: "pendingIssues", title: "Open Issues", icon: AlertTriangle, href: "/admin/youth/action-queue" },
  { key: "escalatedIssues", title: "Escalated Issues", icon: AlertTriangle, href: "/admin/youth/action-queue" },
  { key: "flaggedMembers", title: "Open Flags", icon: Flag, href: "/admin/youth/action-queue" },
];

export default function AdminYouthPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<YouthDashboard | null>(null);

  const getAdminAccessHeader = (): Record<string, string> => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/youth/dashboard`, { headers: getAdminAccessHeader() });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Your admin access has expired. Please enter the password again.");
        throw new Error(await res.text());
      }
      setData(await res.json());
    } catch (e: any) {
      setError(e?.message || "Failed to load Youth dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    sessionStorage.setItem("admin_youth_access_granted", "1");
    setAccessGranted(true);
    loadDashboard();
  }, []);

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 font-['Familjen_Grotesk'] text-[#04330B]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-[#16A34A] uppercase tracking-[0.18em]">
            Peoples Green Party
          </p>
          <h2 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Jinda Youth Dashboard
          </h2>
          <p className="mt-1 text-sm text-[#587E67] font-medium">
            Click any membership card to open the full member list. Issues open the Action Queue.
          </p>
        </div>
      </div>

      {!accessGranted && (
        <section className="rounded-2xl border border-[#DDEEE4] bg-white p-6 shadow-sm text-center">
          <p className="font-bold text-[#04330B]">Admin session required</p>
          <p className="mt-2 text-sm text-[#587E67] font-medium">
            Sign in at /admin/login to load live Jinda Youth data.
          </p>
        </section>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 text-sm">
          {error}
        </div>
      )}

      {accessGranted && data && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const href = card.href;
            const body = (
              <>
                <Icon className="text-[#16A34A]" size={24} />
                <div className="mt-3 text-2xl sm:text-3xl font-black tabular-nums">
                  {data[card.key]}
                </div>
                <div className="mt-1 text-sm font-bold text-[#587E67] leading-snug">
                  {card.title}
                </div>
              </>
            );
            if (href) {
              return (
                <Link
                  key={card.key}
                  href={href}
                  className="rounded-2xl border border-[#DDEEE4] bg-white p-4 sm:p-5 shadow-sm min-w-0 hover:border-[#16A34A]/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  {body}
                  <p className="mt-2 text-[11px] font-bold text-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity">
                    View details →
                  </p>
                </Link>
              );
            }
            return (
              <div
                key={card.key}
                className="rounded-2xl border border-[#DDEEE4] bg-white p-4 sm:p-5 shadow-sm min-w-0"
              >
                {body}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

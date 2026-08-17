"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import { adminFetch, getAdminToken } from "@/lib/adminApi";
import {
  type AdminNotification,
  formatNotificationBody,
  formatNotificationTitle,
  isNotificationRead,
  loadNotifReadState,
  markAllNotificationsRead,
  markNotificationRead,
  notificationHref,
} from "@/lib/adminNotifications";

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readState, setReadState] = useState(() => loadNotifReadState());
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = useCallback(async () => {
    if (!getAdminToken()) {
      router.replace("/admin/login?next=/admin/notifications");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<{ logs?: AdminNotification[] }>("audit/logs?limit=100");
      setItems(Array.isArray(data?.logs) ? data.logs : []);
      setReadState(loadNotifReadState());
    } catch (e: any) {
      setError(e?.message || "Failed to load notifications");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const unreadCount = useMemo(
    () => items.filter((n) => !isNotificationRead(n.id, readState)).length,
    [items, readState]
  );

  const visible = useMemo(() => {
    if (filter === "unread") {
      return items.filter((n) => !isNotificationRead(n.id, readState));
    }
    return items;
  }, [items, filter, readState]);

  const openItem = (n: AdminNotification) => {
    setReadState(markNotificationRead(n.id));
    router.push(notificationHref(n));
  };

  const markAll = () => {
    setReadState(markAllNotificationsRead(items));
  };

  return (
    <div className="w-full max-w-3xl space-y-5 font-['Familjen_Grotesk'] text-[#04330B]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#16A34A] uppercase tracking-[0.18em]">
            Notification center
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight flex items-center gap-2">
            <Bell size={22} /> All messages
          </h2>
          <p className="mt-1 text-sm text-[#587E67] font-medium">
            {unreadCount} unread · click a message to open the related admin page
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3 py-2 text-xs font-bold border ${
              filter === "all"
                ? "bg-[#04330B] text-white border-[#04330B]"
                : "border-[#DDEEE4] text-[#04330B] bg-white"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-xl px-3 py-2 text-xs font-bold border ${
              filter === "unread"
                ? "bg-[#04330B] text-white border-[#04330B]"
                : "border-[#DDEEE4] text-[#04330B] bg-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={markAll}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DDEEE4] bg-white px-3 py-2 text-xs font-bold text-[#04330B] disabled:opacity-40"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[#E4F2EA] bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[#587E67] font-semibold text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading messages…
          </div>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-sm font-semibold text-[#587E67]">
            {filter === "unread" ? "No unread messages." : "No notifications yet."}
          </p>
        ) : (
          <ul className="divide-y divide-[#F0F5F2]">
            {visible.map((n) => {
              const unread = !isNotificationRead(n.id, readState);
              const href = notificationHref(n);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => openItem(n)}
                    className={`w-full text-left px-4 sm:px-5 py-4 hover:bg-[#F8FBF9] transition-colors ${
                      unread ? "bg-[#F3FBF6]" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                          unread ? "bg-[#BE1E2D]" : "bg-[#D1D5DB]"
                        }`}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm ${unread ? "font-black" : "font-bold"} text-[#04330B]`}>
                            {formatNotificationTitle(n.action)}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] shrink-0">
                            Open <ExternalLink size={12} />
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#587E67] font-medium line-clamp-2">
                          {formatNotificationBody(n)}
                        </p>
                        <p className="mt-1 text-[11px] text-[#94A3B8] font-medium">
                          {n.actor?.name ? `${n.actor.name} · ` : ""}
                          {n.createdAt ? new Date(n.createdAt).toLocaleString("en-IN") : ""}
                          {" · "}
                          <Link
                            href={href}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#0D5229] hover:underline"
                          >
                            {href}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

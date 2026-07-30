"use client";
import { useEffect } from "react";

async function clearStaleCaches() {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Always drop stale SWs in local/dev — old next-pwa builds were caching pages.
    if (process.env.NODE_ENV !== "production") {
      clearStaleCaches().catch(() => {});
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("SW register failed", err));
  }, []);

  return null;
}

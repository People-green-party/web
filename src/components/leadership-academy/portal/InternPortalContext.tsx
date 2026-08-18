"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearInternSession, getInternToken, internFetch } from "@/lib/internApi";
import type { InternDash } from "./types";

type Ctx = {
  data: InternDash | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  logout: () => void;
};

const InternPortalContext = createContext<Ctx | null>(null);

export function InternPortalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [data, setData] = useState<InternDash | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!getInternToken()) {
      router.replace("/internship/status");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const dash = await internFetch<InternDash>("leadership-academy/me/dashboard");
      // Applicants without a place see their application status instead.
      if (dash?.access?.granted === false) {
        router.replace("/internship/application-status");
        return;
      }
      setData(dash);
    } catch (e: any) {
      const msg = e?.message || "Failed to load dashboard";
      const lower = String(msg).toLowerCase();
      if (lower.includes("not been accepted")) {
        router.replace("/internship/application-status");
        return;
      }
      setError(msg);
      if (lower.includes("unauthorized")) {
        clearInternSession();
        router.replace("/internship/status");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearInternSession();
    router.push("/internship/status");
  }, [router]);

  const value = useMemo(
    () => ({ data, loading, error, refresh, logout }),
    [data, loading, error, refresh, logout],
  );

  return <InternPortalContext.Provider value={value}>{children}</InternPortalContext.Provider>;
}

export function useInternPortal() {
  const ctx = useContext(InternPortalContext);
  if (!ctx) throw new Error("useInternPortal must be used within InternPortalProvider");
  return ctx;
}

"use client";

import React from "react";
import { InternPortalProvider } from "@/components/leadership-academy/portal/InternPortalContext";
import { InternPortalShell } from "@/components/leadership-academy/portal/InternPortalShell";
import PortalLoadGuard from "@/components/leadership-academy/portal/PortalLoadGuard";

export default function InternDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <InternPortalProvider>
      <InternPortalShell>
        <PortalLoadGuard>{children}</PortalLoadGuard>
      </InternPortalShell>
    </InternPortalProvider>
  );
}

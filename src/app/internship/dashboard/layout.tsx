"use client";

import React from "react";
import { InternPortalProvider } from "@/components/internship/portal/InternPortalContext";
import { InternPortalShell } from "@/components/internship/portal/InternPortalShell";
import PortalLoadGuard from "@/components/internship/portal/PortalLoadGuard";

export default function InternDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <InternPortalProvider>
      <InternPortalShell>
        <PortalLoadGuard>{children}</PortalLoadGuard>
      </InternPortalShell>
    </InternPortalProvider>
  );
}

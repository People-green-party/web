"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { RequireAdmin } from "../../components/RequireAdmin";
import { AdminShell } from "../../components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login stays standalone — no website navbar/footer, no admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <RequireAdmin>
      <AdminShell>{children}</AdminShell>
    </RequireAdmin>
  );
}

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { RequireAdmin } from "../../components/RequireAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page must stay public
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <RequireAdmin>{children}</RequireAdmin>;
}

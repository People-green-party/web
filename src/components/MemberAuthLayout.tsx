"use client";

import React from "react";
import { RequireAuth } from "../app/components/RequireAuth";

/** Layout wrapper: member must be logged in. */
export default function MemberAuthLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}

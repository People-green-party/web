"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function AcademyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Always land at the top when opening Internship routes from the navbar
    // (unless URL has an intentional hash like #departments)
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-clip pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply to PGP Internship. Free for eligible volunteers. Two-week intake with offline and hybrid modes.",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "PGP Internship",
    template: "%s | PGP Internship",
  },
  description:
    "A two-week internship programme where you work on real PGP projects, gain practical skills, build a portfolio and earn a professional certificate.",
  openGraph: {
    title: "PGP Internship",
    description:
      "Learn. Lead. Build. Real internship projects, mentor guidance, portfolio and certificate across six departments.",
    type: "website",
  },
};

export default function LeadershipAcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

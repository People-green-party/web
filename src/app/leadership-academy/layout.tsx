import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "PGP Leadership Academy",
    template: "%s | PGP Leadership Academy",
  },
  description:
    "A two-week leadership programme where you work on real PGP projects, gain practical skills, build a portfolio and earn a professional certificate.",
  openGraph: {
    title: "PGP Leadership Academy",
    description:
      "Learn. Lead. Build. Real projects, mentor guidance, portfolio and certificate across six departments.",
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

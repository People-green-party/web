import type { Metadata } from "next";
import { FaqJsonLd } from "./FaqJsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about PGP Leadership Academy — duration, fee, eligibility, modes, certificates and departments.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FaqJsonLd />
      {children}
    </>
  );
}

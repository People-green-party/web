import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment status | People's Green",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function PaymentResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}

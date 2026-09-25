import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate | Indian Peoples Green Party",
  description: "Make a voluntary online contribution to Indian Peoples Green Party through its official website.",
};

export default function DonationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

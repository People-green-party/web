import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Indian Peoples Green Party",
  description: "Learn about Indian Peoples Green Party, its public purpose, principles and official contact information.",
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}


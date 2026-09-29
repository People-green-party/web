import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartmentDetail } from "@/components/internship/DepartmentDetail";
import { DEPARTMENTS, getDepartment } from "@/data/internship/departments";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) {
    return { title: "Department | PGP Internship" };
  }
  return {
    title: `${dept.name} | PGP Internship`,
    description: dept.description,
    openGraph: {
      title: `${dept.name} | PGP Internship`,
      description: dept.description,
      images: [dept.image],
    },
  };
}

export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) notFound();
  return <DepartmentDetail department={dept} />;
}

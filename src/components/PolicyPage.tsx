import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type PolicyPageProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
};

export function PolicyPage({ eyebrow, title, intro, children }: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-white pt-[70px] text-gray-800 lg:pt-[92px]">
      <Navbar />

      <main>
        <section className="border-b border-[#E4F2EA] bg-[#F5FBF7]">
          <div className="mx-auto w-full max-w-[1120px] px-4 py-14 lg:px-8 lg:py-20">
            <p className="mb-3 font-['Familjen_Grotesk'] text-sm font-bold uppercase tracking-[0.14em] text-[#587E67]">
              {eyebrow}
            </p>
            <h1 className="max-w-4xl font-['Familjen_Grotesk'] text-[36px] font-bold leading-tight text-[#04330B] sm:text-[48px] lg:text-[60px]">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-[#587E67] lg:text-lg">
              {intro}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1120px] px-4 py-12 lg:px-8 lg:py-16">
          <div className="max-w-4xl space-y-10 text-[15px] leading-7 text-[#2D3A31] sm:text-base">
            {children}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function PolicySection({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-['Familjen_Grotesk'] text-2xl font-bold text-[#04330B] sm:text-[28px]">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export const policyListClass = "list-disc space-y-2 pl-6 marker:text-[#0D5229]";

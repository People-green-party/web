import { academyI18n } from "@/data/leadership-academy/i18n";

/** Server-safe FAQ structured data for SEO. */
export function FaqJsonLd() {
  const faqs = academyI18n.en.faqs;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

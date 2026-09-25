"use client";

import type { ReactNode } from "react";
import { useLanguage } from "./LanguageContext";

export function LocalizedContent({ en, hi }: { en: ReactNode; hi: ReactNode }) {
  const { language } = useLanguage();
  return <>{language === "hi" ? hi : en}</>;
}

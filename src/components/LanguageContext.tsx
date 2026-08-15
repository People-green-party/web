"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import { translations } from "./translations";

const LanguageContext = createContext<any>(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    // Hindi is the primary / default language for the public site.
    const [language, setLanguage] = useState("hi");

    useEffect(() => {
        // New key so older English defaults don't override Hindi-first policy.
        const savedLang = localStorage.getItem("pgp_ui_lang");
        if (savedLang === "hi" || savedLang === "en") {
            setLanguage(savedLang);
        } else {
            localStorage.setItem("pgp_ui_lang", "hi");
            localStorage.removeItem("pgp_language");
        }
    }, []);

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = language;
        }
    }, [language]);

    const updateLanguage = (newLang: string) => {
        setLanguage(newLang);
        localStorage.setItem("pgp_ui_lang", newLang);
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: updateLanguage,
            t: translations[language as keyof typeof translations] || translations.hi
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

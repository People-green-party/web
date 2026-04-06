"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import { translations } from "./translations";

const LanguageContext = createContext<any>(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("pgp_language");
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const updateLanguage = (newLang: string) => {
        setLanguage(newLang);
        localStorage.setItem("pgp_language", newLang);
    };

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: updateLanguage,
            t: translations[language as keyof typeof translations] || translations.en
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

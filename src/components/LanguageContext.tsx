"use client";

import React, { useState, useContext, createContext } from "react";
import { translations } from "./translations";

const LanguageContext = createContext<any>(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState("hi");

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            t: translations[language as keyof typeof translations]
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

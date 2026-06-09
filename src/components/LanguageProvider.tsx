"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type Translations } from "@/lib/translations";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "befit-gym-lang";

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "sq") {
      // Reading localStorage during render would cause a hydration mismatch
      // (server always renders the "en" default), so we sync once after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(stored);
    }
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

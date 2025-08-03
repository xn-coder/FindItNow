
"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, TranslationKey, getTranslator } from '@/lib/translations';

type Language = 'en' | 'de' | 'fr';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('finditnow_lang') as Language;
      if (storedLang && ['en', 'de', 'fr'].includes(storedLang)) {
        setLanguage(storedLang);
      }
    } catch (error) {
        console.error("Failed to parse language from localStorage", error);
        localStorage.removeItem('finditnow_lang');
    }
    setIsMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('finditnow_lang', lang);
    setLanguage(lang);
  };
  
  const t = useCallback(getTranslator(language), [language]);

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{isMounted && children}</LanguageContext.Provider>;
}

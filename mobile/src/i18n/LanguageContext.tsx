// ═══════════════════════════════════════════
// Language Context — Global language state
// ═══════════════════════════════════════════
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, translations, Translations, LANGUAGE_NAMES } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  languageName: 'English',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    languageName: LANGUAGE_NAMES[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export { Language, LANGUAGE_NAMES };

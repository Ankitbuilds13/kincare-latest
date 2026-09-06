import React, { createContext, useContext, useState, useEffect } from 'react';
import { INDIAN_LANGUAGES, LanguageInfo } from '../data/languages';
import { getTranslation, TranslationStrings } from '../data/translations';

interface LanguageContextType {
  currentLanguage: LanguageInfo;
  setLanguage: (langCode: string) => void;
  t: TranslationStrings;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  availableLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'kincare_language_code';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLangCode, setCurrentLangCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem('silvercare_language_code');
      if (saved && INDIAN_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const currentLanguage = INDIAN_LANGUAGES.find(l => l.code === currentLangCode) || INDIAN_LANGUAGES[0];
  const t = getTranslation(currentLangCode);

  const setLanguage = (langCode: string) => {
    const valid = INDIAN_LANGUAGES.some(l => l.code === langCode);
    const chosenCode = valid ? langCode : 'en';
    setCurrentLangCode(chosenCode);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, chosenCode);
    } catch {
      // Ignore
    }
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        availableLanguages: INDIAN_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

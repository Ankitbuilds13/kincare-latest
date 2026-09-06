import React, { useState } from 'react';
import { Languages, Check, X, Search, Sparkles, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageModal: React.FC = () => {
  const { 
    currentLanguage, 
    setLanguage, 
    isLanguageModalOpen, 
    closeLanguageModal, 
    availableLanguages,
    t 
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isLanguageModalOpen) return null;

  const filteredLanguages = availableLanguages.filter(lang => {
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.region.toLowerCase().includes(q)
    );
  });

  const handleSelect = (code: string) => {
    setLanguage(code);
    closeLanguageModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="languageModalTitle"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border-2 border-slate-200 dark:border-slate-800 transition-colors"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 dark:from-teal-950 dark:to-slate-950 text-white p-4 sm:p-6 flex items-center justify-between gap-4 border-b border-teal-700/30">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 border border-teal-400/40 p-2.5 rounded-2xl text-teal-300">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 id="languageModalTitle" className="text-xl sm:text-2xl font-black tracking-tight">
                {t.languagesOfIndia || 'Languages of India'}
              </h2>
              <p className="text-xs sm:text-sm text-teal-200 dark:text-teal-300 font-medium">
                Choose your native language for Kin Care
              </p>
            </div>
          </div>
          <button
            onClick={closeLanguageModal}
            id="closeLanguageModalBtn"
            className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
            aria-label="Close language selector"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="languageSearchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchLanguage || 'Search language (e.g. Hindi, Bengali, Tamil)...'}
              className="w-full pl-10 pr-4 py-2.5 text-sm sm:text-base rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {filteredLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage.code;
              return (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id={`selectLang_${lang.code}`}
                  onClick={() => handleSelect(lang.code)}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl text-left border-2 transition cursor-pointer ${
                    isSelected 
                      ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-600 dark:border-teal-400 shadow-sm ring-2 ring-teal-500/20' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {lang.name}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 font-medium">
                      {lang.region}
                    </span>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    {isSelected ? (
                      <div className="h-7 w-7 rounded-full bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-transparent">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-base">No language matched "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
              >
                Show all Indian languages
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Includes 12 official regional Indian languages + English</span>
          </div>
          <button
            onClick={closeLanguageModal}
            className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer ml-auto"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

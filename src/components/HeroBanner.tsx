import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { ServiceCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroBannerProps {
  selectedCategory: ServiceCategory;
  onSelectCategory: (category: ServiceCategory) => void;
  onOpenCallHelp: () => void;
  cityName: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedCategory,
  onSelectCategory,
  cityName
}) => {
  const { t } = useLanguage();

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: t.catAll },
    { id: 'nursing', label: t.catNursing },
    { id: 'attendant', label: t.catAttendant },
    { id: 'diagnostics', label: t.catDiagnostics },
    { id: 'pharmacy', label: t.catPharmacy },
    { id: 'physio', label: t.catPhysio },
    { id: 'doctor', label: t.catDoctor },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-3 md:py-6 space-y-6">
      {/* 1. Main Welcoming Hero Card with Animated Entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gradient-to-br from-teal-950 via-teal-800 to-emerald-900 dark:from-slate-900 dark:via-teal-950 dark:to-slate-950 rounded-3xl p-5 sm:p-8 md:p-12 text-white shadow-xl relative overflow-hidden border border-teal-800/30 dark:border-slate-800"
      >
        
        {/* Subtle decorative glow circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-3.5 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-teal-300/40 text-teal-200 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-teal-300 flex-shrink-0" />
              {t.policeVerifiedBadge}
            </span>
            <span className="inline-flex items-center gap-1 bg-teal-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-teal-100">
              <Clock className="h-3.5 w-3.5" /> {t.nowServing} {cityName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
            {t.heroHeading}
          </h1>

          <p className="text-teal-50 text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            {t.heroSubheading}
          </p>

          {/* Trust points */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-teal-100 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{t.seniorConcessionBadge}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{t.sameDayGuaranteed}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{t.familyUpdates}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Category Filter Pills with Connected Sliding Transitions Between Buttons */}
      <div className="relative flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              id={`categoryBtn_${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative whitespace-nowrap px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm md:text-base transition cursor-pointer min-h-[44px] flex items-center select-none ${
                isSelected
                  ? 'text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs'
              }`}
            >
              {/* Connected Active Background Pill */}
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryHighlight"
                  className="absolute inset-0 bg-teal-700 dark:bg-teal-600 rounded-2xl shadow-md border-2 border-teal-800 dark:border-teal-500"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

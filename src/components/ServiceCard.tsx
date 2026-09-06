import React from 'react';
import { 
  Stethoscope, 
  HandHeart, 
  Activity, 
  Pill, 
  PersonStanding, 
  Video, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { CareService } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServiceCardProps {
  service: CareService;
  onBook: (service: CareService) => void;
  onQuickCall: (service: CareService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  const { t } = useLanguage();

  const getLocalizedTitleAndDesc = () => {
    switch (service.id) {
      case 'nurse-daily':
        return { title: t.nurseTitle, desc: t.nurseDesc };
      case 'bedside-companion':
        return { title: t.attendantTitle, desc: t.attendantDesc };
      case 'home-diagnostics':
        return { title: t.labTestsTitle, desc: t.labTestsDesc };
      case 'medicine-delivery':
        return { title: t.medsTitle, desc: t.medsDesc };
      case 'physio-session':
        return { title: t.physioTitle, desc: t.physioDesc };
      case 'doctor-geriatric':
        return { title: t.doctorTitle, desc: t.doctorDesc };
      default:
        return { title: service.title, desc: service.shortDesc };
    }
  };

  const localized = getLocalizedTitleAndDesc();

  const renderIcon = () => {
    switch (service.icon) {
      case 'stethoscope':
        return <Stethoscope className="h-9 w-9 text-teal-600 dark:text-teal-400" />;
      case 'hand-heart':
        return <HandHeart className="h-9 w-9 text-blue-600 dark:text-blue-400" />;
      case 'activity':
        return <Activity className="h-9 w-9 text-purple-600 dark:text-purple-400" />;
      case 'pill':
        return <Pill className="h-9 w-9 text-amber-600 dark:text-amber-400" />;
      case 'person-standing':
        return <PersonStanding className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />;
      case 'video':
        return <Video className="h-9 w-9 text-rose-600 dark:text-rose-400" />;
      default:
        return <ShieldCheck className="h-9 w-9 text-teal-600 dark:text-teal-400" />;
    }
  };

  const getAccentStyles = () => {
    switch (service.accentColor) {
      case 'blue':
        return {
          bgBox: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          btnText: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
        };
      case 'purple':
        return {
          bgBox: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
          badge: 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          btnText: 'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300'
        };
      case 'amber':
        return {
          bgBox: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          btnText: 'text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300'
        };
      case 'emerald':
        return {
          bgBox: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
          badge: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          btnText: 'text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300'
        };
      case 'rose':
        return {
          bgBox: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
          badge: 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          btnText: 'text-rose-700 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300'
        };
      case 'teal':
      default:
        return {
          bgBox: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',
          badge: 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          btnText: 'text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300'
        };
    }
  };

  const styles = getAccentStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      id={`service-card-${service.id}`}
      onClick={() => onBook(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBook(service);
        }
      }}
      className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:shadow-xl transition-colors cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-4 focus:ring-teal-500/20"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`icon-box w-16 h-16 rounded-2xl ${styles.bgBox} flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm`}>
            {renderIcon()}
          </div>
          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${styles.badge}`}>
            {service.badge}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
          {localized.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base mb-4">
          {localized.desc}
        </p>

        {/* Highlights preview */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {service.highlights.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-sm md:text-base">
          {service.priceFormatted}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBook(service);
          }}
          className={`font-black ${styles.btnText} flex items-center gap-1 text-base group-hover:translate-x-1 transition-transform cursor-pointer`}
        >
          {t.bookNow} <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

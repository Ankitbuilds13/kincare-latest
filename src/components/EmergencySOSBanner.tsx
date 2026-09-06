import React from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  HeartHandshake, 
  Phone, 
  Ambulance, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface EmergencySOSBannerProps {
  onOpenEmergency: () => void;
  cityName: string;
}

export const EmergencySOSBanner: React.FC<EmergencySOSBannerProps> = ({
  onOpenEmergency,
  cityName,
}) => {
  const { t } = useLanguage();

  return (
    <motion.aside
      id="urgentSosSection"
      aria-label="Certified Emergency Medical Response"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white shadow-xl border-y border-teal-800/30 dark:border-slate-800 py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Authoritative subtle medical background motif */}
      <div 
        className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none text-teal-400 select-none"
        aria-hidden="true"
      >
        <Ambulance className="w-80 h-80" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left: Authoritative Emergency Status & Information */}
        <div className="flex items-start sm:items-center gap-5 text-center sm:text-left max-w-2xl">
          <div className="p-3.5 sm:p-4 bg-teal-500/10 dark:bg-teal-400/10 rounded-2xl flex-shrink-0 border border-teal-500/20 text-teal-300">
            <Ambulance className="h-8 w-8 sm:h-9 sm:w-9 text-teal-400" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 bg-red-950/80 text-rose-300 border border-red-800/60 font-black text-xs uppercase px-3 py-1 rounded-full tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                24x7 Critical Care Response
              </span>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> Govt. Accredited EMS Network
              </span>
            </div>

            <h2 className="font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
              Rapid Medical Emergency & Ambulance Dispatch
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Direct connection to nearest certified hospitals and paramedic units across{' '}
              <strong className="text-white font-bold">{cityName}</strong>. Automated real-time family alerts with zero dispatch lag.
            </p>

            {/* Reassuring trust features */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] sm:text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Certified Paramedics
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> GPS ICU Transit
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-teal-400" /> 8-12 Min Avg. Response
              </span>
            </div>
          </div>
        </div>

        {/* Right: Certified Action Buttons (No Scammy Clutter) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-shrink-0">
          {/* Main Ambulance Dispatch Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            id="emergencySosEndBtn"
            type="button"
            onClick={onOpenEmergency}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg shadow-red-950/50 transition cursor-pointer border border-red-400/30"
          >
            <PhoneCall className="h-5 w-5 text-white flex-shrink-0" />
            <span>Emergency Ambulance (108)</span>
          </motion.button>

          {/* Secondary Official Hospital Desk Helpline */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href="tel:18001234567"
            id="quickDial108Btn"
            className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 text-slate-100 font-bold px-5 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
            <span>Physician Triage Desk</span>
          </motion.a>
        </div>

      </div>
    </motion.aside>
  );
};

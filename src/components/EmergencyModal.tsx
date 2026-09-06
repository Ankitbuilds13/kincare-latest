import React, { useState } from 'react';
import { 
  PhoneCall, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  X, 
  Heart, 
  Ambulance, 
  UserCheck, 
  Clock, 
  Hospital 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, cityName }) => {
  const { t } = useLanguage();
  const [alertSent, setAlertSent] = useState(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleNotifyFamily = () => {
    setAlertSent(true);
  };

  const handleRequestDispatch = () => {
    setDispatchConfirmed(true);
    setAlertSent(true);
  };

  return (
    <div 
      id="emergencyModalBackdrop"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="emergencyTitle" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-slate-900 dark:text-slate-100 transition-colors"
      >
        {/* Authoritative Medical Header */}
        <div className="bg-slate-900 dark:bg-slate-950 -mx-5 sm:-mx-6 md:-mx-8 -mt-5 sm:-mt-6 md:-mt-8 p-4 sm:p-5 text-white flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30 flex-shrink-0">
              <Ambulance className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Priority EMS
                </span>
                <span className="text-xs text-slate-300 font-medium">Kin Care Crisis Protocol</span>
              </div>
              <h2 id="emergencyTitle" className="text-lg sm:text-xl font-black text-white mt-0.5">
                Emergency Medical Response & Dispatch
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition cursor-pointer"
            aria-label="Close emergency modal"
            id="closeEmergencyModal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Official Ambulance Hotline (Direct Dial 108 / 102) */}
          <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-rose-400 flex items-center justify-center sm:justify-start gap-1">
                <Hospital className="h-3.5 w-3.5" /> Direct National Ambulance Hotline
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                Dial 108 / 102
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span>Immediate nearest hospital coordination for {cityName}</span>
              </div>
            </div>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="tel:108"
              id="callAmbulanceBtn"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3.5 rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer flex-shrink-0"
            >
              <PhoneCall className="h-5 w-5" />
              <span>Call 108 Now</span>
            </motion.a>
          </div>

          {/* Dedicated Kin Care Doctor & Senior Emergency Desk */}
          <div className="bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-200 dark:border-teal-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 24x7 Kin Care Physician Support
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                1800-123-4567
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Toll-free doctor triage & medical advice
              </div>
            </div>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="tel:18001234567"
              id="callDoctorHelplineBtn"
              className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer flex-shrink-0 text-sm"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Speak to Doctor</span>
            </motion.a>
          </div>

          {/* Automated Emergency Broadcast to Designated Family Contacts */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Family Emergency Broadcast
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Auto SMS & WhatsApp
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Instantly sends your live GPS coordinates, medical history, and emergency status to all configured family caregivers.
            </p>

            {alertSent ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Emergency notification sent to registered family contacts. Dispatch team notified.</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNotifyFamily}
                id="sendEmergencyAlertBtn"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black py-3 rounded-xl transition flex items-center justify-center gap-2 shadow cursor-pointer text-sm"
              >
                <UserCheck className="h-4 w-4 text-teal-400 dark:text-white" />
                <span>Notify Family & On-Call Nurse Now</span>
              </motion.button>
            )}
          </div>

          {/* Quick Medical Summary Card for First Responders */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <Heart className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Paramedic First-Responder Reference
              </span>
              <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                Blood Group: <strong className="text-slate-900 dark:text-white font-bold">O+</strong> • Allergies: <strong className="text-slate-900 dark:text-white font-bold">Penicillin</strong> • Priority Condition: <strong className="text-slate-900 dark:text-white font-bold">Hypertension & Pacemaker</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            id="dismissEmergencyBtn"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm py-2 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Close Emergency Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

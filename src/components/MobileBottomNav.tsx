import React from 'react';
import { 
  Home, 
  Calendar, 
  PhoneCall, 
  User, 
  Phone,
  Sparkles,
  Ambulance
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  onOpenEmergency: () => void;
  onOpenBookings: () => void;
  onOpenCallHelp: () => void;
  onOpenProfile: () => void;
  onOpenPreview?: () => void;
  bookingsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenEmergency,
  onOpenBookings,
  onOpenCallHelp,
  onOpenProfile,
  onOpenPreview,
  bookingsCount,
}) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const scrollToServices = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      onOpenProfile();
    } else if (onOpenPreview) {
      onOpenPreview();
    } else {
      openAuthModal('login');
    }
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      id="mobileBottomNav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t-2 border-slate-200 dark:border-slate-800 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.4)] px-2 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home / Services */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          type="button"
          onClick={scrollToServices}
          id="mobileNavHomeBtn"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer min-w-[50px] min-h-[44px]"
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">
            {t.catAll || 'Home'}
          </span>
        </motion.button>

        {/* 2. My Bookings / Visits */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          type="button"
          onClick={onOpenBookings}
          id="mobileNavBookingsBtn"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer min-w-[50px] min-h-[44px] relative"
        >
          <div className="relative">
            <Calendar className="h-5 w-5 mb-0.5" />
            {bookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-teal-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {bookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">
            {t.myVisits || 'Visits'}
          </span>
        </motion.button>

        {/* 3. CENTER EMERGENCY DISPATCH (Accredited Emergency Call 108) */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          type="button"
          onClick={onOpenEmergency}
          id="mobileNavSosBtn"
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white p-3 rounded-full shadow-lg shadow-red-950/40 transition border-4 border-white dark:border-slate-900 cursor-pointer w-14 h-14 min-w-[56px] min-h-[56px]"
          aria-label="Emergency Medical Dispatch 108"
        >
          <Ambulance className="h-6 w-6" />
          <span className="text-[8px] font-black uppercase tracking-wider -mt-0.5">
            EMS 108
          </span>
        </motion.button>

        {/* 4. Tour & Placard Preview */}
        {onOpenPreview ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            type="button"
            onClick={onOpenPreview}
            id="mobileNavTourBtn"
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer min-w-[50px] min-h-[44px]"
          >
            <Sparkles className="h-5 w-5 mb-0.5 text-amber-500" />
            <span className="text-[10px] font-extrabold tracking-tight">
              Tour
            </span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            type="button"
            onClick={onOpenCallHelp}
            id="mobileNavCallHelpBtn"
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer min-w-[50px] min-h-[44px]"
          >
            <Phone className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] font-extrabold tracking-tight">
              {t.callHelpline || 'Helpline'}
            </span>
          </motion.button>
        )}

        {/* 5. Account / Profile */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          type="button"
          onClick={handleAccountClick}
          id="mobileNavAccountBtn"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer min-w-[50px] min-h-[44px]"
        >
          {isAuthenticated && user ? (
            <div className="w-5 h-5 rounded-full bg-teal-600 text-white font-black text-[10px] flex items-center justify-center mb-0.5">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User className="h-5 w-5 mb-0.5" />
          )}
          <span className="text-[10px] font-extrabold tracking-tight">
            {isAuthenticated && user ? user.name.split(' ')[0] : 'Sign In'}
          </span>
        </motion.button>
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import { 
  HeartPulse, 
  Phone,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Globe,
  User,
  Menu
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SettingsDrawer } from './SettingsDrawer';

interface NavbarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onOpenEmergency: () => void;
  onOpenBookings: () => void;
  onOpenCallHelp: () => void;
  onOpenProfile: () => void;
  onOpenPreview?: () => void;
  onOpenMenu: () => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onCityChange,
  onOpenEmergency,
  onOpenBookings,
  onOpenCallHelp,
  onOpenProfile,
  onOpenPreview,
  onOpenMenu,
  bookingsCount,
}) => {
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { currentLanguage, openLanguageModal, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const toggleFontSize = () => {
    const htmlEl = document.documentElement;
    const nextState = !isLargeFont;
    setIsLargeFont(nextState);
    if (nextState) {
      htmlEl.classList.add('enlarged-font');
    } else {
      htmlEl.classList.remove('enlarged-font');
    }
  };

  return (
    <>
      {/* Main Header / Navigation */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 grid grid-cols-3 items-center gap-2">
          
          {/* ========================================================= */}
          {/* 1. LEFT: MENU BUTTON & CALL HELPLINE (+ Quick Language)   */}
          {/* ========================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2 justify-start">
            {/* Main Ecosystem Menu button */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              id="mainMenuNavBtn"
              type="button"
              onClick={onOpenMenu}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-900 dark:text-teal-200 border-2 border-teal-300 dark:border-slate-700 font-black text-xs sm:text-sm transition cursor-pointer shadow-xs"
              title="Open Kin Care Main Menu & Portals"
            >
              <Menu className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <span>Menu</span>
            </motion.button>

            {/* 24x7 Helpline button */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              id="topHelplineNavBtn"
              type="button"
              onClick={onOpenCallHelp}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 font-black text-xs sm:text-sm transition cursor-pointer shadow-xs"
              title="24x7 Senior Helpline"
            >
              <Phone className="h-4 w-4 text-teal-700 dark:text-teal-400 flex-shrink-0" />
              <span className="hidden md:inline">{t.callHelpline || 'Helpline'}</span>
              <span className="md:hidden text-xs">Help</span>
            </motion.button>

            {/* Quick Language Switcher Button */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              id="quickLangNavBtn"
              type="button"
              onClick={openLanguageModal}
              className="hidden lg:flex items-center gap-1 px-2.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-850 hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 text-xs font-black transition cursor-pointer"
              title="Change Language"
            >
              <Globe className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <span>{currentLanguage.nativeName}</span>
            </motion.button>
          </div>

          {/* ========================================================= */}
          {/* 2. CENTER: LOGO AT CENTER                                 */}
          {/* ========================================================= */}
          <div className="flex items-center justify-center">
            <a href="#" className="flex items-center gap-2 group focus:outline-none select-none">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="bg-teal-600 text-white p-2 sm:p-2.5 rounded-2xl shadow group-hover:bg-teal-700 transition flex items-center justify-center"
              >
                <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
              <div className="text-center sm:text-left">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Kin<span className="text-teal-600 dark:text-teal-400">Care</span>
                </span>
                <span className="hidden xl:block text-[10px] font-bold text-slate-500 dark:text-slate-400 -mt-1 tracking-wide">
                  {t.tagline}
                </span>
              </div>
            </a>
          </div>

          {/* ========================================================================= */}
          {/* 3. RIGHT: LIGHT/DARK MODE BUTTON BESIDE SETTINGS (ONLY A GEAR ICON)       */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 justify-end">
            
            {/* Quick Sign In button if unauthenticated */}
            {!isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                id="headerSignInBtn"
                onClick={() => (onOpenPreview ? onOpenPreview() : openAuthModal('login'))}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow transition cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </motion.button>
            ) : null}

            {/* ⭐ Light / Dark Mode button - Placed right beside the settings button! */}
            <motion.button
              whileHover={{ scale: 1.08, rotate: 15 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              id="themeToggleNavbarBtn"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-300 border-2 border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center justify-center shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </motion.button>

            {/* ⭐ SETTINGS BUTTON: ONLY A GEAR ICON (NO TEXT, AT THE RIGHT SIDE) - Smooth, non-glitchy CSS rotate */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="settingsNavBtn"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open Settings and Preferences"
              title="Settings & Preferences"
              className="group p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition shadow-xs cursor-pointer relative flex items-center justify-center"
            >
              <Settings className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 transition-transform duration-300 ease-out group-hover:rotate-45" />

              {/* Notification Badge: Bookings counter or User Initials */}
              {bookingsCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                  {bookingsCount}
                </span>
              ) : isAuthenticated && user ? (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-teal-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : null}
            </motion.button>

          </div>

        </div>
      </header>

      {/* Settings Drawer (Enhanced, Listen option removed) */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedCity={selectedCity}
        onCityChange={onCityChange}
        isLargeFont={isLargeFont}
        onToggleFontSize={toggleFontSize}
        onOpenBookings={onOpenBookings}
        onOpenProfile={onOpenProfile}
        bookingsCount={bookingsCount}
        onOpenEmergency={onOpenEmergency}
      />
    </>
  );
};

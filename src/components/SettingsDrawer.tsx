import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Languages, 
  MapPin, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Calendar, 
  User, 
  ChevronRight, 
  LogOut, 
  Phone, 
  Check,
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Link as LinkIcon,
  Copy,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES } from '../data/servicesData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth, getStoredFamilyLinks } from '../context/AuthContext';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  isLargeFont: boolean;
  onToggleFontSize: () => void;
  onOpenBookings: () => void;
  onOpenProfile: () => void;
  bookingsCount: number;
  onOpenEmergency?: () => void;
}

const POPULAR_CITIES = [
  'South Extension, Delhi',
  'Bandra West, Mumbai',
  'Indiranagar, Bengaluru',
  'Jubilee Hills, Hyderabad',
  'Adyar, Chennai',
  'Salt Lake, Kolkata'
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onCityChange,
  isLargeFont,
  onToggleFontSize,
  onOpenBookings,
  onOpenProfile,
  bookingsCount,
  onOpenEmergency,
}) => {
  const { currentLanguage, openLanguageModal, t, availableLanguages, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openAuthModal, logout, linkFamilyCode } = useAuth();
  const [inputFamilyCode, setInputFamilyCode] = useState('');
  const [linkFeedback, setLinkFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLinkCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFamilyCode.trim()) return;
    const res = await linkFamilyCode(inputFamilyCode);
    if (res.success) {
      setLinkFeedback({ type: 'success', text: res.message });
      setInputFamilyCode('');
    } else {
      setLinkFeedback({ type: 'error', text: res.message });
    }
    setTimeout(() => setLinkFeedback(null), 4000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settingsDrawerTitle"
    >
      {/* Backdrop with Fade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
        >
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-teal-50/30 to-slate-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="p-2.5 bg-teal-600 text-white rounded-2xl shadow-md"
              >
                <Settings className="h-6 w-6" />
              </motion.div>
              <div>
                <h2 id="settingsDrawerTitle" className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {t.settings || 'Preferences & Settings'}
                </h2>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Customization, accounts & senior accessibility
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              id="closeSettingsBtn"
              type="button"
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close Settings Drawer"
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Scrollable Body with Refined Settings Cards */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

            {/* 1. PROFILE & USER ACCOUNT CARD */}
            <div className="rounded-3xl border-2 border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/80 to-white dark:from-teal-950/40 dark:to-slate-900 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  <User className="h-4 w-4" /> Account & Profile
                </span>
                {isAuthenticated ? (
                  <span className="text-[10px] bg-teal-200/80 dark:bg-teal-900 text-teal-900 dark:text-teal-200 px-2 py-0.5 rounded-full font-black">
                    Signed In
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                    Guest Mode
                  </span>
                )}
              </div>

              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-md flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-slate-900 dark:text-white text-base truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                        {user.phone} • {user.role === 'senior_individual' || user.role === 'elder' ? 'Senior Individual' : user.role === 'helper' ? 'Caregiver / Helper' : 'Family'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="?view=profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      id="drawerManageProfileBtn"
                      onClick={() => onClose()}
                      className="w-full py-2.5 px-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer no-underline"
                      title="Open full profile in a new tab"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      id="drawerLogoutBtn"
                      onClick={logout}
                      className="w-full py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 border border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                    Sign in to save medical profiles, track care visits, and store emergency contacts for swift booking.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    id="drawerSignInBtn"
                    onClick={() => {
                      onClose();
                      openAuthModal('login');
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In or Register</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* 1.5 FAMILY CODE CONNECTION CARD (Requested feature: elder puts family code in settings to link to family) */}
            <div className="rounded-3xl border-2 border-teal-300 dark:border-teal-800 bg-teal-50/70 dark:bg-slate-850 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  <HeartHandshake className="h-4 w-4 text-teal-600" /> Family Account Sync Code
                </span>
                <span className="text-[10px] font-bold bg-teal-200/70 dark:bg-teal-900 text-teal-900 dark:text-teal-200 px-2 py-0.5 rounded-full">
                  Kin Sync
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {user?.role === 'family' || user?.role === 'family_caregiver'
                  ? 'Share your family code with your elder parent. Linking is automatic both ways: when they enter it, your family portal syncs immediately without you needing to enter an elder code.'
                  : 'Enter the family code provided by your child. Linking is automatic both ways, granting access to your family portal.'}
              </p>

              {linkFeedback && (
                <div className={`p-2.5 rounded-xl text-xs font-bold mb-3 flex items-center gap-1.5 ${
                  linkFeedback.type === 'success'
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200 border border-red-300 dark:border-red-800'
                }`}>
                  <Check className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{linkFeedback.text}</span>
                </div>
              )}

              {/* If user is Family Member: Show their generated code with 1-click copy and 2-way linked elder status */}
              {(user?.role === 'family' || user?.role === 'family_caregiver') ? (
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-teal-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Your Family Code</span>
                      <span className="text-lg font-black tracking-wider text-teal-700 dark:text-teal-300 font-mono">
                        {user.familyCode || 'KIN-9241'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(user.familyCode || 'KIN-9241')}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow transition cursor-pointer"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {(() => {
                    const famCode = user?.familyCode || 'KIN-9241';
                    const link = getStoredFamilyLinks()[famCode];
                    const elderName = user?.linkedElderName || link?.elderName;
                    const elderCode = user?.linkedElderCode || link?.elderCode;
                    if (elderName || elderCode) {
                      return (
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">Linked Elder (2-Way Sync)</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {elderName || 'Ramesh Sharma'} <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">({elderCode || 'ELD-4021'})</span>
                            </span>
                          </div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                            Auto Linked
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              ) : (
                /* If user is Elder or Guest: Allow entering code */
                <form onSubmit={handleLinkCode} className="space-y-2">
                  {user?.linkedFamilyCode ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">Connected Family Code</span>
                        <span className="text-base font-black text-emerald-950 dark:text-white font-mono">
                          {user.linkedFamilyCode}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                        Linked Active
                      </span>
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputFamilyCode}
                      onChange={(e) => setInputFamilyCode(e.target.value.toUpperCase())}
                      placeholder="e.g. KIN-9241"
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold uppercase outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>Link</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 2. THEME & APPEARANCE (DARK / LIGHT MODE) */}
            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  {theme === 'dark' ? <Moon className="h-4 w-4 text-amber-400" /> : <Sun className="h-4 w-4 text-amber-500" />} 
                  Theme & Appearance
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  id="settingsLightModeBtn"
                  onClick={() => {
                    if (theme === 'dark') toggleTheme();
                  }}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light Mode</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  id="settingsDarkModeBtn"
                  onClick={() => {
                    if (theme === 'light') toggleTheme();
                  }}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-950 text-amber-300 shadow-md border border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Moon className="h-4 w-4 text-amber-400" />
                  <span>Dark Mode</span>
                </motion.button>
              </div>
            </div>

            {/* 3. SENIOR ACCESSIBILITY LARGE FONT (A+) */}
            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ZoomIn className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Senior Accessibility Font
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isLargeFont 
                    ? 'bg-amber-300 text-amber-950 font-black' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {isLargeFont ? 'Enlarged A+' : 'Standard A'}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                Enlarges interface text, buttons, and badges to ensure high visibility for senior eyes.
              </p>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                id="settingsFontToggleBtn"
                onClick={onToggleFontSize}
                className={`w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-between border-2 transition cursor-pointer ${
                  isLargeFont
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isLargeFont ? <ZoomOut className="h-5 w-5 text-amber-600" /> : <ZoomIn className="h-5 w-5 text-teal-600" />}
                  <span>{isLargeFont ? 'Switch to Standard Size' : 'Switch to Senior Large Font (A+)'}</span>
                </div>
                <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-md ${isLargeFont ? 'bg-amber-300 text-amber-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  {isLargeFont ? 'Active' : 'Turn On'}
                </span>
              </motion.button>
            </div>

            {/* 4. LOCATION / CITY SELECTION */}
            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Service Location
                </span>
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                  Doorstep Ready
                </span>
              </div>

              {/* Quick Popular City Chips */}
              <div className="flex flex-wrap gap-1.5 my-2.5">
                {POPULAR_CITIES.map((city) => {
                  const isSelected = selectedCity === city;
                  return (
                    <motion.button
                      key={city}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => onCityChange(city)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition border cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {city.split(',')[0]}
                    </motion.button>
                  );
                })}
              </div>

              {/* Dropdown */}
              <div className="relative mt-2">
                <select
                  id="settingsCitySelect"
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full py-2.5 px-3 pr-10 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:border-teal-600 dark:focus:border-teal-400 transition cursor-pointer appearance-none"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium">
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 dark:text-teal-400 pointer-events-none" />
              </div>
            </div>

            {/* 5. INTERFACE LANGUAGE */}
            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Interface Language
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  12 Indian Languages
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 mb-2.5">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    Active Language
                  </span>
                  <span className="text-sm sm:text-base font-black text-teal-950 dark:text-teal-200">
                    {currentLanguage.nativeName} ({currentLanguage.name})
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  id="settingsOpenLangModalBtn"
                  onClick={() => {
                    onClose();
                    openLanguageModal();
                  }}
                  className="py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                >
                  <span>All Languages</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>

              {/* Quick 4 popular Indian Languages */}
              <div className="grid grid-cols-2 gap-1.5">
                {availableLanguages.slice(0, 4).map((lang) => {
                  const isSelected = currentLanguage.code === lang.code;
                  return (
                    <motion.button
                      key={lang.code}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-between border-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 6. CARE VISITS & SCHEDULE */}
            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Bookings
                </span>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">
                  {bookingsCount > 0 ? `${bookingsCount} Active Visit${bookingsCount > 1 ? 's' : ''}` : 'No Bookings Yet'}
                </h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                id="drawerOpenBookingsBtn"
                onClick={() => {
                  onClose();
                  onOpenBookings();
                }}
                className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
              >
                <span>View Visits</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* 7. EMERGENCY 108 SHORTCUT */}
            {onOpenEmergency && (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-600 text-white rounded-xl">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-red-900 dark:text-red-200 block">
                      Emergency Ambulance SOS
                    </span>
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-300">
                      National Dispatch: 108 / 102
                    </span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenEmergency();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>SOS</span>
                </motion.button>
              </motion.div>
            )}

            {/* 8. 24x7 HELPLINE */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-600 text-white rounded-xl">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Toll-Free Senior Helpline
                  </span>
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                    1800-123-4567 (24x7)
                  </span>
                </div>
              </div>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:18001234567"
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-xs transition cursor-pointer"
              >
                Call
              </motion.a>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Kin Care Senior Healthcare
            </span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-black text-xs transition cursor-pointer"
            >
              Done
            </motion.button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

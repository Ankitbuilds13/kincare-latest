import React from 'react';
import { 
  X, 
  HeartHandshake, 
  Pill, 
  MapPin, 
  Briefcase, 
  FileText, 
  Phone, 
  Settings, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Moon, 
  Sun,
  ChevronRight,
  UserCheck,
  Truck,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'elder' | 'family' | 'helper' | 'proxy' | 'services';
  onSelectView: (view: 'elder' | 'family' | 'helper' | 'proxy' | 'services') => void;
  onOpenTour: () => void;
  onOpenHelpline: () => void;
  onOpenSettings: () => void;
  onOpenHelperPreview?: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  onOpenTour,
  onOpenHelpline,
  onOpenSettings,
  onOpenHelperPreview,
}) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isElder = user?.role === 'senior_individual' || user?.role === 'elder';
  const isFamily = user?.role === 'family' || user?.role === 'family_caregiver';
  const isHelper = user?.role === 'helper' || user?.role === 'helper_proxy';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 h-full border-r-2 border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Kin Care Menu
                </h3>
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                  Elderly Care Ecosystem
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    {user.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 capitalize">
                    Role: {user.role?.replace('_', ' ')}
                  </p>
                  {user.familyCode && (
                    <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">
                      Family Code: {user.familyCode}
                    </span>
                  )}
                  {user.linkedFamilyCode && (
                    <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400">
                      Linked: {user.linkedFamilyCode}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer"
                  title="Profile Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-1">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                  Welcome to Kin Care India
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('login');
                  }}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
              {isHelper ? 'Helper Portals & Proxy' : isElder ? 'Elder Hub' : isFamily ? 'Family Guardian & Services' : 'Main Portals & Sites'}
            </span>

            {/* HELPER ROLE: Only Helper Portal and Proxy Site */}
            {isHelper ? (
              <>
                <button
                  type="button"
                  id="menuDrawerHelperPortal"
                  onClick={() => {
                    onSelectView('helper');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'helper'
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 font-black border border-amber-200 dark:border-amber-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Caregiver & Helper Portal</div>
                      <div className="text-[11px] font-normal text-slate-500">Orders, Pay, Chores & Stats</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  id="menuDrawerProxySite"
                  onClick={() => {
                    onSelectView('proxy');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'proxy'
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 font-black border border-amber-200 dark:border-amber-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Proxy Site (Field Errands)</div>
                      <div className="text-[11px] font-normal text-slate-500">Delegated pharmacy & groceries dispatch</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </>
            ) : isElder ? (
              /* ELDER ROLE: Only Elder Hub */
              <button
                type="button"
                id="menuDrawerElderHub"
                onClick={() => {
                  onSelectView('elder');
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                  activeView === 'elder'
                    ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-950 dark:text-teal-100 font-black border border-teal-200 dark:border-teal-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Pill className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm">Elder Hub</div>
                    <div className="text-[11px] font-normal text-slate-500">Prescriptions, vitals view & store</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            ) : isFamily ? (
              /* FAMILY ROLE: Family Guardian Radar and Doorstep Services */
              <>
                <button
                  type="button"
                  id="menuDrawerFamilyRadar"
                  onClick={() => {
                    onSelectView('family');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'family'
                      ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-950 dark:text-purple-100 font-black border border-purple-200 dark:border-purple-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Family Guardian Radar</div>
                      <div className="text-[11px] font-normal text-slate-500">Live GPS map, logs & hire caretakers</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  id="menuDrawerDoorstepServices"
                  onClick={() => {
                    onSelectView('services');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'services'
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-950 dark:text-teal-100 font-black border border-teal-200 dark:border-teal-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Grid className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Doorstep Services</div>
                      <div className="text-[11px] font-normal text-slate-500">Verified nursing, attendants & physio</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </>
            ) : (
              /* GUEST: All options available */
              <>
                <button
                  type="button"
                  onClick={() => {
                    onSelectView('elder');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'elder'
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-950 dark:text-teal-100 font-black border border-teal-200 dark:border-teal-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Elder Hub</div>
                      <div className="text-[11px] font-normal text-slate-500">Prescriptions, vitals & store</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectView('family');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'family'
                      ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-950 dark:text-purple-100 font-black border border-purple-200 dark:border-purple-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Family Guardian Radar</div>
                      <div className="text-[11px] font-normal text-slate-500">Live GPS map, logs & hire caretakers</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectView('helper');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'helper'
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 font-black border border-amber-200 dark:border-amber-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Helpers & Proxy Site</div>
                      <div className="text-[11px] font-normal text-slate-500">Orders, Pay, Chores & Stats</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectView('services');
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    activeView === 'services'
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-950 dark:text-teal-100 font-black border border-teal-200 dark:border-teal-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Grid className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm">Doorstep Services</div>
                      <div className="text-[11px] font-normal text-slate-500">Verified nursing, attendants & physio</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </>
            )}

            <div className="pt-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">
                Information & Assistance
              </span>
            </div>

            {/* Helper Preview & Sign-In Site link */}
            {onOpenHelperPreview && (
              <button
                type="button"
                id="menuDrawerHelperPreviewSiteBtn"
                onClick={() => {
                  onClose();
                  onOpenHelperPreview();
                }}
                className="w-full p-3 rounded-2xl flex items-center justify-between text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 font-bold transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm">Helper Sign-In (Preview) Site</div>
                    <div className="text-[11px] font-normal text-amber-700/80 dark:text-amber-400/80">Separate console for caregivers & couriers</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-500" />
              </button>
            )}

            {/* Tour & Placard */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTour();
              }}
              className="w-full p-3 rounded-2xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm">App Tour & Placard</div>
                  <div className="text-[11px] font-normal text-slate-500">Interactive walkthrough</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            {/* 24/7 Helpline */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHelpline();
              }}
              className="w-full p-3 rounded-2xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm">Call 24/7 National Helpline</div>
                  <div className="text-[11px] font-normal text-slate-500">Toll-free 14567 / 112</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Theme Mode</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="h-4 w-4 text-teal-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

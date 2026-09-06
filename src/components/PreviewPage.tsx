import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HeartHandshake, 
  PhoneCall, 
  Stethoscope, 
  Pill, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Home, 
  Clock, 
  Award, 
  Star,
  Users,
  Compass,
  MapPin,
  Lock,
  ChevronRight,
  Briefcase,
  LogIn,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface PreviewPageProps {
  onEnterApp: () => void;
  onOpenHelperPortal?: () => void;
  onOpenHelperPreview?: () => void;
  initialMode?: 'signup' | 'login';
}

export const PreviewPage: React.FC<PreviewPageProps> = ({ 
  onEnterApp,
  onOpenHelperPortal,
  onOpenHelperPreview,
  initialMode = 'signup'
}) => {
  const { openAuthModal } = useAuth();
  const { t } = useLanguage();
  const [activePlacardTab, setActivePlacardTab] = useState<'all' | 'family' | 'seniors'>('all');
  
  // Interactive mouse tracking for subtle background wave mesh
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 40,
        y: (e.clientY / innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const featureCards = [
    {
      icon: Pill,
      badge: 'Medication Tracker',
      title: 'Senior Pill Schedules & Daily Vitals',
      desc: 'One-tap adherence tracking for blood pressure, glucose, and daily prescribed medications with gentle audio & visual reminders.',
      category: 'seniors',
      color: 'teal',
    },
    {
      icon: MapPin,
      badge: 'Remote Family Guardian',
      title: 'Live Caregiver Radar & Transit ETA',
      desc: 'Track dispatched nurses on an interactive GPS map. Receive real-time check-in alerts and visit logs directly on your phone.',
      category: 'family',
      color: 'blue',
    },
    {
      icon: Stethoscope,
      badge: 'Verified Attendants',
      title: 'Certified Doorstep Nursing Care',
      desc: '100% police background-verified nurses, physiotherapists, and bedside attendants available for 2-hour visits or 24/7 care.',
      category: 'all',
      color: 'purple',
    },
    {
      icon: PhoneCall,
      badge: 'Emergency Lifeline',
      title: '24/7 SOS & Hospital Dispatch',
      desc: 'Dedicated round-the-clock medical concierge coordinating ambulance dispatch, tele-consults, and designated family alerts.',
      category: 'all',
      color: 'red',
    },
    {
      icon: HeartHandshake,
      badge: 'Kin Sync Code',
      title: 'Unified Family & Elder Linking',
      desc: 'Effortlessly pair elderly parents with children using a 6-character sync code for end-to-end peace of mind.',
      category: 'family',
      color: 'emerald',
    },
    {
      icon: Briefcase,
      badge: 'Caregiver Portal',
      title: 'Attendant Orders, Chores & Daily Pay',
      desc: 'Dedicated interface for healthcare workers with clinical task checklists, on-duty order dispatch, and instant UPI payouts.',
      category: 'all',
      color: 'amber',
    },
  ];

  const filteredFeatures = featureCards.filter((c) => 
    activePlacardTab === 'all' || c.category === 'all' || c.category === activePlacardTab
  );

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-teal-500 selection:text-white transition-colors overflow-x-hidden">
      
      {/* Interactive Background Glow / Wave Mesh */}
      <motion.div 
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 60 }}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-teal-400/10 dark:bg-teal-600/10 blur-3xl" />
        <div className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/10 dark:bg-emerald-600/10 blur-3xl" />
        <div className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-cyan-400/10 dark:bg-cyan-600/10 blur-3xl" />
      </motion.div>

      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20"
            >
              <HeartHandshake className="h-6 w-6" />
            </motion.div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Kin<span className="text-teal-600 dark:text-teal-400">Care</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                Senior Care & Family Ecosystem
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              id="previewHelperSiteNavBtn"
              onClick={onOpenHelperPreview || onOpenHelperPortal}
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <Briefcase className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Caregiver & Helper Site</span>
              <span className="sm:hidden">Helper Site</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              id="previewSignInNavBtn"
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>Sign In</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              id="previewSignUpNavBtn"
              onClick={() => openAuthModal('signup')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden xs:inline">Sign Up</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
        
        {/* ======================================================== */}
        {/* HERO SECTION: Pure Information & Direct Sign In Trigger */}
        {/* ======================================================== */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border-2 border-teal-300/80 dark:border-teal-700 text-xs sm:text-sm font-black shadow-xs"
          >
            <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Dedicated Elderly Healthcare & Family Guardian Platform</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Dignified Living for <span className="text-teal-600 dark:text-teal-400">Seniors</span>. Total Peace of Mind for <span className="text-emerald-600 dark:text-emerald-400">Family</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto"
          >
            Kin Care bridges the distance between elderly parents and their children. Combining smart daily medicine schedules, live caregiver GPS transit tracking, and certified doorstep medical attendants.
          </motion.p>

          {/* Interactive Call-To-Action Placard Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              id="heroOpenSignInModalBtn"
              onClick={() => openAuthModal('login')}
              className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-teal-600/25 flex items-center gap-2 cursor-pointer transition"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In to Your Account</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              id="heroDirectExploreBtn"
              onClick={onEnterApp}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 text-slate-900 dark:text-white font-black text-sm sm:text-base shadow-sm flex items-center gap-2 cursor-pointer transition"
            >
              <Compass className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Explore Portal as Guest</span>
            </motion.button>

            {(onOpenHelperPreview || onOpenHelperPortal) && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                id="heroHelperPortalBtn"
                onClick={onOpenHelperPreview || onOpenHelperPortal}
                className="px-5 py-3.5 rounded-2xl bg-amber-50 dark:bg-slate-850 border-2 border-amber-400 dark:border-amber-600/80 text-amber-950 dark:text-amber-200 font-black text-sm sm:text-base shadow-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span>Helper Sign-In & Courier Console →</span>
              </motion.button>
            )}
          </motion.div>

          {/* Trust Guarantees Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              100% Police Verified Nurses
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal-500" />
              60-Min Emergency Response
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              NABH & AIIMS Trained Staff
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* INTERACTIVE PLACARDS: What The App Does (Interactive Tabs)*/}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Core Capabilities & Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Explore What Kin Care Does
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 self-start">
              <button
                type="button"
                onClick={() => setActivePlacardTab('all')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activePlacardTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Features
              </button>
              <button
                type="button"
                onClick={() => setActivePlacardTab('seniors')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activePlacardTab === 'seniors'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                For Elders
              </button>
              <button
                type="button"
                onClick={() => setActivePlacardTab('family')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activePlacardTab === 'family'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                For Family
              </button>
            </div>
          </div>

          {/* Cards Grid: Dark mode strictly dark slate-900/850, Light mode white */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500 dark:hover:border-teal-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-slate-700 flex items-center justify-center">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* INTERACTIVE COMPARISON PLACARD: ELDER vs FAMILY vs HELPER */}
        {/* ======================================================== */}
        <section className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Three Unified Interfaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Built for Every Member of the Care Circle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Elder Persona */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                  <Pill className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Senior Citizen Portal</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  High-contrast senior font, audio pill instructions, streak rewards, and one-tap emergency SOS.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold pt-2">
                  <li className="flex items-center gap-1.5">✓ Today's Medicine Check-off</li>
                  <li className="flex items-center gap-1.5">✓ Self-log Blood Pressure & Sugar</li>
                  <li className="flex items-center gap-1.5">✓ Family Code Link in Settings</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onEnterApp}
                className="mt-6 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition cursor-pointer"
              >
                Launch Elder View
              </button>
            </div>

            {/* Family Persona */}
            <div className="p-6 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border-2 border-teal-300 dark:border-teal-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Family Guardian Tracking</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Dedicated website to track parents from anywhere in the world. Live helper map & real-time clinical logs.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold pt-2">
                  <li className="flex items-center gap-1.5">✓ Live GPS Caregiver Transit Map</li>
                  <li className="flex items-center gap-1.5">✓ Audit Logs of Caregiver Actions</li>
                  <li className="flex items-center gap-1.5">✓ Unique KIN-XXXX Sync Code</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onEnterApp}
                className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition cursor-pointer"
              >
                Launch Family View
              </button>
            </div>

            {/* Helper / Proxy Persona */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Proxy & Helper Portal</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Partner portal for registered nurses, physiotherapists, and attendants to manage visits and daily chores.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold pt-2">
                  <li className="flex items-center gap-1.5">✓ Patient Visits & Orders Queue</li>
                  <li className="flex items-center gap-1.5">✓ Daily Patient Care Chores</li>
                  <li className="flex items-center gap-1.5">✓ Instant UPI Pay & Statistics</li>
                </ul>
              </div>
              {onOpenHelperPortal ? (
                <button
                  type="button"
                  onClick={onOpenHelperPortal}
                  className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition cursor-pointer"
                >
                  Launch Caregiver View
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onEnterApp}
                  className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition cursor-pointer"
                >
                  Launch Caregiver View
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* BOTTOM CALL TO ACTION: Sign In Popup & Helper Portal Link */}
        {/* ======================================================== */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-teal-800 via-slate-900 to-teal-950 text-white border-2 border-teal-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-black tracking-widest text-teal-300">
              Ready to safeguard your elders?
            </span>
            <h3 className="text-2xl sm:text-4xl font-black">
              Sign In or Register in Under 30 Seconds
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Create an account as an Elder or Family Member to unlock customized care portals, live GPS tracking, and doorstep medical support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              id="footerSignInPopupBtn"
              onClick={() => openAuthModal('login')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4 text-teal-700" />
              <span>Sign In (Popup)</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              id="footerSignUpPopupBtn"
              onClick={() => openAuthModal('signup')}
              className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Sign Up Now</span>
            </motion.button>
          </div>
        </section>

        {/* Footer Link to Proxy / Helpers Website as requested */}
        <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span>© 2026 Kin Care India. Crafted for Elderly Healthcare Dignity.</span>
          </div>

          {onOpenHelperPortal && (
            <button
              type="button"
              onClick={onOpenHelperPortal}
              className="font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Are you a Caregiver or Nurse? Access Helper Portal →</span>
            </button>
          )}
        </footer>
      </main>
    </div>
  );
};

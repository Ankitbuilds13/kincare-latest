/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOutgoing, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles,
  Headphones,
  Info,
  Pill,
  MapPin,
  Briefcase,
  Grid,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CareService, Booking, ServiceCategory } from './types';
import { SERVICES_DATA, INITIAL_BOOKINGS } from './data/servicesData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ServiceCard } from './components/ServiceCard';
import { BookingModal } from './components/BookingModal';
import { EmergencyModal } from './components/EmergencyModal';
import { EmergencySOSBanner } from './components/EmergencySOSBanner';
import { BookingsDrawer } from './components/BookingsDrawer';
import { CallSupportModal } from './components/CallSupportModal';
import { LanguageModal } from './components/LanguageModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ProfilePage } from './components/ProfilePage';
import { PreviewPage } from './components/PreviewPage';
import { HelperPreviewPage } from './components/HelperPreviewPage';
import { CentralizedCatalogueBar } from './components/CentralizedCatalogueBar';
import { MedicineTracker } from './components/MedicineTracker';
import { FamilyPortal } from './components/FamilyPortal';
import { HelperPortal } from './components/HelperPortal';
import { MenuDrawer } from './components/MenuDrawer';
import { InteractiveBackground } from './components/InteractiveBackground';
import { WaveTransition } from './components/WaveTransition';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function KinCareApp() {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const isElderUser = user?.role === 'senior_individual' || user?.role === 'elder';
  const isFamilyUser = user?.role === 'family' || user?.role === 'family_caregiver';
  const isHelperUser = user?.role === 'helper' || user?.role === 'helper_proxy';

  const [selectedCity, setSelectedCity] = useState<string>('South Extension, Delhi');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [activePortalView, setActivePortalView] = useState<'elder' | 'family' | 'helper' | 'proxy' | 'services'>('elder');
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  // Automatically switch to role-specific portal upon sign-in/up
  useEffect(() => {
    if (isFamilyUser) {
      setActivePortalView('family');
    } else if (isElderUser) {
      setActivePortalView('elder');
    } else if (isHelperUser) {
      setActivePortalView('helper');
    }
  }, [user?.role, isFamilyUser, isElderUser, isHelperUser]);

  // Strict role security: Helpers cannot access Family Hub!
  useEffect(() => {
    if (isHelperUser && activePortalView === 'family') {
      setActivePortalView('helper');
    }
  }, [isHelperUser, activePortalView]);
  
  // Bookings with local storage backup
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('kincare_bookings') || localStorage.getItem('silvercare_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kincare_bookings', JSON.stringify(bookings));
    } catch {
      // Storage fallback
    }
  }, [bookings]);

  // Check if current URL is requesting dedicated profile view or preview view
  const [isProfileView, setIsProfileView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'profile' || window.location.hash === '#profile';
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'profile' || window.location.hash === '#profile') return false;
    if (params.get('view') === 'home' || window.location.hash === '#home') return false;
    if (params.get('view') === 'preview' || window.location.hash === '#preview') return true;
    if (params.get('view') === 'helper-preview' || params.get('view') === 'helper-signin' || window.location.hash === '#helper-preview') return true;
    // Open Kin Care directly!
    return false;
  });

  const [previewSite, setPreviewSite] = useState<'main' | 'helper'>(() => {
    if (typeof window === 'undefined') return 'main';
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'helper-preview' || v === 'helper-signin' || window.location.hash === '#helper-preview') return 'helper';
    return 'main';
  });

  const [previewInitialMode, setPreviewInitialMode] = useState<'signup' | 'login'>('signup');

  // Once signed in, direct them to this page
  useEffect(() => {
    if (isAuthenticated && isPreviewOpen) {
      setIsPreviewOpen(false);
      const url = new URL(window.location.href);
      if (url.searchParams.get('view') === 'preview') {
        url.searchParams.delete('view');
        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  }, [isAuthenticated, isPreviewOpen]);

  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      setIsProfileView(params.get('view') === 'profile' || window.location.hash === '#profile');
      if (params.get('view') === 'helper-preview' || params.get('view') === 'helper-signin' || window.location.hash === '#helper-preview') {
        setPreviewSite('helper');
        setIsPreviewOpen(true);
      } else if (params.get('view') === 'preview' || window.location.hash === '#preview') {
        setPreviewSite('main');
        setIsPreviewOpen(true);
      } else if (params.get('view') === 'home' || window.location.hash === '#home') {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenProfileInNewTab = () => {
    const profileUrl = `${window.location.origin}${window.location.pathname}?view=profile`;
    window.open(profileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenPreview = (mode: 'signup' | 'login' = 'signup') => {
    setPreviewInitialMode(mode);
    setIsPreviewOpen(true);
  };

  // Modals state
  const [bookingService, setBookingService] = useState<CareService | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isCallSupportOpen, setIsCallSupportOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [callSupportContext, setCallSupportContext] = useState<string | undefined>(undefined);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBookService = (service: CareService) => {
    setBookingService(service);
  };

  const handleQuickCall = (service: CareService) => {
    setCallSupportContext(service.title);
    setIsCallSupportOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Visit for ${newBooking.serviceTitle} confirmed for ${newBooking.patientName}!`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast('Visit cancelled successfully.');
  };

  // Filtered services
  const filteredServices = SERVICES_DATA.filter((service) => {
    if (selectedCategory === 'all') return true;
    return service.category === selectedCategory;
  });

  // Dedicated Profile View
  if (isProfileView) {
    return (
      <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-teal-200 transition-colors">
        <InteractiveBackground />
        <div className="relative z-10">
          <ProfilePage
            onBackToHome={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('view');
              url.hash = '';
              window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
              setIsProfileView(false);
            }}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
          />
          <AuthModal />
        </div>
      </div>
    );
  }

  // Interactive Preview Page (With Placard, Sign Up/Sign In & scrolling features)
  if (isPreviewOpen) {
    if (previewSite === 'helper') {
      return (
        <div className="min-h-screen relative bg-slate-900 text-slate-100 selection:bg-amber-500 selection:text-slate-950 transition-colors">
          <InteractiveBackground />
          <div className="relative z-10">
            <HelperPreviewPage
              onEnterHelperApp={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('view');
                url.hash = '';
                window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
                setIsPreviewOpen(false);
                setActivePortalView('helper');
              }}
              onSwitchToMainPreview={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('view', 'preview');
                window.history.pushState({}, '', url.pathname + '?' + url.searchParams.toString());
                setPreviewSite('main');
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-teal-200 transition-colors">
        <InteractiveBackground />
        <div className="relative z-10">
          <PreviewPage 
            onEnterApp={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('view');
              url.hash = '';
              window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
              setIsPreviewOpen(false);
            }} 
            onOpenHelperPreview={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('view', 'helper-preview');
              window.history.pushState({}, '', url.pathname + '?' + url.searchParams.toString());
              setPreviewSite('helper');
            }}
            onOpenHelperPortal={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('view');
              url.hash = '';
              window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
              setIsPreviewOpen(false);
              setActivePortalView('helper');
            }}
            initialMode={previewInitialMode}
          />
          <AuthModal onOpenHelperPortal={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('view');
            url.hash = '';
            window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
            setIsPreviewOpen(false);
            setActivePortalView('helper');
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-teal-200 transition-colors">
      
      {/* 🌟 Global Mouse-Interactive Ambient Background */}
      <InteractiveBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Toast Notification */}
        {toastMessage && (
          <div 
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl border-2 border-teal-500 flex items-center gap-3 animate-fade-in text-sm md:text-base"
          >
            <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation and Top Controls */}
        <Navbar
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenBookings={() => setIsBookingsOpen(true)}
          onOpenCallHelp={() => {
            setCallSupportContext('Senior Care Inquiries');
            setIsCallSupportOpen(true);
          }}
          onOpenProfile={handleOpenProfileInNewTab}
          onOpenPreview={() => handleOpenPreview('signup')}
          onOpenMenu={() => setIsMenuDrawerOpen(true)}
          bookingsCount={bookings.length}
        />

        {/* Portal Switcher Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 w-full">
          <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {isHelperUser ? (
              /* HELPER ACCOUNT: ONLY see Helpers and Proxy Site */
              <>
                <button
                  type="button"
                  id="portalNavHelper"
                  onClick={() => setActivePortalView('helper')}
                  className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'helper'
                      ? 'bg-amber-700 dark:bg-amber-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Helpers</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-amber-900/80 text-amber-100 rounded-md font-bold">
                    My Portal
                  </span>
                </button>

                <button
                  type="button"
                  id="portalNavProxy"
                  onClick={() => setActivePortalView('proxy')}
                  className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'proxy'
                      ? 'bg-amber-700 dark:bg-amber-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Truck className="h-4 w-4" />
                  <span>Proxy Site</span>
                </button>
              </>
            ) : isElderUser ? (
              /* ELDER ACCOUNT: ONLY see Elder Hub */
              <button
                type="button"
                id="portalNavElder"
                onClick={() => setActivePortalView('elder')}
                className={`flex-1 py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none bg-teal-700 dark:bg-teal-600 text-white shadow-md`}
              >
                <Pill className="h-4 w-4" />
                <span>Elder Hub</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 bg-teal-900/80 text-teal-100 rounded-md font-bold">
                  Elder Space
                </span>
              </button>
            ) : isFamilyUser ? (
              /* FAMILY ACCOUNT: Family Guardian Radar and Doorstep Services */
              <>
                <button
                  type="button"
                  id="portalNavFamily"
                  onClick={() => setActivePortalView('family')}
                  className={`flex-1 min-w-[150px] sm:min-w-0 py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'family'
                      ? 'bg-purple-700 dark:bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Family Guardian Radar</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-purple-900/80 text-purple-100 rounded-md font-bold">
                    My Portal
                  </span>
                </button>

                <button
                  type="button"
                  id="portalNavServices"
                  onClick={() => setActivePortalView('services')}
                  className={`flex-1 min-w-[150px] sm:min-w-0 py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'services'
                      ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  <span>Doorstep Services</span>
                </button>
              </>
            ) : (
              /* GUEST / ALL */
              <>
                <button
                  type="button"
                  id="portalNavElder"
                  onClick={() => setActivePortalView('elder')}
                  className={`flex-1 min-w-[140px] sm:min-w-0 py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'elder'
                      ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Pill className="h-4 w-4" />
                  <span>Elder Hub</span>
                </button>

                <button
                  type="button"
                  id="portalNavFamily"
                  onClick={() => setActivePortalView('family')}
                  className={`flex-1 min-w-[140px] sm:min-w-0 py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'family'
                      ? 'bg-purple-700 dark:bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Family Guardian Radar</span>
                </button>

                <button
                  type="button"
                  id="portalNavHelper"
                  onClick={() => setActivePortalView('helper')}
                  className={`flex-1 min-w-[140px] sm:min-w-0 py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'helper' || activePortalView === 'proxy'
                      ? 'bg-amber-700 dark:bg-amber-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Helpers & Proxy Site</span>
                </button>

                <button
                  type="button"
                  id="portalNavServices"
                  onClick={() => setActivePortalView('services')}
                  className={`flex-1 min-w-[140px] sm:min-w-0 py-2.5 px-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none ${
                    activePortalView === 'services'
                      ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  <span>Doorstep Services</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Portal View 1: Elder Hub */}
        {activePortalView === 'elder' && (
          <main className="max-w-7xl mx-auto px-4 py-4 pb-16 flex-1 w-full">
            <MedicineTracker />
          </main>
        )}

        {/* Portal View 2: Family Guardian Radar & Helper Logs */}
        {activePortalView === 'family' && (
          <main className="max-w-7xl mx-auto px-4 py-4 pb-16 flex-1 w-full">
            <FamilyPortal 
              onHireCaregiver={() => {
                setBookingService(SERVICES_DATA[0]);
              }}
              onOpenHelpline={() => {
                setCallSupportContext('Family Emergency Assistance');
                setIsCallSupportOpen(true);
              }}
            />
          </main>
        )}

        {/* Portal View 3: Caregiver & Helper Site (Orders, Pay, Chores, Stats) */}
        {activePortalView === 'helper' && (
          <main className="max-w-7xl mx-auto px-4 py-4 pb-16 flex-1 w-full">
            <HelperPortal viewMode="helpers" onSwitchMode={(m) => setActivePortalView(m)} />
          </main>
        )}

        {/* Portal View 3.1: Proxy Site Mode */}
        {activePortalView === 'proxy' && (
          <main className="max-w-7xl mx-auto px-4 py-4 pb-16 flex-1 w-full">
            <HelperPortal viewMode="proxy" onSwitchMode={(m) => setActivePortalView(m)} />
          </main>
        )}

        {/* Portal View 4: Doorstep Verified Care Services */}
        {activePortalView === 'services' && (
          <>
            {/* Hero Banner */}
            <HeroBanner
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onOpenCallHelp={() => {
                setCallSupportContext('General Assistance');
                setIsCallSupportOpen(true);
              }}
              cityName={selectedCity}
            />

            {/* Smooth Wave Transition into Services Section */}
            <WaveTransition 
              position="bottom" 
              fillColor="var(--color-slate-100, #f1f5f9)"
              secondaryFillColor="var(--color-teal-500, #14b8a6)"
              className="dark:hidden -mt-4 mb-2"
            />

            {/* Main Services Grid */}
            <main className="max-w-7xl mx-auto px-4 pb-16 flex-1 w-full space-y-6">
              {/* Centralized Prescription & Fresh Grocery Action Bar */}
              <CentralizedCatalogueBar
                onSelectCategory={(category) => {
                  if (isFamilyUser) {
                    setActivePortalView('family');
                  } else {
                    setActivePortalView('elder');
                  }
                }}
                onTrackDeliveries={() => {
                  if (isFamilyUser) {
                    setActivePortalView('family');
                  } else {
                    setActivePortalView('elder');
                  }
                }}
                title="Centralized Doorstep Pharmacy & Farm-Fresh Grocery"
                subtitle="One-tap direct ordering of verified prescription medicines, fresh fruits, and daily kitchen essentials."
              />

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 flex flex-wrap items-baseline justify-between gap-2"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {t.chooseService}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
                    {t.chooseServiceSub} <strong className="text-slate-900 dark:text-white">{selectedCity}</strong>.
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
                  {filteredServices.length} {t.chooseService}
                </span>
              </motion.div>

              {/* Responsive Animated Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBook={handleBookService}
                    onQuickCall={handleQuickCall}
                  />
                ))}

                {/* Quick Call Assistance Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  id="phoneBookingCard"
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-dashed border-teal-600 dark:border-teal-500 p-6 rounded-3xl flex flex-col justify-between text-center items-center hover:bg-teal-50/50 dark:hover:bg-teal-950/40 transition shadow-sm"
                >
                  <div>
                    <div className="icon-box w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-4 mx-auto shadow-sm">
                      <Phone className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">
                      {t.preferPhoneBooking}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                      {t.phoneBookingDesc}
                    </p>
                  </div>
                  
                  <div className="mt-6 w-full space-y-2">
                    <motion.a 
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      href="tel:18001234567" 
                      id="callTollFreeSupportLink"
                      className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-extrabold rounded-2xl shadow transition flex items-center justify-center gap-2 text-base cursor-pointer"
                    >
                      <PhoneOutgoing className="h-5 w-5" /> {t.tollFreeCallSupport}
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      id="requestCallbackBtn"
                      onClick={() => {
                        setCallSupportContext('Phone Assistance');
                        setIsCallSupportOpen(true);
                      }}
                      className="w-full py-2.5 bg-white dark:bg-slate-850 border-2 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 font-bold rounded-2xl hover:bg-teal-100 dark:hover:bg-slate-800 transition text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Headphones className="h-4 w-4" /> {t.requestCallback}
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Wave Transition between Services and Safety Guarantees */}
              <WaveTransition 
                position="bottom" 
                variant="crest" 
                fillColor="var(--color-teal-500, #14b8a6)"
                secondaryFillColor="var(--color-teal-700, #0f766e)"
                className="opacity-20 my-6"
              />

              {/* Reassurance & Senior Safety Guarantees */}
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xs transition-colors"
              >
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                    {t.promiseBadge}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {t.promiseTitle}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
                    {t.promiseSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{t.bgCheckTitle}</h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.bgCheckDesc}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                      <HeartHandshake className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{t.whatsappUpdatesTitle}</h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.whatsappUpdatesDesc}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{t.noContractTitle}</h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.noContractDesc}
                    </p>
                  </div>
                </div>
              </motion.section>
            </main>
          </>
        )}

        {/* Wave Transition into Emergency Section */}
        <WaveTransition 
          position="bottom" 
          fillColor="#020617" 
          secondaryFillColor="#0f172a"
          className="text-slate-950 -mb-1"
        />

        {/* Authoritative Emergency SOS Section (Accredited medical dispatch, no scam styling) */}
        <EmergencySOSBanner
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          cityName={selectedCity}
        />

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-300 dark:text-slate-400 py-10 pb-28 md:pb-10 border-t-2 border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-2xl font-black text-white">
                Kin<span className="text-teal-400">Care</span>
              </span>
              <p className="text-xs text-slate-400">
                {t.footerSub}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300 dark:text-slate-400">
              <button 
                onClick={() => handleOpenPreview('signup')}
                className="text-amber-400 hover:text-amber-300 underline font-black cursor-pointer"
              >
                App Tour & Placard
              </button>
              <span>•</span>
              <button 
                onClick={() => setIsEmergencyOpen(true)} 
                className="text-red-400 hover:text-red-300 underline font-black cursor-pointer"
              >
                {t.sosCallAmbulance}
              </button>
              <span>•</span>
              <button 
                onClick={() => {
                  setCallSupportContext('Support');
                  setIsCallSupportOpen(true);
                }}
                className="hover:text-white cursor-pointer"
              >
                {t.tollFreeCallSupport} 1800-123-4567
              </button>
              <span>•</span>
              <button 
                onClick={() => setIsBookingsOpen(true)}
                className="hover:text-white cursor-pointer"
              >
                {t.myVisits} ({bookings.length})
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center">
              © {new Date().getFullYear()} KinCare Inc. {t.copyright}
            </p>
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onOpenBookings={() => setIsBookingsOpen(true)}
          onOpenCallHelp={() => {
            setCallSupportContext('Mobile Helpline');
            setIsCallSupportOpen(true);
          }}
          onOpenProfile={handleOpenProfileInNewTab}
          onOpenPreview={() => handleOpenPreview('signup')}
          bookingsCount={bookings.length}
        />

        {/* Accessible Booking Modal */}
        <BookingModal
          service={bookingService}
          isOpen={Boolean(bookingService)}
          onClose={() => setBookingService(null)}
          onBookingSuccess={handleBookingSuccess}
          currentCity={selectedCity}
        />

        {/* Emergency SOS Modal (Verified Medical Dispatch) */}
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          cityName={selectedCity}
        />

        {/* Bookings Drawer */}
        <BookingsDrawer
          isOpen={isBookingsOpen}
          onClose={() => setIsBookingsOpen(false)}
          bookings={bookings}
          onCancelBooking={handleCancelBooking}
        />

        {/* Call Support / Callback Modal */}
        <CallSupportModal
          isOpen={isCallSupportOpen}
          onClose={() => setIsCallSupportOpen(false)}
          serviceTitle={callSupportContext}
        />

        {/* Indian Languages Selector Modal */}
        <LanguageModal />

        {/* Secure Authentication Modal (Sign In / Register) */}
        <AuthModal onOpenHelperPortal={() => {
          setIsPreviewOpen(false);
          setActivePortalView('helper');
        }} />

        {/* Sliding Navigation & Tour Menu Drawer */}
        <MenuDrawer
          isOpen={isMenuDrawerOpen}
          onClose={() => setIsMenuDrawerOpen(false)}
          activeView={activePortalView === 'services' ? 'elder' : activePortalView}
          onSelectView={(view) => setActivePortalView(view)}
          onOpenTour={() => {
            setPreviewSite('main');
            setIsPreviewOpen(true);
          }}
          onOpenHelperPreview={() => {
            setPreviewSite('helper');
            setIsPreviewOpen(true);
          }}
          onOpenHelpline={() => {
            setCallSupportContext('National Senior Citizen Helpline');
            setIsCallSupportOpen(true);
          }}
          onOpenSettings={() => {
            const btn = document.getElementById('settingsNavBtn');
            if (btn) btn.click();
          }}
        />

        {/* User Account & Emergency Contacts Profile Modal */}
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onOpenBookings={() => {
            setIsProfileOpen(false);
            setIsBookingsOpen(true);
          }}
          bookingsCount={bookings.length}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <KinCareApp />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

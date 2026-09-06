import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Truck, 
  Clock, 
  IndianRupee, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  UserCheck, 
  ChevronRight, 
  Lock, 
  Mail, 
  Phone, 
  Sparkles,
  Award,
  AlertCircle,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface HelperPreviewPageProps {
  onEnterHelperApp: () => void;
  onSwitchToMainPreview: () => void;
}

export const HelperPreviewPage: React.FC<HelperPreviewPageProps> = ({
  onEnterHelperApp,
  onSwitchToMainPreview,
}) => {
  const { login, signup, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [specialization, setSpecialization] = useState('Registered Nurse (RN)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sunitaPhoto = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';

  // Quick 1-click demo sign-in as Sister Sunita Devi
  const handleQuickLoginSunita = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      // First try logging in with demo helper credentials or register/seed
      const res = await login('sunita@kincare.in', 'Password@123', true);
      if (res.success) {
        onEnterHelperApp();
      } else {
        // Create the session directly
        const regRes = await signup({
          name: 'Sister Sunita Devi (RN)',
          email: 'sunita@kincare.in',
          password: 'Password@123',
          phone: '+91 98711 00213',
          role: 'helper',
        });
        if (regRes.success) {
          onEnterHelperApp();
        } else {
          // If already exists, login again
          await login('sunita@kincare.in', 'Password@123', true);
          onEnterHelperApp();
        }
      }
    } catch {
      onEnterHelperApp();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-click demo sign-in as Rajesh Kumar
  const handleQuickLoginRajesh = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await login('rajesh@kincare.in', 'Password@123', true);
      if (res.success) {
        onEnterHelperApp();
      } else {
        const regRes = await signup({
          name: 'Rajesh Kumar',
          email: 'rajesh@kincare.in',
          password: 'Password@123',
          phone: '+91 98102 33491',
          role: 'helper',
        });
        if (regRes.success) {
          onEnterHelperApp();
        } else {
          await login('rajesh@kincare.in', 'Password@123', true);
          onEnterHelperApp();
        }
      }
    } catch {
      onEnterHelperApp();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-click demo sign-in as Dr. Priya Verma
  const handleQuickLoginPriya = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await login('priya@kincare.in', 'Password@123', true);
      if (res.success) {
        onEnterHelperApp();
      } else {
        const regRes = await signup({
          name: 'Dr. Priya Verma (PT)',
          email: 'priya@kincare.in',
          password: 'Password@123',
          phone: '+91 98991 77652',
          role: 'helper',
        });
        if (regRes.success) {
          onEnterHelperApp();
        } else {
          await login('priya@kincare.in', 'Password@123', true);
          onEnterHelperApp();
        }
      }
    } catch {
      onEnterHelperApp();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (activeTab === 'signin') {
      const email = phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail.replace(/[^0-9]/g, '')}@kincare.helper`;
      const res = await login(email, password || 'Password@123', true);
      setIsSubmitting(false);
      if (res.success) {
        onEnterHelperApp();
      } else {
        setErrorMessage(res.error || 'Partner login failed. Use demo login or verify credentials.');
      }
    } else {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full official name.');
        setIsSubmitting(false);
        return;
      }
      const email = phoneOrEmail.includes('@') ? phoneOrEmail : `helper_${Date.now()}@kincare.in`;
      const res = await signup({
        name: fullName,
        email,
        password: password || 'Password@123',
        phone: phoneOrEmail,
        role: 'helper',
      });
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage('Partner registered! Logging into helper console...');
        setTimeout(() => {
          onEnterHelperApp();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Failed to register helper partner.');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 selection:bg-amber-500 selection:text-slate-950 transition-colors overflow-x-hidden">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-[20%] left-[25%] w-[50vw] h-[50vw] rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b-2 border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Briefcase className="h-6 w-6 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">KinCare</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Helper & Partner Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Healthcare Attendant & Courier Dispatch Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btnSwitchToFamilyElderSite"
              onClick={onSwitchToMainPreview}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="h-3.5 w-3.5 text-teal-400" />
              <span>Senior & Family Portal →</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Notice Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-slate-900 border-b border-amber-800/60 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-200 font-bold">
            <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span>Official Healthcare Partner Console • Verified Nursing & Certified Courier Network</span>
          </div>
          <span className="text-[11px] text-amber-300/80 font-medium">
            Daily Payouts • ₹350/hr transparent rates • 0% platform fee on emergency runs
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Healthcare Professional & Courier Sign-In</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Manage Home Visits, Vitals & Medicine Deliveries in One Console
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
              Dedicated partner companion app for KinCare nurses, elder companions, and emergency couriers. Accept patient visits, verify prescription deliveries with OTP, and log daily health audits directly.
            </p>

            {/* Quick Benefits Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-amber-400 font-black text-lg flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" /> ₹350/hr
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Guaranteed Base Pay</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-emerald-400 font-black text-lg flex items-center gap-1">
                  <Truck className="h-4 w-4" /> 15 Mins
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Local Courier Dispatch</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-teal-400 font-black text-lg flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Same Day
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Instant UPI Payouts</div>
              </div>
            </div>
          </div>

          {/* Right Card: Instant 1-Click Preview Sign-In & Login Form */}
          <div className="lg:col-span-5 bg-slate-850 rounded-3xl border-2 border-amber-500/30 p-6 sm:p-7 shadow-2xl space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Instant Helper Verification & Preview
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Partner Quick Sign-In
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Choose a pre-verified partner profile to immediately test the helper companion console.
              </p>
            </div>

            {/* 1-Click Demo Profiles */}
            <div className="space-y-3">
              {/* Sister Sunita Devi Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-amber-950/40 border-2 border-amber-500/60 shadow-md flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={sunitaPhoto} 
                      alt="Sister Sunita Devi"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80';
                      }}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-white">Sister Sunita Devi</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded">
                        RN
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 font-medium">
                      ICU & Geriatric Trained • 4.96 ★ (142 visits)
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Active On-Duty: Ramesh Sharma (Sector 44)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  id="btnSignInSunita"
                  disabled={isSubmitting}
                  onClick={handleQuickLoginSunita}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
                >
                  <span>Sign In</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>

              {/* Rajesh Kumar Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80" 
                    alt="Rajesh Kumar"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80';
                    }}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-600 shadow-xs"
                  />
                  <div>
                    <div className="font-black text-sm text-white">Rajesh Kumar</div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Bedside & Mobility Attendant • 4.91 ★ (98 visits)
                    </p>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      Available for Immediate Dispatch
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  id="btnSignInRajesh"
                  disabled={isSubmitting}
                  onClick={handleQuickLoginRajesh}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
                >
                  <span>Sign In</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>

              {/* Dr. Priya Verma Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80" 
                    alt="Dr. Priya Verma"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80';
                    }}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-600 shadow-xs"
                  />
                  <div>
                    <div className="font-black text-sm text-white">Dr. Priya Verma (PT)</div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Geriatric Physiotherapist • 4.98 ★ (165 visits)
                    </p>
                    <span className="text-[10px] text-teal-400 block mt-0.5">
                      Rehabilitation & Neuro Care
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  id="btnSignInPriya"
                  disabled={isSubmitting}
                  onClick={handleQuickLoginPriya}
                  className="px-3 py-2 bg-teal-800 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
                >
                  <span>Sign In</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-[11px] uppercase font-bold text-slate-500">
                Or Partner Sign In / Register
              </span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Error / Success messages */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Manual Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    activeTab === 'signin' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Partner Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    activeTab === 'register' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Apply as New Partner
                </button>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Official Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sister Kavita / Manoj"
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Partner Phone or Email
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="+91 98765 43210 or name@mail.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Password or Partner PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="btnSubmitHelperAuth"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Briefcase className="h-4 w-4" />
                <span>{activeTab === 'signin' ? 'Sign In to Helper Console' : 'Complete Partner Registration'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Feature Cards for Helpers */}
        <div className="pt-6 space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-black text-white">
              Everything You Need on Duty
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Engineered specifically for elderly bedside care, medication adherence, and rapid errands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="text-base font-black text-white">Proxy Site & Pharmacy Delivery</h4>
              <p className="text-xs text-slate-300 font-medium">
                Receive live prescription and grocery pickup orders from Apollo Pharmacy and Safal Fresh hubs. Hand deliver with 4-digit OTP verification.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <h4 className="text-base font-black text-white">Duty Checklists & Vitals Audit</h4>
              <p className="text-xs text-slate-300 font-medium">
                Log Blood Pressure, SpO2, and Sugar readings directly on your phone. Automatic timestamped audit trails ensure senior safety.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <IndianRupee className="h-5 w-5" />
              </div>
              <h4 className="text-base font-black text-white">Live Daily Pay & Zero Commission</h4>
              <p className="text-xs text-slate-300 font-medium">
                Track every completed hour and medicine run. Request instant payout directly to your bank account or UPI ID with 1 tap.
              </p>
            </div>
          </div>
        </div>

        {/* Footer switch back */}
        <div className="pt-8 text-center border-t border-slate-800">
          <p className="text-xs text-slate-400 font-medium">
            Are you looking for senior medical care for your parents or personal pill tracker?
          </p>
          <button
            type="button"
            id="btnFooterSwitchToMainPreview"
            onClick={onSwitchToMainPreview}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 font-black text-xs border border-slate-700 transition cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Go to KinCare Senior & Family Portal →</span>
          </button>
        </div>
      </main>
    </div>
  );
};

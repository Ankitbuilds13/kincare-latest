import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HeartHandshake,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  onOpenHelperPortal?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onOpenHelperPortal }) => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    login, 
    signup 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('family');

  // UI status
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode with context
  useEffect(() => {
    setMode(authModalMode);
    setError(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleFillDemo = () => {
    setLoginEmail('demo@kincare.in');
    setLoginPassword('Password@123');
    setError(null);
  };

  const handleFillHelperDemo = () => {
    setLoginEmail('helper@kincare.in');
    setLoginPassword('Password@123');
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!loginEmail || !loginPassword) {
      setError('Please provide both email and password.');
      setIsSubmitting(false);
      return;
    }

    const result = await login(loginEmail, loginPassword, rememberMe);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Login failed. Please verify your credentials.');
    } else {
      setSuccessMessage('Successfully signed in! Welcome back.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please enter a valid contact phone number.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      name,
      email: signupEmail,
      password: signupPassword,
      phone,
      role,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to create account.');
    } else {
      setSuccessMessage('Account created successfully! Welcome to Kin Care.');
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="authModalHeading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 relative transition-colors">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close authentication modal"
          id="closeAuthModalBtn"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center shadow-xs flex-shrink-0">
            <ShieldCheck className="h-7 w-7 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-teal-700 dark:text-teal-400 tracking-wider">
              Kin Care Patient & Family Portal
            </span>
            <h3 id="authModalHeading" className="text-2xl font-black text-slate-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-5 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            id="authLoginTabBtn"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="authSignupTabBtn"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-2 animate-shake">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  id="loginEmailInput"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  id="loginPasswordInput"
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
                Remember me
              </label>

              {/* 1-Click Demo Fill Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  id="fillDemoAccountBtn"
                  className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 font-bold hover:underline cursor-pointer bg-teal-50 dark:bg-teal-950/70 px-2 py-1 rounded-lg border border-teal-200 dark:border-teal-800 text-[11px]"
                  title="Fill with family demo credentials"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Family Demo</span>
                </button>
                <button
                  type="button"
                  onClick={handleFillHelperDemo}
                  id="fillHelperDemoBtn"
                  className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold hover:underline cursor-pointer bg-blue-50 dark:bg-blue-950/70 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800 text-[11px]"
                  title="Fill with caregiver helper demo credentials"
                >
                  <Briefcase className="h-3 w-3" />
                  <span>Caregiver Demo</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="submitLoginBtn"
              className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base mt-3 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="h-5 w-5" />
              {isSubmitting ? 'Verifying...' : 'Sign In Safely'}
            </button>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma / Ananya"
                  id="signupNameInput"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@mail.com"
                    id="signupEmailInput"
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone (India) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    id="signupPhoneInput"
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  id="signupRoleFamily"
                  onClick={() => setRole('family')}
                  className={`p-2 rounded-xl border-2 font-bold text-left transition cursor-pointer flex flex-col sm:flex-row items-center gap-1.5 ${
                    role === 'family' || role === 'family_caregiver'
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <HeartHandshake className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span className="text-center sm:text-left">Family</span>
                </button>
                <button
                  type="button"
                  id="signupRoleSenior"
                  onClick={() => setRole('senior_individual')}
                  className={`p-2 rounded-xl border-2 font-bold text-left transition cursor-pointer flex flex-col sm:flex-row items-center gap-1.5 ${
                    role === 'senior_individual' || role === 'elder'
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <User className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span className="text-center sm:text-left">Senior</span>
                </button>
                <button
                  type="button"
                  id="signupRoleHelper"
                  onClick={() => setRole('helper')}
                  className={`p-2 rounded-xl border-2 font-bold text-left transition cursor-pointer flex flex-col sm:flex-row items-center gap-1.5 ${
                    role === 'helper' || role === 'helper_proxy'
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Briefcase className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span className="text-center sm:text-left">Caregiver</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    id="signupPasswordInput"
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    id="signupConfirmPasswordInput"
                    className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="submitSignupBtn"
              className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base mt-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="h-5 w-5" />
              {isSubmitting ? 'Creating Secure Account...' : 'Create Account'}
            </button>

            {/* Helper / Proxy Website Link */}
            {onOpenHelperPortal && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    onOpenHelperPortal();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer py-1"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Are you a Caregiver or Nurse? Open Helpers Website →</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* Security Reassurance Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-center">
          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
          <span>Secured with client-side PBKDF2-SHA256 password hashing.</span>
        </div>
      </div>
    </div>
  );
};

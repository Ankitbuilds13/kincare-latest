import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Save, 
  LogOut, 
  Edit3, 
  Sun, 
  Moon, 
  Type, 
  PhoneCall, 
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Booking } from '../types';

interface ProfilePageProps {
  onBackToHome: () => void;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onBackToHome,
  bookings,
  onCancelBooking,
}) => {
  const { user, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t: _t } = useLanguage();

  const [isLargeFont, setIsLargeFont] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('senior-large-font');
    }
    return false;
  });

  const toggleFontSize = () => {
    const next = !isLargeFont;
    setIsLargeFont(next);
    if (typeof document !== 'undefined') {
      if (next) {
        document.documentElement.classList.add('senior-large-font');
      } else {
        document.documentElement.classList.remove('senior-large-font');
      }
    }
  };

  const [activeTab, setActiveTab] = useState<'details' | 'emergency' | 'visits'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContactPhone || '');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [allergies, setAllergies] = useState('Penicillin (mild sensitivity)');

  // Sync state if user changes
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAddress(user.address || '');
      setEmergencyName(user.emergencyContactName || '');
      setEmergencyPhone(user.emergencyContactPhone || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      address,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Bar / Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Back to Home button */}
          <button
            type="button"
            onClick={onBackToHome}
            id="profileBackToHomeBtn"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-400 font-extrabold text-sm border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 text-white p-2 rounded-xl">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white hidden sm:inline">
              KinCare Profile
            </span>
          </div>

          {/* Accessibility Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFontSize}
              id="profileFontToggleBtn"
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                isLargeFont
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-950 dark:text-amber-200'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Toggle Large Font"
            >
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">{isLargeFont ? 'Large Font' : 'Standard'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              id="profileThemeToggleBtn"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            <a
              href="tel:1800208108"
              id="profileHelplineBtn"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-extrabold text-xs flex items-center gap-1.5"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span className="hidden md:inline">24x7 Help</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Profile Canvas */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        
        {/* If user is NOT signed in */}
        {!isAuthenticated || !user ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 mx-auto flex items-center justify-center mb-4">
              <User className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Sign In to View Profile
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Access your saved senior health profile, doctor & emergency contacts, and upcoming home visits.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm shadow-md transition cursor-pointer active:scale-95"
              >
                Sign In to My Account
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-sm transition cursor-pointer"
              >
                Return to KinCare Services
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Profile Overview Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* User Avatar and Primary Info */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-teal-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {user.name}
                      </h1>
                      <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        {user.role === 'senior_individual' || user.role === 'elder' ? 'Senior Patient' : user.role === 'helper' ? 'Caregiver / Helper' : 'Family'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-teal-600" /> {user.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-teal-600" /> {user.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Patient Profile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Print Medical Card & Logout Actions */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto flex-shrink-0 print:hidden">
                  <button
                    type="button"
                    onClick={handlePrintCard}
                    id="printHealthCardBtn"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                    title="Print senior emergency card for medical visits or wallet"
                  >
                    <Printer className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span>Print Health Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    id="profileLogoutBtn"
                    className="px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-red-200 dark:border-red-900 transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>

              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 overflow-x-auto print:hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'details'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Personal & Address
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('emergency')}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'emergency'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className="h-3.5 w-3.5 text-red-500" />
                  <span>Emergency & Medical Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('visits')}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'visits'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Home Visits ({bookings.length})</span>
                </button>
              </div>

            </div>

            {/* Saved Notification */}
            {savedSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-700 rounded-2xl text-emerald-900 dark:text-emerald-200 text-sm font-bold flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Profile details and emergency preferences updated successfully!</span>
              </div>
            )}

            {/* TAB 1: Personal & Address Details */}
            {activeTab === 'details' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Personal & Contact Information
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Caregivers and medical personnel use this information during home visits.
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      id="editProfileTabBtn"
                      className="px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-800 dark:text-teal-300 font-bold text-xs sm:text-sm border border-teal-300 dark:border-teal-800 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Primary Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Home Address for Caregiver & Nurse Visits
                      </label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Apartment Number, Wing, Street, Landmark, City, Pincode"
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
                      >
                        <Save className="h-4 w-4" /> Save Profile Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Registered Full Name
                      </span>
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        {user.name}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Verified Contact Phone
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                        <Phone className="h-4 w-4 text-teal-600" />
                        {user.phone}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 md:col-span-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Registered Service Residence
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        {user.address || 'B-402, Green Park Avenue, South Delhi'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Emergency & Medical Card */}
            {activeTab === 'emergency' && (
              <div className="space-y-6">
                
                {/* Printable Health Card preview */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-850 rounded-3xl border-2 border-amber-300 dark:border-amber-900/60 p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-600 text-white rounded-2xl shadow-sm">
                        <Heart className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">
                          Emergency SOS & Medical Card
                        </h2>
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                          Priority contact information displayed during hospital dispatch
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handlePrintCard}
                      className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-amber-100 text-slate-900 dark:text-white font-black text-xs rounded-xl border border-amber-300 dark:border-slate-700 shadow-xs flex items-center gap-1.5 transition cursor-pointer print:hidden"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print Card</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Emergency Contact */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-900 shadow-xs">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 block mb-1">
                        Primary Family / Doctor Contact
                      </span>
                      <p className="font-black text-slate-900 dark:text-white text-lg">
                        {user.emergencyContactName || 'Dr. Ramesh Sharma (Father)'}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                          {user.emergencyContactPhone || '+91 98111 22334'}
                        </span>
                        <a
                          href={`tel:${user.emergencyContactPhone || '+919811122334'}`}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs flex items-center gap-1 shadow-xs transition"
                        >
                          <PhoneCall className="h-3 w-3" /> Call Now
                        </a>
                      </div>
                    </div>

                    {/* Blood Group & Medical Alerts */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-900 shadow-xs">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 block mb-1">
                        Blood Group & Allergies
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-xl font-black text-sm">
                          {bloodGroup}
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Known sensitivities: {allergies}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        Paramedics verify this info prior to emergency medication administration.
                      </div>
                    </div>
                  </div>

                  {/* Form to update emergency details */}
                  <form onSubmit={handleSave} className="mt-6 pt-5 border-t border-amber-200 dark:border-amber-900/60 print:hidden space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Update Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Contact Name & Relation
                        </label>
                        <input
                          type="text"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          placeholder="e.g. Priya Sharma (Daughter)"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Contact Direct Phone
                        </label>
                        <input
                          type="tel"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Emergency Info</span>
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 3: Scheduled Home Care Visits */}
            {activeTab === 'visits' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Home Care Visits & History
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Doorstep medical visits booked under this account
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="px-4 py-2 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
                  >
                    + Book Another Visit
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base mb-1">
                      No Scheduled Visits
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                      You haven't scheduled any home nurse visits or senior check-ups yet.
                    </p>
                    <button
                      type="button"
                      onClick={onBackToHome}
                      className="px-5 py-2.5 rounded-xl bg-teal-700 text-white font-black text-xs"
                    >
                      Browse Care Services
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 dark:text-white text-base">
                              {booking.serviceTitle}
                            </span>
                            <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-teal-600" /> {booking.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-teal-600" /> {booking.timeSlot}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-teal-600" /> For: {booking.patientName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Location: {booking.address}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          <span className="font-black text-slate-900 dark:text-white text-sm mr-2">
                            {booking.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => onCancelBooking(booking.id)}
                            className="px-3 py-1.5 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 text-xs font-bold transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};

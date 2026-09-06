import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Flame, 
  Activity, 
  Trash2, 
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
  HeartPulse,
  Lock,
  ShoppingBag,
  Truck,
  Eye,
  LogIn,
  UserPlus,
  Unlink,
  HeartHandshake,
  Check,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Medicine, VitalRecord } from '../types';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CatalogueStore } from './CatalogueStore';
import { CentralizedCatalogueBar } from './CentralizedCatalogueBar';

interface MedicineTrackerProps {
  onOpenSettings?: () => void;
}

export const MedicineTracker: React.FC<MedicineTrackerProps> = ({ onOpenSettings }) => {
  const { user, isAuthenticated, openAuthModal, linkFamilyCode, unlinkFamilyCode } = useAuth();
  const isElder = user?.role === 'senior_individual' || user?.role === 'elder';
  
  const [elderHubSection, setElderHubSection] = useState<'schedule' | 'store'>('schedule');
  const [selectedStoreCategory, setSelectedStoreCategory] = useState<'all' | 'medicine' | 'fruits_veggies' | 'grocery'>('all');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Link family code input state
  const [familyCodeInput, setFamilyCodeInput] = useState('');
  const [linkNotice, setLinkNotice] = useState<string | null>(null);
  
  // Add Med modal state
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1 Tablet');
  const [medTiming, setMedTiming] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  const [medInstructions, setMedInstructions] = useState('');
  
  // Log Vitals modal state (restricted for elder role)
  const [isLogVitalOpen, setIsLogVitalOpen] = useState(false);
  const [bpValue, setBpValue] = useState('120/80');
  const [sugarValue, setSugarValue] = useState('115');
  const [pulseValue, setPulseValue] = useState('72');
  const [vitalNotes, setVitalNotes] = useState('');
  const [vitalSavedNotice, setVitalSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(false);
    try {
      const [medsData, vitalsData] = await Promise.all([
        api.getMedicines(),
        api.getVitals(),
      ]);
      setMedicines(medsData);
      setVitals(vitalsData);
    } catch (e) {
      console.error('Failed to load medicine/vitals', e);
    }
  };

  const handleConnectFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyCodeInput.trim()) {
      setLinkNotice('Please enter a valid family code.');
      return;
    }
    const res = await linkFamilyCode(familyCodeInput.trim());
    setLinkNotice(res.message);
    setFamilyCodeInput('');
    setTimeout(() => setLinkNotice(null), 4000);
  };

  const handleQuickDemoLinkFamily = async () => {
    const res = await linkFamilyCode('KIN-9241');
    setLinkNotice(res.message);
    setTimeout(() => setLinkNotice(null), 4000);
  };

  const handleUnlinkFamily = async () => {
    const res = await unlinkFamilyCode();
    setLinkNotice(res.message);
    setTimeout(() => setLinkNotice(null), 4000);
  };

  // 1. Unauthenticated Guard: Don't show any account or data until signed in!
  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-md">
          <Pill className="h-8 w-8" />
        </div>
        <div>
          <span className="text-xs font-black uppercase text-teal-700 dark:text-teal-400 tracking-wider">
            Elder Hub Account Required
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Sign In to Access Senior Health Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 leading-relaxed">
            No senior account is active. Please sign in or create an account to view your prescribed medicine doses, log blood pressure and sugar levels, and link with family guardians.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            id="elderSignInBtn"
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Senior Account</span>
          </button>
          <button
            type="button"
            id="elderRegisterBtn"
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-black text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Senior Account</span>
          </button>
        </div>
      </div>
    );
  }

  const handleToggleTaken = async (id: string) => {
    // Optimistic update
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextTaken = !m.takenToday;
          return {
            ...m,
            takenToday: nextTaken,
            takenAt: nextTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            streakDays: nextTaken ? m.streakDays + 1 : Math.max(0, m.streakDays - 1),
          };
        }
        return m;
      })
    );

    await api.toggleMedicine(id);
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newMed = await api.addMedicine({
      name: medName.trim(),
      dosage: medDosage.trim() || '1 Tablet',
      timing: medTiming,
      instructions: medInstructions.trim() || 'Take after meal with water',
    });

    setMedicines((prev) => [...prev, newMed]);
    setMedName('');
    setMedInstructions('');
    setIsAddMedOpen(false);
  };

  const handleDeleteMedicine = async (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    await api.deleteMedicine(id);
  };

  const handleSaveVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVital = await api.addVital({
      bloodPressure: `${bpValue} mmHg`,
      sugarLevel: `${sugarValue} mg/dL`,
      pulseSpO2: `${pulseValue} bpm (98% SpO2)`,
      temperature: '98.4 °F',
      notes: vitalNotes.trim() || 'Self-recorded by elder',
      recordedBy: user?.name || 'Self-Recorded',
    });

    setVitals((prev) => [newVital, ...prev]);
    setIsLogVitalOpen(false);
    setVitalSavedNotice('Vitals saved and synchronized with family!');
    setTimeout(() => setVitalSavedNotice(null), 4000);
  };

  const takenCount = medicines.filter((m) => m.takenToday).length;
  const totalCount = medicines.length;
  const progressPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner: Family Connection Status */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 border-2 border-teal-500/30 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center flex-shrink-0 text-teal-300">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                Elder Hub
              </span>
              {user?.linkedFamilyCode ? (
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Linked: {user.linkedFamilyCode}
                </span>
              ) : (
                <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  No Family Linked
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {user?.name ? `Namaste, ${user.name}` : 'Namaste, Senior Elder'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              {user?.linkedFamilyCode 
                ? `Synchronized both ways in real-time with Family Guardian (${user.linkedFamilyCode}). All medicine doses and vitals are mirrored automatically.`
                : 'Connect your child’s family code below. Linking is automatic both ways—your family portal will immediately synchronize without needing to enter an elder code.'}
            </p>
          </div>
        </div>

        {user?.linkedFamilyCode ? (
          <button
            type="button"
            onClick={handleUnlinkFamily}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer whitespace-nowrap"
            title="Unlink family account"
          >
            <Unlink className="h-3.5 w-3.5" />
            <span>Unlink Family</span>
          </button>
        ) : (
          onOpenSettings && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onOpenSettings}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow transition cursor-pointer whitespace-nowrap"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Link Family Code</span>
            </motion.button>
          )
        )}
      </motion.div>

      {/* Prominent 'Link a Family Account' section when no family is linked */}
      {!user?.linkedFamilyCode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-2 border-amber-300 dark:border-amber-800 shadow-sm space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-amber-800 dark:text-amber-400 tracking-wider">
                  Family Connection Needed
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Link a Family Account
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Connect your child or family guardian's Family Code. <strong>Automatic 2-Way Sync:</strong> Once linked, your family portal immediately connects without asking your child to enter an elder code.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Your Senior Code</span>
              <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-200">{user?.elderCode || 'ELD-4021'}</span>
            </div>
          </div>

          {linkNotice && (
            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 text-xs font-bold text-center">
              {linkNotice}
            </div>
          )}

          {/* Form & 1-Click Link */}
          <form onSubmit={handleConnectFamily} className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full sm:flex-1">
              <input
                type="text"
                value={familyCodeInput}
                onChange={(e) => setFamilyCodeInput(e.target.value)}
                placeholder="Enter 6-character Family Sync Code (e.g. KIN-9241)"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm shadow transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Link Family Account</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoLinkFamily}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Check className="h-4 w-4" />
              <span>Connect Daughter Ananya (KIN-9241)</span>
            </button>
          </form>
        </motion.div>
      )}

      {/* Elder Hub Sub-Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="tabElderSchedule"
            onClick={() => setElderHubSection('schedule')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              elderHubSection === 'schedule'
                ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Pill className="h-4 w-4" />
            <span>Prescription Schedule & Vitals</span>
          </button>
          <button
            type="button"
            id="tabElderStore"
            onClick={() => setElderHubSection('store')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              elderHubSection === 'store'
                ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Medicines & Fresh Grocery Store</span>
            <span className="hidden sm:inline-block text-[9px] uppercase px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-md">
              Doorstep Delivery
            </span>
          </button>
        </div>
      </div>

      {/* Centralized Prescription & Fresh Grocery Action Bar for Elder */}
      <CentralizedCatalogueBar
        activeCategory={elderHubSection === 'store' ? selectedStoreCategory : undefined}
        onSelectCategory={(category) => {
          setSelectedStoreCategory(category);
          setElderHubSection('store');
        }}
        onTrackDeliveries={() => {
          setSelectedStoreCategory('all');
          setElderHubSection('store');
        }}
        title="Quick Elder Orders: Medicines & Farm-Fresh Groceries"
        subtitle="One-tap doorstep delivery of your daily prescriptions and fresh nutritious groceries."
      />

      {/* Notice Alert */}
      {vitalSavedNotice && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{vitalSavedNotice}</span>
        </motion.div>
      )}

      {/* VIEW 1: STORE & DELIVERIES */}
      {elderHubSection === 'store' && (
        <CatalogueStore 
          userRole="elder" 
          initialCategory={selectedStoreCategory}
        />
      )}

      {/* VIEW 2: SCHEDULE & VITALS */}
      {elderHubSection === 'schedule' && (
        <>
          {/* Progress & Actions Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Progress Card */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="rounded-3xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Today's Adherence
                </span>
                <span className="text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-md">
                  {takenCount}/{totalCount} Completed
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {progressPercent}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full"
                />
              </div>
            </motion.div>

            {/* Action: Add Medicine */}
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setIsAddMedOpen(true)}
              className="rounded-3xl p-5 bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md flex flex-col justify-between text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Pill className="h-5 w-5 text-white" />
                </div>
                <Plus className="h-5 w-5 text-teal-200" />
              </div>
              <div className="mt-4">
                <h4 className="font-black text-base sm:text-lg">Add New Medicine</h4>
                <p className="text-xs text-teal-100">Set dosage, timings and doctor instructions</p>
              </div>
            </motion.button>

            {/* Action: Log Vitals (VIEW-ONLY FOR ELDER) */}
            {isElder ? (
              <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between text-left">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    View Only (Family Logged)
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    Health Vitals Audit
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Latest readings recorded by your family & attending nurse
                  </p>
                </div>
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsLogVitalOpen(true)}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 shadow-xs flex flex-col justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
                    Instant Sync
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    Log Vital Signs
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Record Blood Pressure, Sugar & SpO2
                  </p>
                </div>
              </motion.button>
            )}
          </div>

      {/* Active Daily Pill Schedule */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Today's Medicine Schedule</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Tap any pill once taken to update your daily adherence record.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddMedOpen(true)}
            className="text-xs font-black text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900 transition cursor-pointer"
          >
            + Add Pill
          </button>
        </div>

        {medicines.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <Pill className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="font-bold">No medicines added yet.</p>
            <p className="text-xs mt-1">Add your daily prescriptions to receive timely reminders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {medicines.map((med) => {
              return (
                <motion.div
                  key={med.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                    med.takenToday
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleTaken(med.id)}
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center mt-0.5 transition cursor-pointer ${
                        med.takenToday
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-400 dark:border-slate-600 hover:border-teal-500'
                      }`}
                      aria-label={`Mark ${med.name} as ${med.takenToday ? 'not taken' : 'taken'}`}
                    >
                      {med.takenToday && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-black text-base ${
                          med.takenToday 
                            ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80' 
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {med.name}
                        </h4>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                        {med.instructions}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                          {med.timing}
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <Flame className="h-3 w-3" />
                          {med.streakDays} day streak
                        </span>
                        {med.takenAt && (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Taken at {med.takenAt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMedicine(med.id)}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition cursor-pointer"
                    title="Remove medicine"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Vitals Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Recent Health Vitals Audit</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Real-time records visible to your family members and doctors.
            </p>
          </div>
          {isElder ? (
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span>View Only (Supervised by Family)</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsLogVitalOpen(true)}
              className="text-xs font-black text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition cursor-pointer"
            >
              + Log Reading
            </button>
          )}
        </div>

        <div className="space-y-3">
          {vitals.slice(0, 3).map((vital) => (
            <div 
              key={vital.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                  BP: {vital.bloodPressure}
                </span>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                  Sugar: {vital.sugarLevel}
                </span>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                  {vital.pulseSpO2}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                <span>{vital.timestamp} • By {vital.recordedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      {/* Modal: Add New Medicine */}
      <AnimatePresence>
        {isAddMedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border-2 border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white"
            >
              <h3 className="text-xl font-black mb-1">Add Daily Medicine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Record instructions so caregivers and family stay informed.
              </p>

              <form onSubmit={handleAddMedicine} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Telmisartan 40mg / Calcium D3"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      placeholder="e.g. 1 Tablet"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Timing
                    </label>
                    <select
                      value={medTiming}
                      onChange={(e) => setMedTiming(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    value={medInstructions}
                    onChange={(e) => setMedInstructions(e.target.value)}
                    placeholder="e.g. Take after breakfast with warm water"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-teal-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddMedOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow transition cursor-pointer"
                  >
                    Save Medicine
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Log Vital Signs (Restricted: Not accessible to elder) */}
      <AnimatePresence>
        {isLogVitalOpen && !isElder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border-2 border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white"
            >
              <h3 className="text-xl font-black mb-1">Record Vital Signs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Instantly accessible by your designated family members.
              </p>

              <form onSubmit={handleSaveVitals} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Pressure (Systolic / Diastolic)
                  </label>
                  <input
                    type="text"
                    required
                    value={bpValue}
                    onChange={(e) => setBpValue(e.target.value)}
                    placeholder="120/80"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Blood Sugar (mg/dL)
                    </label>
                    <input
                      type="text"
                      value={sugarValue}
                      onChange={(e) => setSugarValue(e.target.value)}
                      placeholder="115"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pulse Rate (BPM)
                    </label>
                    <input
                      type="text"
                      value={pulseValue}
                      onChange={(e) => setPulseValue(e.target.value)}
                      placeholder="72"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Observations / Notes
                  </label>
                  <input
                    type="text"
                    value={vitalNotes}
                    onChange={(e) => setVitalNotes(e.target.value)}
                    placeholder="e.g. Feeling light and energetic after morning walk"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-purple-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsLogVitalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow transition cursor-pointer"
                  >
                    Save & Sync
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

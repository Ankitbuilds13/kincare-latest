import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Activity, 
  UserCheck, 
  HeartHandshake, 
  Calendar, 
  Copy, 
  Check, 
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Star,
  FileText,
  ShoppingBag,
  Users,
  LogIn,
  UserPlus,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyStatus, Helper } from '../types';
import { api } from '../utils/api';
import { useAuth, getStoredFamilyLinks } from '../context/AuthContext';
import { CatalogueStore } from './CatalogueStore';
import { CentralizedCatalogueBar } from './CentralizedCatalogueBar';

interface FamilyPortalProps {
  onHireCaregiver: (helper: Helper) => void;
  onOpenHelpline: () => void;
}

export const FamilyPortal: React.FC<FamilyPortalProps> = ({ onHireCaregiver, onOpenHelpline }) => {
  const { user, isAuthenticated, openAuthModal, linkElderAccount, unlinkElderAccount } = useAuth();
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus | null>(null);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'logs' | 'helpers' | 'catalogue'>('map');
  const [selectedStoreCategory, setSelectedStoreCategory] = useState<'all' | 'medicine' | 'fruits_veggies' | 'grocery'>('all');

  // Link Elder Form State
  const [elderInputCode, setElderInputCode] = useState('');
  const [elderInputName, setElderInputName] = useState('');
  const [elderInputPhone, setElderInputPhone] = useState('');
  const [elderInputAddress, setElderInputAddress] = useState('');
  const [linkNotice, setLinkNotice] = useState<string | null>(null);
  const [linksVersion, setLinksVersion] = useState(0);

  const sunitaPhoto = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';

  const familyCode = user?.familyCode || 'KIN-9241';

  // Listen for automatic 2-way link events across components and tabs
  useEffect(() => {
    const handleUpdate = () => {
      setLinksVersion((v) => v + 1);
    };
    window.addEventListener('kincare_family_links_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kincare_family_links_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Check both direct user state and shared two-way registry
  const sharedLink = getStoredFamilyLinks()[familyCode];
  const activeElderName = user?.linkedElderName || sharedLink?.elderName;
  const activeElderCode = user?.linkedElderCode || sharedLink?.elderCode;
  const activeElderPhone = user?.linkedElderPhone || sharedLink?.elderPhone;
  const activeElderAddress = user?.linkedElderAddress || sharedLink?.elderAddress;
  const isElderLinked = Boolean(activeElderName || activeElderCode);

  useEffect(() => {
    if (isAuthenticated && isElderLinked) {
      loadData();
    }
  }, [familyCode, isAuthenticated, isElderLinked, linksVersion]);

  const loadData = async () => {
    try {
      const [statusData, helpersData] = await Promise.all([
        api.getFamilyStatus(familyCode),
        api.getHelpers(),
      ]);
      setFamilyStatus(statusData);
      setHelpers(helpersData);
      if (helpersData.length > 0) {
        setSelectedHelper(helpersData[0]);
      }
    } catch (e) {
      console.error('Failed to load family data', e);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(familyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleConnectElder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elderInputName.trim() && !elderInputCode.trim()) {
      setLinkNotice('Please provide an Elder Code or Name.');
      return;
    }
    const res = await linkElderAccount({
      name: elderInputName.trim() || 'Ramesh Sharma (Father)',
      code: elderInputCode.trim() || 'ELD-4021',
      phone: elderInputPhone.trim() || '+91 98111 22334',
      address: elderInputAddress.trim() || 'Flat 402, Eldeco Greens, Sector 44, Noida',
    });
    setLinkNotice(res.message);
    setElderInputCode('');
    setElderInputName('');
    setElderInputPhone('');
    setElderInputAddress('');
    setTimeout(() => setLinkNotice(null), 4000);
  };

  const handleQuickDemoLink = async () => {
    const res = await linkElderAccount({
      name: 'Ramesh Sharma (Father)',
      code: 'ELD-4021',
      phone: '+91 98111 22334',
      address: 'Flat 402, Eldeco Greens, Sector 44, Noida',
    });
    setLinkNotice(res.message);
    setTimeout(() => setLinkNotice(null), 4000);
  };

  const handleUnlink = async () => {
    const res = await unlinkElderAccount();
    setLinkNotice(res.message);
    setTimeout(() => setLinkNotice(null), 4000);
  };

  // 1. Unauthenticated Guard: Don't show any account or data until signed in!
  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
          <Users className="h-8 w-8" />
        </div>
        <div>
          <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-400 tracking-wider">
            Family Guardian Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Sign In to View Family Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 leading-relaxed">
            No family account is active. Please sign in or register to link your elderly parents, track caregiver dispatch in real time, and view medication logs.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            id="familySignInBtn"
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Family Account</span>
          </button>
          <button
            type="button"
            id="familyRegisterBtn"
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-black text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Family Account</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Elder Not Linked Guard: Don't show any data until an elder account is linked!
  if (!isElderLinked) {
    return (
      <div className="space-y-6">
        {/* Family Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-400 tracking-wider">
              Family Guardian Account
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Welcome, {user?.name || 'Family Member'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Share your Family Code with your elder or connect their account below.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase block">
                Your Family Code
              </span>
              <span className="text-lg font-black tracking-wider text-purple-950 dark:text-white font-mono">
                {familyCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </motion.div>

        {/* Link Elder Required Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900 border-2 border-dashed border-purple-300 dark:border-purple-800/80 shadow-xs space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-sm">
              <LinkIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              No Elder Account Linked Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              No elder data, live caregiver radar, or medical records can be displayed until an elder account is linked.
              <strong> Automatic 2-Way Sync:</strong> Share your Family Code (<span className="font-mono font-bold text-purple-700 dark:text-purple-300">{familyCode}</span>) with your senior elder. When they enter it in their Elder Hub, it links both ways immediately—no code entry needed from your side! You can also connect them directly below.
            </p>
          </div>

          {linkNotice && (
            <div className="max-w-md mx-auto p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold text-center">
              {linkNotice}
            </div>
          )}

          {/* Connect Elder Form */}
          <form onSubmit={handleConnectElder} className="max-w-lg mx-auto space-y-4 bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                Elder KinCare Code or Mobile Number
              </label>
              <input
                type="text"
                value={elderInputCode}
                onChange={(e) => setElderInputCode(e.target.value)}
                placeholder="e.g. ELD-4021 or +91 98111 22334"
                className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Elder Name (Optional)
                </label>
                <input
                  type="text"
                  value={elderInputName}
                  onChange={(e) => setElderInputName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Residence / City
                </label>
                <input
                  type="text"
                  value={elderInputAddress}
                  onChange={(e) => setElderInputAddress(e.target.value)}
                  placeholder="e.g. Sector 44, Noida"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow transition cursor-pointer flex items-center justify-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Link Elder Account Now</span>
            </button>

            <div className="relative py-2 flex items-center justify-center">
              <div className="border-t border-slate-300 dark:border-slate-700 w-full" />
              <span className="bg-slate-50 dark:bg-slate-800 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider absolute">
                or instant demo
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLink}
              className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>1-Click Connect Demo Elder (Ramesh Sharma • Noida)</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 3. Elder IS Linked: Show full data and real-time synchronization!
  return (
    <div className="space-y-6">
      {linkNotice && (
        <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold text-center">
          {linkNotice}
        </div>
      )}

      {/* 1. Header: Family Sync Code & Elder Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
              Remote Family Guardian Dashboard
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Connected
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
              2-Way Auto Sync
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tracking: {activeElderName || familyStatus?.elderName || 'Ramesh Sharma (Father)'}
            </h2>
            <button
              type="button"
              onClick={handleUnlink}
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 border border-red-200 dark:border-red-900 transition flex items-center gap-1 cursor-pointer"
              title="Unlink elder account"
            >
              <Unlink className="h-3 w-3" />
              <span>Unlink</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            {activeElderAddress || familyStatus?.elderAddress || 'Flat 402, Eldeco Greens, Sector 44, Noida'} • Elder Code: {activeElderCode || 'ELD-4021'}
          </p>
        </div>

        {/* Family Code Card */}
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-slate-800/90 border-2 border-teal-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div>
            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide block">
              Family Sync Code
            </span>
            <span className="text-xl font-black tracking-wider text-teal-950 dark:text-white font-mono">
              {familyCode}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleCopyCode}
            className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow transition cursor-pointer"
            title="Copy Family Code"
          >
            {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 2. Key Metrics Bar: Meds Adherence, Current Vitals, Active Caregiver */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Meds Adherence */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>Today's Medicine Adherence</span>
            <span className="text-teal-600 dark:text-teal-400 font-extrabold">{familyStatus?.medsAdherence.percent || 50}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {familyStatus?.medsAdherence.taken || 2} of {familyStatus?.medsAdherence.total || 4} Taken
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Next: Vitamin D3 & Calcium at 07:00 PM
          </p>
        </motion.div>

        {/* Latest Vitals */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>Latest Vitals Recorded</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Stable</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            122/80 <span className="text-sm font-bold text-slate-500">mmHg</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SpO2: 98% • Pulse: 74 bpm • Sugar: 118 mg/dL
          </p>
        </motion.div>

        {/* Caregiver On-Duty */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-teal-50/80 dark:bg-slate-900 border-2 border-teal-300 dark:border-teal-800 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-bold text-teal-800 dark:text-teal-300 mb-1">
            <span>Active Helper Status</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200 text-[10px] font-black">
              En-Route (12m away)
            </span>
          </div>
          <div className="flex items-center gap-3 my-1">
            <div className="relative">
              <img
                src={familyStatus?.activeHelper?.avatar || sunitaPhoto}
                alt="Sister Sunita Devi"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80';
                }}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-black text-base text-slate-900 dark:text-white truncate">
                {familyStatus?.activeHelper?.name || 'Sister Sunita Devi'}
              </div>
              <div className="text-xs text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                <span>RN Certified • ICU Specialist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-teal-200/60 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">ID: KIN-RN-4821</span>
            <a 
              href="tel:18001234567" 
              className="text-xs font-black text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Phone className="h-3.5 w-3.5" /> Call Nurse
            </a>
          </div>
        </motion.div>
      </div>

      {/* Centralized Prescription & Fresh Grocery Bar for Family */}
      <CentralizedCatalogueBar
        activeCategory={activeTab === 'catalogue' ? selectedStoreCategory : undefined}
        onSelectCategory={(category) => {
          setSelectedStoreCategory(category);
          setActiveTab('catalogue');
        }}
        onTrackDeliveries={() => setActiveTab('map')}
        title="Quick Doorstep Orders for Senior"
        subtitle="Order verified prescription medicines and farm-fresh fruits & groceries for immediate caregiver delivery."
      />

      {/* 3. Navigation Tabs: Map View / Helper Logs / Caregiver Directory / Doorstep Store */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Navigation className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Live Helper Map View</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Live Helper Logs</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('helpers')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'helpers'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HeartHandshake className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Hire Caretakers</span>
        </button>
        <button
          type="button"
          id="tabFamilyCatalogue"
          onClick={() => setActiveTab('catalogue')}
          className={`flex-1 min-w-[170px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'catalogue'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Order Meds & Groceries</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: INTERACTIVE MAP VIEW */}
      {activeTab === 'map' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <span>Live Caregiver Dispatch Radar</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Real-time transit positioning of Sister Sunita Devi en-route to elder's residence.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200 text-xs font-black rounded-xl border border-teal-300 dark:border-teal-800">
                ETA: ~12 mins
              </span>
              <a 
                href="tel:18001234567" 
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-1 shadow transition"
              >
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
            </div>
          </div>

          {/* Map Simulation Container */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-200 to-teal-100 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/50 border-2 border-slate-300 dark:border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 opacity-15 dark:opacity-25 pointer-events-none bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Travel Path SVG Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line 
                x1="25%" 
                y1="70%" 
                x2="75%" 
                y2="30%" 
                stroke="#0d9488" 
                strokeWidth="4" 
                strokeDasharray="6 6" 
                className="animate-pulse"
              />
            </svg>

            {/* Elder Residence Marker (Destination) */}
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-[30%] right-[25%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-xl flex items-center justify-center border-2 border-white dark:border-slate-900">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="mt-1 px-2.5 py-0.5 rounded-lg bg-slate-900/90 text-white text-[11px] font-black shadow whitespace-nowrap">
                🏠 Elder: Eldeco Greens #402
              </span>
            </motion.div>

            {/* Caregiver Live Marker (Moving Pin) */}
            <motion.div 
              animate={{ 
                x: [-10, 10, -10],
                y: [5, -5, 5]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute bottom-[30%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border-2 border-teal-500 bg-teal-900">
                  <img
                    src={familyStatus?.activeHelper?.avatar || sunitaPhoto}
                    alt="Sister Sunita"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Radar Ring */}
                <span className="absolute -inset-2 rounded-2xl bg-teal-400 opacity-40 animate-ping pointer-events-none" />
              </div>
              <span className="mt-1 px-2.5 py-0.5 rounded-lg bg-teal-950 text-teal-100 text-[11px] font-black shadow border border-teal-700 whitespace-nowrap flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sister Sunita (RN) • En-Route
              </span>
            </motion.div>

            {/* Bottom Map Status Strip */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                <Navigation className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Sector 62 Crossing → Sector 44 Expressway Route</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                GPS Updated 20s ago via Caregiver Telemetry
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: LIVE HELPER LOGS */}
      {activeTab === 'logs' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Real-Time Caregiver Visit Log & Audit Trail</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Every clinical task, medication delivery, and vital sign reading logged by attendants.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                time: '11:15 AM',
                task: 'Assisted senior with 20-min gentle corridor walking exercise and balance drills.',
                staff: 'Attendant Rajesh Kumar',
                status: 'Completed',
                badge: 'Mobility',
              },
              {
                time: '10:30 AM',
                task: 'Administered Telmisartan 40mg BP tablet with warm water after light oats breakfast.',
                staff: 'Sister Sunita Devi (RN)',
                status: 'Verified',
                badge: 'Medication',
              },
              {
                time: '10:15 AM',
                task: 'Recorded morning vitals: Blood Pressure 122/80 mmHg, SpO2 98%, Pulse 74 bpm.',
                staff: 'Sister Sunita Devi (RN)',
                status: 'Normal & Stable',
                badge: 'Vitals',
              },
              {
                time: '08:00 AM',
                task: 'Morning senior check-in: Patient reported resting comfortably through the night.',
                staff: 'Automated Kin Care Lifeline',
                status: 'Checked',
                badge: 'System Check',
              },
            ].map((log, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-teal-700 dark:text-teal-400">
                        {log.time}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {log.badge}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {log.task}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Logged by: {log.staff}
                    </span>
                  </div>
                </div>

                <span className="self-start sm:self-center px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 3: LIST OF HELPERS / HIRE CARETAKERS */}
      {activeTab === 'helpers' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <span>Verified Caregivers & Attendants Directory</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                100% police background-checked healthcare workers ready for home dispatch.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenHelpline}
              className="text-xs font-black text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-2 rounded-xl border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900 transition cursor-pointer"
            >
              Need Custom 24x7 Attendant? Call Us
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {helpers.map((helper) => (
              <motion.div
                key={helper.id}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <img 
                      src={helper.avatar} 
                      alt={helper.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80';
                      }}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shadow-xs"
                    />
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {helper.rating} ({helper.reviewsCount})
                      </span>
                      {helper.policeVerified && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md mt-1 border border-emerald-200 dark:border-emerald-800">
                          Police Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-black text-base text-slate-900 dark:text-white">
                    {helper.name}
                  </h4>
                  <p className="text-xs font-bold text-teal-700 dark:text-teal-400">
                    {helper.role} • {helper.experienceYears}y exp
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {helper.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[10px] font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    ₹{helper.hourlyRate}<span className="text-xs font-normal text-slate-500">/hr</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => onHireCaregiver(helper)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Hire Caretaker</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 4: ESSENTIALS CATALOGUE & DOORSTEP DELIVERIES */}
      {activeTab === 'catalogue' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CatalogueStore 
            userRole="family" 
            initialCategory={selectedStoreCategory}
            onViewLiveRadar={() => setActiveTab('map')} 
          />
        </motion.div>
      )}
    </div>
  );
};

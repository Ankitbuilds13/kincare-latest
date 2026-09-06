import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckCircle, 
  DollarSign, 
  BarChart3, 
  ListTodo, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Navigation, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Check,
  Truck,
  Package,
  ShoppingBag,
  ExternalLink,
  LogIn,
  UserPlus,
  LogOut,
  Camera,
  Save,
  Mail,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HelperOrder, HelperStats } from '../types';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface HelperPortalProps {
  viewMode?: 'helpers' | 'proxy';
  onSwitchMode?: (mode: 'helpers' | 'proxy') => void;
}

export const HelperPortal: React.FC<HelperPortalProps> = ({ 
  viewMode = 'helpers', 
  onSwitchMode 
}) => {
  const { isAuthenticated, openAuthModal, user, updateProfile, logout } = useAuth();
  const [orders, setOrders] = useState<HelperOrder[]>([]);
  const [stats, setStats] = useState<HelperStats | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'chores' | 'pay' | 'stats' | 'proxy' | 'profile'>(
    viewMode === 'proxy' ? 'proxy' : 'orders'
  );
  const [isOnline, setIsOnline] = useState(true);

  // Dynamic helper profile derived from logged-in user
  const helperName = user?.name || 'Sister Sunita Devi (RN)';
  const helperRole = user?.specialization || (user?.role === 'helper' ? 'Caregiver Partner' : 'Nursing Attendant');
  const helperBadge = user?.badgeNumber || (user?.id ? `DL-${user.id.replace(/[^0-9a-zA-Z]/g, '').slice(-4).toUpperCase()}` : 'DL-4481');
  const helperCity = user?.preferredCity || 'Delhi NCR Hub';
  const helperPhone = user?.phone || '+91 98711 00213';
  const helperEmail = user?.email || 'helper@kincare.in';
  const helperUpi = user?.upiId || (user?.email ? `${user.email.split('@')[0]}@okhdfcbank` : 'helper@okhdfcbank');

  const getHelperAvatar = () => {
    if (user?.avatarUrl) return user.avatarUrl;
    if (user?.name?.toLowerCase().includes('sunita')) {
      return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';
    }
    if (user?.name?.toLowerCase().includes('rajesh')) {
      return 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80';
    }
    if (user?.name?.toLowerCase().includes('priya')) {
      return 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80';
    }
    return null;
  };
  const helperAvatar = getHelperAvatar();

  // Profile edit form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCity, setEditCity] = useState(user?.preferredCity || 'Delhi NCR Hub');
  const [editSpecialization, setEditSpecialization] = useState(user?.specialization || 'ICU & Geriatric Trained RN');
  const [editUpi, setEditUpi] = useState(user?.upiId || helperUpi);
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditCity(user.preferredCity || 'Delhi NCR Hub');
      setEditSpecialization(user.specialization || 'ICU & Geriatric Trained RN');
      setEditUpi(user.upiId || (user.email ? `${user.email.split('@')[0]}@okhdfcbank` : 'helper@okhdfcbank'));
      setEditAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveSuccess(null);
    try {
      await updateProfile({
        name: editName.trim() || user?.name,
        phone: editPhone.trim() || user?.phone,
        preferredCity: editCity.trim() || 'Delhi NCR Hub',
        specialization: editSpecialization.trim() || 'Caregiver Partner',
        upiId: editUpi.trim(),
        avatarUrl: editAvatarUrl.trim() || undefined,
      });
      setProfileSaveSuccess('Caregiver profile saved successfully!');
      setTimeout(() => setProfileSaveSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'proxy') {
      setActiveTab('proxy');
    }
  }, [viewMode]);
  
  // Instant payout modal / state
  const [isPayoutRequested, setIsPayoutRequested] = useState(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  // New Chore Input state
  const [newChoreText, setNewChoreText] = useState('');

  // Chores state (interactive checklist)
  const [chores, setChores] = useState([
    { id: 'ch_1', task: 'Record morning blood pressure and pulse for Ramesh Sharma', completed: true, time: '09:30 AM' },
    { id: 'ch_2', task: 'Administer Telmisartan 40mg pill post-breakfast', completed: true, time: '10:00 AM' },
    { id: 'ch_3', task: 'Assist senior with 20 minutes gentle corridor walking exercise', completed: false, time: '11:30 AM' },
    { id: 'ch_4', task: 'Ensure low-sodium diabetic lunch served with warm water', completed: false, time: '01:00 PM' },
    { id: 'ch_5', task: 'Evening glucose level (fasting/post-prandial) test', completed: false, time: '05:30 PM' },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        api.getHelperOrders(),
        api.getHelperStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (e) {
      console.error('Failed to load helper data', e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: HelperOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    await api.updateOrderStatus(orderId, status);
  };

  const handleToggleChore = (id: string) => {
    setChores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const handleAddChore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChoreText.trim()) return;
    const newChore = {
      id: `ch_${Date.now()}`,
      task: newChoreText.trim(),
      completed: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChores((prev) => [...prev, newChore]);
    setNewChoreText('');
  };

  const handleRequestPayout = () => {
    setIsPayoutRequested(true);
    setTimeout(() => {
      setIsPayoutRequested(false);
      setPayoutSuccessMessage(`Payout of ₹8,450 initiated to UPI ID ${helperUpi}. Expected in 15 mins.`);
      setTimeout(() => setPayoutSuccessMessage(null), 6000);
    }, 1200);
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-md">
          <Briefcase className="h-8 w-8" />
        </div>
        <div>
          <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-400 tracking-wider">
            Caregiver & Helper Console
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Sign In to Access Caregiver Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 leading-relaxed">
            No active caregiver account is signed in. Please log in or register your verified nursing attendant profile to access assigned patient visits, vital sign chores, and instant payouts.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            id="helperSignInBtn"
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In as Caregiver</span>
          </button>
          <button
            type="button"
            id="helperRegisterBtn"
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-black text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Caregiver Registration</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Profile & Status Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            {helperAvatar ? (
              <img 
                src={helperAvatar} 
                alt={helperName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-teal-800 text-white font-black text-2xl flex items-center justify-center border-2 border-teal-500 shadow-md">
                {helperName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP'}
              </div>
            )}
            <span 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
              title={isOnline ? 'Online for Dispatch' : 'Off Duty'}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {helperName}
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {user?.role === 'helper' || user?.role === 'helper_proxy' ? 'Caregiver Partner' : 'Caregiver'}
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Badge: #{helperBadge} • {helperRole} • {helperCity}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              <span>{helperPhone}</span>
              <span>•</span>
              <span>{helperEmail}</span>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Edit Profile →
              </button>
            </div>
          </div>
        </div>

        {/* Online Status Toggle & Quick Switch */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isOnline ? 'Online for Dispatch' : 'Off Duty'}
            </span>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                isOnline ? 'bg-emerald-600' : 'bg-slate-400 dark:bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isOnline ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="Caregiver Profile Settings"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Payout Notice */}
      {payoutSuccessMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{payoutSuccessMessage}</span>
        </motion.div>
      )}

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Patient Orders ({orders.length})</span>
        </button>
        <button
          type="button"
          id="tabHelperProxySite"
          onClick={() => setActiveTab('proxy')}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'proxy'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Proxy Site</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chores')}
          className={`flex-1 min-w-[110px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'chores'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ListTodo className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Daily Chores</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pay')}
          className={`flex-1 min-w-[100px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pay'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Payouts</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex-1 min-w-[90px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Stats</span>
        </button>
        <button
          type="button"
          id="tabHelperProfile"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[110px] py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>My Profile</span>
        </button>
      </div>

      {/* 3. Tab: Patient Orders */}
      {activeTab === 'orders' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Assigned Patient Visits & Orders
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Live Dispatch Queue
            </span>
          </div>

          <div className="space-y-3.5">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                      {order.serviceTitle}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {order.scheduledTime}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {order.patientName} (Elder)
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                    <span>{order.address}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clinical Notes: {order.notes}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">Earnings Rate</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">₹{order.payoutAmount}</span>
                  </div>

                  {/* Status Controller */}
                  <div className="flex items-center gap-2">
                    {order.status === 'scheduled' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order.id, 'en_route')}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition cursor-pointer shadow"
                      >
                        Start Transit (En-Route)
                      </button>
                    )}
                    {order.status === 'en_route' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order.id, 'in_progress')}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition cursor-pointer shadow"
                      >
                        Check-in at Residence
                      </button>
                    )}
                    {order.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow"
                      >
                        Mark Visit Completed
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Completed
                      </span>
                    )}

                    <a
                      href={`tel:${order.patientPhone}`}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                      title="Call Patient / Family"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4. Tab: Daily Care Chores Checklist */}
      {activeTab === 'chores' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-4"
        >
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Patient Care Chore Checklist
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Checking off chores immediately syncs with the Family Guardian app audit log.
            </p>
          </div>

          <form onSubmit={handleAddChore} className="flex gap-2 pt-2">
            <input 
              type="text"
              value={newChoreText}
              onChange={(e) => setNewChoreText(e.target.value)}
              placeholder="Add new care chore (e.g. Check water intake, Evening walk)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-teal-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Chore</span>
            </button>
          </form>

          <div className="space-y-2.5 pt-2">
            {chores.map((chore) => (
              <div
                key={chore.id}
                onClick={() => handleToggleChore(chore.id)}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  chore.completed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-teal-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                    chore.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'
                  }`}>
                    {chore.completed && <Check className="h-4 w-4" />}
                  </div>
                  <span className={`text-sm font-bold ${chore.completed ? 'line-through opacity-75' : ''}`}>
                    {chore.task}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {chore.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. Tab: Pay & Instant Payout */}
      {activeTab === 'pay' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-800 to-slate-900 text-white border-2 border-teal-500/30 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-black text-teal-300 tracking-wider">
                  Available for Instant Payout
                </span>
                <div className="text-4xl font-black mt-2">
                  ₹8,450
                </div>
                <p className="text-xs text-teal-100/80 mt-1">
                  Ready to withdraw via IMPS / UPI into HDFC Bank (***4412)
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleRequestPayout}
                  disabled={isPayoutRequested}
                  className="w-full py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black rounded-xl text-sm transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isPayoutRequested ? 'Initiating UPI Transfer...' : 'Request Instant Payout Now'}
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-black text-slate-500 tracking-wider">
                  Monthly Total Earnings
                </span>
                <div className="text-4xl font-black text-slate-900 dark:text-white mt-2">
                  ₹34,500
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  From 42 verified senior care sessions & bedside assists
                </p>
              </div>

              <div className="pt-6 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                Next scheduled bi-weekly auto-deposit: Friday, 12:00 PM
              </div>
            </div>
          </div>

          {/* Recent Payout History */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="font-black text-base text-slate-900 dark:text-white">
              Recent Payout Transactions
            </h4>
            {[
              { id: 'tx_991', date: 'Yesterday, 06:14 PM', amount: '₹4,500', method: `UPI (${helperUpi})`, status: 'Settled' },
              { id: 'tx_990', date: '02 Sep 2026', amount: '₹12,200', method: 'Direct Bank NEFT', status: 'Settled' },
              { id: 'tx_989', date: '25 Aug 2026', amount: '₹9,350', method: `UPI (${helperUpi})`, status: 'Settled' },
            ].map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-slate-900 dark:text-white block">{tx.amount}</span>
                  <span className="text-slate-500">{tx.method} • {tx.date}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 6. Tab: Helper Statistics */}
      {activeTab === 'stats' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6"
        >
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Helper Performance & Impact Analytics
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Real-time audit metrics verified across 42 senior citizen visits.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Patient Rating</span>
              <span className="text-2xl font-black text-amber-500">4.92 / 5.0</span>
              <span className="text-[11px] text-slate-500 mt-1 block">128 family reviews</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">On-Time Arrival</span>
              <span className="text-2xl font-black text-emerald-600">98.4%</span>
              <span className="text-[11px] text-slate-500 mt-1 block">GPS verified punctuality</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Hours Logged</span>
              <span className="text-2xl font-black text-teal-600">146 hrs</span>
              <span className="text-[11px] text-slate-500 mt-1 block">This month</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">SOS Responses</span>
              <span className="text-2xl font-black text-purple-600">3 Priority</span>
              <span className="text-[11px] text-slate-500 mt-1 block">&lt; 8 min dispatch time</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 7. Tab: Proxy Site (Field Proxy Errands & Delegated Delivery Console) */}
      {activeTab === 'proxy' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Proxy Site Hero Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white border-2 border-amber-500/40 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 flex-shrink-0">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Kin Care Field Proxy Site
                    </span>
                    <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                      Proxy Agent Active
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Delegated Errands & Delivery Fulfillment Console
                  </h3>
                  <p className="text-xs text-amber-100 font-medium mt-0.5">
                    Authorized on-behalf surrogate for Senior Ramesh Sharma (Family Code: KIN-9241)
                  </p>
                </div>
              </div>

              <div className="bg-amber-950/80 border border-amber-500/40 rounded-2xl px-4 py-3 text-right">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Proxy Commission</span>
                <span className="text-xl font-black text-white">₹180 / delivery</span>
              </div>
            </div>
          </div>

          {/* Active Delegated Proxy Orders */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  <span>Delegated Pharmacy & Grocery Deliveries</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick up ordered medicines and fresh rations directly from verified vendors and deliver safely to senior doorsteps.
                </p>
              </div>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
                2 Active Tasks
              </span>
            </div>

            <div className="space-y-4">
              {/* Task 1: Medicine Pickup */}
              <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/80 border-2 border-amber-200 dark:border-amber-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                      Medical Proxy
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      Order #MED-8842 • Dolo 650 & BP Prescriptions
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Pickup Store: <strong className="text-slate-900 dark:text-white">Apollo Pharmacy (Ring Road, South Ext 1)</strong>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Deliver to: <strong className="text-slate-900 dark:text-white">Ramesh Sharma, Flat 402, Green Park Enclave</strong>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <Clock className="h-3 w-3 text-amber-600" />
                    <span>ETA: 15 mins • Customer Contact: +91 98101 23456</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Marked Picked Up from Apollo Pharmacy. In transit to senior residence.')}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    Confirm Store Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Delivery verified with Ramesh Sharma. Handover completed.')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    Complete Handover
                  </button>
                </div>
              </div>

              {/* Task 2: Fresh Groceries */}
              <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-slate-800/80 border-2 border-emerald-200 dark:border-emerald-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Grocery Proxy
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      Order #GRO-9104 • Fresh Greens, Apples & Low-Fat Milk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Vendor: <strong className="text-slate-900 dark:text-white">Safal Organic Hub (Booth #14)</strong>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Deliver to: <strong className="text-slate-900 dark:text-white">Ramesh Sharma, Flat 402, Green Park Enclave</strong>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    <span>ETA: 25 mins • Paid Online by Family Guardian</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Marked Picked Up from Safal Booth. In transit to senior residence.')}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    Confirm Store Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Delivery verified with Ramesh Sharma. Handover completed.')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    Complete Handover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 7. Tab: Caregiver Own Login Profile */}
      {activeTab === 'profile' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {profileSaveSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{profileSaveSuccess}</span>
            </motion.div>
          )}

          {/* Profile Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                {helperAvatar ? (
                  <img 
                    src={helperAvatar} 
                    alt={helperName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-teal-800 text-white font-black text-3xl flex items-center justify-center border-2 border-teal-500 shadow-md">
                    {helperName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 p-1 bg-teal-600 text-white rounded-full shadow">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {helperName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-black uppercase border border-teal-300 dark:border-teal-800">
                    {user?.role === 'helper' || user?.role === 'helper_proxy' ? 'Caregiver Partner' : 'Verified Partner'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span>Badge ID: #{helperBadge}</span>
                  <span>•</span>
                  <span>{helperRole}</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    ★ 4.96 Rating (142 Patient Reviews)
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Police Background Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  logout();
                  openAuthModal('login');
                }}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <span>Caregiver Account Details</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your personal information, nursing qualifications, and instant payout UPI handle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Sister Sunita Devi"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Clinical Role / Specialization
                </label>
                <input
                  type="text"
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  placeholder="e.g. ICU & Geriatric RN / Bedside Attendant"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98711 00213"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Operational City / Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="e.g. Delhi NCR Hub, Sector 44 Noida"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Instant Payout UPI ID
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={editUpi}
                    onChange={(e) => setEditUpi(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Daily earnings and tips are automatically deposited to this UPI handle.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Profile Photo URL (Optional)
                </label>
                <div className="relative">
                  <Camera className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://... (direct image link)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Leave empty to use automatic initials avatar badge.
                </span>
              </div>
            </div>

            {/* Verification status strip */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <div>
                  <span className="font-black text-slate-900 dark:text-white block">
                    Police Verification Certificate #POL-DL-88219
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Aadhaar biometric validated & cleared on 12 Jan 2026 • Valid through 2027
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold self-start sm:self-auto">
                Audited & Approved
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

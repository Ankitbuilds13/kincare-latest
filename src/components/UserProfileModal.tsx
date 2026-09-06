import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  LogOut, 
  Heart, 
  Calendar, 
  Save, 
  CheckCircle2, 
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookings: () => void;
  bookingsCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenBookings,
  bookingsCount,
}) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContactPhone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      address,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="userProfileTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 relative transition-colors">
        
        {/* Action buttons (Open in new tab & Close) */}
        <div className="absolute top-5 right-5 flex items-center gap-1">
          <a
            href="?view=profile"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Open profile in a new tab"
            title="Open profile in a new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close profile modal"
            id="closeUserProfileBtn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card Header */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="userProfileTitle" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h3>
              <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                {user.role === 'family' || user.role === 'family_caregiver' ? 'Family' : user.role === 'helper' ? 'Helper' : 'Senior'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              {user.email}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile details updated securely!</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Default Home Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment, Street, Locality"
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh (Father)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91 98111 22334"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                id="saveProfileBtn"
                className="flex-1 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  Phone Number
                </span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  {user.phone || 'Not set'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  Home Visits Booked
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBookings();
                  }}
                  className="font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  {bookingsCount} Active / Past Visits
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                Saved Address
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                {user.address || 'B-402, Green Park Avenue, South Delhi'}
              </span>
            </div>

            {/* Emergency Contact */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-black text-xs mb-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Primary Emergency Contact</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold">
                {user.emergencyContactName || 'Dr. Ramesh Sharma (Father)'}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                {user.emergencyContactPhone || '+91 98111 22334'}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setName(user.name);
                  setPhone(user.phone);
                  setEmergencyName(user.emergencyContactName || '');
                  setEmergencyPhone(user.emergencyContactPhone || '');
                  setAddress(user.address || '');
                  setIsEditing(true);
                }}
                id="editProfileDetailsBtn"
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition text-center cursor-pointer border border-slate-300 dark:border-slate-700"
              >
                Edit Account Details
              </button>

              <button
                type="button"
                onClick={handleLogout}
                id="logoutBtn"
                className="py-2.5 px-5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-red-200 dark:border-red-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

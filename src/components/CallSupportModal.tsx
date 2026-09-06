import React, { useState } from 'react';
import { Phone, PhoneCall, CheckCircle, Clock, X, HeartHandshake, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CallSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

export const CallSupportModal: React.FC<CallSupportModalProps> = ({
  isOpen,
  onClose,
  serviceTitle
}) => {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [seniorName, setSeniorName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setPhoneNumber('');
    setSeniorName('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="callSupportHeading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 md:p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 relative transition-colors">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close dialog"
          id="closeCallSupportBtn"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
            <HeartHandshake className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-teal-700 dark:text-teal-300 tracking-wider">Compassionate Phone Concierge</span>
            <h3 id="callSupportHeading" className="text-2xl font-black text-slate-900 dark:text-white">{t.preferPhoneBooking}</h3>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">We're Calling You Right Now!</h4>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Our care supervisor is dialing <strong className="text-slate-900 dark:text-white">{phoneNumber}</strong>. We'll handle all the details, answer your questions, and assign a trusted nurse or attendant.
            </p>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>Average wait time: Under 90 seconds</span>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 w-full bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white font-bold py-3.5 rounded-xl transition cursor-pointer"
            >
              Back to Services
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              {t.phoneBookingDesc}
            </p>

            {/* Direct Call Button */}
            <div className="bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block">{t.tollFreeCallSupport} (24x7)</span>
                <span className="text-xl md:text-2xl font-black text-teal-900 dark:text-teal-100">1800-123-4567</span>
              </div>
              <a
                href="tel:18001234567"
                className="bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 dark:hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow transition cursor-pointer"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">Or request a quick callback</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Callback form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.patientNameAge} / Caregiver Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={seniorName}
                    onChange={(e) => setSeniorName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma / Ananya"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.contactPhone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneCall className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {serviceTitle && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Regarding service: <strong className="text-slate-800 dark:text-slate-200">{serviceTitle}</strong>
                </div>
              )}

              <button
                type="submit"
                id="requestCallbackSubmitBtn"
                className="w-full bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 dark:hover:bg-teal-500 text-white font-black py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-base mt-2 cursor-pointer"
              >
                <PhoneCall className="h-5 w-5" /> {t.requestCallback}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

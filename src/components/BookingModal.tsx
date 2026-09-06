import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { CareService, Booking } from '../types';
import { CAREGIVER_POOL } from '../data/servicesData';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  service: CareService | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
  currentCity: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  service,
  isOpen,
  onClose,
  onBookingSuccess,
  currentCity
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [selectedSlot, setSelectedSlot] = useState('Morning (08:00 AM - 11:00 AM)');
  const [visitDate, setVisitDate] = useState('Tomorrow');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [seniorConcession, setSeniorConcession] = useState(true);
  
  // Pre-fill user profile if logged in
  React.useEffect(() => {
    if (isOpen && user) {
      if (!patientName) setPatientName(user.name);
      if (!phone) setPhone(user.phone);
      if (!address && user.address) setAddress(user.address);
    }
  }, [isOpen, user]);

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen || !service) return null;

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone || !address) return;

    // Pick a matching caregiver from pool
    const assignedCaregiver = CAREGIVER_POOL[Math.floor(Math.random() * CAREGIVER_POOL.length)];
    const bookingId = `SC-${Math.floor(1000 + Math.random() * 9000)}`;

    const baseAmount = service.basePrice;
    const discount = seniorConcession ? Math.round(baseAmount * 0.2) : 0;
    const finalAmount = Math.max(baseAmount - discount, 5);

    const newBooking: Booking = {
      id: bookingId,
      serviceId: service.id,
      serviceTitle: service.title,
      patientName: `${patientName} (${patientAge ? `${patientAge} yrs` : 'Senior'})`,
      patientAge: Number(patientAge) || 72,
      timeSlot: selectedSlot,
      visitDate: visitDate,
      address: `${address}, ${currentCity}`,
      phone: phone,
      notes: notes,
      status: 'assigned',
      caregiverName: assignedCaregiver.name,
      caregiverRole: assignedCaregiver.role,
      caregiverPhone: assignedCaregiver.phone,
      caregiverRating: assignedCaregiver.rating,
      amount: finalAmount,
      discountApplied: discount,
      createdAt: 'Just now'
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setPatientName('');
    setPatientAge('');
    setAddress('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalServiceTitle"
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition z-10 cursor-pointer"
          aria-label="Close modal"
          id="closeBookingModalBtn"
        >
          <X className="h-7 w-7" />
        </button>

        {confirmedBooking ? (
          /* Success Screen with Assigned Caregiver Details */
          <div className="space-y-6 pt-2">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div className="text-center">
              <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-300 tracking-wider bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {t.bookingRef} #{confirmedBooking.id}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-2">
                {t.carePartnerAssigned}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
                Your visit for <strong className="text-slate-900 dark:text-white">{confirmedBooking.serviceTitle}</strong> has been secured for {confirmedBooking.visitDate}.
              </p>
            </div>

            {/* Caregiver Profile Card */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.assignedStaff}</span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" /> {t.policeVerified}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-700 dark:bg-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {confirmedBooking.caregiverName.split(' ')[1]?.[0] || 'S'}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                    {confirmedBooking.caregiverName}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {confirmedBooking.caregiverRole}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {confirmedBooking.caregiverRating} {t.ratings}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{t.seniorVisitsCount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span><strong>Time:</strong> {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span className="truncate"><strong>At:</strong> {confirmedBooking.address}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`tel:${confirmedBooking.caregiverPhone}`}
                  className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-teal-600 dark:text-teal-400" /> {t.callStaff}
                </a>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl p-3.5 text-xs text-teal-950 dark:text-teal-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-teal-800 dark:text-teal-300">
                <Heart className="h-4 w-4 text-teal-600 dark:text-teal-400" /> What happens next?
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Our care supervisor will place a brief courtesy call to confirm patient requirements. You can track this visit anytime in "My Bookings".
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black py-4 rounded-2xl shadow-xl transition text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              {t.doneAndBrowse} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-6 pr-8">
              <span className="text-xs md:text-sm font-black text-teal-700 dark:text-teal-300 uppercase tracking-wider bg-teal-50 dark:bg-teal-950/80 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                {t.fastCareBooking}
              </span>
              <h3 id="modalServiceTitle" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-2">
                {service.title}
              </h3>
              <p id="modalServiceDesc" className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1.5 leading-relaxed">
                {service.fullDesc}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Patient Name & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base mb-1.5">
                    {t.patientNameAge} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Margaret Wilson"
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base mb-1.5">
                    {t.age} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={40}
                    max={120}
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 74"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-base font-bold text-center text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* 2. Visit Date & Slot */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base mb-1.5">
                  {t.visitSlot}
                </label>

                <div className="flex gap-2 mb-2">
                  {[
                    { key: 'Today Express', label: t.todayExpress },
                    { key: 'Tomorrow', label: t.tomorrow },
                    { key: 'Day After Tomorrow', label: t.dayAfter }
                  ].map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setVisitDate(d.key)}
                      className={`flex-1 py-2 px-2 text-xs md:text-sm font-bold rounded-xl border-2 transition cursor-pointer ${
                        visitDate === d.key 
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200' 
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {service.slotsAvailable.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center justify-between border-2 rounded-xl p-3 cursor-pointer transition ${
                        selectedSlot === slot 
                          ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/70 font-black text-teal-950 dark:text-teal-100' 
                          : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 font-bold text-slate-700 dark:text-slate-300 text-sm bg-white dark:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="slot"
                          checked={selectedSlot === slot}
                          onChange={() => handleSlotSelect(slot)}
                          className="h-4 w-4 text-teal-600 accent-teal-600"
                        />
                        <span className="text-sm md:text-base">{slot}</span>
                      </div>
                      <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Address */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base mb-1.5">
                  {t.homeAddress} ({currentCity}) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Apartment #, Street, Landmark, Door bell info"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-sm md:text-base font-medium resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* 4. Phone Number */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base mb-1.5">
                  {t.contactPhone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* 5. Medical Details / Notes */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base mb-1.5">
                  {t.medicalNotes}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Uses walker, diabetic, needs gentle needle"
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-teal-600 dark:focus:border-teal-400 outline-none text-xs md:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Senior Citizen Concession toggle */}
              <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="font-black text-amber-950 dark:text-amber-200 text-sm block">{t.seniorConcessionAuto}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{t.seniorConcessionDesc}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={seniorConcession}
                  onChange={(e) => setSeniorConcession(e.target.checked)}
                  className="h-5 w-5 text-amber-600 accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                id="submitBookingBtn"
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl transition text-lg mt-4 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <CheckCircle className="h-6 w-6 group-hover:scale-110 transition-transform" /> 
                {t.confirmBooking}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

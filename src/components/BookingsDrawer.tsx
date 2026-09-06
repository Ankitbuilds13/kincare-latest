import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Trash2 
} from 'lucide-react';
import { Booking } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
}

export const BookingsDrawer: React.FC<BookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookingsDrawerTitle"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="p-5 md:p-6 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <h3 id="bookingsDrawerTitle" className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              {t.careVisitsHeading} ({bookings.length})
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mt-0.5">
              {t.careVisitsSub}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            aria-label="Close care visits drawer"
            id="closeBookingsDrawerBtn"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t.noVisitsYet}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {t.noVisitsDesc}
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-850 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-2xl p-5 shadow-sm space-y-4 transition"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-black uppercase text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-md">
                      Ref: #{booking.id}
                    </span>
                    <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
                      {booking.serviceTitle}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">For {booking.patientName}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    {t.carePartnerAssigned}
                  </span>
                </div>

                {/* Caregiver mini block */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-700 dark:bg-teal-600 text-white font-black text-lg flex items-center justify-center">
                      {booking.caregiverName.split(' ')[1]?.[0] || 'C'}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-sm md:text-base flex items-center gap-1.5">
                        {booking.caregiverName}
                        <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{booking.caregiverRole}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{booking.caregiverRating}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${booking.caregiverPhone}`}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-teal-700 dark:text-teal-300 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-600 transition shadow-sm"
                    title="Call caregiver"
                    aria-label={`Call ${booking.caregiverName}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>

                {/* Time and location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span><strong>Slot:</strong> {booking.visitDate}, {booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span className="truncate"><strong>Address:</strong> {booking.address}</span>
                  </div>
                </div>

                {booking.notes && (
                  <div className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    <strong>Care notes:</strong> {booking.notes}
                  </div>
                )}

                {/* Footer action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{t.bookedAt} {booking.createdAt}</span>
                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> {t.cancelVisit}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t-2 border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Need urgent rescheduling? Call caregiver or reach toll-free line <strong className="text-teal-700 dark:text-teal-400">1800-123-4567</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

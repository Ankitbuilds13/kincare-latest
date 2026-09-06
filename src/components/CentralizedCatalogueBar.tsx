import React from 'react';
import { Pill, Apple, ShoppingBag, Truck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CentralizedCatalogueBarProps {
  activeCategory?: 'all' | 'medicine' | 'fruits_veggies' | 'grocery' | 'supplements';
  onSelectCategory: (category: 'all' | 'medicine' | 'fruits_veggies' | 'grocery') => void;
  onTrackDeliveries?: () => void;
  title?: string;
  subtitle?: string;
}

export const CentralizedCatalogueBar: React.FC<CentralizedCatalogueBarProps> = ({
  activeCategory,
  onSelectCategory,
  onTrackDeliveries,
  title = 'Doorstep Prescriptions & Daily Fresh Groceries',
  subtitle = 'Order certified pharmacy medicines and fresh farm essentials directly to your senior home.',
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="text-center max-w-2xl mx-auto mb-3.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-[11px] font-black uppercase tracking-wider mb-1.5">
          <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400" />
          <span>Centralized Care Courier Service</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Centered Action Buttons */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3">
        {/* Button 1: Prescription Medicines */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          id="btnCentralizedPrescriptions"
          onClick={() => onSelectCategory('medicine')}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition cursor-pointer shadow-xs border-2 ${
            activeCategory === 'medicine'
              ? 'bg-teal-700 dark:bg-teal-600 text-white border-teal-500 shadow-md ring-2 ring-teal-400/40'
              : 'bg-teal-50 dark:bg-slate-800 text-teal-950 dark:text-teal-200 border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-750'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
            <Pill className="h-4 w-4 text-teal-700 dark:text-teal-300" />
          </div>
          <div className="text-left">
            <span className="block leading-tight">Prescription Medicines</span>
            <span className="text-[10px] font-bold opacity-80 block">Dolo 650, BP & Sugar Pills</span>
          </div>
        </motion.button>

        {/* Button 2: Fresh Tender Fruits & Veggies */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          id="btnCentralizedFreshGroceries"
          onClick={() => onSelectCategory('fruits_veggies')}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition cursor-pointer shadow-xs border-2 ${
            activeCategory === 'fruits_veggies'
              ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
              : 'bg-emerald-50 dark:bg-slate-800 text-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-750'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Apple className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
          </div>
          <div className="text-left">
            <span className="block leading-tight">Fresh Tender Fruits</span>
            <span className="text-[10px] font-bold opacity-80 block">Tender Coconut, Papaya, Apples</span>
          </div>
        </motion.button>

        {/* Button 3: Daily Fresh Groceries & Milk */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          id="btnCentralizedDailyGroceries"
          onClick={() => onSelectCategory('grocery')}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition cursor-pointer shadow-xs border-2 ${
            activeCategory === 'grocery'
              ? 'bg-amber-700 dark:bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
              : 'bg-amber-50 dark:bg-slate-800 text-amber-950 dark:text-amber-200 border-amber-200 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-750'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="h-4 w-4 text-amber-700 dark:text-amber-300" />
          </div>
          <div className="text-left">
            <span className="block leading-tight">Daily Fresh Groceries</span>
            <span className="text-[10px] font-bold opacity-80 block">Amul Milk, Oats, Honey</span>
          </div>
        </motion.button>

        {/* Button 4: Track Active Deliveries */}
        {onTrackDeliveries && (
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            id="btnCentralizedTrackDeliveries"
            onClick={onTrackDeliveries}
            className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition cursor-pointer shadow-xs border-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-500/20 flex items-center justify-center flex-shrink-0">
              <Truck className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="text-left">
              <span className="block leading-tight">Track Delivery</span>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block">Sister Sunita En-Route</span>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};

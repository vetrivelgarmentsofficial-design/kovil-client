import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, ListOrdered, Plus, Scale, CalendarDays } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.4rem)] flex items-center justify-around no-print">
      {/* Dashboard */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all btn-tap ${
            isActive
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t('navDashboard')}</span>
      </NavLink>

      {/* Entries */}
      <NavLink
        to="/entries"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all btn-tap ${
            isActive
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`
        }
      >
        <ListOrdered className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t('navEntries')}</span>
      </NavLink>

      {/* Center Floating Add Button */}
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `relative -top-4.5 flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-lg shadow-emerald-700/40 border-4 border-white transition-all btn-tap ${
            isActive ? 'ring-2 ring-emerald-500 scale-105' : 'hover:scale-105'
          }`
        }
        aria-label={t('addEntryTitle')}
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </NavLink>

      {/* Reconciliation */}
      <NavLink
        to="/reconciliation"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all btn-tap ${
            isActive
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`
        }
      >
        <Scale className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t('navReconciliation')}</span>
      </NavLink>

      {/* Functions */}
      <NavLink
        to="/functions"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all btn-tap ${
            isActive
              ? 'text-emerald-700 font-black scale-105'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`
        }
      >
        <CalendarDays className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">{t('navFunctions')}</span>
      </NavLink>
    </nav>
  );
};

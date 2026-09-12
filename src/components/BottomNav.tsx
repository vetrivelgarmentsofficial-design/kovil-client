import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, ListOrdered, PlusCircle, Scale, CalendarDays } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around no-print">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>{t('navDashboard')}</span>
      </NavLink>

      <NavLink
        to="/entries"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <ListOrdered className="w-5 h-5 mb-0.5" />
        <span>{t('navEntries')}</span>
      </NavLink>

      {/* Prominent Quick Add Button */}
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center -mt-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-13 h-13 p-2.5 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95 border-4 border-white ${
            isActive ? 'ring-2 ring-emerald-500' : ''
          }`
        }
      >
        <PlusCircle className="w-6 h-6" />
      </NavLink>

      <NavLink
        to="/reconciliation"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Scale className="w-5 h-5 mb-0.5" />
        <span>{t('navReconciliation')}</span>
      </NavLink>

      <NavLink
        to="/functions"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <CalendarDays className="w-5 h-5 mb-0.5" />
        <span>{t('navFunctions')}</span>
      </NavLink>
    </nav>
  );
};

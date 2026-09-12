import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, ListOrdered, PlusCircle, Scale, CalendarDays, Printer } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  const links = [
    { to: '/', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/add', label: t('addEntryTitle'), icon: PlusCircle, isHighlight: true },
    { to: '/entries', label: t('navEntries'), icon: ListOrdered },
    { to: '/reconciliation', label: t('navReconciliation'), icon: Scale },
    { to: '/print', label: t('navPrint'), icon: Printer },
    { to: '/functions', label: t('navFunctions'), icon: CalendarDays },
  ];

  return (
    <aside className="hidden sm:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-61px)] p-4 space-y-2 no-print">
      <div className="space-y-1">
        {links.map(({ to, label, icon: Icon, isHighlight }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isHighlight
                  ? isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : isActive
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

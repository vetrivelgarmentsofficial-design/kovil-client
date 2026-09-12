import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFunction } from '../context/FunctionContext';
import { Calendar, Languages, BookOpen, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { activeFunction } = useFunction();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
        {/* App Title & Active Function Info */}
        <div className="flex items-center space-x-2.5">
          <Link to="/" className="flex items-center space-x-2.5 btn-tap">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  {t('appName')}
                </h1>
                <span className="hidden xs:inline-block px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wide">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                {t('appSubtitle')}
              </p>
            </div>
          </Link>
        </div>

        {/* Function selector pill & Language Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          <Link
            to="/functions"
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-all btn-tap max-w-[140px] sm:max-w-xs truncate ${
              location.pathname === '/functions'
                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700'
            }`}
            title={activeFunction ? `${activeFunction.name} (${activeFunction.year})` : t('selectFunction')}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {activeFunction ? `${activeFunction.name} ${activeFunction.year}` : t('selectFunction')}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          </Link>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 active:bg-emerald-200 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-all shadow-2xs btn-tap"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

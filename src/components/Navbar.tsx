import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFunction } from '../context/FunctionContext';
import { Calendar, Languages, BookOpen, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { activeFunction } = useFunction();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Title & Active Function Info */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                {t('appName')}
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t('appSubtitle')}
              </p>
            </div>
          </Link>
        </div>

        {/* Function selector pill & Language Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            to="/functions"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200/80 transition-all max-w-[160px] sm:max-w-xs truncate"
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
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200 transition-colors shadow-sm"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

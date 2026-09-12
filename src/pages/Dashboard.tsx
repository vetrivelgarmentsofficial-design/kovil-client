import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFunction } from '../context/FunctionContext';
import { useSummary, useTransactions } from '../hooks/useKanakku';
import { formatCurrency, formatShortDate, getCategoryLabel } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  PlusCircle,
  ArrowRight,
  Sparkles,
  CalendarDays,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { activeFunction, functions, isLoading: isFunctionLoading } = useFunction();
  const { data: summary, isLoading: isSummaryLoading } = useSummary();
  const { data: recentTransactions = [], isLoading: isTransactionsLoading } = useTransactions({
    limit: 6,
  });

  if (isFunctionLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!activeFunction && functions.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title={t('noFunctionsMessage')}
        description={t('appSubtitle')}
        actionText={t('createFirstFunction')}
        onAction={() => navigate('/functions')}
      />
    );
  }

  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const balance = summary?.balance || 0;
  const isBalanceNegative = balance < 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Function Header Banner */}
      {activeFunction && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {activeFunction.year}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {activeFunction.name}
              </h2>
            </div>
            {activeFunction.description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {activeFunction.description}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/reconciliation')}
            className="self-start sm:self-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>{t('navReconciliation')}</span>
          </button>
        </div>
      )}

      {/* 3 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Varavu (Income) */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-700/20 border border-emerald-400/30 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between opacity-90 mb-2">
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
              {t('totalIncome')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            {isSummaryLoading ? '...' : formatCurrency(totalIncome)}
          </div>
          <div className="text-[11px] text-emerald-100 mt-2 font-medium">
            {summary?.incomeCount || 0} {t('entriesCount')}
          </div>
        </div>

        {/* Total Selavu (Expense) */}
        <div className="bg-gradient-to-br from-rose-500 to-red-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-red-700/20 border border-rose-400/30 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between opacity-90 mb-2">
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
              {t('totalExpense')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            {isSummaryLoading ? '...' : formatCurrency(totalExpense)}
          </div>
          <div className="text-[11px] text-rose-100 mt-2 font-medium">
            {summary?.expenseCount || 0} {t('entriesCount')}
          </div>
        </div>

        {/* Balance (Meethi) */}
        <div
          className={`rounded-2xl p-4 sm:p-5 shadow-lg border flex flex-col justify-between relative overflow-hidden text-white ${
            isBalanceNegative
              ? 'bg-gradient-to-br from-amber-600 to-red-800 shadow-amber-800/20 border-amber-500/30'
              : 'bg-gradient-to-br from-slate-800 to-slate-950 shadow-slate-900/20 border-slate-700/30'
          }`}
        >
          <div className="flex items-center justify-between opacity-90 mb-2">
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
              {isBalanceNegative ? t('deficit') : t('balance')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            {isSummaryLoading ? '...' : formatCurrency(balance)}
          </div>
          <div className="text-[11px] text-slate-300 mt-2 font-medium flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{isBalanceNegative ? 'செலவு அதிகம்' : 'நிகர இருப்பு'}</span>
          </div>
        </div>
      </div>

      {/* Two Prominent Action Buttons: 🟢 + வரவு & 🔴 + செலவு */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
        <button
          onClick={() => navigate('/add?type=income')}
          className="flex items-center justify-center space-x-2 py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-black text-base sm:text-lg shadow-md shadow-emerald-600/25 transition-all"
        >
          <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{t('btnVaravu')}</span>
        </button>

        <button
          onClick={() => navigate('/add?type=expense')}
          className="flex items-center justify-center space-x-2 py-4 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-2xl font-black text-base sm:text-lg shadow-md shadow-red-600/25 transition-all"
        >
          <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{t('btnSelavu')}</span>
        </button>
      </div>

      {/* Recent Entries Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <span>{t('recentEntries')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {summary?.totalCount || 0}
            </span>
          </h3>

          <button
            onClick={() => navigate('/entries')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{t('viewAllEntries')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isTransactionsLoading ? (
          <div className="py-6 text-center text-sm text-slate-400">Loading...</div>
        ) : recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-slate-500 space-y-2">
            <p className="text-sm font-medium">{t('noRecentEntries')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((item) => {
              const isIncome = item.type === 'income';
              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/entries?id=${item._id}`)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                        isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 font-medium">
                        <span className="font-semibold text-slate-600">
                          {getCategoryLabel(item.category, language)}
                        </span>
                        <span>•</span>
                        <span>{formatShortDate(item.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black text-sm sm:text-base ${
                        isIncome ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

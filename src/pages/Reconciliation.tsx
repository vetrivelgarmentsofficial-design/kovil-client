import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFunction } from '../context/FunctionContext';
import { useSummary, useTransactions } from '../hooks/useKanakku';
import {
  formatCurrency,
  getCategoryLabel,
} from '../utils/formatters';
import {
  Scale,
  Printer,
  TrendingUp,
  TrendingDown,
  Layers,
  Users,
  ListFilter,
  Share2,
} from 'lucide-react';

export const Reconciliation: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { activeFunction } = useFunction();
  const { data: summary, isLoading: isSummaryLoading } = useSummary();
  const { data: allTransactions = [] } = useTransactions();

  const [viewMode, setViewMode] = useState<'category' | 'person' | 'itemized'>('category');

  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const balance = summary?.balance || 0;
  const isBalanceNegative = balance < 0;

  // Group itemized transactions by category for each type
  const incomeTransactions = allTransactions.filter((tx) => tx.type === 'income');
  const expenseTransactions = allTransactions.filter((tx) => tx.type === 'expense');

  const groupByCategory = (txList: typeof allTransactions) => {
    const map: Record<string, typeof allTransactions> = {};
    txList.forEach((tx) => {
      const cat = tx.category || 'மற்றவை';
      if (!map[cat]) map[cat] = [];
      map[cat].push(tx);
    });
    return map;
  };

  const groupedIncome = groupByCategory(incomeTransactions);
  const groupedExpense = groupByCategory(expenseTransactions);

  const handleShare = async () => {
    if (navigator.share && activeFunction) {
      try {
        await navigator.share({
          title: `${activeFunction.name} (${activeFunction.year}) - கணக்கு அறிக்கை`,
          text: `மொத்த வரவு: ${formatCurrency(totalIncome)}\nமொத்த செலவு: ${formatCurrency(
            totalExpense
          )}\nமீதி: ${formatCurrency(balance)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled/failed:', err);
      }
    } else {
      navigate('/print');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header with Print & Share button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('reconciliationTitle')}
            </h2>
          </div>
          {activeFunction && (
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              {activeFunction.name} ({activeFunction.year})
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/print')}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{t('printAccount')}</span>
          </button>

          {typeof navigator.share === 'function' && (
            <button
              onClick={handleShare}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title={t('btnShare')}
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Top Calculation Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border-l-4 border-emerald-500 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">{t('totalIncome')}</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {isSummaryLoading ? '...' : formatCurrency(totalIncome)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            {summary?.incomeCount || 0} {t('entriesCount')}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border-l-4 border-red-500 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">{t('totalExpense')}</div>
          <div className="text-2xl font-black text-red-600 mt-1">
            {isSummaryLoading ? '...' : formatCurrency(totalExpense)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            {summary?.expenseCount || 0} {t('entriesCount')}
          </div>
        </div>

        <div
          className={`rounded-2xl p-4 border-l-4 border border-slate-200 shadow-sm bg-white ${
            isBalanceNegative ? 'border-l-red-600' : 'border-l-slate-800'
          }`}
        >
          <div className="text-xs font-bold text-slate-500 uppercase">
            {isBalanceNegative ? t('deficit') : t('balance')}
          </div>
          <div
            className={`text-2xl font-black mt-1 ${
              isBalanceNegative ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {isSummaryLoading ? '...' : formatCurrency(balance)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            {isBalanceNegative ? 'பற்றாக்குறை' : 'நிகர மீதி'}
          </div>
        </div>
      </div>

      {/* Grouping View Switcher */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1">
        <button
          onClick={() => setViewMode('category')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            viewMode === 'category'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('categoryGrouping')}</span>
        </button>

        <button
          onClick={() => setViewMode('itemized')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            viewMode === 'itemized'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>{language === 'ta' ? 'விவர பட்டியல்' : 'Itemized List'}</span>
        </button>

        <button
          onClick={() => setViewMode('person')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            viewMode === 'person'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('personGrouping')}</span>
        </button>
      </div>

      {/* VIEW 1: CATEGORY-WISE BREAKDOWN */}
      {viewMode === 'category' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* VARAVU Category Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="font-black text-emerald-800 text-base flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>🟢 {t('varavu')}</span>
              </h3>
              <span className="font-black text-emerald-700 text-base">
                {formatCurrency(totalIncome)}
              </span>
            </div>

            {summary?.incomeByCategory && summary.incomeByCategory.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {summary.incomeByCategory.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        {getCategoryLabel(item.category, language)}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {item.count} {t('entryCountSuffix')} ({item.percentage.toFixed(0)}%)
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-sm sm:text-base">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">இன்னும் வரவு இல்லை</p>
            )}
          </div>

          {/* SELAVU Category Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <h3 className="font-black text-red-800 text-base flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span>🔴 {t('selavu')}</span>
              </h3>
              <span className="font-black text-red-700 text-base">
                {formatCurrency(totalExpense)}
              </span>
            </div>

            {summary?.expenseByCategory && summary.expenseByCategory.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {summary.expenseByCategory.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        {getCategoryLabel(item.category, language)}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {item.count} {t('entryCountSuffix')} ({item.percentage.toFixed(0)}%)
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-sm sm:text-base">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">இன்னும் செலவு இல்லை</p>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ITEMIZED SEPARATE LISTS */}
      {viewMode === 'itemized' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* VARAVU Itemized */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-emerald-800 text-base">🟢 {t('varavu')}</h3>
              <span className="font-black text-emerald-700">{formatCurrency(totalIncome)}</span>
            </div>

            {Object.keys(groupedIncome).length > 0 ? (
              Object.entries(groupedIncome).map(([category, items]) => {
                const subtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
                return (
                  <div key={category} className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900 border-b border-emerald-200/50 pb-1">
                      <span>{getCategoryLabel(category, language)}</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="divide-y divide-emerald-100/50">
                      {items.map((it) => (
                        <div key={it._id} className="py-1.5 flex items-center justify-between text-xs">
                          <div className="font-medium text-slate-800">{it.name}</div>
                          <div className="font-bold text-emerald-700">{formatCurrency(it.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">இன்னும் வரவு இல்லை</p>
            )}
          </div>

          {/* SELAVU Itemized */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-red-800 text-base">🔴 {t('selavu')}</h3>
              <span className="font-black text-red-700">{formatCurrency(totalExpense)}</span>
            </div>

            {Object.keys(groupedExpense).length > 0 ? (
              Object.entries(groupedExpense).map(([category, items]) => {
                const subtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
                return (
                  <div key={category} className="bg-red-50/50 rounded-xl p-3 border border-red-100/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-red-900 border-b border-red-200/50 pb-1">
                      <span>{getCategoryLabel(category, language)}</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="divide-y divide-red-100/50">
                      {items.map((it) => (
                        <div key={it._id} className="py-1.5 flex items-center justify-between text-xs">
                          <div className="font-medium text-slate-800">{it.name}</div>
                          <div className="font-bold text-red-700">{formatCurrency(it.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">இன்னும் செலவு இல்லை</p>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: PERSON / DETAILS GROUPING */}
      {viewMode === 'person' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>{t('personGrouping')}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              ஒரே நபர் பலமுறை வழங்கிய நன்கொடைகள் தானாக ஒருங்கிணைக்கப்பட்டுள்ளன.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summary?.incomeByPerson && summary.incomeByPerson.length > 0 ? (
              summary.incomeByPerson.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm sm:text-base">{p.name}</div>
                    <div className="text-xs text-slate-500 font-medium flex items-center space-x-1.5 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                        {p.count} {t('entryCountSuffix')}
                      </span>
                      <span>•</span>
                      <span>{p.categories.map((c) => getCategoryLabel(c, language)).join(', ')}</span>
                    </div>
                  </div>
                  <div className="font-black text-emerald-600 text-sm sm:text-base">
                    {formatCurrency(p.total)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center col-span-2">இன்னும் பதிவுகள் இல்லை</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

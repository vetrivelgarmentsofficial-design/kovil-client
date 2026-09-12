import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFunction } from '../context/FunctionContext';
import { useTransactions, useSummary } from '../hooks/useKanakku';
import {
  formatCurrency,
  formatDateDisplay,
  getCategoryLabel,
  getTodayDateString,
} from '../utils/formatters';
import { Printer, ArrowLeft, Share2, Check } from 'lucide-react';

export const PrintView: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { activeFunction } = useFunction();
  const { data: summary } = useSummary();
  const { data: allTransactions = [] } = useTransactions();

  const [printOption, setPrintOption] = useState<'full' | 'income' | 'expense' | 'summary'>('full');

  const incomeList = allTransactions.filter((tx) => tx.type === 'income');
  const expenseList = allTransactions.filter((tx) => tx.type === 'expense');

  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const balance = summary?.balance || 0;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && activeFunction) {
      try {
        await navigator.share({
          title: `${activeFunction.name} (${activeFunction.year})`,
          text: `வரவு: ${formatCurrency(totalIncome)} | செலவு: ${formatCurrency(
            totalExpense
          )} | மீதி: ${formatCurrency(balance)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled/failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Print Controls (Hidden on Print) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'ta' ? 'பின்செல்ல' : 'Back'}</span>
          </button>

          <div className="flex items-center space-x-2">
            {typeof navigator.share === 'function' && (
              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center space-x-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('btnShare')}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{t('btnPrint')}</span>
            </button>
          </div>
        </div>

        {/* Options Radio Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t('printOptionsTitle')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'full', label: t('printFullAccount') },
              { id: 'income', label: t('printIncomeOnly') },
              { id: 'expense', label: t('printExpenseOnly') },
              { id: 'summary', label: t('printSummary') },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPrintOption(opt.id as any)}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 border transition-all ${
                  printOption === opt.id
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-black shadow-sm ring-1 ring-emerald-500'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {printOption === opt.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRINT PREVIEW PAPER CONTAINER */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-900 print:p-0 print:border-0 print:shadow-none">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {activeFunction ? activeFunction.name : t('appName')}
          </h1>
          <p className="text-sm sm:text-base font-bold text-slate-700 mt-1">
            {activeFunction?.year} {language === 'ta' ? 'திருவிழா / விழா கணக்கு அறிக்கை' : 'Festival / Function Account Report'}
          </p>
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium mt-3 pt-2 border-t border-slate-200">
            <span>{t('printDate')}: {formatDateDisplay(getTodayDateString())}</span>
            <span>{activeFunction?.description || ''}</span>
          </div>
        </div>

        {/* SUMMARY OPTION VIEW */}
        {(printOption === 'summary' || printOption === 'full') && (
          <div className="mb-6 space-y-4">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
              {language === 'ta' ? 'கணக்கு சுருக்கம்' : 'Account Summary'}
            </h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                <div className="text-xs font-bold text-slate-600">{t('totalIncome')}</div>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {formatCurrency(totalIncome)}
                </div>
              </div>

              <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
                <div className="text-xs font-bold text-slate-600">{t('totalExpense')}</div>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {formatCurrency(totalExpense)}
                </div>
              </div>

              <div className="p-3 border-2 border-slate-900 rounded-lg bg-slate-100">
                <div className="text-xs font-black text-slate-900 uppercase">{t('balance')}</div>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {formatCurrency(balance)}
                </div>
              </div>
            </div>

            {/* Category breakdown tables for summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-slate-300 rounded-lg p-3">
                <div className="font-bold text-xs uppercase text-slate-700 mb-2 border-b pb-1">
                  {language === 'ta' ? 'வரவு வகை சுருக்கம்' : 'Income by Category'}
                </div>
                {summary?.incomeByCategory.map((c, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100">
                    <span>{getCategoryLabel(c.category, language)} ({c.count})</span>
                    <span className="font-bold">{formatCurrency(c.total)}</span>
                  </div>
                ))}
              </div>

              <div className="border border-slate-300 rounded-lg p-3">
                <div className="font-bold text-xs uppercase text-slate-700 mb-2 border-b pb-1">
                  {language === 'ta' ? 'செலவு வகை சுருக்கம்' : 'Expense by Category'}
                </div>
                {summary?.expenseByCategory.map((c, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100">
                    <span>{getCategoryLabel(c.category, language)} ({c.count})</span>
                    <span className="font-bold">{formatCurrency(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INCOME TABLE */}
        {(printOption === 'full' || printOption === 'income') && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1">
              <h2 className="text-base font-black text-slate-900 uppercase">
                {t('varavu')} (INCOME)
              </h2>
              <span className="text-sm font-bold text-slate-700">
                {t('total')}: {formatCurrency(totalIncome)}
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-12 text-center">#</th>
                  <th className="p-2 border-r border-slate-300 w-24">{t('date')}</th>
                  <th className="p-2 border-r border-slate-300">{t('detailsName')}</th>
                  <th className="p-2 border-r border-slate-300 w-32">{t('category')}</th>
                  <th className="p-2 text-right w-28">{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {incomeList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-slate-400">
                      பதிவுகள் இல்லை
                    </td>
                  </tr>
                ) : (
                  incomeList.map((tx, idx) => (
                    <tr key={tx._id} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300">{formatDateDisplay(tx.date)}</td>
                      <td className="p-2 border-r border-slate-300 font-semibold text-slate-900">
                        {tx.name}
                        {tx.note && <span className="text-slate-500 font-normal italic ml-1">({tx.note})</span>}
                      </td>
                      <td className="p-2 border-r border-slate-300">{getCategoryLabel(tx.category, language)}</td>
                      <td className="p-2 text-right font-bold text-slate-900">{formatCurrency(tx.amount)}</td>
                    </tr>
                  ))
                )}
                <tr className="bg-slate-100 font-black border-t-2 border-slate-800">
                  <td colSpan={4} className="p-2 text-right uppercase">{t('totalIncome')}</td>
                  <td className="p-2 text-right font-mono text-sm">{formatCurrency(totalIncome)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* EXPENSE TABLE */}
        {(printOption === 'full' || printOption === 'expense') && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1">
              <h2 className="text-base font-black text-slate-900 uppercase">
                {t('selavu')} (EXPENSE)
              </h2>
              <span className="text-sm font-bold text-slate-700">
                {t('total')}: {formatCurrency(totalExpense)}
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-12 text-center">#</th>
                  <th className="p-2 border-r border-slate-300 w-24">{t('date')}</th>
                  <th className="p-2 border-r border-slate-300">{t('detailsName')}</th>
                  <th className="p-2 border-r border-slate-300 w-32">{t('category')}</th>
                  <th className="p-2 text-right w-28">{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {expenseList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-slate-400">
                      பதிவுகள் இல்லை
                    </td>
                  </tr>
                ) : (
                  expenseList.map((tx, idx) => (
                    <tr key={tx._id} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300">{formatDateDisplay(tx.date)}</td>
                      <td className="p-2 border-r border-slate-300 font-semibold text-slate-900">
                        {tx.name}
                        {tx.note && <span className="text-slate-500 font-normal italic ml-1">({tx.note})</span>}
                      </td>
                      <td className="p-2 border-r border-slate-300">{getCategoryLabel(tx.category, language)}</td>
                      <td className="p-2 text-right font-bold text-slate-900">{formatCurrency(tx.amount)}</td>
                    </tr>
                  ))
                )}
                <tr className="bg-slate-100 font-black border-t-2 border-slate-800">
                  <td colSpan={4} className="p-2 text-right uppercase">{t('totalExpense')}</td>
                  <td className="p-2 text-right font-mono text-sm">{formatCurrency(totalExpense)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* NET BALANCE BANNER */}
        {printOption === 'full' && (
          <div className="mt-8 p-4 border-2 border-slate-900 bg-slate-50 rounded-xl flex items-center justify-between text-base sm:text-lg font-black">
            <span className="uppercase">{t('balance')} (NET BALANCE):</span>
            <span className="text-xl font-black">{formatCurrency(balance)}</span>
          </div>
        )}

        {/* Signature Area for Village Committee */}
        <div className="mt-12 pt-8 border-t border-dashed border-slate-400 grid grid-cols-3 gap-4 text-center text-xs font-bold text-slate-700">
          <div>
            <div className="h-10"></div>
            <div>தலைவர் (President)</div>
          </div>
          <div>
            <div className="h-10"></div>
            <div>செயலாளர் (Secretary)</div>
          </div>
          <div>
            <div className="h-10"></div>
            <div>பொருளாளர் (Treasurer)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

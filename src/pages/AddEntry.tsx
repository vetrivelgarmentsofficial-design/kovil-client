import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '../context/LanguageContext';
import { useFunction } from '../context/FunctionContext';
import { useCreateTransaction, useTransactions } from '../hooks/useKanakku';
import {
  VARAVU_CATEGORIES,
  SELAVU_CATEGORIES,
  getTodayDateString,
  formatCurrency,
  formatShortDate,
  getCategoryLabel,
} from '../utils/formatters';
import { CheckCircle2, Plus, Sparkles, ArrowRight, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AddEntry: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { activeFunction } = useFunction();
  const createMutation = useCreateTransaction();
  const { data: recentEntries = [] } = useTransactions({ limit: 5 });

  const [txType, setTxType] = useState<'income' | 'expense'>(() => {
    const qType = searchParams.get('type');
    return qType === 'expense' ? 'expense' : 'income';
  });

  const [lastSaved, setLastSaved] = useState<{
    name: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
  } | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Zod schema with localized errors
  const entrySchema = z.object({
    name: z.string().min(1, t('valNameReq')),
    amount: z.coerce.number().positive(t('valAmountPositive')),
    category: z.string().min(1, t('valCategoryReq')),
    date: z.string().min(1, t('valDateReq')),
    note: z.string().optional(),
  });

  type EntryFormValues = z.infer<typeof entrySchema>;

  const defaultCategoryForType = (type: 'income' | 'expense') =>
    type === 'income' ? 'நன்கொடை' : 'பொது செலவு';

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      name: '',
      amount: undefined as any,
      category: defaultCategoryForType(txType),
      date: getTodayDateString(),
      note: '',
    },
  });

  // Handle type toggle
  const handleTypeChange = (newType: 'income' | 'expense') => {
    setTxType(newType);
    setValue('category', defaultCategoryForType(newType));
  };

  useEffect(() => {
    const qType = searchParams.get('type');
    if (qType === 'expense' || qType === 'income') {
      handleTypeChange(qType);
    }
  }, [searchParams]);

  const onSubmit = async (data: EntryFormValues) => {
    try {
      const savedAmount = Number(data.amount);
      const savedName = data.name.trim();
      const savedCat = data.category;
      const currentType = txType;

      await createMutation.mutateAsync({
        type: currentType,
        name: savedName,
        amount: savedAmount,
        category: savedCat,
        date: data.date,
        note: data.note?.trim() || '',
      });

      // Show prominent on-page notification with transaction details
      setLastSaved({
        name: savedName,
        amount: savedAmount,
        type: currentType,
        category: savedCat,
      });

      // Auto clear banner after 6 seconds
      const timer = setTimeout(() => {
        setLastSaved(null);
      }, 6000);

      // Fast Reset: Keep type, date and default category, reset name/amount/note
      reset({
        name: '',
        amount: '' as any,
        category: defaultCategoryForType(txType),
        date: data.date, // keep the same date for batch entry convenience
        note: '',
      });

      // Refocus name input for rapid subsequent entry
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }

      return () => clearTimeout(timer);
    } catch (err: any) {
      console.error('Failed to create entry:', err);
    }
  };

  const categories = txType === 'income' ? VARAVU_CATEGORIES : SELAVU_CATEGORIES;

  return (
    <div className="space-y-4 max-w-xl mx-auto animate-fade-in">
      {/* Title & Batch Entry Tip */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {t('addEntryTitle')}
          </h2>
          <p className="text-xs text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{t('fastEntryTip')}</span>
          </p>
        </div>
      </div>

      {/* Prominent On-Page Saved Notification Card */}
      {lastSaved && (
        <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-950 p-4 rounded-2xl shadow-lg shadow-emerald-500/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30 font-black text-lg">
              ✓
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('savedSuccess')}</span>
              </div>
              <div className="text-base font-black text-slate-900 mt-0.5">
                {lastSaved.name} •{' '}
                <span className={lastSaved.type === 'income' ? 'text-emerald-700' : 'text-red-700'}>
                  ₹{new Intl.NumberFormat('en-IN').format(lastSaved.amount)}
                </span>{' '}
                <span className="text-xs font-semibold text-slate-500">
                  ({lastSaved.category})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLastSaved(null)}
            className="text-emerald-700 hover:text-emerald-900 font-black text-lg px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
            title={t('cancel')}
          >
            ✕
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-5"
      >
        {/* Large Type Toggle (🟢 வரவு vs 🔴 செலவு) */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {language === 'ta' ? 'பதிவு வகை' : 'Entry Type'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-3.5 px-4 rounded-xl font-black text-base flex items-center justify-center space-x-2 transition-all border-2 ${
                txType === 'income'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50 scale-[1.02]'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className="text-lg">🟢</span>
              <span>{t('varavu')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-3.5 px-4 rounded-xl font-black text-base flex items-center justify-center space-x-2 transition-all border-2 ${
                txType === 'expense'
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30 ring-2 ring-red-400/50 scale-[1.02]'
                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              }`}
            >
              <span className="text-lg">🔴</span>
              <span>{t('selavu')}</span>
            </button>
          </div>
        </div>

        {/* Details / Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('detailsName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={t('detailsPlaceholder')}
            autoFocus
            {...register('name')}
            ref={(e) => {
              register('name').ref(e);
              nameInputRef.current = e;
            }}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-semibold text-base outline-none transition-all placeholder:text-slate-400"
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1 font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('amount')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
              ₹
            </span>
            <input
              type="number"
              inputMode="numeric"
              step="any"
              placeholder="0"
              {...register('amount')}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-black text-xl outline-none transition-all"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-600 mt-1 font-semibold">{errors.amount.message}</p>
          )}
        </div>

        {/* Category Selection Dropdown & Quick Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('category')} <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-semibold text-base outline-none transition-all bg-white"
          >
            {categories.map((c) => (
              <option key={c.key} value={language === 'ta' ? c.ta : c.en}>
                {language === 'ta' ? c.ta : c.en}
              </option>
            ))}
          </select>

          {/* Category quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {categories.slice(0, 5).map((c) => {
              const label = language === 'ta' ? c.ta : c.en;
              return (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setValue('category', label)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.category && (
            <p className="text-xs text-red-600 mt-1 font-semibold">{errors.category.message}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('date')} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-semibold text-base outline-none transition-all bg-white"
          />
          {errors.date && (
            <p className="text-xs text-red-600 mt-1 font-semibold">{errors.date.message}</p>
          )}
        </div>

        {/* Note Input (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('note')}
          </label>
          <input
            type="text"
            placeholder={t('notePlaceholder')}
            {...register('note')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm outline-none transition-all"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={createMutation.isPending || !activeFunction}
          className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-lg transition-all active:scale-[0.99] flex items-center justify-center space-x-2 ${
            txType === 'income'
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
          } disabled:opacity-50`}
        >
          <Plus className="w-6 h-6" />
          <span>{createMutation.isPending ? t('saving') : t('save')}</span>
        </button>
      </form>

      {/* On-Page Recent Entries List */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <History className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ta' ? 'இப்போது சேர்க்கப்பட்ட பதிவுகள்' : 'Recently Saved Entries'}</span>
          </div>
          <Link
            to="/entries"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{t('viewAllEntries')}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            {t('noRecentEntries')}
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentEntries.slice(0, 5).map((item) => {
              const isIncome = item.type === 'income';
              return (
                <div key={item._id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                        isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <span className="text-slate-400 font-medium ml-2">
                        ({getCategoryLabel(item.category, language)} • {formatShortDate(item.date)})
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-black ${
                      isIncome ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

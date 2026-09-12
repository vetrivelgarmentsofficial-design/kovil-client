import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTransactions, useUpdateTransaction, useDeleteTransaction } from '../hooks/useKanakku';
import { TransactionItem } from '../types';
import {
  formatCurrency,
  formatDateDisplay,
  getCategoryLabel,
  VARAVU_CATEGORIES,
  SELAVU_CATEGORIES,
} from '../utils/formatters';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  Edit2,
  Trash2,
  Calendar,
  X,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TransactionList: React.FC = () => {
  const { t, language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Edit and Delete States
  const [editingItem, setEditingItem] = useState<TransactionItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const { data: transactions = [], isLoading } = useTransactions({
    type: filterType === 'all' ? undefined : filterType,
    category: categoryFilter || undefined,
    search: searchTerm || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      setDeletingId(null);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get('name') as string)?.trim();
    const amount = Number(formData.get('amount'));
    const category = (formData.get('category') as string)?.trim();
    const date = (formData.get('date') as string)?.trim();
    const note = (formData.get('note') as string)?.trim();
    const type = (formData.get('type') as 'income' | 'expense') || editingItem.type;

    if (!name || isNaN(amount) || amount <= 0 || !category || !date) {
      alert('Please fill in all required fields properly');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingItem._id,
        data: { name, amount, category, date, note, type },
      });
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update transaction:', err);
    }
  };

  const allCategoryOptions = [
    ...VARAVU_CATEGORIES.map((c) => ({ key: c.key, label: language === 'ta' ? c.ta : c.en })),
    ...SELAVU_CATEGORIES.map((c) => ({ key: c.key, label: language === 'ta' ? c.ta : c.en })),
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('navEntries')}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {transactions.length} {t('entriesCount')}
          </p>
        </div>

        <Link
          to="/add"
          className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all btn-tap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addEntryTitle')}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs space-y-3">
        {/* Type Toggle Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all btn-tap ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('filterAll')}
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all btn-tap ${
              filterType === 'income'
                ? 'bg-emerald-600 text-white shadow-xs font-black'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            🟢 {t('varavu')}
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all btn-tap ${
              filterType === 'expense'
                ? 'bg-red-600 text-white shadow-xs font-black'
                : 'text-red-700 hover:text-red-900'
            }`}
          >
            🔴 {t('selavu')}
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Advanced Filters (Category & Dates) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="">{t('allCategories')}</option>
            {allCategoryOptions.map((c, i) => (
              <option key={`${c.key}-${i}`} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            placeholder={t('fromDate')}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            placeholder={t('toDate')}
          />
        </div>
      </div>

      {/* Transaction List Cards */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-slate-400">Loading...</div>
      ) : transactions.length === 0 ? (
        <EmptyState
          title={t('noEntriesFound')}
          description={t('noRecentEntries')}
          actionText={t('btnVaravu')}
          onAction={() => window.location.assign('/add')}
        />
      ) : (
        <div className="space-y-2.5">
          {transactions.map((item) => {
            const isIncome = item.type === 'income';
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-base shadow-2xs ${
                      isIncome
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/80'
                        : 'bg-red-100 text-red-700 border border-red-200/80'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-base leading-snug">
                      {item.name}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {getCategoryLabel(item.category, language)}
                      </span>
                      <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateDisplay(item.date)}</span>
                      </span>
                      {item.note && (
                        <span className="text-slate-600 italic bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 text-[11px]">
                          {item.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div
                    className={`font-black text-lg sm:text-xl ${
                      isIncome ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors btn-tap"
                      title={t('edit')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item._id)}
                      className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 transition-colors btn-tap"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        title={t('confirmDeleteTitle')}
        message={t('confirmDeleteDesc')}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        isLoading={deleteMutation.isPending}
      />

      {/* Mobile-Friendly Edit Entry Bottom Sheet Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 pb-8 sm:pb-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-200">
            {/* Mobile Drag Indicator */}
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden -mt-1 mb-2"></div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-black text-slate-900">{t('editEntryTitle')}</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 btn-tap"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('detailsName')}
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem.name}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('amount')}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    step="any"
                    name="amount"
                    defaultValue={editingItem.amount}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-black text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'வகை (Type)' : 'Type'}
                  </label>
                  <select
                    name="type"
                    defaultValue={editingItem.type}
                    className="w-full px-3 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="income">🟢 {t('varavu')}</option>
                    <option value="expense">🔴 {t('selavu')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('category')}
                  </label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingItem.category}
                    required
                    className="w-full px-3 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('date')}
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingItem.date}
                    required
                    className="w-full px-3 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('note')}
                </label>
                <input
                  type="text"
                  name="note"
                  defaultValue={editingItem.note || ''}
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl btn-tap"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 sm:flex-initial px-5 py-3 sm:py-2.5 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 btn-tap"
                >
                  {updateMutation.isPending ? t('saving') : t('update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

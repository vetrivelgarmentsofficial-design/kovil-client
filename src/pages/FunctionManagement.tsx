import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFunction } from '../context/FunctionContext';
import { FunctionItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  CalendarDays,
  Plus,
  CheckCircle,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';

export const FunctionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    functions,
    activeFunctionId,
    setActiveFunctionId,
    createFunction,
    updateFunction,
    deleteFunction,
  } = useFunction();

  const [isCreating, setIsCreating] = useState(false);
  const [editingFunction, setEditingFunction] = useState<FunctionItem | null>(null);
  const [deletingFunctionId, setDeletingFunctionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get('name') as string)?.trim();
    const year = (formData.get('year') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const startDate = (formData.get('startDate') as string)?.trim();
    const endDate = (formData.get('endDate') as string)?.trim();

    if (!name || !year) return;

    try {
      setIsSubmitting(true);
      await createFunction({ name, year, description, startDate, endDate });
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create function:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFunction) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get('name') as string)?.trim();
    const year = (formData.get('year') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const startDate = (formData.get('startDate') as string)?.trim();
    const endDate = (formData.get('endDate') as string)?.trim();

    if (!name || !year) return;

    try {
      setIsSubmitting(true);
      await updateFunction(editingFunction._id, { name, year, description, startDate, endDate });
      setEditingFunction(null);
    } catch (err) {
      console.error('Failed to update function:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingFunctionId) return;
    try {
      setIsSubmitting(true);
      await deleteFunction(deletingFunctionId);
      setDeletingFunctionId(null);
    } catch (err) {
      console.error('Failed to delete function:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {t('myFunctions')}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {functions.length} {language === 'ta' ? 'நிகழ்ச்சிகள் உள்ளன' : 'functions created'}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newFunction')}</span>
        </button>
      </div>

      {/* Function Cards */}
      {functions.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <CalendarDays className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">{t('noFunctionsMessage')}</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-all"
          >
            {t('createFirstFunction')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {functions.map((func) => {
            const isActive = func._id === activeFunctionId;
            return (
              <div
                key={func._id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-600/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black">
                      {func.year}
                    </span>
                    <h3 className="font-black text-slate-900 text-base sm:text-lg">
                      {func.name}
                    </h3>
                    {isActive && (
                      <span className="flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>{t('active')}</span>
                      </span>
                    )}
                  </div>

                  {func.description && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">
                      {func.description}
                    </p>
                  )}

                  {/* Income / Expense Overview */}
                  <div className="flex items-center space-x-4 pt-1 text-xs">
                    <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{formatCurrency(func.totalIncome || 0)}</span>
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="flex items-center space-x-1 text-red-600 font-bold">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{formatCurrency(func.totalExpense || 0)}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {!isActive ? (
                    <button
                      onClick={() => {
                        setActiveFunctionId(func._id);
                        navigate('/');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <span>{t('select')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center space-x-1"
                    >
                      <span>{t('navDashboard')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setEditingFunction(func)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title={t('edit')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingFunctionId(func._id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE FUNCTION MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">{t('createFunctionTitle')}</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('functionName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t('functionNamePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('year')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  defaultValue={new Date().getFullYear()}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('startDate')}
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('endDate')}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('description')}
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder={t('descriptionPlaceholder')}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? t('saving') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FUNCTION MODAL */}
      {editingFunction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">{t('editFunctionTitle')}</h3>
              <button
                onClick={() => setEditingFunction(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('functionName')}
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingFunction.name}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('year')}
                </label>
                <input
                  type="text"
                  name="year"
                  defaultValue={editingFunction.year}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('startDate')}
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={editingFunction.startDate || ''}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('endDate')}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={editingFunction.endDate || ''}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('description')}
                </label>
                <input
                  type="text"
                  name="description"
                  defaultValue={editingFunction.description || ''}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingFunction(null)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? t('saving') : t('update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE FUNCTION CONFIRMATION */}
      <ConfirmModal
        isOpen={!!deletingFunctionId}
        title={t('confirmDeleteFunction')}
        message={t('confirmDeleteDesc')}
        onConfirm={handleDelete}
        onCancel={() => setDeletingFunctionId(null)}
        isLoading={isSubmitting}
      />
    </div>
  );
};

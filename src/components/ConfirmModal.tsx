import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-6 pb-8 sm:pb-6 shadow-2xl border border-slate-100 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden -mt-2 mb-2"></div>

        <div className="flex items-center space-x-3 text-red-600">
          <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-base font-black text-slate-900 leading-snug">{title}</h3>
        </div>

        {message && <p className="text-xs sm:text-sm text-slate-600 font-medium">{message}</p>}

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all btn-tap"
          >
            {cancelLabel || t('cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-initial px-5 py-3 sm:py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50 btn-tap"
          >
            {isLoading ? '...' : confirmLabel || t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

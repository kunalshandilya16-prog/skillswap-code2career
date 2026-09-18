import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10'
                : isError
                ? 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10'
                : 'bg-indigo-50/95 border-indigo-200 text-indigo-900 shadow-indigo-500/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-600" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="font-semibold text-sm leading-snug">{toast.title}</h4>
              )}
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              id={`close-toast-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors p-1 -mr-1 -mt-1 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

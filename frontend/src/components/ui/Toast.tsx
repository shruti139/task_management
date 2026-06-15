import React from 'react';
import type { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const borderColors: Record<ToastMessage['type'], string> = {
    success: 'border-l-emerald-500',
    error: 'border-l-rose-500',
    info: 'border-l-indigo-500',
  };

  const textColors: Record<ToastMessage['type'], string> = {
    success: 'text-emerald-500 dark:text-emerald-400',
    error: 'text-rose-500 dark:text-rose-400',
    info: 'text-indigo-500 dark:text-indigo-400',
  };

  const icons: Record<ToastMessage['type'], string> = {
    success: '✔',
    error: '❌',
    info: 'ℹ',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-xl p-4 flex items-center gap-3 min-w-[280px] animate-[slideInRight_0.25s_cubic-bezier(0.4,0,0.2,1)] border-l-4 ${borderColors[toast.type]}`}
    >
      <span className={`text-base font-semibold ${textColors[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
        {toast.message}
      </span>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;

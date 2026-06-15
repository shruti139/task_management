import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading task database...',
  fullscreen = false,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 ${fullscreen ? 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50' : ''}`}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      {message && (
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide uppercase text-[11px]">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

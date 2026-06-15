import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  error = false,
  className = '',
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border ${
        error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/5 focus:border-indigo-500 focus:ring-indigo-500/20'
      } rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 disabled:opacity-50 resize-y min-h-[120px] ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;

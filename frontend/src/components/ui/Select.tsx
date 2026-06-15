import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  children,
  error = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={`w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-black/20 border ${
          error ? 'border-rose-500' : 'border-slate-200 dark:border-white/5 focus:border-indigo-500 focus:ring-indigo-500/20'
        } rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 transition-all duration-200 cursor-pointer appearance-none ${className}`}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 pointer-events-none">▼</span>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

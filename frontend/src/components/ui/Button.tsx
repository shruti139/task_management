import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'danger-outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-semibold transition-all duration-200 flex items-center justify-center cursor-pointer select-none';
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-205 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
    'danger-outline': 'border border-rose-500/20 hover:border-rose-500 text-rose-500 dark:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed',
  }[variant];

  const sizeClasses = {
    xs: 'text-xs px-3 py-1.5 rounded-lg',
    sm: 'text-xs px-4 py-2 rounded-lg',
    md: 'text-sm px-5 py-2.5 rounded-xl',
    lg: 'text-base px-6 py-3 rounded-xl',
    icon: 'p-1.5 rounded-lg text-sm',
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

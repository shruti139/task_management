import React from 'react';

interface StatCardProps {
  value: number;
  label: string;
  icon: string;
  iconBgClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  iconBgClass,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${iconBgClass}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{value}</h3>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;

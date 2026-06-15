import React from 'react';
import type { Task } from '../../types';
import { StatCard } from './StatCard';

interface StatsPanelProps {
  tasks: Task[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ tasks }) => {
  const cardConfigs = [
    {
      value: tasks.length,
      label: "Total Tasks",
      icon: "📋",
      iconBgClass: "bg-indigo-500/10 text-indigo-505 dark:text-indigo-400 border border-indigo-500/20",
    },
    {
      value: tasks.filter((t) => t.status === 'TODO').length,
      label: "To Do",
      icon: "⭕",
      iconBgClass: "bg-amber-500/10 text-amber-505 dark:text-amber-400 border border-amber-500/20",
    },
    {
      value: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      label: "In Progress",
      icon: "⚡",
      iconBgClass: "bg-blue-500/10 text-blue-505 dark:text-blue-400 border border-blue-500/20",
    },
    {
      value: tasks.filter((t) => t.status === 'DONE').length,
      label: "Completed",
      icon: "✅",
      iconBgClass: "bg-emerald-500/10 text-emerald-505 dark:text-emerald-400 border border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cardConfigs.map((config, index) => (
        <StatCard
          key={index}
          value={config.value}
          label={config.label}
          icon={config.icon}
          iconBgClass={config.iconBgClass}
        />
      ))}
    </div>
  );
};

export default StatsPanel;

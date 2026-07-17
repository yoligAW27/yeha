import React from 'react';
import { FaBook, FaClock, FaFire, FaChartLine, FaHistory } from 'react-icons/fa';

const HistoryStats = ({ stats }) => {
  const statCards = [
    {
      icon: FaBook,
      label: 'Assessments',
      value: stats.totalAssessments || 0,
      color: 'indigo'
    },
    {
      icon: FaClock,
      label: 'Study Sessions',
      value: stats.totalSessions || 0,
      color: 'green'
    },
    {
      icon: FaFire,
      label: 'Study Streak',
      value: stats.studyStreak || 0,
      color: 'orange'
    },
    {
      icon: FaChartLine,
      label: 'Most Studied',
      value: stats.mostStudiedSubject || 'N/A',
      color: 'purple'
    },
    {
      icon: FaHistory,
      label: 'Last Activity',
      value: stats.lastActivity || 'No activity yet',
      color: 'blue'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const colorMap = {
          indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
          green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
          orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
          purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
          blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        };
        return (
          <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className={`${colorMap[card.color]} p-2 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center`}>
              <Icon className="text-lg" />
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryStats;
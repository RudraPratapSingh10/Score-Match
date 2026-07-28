import React from 'react';

export default function DashboardStats({
  stats = {
    squadRating: 88,
    squadChemistry: 94,
    winRate: 76,
    totalPlayers: 24,
    transfersAvailable: 3
  }
}) {
  const cards = [
    {
      title: 'Overall Rating',
      value: stats.squadRating,
      suffix: '/100',
      change: '+3 this month',
      isPositive: true,
      icon: '⭐',
      color: 'amber'
    },
    {
      title: 'Squad Chemistry',
      value: `${stats.squadChemistry}%`,
      change: 'Optimal Synergy',
      isPositive: true,
      icon: '⚡',
      color: 'emerald'
    },
    {
      title: 'Tactical Win Rate',
      value: `${stats.winRate}%`,
      change: '+5.2% vs last tactic',
      isPositive: true,
      icon: '🏆',
      color: 'cyan'
    },
    {
      title: 'Squad Size & Depth',
      value: `${stats.totalPlayers} Players`,
      change: `${stats.transfersAvailable} Transfer slots open`,
      isPositive: true,
      icon: '👥',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'cyan':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'indigo':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{card.title}</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base border ${getColorClasses(card.color)}`}>
              {card.icon}
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-100 font-mono tracking-tight">{card.value}</span>
            {card.suffix && <span className="text-xs text-slate-400 font-bold">{card.suffix}</span>}
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-emerald-400 font-bold">↑</span>
            <span className="text-slate-300 font-medium">{card.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
import React from 'react';

export default function ChemistryBreakdown({
  totalChemistry = 88,
  maxChemistry = 100,
  breakdown = [
    { label: 'League Links', value: 32, max: 35, icon: '🏆', color: 'emerald' },
    { label: 'Club Links', value: 24, max: 25, icon: '🛡️', color: 'cyan' },
    { label: 'Nation / Region Links', value: 20, max: 25, icon: '🌐', color: 'indigo' },
    { label: 'Preferred Positions', value: 12, max: 15, icon: '🎯', color: 'amber' }
  ]
}) {
  const getProgressColor = (color) => {
    switch (color) {
      case 'cyan': return 'bg-cyan-500 shadow-cyan-500/50';
      case 'indigo': return 'bg-indigo-500 shadow-indigo-500/50';
      case 'amber': return 'bg-amber-500 shadow-amber-500/50';
      default: return 'bg-emerald-500 shadow-emerald-500/50';
    }
  };

  const chemistryPercentage = Math.round((totalChemistry / maxChemistry) * 100);

  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      {/* Header with circular/total readout */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Chemistry Breakdown</h3>
          <p className="text-xs text-slate-400">Synergy factors across your squad</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-emerald-400 font-mono">{totalChemistry}</span>
          <span className="text-xs text-slate-400 font-bold">/ {maxChemistry}</span>
        </div>
      </div>

      {/* Breakdown Factors List */}
      <div className="space-y-3">
        {breakdown.map((item, idx) => {
          const itemPct = Math.round((item.value / item.max) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300 font-medium">
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-slate-400 font-mono font-semibold">
                  <strong className="text-slate-200">{item.value}</strong> / {item.max} pt
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(item.color)}`}
                  style={{ width: `${itemPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Squad Impact Rating Footer */}
      <div className="mt-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Tactical Efficiency</span>
        <span className="font-bold text-emerald-400">{chemistryPercentage}% Peak Performance</span>
      </div>
    </div>
  );
}
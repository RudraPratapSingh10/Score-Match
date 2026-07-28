import React from 'react';

export default function SuitabilityBar({ score = 85, label = "Suitability Match" }) {
  const getBarColor = (val) => {
    if (val >= 85) return 'bg-emerald-500 shadow-emerald-500/50';
    if (val >= 70) return 'bg-amber-500 shadow-amber-500/50';
    return 'bg-red-500 shadow-red-500/50';
  };

  const getTextColor = (val) => {
    if (val >= 85) return 'text-emerald-400';
    if (val >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-400 tracking-wide">{label}</span>
        <span className={`${getTextColor(score)} font-mono font-bold text-sm`}>{score}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${getBarColor(score)}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}
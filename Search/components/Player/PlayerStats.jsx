import React from 'react';

export default function PlayerStats({ stats }) {
  const defaultStats = stats || {
    Pace: 88,
    Shooting: 84,
    Passing: 82,
    Dribbling: 89,
    Defending: 45,
    Physical: 76
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
      {Object.entries(defaultStats).map(([stat, value]) => (
        <div key={stat} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">{stat}</span>
            <span className="text-slate-200 font-bold">{value}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${value >= 80 ? 'bg-emerald-500' : value >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
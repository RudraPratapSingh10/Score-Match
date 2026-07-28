import React from 'react';

export default function SquadSummary({
  summary = {
    attackRating: 89,
    midfieldRating: 86,
    defenseRating: 84,
    totalPlayers: 11,
    estimatedCost: '185M €'
  }
}) {
  const metrics = [
    { label: 'Attack Power', value: summary.attackRating, color: 'text-red-400', bg: 'bg-red-500' },
    { label: 'Midfield Control', value: summary.midfieldRating, color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { label: 'Defensive Line', value: summary.defenseRating, color: 'text-blue-400', bg: 'bg-blue-500' }
  ];

  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Squad Balance Summary</h3>
        <span className="text-xs font-mono text-amber-400 font-bold">{summary.estimatedCost} Value</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block truncate">{m.label}</span>
            <div className={`text-xl font-black font-mono ${m.color}`}>{m.value}</div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div className={`h-full ${m.bg}`} style={{ width: `${m.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
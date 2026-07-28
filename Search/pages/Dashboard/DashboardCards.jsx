import React from 'react';

export default function DashboardCards({
  nextMatch = {
    opponent: 'Real Madrid',
    difficulty: 'Hard',
    suggestedFormation: '4-2-3-1',
    predictedWinChance: '64%'
  },
  recentAlerts = [
    { id: 1, type: 'recommendation', text: 'Shift K. Mbappé to ST for +12% chemistry boost', time: '10m ago' },
    { id: 2, type: 'warning', text: 'Midfield depth low - CDM stamina recovery needed', time: '1h ago' },
    { id: 3, type: 'growth', text: 'Vini Jr. progression hit 90 overall rating', time: '3h ago' }
  ]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Match Tactical Brief */}
      <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Next Match Preview</h3>
            <p className="text-xs text-slate-400">AI Match Simulation & Counter Strategy</p>
          </div>
          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-lg uppercase">
            {nextMatch.difficulty} Matchup
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Opponent</span>
            <h4 className="text-base font-extrabold text-slate-100">{nextMatch.opponent}</h4>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Win Probability</span>
            <div className="text-lg font-black text-emerald-400 font-mono">{nextMatch.predictedWinChance}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 px-1">
          <span>Recommended Counter: <strong className="text-amber-400 font-mono">{nextMatch.suggestedFormation}</strong></span>
          <button className="text-emerald-400 hover:underline font-semibold cursor-pointer">
            Run Simulation →
          </button>
        </div>
      </div>

      {/* Tactical Alerts & Live Activity */}
      <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Tactical Feed & Insights</h3>
            <p className="text-xs text-slate-400">Real-time squad recommendations</p>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Live
          </span>
        </div>

        <div className="space-y-2.5">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-sm mt-0.5">
                  {alert.type === 'warning' ? '⚠️' : alert.type === 'growth' ? '📈' : '💡'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.text}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
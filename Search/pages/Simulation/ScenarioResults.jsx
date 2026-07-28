import React from 'react';

export default function ScenarioResults({
  results = {
    winChance: 68,
    drawChance: 18,
    lossChance: 14,
    predictedScore: "2 - 1",
    xGFor: 2.14,
    xGAgainst: 0.98,
    keyFactor: "Midfield overloads created +4 high-turnover chances in central zones."
  }
}) {
  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Simulation Outcome</h3>
        <span className="text-xs font-mono font-bold text-emerald-400">Score Prediction: {results.predictedScore}</span>
      </div>

      {/* Probability Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-emerald-400">Win {results.winChance}%</span>
          <span className="text-amber-400">Draw {results.drawChance}%</span>
          <span className="text-red-400">Loss {results.lossChance}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${results.winChance}%` }} />
          <div className="bg-amber-400 h-full transition-all" style={{ width: `${results.drawChance}%` }} />
          <div className="bg-red-500 h-full transition-all" style={{ width: `${results.lossChance}%` }} />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Expected Goals (xG)</span>
          <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">{results.xGFor}</div>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Expected Conceded (xGA)</span>
          <div className="text-lg font-black font-mono text-red-400 mt-0.5">{results.xGAgainst}</div>
        </div>
      </div>

      {/* Insight Callout */}
      <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-200 flex items-start gap-2">
        <span className="text-sm">💡</span>
        <p className="leading-relaxed"><strong className="text-cyan-400">Tactical Insight:</strong> {results.keyFactor}</p>
      </div>
    </div>
  );
}
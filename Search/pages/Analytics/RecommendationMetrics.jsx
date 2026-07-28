import React from 'react';

export default function RecommendationMetrics({
  data = {
    totalGenerated: 218,
    applied: 174,
    acceptanceRate: 80,
    avgChemistryBoost: '+11.4%',
    winRateImpact: '+8.2%'
  }
}) {
  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recommendation Efficacy</h3>
          <p className="text-[11px] text-slate-400">Impact of applied AI suggestions on squad outcomes</p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {data.acceptanceRate}% Adoption
        </span>
      </div>

      {/* Progress Ring / Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Accepted vs Dismissed Suggestions</span>
          <span className="text-emerald-400 font-mono">{data.applied} / {data.totalGenerated}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${data.acceptanceRate}%` }}
          />
        </div>
      </div>

      {/* Key Impact Cards */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Avg Chemistry Gain</span>
          <div className="text-base font-black font-mono text-emerald-400 mt-0.5">{data.avgChemistryBoost}</div>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Win Rate Boost</span>
          <div className="text-base font-black font-mono text-cyan-400 mt-0.5">{data.winRateImpact}</div>
        </div>
      </div>
    </div>
  );
}
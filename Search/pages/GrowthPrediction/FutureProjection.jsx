import React from 'react';

export default function FutureProjection({
  projection = {
    peakAge: "26 - 28",
    potentialCeiling: 95,
    projectedMarketValue: "180M €",
    developmentRisk: "Low (High Natural Fitness)",
    trainingFocus: "Shooting Accuracy & Passing Vision"
  }
}) {
  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Future Potential Projections</h3>
        <span className="text-xs font-mono font-bold text-emerald-400">Peak Rating: {projection.potentialCeiling}</span>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Peak Age Window</span>
          <div className="text-sm font-extrabold text-slate-200 mt-1 font-mono">{projection.peakAge} yrs</div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Peak Valuation</span>
          <div className="text-sm font-extrabold text-amber-400 mt-1 font-mono">{projection.projectedMarketValue}</div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Development Risk</span>
          <div className="text-xs font-bold text-emerald-400 mt-1 truncate">{projection.developmentRisk}</div>
        </div>
      </div>

      {/* Recommended Training Focus */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs flex items-center justify-between">
        <span className="text-slate-300 font-medium">Recommended Training Routine:</span>
        <span className="font-bold text-emerald-400 font-mono">{projection.trainingFocus}</span>
      </div>
    </div>
  );
}
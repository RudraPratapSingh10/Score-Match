import React from 'react';

export default function PerformanceMetrics({
  metrics = [
    { label: 'Prediction Precision', value: '94.8%', delta: '+1.4%', status: 'good' },
    { label: 'Simulation Latency', value: '18ms', delta: '-4ms', status: 'good' },
    { label: 'Expected Goals Mean Error (MAE)', value: '±0.12', delta: '-0.03', status: 'good' },
    { label: 'Tactical Overload Alignment', value: '89.2%', delta: '+2.1%', status: 'good' }
  ]
}) {
  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Engine Performance Metrics</h3>
          <p className="text-[11px] text-slate-400">Algorithmic latency & match prediction variance</p>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          Telemetry Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((item, idx) => (
          <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block truncate">{item.label}</span>
            <div className="text-xl font-black font-mono text-slate-100">{item.value}</div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span>↑</span>
              <span>{item.delta} vs previous baseline</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
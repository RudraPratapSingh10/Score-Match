import React from 'react';

export default function ValidationReport({
  report = {
    testDate: '2026-07-28',
    totalSamples: 10000,
    confidenceInterval: '95%',
    checks: [
      { name: 'Formation Balance Constraints', status: 'Passed', score: '100%' },
      { name: 'Position Swapping Logic Consistency', status: 'Passed', score: '98.5%' },
      { name: 'Chemistry Factor Weighting Accuracy', status: 'Passed', score: '96.2%' },
      { name: 'Stamina Decay & Injury Risk Variance', status: 'Passed', score: '92.4%' }
    ]
  }
}) {
  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Automated Model Validation Report</h3>
          <p className="text-[11px] text-slate-400">Backtested against {report.totalSamples.toLocaleString()} historical match samples</p>
        </div>
        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">CI: </span>
          <strong className="text-emerald-400">{report.confidenceInterval}</strong>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="space-y-2">
        {report.checks.map((check, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-200 font-medium">{check.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono">{check.score}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                {check.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
        <span>Last Audit Executed: {report.testDate}</span>
        <span>Build Ver: 2.8.4-prod</span>
      </div>
    </div>
  );
}
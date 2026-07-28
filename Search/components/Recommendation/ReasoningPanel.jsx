import React from 'react';

export default function ReasoningPanel({
  reasons = [
    "High passing vision aligns with CAM position dynamics.",
    "Physical stamina supports high-press transition demands.",
    "Complements current ST speedster chemistry by +14%."
  ],
  confidence = 94
}) {
  return (
    <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🧠</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Explainable Reasoning</h4>
        </div>
        <span className="text-[11px] text-slate-400">
          Engine Confidence: <strong className="text-emerald-400 font-mono">{confidence}%</strong>
        </span>
      </div>

      <ul className="space-y-2">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
            <span className="text-emerald-400 font-bold mt-0.5">•</span>
            <span className="leading-relaxed">{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
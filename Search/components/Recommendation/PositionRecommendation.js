import React from 'react';
import SuitabilityBar from './SuitabilityBar';

export default function PositionRecommendation({ position = "CAM", role = "Playmaker", suitability = 92, currentPos = "CM" }) {
  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-base shadow-lg">
            {position}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">{role} Role</h4>
            <p className="text-xs text-slate-400">
              Optimal shift from <span className="text-amber-400 font-semibold">{currentPos}</span> to <span className="text-emerald-400 font-semibold">{position}</span>
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md uppercase tracking-wider font-semibold">
          Recommended
        </span>
      </div>

      <SuitabilityBar score={suitability} label="Tactical Alignment Score" />
    </div>
  );
}
import React from 'react';
import PositionRecommendation from './PositionRecommendation';
import ReasoningPanel from './ReasoningPanel';
import SuitabilityBar from './SuitabilityBar';

export default function RecommendationCard({
  player = { name: "K. Mbappé", currentPos: "LW", rating: 91 },
  recommendation = {
    targetPos: "ST",
    role: "Speedster / Target Forward",
    suitability: 96,
    chemistryGain: 12,
    reasons: [
      "Pace and finishing profile maximum return at ST position.",
      "Improves central overload capability against 4-4-2 setups.",
      "Unlocks +12% synergy with midfield Producers."
    ],
    confidence: 95
  },
  onApply
}) {
  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl space-y-4 hover:border-emerald-500/40 transition-all">
      {/* Player Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">{player.name}</h3>
          <span className="text-xs text-slate-400">Current Position: <strong className="text-amber-400">{player.currentPos}</strong></span>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-amber-400">{player.rating}</span>
          <span className="block text-[9px] text-slate-400 font-bold uppercase">Rating</span>
        </div>
      </div>

      {/* Recommended Position */}
      <PositionRecommendation
        position={recommendation.targetPos}
        role={recommendation.role}
        suitability={recommendation.suitability}
        currentPos={player.currentPos}
      />

      {/* Chemistry Gain Pill */}
      <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <span className="text-xs text-slate-300 font-medium">Projected Chemistry Impact</span>
        <span className="text-xs font-bold text-emerald-400 font-mono">+{recommendation.chemistryGain}% Team Chemistry</span>
      </div>

      {/* Explainable AI Reasoning */}
      <ReasoningPanel reasons={recommendation.reasons} confidence={recommendation.confidence} />

      {/* Action Button */}
      {onApply && (
        <button
          onClick={onApply}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          Apply Tactical Recommendation
        </button>
      )}
    </div>
  );
}
import React from 'react';

export default function ChemistryMeter({ score = 88, breakdown = {} }) {
  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-400 stroke-emerald-500';
    if (val >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-red-400 stroke-red-500';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 self-start">Team Chemistry</h3>
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
          <circle 
            cx="64" 
            cy="64" 
            r="40" 
            strokeWidth="8" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 fill-transparent ${getScoreColor(score)}`} 
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-3xl font-black text-slate-100">{score}</span>
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">/ 100</span>
        </div>
      </div>

      {/* Synergy Breakdown */}
      <div className="w-full mt-5 space-y-2 text-xs">
        <div className="flex justify-between items-center text-slate-400">
          <span>Club Links</span>
          <span className="text-emerald-400 font-semibold">{breakdown.club || 'High (+12)'}</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>League Links</span>
          <span className="text-emerald-400 font-semibold">{breakdown.league || 'Medium (+8)'}</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Nationality Synergy</span>
          <span className="text-amber-400 font-semibold">{breakdown.nation || 'Moderate (+5)'}</span>
        </div>
      </div>
    </div>
  );
}
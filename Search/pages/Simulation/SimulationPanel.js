import React, { useState } from 'react';

export default function SimulationPanel({ onRunSimulation, isSimulating = false }) {
  const [matchConfig, setMatchConfig] = useState({
    opponent: 'Manchester City',
    matchType: 'Competitive',
    pressingIntensity: 'High',
    tacticalPace: 'Fast-balanced',
    simulateIterations: 1000
  });

  const handleChange = (key, val) => {
    setMatchConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (onRunSimulation) onRunSimulation(matchConfig);
  };

  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Match Simulation Engine</h3>
          <p className="text-xs text-slate-400">Monte Carlo 1,000-run tactical outcome engine</p>
        </div>
        <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold rounded-lg uppercase">
          AI Engine v2.4
        </span>
      </div>

      {/* Config Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Target Opponent</label>
          <select
            value={matchConfig.opponent}
            onChange={(e) => handleChange('opponent', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="Manchester City">Manchester City (Possession 4-3-3)</option>
            <option value="Real Madrid">Real Madrid (Counter 4-3-3)</option>
            <option value="Bayern Munich">Bayern Munich (High Press 4-2-3-1)</option>
            <option value="Inter Milan">Inter Milan (Wing-back 3-5-2)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Pressing Intensity</label>
          <select
            value={matchConfig.pressingIntensity}
            onChange={(e) => handleChange('pressingIntensity', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="Low">Low Block (Conserve Stamina)</option>
            <option value="Balanced">Mid-Block (Balanced)</option>
            <option value="High">Gegenpressing (High Energy)</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleStart}
        disabled={isSimulating}
        className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2"
      >
        {isSimulating ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            Simulating Match Scenarios...
          </>
        ) : (
          '⚡ Run Monte Carlo Match Simulation'
        )}
      </button>
    </div>
  );
}
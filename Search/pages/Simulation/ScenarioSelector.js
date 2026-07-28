import React from 'react';

export default function ScenarioSelector({
  activeScenario = "normal",
  onSelectScenario,
  scenarios = [
    { id: "normal", title: "Standard 90-Min Match", icon: "⚽", risk: "Low" },
    { id: "red_card", title: "Red Card at 60' (10 Men)", icon: "🟥", risk: "High" },
    { id: "trailing_late", title: "Trailing 0-1 at 75' (All Out Attack)", icon: "🔥", risk: "Critical" },
    { id: "protect_lead", title: "Defend 1-0 Lead at 80' (Park the Bus)", icon: "🛡️", risk: "Medium" }
  ]
}) {
  return (
    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">In-Game Stress Test Scenarios</h3>
        <span className="text-[10px] text-slate-400 font-mono">Select Stress-Test</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {scenarios.map((s) => {
          const isActive = activeScenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectScenario && onSelectScenario(s.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500 text-slate-100 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{s.icon}</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">{s.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Risk Level: {s.risk}</div>
                </div>
              </div>
              {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
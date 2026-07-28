import React from 'react';

export default function FormationSelector({ 
  currentFormation = "4-3-3", 
  onSelectFormation,
  formations = [
    { id: "4-3-3", name: "4-3-3 Attack", style: "High Press / Possession", chemBonus: "+15%" },
    { id: "4-2-3-1", name: "4-2-3-1 Narrow", style: "Balanced Counter", chemBonus: "+12%" },
    { id: "3-5-2", name: "3-5-2 Wing Play", style: "Wide Overload", chemBonus: "+10%" },
    { id: "4-4-2", name: "4-4-2 Classic", style: "Direct Defensive Block", chemBonus: "+8%" }
  ]
}) {
  return (
    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tactical System</h3>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Preset Formations
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {formations.map((f) => {
          const isActive = currentFormation === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFormation && onSelectFormation(f.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-1.5 ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold font-mono">{f.id}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{f.style}</div>
              <div className="text-[9px] font-mono font-semibold text-emerald-400">{f.chemBonus} Chem</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
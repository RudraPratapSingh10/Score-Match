import React from 'react';

export default function PlayerBadge({ name, position, rating, overall, chemistry }) {
  const getPosColor = (pos) => {
    switch (pos) {
      case 'FW': case 'ST': case 'LW': case 'RW': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MF': case 'CAM': case 'CM': case 'CDM': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'DF': case 'CB': case 'LB': case 'RB': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'GK': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/90 rounded-xl border border-slate-700/60 shadow-lg hover:border-emerald-500/50 transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs border ${getPosColor(position)}`}>
          {position}
        </div>
        <div>
          <h4 className="font-semibold text-slate-100 text-sm">{name}</h4>
          <span className="text-xs text-slate-400">Chemistry: <span className="text-emerald-400 font-medium">+{chemistry}%</span></span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-black text-amber-400">{overall}</div>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">OVR</span>
      </div>
    </div>
  );
}
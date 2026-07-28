import React from 'react';

export default function PlayerSlot({ position = "ST", player = null, onClick, isSelected = false }) {
  const getPosBadgeColor = (pos) => {
    switch (pos) {
      case 'FW': case 'ST': case 'LW': case 'RW': return 'border-red-500/50 text-red-400 bg-red-950/40';
      case 'MF': case 'CAM': case 'CM': case 'CDM': return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40';
      case 'DF': case 'CB': case 'LB': case 'RB': return 'border-blue-500/50 text-blue-400 bg-blue-950/40';
      case 'GK': return 'border-amber-500/50 text-amber-400 bg-amber-950/40';
      default: return 'border-slate-700 text-slate-400 bg-slate-900';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer group transition-all duration-300 transform ${
        isSelected ? 'scale-110' : 'hover:scale-105'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Circle Card Slot */}
        <div
          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs border-2 shadow-2xl transition-all ${
            player
              ? 'bg-slate-900 border-amber-400 text-amber-400 shadow-amber-500/20'
              : `border-dashed ${getPosBadgeColor(position)}`
          } ${isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}`}
        >
          {player ? (
            <>
              <span className="text-sm font-black font-mono leading-none">{player.rating || player.overall}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{player.position || position}</span>
            </>
          ) : (
            <span className="text-xs font-black tracking-wider">{position}</span>
          )}
        </div>

        {/* Player Label Pill */}
        <div
          className={`mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap border shadow-md transition-colors ${
            player
              ? 'bg-slate-900/90 text-slate-100 border-slate-700'
              : 'bg-slate-950/80 text-slate-400 border-slate-800/80 group-hover:border-emerald-500/50 group-hover:text-emerald-400'
          }`}
        >
          {player ? player.name : `+ Add ${position}`}
        </div>
      </div>
    </div>
  );
}
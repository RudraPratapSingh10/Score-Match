import React from 'react';

export default function FormationGrid({ formation = "4-3-3", players = [], onSlotClick }) {
  // Pitch slot positions for 4-3-3 formation
  const gridPositions = [
    { id: 1, pos: 'GK', top: '88%', left: '50%' },
    { id: 2, pos: 'LB', top: '68%', left: '15%' },
    { id: 3, pos: 'CB', top: '72%', left: '38%' },
    { id: 4, pos: 'CB', top: '72%', left: '62%' },
    { id: 5, pos: 'RB', top: '68%', left: '85%' },
    { id: 6, pos: 'CDM', top: '50%', left: '50%' },
    { id: 7, pos: 'CM', top: '38%', left: '30%' },
    { id: 8, pos: 'CM', top: '38%', left: '70%' },
    { id: 9, pos: 'LW', top: '18%', left: '20%' },
    { id: 10, pos: 'ST', top: '12%', left: '50%' },
    { id: 11, pos: 'RW', top: '18%', left: '80%' },
  ];

  return (
    <div className="relative w-full aspect-[3/4] max-w-lg mx-auto bg-emerald-900/40 rounded-2xl border-2 border-emerald-500/30 overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Pitch Lines */}
      <div className="absolute inset-4 border border-emerald-500/20 rounded-lg pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/6 border-b border-x border-emerald-500/20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/6 border-t border-x border-emerald-500/20" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-emerald-500/20 rounded-full" />
      </div>

      {/* Player Slots */}
      {gridPositions.map((slot) => {
        const player = players.find(p => p.slotId === slot.id);

        return (
          <div
            key={slot.id}
            onClick={() => onSlotClick && onSlotClick(slot)}
            style={{ top: slot.top, left: slot.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            <div className="flex flex-col items-center">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-lg transition-transform group-hover:scale-110 ${
                player 
                  ? 'bg-slate-900 border-amber-400 text-amber-400' 
                  : 'bg-emerald-950/80 border-dashed border-emerald-400/50 text-emerald-300'
              }`}>
                {player ? player.rating : slot.pos}
              </div>
              <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-[10px] font-medium text-slate-200 rounded-md border border-slate-700/50 whitespace-nowrap">
                {player ? player.name : `+ Add ${slot.pos}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
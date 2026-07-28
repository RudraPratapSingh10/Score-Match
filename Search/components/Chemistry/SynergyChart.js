import React from 'react';

export default function SynergyChart({
  links = [
    { source: 'CB (Van Dijk)', target: 'GK (Alisson)', strength: 95, type: 'Club & Nation' },
    { source: 'CM (Mac Allister)', target: 'CAM (Szoboszlai)', strength: 88, type: 'Club Link' },
    { source: 'RW (Salah)', target: 'ST (Nunez)', strength: 82, type: 'Club Link' },
    { source: 'LB (Robertson)', target: 'CB (Van Dijk)', strength: 90, type: 'Club Link' },
  ],
  title = "Positional Synergy Connections"
}) {
  const getStrengthBadge = (val) => {
    if (val >= 90) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (val >= 75) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          <p className="text-xs text-slate-400">High-impact tactical connections on pitch</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {links.length} Active Nodes
        </span>
      </div>

      <div className="space-y-2.5">
        {links.map((link, idx) => (
          <div 
            key={idx} 
            className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all"
          >
            {/* Link Connections */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-200">{link.source}</span>
              <span className="text-slate-500 text-sm">⚡</span>
              <span className="font-semibold text-slate-200">{link.target}</span>
            </div>

            {/* Type & Score */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 hidden sm:inline">{link.type}</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getStrengthBadge(link.strength)}`}>
                {link.strength}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
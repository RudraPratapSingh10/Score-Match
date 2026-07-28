import React, { useState } from 'react';

export default function PlayerEditor({
  player = { name: "K. Mbappé", position: "ST", rating: 91, pace: 97, shooting: 89, passing: 80, chemistry: 95 },
  onSave,
  onRemove,
  onClose
}) {
  const [editedPlayer, setEditedPlayer] = useState(player);

  const handleChange = (field, val) => {
    setEditedPlayer((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="p-5 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Edit Player Attributes</h3>
          <p className="text-xs text-slate-400">Modify stats & tactical slot position</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-xs font-bold px-2 py-1 bg-slate-800 rounded">
            ✕
          </button>
        )}
      </div>

      {/* Name & Position Form */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Player Name</label>
          <input
            type="text"
            value={editedPlayer.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Pos</label>
          <input
            type="text"
            value={editedPlayer.position}
            onChange={(e) => handleChange('position', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2 py-2 text-center uppercase font-bold focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Attribute Sliders */}
      <div className="space-y-3 pt-2">
        {['rating', 'pace', 'shooting', 'passing'].map((stat) => (
          <div key={stat} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-400 capitalize">{stat}</span>
              <span className="text-emerald-400 font-mono font-bold">{editedPlayer[stat] || 80}</span>
            </div>
            <input
              type="range"
              min="40"
              max="99"
              value={editedPlayer[stat] || 80}
              onChange={(e) => handleChange(stat, Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={() => onSave && onSave(editedPlayer)}
          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/10"
        >
          Save Changes
        </button>
        {onRemove && (
          <button
            onClick={onRemove}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Remove Slot
          </button>
        )}
      </div>
    </div>
  );
}
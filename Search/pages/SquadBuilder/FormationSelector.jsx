import React from 'react';
import { FORMATIONS } from '../../constants/formations.js'; // Extension ke saath

export function FormationSelector({ selectedFormation, onSelectFormation }) {
  return (
    <div className="formation-selector-container">
      <h3 className="text-lg font-semibold mb-3">Formation Selection</h3>
      <div className="flex flex-wrap gap-2">
        {FORMATIONS.map((form) => {
          const isActive = selectedFormation === form.id;
          return (
            <button
              key={form.id}
              onClick={() => onSelectFormation && onSelectFormation(form.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              {form.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
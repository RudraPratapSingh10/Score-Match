import React from 'react';

export default function SuggestionChips({
  suggestions = [
    'Improve Team Chemistry',
    'Best formation for counter-attack?',
    'Suggest LW replacement'
  ],
  onSelect
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {suggestions.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onSelect && onSelect(chip)}
          className="whitespace-nowrap px-3 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/60 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer shrink-0"
        >
          ✨ {chip}
        </button>
      ))}
    </div>
  );
}
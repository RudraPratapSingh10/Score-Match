import React from 'react';

export default function MessageBubble({ role = 'assistant', text = '' }) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar Icon */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
          isUser
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-slate-800 text-amber-400 border-slate-700'
        }`}
      >
        {isUser ? 'ME' : 'AI'}
      </div>

      {/* Bubble Content */}
      <div
        className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none shadow-lg shadow-emerald-950/40'
            : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/60 shadow-md'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
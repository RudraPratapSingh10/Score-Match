import React, { useState } from 'react';

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask tactical AI assistant..."
        className="flex-1 bg-slate-900 border border-slate-700/80 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500/80 placeholder-slate-500 transition-colors"
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer shrink-0"
      >
        Send
      </button>
    </form>
  );
}
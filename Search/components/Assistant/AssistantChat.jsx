import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';

export default function AssistantChat() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! Main aapka AI Tactical Assistant hoon. Squad chemistry improvement ya formation suggest karne me madad karoon?' }
  ]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        role: 'assistant',
        text: `Analysis complete: ${text} ke liye aap High-Pressing 4-3-3 formation test kar sakte hain. Midfield chemistry +15% tak badh sakti hai.`
      };
      setMessages(prev => [...prev, aiReply]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-semibold text-sm text-slate-100">Tactical AI Assistant</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v2.4 Active</span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map(msg => (
          <MessageBubble key={msg.id} role={msg.role} text={msg.text} />
        ))}
      </div>

      {/* Chips & Input */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800 space-y-2">
        <SuggestionChips onSelect={handleSend} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
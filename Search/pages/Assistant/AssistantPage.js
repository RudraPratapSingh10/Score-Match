import React, { useState } from 'react';
import { askAssistant } from '../../services/engine-api-adapter.js';
import { Card } from '../../components/Common/Card.jsx';
import { Button } from '../../components/Common/Button.jsx';

export function AssistantPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Tactical Assistant. Ask me anything like "Best CB for 4-4-2" or "Compare Guard and Protector".' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    const res = askAssistant(input);
    const aiMsg = { sender: 'ai', text: res.response };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>AI Tactical Assistant</h1>

      <Card title="Interactive Conversational Pipeline">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: m.sender === 'user' ? 'var(--primary)' : 'var(--bg-card-hover)',
              color: m.sender === 'user' ? '#000' : '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              maxWidth: '80%'
            }}>
              {m.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type tactical query..."
            style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px' }}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </Card>
    </div>
  );
}
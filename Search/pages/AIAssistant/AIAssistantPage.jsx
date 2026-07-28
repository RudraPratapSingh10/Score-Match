import React, { useState } from 'react';
import { useSquad } from '../../hooks/useSquad';

export function AIAssistantPage() {
  const { squad } = useSquad();
  const rawPlayers = squad?.players || squad?.slots || [];
  
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: 'Hello Rudra! I am your AI Tactical Assistant. Ask me about specific players like Producer, Hammer, Speedster, or win rates.' 
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMessage = { sender: 'user', text: inputQuery };
    const query = inputQuery.toLowerCase();
    setInputQuery('');

    // Exact Point-to-Point Intelligence including Card Roles (Producer, Hammer, etc.)
    let aiReply = "Make sure your formation balances defensive stability with smart passing options.";
    
    const totalLevel = rawPlayers.reduce((acc, slot) => acc + (slot.level || slot.player?.level || 1), 0);
    const avgLevel = rawPlayers.length > 0 ? (totalLevel / rawPlayers.length).toFixed(1) : 1;

    if (query.includes('producer')) {
      aiReply = `Producer Role Analysis: Producers have excellent passing accuracy and curve. Best placed in Central Midfield (CM) or Wide Midfield to orchestrate precise through-balls to your strikers.`;
    }
    else if (query.includes('hammer')) {
      aiReply = `Hammer Role Analysis: Hammers possess immense shot power and high height, making them phenomenal as central Strikers (ST) or Central Defensive Midfielders (CDM) for winning aerial headers.`;
    }
    else if (query.includes('speedster')) {
      aiReply = `Speedster Role Analysis: Speedsters excel in raw pace. Best deployed on the wings (RW/LW) or up top to exploit high opposition defensive lines.`;
    }
    else if (query.includes('guard') || query.includes('protector')) {
      aiReply = `Guard / Protector Analysis: High stability and secure passing. Perfect for center-back (CB) or central midfield to prevent opponent counter-attacks safely.`;
    }
    else if (query.includes('win') || query.includes('rate') || query.includes('chance')) {
      aiReply = `Current Squad Stats: Average Level is ${avgLevel}. Recommended Action: Upgrade central playmakers to increase win probability by ~12%.`;
    } 
    else if (query.includes('formation') || query.includes('tactics')) {
      aiReply = `Active Setup: Formation is ${squad?.formation || '4-3-3'}. Point: Use Producer in central areas for ball distribution and control.`;
    }
    else if (query.includes('level') || query.includes('upgrade')) {
      aiReply = `Power Analysis: Total accumulated squad level is ${totalLevel}. Focus upgrade resources on your primary midfield playmaker first.`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, userMessage, { sender: 'ai', text: aiReply }]);
    }, 300);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc', height: 'calc(100vh - 2rem)', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>AI Tactical Assistant</h1>

      {/* Chat Container */}
      <div style={{
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        {/* Message Log */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', flex: 1 }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#0f172a',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              maxWidth: '80%',
              border: msg.sender === 'ai' ? '1px solid #334155' : 'none',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              <strong style={{ display: 'block', fontSize: '0.75rem', color: msg.sender === 'user' ? '#bfdbfe' : '#94a3b8', marginBottom: '0.2rem' }}>
                {msg.sender === 'user' ? 'You' : 'AI Coach (Score Match Pro)'}
              </strong>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
          <input 
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about players (e.g., 'Producer', 'Hammer', 'Speedster')..."
            style={{
              flex: 1,
              padding: '0.75rem 1.0rem',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#fff',
              fontSize: '0.9rem'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIAssistantPage;
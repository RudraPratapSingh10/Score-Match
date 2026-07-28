import React, { useState } from 'react';
import { FORMATIONS } from '../../constants/formations.js';

export function MatchSimulator({ squad }) {
  const [opponentFormation, setOpponentFormation] = useState('4-3-3');

  const myFormation = squad?.formation || '4-4-2';
  const players = squad?.players || [];

  // Calculation Logic for Match Simulation
  const avgLevel = (players.reduce((acc, p) => acc + (p.level || 1), 0) / (players.length || 1)).toFixed(1);

  // Counter Advantage Matrix Logic
  const getAdvantageScore = () => {
    let score = 50; // Base 50% chance

    // Formation counter logic
    if (myFormation === '3-5-2' && opponentFormation === '4-3-3') score += 12;
    if (myFormation === '4-3-3' && opponentFormation === '5-3-2') score -= 10;
    if (myFormation === '5-3-2' && opponentFormation === '4-4-2') score += 8;

    // Level Bonus
    score += Math.round((Number(avgLevel) - 7) * 4);

    return Math.min(95, Math.max(10, score));
  };

  const winProbability = getAdvantageScore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Opponent Selection Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f8fafc' }}>
          Select Opponent Formation:
        </label>
        <select
          value={opponentFormation}
          onChange={(e) => setOpponentFormation(e.target.value)}
          style={{
            padding: '0.5rem 0.8rem',
            backgroundColor: 'var(--bg-dark, #0f172a)',
            color: '#fff',
            border: '1px solid var(--border, #334155)',
            borderRadius: '6px',
            fontSize: '0.85rem'
          }}
        >
          {FORMATIONS.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* Probability Gauge Meter */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        borderRadius: '8px',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Match Win Rate vs <strong style={{ color: '#fff' }}>{opponentFormation}</strong>
          </span>
          <span style={{ 
            fontWeight: 'bold', 
            color: winProbability >= 50 ? '#10b981' : '#f43f5e' 
          }}>
            {winProbability}% Projected Chance
          </span>
        </div>

        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${winProbability}%`, 
            background: winProbability >= 50 ? '#10b981' : '#f43f5e', 
            height: '100%',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Tactical Counter Hints */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(51, 65, 85, 0.4)',
        borderRadius: '6px',
        borderLeft: '4px solid #3b82f6'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#60a5fa' }}>
          💡 Tactical Advice:
        </span>
        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
          {opponentFormation === '4-3-3' && 'Opponent relies on wingers. Ensure your wing-backs have high speed or use "Guard" to cover wide gaps.'}
          {opponentFormation === '5-3-2' && 'Opponent is playing defensive. Use "Architect" or "Producer" in midfield to break down low blocks.'}
          {!['4-3-3', '5-3-2'].includes(opponentFormation) && 'Maintain strong midfield presence and ensure your strikers have high Finishing levels.'}
        </p>
      </div>

    </div>
  );
}
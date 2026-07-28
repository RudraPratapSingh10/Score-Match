import React, { useState, useMemo } from 'react';
import { FORMATIONS } from '../../constants/formations.js';

export function MatchSimulator({ squad }) {
  // Opponent Formation State (Default: 4-3-3)
  const [selectedOpponent, setSelectedOpponent] = useState('4-3-3');

  // Dynamic Win Rate & Advice Calculation based on Squad Level vs Opponent
  const { winRate, advice } = useMemo(() => {
    const rawPlayers = squad?.players || squad?.slots || [];
    
    // Calculate User's Average Team Power
    const totalLevel = rawPlayers.reduce((acc, slot) => {
      const lvl = slot.level || slot.player?.level || 1;
      return acc + lvl;
    }, 0);
    
    const avgLevel = rawPlayers.length > 0 ? totalLevel / rawPlayers.length : 1;

    // Base difficulty multiplier per formation
    const formationDifficulty = {
      '4-3-3': 52,
      '4-4-2': 58,
      '5-3-2': 48,
      '3-5-2': 62,
      '5-2-1-2': 45,
      '4-2-1-3': 55,
      '4-1-2-3': 53,
      '3-4-3': 50,
      '4-1-4-1': 60,
      '5-4-1': 42,
      '4-2-3-1': 57,
      '3-1-2-1-3': 49
    };

    // Tactical advice mapping
    const adviceMap = {
      '4-3-3': 'Exploit the wings with fast Speedsters and watch out for counter-attacks on fullbacks.',
      '4-4-2': 'Dominating the central midfield is key. Use high Response/Passing players in the engine room.',
      '5-3-2': 'Tight defensive block! Rely on powerful strikers like Hammers or Menaces to break through.',
      '3-5-2': 'Overload wide areas! Opponent has thin wing coverage—use fast wingers to stretch them.',
      '5-2-1-2': 'Crowded central area. Switch play frequently and use long-range shooting opportunities.',
      '4-2-1-3': 'Watch out for their CAM orchestrating attacks. Use aggressive CDMs with high Interception.',
      '4-1-2-3': 'Break their single CDM pivot with rapid short passes and forward runs from Midfielders.',
      '3-4-3': 'Maintain strong midfield presence and ensure your strikers have high Finishing levels.',
      '4-1-4-1': 'Patience is needed. Circumvent their compact midfield using overlapping wingbacks.',
      '5-4-1': 'Ultra-defensive wall. Maximize set-pieces and physical strikers to win aerial duels.',
      '4-2-3-1': 'Press their double pivot early to disrupt build-up play before they reach your box.',
      '3-1-2-1-3': 'Expose their high line with direct long balls to rapid Attacking forwards.'
    };

    const baseWin = formationDifficulty[selectedOpponent] || 50;
    
    // Squad Level Boost (Higher squad level increases win chance)
    const levelBonus = Math.round((avgLevel - 5) * 4); 
    const calculatedRate = Math.min(95, Math.max(15, baseWin + levelBonus));

    return {
      winRate: calculatedRate,
      advice: adviceMap[selectedOpponent] || 'Adjust your tactics according to the opponent structure.'
    };
  }, [squad, selectedOpponent]);

  const opponentList = [
    '4-3-3', '4-4-2', '5-3-2', '3-5-2', '5-2-1-2', '4-2-1-3',
    '4-1-2-3', '3-4-3', '4-1-4-1', '5-4-1', '4-2-3-1', '3-1-2-1-3'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#f8fafc' }}>
      
      {/* 1. Opponent Formation Selector Buttons */}
      <div>
        <label style={{ display: 'block', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
          Select Opponent Formation:
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {opponentList.map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedOpponent(fmt)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: selectedOpponent === fmt ? '#10b981' : '#334155',
                backgroundColor: selectedOpponent === fmt ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                color: selectedOpponent === fmt ? '#10b981' : '#cbd5e1',
                fontWeight: selectedOpponent === fmt ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Win Rate Card */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#1e293b',
        borderRadius: '10px',
        border: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'block' }}>
            Match Win Rate vs <strong style={{ color: '#fff' }}>{selectedOpponent}</strong>
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: winRate >= 50 ? '#10b981' : '#f59e0b' }}>
            {winRate}% <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal' }}>Projected Chance</span>
          </span>
        </div>
      </div>

      {/* 3. Dynamic Tactical Advice */}
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        fontSize: '0.88rem',
        color: '#93c5fd'
      }}>
        <strong style={{ color: '#60a5fa', display: 'block', marginBottom: '0.25rem' }}>
          💡 Tactical Advice:
        </strong>
        {advice}
      </div>

    </div>
  );
}
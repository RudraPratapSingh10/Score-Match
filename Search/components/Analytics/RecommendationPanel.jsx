import React from 'react';
import { useSquad } from '../../hooks/useSquad.js';

export function Recommendations() {
  const { squad } = useSquad();
  
  // Squad slots/players extract karna
  const rawPlayers = squad?.players || squad?.slots || [];
  
  // Total Score & Dynamic Confidence Score
  const totalScore = rawPlayers.reduce((acc, slot) => {
    const lvl = slot.level || slot.player?.level || 1;
    return acc + (lvl * 10);
  }, 0);

  const maxPossibleScore = (rawPlayers.length || 11) * 110;
  const assignedCount = rawPlayers.filter(s => s.playerId || s.name || s.player?.name).length;
  
  const confidenceScore = Math.min(
    100,
    Math.round((totalScore / maxPossibleScore) * 100 + (assignedCount === 11 ? 15 : 0))
  );

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Recommendation Center</h1>

      {/* Engine Strategic Analysis Banner */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 'bold' }}>
          Engine Strategic Analysis
        </h3>
        
        <p style={{ margin: '0.75rem 0 1rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>
          Optimized squad lineup formed with total score of <strong style={{ color: '#fff' }}>{totalScore}</strong>.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f8fafc' }}>
            Confidence Score:
          </span>
          <span style={{
            backgroundColor: confidenceScore >= 70 ? '#10b981' : '#059669',
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '0.85rem'
          }}>
            {confidenceScore}%
          </span>
        </div>
      </div>

      {/* Dynamic Positional Fit Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {rawPlayers.map((slot, index) => {
          const playerRole = slot.role || slot.type || slot.player?.role || slot.behavior || 'Guard';
          const playerName = slot.name || slot.player?.name ? `(${slot.name || slot.player?.name})` : '';
          const positionTag = slot.position || slot.slotPosition || 'CB';

          return (
            <div key={slot.id || index} style={{
              padding: '1.25rem',
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              border: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc', fontWeight: 'bold' }}>
                Positional Fit #{index + 1}
              </h4>

              <div style={{ marginTop: '0.5rem' }}>
                {/* Dynamic Player Role */}
                <span style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  color: '#3b82f6',
                  display: 'block' 
                }}>
                  {playerRole} {playerName}
                </span>

                {/* Dynamic Position Tag */}
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                  Position: <strong style={{ color: '#94a3b8' }}>{positionTag}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
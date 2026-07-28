import React from 'react';

export function AnalyticsDashboard({ squad }) {
  // Safe extraction of players / slots
  const players = squad?.players || squad?.slots || [];

  // Dynamic Total Fit Score Calculation
  const totalScore = players.reduce((acc, slot) => {
    const level = slot.level || slot.player?.level || 1;
    return acc + (level * 10);
  }, 0);

  const maxPossibleScore = (players.length || 11) * 110;
  const assignedCount = players.filter(p => p.playerId || p.name || p.player?.name).length;

  // Dynamic Confidence Score
  const confidenceScore = Math.min(
    100,
    Math.round((totalScore / maxPossibleScore) * 100 + (assignedCount === 11 ? 15 : 0))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Dynamic Recommendation Center Header */}
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

      {/* Grid Cards for Positional Fits */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {players.map((slot, index) => {
          // Dynamic Player Role, Name & Position mapping
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
                {/* Dynamic Role */}
                <span style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  color: '#3b82f6',
                  display: 'block' 
                }}>
                  {playerRole} {playerName}
                </span>

                {/* Dynamic Position */}
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
import React from 'react';

export function RecommendationPanel({ squad }) {
  const players = squad?.players || [];

  // Dynamic Total Fit Score calculation
  const totalScore = players.reduce((acc, p) => acc + ((p.level || 1) * 10), 0);
  const maxPossibleScore = (players.length || 11) * 110;

  // Dynamic Confidence Meter Calculation
  const assignedCount = players.filter(p => p.playerId || p.name).length;
  const confidenceScore = Math.min(
    100,
    Math.round((totalScore / maxPossibleScore) * 100 + (assignedCount === 11 ? 10 : 0))
  );

  if (!players || players.length === 0) {
    return <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No players assigned yet.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Header Summary */}
      <div style={{
        padding: '0.85rem 1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '8px',
        border: '1px solid #334155'
      }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#f59e0b' }}>
          🎯 Recommendation Center: Strategic Analysis
        </h3>
        <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
          Optimized squad lineup formed with total score of <strong style={{ color: '#10b981' }}>{totalScore}</strong>.
        </p>

        {/* Dynamic Confidence Meter Bar */}
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            <span>Optimization Confidence</span>
            <span style={{ fontWeight: 'bold', color: '#10b981' }}>{confidenceScore}%</span>
          </div>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${confidenceScore}%`,
              background: confidenceScore >= 70 ? '#10b981' : '#f59e0b',
              height: '100%',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Dynamic Positional Fit Breakdown List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '0.6rem',
        maxHeight: '260px',
        overflowY: 'auto'
      }}>
        {players.map((slot, index) => (
          <div key={slot.id || index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '6px',
            border: '1px solid #334155',
            fontSize: '0.78rem'
          }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Fit #{index + 1} (<strong style={{ color: '#10b981' }}>{slot.position || 'SLOT'}</strong>):</span>
              <span style={{ display: 'block', fontWeight: '600', color: '#f8fafc', marginTop: '2px' }}>
                {slot.name || 'Unassigned'}
              </span>
            </div>
            
            <span style={{
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: 'bold',
              fontSize: '0.72rem'
            }}>
              {slot.type || 'Guard'}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
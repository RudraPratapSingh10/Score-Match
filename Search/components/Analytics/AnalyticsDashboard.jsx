import React from 'react';

export function AnalyticsDashboard({ squad }) {
  const players = squad?.players || [];

  // Simple Rating & Stat Calculations based on Levels & Behavior Roles
  const totalLevel = players.reduce((sum, p) => sum + (p.level || 1), 0);
  const avgLevel = (totalLevel / (players.length || 1)).toFixed(1);

  // Categorize positions for ratings
  const attackScore = Math.min(99, Math.round(avgLevel * 8.5 + players.filter(p => ['ST', 'CF', 'RM', 'LM'].includes(p.position)).length * 2));
  const defenseScore = Math.min(99, Math.round(avgLevel * 8.2 + players.filter(p => ['CB', 'LB', 'RB', 'GK'].includes(p.position)).length * 2.5));
  const midfieldScore = Math.min(99, Math.round(avgLevel * 8.0 + players.filter(p => ['CM', 'CAM', 'CDM'].includes(p.position)).length * 3));

  // Overall Synergy %
  const synergyScore = Math.min(100, Math.round(avgLevel * 7.5 + 15));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
      {/* Total Squad Rating */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid #334155', padding: '1rem', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Squad Average Level</span>
        <h2 style={{ fontSize: '1.8rem', color: '#10b981', margin: '0.2rem 0' }}>Lvl {avgLevel}</h2>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Power: {totalLevel * 10}</span>
      </div>

      {/* Attack Rating */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid #334155', padding: '1rem', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Attack Rating</span>
        <h2 style={{ fontSize: '1.8rem', color: '#f43f5e', margin: '0.2rem 0' }}>{attackScore} / 99</h2>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px' }}>
          <div style={{ width: `${attackScore}%`, background: '#f43f5e', height: '100%', borderRadius: '3px' }} />
        </div>
      </div>

      {/* Midfield Rating */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid #334155', padding: '1rem', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Midfield Control</span>
        <h2 style={{ fontSize: '1.8rem', color: '#3b82f6', margin: '0.2rem 0' }}>{midfieldScore} / 99</h2>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px' }}>
          <div style={{ width: `${midfieldScore}%`, background: '#3b82f6', height: '100%', borderRadius: '3px' }} />
        </div>
      </div>

      {/* Defense Rating */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid #334155', padding: '1rem', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Defense Rating</span>
        <h2 style={{ fontSize: '1.8rem', color: '#eab308', margin: '0.2rem 0' }}>{defenseScore} / 99</h2>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px' }}>
          <div style={{ width: `${defenseScore}%`, background: '#eab308', height: '100%', borderRadius: '3px' }} />
        </div>
      </div>

      {/* Team Synergy */}
      <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid #334155', padding: '1rem', borderRadius: '8px', gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#f8fafc' }}>Team Chemistry & Synergy</span>
          <span style={{ fontWeight: 'bold', color: '#10b981' }}>{synergyScore}%</span>
        </div>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${synergyScore}%`, background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export function RecommendationPanel({ squad }) {
  const players = squad?.players || [];

  // Tactical Recommendations Logic
  const getTacticalTips = () => {
    const tips = [];
    const hasGK = players.some(p => p.position === 'GK' && ['Goalkeeper', 'Sweeper Keeper'].includes(p.type));
    const hasPlaymaker = players.some(p => ['Producer', 'Architect', 'Commander'].includes(p.type));
    const hasFinisher = players.some(p => ['Speedster', 'Intruder', 'Hammer', 'Prowler'].includes(p.type));

    if (!hasGK) {
      tips.push({ title: 'Goalkeeper Selection', desc: 'Assign "Goalkeeper" or "Sweeper Keeper" to your GK slot for optimum shot-stopping synergy.', status: 'warning' });
    } else {
      tips.push({ title: 'Solid Goalkeeping', desc: 'Your GK behavior matches standard defensive positioning.', status: 'success' });
    }

    if (!hasPlaymaker) {
      tips.push({ title: 'Missing Playmaker', desc: 'Consider adding a "Producer" or "Architect" in Midfield for higher assist rates.', status: 'warning' });
    } else {
      tips.push({ title: 'Creative Midfield', desc: 'Playmaker roles active. Ball distribution efficiency is boosted.', status: 'success' });
    }

    if (!hasFinisher) {
      tips.push({ title: 'Attack Power', desc: 'Add a "Speedster" or "Hammer" up front to convert chances inside the penalty box.', status: 'warning' });
    } else {
      tips.push({ title: 'Lethal Attack', desc: 'Attackers have direct scoring profiles selected.', status: 'success' });
    }

    return tips;
  };

  const tips = getTacticalTips();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {tips.map((tip, idx) => (
        <div 
          key={idx} 
          style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: '6px', 
            backgroundColor: tip.status === 'warning' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            borderLeft: `4px solid ${tip.status === 'warning' ? '#eab308' : '#10b981'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem'
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: tip.status === 'warning' ? '#fde047' : '#6ee7b7' }}>
            {tip.status === 'warning' ? '⚠️' : '✅'} {tip.title}
          </span>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{tip.desc}</p>
        </div>
      ))}
    </div>
  );
}
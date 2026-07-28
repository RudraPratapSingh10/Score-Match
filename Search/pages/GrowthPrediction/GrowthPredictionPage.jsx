import React, { useState } from 'react';
import { useSquad } from '../../hooks/useSquad'; // Path check kar lein (../../hooks/useSquad)

export function GrowthPredictionPage() {
  const { squad } = useSquad();
  const rawPlayers = squad?.players || squad?.slots || [];

  // Target Upgrade Bump State (+1, +2, +3 Levels)
  const [targetUpgrade, setTargetUpgrade] = useState(1);

  // Current Metrics
  const currentTotalLevel = rawPlayers.reduce((acc, slot) => {
    return acc + (slot.level || slot.player?.level || 1);
  }, 0);

  const filledSlots = rawPlayers.filter(s => s.playerId || s.name || s.player?.name).length || 1;
  const currentAvgLevel = (currentTotalLevel / filledSlots).toFixed(1);

  // Growth Predictions
  const projectedAvgLevel = (parseFloat(currentAvgLevel) + targetUpgrade).toFixed(1);
  
  const currentPowerScore = Math.round(currentTotalLevel * 10);
  const projectedPowerScore = Math.round(currentPowerScore + (filledSlots * targetUpgrade * 10));
  
  const currentWinRate = Math.min(88, Math.max(30, Math.round(currentAvgLevel * 8)));
  const projectedWinRate = Math.min(96, Math.max(35, currentWinRate + (targetUpgrade * 7)));

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Growth Prediction Engine</h1>

      {/* Level Target Selector */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <label style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'bold' }}>
          Simulate Level-Up Goal For Current Lineup:
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[1, 2, 3].map(lvl => (
            <button
              key={lvl}
              onClick={() => setTargetUpgrade(lvl)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: targetUpgrade === lvl ? '#3b82f6' : '#334155',
                backgroundColor: targetUpgrade === lvl ? 'rgba(59, 130, 246, 0.2)' : '#0f172a',
                color: targetUpgrade === lvl ? '#60a5fa' : '#cbd5e1',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              +{lvl} Level Upgrade
            </button>
          ))}
        </div>
      </div>

      {/* Projection Comparison Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Metric 1: Average Card Level */}
        <div style={{ padding: '1.25rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
            Average Squad Level
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc' }}>{currentAvgLevel}</span>
            <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 'bold' }}>➔ {projectedAvgLevel}</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
            Based on active lineup slots
          </span>
        </div>

        {/* Metric 2: Team Power Score */}
        <div style={{ padding: '1.25rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
            Overall Power Score
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc' }}>{currentPowerScore}</span>
            <span style={{ fontSize: '1.2rem', color: '#3b82f6', fontWeight: 'bold' }}>➔ {projectedPowerScore}</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem', display: 'block' }}>
            +{projectedPowerScore - currentPowerScore} Power Gain
          </span>
        </div>

        {/* Metric 3: Projected Win Rate */}
        <div style={{ padding: '1.25rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
            Projected Win Potential
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc' }}>{currentWinRate}%</span>
            <span style={{ fontSize: '1.2rem', color: '#f59e0b', fontWeight: 'bold' }}>➔ {projectedWinRate}%</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
            Expected performance boost
          </span>
        </div>
      </div>

      {/* High Priority Upgrade Focus */}
      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#f8fafc' }}>
        Priority Upgrade Recommendations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {rawPlayers.slice(0, 4).map((slot, index) => {
          const role = slot.role || slot.type || slot.player?.role || slot.behavior || 'Guard';
          const name = slot.name || slot.player?.name ? `(${slot.name || slot.player?.name})` : '';
          const pos = slot.position || slot.slotPosition || 'CB';
          const currentLvl = slot.level || slot.player?.level || 1;

          return (
            <div key={slot.id || index} style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#1e293b',
              borderRadius: '10px',
              border: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#3b82f6', fontSize: '1rem', display: 'block' }}>
                  {role} {name} <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>[{pos}]</span>
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  Current Level: <strong style={{ color: '#fff' }}>{currentLvl}</strong>
                </span>
              </div>

              <span style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                Target: Lvl {currentLvl + targetUpgrade}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default GrowthPredictionPage;
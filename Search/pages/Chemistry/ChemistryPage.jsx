import React from 'react';
import { useSquad } from '../../hooks/useSquad'; // Path adjustment agar sub-folder deep hai

export function ChemistryPage() {
  const { squad } = useSquad();
  const rawPlayers = squad?.players || squad?.slots || [];

  // 1. Calculate Chemistry Metrics
  const assignedCount = rawPlayers.filter(s => s.playerId || s.name || s.player?.name).length;
  
  // Base chemistry calculation based on filled slots and player levels
  const baseChem = rawPlayers.reduce((acc, slot) => {
    const lvl = slot.level || slot.player?.level || 1;
    const isAssigned = slot.playerId || slot.name || slot.player?.name;
    return acc + (isAssigned ? Math.min(10, lvl + 2) : 0);
  }, 0);

  const maxChem = 110;
  const chemistryScore = Math.min(100, Math.round((baseChem / maxChem) * 100));

  // Synergy Tier Determination
  let synergyTier = 'Basic';
  let tierColor = '#94a3b8';
  let bonusMultiplier = '1.0x';

  if (chemistryScore >= 85) {
    synergyTier = 'Ultimate Synergy';
    tierColor = '#10b981'; // Green
    bonusMultiplier = '1.25x Speed & Response Boost';
  } else if (chemistryScore >= 60) {
    synergyTier = 'Advanced Synergy';
    tierColor = '#3b82f6'; // Blue
    bonusMultiplier = '1.15x Passing Boost';
  } else if (chemistryScore >= 40) {
    synergyTier = 'Moderate Synergy';
    tierColor = '#f59e0b'; // Amber
    bonusMultiplier = '1.05x Base Stat Boost';
  }

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Chemistry & Synergy Center</h1>

      {/* Top Banner: Overall Chemistry Status */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 'bold' }}>
            Squad Team Chemistry
          </h3>
          <span style={{
            backgroundColor: tierColor,
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}>
            {synergyTier}
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
            <span>Chemistry Rating</span>
            <strong style={{ color: '#fff' }}>{chemistryScore}%</strong>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#0f172a', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{
              width: `${chemistryScore}%`,
              height: '100%',
              backgroundColor: tierColor,
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
          💡 Active Bonus: <strong style={{ color: '#38bdf8' }}>{bonusMultiplier}</strong>
        </p>
      </div>

      {/* Positional Synergy Breakdown */}
      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#f8fafc' }}>
        Positional Synergy Breakdown ({assignedCount}/11 Lineup)
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {rawPlayers.map((slot, index) => {
          const role = slot.role || slot.type || slot.player?.role || slot.behavior || 'Guard';
          const name = slot.name || slot.player?.name ? `(${slot.name || slot.player?.name})` : '';
          const pos = slot.position || slot.slotPosition || 'CB';
          const lvl = slot.level || slot.player?.level || 1;
          const slotChem = Math.min(100, lvl * 10);

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>
                  {pos} Slot
                </span>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>
                  {slotChem}% Link
                </span>
              </div>

              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3b82f6', display: 'block' }}>
                  {role} {name}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Level {lvl} Card
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default ChemistryPage;
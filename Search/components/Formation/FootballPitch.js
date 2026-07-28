import React from 'react';
import { PlayerCard } from '../Player/PlayerCard.jsx';

export function FootballPitch({ squad, onSlotClick }) {
  const players = squad?.players || [];

  return (
    <div className="pitch-container" style={{ minHeight: '420px', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', alignItems: 'center' }}>
      {players.map((p, idx) => (
        <PlayerCard key={p.id || idx} player={p} onClick={() => onSlotClick && onSlotClick(p)} />
      ))}
    </div>
  );
}
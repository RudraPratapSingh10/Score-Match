import React from 'react';

export function PlayerCard({ player, onClick }) {
  if (!player) return null;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{player.type || player.behaviour || 'Player'}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pos: {player.position || 'N/A'}</div>
      </div>
      <div style={{
        backgroundColor: 'var(--primary)',
        color: '#000',
        fontWeight: 'bold',
        padding: '0.2rem 0.6rem',
        borderRadius: '6px',
        fontSize: '0.85rem'
      }}>
        Lvl {player.level || 1}
      </div>
    </div>
  );
}
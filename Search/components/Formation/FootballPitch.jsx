import React from 'react';

export function FootballPitch({ squad, onSlotClick }) {
  const players = squad?.players || [];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '480px',
      backgroundColor: '#15803d',
      backgroundImage: `
        linear-gradient(to bottom, rgba(255,255,255,0.08) 50%, transparent 50%),
        radial-gradient(circle, rgba(255,255,255,0.12) 2px, transparent 2px)
      `,
      backgroundSize: '100% 80px, 20px 20px',
      borderRadius: '12px',
      border: '4px solid #f8fafc',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.5)'
    }}>
      {/* Pitch Lines */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: '90px', height: '90px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', transform: 'translate(-50%, -50%)' }} />

      {/* Render Players in Correct Formation Positions */}
      {players.map((player) => {
        const posX = player.x ?? 50;
        const posY = player.y ?? 50;

        return (
          <div
            key={player.id}
            onClick={() => onSlotClick && onSlotClick(player)}
            style={{
              position: 'absolute',
              left: `${posX}%`,
              top: `${posY}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            {/* Player Badge */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#0f172a',
              border: '2px solid #10b981',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#10b981' }}>
                {player.position}
              </span>
              <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
                L{player.level || 1}
              </span>
            </div>

            {/* Auto-Assigned Player Name & Behavior */}
            <div style={{
              marginTop: '3px',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid #334155',
              fontSize: '0.65rem',
              color: '#f8fafc',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              <strong>{player.name}</strong> ({player.type})
            </div>
          </div>
        );
      })}
    </div>
  );
}
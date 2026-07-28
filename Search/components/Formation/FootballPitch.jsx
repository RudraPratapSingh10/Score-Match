import React from 'react';
import { FORMATIONS } from '../../constants/formations';
import './FootballPitch.css';

export function FootballPitch({ squad, selectedFormation = '4-3-3', onSlotClick }) {
  const players = squad?.players || [];
  const activeFormation = FORMATIONS.find(f => f.id === selectedFormation) || FORMATIONS[0];

  return (
    <div className="pitch-wrapper">
      <div className="football-pitch">
        {/* Ground Markings */}
        <div className="pitch-line center-line" />
        <div className="pitch-circle center-circle" />
        <div className="penalty-area top-penalty" />
        <div className="penalty-area bottom-penalty" />

        {/* Players Placement on Ground */}
        {activeFormation.positions.map((pos, idx) => {
          const player = players[idx];

          return (
            <div
              key={idx}
              className="pitch-player-node"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onSlotClick && onSlotClick(player, pos)}
            >
              <div className="jersey-badge">
                {player ? player.rating || '80' : pos.role}
              </div>
              <div className="player-label-card">
                <span className="player-name-text">
                  {player ? player.name : `[${pos.role}]`}
                </span>
                {player && (
                  <span className="player-level-badge">
                    Lvl {player.level || 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
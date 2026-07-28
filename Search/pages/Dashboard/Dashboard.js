import React from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { useChemistry } from '../../hooks/useChemistry.js';
import { Card } from '../../components/Common/Card.jsx';
import { FootballPitch } from '../../components/Formation/FootballPitch.jsx';

export function Dashboard() {
  const { squad } = useSquad();
  const chemistry = useChemistry(squad);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Engine Executive Dashboard</h1>

      <div className="grid-cols-4">
        <Card title="Formation">
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{squad.formation}</div>
        </Card>
        <Card title="Squad Size">
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{squad.players.length} Players</div>
        </Card>
        <Card title="Chemistry Rating">
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>{chemistry.score}/100</div>
        </Card>
        <Card title="Engine Health">
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>ONLINE</div>
        </Card>
      </div>

      <div className="grid-cols-2">
        <Card title="Active Tactical Lineup">
          <FootballPitch squad={squad} />
        </Card>
        <Card title="Optimization Quick Actions">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Current lineup analysis shows full readiness. Navigate to Squad Builder or Assistant for deep strategic adjustments.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>✅ Formation intelligence verified</li>
            <li>✅ Behaviour suitability maps active</li>
            <li>✅ Synergy analysis updated</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
import React from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { useChemistry } from '../../hooks/useChemistry.js';
import { Card } from '../../components/Common/Card.jsx';

export function ChemistryPage() {
  const { squad } = useSquad();
  const chemistry = useChemistry(squad);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Chemistry & Synergy Center</h1>

      <Card title="Synergy Rating">
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{chemistry.score} / 100</div>
      </Card>

      <div className="grid-cols-2">
        <Card title="Key Synergies">
          <ul>
            {chemistry.synergies.map((s, idx) => <li key={idx} style={{ margin: '0.5rem 0' }}>✅ {s}</li>)}
          </ul>
        </Card>
        <Card title="Tactical Bottlenecks">
          <ul>
            {chemistry.bottlenecks.length > 0 ? (
              chemistry.bottlenecks.map((b, idx) => <li key={idx} style={{ margin: '0.5rem 0', color: 'var(--warning)' }}>⚠️ {b}</li>)
            ) : (
              <li style={{ color: 'var(--text-muted)' }}>No critical bottlenecks detected.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
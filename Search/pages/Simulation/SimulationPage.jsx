import React, { useState } from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { runSimulation } from '../../services/engine-api-adapter.js';
import { Card } from '../../components/Common/Card.jsx';
import { Button } from '../../components/Common/Button.jsx';

export function SimulationPage() {
  const { squad } = useSquad();
  const [result, setResult] = useState(null);

  const handleSimulate = () => {
    const res = runSimulation(squad);
    setResult(res);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Scenario Simulation Engine</h1>

      <Card title="Simulate Match Scenario">
        <p style={{ marginBottom: '1rem' }}>Test active lineup against standard benchmark formations under strict deterministic execution.</p>
        <Button onClick={handleSimulate}>Run Tactical Simulation</Button>
      </Card>

      {result && (
        <Card title="Simulation Outcome">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            {result.winProbability}% Projected Win Rate
          </div>
          <p>{result.summary}</p>
        </Card>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { predictGrowth } from '../../services/engine-api-adapter.js';
import { Card } from '../../components/Common/Card.jsx';
import { BarChart } from '../../components/Charts/BarChart.jsx';

export function GrowthPredictionPage() {
  const [targetLevel, setTargetLevel] = useState(10);
  const growth = predictGrowth({ type: 'Speedster', level: 5 }, targetLevel);

  const chartData = Object.entries(growth.keyStatGains).map(([label, value]) => ({ label, value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Growth Prediction Engine</h1>

      <Card title="Level Target Adjustment">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Target Level: {targetLevel}</label>
        <input
          type="range"
          min="1"
          max="11"
          value={targetLevel}
          onChange={(e) => setTargetLevel(Number(e.target.value))}
          style={{ width: '100%', maxWidth: '300px' }}
        />
      </Card>

      <Card title={`Growth Projection for ${growth.behaviour} (Target: Lvl ${targetLevel})`}>
        <BarChart data={chartData} />
      </Card>
    </div>
  );
}
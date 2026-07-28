import React from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { useRecommendations } from '../../hooks/useRecommendations.js';
import { Card } from '../../components/Common/Card.jsx';
import { Loader } from '../../components/Common/Loader.jsx';

export function RecommendationsPage() {
  const { squad } = useSquad();
  const { recommendations, loading } = useRecommendations(squad);

  if (loading) return <Loader text="Evaluating positional fit & suitability..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Recommendation Center</h1>
      <Card title="Engine Strategic Analysis">
        <p style={{ marginBottom: '1rem' }}>{recommendations?.explanation}</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>Confidence Score:</span>
          <span style={{ backgroundColor: 'var(--primary)', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>
            {recommendations?.confidence || 90}%
          </span>
        </div>
      </Card>

      <div className="grid-cols-2">
        {recommendations?.recommendations?.map((item, idx) => (
          <Card key={idx} title={`Positional Fit #${idx + 1}`}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{item.behaviour || item.type || 'Guard'}</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Position: {item.position || 'CB'}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
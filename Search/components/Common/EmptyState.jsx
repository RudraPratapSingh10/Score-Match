import React from 'react';

export function EmptyState({ message = 'No data available.' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
      <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>⚽</p>
      <p>{message}</p>
    </div>
  );
}
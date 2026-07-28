import React from 'react';

export function ErrorState({ error = 'An error occurred.' }) {
  return (
    <div style={{
      padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)'
    }}>
      ⚠️ {error}
    </div>
  );
}
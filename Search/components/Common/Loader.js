import React from 'react';

export function Loader({ text = 'Engine calculating...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', gap: '1rem' }}>
      <div style={{
        width: '40px', height: '40px', border: '4px solid var(--border)',
        borderTop: '4px solid var(--primary)', borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>
    </div>
  );
}
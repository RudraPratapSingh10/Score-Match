import React from 'react';

export function BarChart({ data = [] }) {
  const maxVal = Math.max(...data.map(d => d.value), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {data.map((item, idx) => (
        <div key={idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            <span>{item.label}</span>
            <span style={{ fontWeight: 'bold' }}>{item.value}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${(item.value / maxVal) * 100}%`,
              height: '100%',
              backgroundColor: item.color || 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
import React from 'react';

export function Card({ title, children, className = '' }) {
  return (
    <div className={`card-gradient ${className}`}>
      {title && <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>}
      {children}
    </div>
  );
}
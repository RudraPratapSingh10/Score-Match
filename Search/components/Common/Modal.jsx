import React from 'react';
import { Button } from './Button.jsx';

export function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card-gradient" style={{ width: '90%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>{title}</h2>
          <Button variant="secondary" onClick={onClose}>✕</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
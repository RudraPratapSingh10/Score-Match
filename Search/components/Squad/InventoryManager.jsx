import React, { useState } from 'react';
import { Button } from '../Common/Button.jsx';

const BEHAVIOURS = [
  'Guard', 'Protector', 'Engine', 'Commander', 'Producer', 
  'Prowler', 'Speedster', 'Intruder', 'Hammer', 'Architect', 
  'Infiltrator', 'Explorer', 'Menace', 'Goalkeeper', 'Sweeper Keeper'
];

export function InventoryManager({ playerPool, onAdd, onRemove, onUpdate, onAutoOptimize }) {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Speedster');
  const [newLevel, setNewLevel] = useState(8);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd({ name: newName, type: newType, level: Number(newLevel) });
    setNewName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      
      {/* Auto-Optimize CTA Banner */}
      <div style={{
        padding: '0.85rem 1rem',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        border: '1px solid #10b981',
        borderRadius: '8px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          <strong style={{ color: '#10b981', display: 'block' }}>⚡ Smart Best-11 Auto Optimizer</strong>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
            System aapke {playerPool.length} Unlocked Cards me se best roles & levels auto-pick karke lineup set karega.
          </span>
        </div>
        <Button onClick={onAutoOptimize} variant="primary">⚡ Recalculate Best Lineup</Button>
      </div>

      {/* Add New Player Card Form */}
      <form onSubmit={handleAdd} style={{
        display: 'flex',
        gap: '0.6rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #334155'
      }}>
        <input
          type="text"
          placeholder="Player Card Name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{
            flex: '1',
            minWidth: '130px',
            padding: '0.45rem 0.6rem',
            backgroundColor: '#0f172a',
            color: '#fff',
            border: '1px solid #334155',
            borderRadius: '6px',
            fontSize: '0.85rem'
          }}
        />

        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          style={{
            padding: '0.45rem 0.6rem',
            backgroundColor: '#0f172a',
            color: '#fff',
            border: '1px solid #334155',
            borderRadius: '6px',
            fontSize: '0.85rem'
          }}
        >
          {BEHAVIOURS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Lvl:</span>
          <input
            type="number"
            min="1"
            max="11"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            style={{
              width: '55px',
              padding: '0.45rem',
              backgroundColor: '#0f172a',
              color: '#fff',
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <Button type="submit" variant="secondary">+ Add Card</Button>
      </form>

      {/* Roster Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.75rem',
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {playerPool.map((p) => (
          <div key={p.id} style={{
            padding: '0.6rem 0.8rem',
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '6px',
            border: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{p.name}</strong>
              <button 
                onClick={() => onRemove(p.id)}
                style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select
                value={p.type}
                onChange={(e) => onUpdate(p.id, { type: e.target.value })}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#10b981',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  padding: '2px 4px'
                }}
              >
                {BEHAVIOURS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lvl</span>
                <input
                  type="number"
                  min="1"
                  max="11"
                  value={p.level}
                  onChange={(e) => onUpdate(p.id, { level: Number(e.target.value) })}
                  style={{
                    width: '45px',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    padding: '2px 4px'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
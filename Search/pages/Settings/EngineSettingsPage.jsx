import React, { useState } from 'react';
import { useSquad } from '../../hooks/useSquad';

export function EngineSettingsPage() {
  const { squad } = useSquad();
  
  // Settings State Toggles
  const [autoSave, setAutoSave] = useState(true);
  const [engineMode, setEngineMode] = useState('balanced'); // balanced, aggressive, defensive
  const [highPrecision, setHighPrecision] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  // Handle Save Settings Action
  const handleSaveSettings = () => {
    const settingsPayload = {
      autoSave,
      engineMode,
      highPrecision,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('score_match_engine_settings', JSON.stringify(settingsPayload));
    setSaveStatus('Settings successfully saved to persistence layer!');
    
    setTimeout(() => {
      setSaveStatus('');
    }, 3000);
  };

  // Handle Clear Storage Action
  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to reset all saved engine configurations?')) {
      localStorage.removeItem('score_match_engine_settings');
      setSaveStatus('Local persistence cache cleared.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Engine Settings & Persistence</h1>
        {saveStatus && (
          <span style={{ fontSize: '0.85rem', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {saveStatus}
          </span>
        )}
      </div>

      {/* Settings Panel Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Card 1: Persistence Configuration */}
        <div style={{ padding: '1.25rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 'bold' }}>Persistence & Caching</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block' }}>Auto-Save Squad State</strong>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Automatically sync modifications to storage</span>
            </div>
            <input 
              type="checkbox" 
              checked={autoSave} 
              onChange={(e) => setAutoSave(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block' }}>High Precision Calculation</strong>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Factor fractional stats in win rates</span>
            </div>
            <input 
              type="checkbox" 
              checked={highPrecision} 
              onChange={(e) => setHighPrecision(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Card 2: Engine Computation Mode */}
        <div style={{ padding: '1.25rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 'bold' }}>Calculation Engine Mode</h3>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
              Default Simulation Weighting
            </label>
            <select 
              value={engineMode}
              onChange={(e) => setEngineMode(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155' }}
            >
              <option value="balanced">Balanced Weights (Default)</option>
              <option value="aggressive">Offensive / Speed Weighted</option>
              <option value="defending">Defensive Stability Weighted</option>
            </select>
          </div>

          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Active Squad Formation in memory: <strong style={{ color: '#38bdf8' }}>{squad?.formation || '4-3-3'}</strong>
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button 
          onClick={handleSaveSettings}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Save Configuration
        </button>
        <button 
          onClick={handleClearCache}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: '#ef4444',
            fontWeight: 'bold',
            border: '1px solid #ef4444',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Reset Storage Cache
        </button>
      </div>
    </div>
  );
}

export default EngineSettingsPage;
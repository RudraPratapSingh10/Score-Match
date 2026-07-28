import React, { useState, useEffect } from 'react';
import { Button } from '../Common/Button.jsx';

export function SquadManager({ squad, setSquad, resetSquad }) {
  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem('sm_presets');
    return saved ? JSON.parse(saved) : {};
  });
  const [presetName, setPresetName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('sm_presets', JSON.stringify(presets));
  }, [presets]);

  // Save Current Preset
  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    setPresets(prev => ({
      ...prev,
      [presetName.trim()]: squad
    }));
    setPresetName('');
  };

  // Load Preset
  const handleLoadPreset = (name) => {
    if (presets[name]) {
      setSquad(presets[name]);
    }
  };

  // Delete Preset
  const handleDeletePreset = (name) => {
    setPresets(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  // Export JSON File
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(squad, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `squad_${squad.formation}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON File
  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.formation && parsed.players) {
            setSquad(parsed);
          } else {
            alert('Invalid Squad JSON file format!');
          }
        } catch (err) {
          alert('Error parsing JSON file!');
        }
      };
    }
  };

  // Copy Tactical Summary to Clipboard
  const handleCopySummary = () => {
    const summary = `⚽ SQUAD SUMMARY ⚽
Formation: ${squad.formation}
Players:
${squad.players.map(p => `- ${p.position || 'SLOT'}: ${p.type} (Lvl ${p.level})`).join('\n')}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Save & Load Presets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Preset Name (e.g., Ultra Attack)..."
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          style={{
            padding: '0.45rem 0.75rem',
            backgroundColor: 'var(--bg-dark, #0f172a)',
            color: '#fff',
            border: '1px solid var(--border, #334155)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            flex: '1',
            minWidth: '200px'
          }}
        />
        <Button variant="primary" onClick={handleSavePreset}>Save Preset</Button>
        <Button variant="secondary" onClick={handleCopySummary}>
          {copied ? 'Copied! ✅' : 'Copy Summary 📋'}
        </Button>
      </div>

      {/* Preset List Chips */}
      {Object.keys(presets).length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>Saved Presets:</span>
          {Object.keys(presets).map((name) => (
            <div 
              key={name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#1e293b',
                padding: '0.2rem 0.6rem',
                borderRadius: '16px',
                border: '1px solid #334155',
                fontSize: '0.8rem'
              }}
            >
              <span 
                onClick={() => handleLoadPreset(name)} 
                style={{ cursor: 'pointer', color: '#10b981', fontWeight: 'bold' }}
              >
                {name}
              </span>
              <span 
                onClick={() => handleDeletePreset(name)} 
                style={{ cursor: 'pointer', color: '#f43f5e', fontSize: '0.9rem', marginLeft: '2px' }}
              >
                ✕
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Export & Import Row */}
      <div style={{ display: 'flex', gap: '0.75rem', pt: '0.5rem', borderTop: '1px dashed #334155', flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={handleExportJSON}>
          📥 Export JSON
        </Button>

        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#334155',
          color: '#f8fafc',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          📤 Import JSON
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImportJSON} 
            style={{ display: 'none' }} 
          />
        </label>

        <Button variant="secondary" onClick={resetSquad} style={{ marginLeft: 'auto' }}>
          🔄 Reset Default
        </Button>
      </div>

    </div>
  );
}
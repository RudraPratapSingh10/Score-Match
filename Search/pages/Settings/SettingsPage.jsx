import React, { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';
import { Card } from '../../components/Common/Card.jsx';
import { Button } from '../../components/Common/Button.jsx';

export function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useContext(SettingsContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Engine Settings & Persistence</h1>

      <Card title="Optimizer Preferences">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={settings.autoOptimize}
              onChange={(e) => updateSettings({ autoOptimize: e.target.checked })}
            />
            Enable Automatic Background Optimization
          </label>

          <Button variant="danger" onClick={resetSettings}>Reset All Preferences</Button>
        </div>
      </Card>
    </div>
  );
}
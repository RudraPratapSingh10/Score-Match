import React, { useState } from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { Card } from '../../components/Common/Card.jsx';
import { Button } from '../../components/Common/Button.jsx';
import { Modal } from '../../components/Common/Modal.jsx';
import { FootballPitch } from '../../components/Formation/FootballPitch.jsx';
import { FORMATIONS } from '../../constants/formations.js'; // Formations imported directly from central file

const BEHAVIOURS = [
  'Guard', 'Engine', 'Commander', 'Producer', 'Prowler', 
  'Speedster', 'Intruder', 'Hammer', 'Architect', 'Protector',
  'Infiltrator', 'Explorer', 'Maniac', 'Standard Goalkeeper', 'Sweeper Keeper'
];

export function SquadBuilder() {
  const { squad, updateFormation, updatePlayer, resetSquad } = useSquad();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Squad Builder</h1>
        <Button variant="secondary" onClick={resetSquad}>Reset Squad</Button>
      </div>

      <Card title="Formation Selection">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {FORMATIONS.map(fmt => (
            <Button
              key={fmt.id}
              variant={squad.formation === fmt.id ? 'primary' : 'secondary'}
              onClick={() => updateFormation(fmt.id)}
            >
              {fmt.name}
            </Button>
          ))}
        </div>
      </Card>

      <Card title="Pitch Assignments">
        <FootballPitch 
          squad={squad} 
          selectedFormation={squad.formation} 
          onSlotClick={(p) => setSelectedPlayer(p)} 
        />
      </Card>

      <Modal isOpen={!!selectedPlayer} title="Edit Player Slot" onClose={() => setSelectedPlayer(null)}>
        {selectedPlayer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Behaviour Type</label>
              <select
                value={selectedPlayer.type}
                onChange={(e) => {
                  const updatedType = e.target.value;
                  updatePlayer(selectedPlayer.id, { type: updatedType });
                  setSelectedPlayer(prev => ({ ...prev, type: updatedType }));
                }}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px' }}
              >
                {BEHAVIOURS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Level ({selectedPlayer.level})</label>
              <input
                type="range"
                min="1"
                max="11"
                value={selectedPlayer.level}
                onChange={(e) => {
                  const newLevel = Number(e.target.value);
                  updatePlayer(selectedPlayer.id, { level: newLevel });
                  setSelectedPlayer(prev => ({ ...prev, level: newLevel }));
                }}
                style={{ width: '100%' }}
              />
            </div>
            <Button onClick={() => setSelectedPlayer(null)}>Save & Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
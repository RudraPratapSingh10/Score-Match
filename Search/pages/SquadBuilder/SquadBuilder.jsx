import React, { useState } from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { Card } from '../../components/Common/Card.jsx';
import { Button } from '../../components/Common/Button.jsx';
import { Modal } from '../../components/Common/Modal.jsx';
import { FootballPitch } from '../../components/Formation/FootballPitch.jsx';
import { AnalyticsDashboard } from '../../components/Analytics/AnalyticsDashboard.jsx';
import { RecommendationPanel } from '../../components/Analytics/RecommendationPanel.jsx';
import { SquadManager } from '../../components/Squad/SquadManager.jsx';
import { MatchSimulator } from '../../components/Simulator/MatchSimulator.jsx';
import { FORMATIONS } from '../../constants/formations.js';

const BEHAVIOURS = [
  { name: 'Guard', description: 'Defensive anchor, stays back to break opponent attacks.', attributes: 'Tackling, Strength, Marking' },
  { name: 'Protector', description: 'Physical defender focused on winning aerial duels and physical contests.', attributes: 'Heading, Strength, Jumping' },
  { name: 'Engine', description: 'High stamina midfielder driving box-to-box play nonstop.', attributes: 'Stamina, Work Rate, Passing' },
  { name: 'Commander', description: 'Tactical leader controlling midfield tempo and distributing passes.', attributes: 'Passing, Vision, Control' },
  { name: 'Producer', description: 'Creative playmaker delivering precise key assists into open spaces.', attributes: 'Crossing, Vision, Curve' },
  { name: 'Prowler', description: 'Opportunistic attacker sniffing out second balls around the box.', attributes: 'Reaction, Finishing, Off-Ball' },
  { name: 'Speedster', description: 'Fast attacker making sharp runs behind opponent defensive lines.', attributes: 'Pace, Acceleration, Dribbling' },
  { name: 'Intruder', description: 'Agile forward penetrating tight defense channels.', attributes: 'Agility, Speed, Finishing' },
  { name: 'Hammer', description: 'Power shooter with high long-range shot strength.', attributes: 'Shot Power, Long Shots, Strength' },
  { name: 'Architect', description: 'Precision passer mapping out open space for tactical setups.', attributes: 'Long Pass, Vision, Composure' },
  { name: 'Infiltrator', description: 'Explosive player cutting through tight gaps in opponent defensive lines.', attributes: 'Dribbling, Burst Speed, Balance' },
  { name: 'Explorer', description: 'Roaming player actively seeking unoccupied spaces across the pitch.', attributes: 'Positioning, Versatility, Stamina' },
  { name: 'Menace', description: 'Unpredictable and aggressive attacker constantly pressure-testing defenders.', attributes: 'Aggression, Pressing, Strength' },
  { name: 'Goalkeeper', description: 'Traditional shot-stopper holding the goal line.', attributes: 'Reflexes, Handling, Positioning' },
  { name: 'Sweeper Keeper', description: 'Modern goalkeeper active in clearing balls outside the penalty area.', attributes: 'Kicking, Rush Out, Anticipation' }
];

export function SquadBuilder() {
  const { squad, setSquad, updateFormation, updatePlayer, resetSquad } = useSquad();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleLevelChange = (id, level) => {
    updatePlayer(id, { level });
    if (selectedPlayer && selectedPlayer.id === id) {
      setSelectedPlayer(prev => ({ ...prev, level }));
    }
  };

  const handleBehaviourChange = (id, type) => {
    updatePlayer(id, { type });
    if (selectedPlayer && selectedPlayer.id === id) {
      setSelectedPlayer(prev => ({ ...prev, type }));
    }
  };

  const activeBehavior = BEHAVIOURS.find(b => b.name === selectedPlayer?.type) || BEHAVIOURS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Squad Builder</h1>
      </div>

      {/* Preset Manager & Export Tools */}
      <Card title="Preset Manager & Export Tools">
        <SquadManager squad={squad} setSquad={setSquad} resetSquad={resetSquad} />
      </Card>

      {/* Phase 5: Opponent Simulator */}
      <Card title="Opponent Match Counter Simulator">
        <MatchSimulator squad={squad} />
      </Card>

      {/* Analytics Dashboard */}
      <Card title="Squad Performance & Ratings">
        <AnalyticsDashboard squad={squad} />
      </Card>

      {/* Formation Selector */}
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

      {/* 2D Pitch View */}
      <Card title="Pitch View">
        <FootballPitch 
          squad={squad} 
          selectedFormation={squad.formation} 
          onSlotClick={(p) => setSelectedPlayer(p)} 
        />
      </Card>

      {/* Tactical Recommendations */}
      <Card title="Tactical Recommendations & Reasoning">
        <RecommendationPanel squad={squad} />
      </Card>

      {/* Player Slot & Behavior Settings */}
      <Card title="Player Slot & Behavior Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {squad.players.map((player) => (
            <div 
              key={player.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'space-between', 
                gap: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '8px',
                border: '1px solid var(--border, #334155)'
              }}
            >
              <div style={{ minWidth: '80px' }}>
                <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '0.9rem' }}>
                  {player.position || 'SLOT'}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <select
                  value={player.type || 'Guard'}
                  onChange={(e) => handleBehaviourChange(player.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.6rem',
                    backgroundColor: 'var(--bg-dark, #0f172a)',
                    color: '#fff',
                    border: '1px solid var(--border, #334155)',
                    borderRadius: '6px'
                  }}
                >
                  {BEHAVIOURS.map(b => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ width: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="range"
                  min="1"
                  max="11"
                  value={player.level || 1}
                  onChange={(e) => handleLevelChange(player.id, Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }}
                />
                <span style={{ minWidth: '50px', fontWeight: 'bold', color: '#10b981', fontSize: '0.85rem' }}>
                  Lvl {player.level || 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Player Modal */}
      <Modal isOpen={!!selectedPlayer} title="Edit Player Slot" onClose={() => setSelectedPlayer(null)}>
        {selectedPlayer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.35rem' }}>
                Behavior Role
              </label>
              <select
                value={selectedPlayer.type || 'Guard'}
                onChange={(e) => handleBehaviourChange(selectedPlayer.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  backgroundColor: 'var(--bg-dark, #0f172a)',
                  color: '#fff',
                  border: '1px solid var(--border, #334155)',
                  borderRadius: '6px'
                }}
              >
                {BEHAVIOURS.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>

              <div style={{
                marginTop: '0.6rem',
                padding: '0.6rem 0.8rem',
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                borderLeft: '3px solid #10b981',
                borderRadius: '4px'
              }}>
                <p style={{ fontSize: '0.8rem', color: '#f8fafc', margin: 0 }}>
                  💡 {activeBehavior.description}
                </p>
                <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 600, display: 'block', marginTop: '0.25rem' }}>
                  Key Traits: {activeBehavior.attributes}
                </span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Player Level</label>
                <span style={{ backgroundColor: '#10b981', color: '#022c22', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  Lvl {selectedPlayer.level || 1}
                </span>
              </div>
              
              <input
                type="range"
                min="1"
                max="11"
                value={selectedPlayer.level || 1}
                onChange={(e) => handleLevelChange(selectedPlayer.id, Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }}
              />
            </div>

            <Button onClick={() => setSelectedPlayer(null)}>Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
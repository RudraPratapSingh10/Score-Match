import React from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { Card } from '../../components/Common/Card.jsx';
import { Button } from '../../components/Common/Button.jsx';
import { FootballPitch } from '../../components/Formation/FootballPitch.jsx';
import { SquadManager } from '../../components/Squad/SquadManager.jsx';
import { MatchSimulator } from '../../components/Simulator/MatchSimulator.jsx';
import { InventoryManager } from '../../components/Squad/InventoryManager.jsx';
import { FORMATIONS } from '../../constants/formations.js';

export function SquadBuilder() {
  const { 
    squad, 
    setSquad, 
    playerPool, 
    addInventoryPlayer, 
    removeInventoryPlayer, 
    updateInventoryPlayer, 
    updateFormation, 
    resetSquad,
    autoOptimize
  } = useSquad();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
      <h1>Score Match Squad Builder</h1>

      {/* Preset Manager */}
      <Card title="Preset Manager & Export Tools">
        <SquadManager squad={squad} setSquad={setSquad} resetSquad={resetSquad} />
      </Card>

      {/* 1. PLAYER CARDS INVENTORY POOL */}
      <Card title="1. Your Unlocked Player Cards Inventory">
        <InventoryManager
          playerPool={playerPool}
          onAdd={addInventoryPlayer}
          onRemove={removeInventoryPlayer}
          onUpdate={updateInventoryPlayer}
          onAutoOptimize={autoOptimize}
        />
      </Card>

      {/* 2. FORMATION SELECTOR */}
      <Card title="2. Select Formation">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {FORMATIONS.map(fmt => (
            <Button
              key={fmt.id}
              variant={squad?.formation === fmt.id ? 'primary' : 'secondary'}
              onClick={() => updateFormation(fmt.id)}
            >
              {fmt.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* 3. OPTIMIZED PITCH VIEW */}
      <Card title="3. Auto-Optimized Starting XI Lineup Pitch">
        <FootballPitch squad={squad} />
      </Card>

      {/* 4. MATCH SIMULATOR */}
      <Card title="4. Opponent Match Simulator">
        <MatchSimulator squad={squad} />
      </Card>

    </div>
  );
}
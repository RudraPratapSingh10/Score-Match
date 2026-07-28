import React from 'react';
import { useSquad } from '../../hooks/useSquad.js';
import { Card } from '../../components/Common/Card.jsx';
import { Button } from '../../components/Common/Button.jsx';
import { FootballPitch } from '../../components/Formation/FootballPitch.jsx';
import { AnalyticsDashboard } from '../../components/Analytics/AnalyticsDashboard.jsx';
import { RecommendationPanel } from '../../components/Analytics/RecommendationPanel.jsx';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Score Match Squad Builder & Optimizer</h1>

      {/* Preset Manager */}
      <Card title="Preset Manager & Export Tools">
        <SquadManager squad={squad} setSquad={setSquad} resetSquad={resetSquad} />
      </Card>

      {/* STEP 1: USER PLAYER CARD INVENTORY POOL */}
      <Card title="1. Your Unlocked Player Cards Inventory (Add All Your Players Here)">
        <InventoryManager
          playerPool={playerPool}
          onAdd={addInventoryPlayer}
          onRemove={removeInventoryPlayer}
          onUpdate={updateInventoryPlayer}
          onAutoOptimize={autoOptimize}
        />
      </Card>

      {/* FORMATION SELECTOR */}
      <Card title="2. Select Formation">
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

      {/* OPTIMIZED PITCH VIEW */}
      <Card title="3. Auto-Optimized Starting XI Lineup Pitch">
        <FootballPitch squad={squad} />
      </Card>

      {/* ANALYTICS & SIMULATOR */}
      <Card title="4. Squad Ratings & Performance">
        <AnalyticsDashboard squad={squad} />
      </Card>

      <Card title="5. Tactical Recommendations">
        <RecommendationPanel squad={squad} />
      </Card>

      <Card title="6. Opponent Match Simulator">
        <MatchSimulator squad={squad} />
      </Card>

    </div>
  );
}
import React, { useState } from 'react';
import { useSquad } from '../../hooks/useSquad';

export function ScenarioSimulation() {
  const { squad } = useSquad();
  const rawPlayers = squad?.players || squad?.slots || [];

  // Scenario Controls State
  const [matchSituation, setMatchSituation] = useState('balanced'); // balanced, trailing, defending_lead
  const [pitchCondition, setPitchCondition] = useState('normal'); // normal, wet, fast
  const [aggressiveness, setAggressiveness] = useState('moderate'); // conservative, moderate, aggressive

  // Dynamic Calculation Logic
  const totalLevel = rawPlayers.reduce((acc, slot) => acc + (slot.level || slot.player?.level || 1), 0);
  const avgLevel = rawPlayers.length > 0 ? totalLevel / rawPlayers.length : 1;

  let baseWinRate = Math.min(85, Math.max(25, Math.round(avgLevel * 7.5)));

  // Apply Scenario Modifiers
  if (matchSituation === 'trailing') baseWinRate -= 12;
  if (matchSituation === 'defending_lead') baseWinRate += 10;
  
  if (pitchCondition === 'wet') baseWinRate -= 5;
  if (pitchCondition === 'fast') baseWinRate += 5;

  if (aggressiveness === 'aggressive') baseWinRate += 8;
  if (aggressiveness === 'conservative') baseWinRate -= 4;

  const finalWinRate = Math.min(98, Math.max(10, baseWinRate));

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Scenario Simulation Engine</h1>

      {/* Control Panel Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        backgroundColor: '#1e293b',
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px solid #334155'
      }}>
        {/* Match State Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            Match State Scenario
          </label>
          <select 
            value={matchSituation} 
            onChange={(e) => setMatchSituation(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155' }}
          >
            <option value="balanced">0 - 0 (Balanced Start)</option>
            <option value="trailing">0 - 1 Trailing (Needs Equalizer)</option>
            <option value="defending_lead">1 - 0 Leading (Defending Goal)</option>
          </select>
        </div>

        {/* Pitch Condition Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            Pitch Condition
          </label>
          <select 
            value={pitchCondition} 
            onChange={(e) => setPitchCondition(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155' }}
          >
            <option value="normal">Standard Dry Pitch</option>
            <option value="wet">Wet / Rainy Pitch (Reduced Speed)</option>
            <option value="fast">Fast AstroTurf (High Response)</option>
          </select>
        </div>

        {/* Tactical Aggressiveness */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            Team Playstyle Risk
          </label>
          <select 
            value={aggressiveness} 
            onChange={(e) => setAggressiveness(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155' }}
          >
            <option value="conservative">Conservative (Possession Focus)</option>
            <option value="moderate">Balanced High Press</option>
            <option value="aggressive">All-Out Attack (High Risk)</option>
          </select>
        </div>
      </div>

      {/* Simulation Result Card */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'block' }}>
            Simulated Success Probability
          </span>
          <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: finalWinRate >= 55 ? '#10b981' : '#f59e0b' }}>
            {finalWinRate}%
          </span>
        </div>

        <div style={{ textAlign: 'right', maxWidth: '300px' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block' }}>
            {matchSituation === 'trailing' && '💡 Tip: Deploy fast Speedsters to break offside traps quickly.'}
            {matchSituation === 'defending_lead' && '💡 Tip: Rely on Guards & Commanders to secure aerial duels.'}
            {matchSituation === 'balanced' && '💡 Tip: Maintain high response players in central midfield.'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScenarioSimulation;
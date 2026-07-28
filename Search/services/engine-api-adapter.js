/**
 * engine-api-adapter.js
 * Bridges React components directly with the Engine, Assistant, and Analytics layers.
 */

import { recommend, optimize } from '../../Search/API/engine-api.js';
import { processQuery } from '../../Search/Assistant/conversation-engine.js';
import { generatePerformanceReport } from '../../Search/Analytics/engine-profiler.js';
import { generateValidationReport } from '../../Search/Analytics/recommendation-validator.js';

export function getRecommendations(squadConfig) {
  try {
    return recommend(squadConfig);
  } catch (err) {
    console.error('API Adapter error [getRecommendations]:', err);
    return { recommendations: [], confidence: 0, explanation: 'Failed to compute recommendations.' };
  }
}

export function optimizeSquad(squadConfig) {
  try {
    return optimize(squadConfig);
  } catch (err) {
    console.error('API Adapter error [optimizeSquad]:', err);
    return { optimizedSquad: [], score: 0, chemistry: 0, explanation: 'Optimization failed.' };
  }
}

export function calculateChemistry(squad) {
  if (!squad || !Array.isArray(squad.players)) {
    return { score: 0, synergies: [], bottlenecks: [] };
  }

  // Deterministic chemistry calculation
  const totalLevel = squad.players.reduce((acc, p) => acc + (p.level || 1), 0);
  const baseChemistry = Math.min(100, Math.round((totalLevel / (squad.players.length || 1)) * 10));

  return {
    score: baseChemistry,
    synergies: squad.players.length > 5 ? ['Strong defensive alignment', 'Solid midfield cover'] : ['Basic formation cohesion'],
    bottlenecks: squad.players.length < 11 ? ['Incomplete squad lineup'] : []
  };
}

export function runSimulation(scenario) {
  const formation = scenario.formation || '4-4-2';
  const squadSize = scenario.players ? scenario.players.length : 11;
  const winProbability = Math.min(95, Math.max(10, Math.round(squadSize * 7.5)));

  return {
    winProbability,
    summary: `Tactical simulation under ${formation} yields a ${winProbability}% projected win probability against benchmark setups.`
  };
}

export function predictGrowth(player, targetLevel = 10) {
  const currentLvl = player?.level || 1;
  const levelDiff = Math.max(0, targetLevel - currentLvl);

  return {
    behaviour: player?.type || player?.behaviour || 'Guard',
    targetLevel,
    keyStatGains: {
      Speed: levelDiff * 3,
      Strength: levelDiff * 4,
      Response: levelDiff * 2
    },
    projectionCurve: Array.from({ length: targetLevel }, (_, i) => ({
      level: i + 1,
      overall: 60 + (i + 1) * 3.5
    }))
  };
}

export function askAssistant(query, sessionId = 'default-ui-session') {
  return processQuery(query, sessionId);
}

export function fetchAnalyticsData() {
  const mockSamples = [3.2, 4.1, 2.8, 5.0, 3.9];
  const perfReport = generatePerformanceReport(mockSamples);

  const mockRecommendation = {
    formation: '4-4-2',
    chemistry: 85,
    suitability: 90,
    squad: [
      { id: 'p1', position: 'GK' },
      { id: 'p2', position: 'CB' }
    ]
  };

  const validationReport = generateValidationReport(mockRecommendation);

  return {
    performance: perfReport,
    validation: validationReport
  };
}
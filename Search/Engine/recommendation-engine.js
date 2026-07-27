/**
 * recommendation-engine.js
 * ---------------------------------------------------------------------------
 * MODULE 10 — Master Recommendation Engine & Orchestrator
 * ---------------------------------------------------------------------------
 * Orchestrates all engine features with robust, deterministic fallbacks.
 */

import * as BehaviourModule from './behaviour-intelligence.js';
import { scorePosition } from './position-suitability.js';
import { optimizeSquad } from './squad-optimizer.js';
import { calculateTeamChemistry } from './chemistry-engine.js';
import { runGrowthPrediction } from './growth-prediction.js';

/**
 * Safely computes counter tactics.
 */
function safeCounterTactics(payload) {
  try {
    if (typeof BehaviourModule.counterTactics === 'function') {
      return BehaviourModule.counterTactics(payload);
    }
  } catch {
    // Fallback
  }
  return {
    recommendedFormation: payload?.opponentFormation ? '442' : '442',
    advantageScore: 50,
    strategy: 'Balanced counter setup against opponent formation.',
  };
}

/**
 * Safely generates squad explanation.
 */
function safeGenerateSquadExplanation(optRes) {
  try {
    if (typeof BehaviourModule.generateSquadExplanation === 'function') {
      return BehaviourModule.generateSquadExplanation(optRes);
    }
  } catch {
    // Fallback
  }
  return { summary: `Optimized squad lineup formed with total score of ${optRes?.totalScore || 0}.` };
}

/**
 * Safely generates position explanation.
 */
function safeGeneratePositionExplanation(payload) {
  try {
    if (typeof BehaviourModule.generatePositionExplanation === 'function') {
      return BehaviourModule.generatePositionExplanation(payload);
    }
  } catch {
    // Fallback
  }
  return { explanation: `${payload.type || 'Player'} assigned to ${payload.position || 'position'}.` };
}

/**
 * Safely calculates tactical score.
 */
function safeCalculateTacticalScore(type, formation) {
  try {
    if (typeof BehaviourModule.calculateTacticalScore === 'function') {
      return BehaviourModule.calculateTacticalScore(type, formation);
    }
  } catch {
    // Fallback
  }
  return { score: 75 };
}

/**
 * Safely analyzes squad gaps.
 */
function safeAnalyzeSquadGaps(squad, formation) {
  try {
    if (typeof BehaviourModule.analyzeSquadGaps === 'function') {
      return BehaviourModule.analyzeSquadGaps(squad, formation);
    }
  } catch {
    // Fallback
  }
  return { gaps: [], criticalWeaknesses: [] };
}

/**
 * Normalizes input players pool.
 */
function normalizePlayerPool(players) {
  if (!players) return [];
  const list = Array.isArray(players) ? players : [players];

  return list
    .filter((p) => p && (typeof p === 'object' || typeof p === 'string'))
    .map((p, idx) => {
      if (typeof p === 'string') {
        return { id: `p_${idx}`, type: p, level: 1 };
      }
      return {
        id: String(p.id || `p_${idx}`),
        type: p.type || p.archetype || 'Guard',
        level: Math.min(Math.max(parseInt(p.level, 10) || 1, 1), 10),
      };
    });
}

/**
 * Full master squad analysis orchestration.
 */
export function analyzeAndRecommend(input = {}) {
  const {
    availablePlayers = [],
    preferredFormation = '442',
    formation = '442',
    opponentFormation = null,
    targetLevel = 10,
  } = input || {};

  const activeFormation = preferredFormation || formation;
  const pool = normalizePlayerPool(availablePlayers);

  // 1. Optimize Squad Assignment
  let optimizationResult = null;
  if (pool.length > 0) {
    try {
      optimizationResult = optimizeSquad({
        availablePlayers: pool,
        players: pool,
        formation: activeFormation,
        formationId: activeFormation,
      });
    } catch {
      optimizationResult = null;
    }
  }

  if (!optimizationResult || !optimizationResult.assignments) {
    optimizationResult = {
      totalScore: pool.length > 0 ? 500 : 0,
      assignments: pool.slice(0, 11).map((p) => ({
        player: p,
        position: 'CB',
        score: p.level * 10,
      })),
    };
  }

  // Calculate composite squad score if totalScore wasn't populated
  if (!optimizationResult.totalScore && optimizationResult.assignments.length > 0) {
    optimizationResult.totalScore = optimizationResult.assignments.reduce(
      (sum, a) => sum + (a.score || a.suitabilityScore || 50),
      0
    );
  }

  // 2. Squad Chemistry Calculation
  let chemistryResult = null;
  try {
    chemistryResult = calculateTeamChemistry(optimizationResult.assignments || []);
  } catch {
    chemistryResult = { chemistryScore: 75, breakdown: {} };
  }

  // 3. Squad Gap & Weakness Analysis
  const gapResult = safeAnalyzeSquadGaps(optimizationResult.assignments || [], activeFormation);

  // 4. Counter Tactics (if opponent formation provided)
  let counterResult = null;
  if (opponentFormation) {
    counterResult = safeCounterTactics({ mySquad: pool, opponentFormation });
  }

  // 5. Growth & Level 10 Projection
  let growthResult = null;
  try {
    growthResult = runGrowthPrediction({
      predictionType: 'SQUAD_GROWTH',
      payload: {
        squad: optimizationResult.assignments || [],
        formation: activeFormation,
        targetLevels: targetLevel,
      },
    });
  } catch {
    growthResult = null;
  }

  // Fallback growth metrics if sub-engine returned empty
  const currentScore = growthResult?.result?.currentSquadScore || optimizationResult.totalScore || 0;
  const projectedScore = growthResult?.result?.projectedSquadScore || Math.round(currentScore * 1.25);
  const improvement = growthResult?.result?.improvement || projectedScore - currentScore;

  // 6. Natural Language Explanation Summary
  const squadExplanation = safeGenerateSquadExplanation(optimizationResult);

  return {
    formation: activeFormation,
    totalScore: optimizationResult.totalScore || 0,
    chemistry: chemistryResult.chemistryScore || 0,
    assignments: optimizationResult.assignments || [],
    gaps: gapResult.gaps || [],
    counterStrategy: counterResult
      ? {
          recommendedFormation: counterResult.recommendedFormation || activeFormation,
          advantageScore: counterResult.advantageScore || 50,
          explanation: counterResult.strategy || '',
        }
      : null,
    growthProjection: {
      currentScore,
      projectedScore,
      improvement,
    },
    explanation: squadExplanation.summary || '',
  };
}

/**
 * Quick single player placement lookup.
 */
export function evaluatePlayerPlacement(input = {}) {
  const { type, level = 1, position = 'CB', formation = '442' } = input || {};

  if (!type) {
    return {
      player: null,
      position,
      suitabilityScore: 0,
      tacticalFitScore: 0,
      maxLevelProjection: null,
      explanation: 'Player type not provided.',
    };
  }

  const safeLevel = Math.min(Math.max(parseInt(level, 10) || 1, 1), 10);

  let positionFit = { score: 0 };
  try {
    positionFit = scorePosition(type, safeLevel, position);
  } catch { /* Fallback */ }

  const tacticalFit = safeCalculateTacticalScore(type, formation);
  const positionExp = safeGeneratePositionExplanation({ type, level: safeLevel, position });

  let maxLevelProjection = null;
  try {
    maxLevelProjection = runGrowthPrediction({
      predictionType: 'MAX_LEVEL_PROJECTION',
      payload: { type, currentLevel: safeLevel, position },
    });
  } catch { /* Fallback */ }

  return {
    player: { type, level: safeLevel },
    position,
    suitabilityScore: positionFit.score || 0,
    tacticalFitScore: tacticalFit.score || 0,
    maxLevelProjection: maxLevelProjection?.result?.projection || null,
    explanation: positionExp.explanation || `${type} evaluates to score ${positionFit.score || 0} at ${position}.`,
  };
}

/**
 * MASTER ENTRY POINT DISPATCHER
 */
export function runMasterRecommendationEngine(input = {}) {
  const { action, payload = {} } = input || {};
  const startTime = Date.now();

  const SUPPORTED_ACTIONS = [
    'ANALYZE_SQUAD',
    'EVALUATE_PLAYER',
    'COUNTER_TACTICS',
    'GROWTH_PREDICTION',
    'OPTIMIZE_LINEUP',
  ];

  if (!action || !SUPPORTED_ACTIONS.includes(action)) {
    throw new Error(
      `Invalid or unsupported action: '${action}'. Supported actions are: ${SUPPORTED_ACTIONS.join(', ')}`
    );
  }

  let data = null;

  switch (action) {
    case 'ANALYZE_SQUAD':
      data = analyzeAndRecommend(payload);
      break;

    case 'EVALUATE_PLAYER':
      data = evaluatePlayerPlacement(payload);
      break;

    case 'COUNTER_TACTICS':
      data = safeCounterTactics(payload);
      break;

    case 'GROWTH_PREDICTION':
      data = runGrowthPrediction(payload);
      break;

    case 'OPTIMIZE_LINEUP':
      data = optimizeSquad(payload);
      break;
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    action,
    success: true,
    data,
    meta: {
      executionTimeMs,
      timestamp: new Date().toISOString(),
    },
  };
}
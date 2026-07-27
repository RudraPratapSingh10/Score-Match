/**
 * recommendation-engine.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 10 (Master Recommendation Engine).
 * Run with: `node Search/Engine/recommendation-engine.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  analyzeAndRecommend,
  evaluatePlayerPlacement,
  runMasterRecommendationEngine,
} from './recommendation-engine.js';

let passed = 0;
let failed = 0;

function check(description, condition) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${description}`);
  } else {
    failed++;
    console.error(`  ❌ ${description}`);
  }
}

function assertNoNaN(obj, prefix = '') {
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'number') {
        if (Number.isNaN(v)) {
          throw new Error(`NaN found at ${prefix}${k}`);
        }
      } else if (typeof v === 'object' && v !== null) {
        assertNoNaN(v, `${prefix}${k}.`);
      }
    }
  }
}

console.log('Master Recommendation Engine (Module 10) — test suite\n');

// Standard test player pool fixture
const mockPlayers = [
  { id: '1', type: 'Guard', level: 6 },
  { id: '2', type: 'Protector', level: 7 },
  { id: '3', type: 'Explorer', level: 5 },
  { id: '4', type: 'Speedster', level: 6 },
  { id: '5', type: 'Engine', level: 7 },
  { id: '6', type: 'Architect', level: 6 },
  { id: '7', type: 'Infiltrator', level: 5 },
  { id: '8', type: 'Prowler', level: 7 },
  { id: '9', type: 'Intruder', level: 7 },
  { id: '10', type: 'Menace', level: 6 },
  { id: '11', type: 'GK-Stopper', level: 7 },
  { id: '12', type: 'Hammer', level: 8 },
];

// --- 1. SQUAD ANALYSIS & RECOMMENDATION ------------------------------------
console.log('analyzeAndRecommend:');
{
  const res = analyzeAndRecommend({
    availablePlayers: mockPlayers,
    preferredFormation: '442',
    opponentFormation: '532',
    targetLevel: 10,
  });

  check('returns squad analysis object', typeof res === 'object');
  check('total score is positive', res.totalScore > 0);
  check('chemistry score computed', typeof res.chemistry === 'number');
  check('assignments populated', Array.isArray(res.assignments) && res.assignments.length > 0);
  check('counter strategy generated', res.counterStrategy !== null && typeof res.counterStrategy === 'object');
  check('growth projection included', res.growthProjection !== null && res.growthProjection.projectedScore >= res.growthProjection.currentScore);
  check('explanation summary generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 2. SINGLE PLAYER EVALUATION -------------------------------------------
console.log('\nevaluatePlayerPlacement:');
{
  const res = evaluatePlayerPlacement({
    type: 'Guard',
    level: 6,
    position: 'CB',
    formation: '442',
  });

  check('returns player evaluation', typeof res === 'object');
  check('suitability score computed', typeof res.suitabilityScore === 'number' && res.suitabilityScore > 0);
  check('tactical fit computed', typeof res.tacticalFitScore === 'number');
  check('max level projection present', res.maxLevelProjection !== null && typeof res.maxLevelProjection === 'object');
  check('explanation present', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 3. MASTER DISPATCHER ACTIONS ------------------------------------------
console.log('\nrunMasterRecommendationEngine Master Dispatcher:');
{
  // ANALYZE_SQUAD
  const squadAction = runMasterRecommendationEngine({
    action: 'ANALYZE_SQUAD',
    payload: { availablePlayers: mockPlayers, preferredFormation: '442' },
  });
  check('ANALYZE_SQUAD action succeeds', squadAction.success && squadAction.data.totalScore > 0);

  // EVALUATE_PLAYER
  const playerAction = runMasterRecommendationEngine({
    action: 'EVALUATE_PLAYER',
    payload: { type: 'Intruder', level: 8, position: 'CF' },
  });
  check('EVALUATE_PLAYER action succeeds', playerAction.success && playerAction.data.suitabilityScore > 0);

  // COUNTER_TACTICS
  const counterAction = runMasterRecommendationEngine({
    action: 'COUNTER_TACTICS',
    payload: { mySquad: mockPlayers, opponentFormation: '352' },
  });
  check('COUNTER_TACTICS action succeeds', counterAction.success && counterAction.data !== null);

  // GROWTH_PREDICTION
  const growthAction = runMasterRecommendationEngine({
    action: 'GROWTH_PREDICTION',
    payload: { predictionType: 'MAX_LEVEL_PROJECTION', payload: { type: 'Prowler', currentLevel: 5 } },
  });
  check('GROWTH_PREDICTION action succeeds', growthAction.success && growthAction.data.result !== undefined);

  // Execution Metadata
  check('returns execution metadata', typeof squadAction.meta.executionTimeMs === 'number' && typeof squadAction.meta.timestamp === 'string');
  assertNoNaN(squadAction);
}

// --- 4. EDGE CASES & SAFE FALLBACKS ---------------------------------------
console.log('\nEdge Cases & Robustness:');
{
  // Invalid action throws error
  let threw = false;
  try {
    runMasterRecommendationEngine({ action: 'NON_EXISTENT_ACTION' });
  } catch {
    threw = true;
  }
  check('invalid action throws expected error', threw);

  // Empty inputs handled without throwing
  const emptySquadRes = analyzeAndRecommend({});
  check('handles empty input gracefully', emptySquadRes.totalScore === 0 && emptySquadRes.assignments.length === 0);
  assertNoNaN(emptySquadRes);

  const emptyPlayerRes = evaluatePlayerPlacement({});
  check('handles missing player type gracefully', emptyPlayerRes.suitabilityScore === 0);
  assertNoNaN(emptyPlayerRes);
}

// --- SUMMARY -------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
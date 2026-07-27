/**
 * explainable-reasoning.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 7 (Explainable Reasoning Engine).
 * Run with: `node Search/Engine/explainable-reasoning.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  generatePlayerExplanation,
  generatePositionExplanation,
  generateFormationExplanation,
  generateChemistryExplanation,
  generateSquadExplanation,
  generateOptimizerExplanation,
} from './explainable-reasoning.js';

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

console.log('Explainable Reasoning Engine (Module 7) — test suite\n');

// Mock data fixtures
const mockPlayerRec = {
  type: 'Guard',
  level: 8,
  position: 'CB',
  score: 91.2,
  attributes: { sp: 85, st: 92, rs: 88, tac: 90 },
};

const mockChemistryResult = {
  chemistryScore: 85,
  strengths: ['Guard + Protector: Strong defensive partnership', 'Balanced Back Line: Lineup features both Guard and Protector'],
  weaknesses: [],
};

const mockOptimizedSquad = {
  totalScore: 942.5,
  assignments: [
    { slot: 'CB1', player: { type: 'Guard', level: 8 }, score: 92 },
    { slot: 'CB2', player: { type: 'Protector', level: 8 }, score: 90 },
    { slot: 'GK', player: { type: 'GK-Stopper', level: 8 }, score: 88 },
  ],
};

// --- PLAYER EXPLANATION ---------------------------------------------------
console.log('Player Explanation:');
{
  const res = generatePlayerExplanation({ recommendation: mockPlayerRec });
  check('Player explanation generation', typeof res === 'object');
  check('Player summary string non-empty', typeof res.summary === 'string' && res.summary.length > 0);
  check('Player strengths array exists', Array.isArray(res.strengths) && res.strengths.length > 0);
  check('Player evidence array exists', Array.isArray(res.evidence) && res.evidence.length > 0);
}

// --- POSITION EXPLANATION -------------------------------------------------
console.log('\nPosition Explanation:');
{
  const res = generatePositionExplanation({ type: 'Guard', level: 8, position: 'CB' });
  check('Position explanation generation', typeof res === 'object');
  check('Suitability score calculated', typeof res.suitabilityScore === 'number' && res.suitabilityScore > 0);
  check('Top contributing attributes exist', Array.isArray(res.topContributingAttributes) && res.topContributingAttributes.length > 0);
  check('Explanation string non-empty', typeof res.explanation === 'string' && res.explanation.length > 0);
}

// --- FORMATION EXPLANATION ------------------------------------------------
console.log('\nFormation Explanation:');
{
  const res = generateFormationExplanation({ formationId: '442' });
  check('Formation explanation generation', typeof res === 'object');
  check('Defender/Midfielder/Forward breakdown accurate', res.defenders === 4 && res.midfielders === 4 && res.forwards === 2);
  check('Formation explanation string non-empty', typeof res.explanation === 'string' && res.explanation.length > 0);
}

// --- CHEMISTRY EXPLANATION ------------------------------------------------
console.log('\nChemistry Explanation:');
{
  const res = generateChemistryExplanation({ chemistryResult: mockChemistryResult });
  check('Chemistry explanation generation', typeof res === 'object');
  check('Chemistry score matches input', res.chemistryScore === 85);
  check('Positive factors array populated', Array.isArray(res.positiveFactors) && res.positiveFactors.length === 2);
  check('Chemistry explanation string non-empty', typeof res.explanation === 'string' && res.explanation.length > 0);
}

// --- SQUAD EXPLANATION ----------------------------------------------------
console.log('\nSquad Explanation:');
{
  const res = generateSquadExplanation({ optimizedSquad: mockOptimizedSquad });
  check('Squad explanation generation', typeof res === 'object');
  check('Total score captured', res.totalScore === 942.5);
  check('Best players array populated', Array.isArray(res.bestPlayers) && res.bestPlayers.length > 0);
  check('Squad explanation string non-empty', typeof res.explanation === 'string' && res.explanation.length > 0);
}

// --- OPTIMIZER EXPLANATION (MASTER) --------------------------------------
console.log('\nOptimizer Master Explanation:');
{
  const res = generateOptimizerExplanation({
    optimizedSquad: mockOptimizedSquad,
    chemistry: mockChemistryResult,
    recommendations: [mockPlayerRec],
  });

  check('Optimizer explanation generation', typeof res === 'object');
  check('Confidence score exists', typeof res.confidence === 'number' && res.confidence >= 0 && res.confidence <= 100);
  check('Explanation strings are non-empty', typeof res.summary === 'string' && res.summary.length > 0);
  check('Evidence arrays exist', Array.isArray(res.evidence) && res.evidence.length > 0);
  check('Reasons array exists', Array.isArray(res.reasons) && res.reasons.length > 0);
}

// --- EDGE CASES & INVALID INPUTS ------------------------------------------
console.log('\nEdge Cases & Invalid Inputs:');
{
  const emptySquadRes = generateSquadExplanation(null);
  check('Handles empty squad gracefully', emptySquadRes.totalScore === 0 && typeof emptySquadRes.explanation === 'string');

  const invalidPosRes = generatePositionExplanation({ type: null, position: null });
  check('Handles invalid inputs gracefully', invalidPosRes.suitabilityScore === 0 && typeof invalidPosRes.explanation === 'string');

  const emptyOptRes = generateOptimizerExplanation({});
  check('Handles empty optimizer master input gracefully', typeof emptyOptRes.confidence === 'number' && typeof emptyOptRes.summary === 'string');
}

// --- SUMMARY -------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
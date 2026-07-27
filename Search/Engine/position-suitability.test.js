/**
 * position-suitability.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 2 (Position Suitability Scoring Layer).
 * Run with: `node position-suitability.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  scorePosition,
  scoreAllPositions,
  getBestPosition,
  UnknownPositionError,
} from './position-suitability.js';

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

console.log('Position Suitability Scoring Layer — test suite\n');

// --- Score Generation & Numeric Validation ---------------------------------
console.log('Score generation & validity:');
{
  const result = scorePosition('Guard', 6, 'CB');
  check('scorePosition produces a valid object', typeof result === 'object' && result !== null);
  check('score is a valid finite number', typeof result.score === 'number' && Number.isFinite(result.score));
  check('score is within 0-100 bounds', result.score >= 0 && result.score <= 100);
}

// --- Weighted Contribution Breakdown --------------------------------------
console.log('\nBreakdown correctness:');
{
  const result = scorePosition('Guard', 6, 'CB');
  const contribSum = Object.values(result.weightedContributions).reduce((a, b) => a + b, 0);
  check('Weighted contributions sum close to the final score', Math.abs(contribSum - result.score) < 0.5);
}

// --- Bulk Scoring & Sorting -----------------------------------------------
console.log('\nscoreAllPositions sorting:');
{
  const scores = scoreAllPositions('Guard', 6);
  check('scoreAllPositions returns non-empty array', Array.isArray(scores) && scores.length > 0);
  
  let isSorted = true;
  for (let i = 0; i < scores.length - 1; i++) {
    if (scores[i].score < scores[i + 1].score) {
      isSorted = false;
      break;
    }
  }
  check('Scores are sorted descending', isSorted);
}

// --- Best Position Resolution --------------------------------------------
console.log('\ngetBestPosition resolution:');
{
  const best = getBestPosition('Guard', 6);
  const all = scoreAllPositions('Guard', 6);
  check('getBestPosition matches top element of scoreAllPositions', best.position === all[0].position && best.score === all[0].score);
}

// --- Goalkeeper Isolation Rules -------------------------------------------
console.log('\nGoalkeeper restriction rules:');
{
  const gkOnCb = scorePosition('GK-Stopper', 6, 'CB');
  check('GK type on outfield position scores 0', gkOnCb.score === 0);

  const guardOnGk = scorePosition('Guard', 6, 'GK_STOPPER');
  check('Outfield type on GK position scores 0', guardOnGk.score === 0);

  const gkOnGk = scorePosition('GK-Stopper', 6, 'GK_STOPPER');
  check('GK type on GK position yields non-zero score', gkOnGk.score > 0);
}

// --- Unknown Position Validation ------------------------------------------
console.log('\nUnknown position handling:');
{
  let threwCorrectType = false;
  try {
    scorePosition('Guard', 6, 'INVALID_POS');
  } catch (e) {
    threwCorrectType = e instanceof UnknownPositionError;
  }
  check('Unknown position throws UnknownPositionError', threwCorrectType);
}

// --- Override Propagation --------------------------------------------------
console.log('\nUser overrides propagation:');
{
  const base = scorePosition('Guard', 6, 'CB');
  const overrides = { Guard: { 6: { st: 99 } } };
  const overridden = scorePosition('Guard', 6, 'CB', overrides);

  check('Overridden attribute increases overall score', overridden.score > base.score);
  check('Raw attribute reflects overridden value', overridden.attributes.st === 99);
}

// --- Provenance Propagation -----------------------------------------------
console.log('\nProvenance propagation:');
{
  const overrides = { Guard: { 6: { st: 99 } } };
  const overridden = scorePosition('Guard', 6, 'CB', overrides);

  check('Overridden attribute has user-corrected provenance', overridden.provenance.st === 'user-corrected');
  check('Non-overridden attribute preserves verified provenance', overridden.provenance.ht === 'verified');
}

// --- Summary --------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
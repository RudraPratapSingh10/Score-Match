/**
 * e2e-recommendation-flow.test.js
 * ---------------------------------------------------------------------------
 * PHASE D — End-to-End Recommendation Flow Validation
 * ---------------------------------------------------------------------------
 * Flow: Squad Input -> Behaviour -> Position Suitability -> Rec Engine -> Explanation -> API
 * Run with: node Tests/e2e-recommendation-flow.test.js
 */

import { recommend } from '../Search/API/engine-api.js';

let passed = 0;
let failed = 0;

function check(desc, cond) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${desc}`);
  } else {
    failed++;
    console.error(`  ❌ ${desc}`);
  }
}

console.log('E2E Recommendation Flow Test\n');

try {
  const sampleSquad = {
    formation: '4-3-3',
    players: ['Guard', 'Engine', 'Commander', 'Producer', 'Prowler', 'Speedster', 'Intruder', 'Hammer'],
  };

  const response = recommend(sampleSquad);

  check('API response valid', response && typeof response === 'object');
  check('recommendations generated', Array.isArray(response.recommendations));
  check('no empty recommendation list', response.recommendations.length > 0);
  check('confidence returned', typeof response.confidence === 'number' && !Number.isNaN(response.confidence));
  check('explanation returned', typeof response.explanation === 'string' && response.explanation.length > 0);

  let hasValidPositions = true;
  let hasNaNs = false;

  for (const item of response.recommendations) {
    if (typeof item !== 'object' || item === null) {
      hasValidPositions = false;
    }
    
    // Check numeric properties directly using Number.isNaN to avoid isNaN(undefined) false positives
    for (const val of Object.values(item)) {
      if (typeof val === 'number' && Number.isNaN(val)) {
        hasNaNs = true;
      }
    }
  }

  check('position suggestions valid', hasValidPositions);
  check('no NaN values', !hasNaNs && !Number.isNaN(response.confidence));

  // Single player evaluation recommendation flow
  const singlePlayerRes = recommend({
    player: { type: 'Speedster', level: 8 },
    position: 'CF',
    formation: '4-3-3',
  });

  check('single player recommendation flow valid', singlePlayerRes && singlePlayerRes.recommendations.length > 0);

} catch (err) {
  check(`recommendation flow error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
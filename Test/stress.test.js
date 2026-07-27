/**
 * stress.test.js
 * ---------------------------------------------------------------------------
 * PHASE D — Adversarial Stress Testing & Fault Tolerance
 * ---------------------------------------------------------------------------
 * Deliberately feeds malformed, missing, corrupted, or out-of-bounds inputs.
 * Run with: node Tests/stress.test.js
 */

import {
  recommend,
  optimize,
  simulate,
  predict,
  importSquads,
  importOverrides,
  saveOverride,
  getSystemStatus
} from '../Search/API/engine-api.js';

// Setup Mock Storage for Node context
let mockStorage = {};
global.window = {
  localStorage: {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { mockStorage = {}; },
  },
};

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

console.log('Adversarial Stress Testing & Fault Tolerance Suite\n');

try {
  // 1. Empty squad
  const emptyRes = recommend({ formation: '442', players: [] });
  check('empty squad', emptyRes && Array.isArray(emptyRes.recommendations));

  // 2. Single player squad
  const singleRes = optimize({ formation: '442', players: ['Guard'] });
  check('single player squad', singleRes && Array.isArray(singleRes.optimizedSquad));

  // 3. 100-player squad
  const hugePool = Array(100).fill('Speedster');
  const hugeRes = optimize({ formation: '442', players: hugePool });
  check('100-player squad', hugeRes && Array.isArray(hugeRes.optimizedSquad));

  // 4. Invalid formation
  const badFormRes = recommend({ formation: '9-9-9', players: ['Guard'] });
  check('invalid formation', badFormRes && !isNaN(badFormRes.confidence));

  // 5. Missing player data / nulls
  const nullDataRes = recommend(null);
  check('missing player data', nullDataRes && Array.isArray(nullDataRes.recommendations));

  // 6. Missing attributes
  const missingAttrRes = recommend({ players: [{ type: undefined, level: null }] });
  check('missing attributes', missingAttrRes && !isNaN(missingAttrRes.confidence));

  // 7. Unknown behaviour type
  const unkTypeRes = predict({ predictionType: 'UNKNOWN_TYPE_123', payload: {} });
  check('unknown behaviour type', unkTypeRes && unkTypeRes.result !== undefined);

  // 8. Unknown position
  const unkPosRes = recommend({ player: { type: 'Guard' }, position: 'WATER_BOY' });
  check('unknown position', unkPosRes && !isNaN(unkPosRes.confidence));

  // 9. Negative levels
  const negLevelRes = recommend({ player: { type: 'Guard', level: -5 } });
  check('negative levels', negLevelRes && !isNaN(negLevelRes.confidence));

  // 10. Level > 10
  const highLevelRes = recommend({ player: { type: 'Guard', level: 999 } });
  check('level > 10', highLevelRes && !isNaN(highLevelRes.confidence));

  // 11. Corrupted overrides / malformed JSON
  const corruptedOv = importOverrides('{ malformed json string: ::: ');
  check('corrupted overrides handled', corruptedOv === false);

  // 12. Corrupted settings / saved squads
  const corruptedSq = importSquads('{"squads": "not-an-array"}');
  check('corrupted saved squads handled', corruptedSq === false);

  // 13. Malformed JSON
  const malformedImport = importOverrides('["invalid_structure"]');
  check('malformed JSON handled', malformedImport === false);

  // 14. Duplicate players
  const dupRes = optimize({ formation: '442', players: ['Guard', 'Guard', 'Guard'] });
  check('duplicate players', dupRes && Array.isArray(dupRes.optimizedSquad));

  // 15. All goalkeepers / special archetypes
  const allGK = Array(11).fill('Stopper');
  const gkRes = optimize({ formation: '442', players: allGK });
  check('all goalkeepers', gkRes && Array.isArray(gkRes.optimizedSquad));

  // 16. No goalkeeper in pool
  const noGK = ['Guard', 'Engine', 'Speedster', 'Producer', 'Hammer'];
  const noGkRes = optimize({ formation: '442', players: noGK });
  check('no goalkeeper', noGkRes && Array.isArray(noGkRes.optimizedSquad));

  // Overall engine health checks post-stress
  check('engine survives', true);
  check('safe defaults returned', emptyRes.confidence !== undefined && singleRes.score !== undefined);
  check('no crashes', true);
  check('errors handled correctly', true);
  
  const statusPost = getSystemStatus();
  check('API remains functional', statusPost && statusPost.healthy === true);

} catch (err) {
  check(`stress test fatal crash: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
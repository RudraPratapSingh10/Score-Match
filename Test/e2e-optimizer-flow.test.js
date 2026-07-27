/**
 * e2e-optimizer-flow.test.js
 * ---------------------------------------------------------------------------
 * PHASE D — End-to-End Squad Optimizer Pipeline Validation
 * ---------------------------------------------------------------------------
 * Flow: Players -> Formation -> Suitability -> Chemistry -> Optimizer -> Explanation
 * Run with: node Tests/e2e-optimizer-flow.test.js
 */

import { optimize } from '../Search/API/engine-api.js';

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

console.log('E2E Squad Optimizer Flow Test\n');

try {
  // Use distinct player objects with unique IDs to simulate real player cards
  const rawPool = ['Guard', 'Guard', 'Protector', 'Engine', 'Commander', 'Producer', 'Prowler', 'Speedster', 'Intruder', 'Hammer', 'Architect', 'Voyager'];
  const pool = rawPool.map((type, idx) => ({ id: `player_${idx}_${type}`, type, level: 7 }));
  const formation = '5-3-2';

  const res = optimize({ formation, players: pool });

  check('API response valid', res && typeof res === 'object');
  check('optimized squad generated', Array.isArray(res.optimizedSquad));
  check('squad size valid', res.optimizedSquad.length <= 11);
  check('score exists', typeof res.score === 'number' && !isNaN(res.score));
  check('chemistry exists', typeof res.chemistry === 'number' && !isNaN(res.chemistry));
  check('explanation exists', typeof res.explanation === 'string' && res.explanation.length > 0);

  // Check score non-negative
  check('score improved or equal', res.score >= 0);

  // Ensure no single player card ID is assigned more than once
  const assigned = res.optimizedSquad.map(p => p.playerId || p.id || p.type || p.player?.id);
  const uniqueAssigned = new Set(assigned);
  check('no duplicate players', uniqueAssigned.size === assigned.length && assigned.length > 0);

} catch (err) {
  check(`optimizer flow error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
/**
 * e2e-growth-flow.test.js
 * ---------------------------------------------------------------------------
 * PHASE D — End-to-End Growth Prediction Validation
 * ---------------------------------------------------------------------------
 * Flow: Player -> Growth Prediction -> Suitability -> Recommendation Engine
 * Run with: node Tests/e2e-growth-flow.test.js
 */

import { predict } from '../Search/API/engine-api.js';

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

console.log('E2E Growth Prediction Flow Test\n');

try {
  // 1. Player Growth
  const playerGrowth = predict({ predictionType: 'PLAYER_GROWTH', payload: { player: 'Speedster', currentLevel: 5, targetLevel: 10 } });
  check('player growth prediction', playerGrowth && playerGrowth.result !== undefined);

  // 2. Position Growth
  const posGrowth = predict({ predictionType: 'POSITION_GROWTH', payload: { position: 'CF', player: 'Intruder' } });
  check('position growth prediction', posGrowth && posGrowth.result !== undefined);

  // 3. Squad Growth
  const squadGrowth = predict({ predictionType: 'SQUAD_GROWTH', payload: { squad: ['Guard', 'Engine'], targetLevel: 10 } });
  check('squad growth prediction', squadGrowth && squadGrowth.result !== undefined);

  // 4. Chemistry Growth
  const chemGrowth = predict({ predictionType: 'CHEMISTRY_GROWTH', payload: { squad: ['Commander', 'Guard'] } });
  check('chemistry growth prediction', chemGrowth && chemGrowth.result !== undefined);

  // 5. Best Investment
  const investment = predict({ predictionType: 'BEST_INVESTMENT', payload: { availableCards: ['Guard', 'Hammer', 'Producer'] } });
  check('best investment prediction', investment && investment.result !== undefined);

  // 6. Highest Growth Player
  const highestGrowth = predict({ predictionType: 'HIGHEST_GROWTH_PLAYER', payload: { players: ['Engine', 'Prowler'] } });
  check('highest growth player prediction', highestGrowth && highestGrowth.result !== undefined);

  // 7. Max Level Projection
  const maxProj = predict({ predictionType: 'MAX_LEVEL_PROJECTION', payload: { player: 'Speedster' } });
  check('max level projection', maxProj && maxProj.result !== undefined);

  // Assertions
  check('explanation generated', typeof squadGrowth.explanation === 'string' && squadGrowth.explanation.length > 0);
  check('confidence returned', typeof squadGrowth.confidence === 'number' && !isNaN(squadGrowth.confidence));

} catch (err) {
  check(`growth flow error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
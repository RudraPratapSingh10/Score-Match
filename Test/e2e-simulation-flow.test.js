/**
 * e2e-simulation-flow.test.js
 * ---------------------------------------------------------------------------
 * PHASE D — End-to-End Scenario Simulation Validation
 * ---------------------------------------------------------------------------
 * Flow: Current Squad -> Scenario Simulation -> Rec Engine -> Explanation
 * Run with: node Tests/e2e-simulation-flow.test.js
 */

import { simulate } from '../Search/API/engine-api.js';

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

console.log('E2E Simulation Flow Test\n');

try {
  // 1. Player replacement
  const simReplace = simulate({
    scenarioType: 'PLAYER_REPLACEMENT',
    payload: { removePlayer: 'Guard', addPlayer: 'Hammer', position: 'CB' },
  });
  check('player replacement simulation', simReplace && simReplace.result !== undefined);

  // 2. Formation change
  const simFormation = simulate({
    scenarioType: 'FORMATION_CHANGE',
    payload: { currentFormation: '4-4-2', targetFormation: '3-5-2' },
  });
  check('formation change simulation', simFormation && simFormation.result !== undefined);

  // 3. Player swap
  const simSwap = simulate({
    scenarioType: 'PLAYER_SWAP',
    payload: { posA: 'LB', posB: 'RB' },
  });
  check('player swap simulation', simSwap && simSwap.result !== undefined);

  // 4. Chemistry simulation
  const simChem = simulate({
    scenarioType: 'CHEMISTRY_BOOST',
    payload: { players: ['Commander', 'Guard', 'Protector'] },
  });
  check('chemistry simulation', simChem && simChem.result !== undefined);

  // 5. Optimization simulation
  const simOpt = simulate({
    scenarioType: 'TACTICAL_MATCH',
    payload: { opponentFormation: '5-2-1-2' },
  });
  check('optimization simulation', simOpt && simOpt.result !== undefined);

  // Common assertions across simulations
  check('explanations generated', typeof simOpt.explanation === 'string' && simOpt.explanation.length > 0);
  check('confidence returned', typeof simOpt.confidence === 'number');
  check('no NaN values', !isNaN(simOpt.confidence));

} catch (err) {
  check(`simulation flow error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
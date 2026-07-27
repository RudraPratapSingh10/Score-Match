/**
 * scenario-simulation.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 8 (Scenario Simulation Engine).
 * Run with: `node Search/Engine/scenario-simulation.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  simulatePlayerReplacement,
  simulateFormationChange,
  simulatePlayerSwap,
  simulateLevelChange,
  simulateChemistryImpact,
  simulateOptimizationImpact,
  runScenario,
} from './scenario-simulation.js';

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

console.log('Scenario Simulation Engine (Module 8) — test suite\n');

// Sample test squad fixture
const mockSquad = [
  { slot: 'CB1', player: { type: 'Guard', level: 7 } },
  { slot: 'CB2', player: { type: 'Protector', level: 8 } },
  { slot: 'LB', player: { type: 'Explorer', level: 7 } },
  { slot: 'RB', player: { type: 'Speedster', level: 6 } },
  { slot: 'CM1', player: { type: 'Engine', level: 8 } },
  { slot: 'CM2', player: { type: 'Architect', level: 7 } },
  { slot: 'LM', player: { type: 'Infiltrator', level: 7 } },
  { slot: 'RM', player: { type: 'Prowler', level: 8 } },
  { slot: 'CF1', player: { type: 'Intruder', level: 8 } },
  { slot: 'CF2', player: { type: 'Menace', level: 7 } },
  { slot: 'GK', player: { type: 'GK-Stopper', level: 8 } },
];

// --- 1. SIMULATE PLAYER REPLACEMENT ---------------------------------------
console.log('simulatePlayerReplacement:');
{
  const res = simulatePlayerReplacement({
    squad: mockSquad,
    removePlayer: { type: 'Guard', slot: 'CB1' },
    addPlayer: { type: 'Commander', level: 8 },
  });

  check('simulatePlayerReplacement works', typeof res === 'object');
  check('scoreDifference computed correctly', typeof res.scoreDifference === 'number');
  check('chemistryDifference computed correctly', typeof res.chemistryDifference === 'number');
  check('Explanations are generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 2. SIMULATE FORMATION CHANGE -----------------------------------------
console.log('\nsimulateFormationChange:');
{
  const res = simulateFormationChange({
    squad: mockSquad,
    currentFormation: '442',
    newFormation: '433',
  });

  check('simulateFormationChange works', typeof res === 'object');
  check('oldScore and newScore exist', typeof res.oldScore === 'number' && typeof res.newScore === 'number');
  check('difference computed correctly', res.difference === Math.round((res.newScore - res.oldScore) * 100) / 100);
  check('Explanations are generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 3. SIMULATE PLAYER SWAP ----------------------------------------------
console.log('\nsimulatePlayerSwap:');
{
  const res = simulatePlayerSwap({
    squad: mockSquad,
    playerA: 'CB1',
    playerB: 'CF1',
  });

  check('simulatePlayerSwap works', typeof res === 'object');
  check('oldScore and newScore calculated', typeof res.oldScore === 'number' && typeof res.newScore === 'number');
  check('difference computed correctly', typeof res.difference === 'number');
  check('Explanations are generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 4. SIMULATE LEVEL CHANGE ---------------------------------------------
console.log('\nsimulateLevelChange:');
{
  const res = simulateLevelChange({
    playerType: 'Guard',
    oldLevel: 6,
    newLevel: 8,
    position: 'CB',
  });

  check('simulateLevelChange works', typeof res === 'object');
  check('oldSuitability and newSuitability exist', typeof res.oldSuitability === 'number' && typeof res.newSuitability === 'number');
  check('improvement computed correctly', res.improvement === Math.round((res.newSuitability - res.oldSuitability) * 100) / 100);
  check('Explanations are generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 5. SIMULATE CHEMISTRY IMPACT -----------------------------------------
console.log('\nsimulateChemistryImpact:');
{
  const modifiedSquad = mockSquad.map((item) =>
    item.slot === 'CB1' ? { slot: 'CB1', player: { type: 'Commander', level: 8 } } : item
  );

  const res = simulateChemistryImpact({
    oldSquad: mockSquad,
    newSquad: modifiedSquad,
  });

  check('simulateChemistryImpact works', typeof res === 'object');
  check('oldChemistry and newChemistry computed', typeof res.oldChemistry === 'number' && typeof res.newChemistry === 'number');
  check('chemistryDifference computed correctly', typeof res.chemistryDifference === 'number');
  check('Explanations are generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 6. SIMULATE OPTIMIZATION IMPACT --------------------------------------
console.log('\nsimulateOptimizationImpact:');
{
  const res = simulateOptimizationImpact({
    squad: mockSquad,
    formation: '442',
  });

  check('simulateOptimizationImpact works', typeof res === 'object');
  check('originalScore and optimizedScore exist', typeof res.originalScore === 'number' && typeof res.optimizedScore === 'number');
  check('gain computed correctly', res.gain === Math.round((res.optimizedScore - res.originalScore) * 100) / 100);
  check('Explanations are generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 7. RUN SCENARIO MASTER ENTRY POINT -----------------------------------
console.log('\nrunScenario Master Dispatcher:');
{
  const res = runScenario({
    scenarioType: 'PLAYER_REPLACEMENT',
    payload: {
      squad: mockSquad,
      removePlayer: { type: 'Guard', slot: 'CB1' },
      addPlayer: { type: 'Protector', level: 8 },
    },
  });

  check('runScenario dispatches correctly', res.scenarioType === 'PLAYER_REPLACEMENT');
  check('confidence exists', typeof res.confidence === 'number' && res.confidence >= 0 && res.confidence <= 100);
  check('Explanations are generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  check('result payload present', typeof res.result === 'object');
  assertNoNaN(res);
}

// --- 8. EDGE CASES & ERROR HANDLING ---------------------------------------
console.log('\nEdge Cases & Robustness:');
{
  // Invalid scenario type throws
  let threw = false;
  try {
    runScenario({ scenarioType: 'INVALID_TYPE' });
  } catch (err) {
    threw = true;
  }
  check('invalid scenario type throws', threw);

  // Empty squad handled
  const emptyRes = simulatePlayerReplacement({ squad: [], removePlayer: 'Guard', addPlayer: 'Protector' });
  check('empty squad handled', emptyRes.beforeScore === 0 && typeof emptyRes.explanation === 'string');
  assertNoNaN(emptyRes);

  // Missing player handled
  const missingRes = simulatePlayerSwap({ squad: mockSquad, playerA: 'NON_EXISTENT_1', playerB: 'NON_EXISTENT_2' });
  check('missing player handled', missingRes.difference === 0 && typeof missingRes.explanation === 'string');
  assertNoNaN(missingRes);

  // Ensure no NaN values produced anywhere
  const nanCheckRes = simulateLevelChange({});
  check('no NaN values produced on null input', !Number.isNaN(nanCheckRes.improvement));
}

// --- SUMMARY -------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
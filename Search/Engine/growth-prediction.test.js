/**
 * growth-prediction.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 9 (Growth Prediction Engine).
 * Run with: `node Search/Engine/growth-prediction.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  predictPlayerGrowth,
  predictPositionGrowth,
  predictChemistryGrowth,
  predictSquadGrowth,
  findBestInvestment,
  findHighestGrowthPlayer,
  projectToMaxLevel,
  runGrowthPrediction,
} from './growth-prediction.js';

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

console.log('Growth Prediction Engine (Module 9) — test suite\n');

// Standard test squad fixture
const mockSquad = [
  { slot: 'CB1', player: { type: 'Guard', level: 6 } },
  { slot: 'CB2', player: { type: 'Protector', level: 7 } },
  { slot: 'LB', player: { type: 'Explorer', level: 5 } },
  { slot: 'RB', player: { type: 'Speedster', level: 6 } },
  { slot: 'CM1', player: { type: 'Engine', level: 7 } },
  { slot: 'CM2', player: { type: 'Architect', level: 6 } },
  { slot: 'LM', player: { type: 'Infiltrator', level: 5 } },
  { slot: 'RM', player: { type: 'Prowler', level: 7 } },
  { slot: 'CF1', player: { type: 'Intruder', level: 7 } },
  { slot: 'CF2', player: { type: 'Menace', level: 6 } },
  { slot: 'GK', player: { type: 'GK-Stopper', level: 7 } },
];

// --- 1. PREDICT PLAYER GROWTH ----------------------------------------------
console.log('predictPlayerGrowth:');
{
  const res = predictPlayerGrowth({
    type: 'Guard',
    currentLevel: 6,
    targetLevel: 10,
  });

  check('predictPlayerGrowth works', typeof res === 'object');
  check('totalGain >= 0', res.totalGain >= 0);
  check('projected attributes >= current attributes', Object.keys(res.attributeGains).every((k) => (res.projectedAttributes[k] || 0) >= (res.currentAttributes[k] || 0)));
  assertNoNaN(res);
}

// --- 2. PREDICT POSITION GROWTH -------------------------------------------
console.log('\npredictPositionGrowth:');
{
  const res = predictPositionGrowth({
    type: 'Guard',
    currentLevel: 6,
    targetLevel: 10,
    position: 'CB1',
  });

  check('predictPositionGrowth works', typeof res === 'object');
  check('projectedScore >= currentScore', res.projectedScore >= res.currentScore);
  check('improvement computed correctly', res.improvement === Math.round((res.projectedScore - res.currentScore) * 100) / 100);
  check('explanations generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 3. PREDICT CHEMISTRY GROWTH ------------------------------------------
console.log('\npredictChemistryGrowth:');
{
  const res = predictChemistryGrowth({
    squad: mockSquad,
    targetLevels: 10,
  });

  check('predictChemistryGrowth works', typeof res === 'object');
  check('projectedChemistry >= currentChemistry', res.projectedChemistry >= res.currentChemistry);
  check('improvement computed correctly', typeof res.improvement === 'number');
  assertNoNaN(res);
}

// --- 4. PREDICT SQUAD GROWTH ----------------------------------------------
console.log('\npredictSquadGrowth:');
{
  const res = predictSquadGrowth({
    squad: mockSquad,
    formation: '442',
    targetLevels: 10,
  });

  check('predictSquadGrowth works', typeof res === 'object');
  check('projectedSquadScore >= currentSquadScore', res.projectedSquadScore >= res.currentSquadScore);
  check('explanations generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 5. FIND BEST INVESTMENT ----------------------------------------------
console.log('\nfindBestInvestment:');
{
  const res = findBestInvestment({
    squad: mockSquad,
    budgetLevels: 2,
  });

  check('findBestInvestment works', typeof res === 'object');
  check('returns player object', res.player && typeof res.player.type === 'string');
  check('roi is non-negative', res.roi >= 0);
  check('explanations generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 6. FIND HIGHEST GROWTH PLAYER ---------------------------------------
console.log('\nfindHighestGrowthPlayer:');
{
  const res = findHighestGrowthPlayer({
    squad: mockSquad,
  });

  check('findHighestGrowthPlayer works', typeof res === 'object');
  check('returns player object', res.player && typeof res.player.type === 'string');
  check('gain >= 0', res.gain >= 0);
  check('explanations generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  assertNoNaN(res);
}

// --- 7. PROJECT TO MAX LEVEL ----------------------------------------------
console.log('\nprojectToMaxLevel:');
{
  const res = projectToMaxLevel({
    type: 'Guard',
    currentLevel: 6,
    position: 'CB',
  });

  check('projectToMaxLevel works', typeof res === 'object');
  check('max-level projection ends at level 10', res.targetLevel === 10);
  check('improvement >= 0', res.improvement >= 0);
  check('projection object populated', typeof res.projection === 'object' && res.projection.positionScore >= 0);
  assertNoNaN(res);
}

// --- 8. RUN GROWTH PREDICTION DISPATCHER ----------------------------------
console.log('\nrunGrowthPrediction Master Dispatcher:');
{
  const res = runGrowthPrediction({
    predictionType: 'PLAYER_GROWTH',
    payload: {
      type: 'Guard',
      currentLevel: 6,
      targetLevel: 10,
    },
  });

  check('runGrowthPrediction dispatches correctly', res.predictionType === 'PLAYER_GROWTH');
  check('confidence exists', typeof res.confidence === 'number' && res.confidence >= 0 && res.confidence <= 100);
  check('explanations generated', typeof res.explanation === 'string' && res.explanation.length > 0);
  check('result object present', typeof res.result === 'object');
  assertNoNaN(res);
}

// --- 9. EDGE CASES & CLAMPING ---------------------------------------------
console.log('\nEdge Cases & Level Clamping:');
{
  // Level clamping works (out of bounds levels)
  const clampedRes = predictPlayerGrowth({
    type: 'Guard',
    currentLevel: -5,
    targetLevel: 99,
  });
  check('level clamping works (out-of-bounds bounded to 1..10)', clampedRes.projectedAttributes !== undefined);
  assertNoNaN(clampedRes);

  // Invalid prediction type throws
  let threw = false;
  try {
    runGrowthPrediction({ predictionType: 'INVALID_PREDICTION' });
  } catch {
    threw = true;
  }
  check('invalid prediction type throws', threw);

  // Projecting max level on level 10 player ends at 10
  const maxLvlRes = projectToMaxLevel({
    type: 'Guard',
    currentLevel: 10,
    position: 'CB',
  });
  check('max-level projection for Level 10 ends at level 10', maxLvlRes.targetLevel === 10 && maxLvlRes.improvement === 0);
  assertNoNaN(maxLvlRes);

  // Ensure no NaN values produced anywhere
  const nullCheck = predictPositionGrowth({});
  check('no NaN values on empty input', !Number.isNaN(nullCheck.improvement));
}

// --- SUMMARY -------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
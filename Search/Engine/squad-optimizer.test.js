/**
 * squad-optimizer.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 5 (Squad Optimizer Engine).
 * Run with: `node Search/Engine/squad-optimizer.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  optimizeSquad,
  calculateLineupScore,
  validateLineup,
  getBenchPlayers,
  compareFormations,
  findBestFormation,
} from './squad-optimizer.js';

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

console.log('Squad Optimizer Engine (Module 5) — test suite\n');

// Mock squad with 1 GK and 11 Outfield players (Total 12 players)
const testSquad = [
  { id: 'p1', type: 'GK-Stopper', level: 7 },
  { id: 'p2', type: 'Guard', level: 8 },
  { id: 'p3', type: 'Guard', level: 7 },
  { id: 'p4', type: 'Protector', level: 8 },
  { id: 'p5', type: 'Explorer', level: 7 },
  { id: 'p6', type: 'Producer', level: 8 },
  { id: 'p7', type: 'Commander', level: 8 },
  { id: 'p8', type: 'Engine', level: 7 },
  { id: 'p9', type: 'Intruder', level: 8 },
  { id: 'p10', type: 'Speedster', level: 8 },
  { id: 'p11', type: 'Hammer', level: 7 },
  { id: 'p12', type: 'Infiltrator', level: 6 },
];

// --- LINEUP CREATION -----------------------------------------------------
console.log('Lineup Creation:');
{
  const result = optimizeSquad(testSquad, '442');
  check('lineup generated successfully', typeof result === 'object' && result !== null);
  check('lineup size equals formation slots (11)', result.lineup.length === 11);
  check('lineup slots contain explainability metadata', 
    result.lineup[0].playerId && 
    result.lineup[0].type && 
    result.lineup[0].level && 
    result.lineup[0].position && 
    typeof result.lineup[0].score === 'number'
  );
}

// --- DUPLICATE PREVENTION ------------------------------------------------
console.log('\nDuplicate Prevention:');
{
  const result = optimizeSquad(testSquad, '442');
  const playerIds = result.lineup.map((p) => p.playerId);
  const uniqueIds = new Set(playerIds);
  check('no player appears twice in the starting lineup', uniqueIds.size === playerIds.length);
}

// --- GOALKEEPER RULES ----------------------------------------------------
console.log('\nGoalkeeper Rules:');
{
  const result = optimizeSquad(testSquad, '442');
  const gkSlot = result.lineup.find((slot) => slot.position === 'GK');
  check('goalkeeper slot contains GK player type', gkSlot && gkSlot.type.startsWith('GK'));

  const outfieldSlots = result.lineup.filter((slot) => slot.position !== 'GK');
  const hasGKInOutfield = outfieldSlots.some((slot) => slot.type.startsWith('GK'));
  check('outfield player never occupies GK and GK never occupies outfield slot', !hasGKInOutfield);
}

// --- BENCH MANAGEMENT ----------------------------------------------------
console.log('\nBench Management:');
{
  const result = optimizeSquad(testSquad, '442');
  const bench = getBenchPlayers(testSquad, result.lineup);
  check('unused players moved to bench (12 total - 11 starting = 1 bench)', result.bench.length === 1 && bench.length === 1);
  check('bench contains correct player ID', result.bench[0].playerId === 'p12');
}

// --- VALIDATION LOGIC ----------------------------------------------------
console.log('\nValidation Logic:');
{
  const result = optimizeSquad(testSquad, '442');
  const validCheck = validateLineup(result.lineup, '442');
  check('valid lineup passes validation check', validCheck.valid && validCheck.errors.length === 0);

  // Malformed lineup test (duplicate player)
  const malformedLineup = [...result.lineup];
  malformedLineup[1] = { ...malformedLineup[0] };
  const invalidCheck = validateLineup(malformedLineup, '442');
  check('malformed lineup fails validation check', !invalidCheck.valid && invalidCheck.errors.length > 0);
}

// --- SCORING FUNCTIONS ---------------------------------------------------
console.log('\nScoring Computation:');
{
  const result = optimizeSquad(testSquad, '442');
  const scoreMetrics = calculateLineupScore(result.lineup);
  check('total score computed correctly', scoreMetrics.totalScore > 0 && scoreMetrics.totalScore === result.totalScore);
  check('average score computed correctly', scoreMetrics.averageScore === Math.round((result.totalScore / 11) * 10) / 10);
}

// --- FORMATION COMPARISON ------------------------------------------------
console.log('\nFormation Comparison:');
{
  const comparisons = compareFormations(testSquad, ['442', '433', '352']);
  check('returns comparison for all requested formations', comparisons.length === 3);
  check('formations sorted descending by total score', comparisons[0].score >= comparisons[1].score && comparisons[1].score >= comparisons[2].score);
}

// --- BEST FORMATION ------------------------------------------------------
console.log('\nBest Formation Search:');
{
  const comparisons = compareFormations(testSquad, ['442', '433', '532', '352', '451', '541', '343']);
  const best = findBestFormation(testSquad);
  check('findBestFormation matches highest score comparison winner', best.formation === comparisons[0].formation && best.score === comparisons[0].score);
}

// --- DETERMINISM ---------------------------------------------------------
console.log('\nDeterminism:');
{
  const run1 = optimizeSquad(testSquad, '442');
  const run2 = optimizeSquad(testSquad, '442');
  const sameTotalScore = run1.totalScore === run2.totalScore;
  const sameLineup = JSON.stringify(run1.lineup) === JSON.stringify(run2.lineup);
  check('same squad + formation produces identical lineup and score', sameTotalScore && sameLineup);
}

// --- OVERRIDE PROPAGATION ------------------------------------------------
console.log('\nOverride Propagation:');
{
  const baseResult = optimizeSquad(testSquad, '442');

  // ✅ Direct attribute overrides for player type
  const overrides = { Guard: { sp: 99, st: 99, rs: 99 } }; 
  const overriddenResult = optimizeSquad(testSquad, '442', overrides);

  check(
    'user-corrected stat overrides influence overall optimization score',
    overriddenResult.totalScore > baseResult.totalScore
  );
}

// --- SUMMARY -------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
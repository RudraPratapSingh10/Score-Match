/**
 * chemistry-engine.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 6 (Chemistry / Synergy Engine).
 * Run with: `node Search/Engine/chemistry-engine.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  scorePairChemistry,
  scoreLineupChemistry,
  getChemistryBreakdown,
  getPositiveChemistryPairs,
  getNegativeChemistryPairs,
  calculateTeamChemistry,
  compareLineupChemistry,
  evaluateLineupStructure,
} from './chemistry-engine.js';

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

console.log('Chemistry / Synergy Engine (Module 6) — test suite\n');

// Sample balanced 11-player squad
const sampleLineup = [
  { playerId: 'p1', type: 'GK-Stopper', level: 8 },
  { playerId: 'p2', type: 'Guard', level: 8 },
  { playerId: 'p3', type: 'Protector', level: 8 },
  { playerId: 'p4', type: 'Commander', level: 8 },
  { playerId: 'p5', type: 'Architect', level: 8 },
  { playerId: 'p6', type: 'Producer', level: 8 },
  { playerId: 'p7', type: 'Explorer', level: 8 },
  { playerId: 'p8', type: 'Speedster', level: 8 },
  { playerId: 'p9', type: 'Hammer', level: 8 },
  { playerId: 'p10', type: 'Prowler', level: 8 },
  { playerId: 'p11', type: 'Menace', level: 8 },
];

// --- PAIR CHEMISTRY -------------------------------------------------------
console.log('Pair Chemistry:');
{
  const posResult = scorePairChemistry({ type: 'Guard', level: 7 }, { type: 'Protector', level: 7 });
  check('positive pair detected', posResult.score > 0 && posResult.category === 'positive');

  const negResult = scorePairChemistry({ type: 'Hammer', level: 7 }, { type: 'Hammer', level: 7 });
  check('negative pair detected', negResult.score < 0 && negResult.category === 'negative');

  const neuResult = scorePairChemistry({ type: 'Guard', level: 7 }, { type: 'Speedster', level: 7 });
  check('neutral pair handled', neuResult.score === 0 && neuResult.category === 'neutral');
}

// --- TEAM CHEMISTRY -------------------------------------------------------
console.log('\nTeam Chemistry:');
{
  const totalScore = calculateTeamChemistry(sampleLineup);
  check('chemistry score generated', typeof totalScore === 'number');
  check('score within 0–100', totalScore >= 0 && totalScore <= 100);
}

// --- POSITIVE PAIRS -------------------------------------------------------
console.log('\nPositive Pairs:');
{
  const posPairs = getPositiveChemistryPairs(sampleLineup);
  check('positive pair list returned', Array.isArray(posPairs) && posPairs.length > 0);
  check('contains Guard + Protector synergy', posPairs.some((p) => p.playerA === 'Guard' && p.playerB === 'Protector'));
}

// --- NEGATIVE PAIRS -------------------------------------------------------
console.log('\nNegative Pairs:');
{
  const negativeLineup = [
    { playerId: 'p1', type: 'GK-Stopper', level: 7 },
    { playerId: 'p2', type: 'Hammer', level: 7 },
    { playerId: 'p3', type: 'Hammer', level: 7 }, // Hammer + Hammer negative pair
    { playerId: 'p4', type: 'Guard', level: 7 },
    { playerId: 'p5', type: 'Protector', level: 7 },
  ];
  const negPairs = getNegativeChemistryPairs(negativeLineup);
  check('negative pair list returned', Array.isArray(negPairs) && negPairs.length > 0);
  check('identifies redundant Hammer + Hammer pair', negPairs.some((p) => p.score < 0));
}

// --- BONUSES -------------------------------------------------------------
console.log('\nBonuses:');
{
  const struct = evaluateLineupStructure(sampleLineup);
  check('balanced defense bonus', struct.bonuses.some((b) => b.source === 'Balanced Back Line'));
  check('creative midfield bonus', struct.bonuses.some((b) => b.source === 'Creative Midfield'));
  check('fast attack bonus', struct.bonuses.some((b) => b.source === 'Fast Attack'));
}

// --- PENALTIES -----------------------------------------------------------
console.log('\nPenalties:');
{
  const noGKLineup = [
    { playerId: 'p1', type: 'Guard', level: 7 },
    { playerId: 'p2', type: 'Protector', level: 7 },
    { playerId: 'p3', type: 'Producer', level: 7 },
    { playerId: 'p4', type: 'Speedster', level: 7 },
  ];
  const structNoGK = evaluateLineupStructure(noGKLineup);
  check('no goalkeeper penalty', structNoGK.penalties.some((p) => p.source === 'No Goalkeeper'));

  const dupLineup = [
    { playerId: 'p1', type: 'GK-Stopper', level: 7 },
    { playerId: 'p2', type: 'Guard', level: 7 },
    { playerId: 'p3', type: 'Guard', level: 7 },
    { playerId: 'p4', type: 'Guard', level: 7 },
    { playerId: 'p5', type: 'Guard', level: 7 }, // 4 Guards (>3 duplicate penalty)
  ];
  const structDup = evaluateLineupStructure(dupLineup);
  check('duplicate archetype penalty', structDup.penalties.some((p) => p.source.startsWith('Excessive Archetype')));
}

// --- BREAKDOWN -----------------------------------------------------------
console.log('\nBreakdown:');
{
  const breakdown = getChemistryBreakdown(sampleLineup);
  check('category breakdown totals valid', 
    typeof breakdown.defensiveChemistry === 'number' &&
    typeof breakdown.midfieldChemistry === 'number' &&
    typeof breakdown.attackingChemistry === 'number' &&
    typeof breakdown.goalkeeperChemistry === 'number' &&
    typeof breakdown.penalties === 'number'
  );
}

// --- COMPARISON ----------------------------------------------------------
console.log('\nComparison:');
{
  const weakLineup = [
    { playerId: 'p1', type: 'Hammer', level: 5 },
    { playerId: 'p2', type: 'Hammer', level: 5 },
    { playerId: 'p3', type: 'Hammer', level: 5 },
  ];

  const comparison = compareLineupChemistry(sampleLineup, weakLineup);
  check('lineup comparison works', comparison.winner === 'A' && comparison.chemistryDifference > 0);
}

// --- DETERMINISM ---------------------------------------------------------
console.log('\nDeterminism:');
{
  const eval1 = scoreLineupChemistry(sampleLineup);
  const eval2 = scoreLineupChemistry(sampleLineup);

  const sameScore = eval1.chemistryScore === eval2.chemistryScore;
  const samePairCount = eval1.pairScores.length === eval2.pairScores.length;

  check('identical lineup returns identical chemistry', sameScore && samePairCount);
}

// --- SUMMARY -------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
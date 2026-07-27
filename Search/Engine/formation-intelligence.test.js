/**
 * formation-intelligence.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Module 3 (Formation Intelligence Layer).
 * Run with: `node Search/Engine/formation-intelligence.test.js`
 * ---------------------------------------------------------------------------
 */

import {
  getFormation,
  getSlots,
  countSlots,
  getPositionCounts,
  expandFormation,
  getRoleCounts,
  getAllFormations,
  assertValidFormation,
  UnknownFormationError,
} from './formation-intelligence.js';

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

console.log('Formation Intelligence Layer — test suite\n');

// --- VALIDATION TESTS ----------------------------------------------------
console.log('Validation:');
{
  let validPassed = false;
  try {
    assertValidFormation('442');
    validPassed = true;
  } catch (e) {
    validPassed = false;
  }
  check('valid formation accepted', validPassed);

  let caughtInvalid = false;
  try {
    assertValidFormation('999');
  } catch (e) {
    caughtInvalid = e instanceof UnknownFormationError;
  }
  check('invalid formation rejected with UnknownFormationError', caughtInvalid);
}

// --- FORMATION RETRIEVAL TESTS -------------------------------------------
console.log('\nFormation Retrieval:');
{
  const formation = getFormation('442');
  check('getFormation works and returns correct structure', formation && formation.id === '442' && formation.name === '4-4-2');

  const slots = getSlots('433');
  check('getSlots works and returns array', Array.isArray(slots) && slots[0] === 'GK' && slots.includes('LW'));
}

// --- COUNTING TESTS ------------------------------------------------------
console.log('\nSlot & Role Counting:');
{
  const total = countSlots('532');
  check('countSlots = 11', total === 11);

  const roles = getRoleCounts('442');
  check('role counts correct for 4-4-2 (1 GK, 4 DEF, 4 MID, 2 FWD)',
    roles.goalkeepers === 1 &&
    roles.defenders === 4 &&
    roles.midfielders === 4 &&
    roles.forwards === 2
  );
}

// --- POSITION COUNTS TESTS -----------------------------------------------
console.log('\nPosition Counts:');
{
  const counts532 = getPositionCounts('532');
  check('CB count correct in 5-3-2 (3 CBs)', counts532.CB === 3);

  const counts442 = getPositionCounts('442');
  check('ST count correct in 4-4-2 (2 STs)', counts442.ST === 2);
}

// --- EXPANSION TESTS -----------------------------------------------------
console.log('\nSlot Expansion:');
{
  const expanded = expandFormation('433');
  check('expandFormation returns 11 rich slot objects', expanded.length === 11);
  check('expandFormation slot metadata structure is valid', expanded[0].slotIndex === 0 && expanded[0].slotName === 'GK');
  check('role assignment correct for 4-3-3 LW (forward)', expanded.find(s => s.slotName === 'LW').role === 'forward');
}

// --- ALL FORMATIONS TESTS ------------------------------------------------
console.log('\nAll Formations Retrieval:');
{
  const all = getAllFormations();
  check('returns every supported formation (at least 7)', Array.isArray(all) && all.length >= 7);
}

// --- SUMMARY -------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}
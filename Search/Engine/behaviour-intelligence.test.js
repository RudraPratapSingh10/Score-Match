/**
 * behaviour-intelligence.test.js
 * ---------------------------------------------------------------------------
 * Lightweight, dependency-free test suite for Module 1 (Behaviour
 * Intelligence Layer). Run with: `node behaviour-intelligence.test.js`
 *
 * No test framework dependency by design — this module must remain trivial
 * to run in any environment (including a future CI pipeline with no
 * pre-installed test runner) while the project is still small. If/when the
 * codebase grows, these assertions translate 1:1 into Jest/Vitest `test()`
 * blocks with no logic changes.
 * ---------------------------------------------------------------------------
 */

import {
  resolveAttributes,
  resolveAllLevels,
  computeAttributeCeilings,
  listEstimatedCells,
  isGoalkeeperType,
  UnknownBehaviourTypeError,
} from './behaviour-intelligence.js';

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

console.log('Behaviour Intelligence Layer — test suite\n');

// --- Ground-truth regression check --------------------------------------
// This exact figure (Guard, level 6) was confirmed directly against an
// in-game screenshot during data entry. If this ever fails, the default
// data table has been changed and needs re-verification against the game.
console.log('Ground-truth regression:');
{
  const g6 = resolveAttributes('Guard', 6);
  check('Guard L6 Speed = 20', g6.sp === 20);
  check('Guard L6 Height = 14', g6.ht === 14);
  check('Guard L6 Strength = 25', g6.st === 25);
  check('Guard L6 Power = 7', g6.pw === 7);
  check('Guard L6 Skill = 11', g6.sk === 11);
  check('Guard L6 Response = 28', g6.rs === 28);
  check('Guard L6 is fully verified (no estimated cells)',
    Object.values(g6.provenance).every((p) => p === 'verified'));
}

// --- Provenance correctness -----------------------------------------------
console.log('\nProvenance tracking:');
{
  const g4 = resolveAttributes('Guard', 4); // known gap in source data
  check('Guard L4 (a known data gap) is reported as estimated',
    Object.values(g4.provenance).every((p) => p === 'estimated'));
}

// --- Override precedence ---------------------------------------------------
console.log('\nUser override precedence:');
{
  const overrides = { Guard: { 6: { sp: 99 } } };
  const g6o = resolveAttributes('Guard', 6, overrides);
  check('Overridden attribute reflects the override value', g6o.sp === 99);
  check('Overridden attribute is labeled user-corrected', g6o.provenance.sp === 'user-corrected');
  check('Non-overridden attributes are untouched', g6o.ht === 14 && g6o.provenance.ht === 'verified');
}

// --- Input robustness --------------------------------------------------
console.log('\nInput robustness:');
{
  check('Level above 10 clamps to 10', resolveAttributes('Guard', 55).level === 10);
  check('Level below 1 clamps to 1', resolveAttributes('Guard', -3).level === 1);
  check('Non-numeric level defaults to level 1', resolveAttributes('Guard', 'abc').level === 1);

  let threwCorrectType = false;
  try {
    resolveAttributes('NotARealType', 5);
  } catch (e) {
    threwCorrectType = e instanceof UnknownBehaviourTypeError;
  }
  check('Unknown behaviour type throws UnknownBehaviourTypeError', threwCorrectType);
}

// --- Goalkeeper detection ---------------------------------------------
console.log('\nGoalkeeper type detection:');
{
  check('GK-Stopper is detected as a goalkeeper type', isGoalkeeperType('GK-Stopper') === true);
  check('GK-Sweeper is detected as a goalkeeper type', isGoalkeeperType('GK-Sweeper') === true);
  check('Hammer is NOT detected as a goalkeeper type', isGoalkeeperType('Hammer') === false);
}

// --- Bulk resolution -----------------------------------------------------
console.log('\nBulk level resolution:');
{
  const allGuard = resolveAllLevels('Guard');
  check('resolveAllLevels returns exactly 10 rows', allGuard.length === 10);
  check('Rows are ordered level 1..10', allGuard[0].level === 1 && allGuard[9].level === 10);
}

// --- Normalization ceilings ------------------------------------------------
console.log('\nAttribute ceiling computation:');
{
  const ceilings = computeAttributeCeilings();
  const inSaneRange = (v) => v > 20 && v < 60;
  check('Speed ceiling is in a sane range (excludes maxed level-10 outliers)', inSaneRange(ceilings.sp));
  check('Height ceiling is in a sane range', inSaneRange(ceilings.ht));
}

// --- Data-quality reporting ------------------------------------------------
console.log('\nEstimated-cell reporting:');
{
  const estimated = listEstimatedCells();
  check('At least one estimated cell is reported (known data gaps exist)', estimated.length > 0);
  check('Estimated-cell records are well-formed',
    estimated.every((c) => c.type && Number.isInteger(c.level) && c.attr));
}

// --- Summary ---------------------------------------------------------------
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}

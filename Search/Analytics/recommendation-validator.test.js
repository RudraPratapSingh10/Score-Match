/**
 * recommendation-validator.test.js
 * ---------------------------------------------------------------------------
 * Unit & Integration tests for recommendation-validator.js
 * Run with: node Search/Analytics/recommendation-validator.test.js
 */

import {
  validateFormation,
  validateChemistry,
  validateSuitability,
  validateSquad,
  validateRecommendation,
  generateValidationReport
} from './recommendation-validator.js';

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

console.log('Recommendation Validator Test Suite\n');

try {
  // 1. Formation Validation
  check('validateFormation accepts valid formations', validateFormation('4-4-2').length === 0);
  check('validateFormation rejects invalid formations', validateFormation('99-99').length > 0);

  // 2. Chemistry & Suitability Validation
  check('validateChemistry accepts valid ranges', validateChemistry(85).length === 0);
  check('validateChemistry rejects out of bounds (>100)', validateChemistry(150).length > 0);
  check('validateChemistry rejects NaN', validateChemistry(NaN).length > 0);

  check('validateSuitability accepts valid ranges', validateSuitability(92).length === 0);
  check('validateSuitability rejects negative values', validateSuitability(-5).length > 0);

  // 3. Squad Validation
  const validSquad = [
    { id: 'p1', position: 'GK' },
    { id: 'p2', position: 'CB' },
    { id: 'p3', position: 'CM' },
  ];
  check('validateSquad accepts valid squad list', validateSquad(validSquad).length === 0);

  const duplicateSquad = [
    { id: 'p1', position: 'GK' },
    { id: 'p1', position: 'CB' },
  ];
  check('validateSquad detects duplicate player IDs', validateSquad(duplicateSquad).includes('Duplicate player found: p1'));

  const fullSquadNoGk = Array(11).fill(null).map((_, i) => ({ id: `p_${i}`, position: 'CB' }));
  check('validateSquad flags missing goalkeeper on full squad', validateSquad(fullSquadNoGk).includes('Missing goalkeeper'));

  // 4. Validation Report
  const badRec = {
    formation: 'INVALID',
    chemistry: 120,
    squad: duplicateSquad
  };

  const report = generateValidationReport(badRec);
  check('generateValidationReport detects multiple errors',
    report.valid === false &&
    report.errors.length >= 3
  );

  const goodRec = {
    formation: '4-3-3',
    chemistry: 88,
    suitability: 91,
    squad: validSquad
  };
  check('generateValidationReport passes valid input', generateValidationReport(goodRec).valid === true);

} catch (err) {
  check(`unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
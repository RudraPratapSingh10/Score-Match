/**
 * user-overrides.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Search/Storage/user-overrides.js
 * Run with: node Search/Storage/user-overrides.test.js
 * ---------------------------------------------------------------------------
 */

import {
  loadOverrides,
  saveOverrides,
  updateOverride,
  removeOverride,
  clearOverrides,
  exportOverrides,
  importOverrides,
  migrateOverrides,
} from './user-overrides.js';

// Setup Mock LocalStorage for Node environment
let mockStorage = {};
global.window = {
  localStorage: {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { mockStorage = {}; },
  },
};

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

console.log('User Overrides Storage — Test Suite\n');

// 1. Initial Load Test
console.log('loadOverrides & defaults:');
clearOverrides();
const initial = loadOverrides();
check('never returns null', initial !== null);
check('returns valid default structure', typeof initial === 'object' && typeof initial.overrides === 'object');

// 2. Save and Load Test
console.log('\nsaveOverrides & loadOverrides:');
const testData = {
  version: '2026.07.27-1',
  overrides: { Guard: { 6: { sp: 99 } } },
};
check('save works', saveOverrides(testData));
const loaded = loadOverrides();
check('load works', loaded.overrides?.Guard?.[6]?.sp === 99);

// 3. Update Override Test
console.log('\nupdateOverride:');
updateOverride('Guard', 6, 'st', 85);
const updated = loadOverrides();
check('update works (preserves existing & adds new)', updated.overrides.Guard[6].sp === 99 && updated.overrides.Guard[6].st === 85);

// 4. Remove Override Test
console.log('\nremoveOverride:');
removeOverride('Guard', 6, 'sp');
const removedStat = loadOverrides();
check('remove single stat works', removedStat.overrides.Guard[6].sp === undefined && removedStat.overrides.Guard[6].st === 85);

removeOverride('Guard', 6);
const removedLevel = loadOverrides();
check('remove level works', removedLevel.overrides.Guard === undefined);

// 5. Clear Overrides Test
console.log('\nclearOverrides:');
updateOverride('Engine', 10, 'pas', 90);
clearOverrides();
const cleared = loadOverrides();
check('clear works', Object.keys(cleared.overrides).length === 0);

// 6. Export and Import Test
console.log('\nexportOverrides & importOverrides:');
updateOverride('Speedster', 8, 'sp', 95);
const exported = exportOverrides();
check('export works (returns JSON string)', typeof exported === 'string' && exported.includes('Speedster'));

clearOverrides();
check('import works', importOverrides(exported));
const imported = loadOverrides();
check('imported data accurate', imported.overrides.Speedster?.[8]?.sp === 95);

// 7. Data Migration Test
console.log('\nmigrateOverrides:');
const unversionedLegacyData = {
  Guard: { 5: { sp: 70 } },
};
const migrated = migrateOverrides(unversionedLegacyData);
check('migration works (applies current version)', migrated.version === '2026.07.27-1' && migrated.overrides.Guard[5].sp === 70);

// 8. Error Handling & Robustness
console.log('\nCorrupted Data & Invalid JSON Handling:');
window.localStorage.setItem('score_match_user_overrides', 'invalid_json_{{');
const corrupted = loadOverrides();
check('corrupted data handled (returns empty structure)', corrupted !== null && Object.keys(corrupted.overrides).length === 0);

check('invalid import JSON handled', importOverrides('invalid_json_{{') === false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
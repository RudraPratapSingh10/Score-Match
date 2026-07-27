/**
 * saved-squads.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Search/Storage/saved-squads.js
 * Run with: node Search/Storage/saved-squads.test.js
 * ---------------------------------------------------------------------------
 */

import {
  loadSquads,
  saveSquad,
  updateSquad,
  deleteSquad,
  clearSquads,
  exportSquads,
  importSquads,
} from './saved-squads.js';

// Setup Mock LocalStorage
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

console.log('Saved Squads Storage — Test Suite\n');

// 1. Initial Load Test
console.log('loadSquads defaults:');
clearSquads();
const initial = loadSquads();
check('returns [] when missing', Array.isArray(initial) && initial.length === 0);

// 2. Create Squad Test
console.log('\ncreate squad & saveSquad:');
const squad1 = saveSquad({
  name: 'Main 4-4-2',
  formation: '4-4-2',
  players: [{ position: 'CB', type: 'Guard' }],
});
check('squad created', squad1 !== null);
check('unique ids generated', typeof squad1?.id === 'string' && squad1.id.startsWith('sqd_'));

const squad2 = saveSquad({
  name: 'Counter 5-3-2',
  formation: '5-3-2',
});
check('second squad generated unique id', squad1.id !== squad2.id);

// 3. Update Squad Test
console.log('\nupdate squad:');
const updated = updateSquad(squad1.id, { name: 'Updated 4-4-2 Arena' });
check('update squad works', updated !== null && updated.name === 'Updated 4-4-2 Arena');

// 4. Delete Squad Test
console.log('\ndelete squad:');
const deletedSuccess = deleteSquad(squad2.id);
const currentSquads = loadSquads();
check('delete squad works', deletedSuccess && currentSquads.length === 1 && currentSquads[0].id === squad1.id);

// 5. Export and Import Test
console.log('\nexport & import squads:');
const jsonExport = exportSquads();
check('export squads works', typeof jsonExport === 'string' && jsonExport.includes('Updated 4-4-2 Arena'));

clearSquads();
check('clear squads works', loadSquads().length === 0);

check('import squads works', importSquads(jsonExport));
const importedSquads = loadSquads();
check('imported data restored', importedSquads.length === 1 && importedSquads[0].name === 'Updated 4-4-2 Arena');

// 6. Robustness & Corrupted Data
console.log('\nCorrupted Data & Error Handling:');
window.localStorage.setItem('score_match_saved_squads', 'corrupted_json_#$');
const corruptedLoad = loadSquads();
check('corrupted data handled (returns [])', Array.isArray(corruptedLoad) && corruptedLoad.length === 0);

check('invalid import handled', importSquads('{ invalid_json') === false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
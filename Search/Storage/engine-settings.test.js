/**
 * engine-settings.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Search/Storage/engine-settings.js
 * Run with: node Search/Storage/engine-settings.test.js
 * ---------------------------------------------------------------------------
 */

import {
  loadSettings,
  saveSettings,
  updateSetting,
  resetSettings,
  exportSettings,
  importSettings,
} from './engine-settings.js';

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

console.log('Engine Settings Storage — Test Suite\n');

// 1. Defaults Load Test
console.log('defaults load:');
window.localStorage.clear();
const defaults = loadSettings();
check('defaults load', defaults.preferredFormation === '4-4-2' && defaults.autoOptimize === true && defaults.theme === 'system');

// 2. Save Settings Test
console.log('\nsave works:');
const customSettings = {
  preferredFormation: '5-3-2',
  autoOptimize: false,
  showExplanations: true,
  simulationConfidence: false,
  theme: 'dark',
};
check('save works', saveSettings(customSettings));
const loaded = loadSettings();
check('saved settings loaded accurately', loaded.preferredFormation === '5-3-2' && loaded.theme === 'dark');

// 3. Update Setting Test
console.log('\nupdate works:');
const updated = updateSetting('theme', 'light');
check('update works', updated.theme === 'light' && updated.preferredFormation === '5-3-2');

// 4. Reset Settings Test
console.log('\nreset works & defaults restored:');
const reset = resetSettings();
check('reset works', reset.theme === 'system' && reset.preferredFormation === '4-4-2');

// 5. Export and Import Test
console.log('\nexport & import settings:');
updateSetting('preferredFormation', '3-5-2');
const jsonExport = exportSettings();
check('export works', typeof jsonExport === 'string' && jsonExport.includes('3-5-2'));

resetSettings();
check('import works', importSettings(jsonExport));
const imported = loadSettings();
check('imported settings restored correctly', imported.preferredFormation === '3-5-2');

// 6. Robustness & Corrupted Storage Test
console.log('\nCorrupted Storage & Invalid JSON Handling:');
window.localStorage.setItem('score_match_engine_settings', 'corrupted_json_!@#');
const corruptedLoad = loadSettings();
check('corrupted storage handled (defaults restored correctly)', corruptedLoad.preferredFormation === '4-4-2');

check('invalid JSON import handled', importSettings('invalid_json') === false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
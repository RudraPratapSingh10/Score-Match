/**
 * engine-api.test.js
 * ---------------------------------------------------------------------------
 * Test suite for Search/API/engine-api.js
 * Run with: node Search/API/engine-api.test.js
 * ---------------------------------------------------------------------------
 */

import {
  recommend,
  optimize,
  simulate,
  predict,
  explain,
  saveSquad,
  loadSquads,
  deleteSquad,
  exportSquads,
  importSquads,
  saveOverride,
  removeOverride,
  loadOverrides,
  exportOverrides,
  importOverrides,
  resetOverrides,
  loadSettings,
  saveSettings,
  updateSetting,
  resetSettings,
  getEngineVersion,
  getSystemStatus,
  validateEngine,
  EngineApiError,
  InvalidRequestError,
  StorageError,
  ValidationError,
} from './engine-api.js';

// Setup Mock LocalStorage for Node environment testing
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

console.log('Engine API Layer — Test Suite\n');

// 1. Recommendation API Tests
console.log('Recommendation API:');
const recRes = recommend({ formation: '442', players: ['Guard', 'Engine', 'Speedster'] });
check('recommend works', recRes && Array.isArray(recRes.recommendations));
check('confidence returned', typeof recRes.confidence === 'number' && !isNaN(recRes.confidence));
check('explanation returned', typeof recRes.explanation === 'string');

// 2. Optimizer API Tests
console.log('\nOptimizer API:');
const optRes = optimize({ formation: '442', players: ['Guard', 'Engine'] });
check('optimize works', optRes && typeof optRes === 'object');
check('optimized squad returned', Array.isArray(optRes.optimizedSquad));
check('score returned', typeof optRes.score === 'number' && !isNaN(optRes.score));

// 3. Simulation API Tests
console.log('\nSimulation API:');
const simRes = simulate({ scenarioType: 'TACTICAL_MATCH', payload: { opponentFormation: '3-5-2' } });
check('simulate works', simRes && typeof simRes === 'object');
check('result returned', simRes.result !== undefined);

// 4. Prediction API Tests
console.log('\nPrediction API:');
const predRes = predict({ predictionType: 'SQUAD_GROWTH', payload: { targetLevel: 10 } });
check('predict works', predRes && typeof predRes === 'object');
check('prediction returned', predRes.result !== undefined);

// 5. Explanation API Tests
console.log('\nExplanation API:');
const expRes = explain({ explanationType: 'TACTICAL', payload: {} });
check('explain works', expRes && typeof expRes.explanation === 'string');

// 6. Persistence API — Squads Tests
console.log('\nPersistence API (Squads):');
const squad = saveSquad({ name: 'Alpha 4-4-2', formation: '4-4-2' });
check('saveSquad works', squad !== null && squad.name === 'Alpha 4-4-2');

const squadsList = loadSquads();
check('loadSquads works', Array.isArray(squadsList) && squadsList.length > 0);

const exportedSquads = exportSquads();
check('exportSquads works', typeof exportedSquads === 'string' && exportedSquads.includes('Alpha 4-4-2'));

const deleted = deleteSquad(squad.id);
check('deleteSquad works', deleted === true);

check('importSquads works', importSquads(exportedSquads));

// 7. Persistence API — Overrides Tests
console.log('\nPersistence API (Overrides):');
const savedOv = saveOverride('Guard', 5, 'sp', 88);
check('saveOverride works', savedOv && savedOv.overrides?.Guard?.[5]?.sp === 88);

const exportedOv = exportOverrides();
check('exportOverrides works', typeof exportedOv === 'string' && exportedOv.includes('Guard'));

resetOverrides();
check('resetOverrides works', Object.keys(loadOverrides().overrides).length === 0);

check('importOverrides works', importOverrides(exportedOv));

const removedOv = removeOverride('Guard', 5, 'sp');
check('removeOverride works', removedOv && removedOv.overrides?.Guard?.[5]?.sp === undefined);

// 8. Persistence API — Settings Tests
console.log('\nPersistence API (Settings):');
const loadedSet = loadSettings();
check('loadSettings works', loadedSet && loadedSet.preferredFormation !== undefined);

const updatedSet = updateSetting('theme', 'dark');
check('updateSetting works', updatedSet.theme === 'dark');

const resetSet = resetSettings();
check('resetSettings works', resetSet.theme === 'system');

// 9. System Health API Tests
console.log('\nSystem Health API:');
const ver = getEngineVersion();
check('getEngineVersion works', ver && ver.version === '2026.07.27-1');

const status = getSystemStatus();
check('getSystemStatus works', status && status.healthy === true);

const validation = validateEngine();
check('validateEngine works', validation && validation.valid === true);

// 10. Robustness & Bad Input Tests
console.log('\nRobustness & Error Handling:');
const badRec = recommend(null);
check('invalid request handled (no crash)', badRec && Array.isArray(badRec.recommendations));

const badOpt = optimize('invalid_string_input');
check('malformed payload handled (no crash)', badOpt && typeof badOpt.score === 'number');

const errInstance = new InvalidRequestError('Test error');
check('custom error class exported properly', errInstance instanceof EngineApiError);

check('no NaN values in score outputs', !isNaN(badOpt.score) && !isNaN(badRec.confidence));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
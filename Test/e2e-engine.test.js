/**
 * e2e-engine.test.js
 * ---------------------------------------------------------------------------
 * PHASE D — End-to-End Engine Validation
 * ---------------------------------------------------------------------------
 * Validates the core initialization, export integrity, and status of the stack.
 * Run with: node Tests/e2e-engine.test.js
 */

import * as EngineApi from '../Search/API/engine-api.js';

// Setup Mock Storage for Node context
let mockStorage = {};
global.window = {
  localStorage: {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { mockStorage = {}; },
  },
};

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

console.log('E2E Engine Stack Test\n');

try {
  check('engine loads successfully', EngineApi !== null && typeof EngineApi === 'object');

  const requiredExports = [
    'recommend', 'optimize', 'simulate', 'predict', 'explain',
    'saveSquad', 'loadSquads', 'deleteSquad', 'exportSquads', 'importSquads',
    'saveOverride', 'removeOverride', 'loadOverrides', 'exportOverrides', 'importOverrides', 'resetOverrides',
    'loadSettings', 'saveSettings', 'updateSetting', 'resetSettings',
    'getEngineVersion', 'getSystemStatus', 'validateEngine',
    'EngineApiError', 'InvalidRequestError', 'StorageError', 'ValidationError'
  ];

  let missingExports = 0;
  for (const exp of requiredExports) {
    if (EngineApi[exp] === undefined) {
      missingExports++;
    }
  }
  check('all API functions exported', missingExports === 0);

  const ver = EngineApi.getEngineVersion();
  check('engine version exists', ver && typeof ver.version === 'string' && ver.version.length > 0);

  const status = EngineApi.getSystemStatus();
  check('system status valid', status && status.healthy === true && status.modulesLoaded === true);

  const validation = EngineApi.validateEngine();
  check('validation passes', validation && validation.valid === true && validation.errors.length === 0);

  // Persistence check
  const testSquad = { name: 'E2E Test Squad', formation: '4-4-2' };
  const saved = EngineApi.saveSquad(testSquad);
  const loaded = EngineApi.loadSquads();
  check('persistence layer connected', saved && loaded.some(s => s.name === 'E2E Test Squad'));
  if (saved) EngineApi.deleteSquad(saved.id);

  // Recommendation engine connection check
  const rec = EngineApi.recommend({ formation: '442', players: ['Guard', 'Producer'] });
  check('recommendation engine connected', rec && Array.isArray(rec.recommendations));

  check('no undefined exports', Object.values(EngineApi).every(v => v !== undefined));
  check('no crashes during standard API lifecycle', true);

} catch (err) {
  check(`unexpected crash: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
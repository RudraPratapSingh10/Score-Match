import {
  createSession,
  storeContext,
  getContext,
  clearContext,
  getLastQuery,
  getLastRecommendation
} from './assistant-memory.js';

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

console.log('Assistant Memory Test Suite\n');

try {
  const sessId = 'mem-test-session';

  // 1. Creation & Context
  createSession(sessId);
  check('createSession initializes empty context', getContext(sessId).lastQuery === null);

  // 2. Storage & Retrieval
  storeContext(sessId, { lastQuery: 'Best CB?', lastFormation: '4-4-2' });
  check('storeContext updates session memory', getContext(sessId).lastFormation === '4-4-2');
  check('getLastQuery retrieves stored query', getLastQuery(sessId) === 'Best CB?');

  // 3. Recommendation storage
  storeContext(sessId, { lastRecommendation: { behaviour: 'Guard', score: 95 } });
  check('getLastRecommendation retrieves stored rec', getLastRecommendation(sessId).behaviour === 'Guard');

  // 4. Clear
  clearContext(sessId);
  check('clearContext resets context completely', getContext(sessId).lastQuery === null);

} catch (err) {
  check(`Unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
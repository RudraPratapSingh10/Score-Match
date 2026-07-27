import {
  processQuery,
  routeIntent,
  buildResponse,
  handleUnknownIntent
} from './conversation-engine.js';

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

console.log('Conversation Engine Test Suite\n');

try {
  // Process Queries
  const res1 = processQuery('Best CB for 4-4-2?', 'test-sess');
  check('processQuery handles player recommendation', res1.intent === 'best_position' && res1.response.includes('Guard'));

  const res2 = processQuery('Compare Guard and Protector', 'test-sess');
  check('processQuery handles comparisons', res2.intent === 'compare_players' && res2.response.includes('Guard'));

  const res3 = processQuery('Optimize squad for 3-5-2', 'test-sess');
  check('processQuery handles squad optimization', res3.intent === 'optimize_squad' && res3.response.includes('3-5-2'));

  const resUnknown = processQuery('What is the weather?', 'test-sess');
  check('processQuery handles unknown queries gracefully', resUnknown.intent === 'unknown' && resUnknown.response.includes("couldn't quite understand"));

  // Helper validation
  const built = buildResponse('test_intent', 'Test text');
  check('buildResponse outputs standardized payload', built.intent === 'test_intent' && built.response === 'Test text');

} catch (err) {
  check(`Unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
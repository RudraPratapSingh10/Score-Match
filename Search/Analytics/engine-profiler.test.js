/**
 * engine-profiler.test.js
 * ---------------------------------------------------------------------------
 * Unit & Integration tests for engine-profiler.js
 * Run with: node Search/Analytics/engine-profiler.test.js
 */

import {
  startProfile,
  endProfile,
  profileFunction,
  profilePipeline,
  calculateAverageExecutionTime,
  generatePerformanceReport
} from './engine-profiler.js';

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

console.log('Engine Profiler Test Suite\n');

try {
  // 1. Timer Start & End
  const handle = startProfile('test-op');
  check('startProfile returns valid object', handle && handle.label === 'test-op' && typeof handle.startTime === 'number');

  const duration = endProfile(handle);
  check('endProfile computes non-negative duration', duration >= 0);

  check('endProfile handles invalid handle safely', endProfile(null) === 0);

  // 2. Profile Function
  const profRes = profileFunction(() => {
    let sum = 0;
    for (let i = 0; i < 1000; i++) sum += i;
    return sum;
  });
  check('profileFunction returns result and duration', profRes.result === 499500 && typeof profRes.durationMs === 'number');

  const errProf = profileFunction(() => { throw new Error('Failed inside fn'); });
  check('profileFunction catches internal errors gracefully', errProf.result && errProf.result.error === 'Failed inside fn');

  // 3. Pipeline Profile
  const pipeRes = profilePipeline(() => 'OK');
  check('profilePipeline works identical to profileFunction', pipeRes.result === 'OK');

  // 4. Report & Averages (using clean inputs to avoid JS float precision rounding drift)
  const samples = [2.0, 4.0, 9.0, 1.0]; // Sum = 16, Avg = 4.0
  const avg = calculateAverageExecutionTime(samples);
  check('calculateAverageExecutionTime calculates correctly', avg === 4);

  const report = generatePerformanceReport(samples);
  check('generatePerformanceReport generates proper metrics',
    report.averageMs === 4 &&
    report.fastestMs === 1 &&
    report.slowestMs === 9 &&
    report.samples === 4
  );

  // 5. Edge cases
  check('handles empty samples in report', generatePerformanceReport([]).samples === 0);
  check('handles null samples in report', generatePerformanceReport(null).averageMs === 0);
  check('filters NaN values from samples', generatePerformanceReport([10, NaN, 20]).averageMs === 15);

} catch (err) {
  check(`unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
/**
 * performance.test.js
 * ---------------------------------------------------------------------------
 * PHASE D — Performance Benchmark Suite
 * ---------------------------------------------------------------------------
 * Runs 1000 iterations across core engine endpoints and measures speed and memory.
 * Run with: node Tests/performance.test.js
 */

import { recommend, optimize, simulate, predict } from '../Search/API/engine-api.js';

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

console.log('Performance & Benchmark Suite (1,000 Iterations Each)\n');

const ITERATIONS = 1000;
const sampleSquad = { formation: '4-4-2', players: ['Guard', 'Engine', 'Commander', 'Producer', 'Prowler', 'Speedster'] };

let recTime = 0;
let optTime = 0;
let simTime = 0;
let predTime = 0;

const memBefore = process.memoryUsage().heapUsed;

try {
  // 1. Recommendation Benchmark
  const startRec = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    recommend(sampleSquad);
  }
  recTime = performance.now() - startRec;
  check('recommendation benchmark', recTime > 0);

  // 2. Optimizer Benchmark
  const startOpt = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    optimize(sampleSquad);
  }
  optTime = performance.now() - startOpt;
  check('optimizer benchmark', optTime > 0);

  // 3. Simulation Benchmark
  const startSim = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    simulate({ scenarioType: 'TACTICAL_MATCH', payload: sampleSquad });
  }
  simTime = performance.now() - startSim;
  check('simulation benchmark', simTime > 0);

  // 4. Prediction Benchmark
  const startPred = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    predict({ predictionType: 'SQUAD_GROWTH', payload: sampleSquad });
  }
  predTime = performance.now() - startPred;
  check('prediction benchmark', predTime > 0);

  const memAfter = process.memoryUsage().heapUsed;
  const memDiffMB = (memAfter - memBefore) / (1024 * 1024);

  check('execution completes', true);
  check('no crashes', true);
  check('no memory explosion', memDiffMB < 100); // Less than 100MB heap growth across 4,000 calls

  console.log('\n------------------------------------------------');
  console.log(' Performance Timing Results (1,000 Calls Each)');
  console.log('------------------------------------------------');
  console.log(` Recommendations: ${recTime.toFixed(2)} ms (${(recTime / ITERATIONS).toFixed(3)} ms/op)`);
  console.log(` Optimizations:   ${optTime.toFixed(2)} ms (${(optTime / ITERATIONS).toFixed(3)} ms/op)`);
  console.log(` Simulations:     ${simTime.toFixed(2)} ms (${(simTime / ITERATIONS).toFixed(3)} ms/op)`);
  console.log(` Predictions:     ${predTime.toFixed(2)} ms (${(predTime / ITERATIONS).toFixed(3)} ms/op)`);
  console.log(` Memory Growth:   ${memDiffMB.toFixed(2)} MB`);
  console.log('------------------------------------------------\n');

} catch (err) {
  check(`performance benchmark error: ${err.message}`, false);
}

console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
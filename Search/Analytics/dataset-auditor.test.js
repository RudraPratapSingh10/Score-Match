/**
 * dataset-auditor.test.js
 * ---------------------------------------------------------------------------
 * Unit & Integration tests for dataset-auditor.js
 * Run with: node Search/Analytics/dataset-auditor.test.js
 */

import {
  auditBehaviourData,
  auditFormationData,
  auditPositionWeights,
  auditEntireDataset,
  generateAuditReport
} from './dataset-auditor.js';

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

console.log('Dataset Auditor Test Suite\n');

try {
  // 1. Audit Behaviours
  const sampleBehaviours = [
    { type: 'Guard', stats: { speed: 70 }, isEstimated: false, level: 7 },
    { type: 'Speedster', stats: null, isEstimated: true, level: 12 },
    { type: 'UNKNOWN_TYPE', stats: { speed: 80 } }
  ];

  const bRes = auditBehaviourData(sampleBehaviours);
  check('auditBehaviourData counts entries correctly', bRes.totalEntries === 3);
  check('auditBehaviourData identifies estimated entries', bRes.estimatedEntries === 1);
  check('auditBehaviourData identifies missing stats', bRes.missingStats === 1);
  check('auditBehaviourData flags level out of bounds and unknown types', bRes.warnings.length >= 2);

  // 2. Audit Formations & Position Weights
  const fRes = auditFormationData({ '4-4-2': {}, '4-3-3': null });
  check('auditFormationData flags missing formation definitions', fRes.warnings.length === 1);

  const pRes = auditPositionWeights({ 'CB': { strength: 0.8 }, 'ST': null });
  check('auditPositionWeights flags missing position weight maps', pRes.warnings.length === 1);

  // 3. Audit Entire Dataset
  const mockDataset = {
    behaviours: [
      { type: 'Guard', stats: { speed: 70 }, isEstimated: false }
    ],
    formations: { '4-4-2': {} },
    positionWeights: { 'CB': { strength: 0.8 } }
  };

  const report = generateAuditReport(mockDataset);
  check('generateAuditReport marks valid dataset as valid', report.valid === true && report.warnings.length === 0);

  const badDataset = {
    behaviours: sampleBehaviours,
    formations: { '4-4-2': null }
  };
  const badReport = auditEntireDataset(badDataset);
  check('auditEntireDataset marks invalid dataset with warnings', badReport.valid === false && badReport.warnings.length > 0);

  // 4. Edge Cases
  check('handles null dataset input safely', auditEntireDataset(null).valid === false);
  check('handles empty objects safely', auditEntireDataset({}).valid === true);

} catch (err) {
  check(`unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
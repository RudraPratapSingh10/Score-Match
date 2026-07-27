/**
 * recommendation-analytics.test.js
 * ---------------------------------------------------------------------------
 * Unit & Integration tests for recommendation-analytics.js
 * Run with: node Search/Analytics/recommendation-analytics.test.js
 */

import {
  recordRecommendation,
  getRecommendationSummary,
  getTopRecommendedBehaviours,
  getTopRecommendedPositions,
  getFormationUsage,
  getAverageSuitability,
  getAverageChemistry
} from './recommendation-analytics.js';

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

console.log('Recommendation Analytics Test Suite\n');

try {
  // 1. Record Recommendation
  const rec = recordRecommendation({ behaviour: 'Guard', position: 'CB', formation: '4-4-2', suitability: 90, chemistry: 80 });
  check('recordRecommendation returns expected structure', rec.behaviour === 'Guard' && rec.position === 'CB' && rec.suitability === 90);

  const nullRec = recordRecommendation(null);
  check('recordRecommendation handles null input safely', nullRec.behaviour === 'Unknown' && nullRec.suitability === 0);

  // 2. Summary Calculations
  const mockEvents = [
    { behaviour: 'Guard', position: 'CB', formation: '4-4-2', suitability: 90, chemistry: 85 },
    { behaviour: 'Guard', position: 'CB', formation: '4-4-2', suitability: 95, chemistry: 85 },
    { behaviour: 'Speedster', position: 'CF', formation: '4-3-3', suitability: 80, chemistry: 70 },
  ];

  check('getTopRecommendedBehaviours finds top item', getTopRecommendedBehaviours(mockEvents) === 'Guard');
  check('getTopRecommendedPositions finds top position', getTopRecommendedPositions(mockEvents) === 'CB');
  check('getFormationUsage finds top formation', getFormationUsage(mockEvents) === '4-4-2');
  check('getAverageSuitability computes correct average', getAverageSuitability(mockEvents) === 88.3);
  check('getAverageChemistry computes correct average', getAverageChemistry(mockEvents) === 80);

  const summary = getRecommendationSummary(mockEvents);
  check('getRecommendationSummary matches aggregated output',
    summary.totalRecommendations === 3 &&
    summary.topBehaviour === 'Guard' &&
    summary.averageSuitability === 88.3
  );

  // 3. Edge cases
  check('handles empty events array', getRecommendationSummary([]).totalRecommendations === 0);
  check('handles null events argument', getRecommendationSummary(null).topBehaviour === 'None');
  check('handles invalid numeric fields gracefully', getAverageSuitability([{ suitability: NaN }, { suitability: undefined }]) === 0);

} catch (err) {
  check(`unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
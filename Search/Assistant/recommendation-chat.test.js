import {
  generateRecommendationResponse,
  generateOptimizationResponse,
  generateComparisonResponse,
  generateChemistryResponse,
  generateSimulationResponse,
  generateGrowthPredictionResponse
} from './recommendation-chat.js';

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

console.log('Recommendation Chat Test Suite\n');

try {
  // Recommendation
  const recRes = generateRecommendationResponse({ behaviour: 'Guard', position: 'CB', score: 92 });
  check('generateRecommendationResponse produces accurate text', recRes.includes('Guard') && recRes.includes('92'));

  // Optimization
  const optRes = generateOptimizationResponse({ formation: '4-4-2', overallScore: 88, assignments: [{ behaviour: 'Guard', position: 'CB' }] });
  check('generateOptimizationResponse formats squad optimization', optRes.includes('4-4-2') && optRes.includes('88'));

  // Comparison
  const compRes = generateComparisonResponse({ playerA: 'Guard', playerB: 'Protector', scoreA: 90, scoreB: 85 });
  check('generateComparisonResponse highlights winner', compRes.includes('Guard holds the tactical edge'));

  // Chemistry
  const chemRes = generateChemistryResponse({ chemistryScore: 95, keySynergies: ['Guard + Commander'] });
  check('generateChemistryResponse formats chemistry', chemRes.includes('95/100') && chemRes.includes('Guard + Commander'));

  // Simulation
  const simRes = generateSimulationResponse({ winProbability: 75, summary: 'Strong defensive cover.' });
  check('generateSimulationResponse formats simulation', simRes.includes('75%') && simRes.includes('defensive cover'));

  // Growth
  const growthRes = generateGrowthPredictionResponse({ behaviour: 'Speedster', targetLevel: 10, keyStatGains: { Speed: 12 } });
  check('generateGrowthPredictionResponse formats growth', growthRes.includes('Speedster') && growthRes.includes('Speed (+12)'));

  // Safe defaults
  check('handles empty input safely', typeof generateRecommendationResponse() === 'string');

} catch (err) {
  check(`Unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
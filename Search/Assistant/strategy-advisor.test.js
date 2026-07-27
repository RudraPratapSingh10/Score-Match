import {
  analyzeSquadWeaknesses,
  recommendImprovements,
  recommendFormationChanges,
  recommendBehaviourChanges,
  recommendDevelopmentPath
} from './strategy-advisor.js';

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

console.log('Strategy Advisor Test Suite\n');

try {
  const slowSquad = {
    players: [
      { behaviour: 'Guard', position: 'CB' },
      { behaviour: 'Protector', position: 'CB' },
      { behaviour: 'Hammer', position: 'ST' }
    ]
  };

  const weaknesses = analyzeSquadWeaknesses(slowSquad);
  check('analyzeSquadWeaknesses flags pace weakness', weaknesses.some(w => w.type === 'pace'));

  const improvements = recommendImprovements(weaknesses);
  check('recommendImprovements suggests pace behaviours', improvements.some(i => i.includes('Speedster')));

  const fmtChange = recommendFormationChanges('4-4-2', weaknesses);
  check('recommendFormationChanges suggests formation adjustment', typeof fmtChange === 'string' && fmtChange.length > 0);

  const behRecs = recommendBehaviourChanges('pace');
  check('recommendBehaviourChanges returns relevant targets', behRecs.includes('Speedster'));

  const devPath = recommendDevelopmentPath([{ behaviour: 'Guard', position: 'CB', level: 5 }]);
  check('recommendDevelopmentPath suggests low-level upgrades', devPath[0].includes('Upgrade Guard'));

  // Edge cases
  check('handles empty squad safely', analyzeSquadWeaknesses({}).length > 0);

} catch (err) {
  check(`Unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
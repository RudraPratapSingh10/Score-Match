import {
  detectIntent,
  extractFormation,
  extractPosition,
  extractBehaviour,
  extractLevel,
  parseQuery
} from './query-parser.js';

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

console.log('Query Parser Test Suite\n');

try {
  // Intent Detection
  check('detectIntent identifies best_position', detectIntent('Best CB for 4-4-2?') === 'best_position');
  check('detectIntent identifies compare_players', detectIntent('Compare Guard and Protector') === 'compare_players');
  check('detectIntent identifies optimize_squad', detectIntent('Optimize squad for 3-5-2') === 'optimize_squad');
  check('detectIntent handles unknown', detectIntent('Hello world') === 'unknown');
  check('detectIntent handles empty/invalid', detectIntent('') === 'unknown' && detectIntent(null) === 'unknown');

  // Extraction
  check('extractFormation detects 4-4-2', extractFormation('Best CB for 4-4-2?') === '4-4-2');
  check('extractFormation handles missing', extractFormation('Best CB?') === null);
  
  check('extractPosition detects CB', extractPosition('Best CB for 4-4-2?') === 'CB');
  check('extractPosition handles missing', extractPosition('Compare Guard and Protector') === null);

  check('extractBehaviour detects Guard and Protector', 
    JSON.stringify(extractBehaviour('Compare Guard and Protector')) === JSON.stringify(['Guard', 'Protector'])
  );

  check('extractLevel detects lvl 10', extractLevel('Predict Guard performance at level 10') === 10);
  check('extractLevel ignores out of bounds', extractLevel('Predict at level 99') === null);

  // Full Parse
  const parsed1 = parseQuery('Best CB for 4-4-2?');
  check('parseQuery correctly parses position request', 
    parsed1.intent === 'best_position' && parsed1.position === 'CB' && parsed1.formation === '4-4-2'
  );

  const parsed2 = parseQuery('Compare Guard and Protector');
  check('parseQuery correctly parses comparison request',
    parsed2.intent === 'compare_players' && parsed2.behaviours.length === 2
  );

  const parsedEmpty = parseQuery('');
  check('parseQuery handles empty query safely', parsedEmpty.intent === 'unknown' && parsedEmpty.behaviours.length === 0);

} catch (err) {
  check(`Unexpected error: ${err.message}`, false);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
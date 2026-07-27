/**
 * strategy-advisor.js
 * ---------------------------------------------------------------------------
 * Provides tactical football advice and identifies squad structural weaknesses.
 */

/**
 * Analyzes squad profiles for critical vulnerabilities.
 * @param {Object} squad 
 * @returns {Array<Object>} List of detected weaknesses
 */
export function analyzeSquadWeaknesses(squad = {}) {
  const weaknesses = [];
  const players = Array.isArray(squad.players) ? squad.players : [];

  if (players.length === 0) {
    return [{ type: 'empty_squad', severity: 'high', description: 'Squad contains no active players.' }];
  }

  // Pace check
  const fastCount = players.filter(p => ['Speedster', 'Intruder', 'Voyager', 'Infiltrator'].includes(p.behaviour)).length;
  if (fastCount < 2) {
    weaknesses.push({ type: 'pace', severity: 'medium', description: 'Squad lacks pace and counter-attacking speed.' });
  }

  // Defensive cover check
  const defCount = players.filter(p => ['Guard', 'Protector', 'Stopper', 'Commander', 'Hammer'].includes(p.behaviour)).length;
  if (defCount < 3) {
    weaknesses.push({ type: 'defense', severity: 'high', description: 'Squad is defensively vulnerable and lacks physical stoppers.' });
  }

  // Playmaking check
  const creativeCount = players.filter(p => ['Architect', 'Producer', 'Engine'].includes(p.behaviour)).length;
  if (creativeCount < 1) {
    weaknesses.push({ type: 'creativity', severity: 'medium', description: 'Squad lacks central playmaking and passing range.' });
  }

  return weaknesses;
}

/**
 * Recommends general improvements based on weaknesses.
 * @param {Array<Object>} weaknesses 
 * @returns {Array<string>}
 */
export function recommendImprovements(weaknesses = []) {
  const recommendations = [];

  for (const w of weaknesses) {
    if (w.type === 'pace') {
      recommendations.push('Incorporate Speedster or Intruder in wide or forward areas.');
    } else if (w.type === 'defense') {
      recommendations.push('Add Guard or Protector to anchor central defense.');
    } else if (w.type === 'creativity') {
      recommendations.push('Deploy an Architect or Producer in midfield to enhance ball distribution.');
    }
  }

  return recommendations.length > 0 ? recommendations : ['Squad balance is well-optimized.'];
}

/**
 * Suggests tactical formation adjustments.
 * @param {string} currentFormation 
 * @param {Array<Object>} weaknesses 
 * @returns {string}
 */
export function recommendFormationChanges(currentFormation, weaknesses = []) {
  const hasDefWeakness = weaknesses.some(w => w.type === 'defense');
  const hasPaceWeakness = weaknesses.some(w => w.type === 'pace');

  if (hasDefWeakness) {
    return 'Consider switching to a 5-3-2 or 4-5-1 to reinforce defensive stability.';
  }
  if (hasPaceWeakness) {
    return 'Consider switching to a 4-3-3 or 3-4-3 to utilize wide wingers effectively.';
  }

  return `Current formation ${currentFormation || '4-4-2'} is structurally suitable.`;
}

/**
 * Recommends player behaviour replacements.
 * @param {string} weaknessType 
 * @returns {Array<string>}
 */
export function recommendBehaviourChanges(weaknessType) {
  switch (weaknessType) {
    case 'pace': return ['Speedster', 'Intruder', 'Voyager'];
    case 'defense': return ['Guard', 'Protector', 'Stopper', 'Hammer'];
    case 'creativity': return ['Architect', 'Producer', 'Engine'];
    case 'finishing': return ['Poacher', 'Menace', 'Marksman'];
    default: return ['Commander', 'Engine'];
  }
}

/**
 * Suggests player development prioritization.
 * @param {Array<Object>} players 
 * @returns {Array<string>}
 */
export function recommendDevelopmentPath(players = []) {
  if (!Array.isArray(players) || players.length === 0) {
    return ['Focus on upgrading core central positions first.'];
  }

  const lowLevelKey = players
    .filter(p => p.level && p.level < 8)
    .map(p => `Upgrade ${p.behaviour || 'player'} at ${p.position || 'position'} to level 9+`);

  return lowLevelKey.length > 0 ? lowLevelKey : ['Squad level distribution is currently optimal.'];
}
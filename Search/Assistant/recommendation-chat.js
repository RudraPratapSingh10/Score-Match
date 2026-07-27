/**
 * recommendation-chat.js
 * ---------------------------------------------------------------------------
 * Transforms structured engine outputs into human-readable tactical responses.
 */

/**
 * Formats a single player/position recommendation.
 * @param {Object} data 
 * @returns {string}
 */
export function generateRecommendationResponse(data = {}) {
  const { behaviour = 'The selected player', position = 'the requested position', score = 0, reasoning = '' } = data;
  let text = `${behaviour} is an excellent choice for ${position} with a suitability score of ${score}.`;
  if (reasoning) {
    text += ` ${reasoning}`;
  } else {
    text += ` Strong defensive and tactical attributes make it ideal for this role.`;
  }
  return text;
}

/**
 * Formats squad optimization results.
 * @param {Object} data 
 * @returns {string}
 */
export function generateOptimizationResponse(data = {}) {
  const { formation = 'your formation', overallScore = 0, assignments = [] } = data;
  let text = `Squad optimization for ${formation} complete with an overall score of ${overallScore}.`;
  if (assignments.length > 0) {
    const keyPicks = assignments.slice(0, 3).map(a => `${a.behaviour || a.player} at ${a.position}`).join(', ');
    text += ` Key positions include: ${keyPicks}.`;
  }
  return text;
}

/**
 * Formats player comparison results.
 * @param {Object} data 
 * @returns {string}
 */
export function generateComparisonResponse(data = {}) {
  const { playerA = 'Player A', playerB = 'Player B', scoreA = 0, scoreB = 0, advantage = '' } = data;
  let text = `Comparison between ${playerA} (${scoreA}) and ${playerB} (${scoreB}):`;
  if (scoreA > scoreB) {
    text += ` ${playerA} holds the tactical edge overall.`;
  } else if (scoreB > scoreA) {
    text += ` ${playerB} holds the tactical edge overall.`;
  } else {
    text += ` Both options offer equal strategic value.`;
  }
  if (advantage) text += ` ${advantage}`;
  return text;
}

/**
 * Formats team chemistry analysis.
 * @param {Object} data 
 * @returns {string}
 */
export function generateChemistryResponse(data = {}) {
  const { chemistryScore = 0, keySynergies = [], bottlenecks = [] } = data;
  let text = `Team chemistry rating is currently at ${chemistryScore}/100.`;
  if (keySynergies.length > 0) {
    text += ` Strong synergies detected: ${keySynergies.join(', ')}.`;
  }
  if (bottlenecks.length > 0) {
    text += ` Areas for improvement: ${bottlenecks.join(', ')}.`;
  }
  return text;
}

/**
 * Formats scenario simulation outcomes.
 * @param {Object} data 
 * @returns {string}
 */
export function generateSimulationResponse(data = {}) {
  const { winProbability = 50, summary = 'Match simulation finalized.' } = data;
  return `Simulation outcome: ${winProbability}% projected success rate. ${summary}`;
}

/**
 * Formats growth prediction results.
 * @param {Object} data 
 * @returns {string}
 */
export function generateGrowthPredictionResponse(data = {}) {
  const { behaviour = 'Player', targetLevel = 10, keyStatGains = {} } = data;
  const gainsText = Object.entries(keyStatGains)
    .map(([stat, val]) => `${stat} (+${val})`)
    .join(', ');
  
  return `At Level ${targetLevel}, ${behaviour} experiences major stat growth${gainsText ? `: ${gainsText}` : '.'}`;
}
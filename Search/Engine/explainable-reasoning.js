/**
 * explainable-reasoning.js
 * ---------------------------------------------------------------------------
 * MODULE 7 — Explainable Reasoning Engine
 * ---------------------------------------------------------------------------
 * Transforms raw numerical outputs and metadata from Modules 1–6 into human-readable,
 * fully transparent explanations, reasoning chains, evidence breakdowns, and confidence scores.
 *
 * Principles:
 * - Pure ES Module functions.
 * - Deterministic output.
 * - Graceful fallback handling for null/undefined inputs.
 * - Consumes outputs from Modules 2, 3, 4, 5, and 6.
 */

import { scorePosition } from './position-suitability.js';
import { getFormation } from './formation-intelligence.js';

/**
 * Human-friendly attribute label mapping.
 */
const STAT_LABELS = {
  sp: 'Speed',
  st: 'Strength',
  rs: 'Response',
  ag: 'Agility',
  pa: 'Passing',
  sh: 'Shooting',
  he: 'Heading',
  tac: 'Tackling',
  gk_sav: 'GK Saving',
  gk_pos: 'GK Positioning',
  gk_ref: 'GK Reflexes',
};

/**
 * Normalizes attribute score objects into sorted list of key-value tuples.
 * @param {Object} attributes - Raw attributes object
 * @returns {Array<[string, number]>} Sorted attribute pairs (descending)
 */
function getSortedAttributes(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, val]) => typeof val === 'number')
    .sort(([, a], [, b]) => b - a);
}

/**
 * Converts stat keys to readable names.
 * @param {string} key 
 * @returns {string}
 */
function formatStatName(key) {
  return STAT_LABELS[key] || key.toUpperCase();
}

/**
 * Generates an explanation for an individual player recommendation (Module 4 output).
 *
 * @param {Object} input - { recommendation: Object }
 * @returns {Object} { summary, strengths, weaknesses, evidence, scoreBreakdown }
 */
export function generatePlayerExplanation(input = {}) {
  const rec = input?.recommendation || input;
  
  if (!rec || typeof rec !== 'object') {
    return {
      summary: 'Invalid or missing recommendation data.',
      strengths: [],
      weaknesses: [],
      evidence: [],
      scoreBreakdown: {},
    };
  }

  const type = rec.type || rec.player?.type || 'Player';
  const level = rec.level || rec.player?.level || 1;
  const targetPos = rec.position || rec.recommendedPosition || 'Slot';
  const totalScore = rec.score || rec.suitabilityScore || 0;

  const attributes = rec.attributes || rec.player?.attributes || {};
  const sortedStats = getSortedAttributes(attributes);

  const strengths = sortedStats.slice(0, 3).map(([k, v]) => `${formatStatName(k)} (${v})`);
  const weaknesses = sortedStats.slice(-2).map(([k, v]) => `${formatStatName(k)} (${v})`);

  const evidence = [
    `Player archetype '${type}' at level ${level} evaluated for ${targetPos}.`,
    `Achieved a calculated suitability score of ${totalScore}.`,
  ];

  if (strengths.length > 0) {
    evidence.push(`Key dominant attributes: ${strengths.join(', ')}.`);
  }

  const summary = `Use ${type} at ${targetPos} because it achieves a suitability score of ${totalScore}, driven by strong ${strengths[0] || 'overall attributes'}.`;

  return {
    summary,
    strengths,
    weaknesses,
    evidence,
    scoreBreakdown: {
      totalScore,
      attributes,
    },
  };
}

/**
 * Generates a detailed position suitability explanation (Module 2 context).
 *
 * @param {Object} input - { type, level, position }
 * @returns {Object} Position evaluation reasoning
 */
export function generatePositionExplanation(input = {}) {
  const { type, level, position } = input || {};

  if (!type || !position) {
    return {
      suitabilityScore: 0,
      topContributingAttributes: [],
      weakestAttributes: [],
      explanation: 'Cannot generate position explanation without valid player type and target position.',
    };
  }

  try {
    const suitability = scorePosition(type, level || 1, position);
    const score = suitability.score;
    const sortedStats = getSortedAttributes(suitability.attributes);

    const topContributingAttributes = sortedStats.slice(0, 3).map(([stat, val]) => ({
      stat: formatStatName(stat),
      value: val,
    }));

    const weakestAttributes = sortedStats.slice(-2).map(([stat, val]) => ({
      stat: formatStatName(stat),
      value: val,
    }));

    const topNames = topContributingAttributes.map((a) => `${a.stat} (${a.value})`).join(', ');
    const explanation = `${type} (Level ${level || 1}) reaches a ${score} suitability score at ${position} primarily due to high ratings in ${topNames || 'core stats'}.`;

    return {
      suitabilityScore: score,
      topContributingAttributes,
      weakestAttributes,
      explanation,
    };
  } catch (error) {
    return {
      suitabilityScore: 0,
      topContributingAttributes: [],
      weakestAttributes: [],
      explanation: `Error calculating suitability: ${error.message}`,
    };
  }
}

/**
 * Generates a structural formation explanation (Module 3 context).
 *
 * @param {Object} input - { formationId }
 * @returns {Object} Formation breakdown and explanation
 */
export function generateFormationExplanation(input = {}) {
  const formationId = typeof input === 'string' ? input : input?.formationId;

  if (!formationId) {
    return {
      formation: 'Unknown',
      defenders: 0,
      midfielders: 0,
      forwards: 0,
      explanation: 'Invalid or missing formation identifier.',
    };
  }

  let formationData = null;
  try {
    formationData = getFormation(formationId);
  } catch (err) {
    // Graceful fallback if formation lookup fails
  }

  if (!formationData) {
    return {
      formation: formationId,
      defenders: 0,
      midfielders: 0,
      forwards: 0,
      explanation: `Formation '${formationId}' is not recognized in the system database.`,
    };
  }

  const slots = formationData.slots || [];
  let defenders = 0;
  let midfielders = 0;
  let forwards = 0;

  slots.forEach((slot) => {
    if (slot === 'GK') return;
    if (slot.includes('CB') || slot.includes('LB') || slot.includes('RB') || slot.includes('WB') || slot.includes('DEF')) {
      defenders++;
    } else if (slot.includes('CM') || slot.includes('DM') || slot.includes('AM') || slot.includes('LM') || slot.includes('RM') || slot.includes('MID')) {
      midfielders++;
    } else if (slot.includes('CF') || slot.includes('ST') || slot.includes('LW') || slot.includes('RW') || slot.includes('FWD')) {
      forwards++;
    } else {
      midfielders++; // Fallback category
    }
  });

  const styleDesc = formationData.description || 'a balanced tactical structure';
  const explanation = `Formation ${formationId} uses ${defenders} defenders, ${midfielders} midfielders, and ${forwards} forwards, emphasizing ${styleDesc}.`;

  return {
    formation: formationId,
    defenders,
    midfielders,
    forwards,
    explanation,
  };
}

/**
 * Generates an explanation for team chemistry results (Module 6 output).
 *
 * @param {Object} input - { chemistryResult } or result object from scoreLineupChemistry
 * @returns {Object} Chemistry analysis summary
 */
export function generateChemistryExplanation(input = {}) {
  const result = input?.chemistryResult || input;

  if (!result || typeof result !== 'object') {
    return {
      chemistryScore: 0,
      positiveFactors: [],
      negativeFactors: [],
      explanation: 'No valid chemistry result provided to explain.',
    };
  }

  const chemistryScore = typeof result.chemistryScore === 'number' ? result.chemistryScore : 0;
  const positiveFactors = result.strengths || [];
  const negativeFactors = result.weaknesses || [];

  let summaryNote = 'balanced team dynamics';
  if (chemistryScore >= 80) summaryNote = 'exceptional positional and archetype synergy';
  else if (chemistryScore < 50) summaryNote = 'significant tactical friction and missing positional coverage';

  const explanation = `Team chemistry score is ${chemistryScore}/100, demonstrating ${summaryNote} across ${positiveFactors.length} positive factor(s) and ${negativeFactors.length} penalty/conflict factor(s).`;

  return {
    chemistryScore,
    positiveFactors,
    negativeFactors,
    explanation,
  };
}

/**
 * Generates an explanation for squad optimization results (Module 5 output).
 *
 * @param {Object} input - { optimizedSquad } or Module 5 result
 * @returns {Object} Squad analysis
 */
export function generateSquadExplanation(input = {}) {
  const squadRes = input?.optimizedSquad || input;

  if (!squadRes || typeof squadRes !== 'object') {
    return {
      totalScore: 0,
      bestPlayers: [],
      weakestPositions: [],
      explanation: 'Invalid or empty squad data provided.',
    };
  }

  const totalScore = squadRes.totalScore || 0;
  const assignments = squadRes.lineup || squadRes.assignments || [];

  if (!Array.isArray(assignments) || assignments.length === 0) {
    return {
      totalScore,
      bestPlayers: [],
      weakestPositions: [],
      explanation: 'Squad contains no active player assignments.',
    };
  }

  const sortedAssignments = [...assignments].sort((a, b) => (b.score || 0) - (a.score || 0));

  const bestPlayers = sortedAssignments.slice(0, 3).map((a) => ({
    type: a.type || a.player?.type || 'Player',
    slot: a.position || a.slot,
    score: a.score || 0,
  }));

  const weakestPositions = sortedAssignments.slice(-2).map((a) => ({
    type: a.type || a.player?.type || 'Player',
    slot: a.position || a.slot,
    score: a.score || 0,
  }));

  const topPerformer = bestPlayers[0];
  const explanation = `Optimized squad achieves a total suitability rating of ${totalScore} across ${assignments.length} positions, led by ${topPerformer?.type || 'key players'} at ${topPerformer?.slot || 'top slot'} (${topPerformer?.score || 0} score).`;

  return {
    totalScore,
    bestPlayers,
    weakestPositions,
    explanation,
  };
}

/**
 * MASTER FUNCTION
 * Synthesizes outputs from Modules 2–6 into a unified explainability model with confidence scoring.
 *
 * @param {Object} input - { optimizedSquad, chemistry, recommendations }
 * @returns {Object} { summary, reasons, evidence, confidence }
 */
export function generateOptimizerExplanation(input = {}) {
  const { optimizedSquad, chemistry, recommendations } = input || {};

  const squadExp = generateSquadExplanation(optimizedSquad);
  const chemExp = generateChemistryExplanation(chemistry);

  const reasons = [];
  const evidence = [];

  // 1. Squad evidence & reasons
  if (squadExp.totalScore > 0) {
    reasons.push(`Squad optimization achieves an aggregate performance score of ${squadExp.totalScore}.`);
    evidence.push(`Top anchor: ${squadExp.bestPlayers[0]?.type || 'N/A'} at ${squadExp.bestPlayers[0]?.slot || 'N/A'} (${squadExp.bestPlayers[0]?.score || 0} pts).`);
  } else {
    reasons.push('Squad configuration has low or baseline suitability.');
  }

  // 2. Chemistry evidence & reasons
  if (chemExp.chemistryScore > 0) {
    reasons.push(`Team synergy achieves a chemistry score of ${chemExp.chemistryScore}/100.`);
    if (chemExp.positiveFactors.length > 0) {
      evidence.push(`Synergy boost: ${chemExp.positiveFactors[0]}`);
    }
    if (chemExp.negativeFactors.length > 0) {
      evidence.push(`Tactical warning: ${chemExp.negativeFactors[0]}`);
    }
  }

  // 3. Recommendation items
  if (Array.isArray(recommendations) && recommendations.length > 0) {
    const topRec = recommendations[0];
    const recExp = generatePlayerExplanation(topRec);
    reasons.push(`Key individual recommendation: ${recExp.summary}`);
    evidence.push(...recExp.evidence);
  }

  // Calculate overall confidence score (0 to 100)
  let confidence = 50;
  if (squadExp.totalScore > 0) confidence += 20;
  if (chemExp.chemistryScore >= 70) confidence += 20;
  else if (chemExp.chemistryScore < 40) confidence -= 15;
  if (Array.isArray(recommendations) && recommendations.length > 0) confidence += 10;

  confidence = Math.max(0, Math.min(100, Math.round(confidence)));

  const summary = `This squad configuration is recommended with ${confidence}% confidence because it maximizes tactical suitability (${squadExp.totalScore} pts) while maintaining a chemistry rating of ${chemExp.chemistryScore}/100.`;

  return {
    summary,
    reasons,
    evidence,
    confidence,
  };
}
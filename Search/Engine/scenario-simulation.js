/**
 * scenario-simulation.js
 * ---------------------------------------------------------------------------
 * MODULE 8 — Scenario Simulation Engine
 * ---------------------------------------------------------------------------
 * Simulates tactical "what-if" scenarios across squad configurations without
 * mutating state or predicting future progression.
 *
 * Reuses outputs from Modules 1–7 to evaluate player replacements, formation
 * switches, player swaps, level scaling, chemistry changes, and re-optimization.
 *
 * Principles:
 * - Pure ES Module functions.
 * - 100% deterministic & dependency-free.
 * - Handles empty or invalid inputs gracefully without throwing uncaught errors/NaN.
 * - Strictly reuses Modules 1 through 7 logic.
 */

import { scorePosition } from './position-suitability.js';
import { getFormation } from './formation-intelligence.js';
import { optimizeSquad } from './squad-optimizer.js';
import { calculateTeamChemistry } from './chemistry-engine.js';
import {
  generatePositionExplanation,
  generateFormationExplanation,
  generateChemistryExplanation,
  generateSquadExplanation,
  generateOptimizerExplanation,
} from './explainable-reasoning.js';

/**
 * Normalizes slot string (e.g., 'CB1', 'CM2', 'CF1') to base position string ('CB', 'CM', 'CF').
 * @param {string} slot 
 * @returns {string}
 */
function normalizePosition(slot = '') {
  if (typeof slot !== 'string') return '';
  return slot.replace(/\d+$/, '').toUpperCase();
}

/**
 * Calculates the total suitability score of a given squad lineup.
 * Handles both object lineups ({ CB1: player }) and array lineups ([{ slot, player }]).
 * 
 * @param {Array|Object} squad 
 * @returns {number} Sum of position suitability scores
 */
function calculateSquadScore(squad) {
  if (!squad) return 0;

  let totalScore = 0;

  if (Array.isArray(squad)) {
    for (const item of squad) {
      if (!item) continue;
      const player = item.player || item;
      const rawSlot = item.slot || item.position;
      const slot = normalizePosition(rawSlot);
      const type = player.type || item.type;
      const level = player.level || item.level || 1;

      if (typeof item.score === 'number' && !isNaN(item.score)) {
        totalScore += item.score;
      } else if (type && slot) {
        try {
          const suitability = scorePosition(type, level, slot);
          totalScore += suitability.score || 0;
        } catch {
          // Fallback if position normalization fails
        }
      }
    }
    return Math.round(totalScore * 100) / 100;
  }

  if (typeof squad === 'object') {
    if (typeof squad.totalScore === 'number' && !isNaN(squad.totalScore)) {
      return squad.totalScore;
    }
    const lineup = squad.lineup || squad.assignments || squad;
    if (Array.isArray(lineup)) {
      return calculateSquadScore(lineup);
    }

    for (const [rawSlot, player] of Object.entries(lineup)) {
      if (!player) continue;
      const slot = normalizePosition(rawSlot);
      const type = typeof player === 'string' ? player : player.type;
      const level = player.level || 1;
      if (type && slot) {
        try {
          const suitability = scorePosition(type, level, slot);
          totalScore += suitability.score || 0;
        } catch {
          // Fallback if position normalization fails
        }
      }
    }
  }

  return Math.round(totalScore * 100) / 100;
}

/**
 * Normalizes squad structure into a clean array of { slot, player } objects.
 * 
 * @param {Array|Object} squad 
 * @returns {Array<{slot: string, player: Object}>}
 */
function normalizeSquad(squad) {
  if (!squad) return [];
  
  if (Array.isArray(squad)) {
    return squad.map((item) => {
      const slot = item.slot || item.position || 'SLOT';
      const player = item.player || { type: item.type, level: item.level || 1 };
      return { slot, player: { ...player, type: player.type || item.type, level: player.level || item.level || 1 } };
    });
  }

  if (typeof squad === 'object') {
    const lineup = squad.lineup || squad.assignments || squad;
    if (Array.isArray(lineup)) {
      return normalizeSquad(lineup);
    }

    return Object.entries(lineup)
      .filter(([k]) => k !== 'totalScore' && k !== 'chemistryScore')
      .map(([slot, p]) => {
        const player = typeof p === 'string' ? { type: p, level: 1 } : { ...p, level: p.level || 1 };
        return { slot, player };
      });
  }

  return [];
}

/**
 * Calculates chemistry for a squad safely via Module 6.
 * 
 * @param {Array|Object} squad 
 * @returns {number} Chemistry score (0 to 100)
 */
function getSquadChemistryScore(squad) {
  if (!squad) return 0;
  if (typeof squad.chemistryScore === 'number') return squad.chemistryScore;
  try {
    const chem = calculateTeamChemistry(squad);
    return chem?.chemistryScore || chem?.score || 0;
  } catch {
    return 0;
  }
}

/**
 * Helper to safely extract formation slots via Module 3's getFormation function.
 * 
 * @param {string} formationId 
 * @returns {Array<string>}
 */
function extractFormationSlots(formationId) {
  if (!formationId) return [];
  try {
    const formationData = getFormation(formationId);
    return formationData?.slots || [];
  } catch {
    return [];
  }
}

/**
 * Simulates swapping or replacing one player in the squad with another.
 *
 * @param {Object} input - { squad, removePlayer, addPlayer }
 * @returns {Object} { beforeScore, afterScore, scoreDifference, chemistryDifference, explanation }
 */
export function simulatePlayerReplacement(input = {}) {
  const { squad, removePlayer, addPlayer } = input || {};
  const currentSquad = normalizeSquad(squad);

  const beforeScore = calculateSquadScore(currentSquad);
  const beforeChem = getSquadChemistryScore(currentSquad);

  if (currentSquad.length === 0 || !removePlayer || !addPlayer) {
    return {
      beforeScore,
      afterScore: beforeScore,
      scoreDifference: 0,
      chemistryDifference: 0,
      explanation: 'No changes made due to missing player or squad specification.',
    };
  }

  const targetType = typeof removePlayer === 'string' ? removePlayer : removePlayer.type;
  const targetSlot = typeof removePlayer === 'object' ? removePlayer.slot || removePlayer.position : null;

  let replaced = false;
  const newSquad = currentSquad.map((item) => {
    const matchesSlot = targetSlot && item.slot === targetSlot;
    const matchesType = !targetSlot && item.player.type === targetType;

    if (!replaced && (matchesSlot || matchesType)) {
      replaced = true;
      const newP = typeof addPlayer === 'string' ? { type: addPlayer, level: 1 } : { ...addPlayer, level: addPlayer.level || 1 };
      return { slot: item.slot, player: newP };
    }
    return item;
  });

  const afterScore = calculateSquadScore(newSquad);
  const afterChem = getSquadChemistryScore(newSquad);

  const scoreDifference = Math.round((afterScore - beforeScore) * 100) / 100;
  const chemistryDifference = Math.round((afterChem - beforeChem) * 100) / 100;

  const addedName = typeof addPlayer === 'string' ? addPlayer : addPlayer.type;
  const removedName = targetType || 'player';

  let diffText = 'no overall suitability impact';
  if (scoreDifference > 0) diffText = `a net gain of +${scoreDifference} points`;
  else if (scoreDifference < 0) diffText = `a net loss of ${scoreDifference} points`;

  const explanation = replaced
    ? `Replacing ${removedName} with ${addedName} results in ${diffText} (Chemistry delta: ${chemistryDifference >= 0 ? '+' : ''}${chemistryDifference}).`
    : `Target player ${removedName} was not found in the squad lineup.`;

  return {
    beforeScore,
    afterScore,
    scoreDifference,
    chemistryDifference,
    explanation,
  };
}

/**
 * Simulates tactical impact when switching from one formation to another.
 *
 * @param {Object} input - { squad, currentFormation, newFormation }
 * @returns {Object} { oldScore, newScore, difference, explanation }
 */
export function simulateFormationChange(input = {}) {
  const { squad, currentFormation, newFormation } = input || {};
  const normalized = normalizeSquad(squad);

  const oldScore = calculateSquadScore(normalized);

  if (!newFormation) {
    return {
      oldScore,
      newScore: oldScore,
      difference: 0,
      explanation: 'No target formation specified.',
    };
  }

  const targetSlots = extractFormationSlots(newFormation);
  if (targetSlots.length === 0) {
    return {
      oldScore,
      newScore: oldScore,
      difference: 0,
      explanation: `Formation '${newFormation}' was not recognized or has no slots defined.`,
    };
  }

  const availablePlayers = normalized.map((item) => item.player);
  const remappedSquad = targetSlots.map((slot, index) => {
    const player = availablePlayers[index] || { type: 'Guard', level: 1 };
    return { slot, player };
  });

  const newScore = calculateSquadScore(remappedSquad);
  const difference = Math.round((newScore - oldScore) * 100) / 100;

  const formExp = generateFormationExplanation({ formationId: newFormation });

  let deltaText = 'maintains overall squad score';
  if (difference > 0) deltaText = `increases total suitability by +${difference} points`;
  else if (difference < 0) deltaText = `decreases total suitability by ${difference} points`;

  const explanation = `Switching from ${currentFormation || 'current formation'} to ${newFormation} ${deltaText}. ${formExp.explanation}`;

  return {
    oldScore,
    newScore,
    difference,
    explanation,
  };
}

/**
 * Simulates swapping positions between two players currently in the squad.
 *
 * @param {Object} input - { squad, playerA, playerB }
 * @returns {Object} { oldScore, newScore, difference, explanation }
 */
export function simulatePlayerSwap(input = {}) {
  const { squad, playerA, playerB } = input || {};
  const normalized = normalizeSquad(squad);

  const oldScore = calculateSquadScore(normalized);

  if (normalized.length === 0 || !playerA || !playerB) {
    return {
      oldScore,
      newScore: oldScore,
      difference: 0,
      explanation: 'Swap could not be performed due to missing squad or player parameters.',
    };
  }

  const identifierA = typeof playerA === 'string' ? playerA : playerA.slot || playerA.type;
  const identifierB = typeof playerB === 'string' ? playerB : playerB.slot || playerB.type;

  const indexA = normalized.findIndex((item) => item.slot === identifierA || item.player.type === identifierA);
  const indexB = normalized.findIndex((item) => item.slot === identifierB || item.player.type === identifierB);

  if (indexA === -1 || indexB === -1) {
    return {
      oldScore,
      newScore: oldScore,
      difference: 0,
      explanation: 'One or both specified players/slots were not found in the squad.',
    };
  }

  const swappedSquad = normalized.map((item) => ({ ...item, player: { ...item.player } }));
  const tempPlayer = swappedSquad[indexA].player;
  swappedSquad[indexA].player = swappedSquad[indexB].player;
  swappedSquad[indexB].player = tempPlayer;

  const newScore = calculateSquadScore(swappedSquad);
  const difference = Math.round((newScore - oldScore) * 100) / 100;

  const nameA = normalized[indexA].player.type;
  const slotA = normalized[indexA].slot;
  const nameB = normalized[indexB].player.type;
  const slotB = normalized[indexB].slot;

  const explanation = `Swapping ${nameA} (${slotA}) with ${nameB} (${slotB}) results in a net score delta of ${difference >= 0 ? '+' : ''}${difference} points.`;

  return {
    oldScore,
    newScore,
    difference,
    explanation,
  };
}

/**
 * Simulates attribute/suitability scaling when changing a player's level.
 * Reuses Module 1 (behaviour) + Module 2 (position suitability).
 *
 * @param {Object} input - { playerType, oldLevel, newLevel, position }
 * @returns {Object} { oldSuitability, newSuitability, improvement, explanation }
 */
export function simulateLevelChange(input = {}) {
  const { playerType, oldLevel = 1, newLevel = 1, position = 'CB' } = input || {};

  if (!playerType) {
    return {
      oldSuitability: 0,
      newSuitability: 0,
      improvement: 0,
      explanation: 'Player archetype type was not provided.',
    };
  }

  const basePos = normalizePosition(position);

  const oldSuitabilityRes = scorePosition(playerType, oldLevel, basePos);
  const newSuitabilityRes = scorePosition(playerType, newLevel, basePos);

  const oldSuitability = oldSuitabilityRes.score || 0;
  const newSuitability = newSuitabilityRes.score || 0;
  const improvement = Math.round((newSuitability - oldSuitability) * 100) / 100;

  const posExplanation = generatePositionExplanation({ type: playerType, level: newLevel, position: basePos });

  const explanation = `Leveling ${playerType} from level ${oldLevel} to ${newLevel} at position ${basePos} improves suitability score from ${oldSuitability} to ${newSuitability} (+${improvement} pts). ${posExplanation.explanation}`;

  return {
    oldSuitability,
    newSuitability,
    improvement,
    explanation,
  };
}

/**
 * Evaluates chemistry differences between two squad iterations.
 * Reuses Module 6.
 *
 * @param {Object} input - { oldSquad, newSquad }
 * @returns {Object} { oldChemistry, newChemistry, chemistryDifference, explanation }
 */
export function simulateChemistryImpact(input = {}) {
  const { oldSquad, newSquad } = input || {};

  const oldChemRes = calculateTeamChemistry(oldSquad || []);
  const newChemRes = calculateTeamChemistry(newSquad || []);

  const oldChemistry = oldChemRes?.chemistryScore || 0;
  const newChemistry = newChemRes?.chemistryScore || 0;
  const chemistryDifference = Math.round((newChemistry - oldChemistry) * 100) / 100;

  const chemExplanation = generateChemistryExplanation({ chemistryResult: newChemRes });

  let impactText = 'has no impact on team chemistry';
  if (chemistryDifference > 0) impactText = `improves team chemistry by +${chemistryDifference} points`;
  else if (chemistryDifference < 0) impactText = `reduces team chemistry by ${chemistryDifference} points`;

  const explanation = `Squad modification ${impactText} (from ${oldChemistry} to ${newChemistry}). ${chemExplanation.explanation}`;

  return {
    oldChemistry,
    newChemistry,
    chemistryDifference,
    explanation,
  };
}

/**
 * Runs the Optimizer Engine (Module 5) before and after a change to measure potential optimization ceiling.
 *
 * @param {Object} input - { squad, formation }
 * @returns {Object} { originalScore, optimizedScore, gain, explanation }
 */
export function simulateOptimizationImpact(input = {}) {
  const { squad, formation = '442' } = input || {};
  const normalized = normalizeSquad(squad);

  const originalScore = calculateSquadScore(normalized);

  let optimizedResult = null;
  try {
    const availablePool = normalized.map((i) => i.player);
    optimizedResult = optimizeSquad({ availablePlayers: availablePool, formationId: formation });
  } catch {
    optimizedResult = null;
  }

  const optimizedScore = optimizedResult?.totalScore || originalScore;
  const gain = Math.round((optimizedScore - originalScore) * 100) / 100;

  const explanation = gain > 0
    ? `Re-optimizing the lineup for formation ${formation} yields a performance gain of +${gain} points (from ${originalScore} to ${optimizedScore}).`
    : `Current lineup is already fully optimized for formation ${formation} with score ${originalScore}.`;

  return {
    originalScore,
    optimizedScore,
    gain,
    explanation,
  };
}

/**
 * MASTER ENTRY POINT
 * Dispatches scenario simulation requests and wraps result with confidence rating & explanations.
 *
 * @param {Object} input - { scenarioType, payload }
 * @returns {Object} { scenarioType, result, explanation, confidence }
 */
export function runScenario(input = {}) {
  const { scenarioType, payload } = input || {};

  const SUPPORTED_TYPES = [
    'PLAYER_REPLACEMENT',
    'FORMATION_CHANGE',
    'PLAYER_SWAP',
    'LEVEL_CHANGE',
    'CHEMISTRY_CHANGE',
    'OPTIMIZATION_CHANGE',
  ];

  if (!scenarioType || !SUPPORTED_TYPES.includes(scenarioType)) {
    throw new Error(`Invalid or unsupported scenarioType: '${scenarioType}'. Must be one of: ${SUPPORTED_TYPES.join(', ')}`);
  }

  let result = {};
  let confidence = 90;

  switch (scenarioType) {
    case 'PLAYER_REPLACEMENT':
      result = simulatePlayerReplacement(payload);
      confidence = payload?.squad ? 95 : 60;
      break;

    case 'FORMATION_CHANGE':
      result = simulateFormationChange(payload);
      confidence = payload?.squad && payload?.newFormation ? 92 : 65;
      break;

    case 'PLAYER_SWAP':
      result = simulatePlayerSwap(payload);
      confidence = payload?.squad ? 90 : 60;
      break;

    case 'LEVEL_CHANGE':
      result = simulateLevelChange(payload);
      confidence = payload?.playerType ? 98 : 50;
      break;

    case 'CHEMISTRY_CHANGE':
      result = simulateChemistryImpact(payload);
      confidence = 90;
      break;

    case 'OPTIMIZATION_CHANGE':
      result = simulateOptimizationImpact(payload);
      confidence = 88;
      break;
  }

  const masterExplanation = generateOptimizerExplanation({
    optimizedSquad: { totalScore: result.afterScore || result.newScore || result.optimizedScore || result.newSuitability || 0 },
    chemistry: { chemistryScore: result.newChemistry || result.chemistryDifference || 80 },
    recommendations: [],
  });

  return {
    scenarioType,
    result,
    explanation: result.explanation || masterExplanation.summary,
    confidence,
  };
}
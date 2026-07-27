/**
 * player-recommendation.js
 * ---------------------------------------------------------------------------
 * MODULE 4 — Player Recommendation Engine
 *
 * Purpose:
 *   Answers "Given a player, what positions should they play?" by leveraging
 *   Modules 1–3 without duplicating any stat resolution or scoring logic.
 *
 * DESIGN & ARCHITECTURE NOTES:
 * - Pure ES Module: Zero DOM, zero localStorage, zero network, zero global state.
 * - Fully deterministic: Identical inputs yield identical outputs.
 * - Single Source of Truth for Scoring: All position scoring flows strictly
 *   through Module 2 (`position-suitability.js`).
 * - Formation-aware & Role-aware: Filters candidate positions against Module 3 slot data.
 * ---------------------------------------------------------------------------
 */

import {
  resolveAttributes,
  isGoalkeeperType,
  ATTR_KEYS,
} from './behaviour-intelligence.js';

import {
  scorePosition,
  scoreAllPositions,
} from './position-suitability.js';

import {
  FORMATIONS,
} from '../Data/formations-data.js';

import {
  getFormation,
  UnknownFormationError,
} from './formation-intelligence.js';

/** Attribute display label mapping for natural language summaries. */
const ATTR_LABELS = Object.freeze({
  sp: 'Speed',
  ht: 'Height',
  st: 'Strength',
  pw: 'Power',
  sk: 'Skill',
  rs: 'Response',
});

/** Mapping of positions to broad football roles. */
const POSITION_TO_ROLE = Object.freeze({
  GK: 'goalkeeper',
  GK_STOPPER: 'goalkeeper',
  GK_SWEEPER: 'goalkeeper',

  CB: 'defender',
  LB: 'defender',
  RB: 'defender',
  LWB: 'defender',
  RWB: 'defender',

  CDM: 'midfielder',
  CM: 'midfielder',
  CAM: 'midfielder',
  LM: 'midfielder',
  RM: 'midfielder',

  LW: 'forward',
  RW: 'forward',
  CF: 'forward',
  SS: 'forward',
  ST: 'forward',
});

/** Custom error class for recommendation errors. */
export class UnknownRecommendationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownRecommendationError';
  }
}

/**
 * Round a number to a specified number of decimal places.
 * @param {number} val
 * @param {number} [decimals=1]
 * @returns {number}
 */
function roundTo(val, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Recommend positions for a player across all available positions in the system.
 *
 * @param {string} type - Player behaviour type (e.g. "Guard", "GK-Stopper")
 * @param {number} level - Player level (1-10)
 * @param {Object} [overrides] - User stat overrides
 * @returns {Object} Comprehensive player recommendation breakdown
 */
export function recommendPlayer(type, level, overrides = {}) {
  const resolved = resolveAttributes(type, level, overrides);
  const allScored = scoreAllPositions(type, level, overrides);

  // Exclude ineligible positions (score === 0 due to GK isolation rules)
  const validScored = allScored.filter((item) => item.score > 0);
  const candidates = validScored.length > 0 ? validScored : allScored;

  const bestPosition = candidates[0].position;
  const bestScore = candidates[0].score;

  const attributes = {};
  const provenance = {};
  ATTR_KEYS.forEach((key) => {
    attributes[key] = resolved[key];
    provenance[key] = resolved.provenance[key];
  });

  return {
    type: resolved.type,
    level: resolved.level,
    bestPosition,
    bestScore,
    topRecommendations: candidates.slice(0, 3),
    attributes,
    provenance,
  };
}

/**
 * Recommend top N suited positions sorted descending by score.
 *
 * @param {string} type
 * @param {number} level
 * @param {number} [n=3]
 * @param {Object} [overrides]
 * @returns {Array<{position: string, score: number}>}
 */
export function recommendTopN(type, level, n = 3, overrides = {}) {
  const allScored = scoreAllPositions(type, level, overrides);
  const validScored = allScored.filter((item) => item.score > 0);
  const candidates = validScored.length > 0 ? validScored : allScored;
  return candidates.slice(0, n);
}

/**
 * Recommend position suitability constrained strictly to positions present in a given formation.
 *
 * @param {string} type
 * @param {number} level
 * @param {string} formationId - e.g. "442", "433"
 * @param {Object} [overrides]
 * @returns {Array<{position: string, score: number}>} Unique formation positions sorted descending by score
 * @throws {UnknownFormationError} if formationId is invalid
 */
export function recommendForFormation(type, level, formationId, overrides = {}) {
  const formation = getFormation(formationId); // Throws UnknownFormationError if invalid
  const uniquePositions = Array.from(new Set(formation.slots));

  const results = uniquePositions.map((position) => {
    const scored = scorePosition(type, level, position, overrides);
    return {
      position,
      score: scored.score,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Determine the player's best broad role category based on highest average suitability.
 *
 * @param {string} type
 * @param {number} level
 * @param {Object} [overrides]
 * @returns {{role: string, score: number}}
 */
export function recommendRole(type, level, overrides = {}) {
  const allScored = scoreAllPositions(type, level, overrides);
  const roleSums = {};
  const roleCounts = {};

  allScored.forEach(({ position, score }) => {
    const role = POSITION_TO_ROLE[position] || 'midfielder';
    roleSums[role] = (roleSums[role] || 0) + score;
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });

  let bestRole = 'midfielder';
  let bestAvgScore = -1;

  Object.keys(roleSums).forEach((role) => {
    const avgScore = roleSums[role] / roleCounts[role];
    if (avgScore > bestAvgScore) {
      bestAvgScore = avgScore;
      bestRole = role;
    }
  });

  return {
    role: bestRole,
    score: roundTo(bestAvgScore, 1),
  };
}

/**
 * Compare suitability score differences between two specific positions for a player.
 *
 * @param {string} type
 * @param {number} level
 * @param {string} positionA
 * @param {string} positionB
 * @param {Object} [overrides]
 * @returns {{positionA: string, scoreA: number, positionB: string, scoreB: number, difference: number, betterPosition: string}}
 */
export function comparePositions(type, level, positionA, positionB, overrides = {}) {
  const resA = scorePosition(type, level, positionA, overrides);
  const resB = scorePosition(type, level, positionB, overrides);

  const scoreA = resA.score;
  const scoreB = resB.score;

  const diff = roundTo(Math.abs(scoreA - scoreB), 2);
  const betterPosition = scoreA >= scoreB ? positionA : positionB;

  return {
    positionA,
    scoreA,
    positionB,
    scoreB,
    difference: diff,
    betterPosition,
  };
}

/**
 * Generate a high-level summary of top position, best role, strengths, and weaknesses.
 *
 * @param {string} type
 * @param {number} level
 * @param {Object} [overrides]
 * @returns {{bestPosition: string, bestRole: string, strengths: string[], weaknesses: string[]}}
 */
export function getRecommendationSummary(type, level, overrides = {}) {
  const rec = recommendPlayer(type, level, overrides);
  const roleInfo = recommendRole(type, level, overrides);
  const resolved = resolveAttributes(type, level, overrides);

  // Rank attributes by raw value
  const attrArray = ATTR_KEYS.map((key) => ({
    key,
    label: ATTR_LABELS[key] || key,
    val: resolved[key],
  })).sort((a, b) => b.val - a.val);

  const strengths = [attrArray[0].label, attrArray[1].label];
  const weaknesses = [attrArray[attrArray.length - 1].label];

  return {
    bestPosition: rec.bestPosition,
    bestRole: roleInfo.role,
    strengths,
    weaknesses,
  };
}
/**
 * position-suitability.js
 * ---------------------------------------------------------------------------
 * MODULE 2 — Position Suitability Scoring Layer
 * ---------------------------------------------------------------------------
 */

import {
  resolveAttributes,
  computeAttributeCeilings,
  ATTR_KEYS,
  isGoalkeeperType,
} from './behaviour-intelligence.js';

import {
  POSITION_WEIGHTS,
  POSITION_KEYS,
  POSITION_DATA_VERSION,
} from '../Data/position-weights.js';

export class UnknownPositionError extends Error {
  constructor(position) {
    super(`Unknown position: "${position}".`);
    this.name = 'UnknownPositionError';
    this.position = position;
  }
}

export function assertValidPosition(position) {
  if (!position || !POSITION_WEIGHTS[position]) {
    throw new UnknownPositionError(position);
  }
}

export function isGoalkeeperPosition(position) {
  return position.startsWith('GK');
}

function roundTo(val, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export function scorePosition(type, level, position, overrides = {}) {
  assertValidPosition(position);

  const resolved = resolveAttributes(type, level, overrides);
  const ceilings = computeAttributeCeilings(overrides);

  const playerIsGK = isGoalkeeperType(type);
  const posIsGK = isGoalkeeperPosition(position);

  const isValidEligibility = (playerIsGK && posIsGK) || (!playerIsGK && !posIsGK);

  const rawAttributes = {};
  const provenance = {};
  const normalized = {};
  const weightedContributions = {};

  let totalWeightedScore = 0;
  const posWeights = POSITION_WEIGHTS[position];

  ATTR_KEYS.forEach((attr) => {
    const rawVal = resolved[attr];
    rawAttributes[attr] = rawVal;
    provenance[attr] = resolved.provenance[attr];

    if (!isValidEligibility) {
      normalized[attr] = 0;
      weightedContributions[attr] = 0;
      return;
    }

    const ceiling = ceilings[attr] || 1;
    const normVal = Math.min(100, Math.max(0, (rawVal / ceiling) * 100));
    normalized[attr] = roundTo(normVal, 1);

    const weight = posWeights[attr] || 0;
    const contrib = (normVal * weight) / 100;
    weightedContributions[attr] = roundTo(contrib, 1);

    totalWeightedScore += contrib;
  });

  const finalScore = isValidEligibility ? roundTo(totalWeightedScore, 2) : 0;

  return {
    type: resolved.type,
    level: resolved.level,
    position,
    score: finalScore,
    normalized,
    weightedContributions,
    attributes: rawAttributes,
    provenance,
  };
}

export function scoreAllPositions(type, level, overrides = {}) {
  const positionList = POSITION_KEYS || Object.keys(POSITION_WEIGHTS);

  const results = positionList.map((pos) => {
    const result = scorePosition(type, level, pos, overrides);
    return {
      position: result.position,
      score: result.score,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

export function getBestPosition(type, level, overrides = {}) {
  const sorted = scoreAllPositions(type, level, overrides);
  return sorted[0];
}
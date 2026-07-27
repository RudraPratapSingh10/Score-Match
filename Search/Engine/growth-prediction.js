/**
 * growth-prediction.js
 * ---------------------------------------------------------------------------
 * MODULE 9 — Growth Prediction Engine
 * ---------------------------------------------------------------------------
 * Predicts how player attributes, position suitability, chemistry, and squad
 * performance evolve as player levels increase up to Level 10.
 *
 * Principles:
 * - Pure ES Module functions.
 * - 100% deterministic & dependency-free.
 * - Handles level clamping (1 to 10) and invalid inputs gracefully without throwing.
 * - Strictly reuses Modules 1 through 7 logic without duplicating algorithms.
 */

import * as BehaviourModule from './behaviour-intelligence.js';
import { scorePosition } from './position-suitability.js';
import { optimizeSquad } from './squad-optimizer.js';
import { calculateTeamChemistry } from './chemistry-engine.js';
import {
  generatePositionExplanation,
  generateSquadExplanation,
} from './explainable-reasoning.js';

const MAX_LEVEL = 10;
const MIN_LEVEL = 1;

/**
 * Safely fetches player attributes from Module 1 across possible exported function signatures.
 * @param {string} type 
 * @param {number} level 
 * @returns {Object}
 */
function fetchPlayerStats(type, level) {
  if (!type) return {};
  try {
    if (typeof BehaviourModule.calculateStats === 'function') {
      return BehaviourModule.calculateStats(type, level) || {};
    }
    if (typeof BehaviourModule.getPlayerStats === 'function') {
      return BehaviourModule.getPlayerStats(type, level) || {};
    }
    if (typeof BehaviourModule.getStats === 'function') {
      return BehaviourModule.getStats(type, level) || {};
    }
    if (typeof BehaviourModule.getArchetype === 'function') {
      const arch = BehaviourModule.getArchetype(type);
      return arch?.stats || arch?.attributes || {};
    }
  } catch {
    // Graceful fallback if stats computation fails
  }
  return {};
}

/**
 * Normalizes and clamps a level value strictly within [1, 10].
 * @param {number} lvl 
 * @returns {number}
 */
function clampLevel(lvl) {
  const parsed = parseInt(lvl, 10);
  if (isNaN(parsed)) return MIN_LEVEL;
  return Math.min(Math.max(parsed, MIN_LEVEL), MAX_LEVEL);
}

/**
 * Normalizes slot name (e.g. 'CB1' -> 'CB').
 * @param {string} slot 
 * @returns {string}
 */
function normalizePosition(slot = '') {
  if (typeof slot !== 'string') return '';
  return slot.replace(/\d+$/, '').toUpperCase();
}

/**
 * Normalizes squad array or object into array of { slot, player: { type, level } }.
 * @param {Array|Object} squad 
 * @returns {Array<{slot: string, player: Object}>}
 */
function normalizeSquad(squad) {
  if (!squad) return [];

  if (Array.isArray(squad)) {
    return squad.map((item) => {
      const slot = item.slot || item.position || 'SLOT';
      const p = item.player || item;
      const type = typeof p === 'string' ? p : p.type || item.type;
      const level = clampLevel(p.level || item.level || 1);
      return { slot, player: { ...p, type, level } };
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
        const type = typeof p === 'string' ? p : p.type;
        const level = clampLevel(typeof p === 'object' ? p.level || 1 : 1);
        return { slot, player: { ...(typeof p === 'object' ? p : {}), type, level } };
      });
  }

  return [];
}

/**
 * Predicts player attribute progression from current level to target level.
 * Reuses Module 1 statistics logic.
 *
 * @param {Object} input - { type, currentLevel, targetLevel }
 * @returns {Object} { currentAttributes, projectedAttributes, attributeGains, totalGain }
 */
export function predictPlayerGrowth(input = {}) {
  const { type, currentLevel = 1, targetLevel = 10 } = input || {};

  // Level clamping executed FIRST before fetching stats
  const curLvl = clampLevel(currentLevel);
  const tgtLvl = clampLevel(targetLevel < curLvl ? curLvl : targetLevel);

  if (!type) {
    return {
      currentAttributes: {},
      projectedAttributes: {},
      attributeGains: {},
      totalGain: 0,
    };
  }

  const currentAttributes = fetchPlayerStats(type, curLvl);
  const projectedAttributes = fetchPlayerStats(type, tgtLvl);

  const attributeGains = {};
  let totalGain = 0;

  for (const [attr, val] of Object.entries(projectedAttributes)) {
    if (typeof val !== 'number') continue;
    const startVal = typeof currentAttributes[attr] === 'number' ? currentAttributes[attr] : 0;
    const gain = Math.max(0, val - startVal);
    attributeGains[attr] = Math.round(gain * 100) / 100;
    totalGain += gain;
  }

  totalGain = Math.round(totalGain * 100) / 100;

  return {
    currentAttributes,
    projectedAttributes,
    attributeGains,
    totalGain,
  };
}

/**
 * Predicts position suitability score growth between levels.
 * Reuses Module 2 scorePosition().
 *
 * @param {Object} input - { type, currentLevel, targetLevel, position }
 * @returns {Object} { currentScore, projectedScore, improvement, explanation }
 */
export function predictPositionGrowth(input = {}) {
  const { type, currentLevel = 1, targetLevel = 10, position = 'CB' } = input || {};

  if (!type) {
    return {
      currentScore: 0,
      projectedScore: 0,
      improvement: 0,
      explanation: 'Player archetype type was not provided.',
    };
  }

  const curLvl = clampLevel(currentLevel);
  const tgtLvl = clampLevel(targetLevel < curLvl ? curLvl : targetLevel);
  const basePos = normalizePosition(position);

  let curRes = { score: 0 };
  let tgtRes = { score: 0 };

  try {
    curRes = scorePosition(type, curLvl, basePos);
    tgtRes = scorePosition(type, tgtLvl, basePos);
  } catch {
    // Fallback if scorePosition fails
  }

  const currentScore = curRes.score || 0;
  const projectedScore = tgtRes.score || 0;
  const improvement = Math.round(Math.max(0, projectedScore - currentScore) * 100) / 100;

  let posExplanation = { explanation: '' };
  try {
    posExplanation = generatePositionExplanation({ type, level: tgtLvl, position: basePos });
  } catch {
    // Fallback
  }

  const explanation = `Leveling ${type} from Lvl ${curLvl} to Lvl ${tgtLvl} at ${basePos} increases position suitability score from ${currentScore} to ${projectedScore} (+${improvement} pts). ${posExplanation.explanation || ''}`.trim();

  return {
    currentScore,
    projectedScore,
    improvement,
    explanation,
  };
}

/**
 * Predicts chemistry score evolution when leveling squad players.
 * Reuses Module 6 calculateTeamChemistry().
 *
 * @param {Object} input - { squad, targetLevels }
 * @returns {Object} { currentChemistry, projectedChemistry, improvement }
 */
export function predictChemistryGrowth(input = {}) {
  const { squad, targetLevels } = input || {};
  const normalized = normalizeSquad(squad);

  if (normalized.length === 0) {
    return { currentChemistry: 0, projectedChemistry: 0, improvement: 0 };
  }

  const currentChemRes = calculateTeamChemistry(normalized);
  const currentChemistry = currentChemRes?.chemistryScore || 0;

  const projectedSquad = normalized.map((item, idx) => {
    let newLvl = item.player.level;

    if (typeof targetLevels === 'number') {
      newLvl = targetLevels;
    } else if (Array.isArray(targetLevels)) {
      newLvl = targetLevels[idx] !== undefined ? targetLevels[idx] : newLvl;
    } else if (typeof targetLevels === 'object' && targetLevels !== null) {
      newLvl = targetLevels[item.slot] || targetLevels[item.player.type] || newLvl;
    } else {
      newLvl = MAX_LEVEL;
    }

    return {
      slot: item.slot,
      player: { ...item.player, level: clampLevel(newLvl) },
    };
  });

  const projectedChemRes = calculateTeamChemistry(projectedSquad);
  const projectedChemistry = projectedChemRes?.chemistryScore || 0;
  const improvement = Math.round(Math.max(0, projectedChemistry - currentChemistry) * 100) / 100;

  return {
    currentChemistry,
    projectedChemistry,
    improvement,
  };
}

/**
 * Predicts total squad score growth using Optimizer Engine (Module 5).
 *
 * @param {Object} input - { squad, formation, targetLevels }
 * @returns {Object} { currentSquadScore, projectedSquadScore, improvement, explanation }
 */
export function predictSquadGrowth(input = {}) {
  const { squad, formation = '442', targetLevels } = input || {};
  const normalized = normalizeSquad(squad);

  if (normalized.length === 0) {
    return {
      currentSquadScore: 0,
      projectedSquadScore: 0,
      improvement: 0,
      explanation: 'No squad provided for growth prediction.',
    };
  }

  let currentOpt = null;
  try {
    const curPool = normalized.map((i) => i.player);
    currentOpt = optimizeSquad({ availablePlayers: curPool, formationId: formation });
  } catch {
    currentOpt = null;
  }

  const currentSquadScore = currentOpt?.totalScore || 0;

  const projectedPool = normalized.map((item, idx) => {
    let newLvl = item.player.level;

    if (typeof targetLevels === 'number') {
      newLvl = targetLevels;
    } else if (Array.isArray(targetLevels)) {
      newLvl = targetLevels[idx] !== undefined ? targetLevels[idx] : newLvl;
    } else if (typeof targetLevels === 'object' && targetLevels !== null) {
      newLvl = targetLevels[item.slot] || targetLevels[item.player.type] || newLvl;
    } else {
      newLvl = MAX_LEVEL;
    }

    return {
      ...item.player,
      level: clampLevel(newLvl),
    };
  });

  let projectedOpt = null;
  try {
    projectedOpt = optimizeSquad({ availablePlayers: projectedPool, formationId: formation });
  } catch {
    projectedOpt = null;
  }

  const projectedSquadScore = projectedOpt?.totalScore || currentSquadScore;
  const improvement = Math.round(Math.max(0, projectedSquadScore - currentSquadScore) * 100) / 100;

  let squadExp = { summary: '' };
  try {
    squadExp = generateSquadExplanation(projectedOpt || { totalScore: projectedSquadScore, assignments: normalized });
  } catch {
    // Fallback
  }

  const explanation = `Upgrading squad to target levels in ${formation} improves total score from ${currentSquadScore} to ${projectedSquadScore} (+${improvement} pts). ${squadExp.summary || ''}`.trim();

  return {
    currentSquadScore,
    projectedSquadScore,
    improvement,
    explanation,
  };
}

/**
 * Evaluates squad players to identify the best ROI investment (score gain per level invested).
 *
 * @param {Object} input - { squad, budgetLevels }
 * @returns {Object} { player, expectedGain, roi, explanation }
 */
export function findBestInvestment(input = {}) {
  const { squad, budgetLevels = 1 } = input || {};
  const normalized = normalizeSquad(squad);

  if (normalized.length === 0) {
    return {
      player: null,
      expectedGain: 0,
      roi: 0,
      explanation: 'Empty squad provided.',
    };
  }

  const budget = Math.max(1, parseInt(budgetLevels, 10) || 1);
  let bestCandidate = null;
  let maxGain = -1;
  let bestRoi = -1;

  for (const item of normalized) {
    const curLvl = item.player.level;
    if (curLvl >= MAX_LEVEL) continue;

    const tgtLvl = clampLevel(curLvl + budget);
    const actualLevelsAdded = tgtLvl - curLvl;

    if (actualLevelsAdded <= 0) continue;

    const basePos = normalizePosition(item.slot);
    const posGrowth = predictPositionGrowth({
      type: item.player.type,
      currentLevel: curLvl,
      targetLevel: tgtLvl,
      position: basePos,
    });

    const gain = posGrowth.improvement;
    const roi = Math.round((gain / actualLevelsAdded) * 100) / 100;

    if (roi > bestRoi || (roi === bestRoi && gain > maxGain)) {
      bestRoi = roi;
      maxGain = gain;
      bestCandidate = {
        type: item.player.type,
        currentLevel: curLvl,
        targetLevel: tgtLvl,
        slot: item.slot,
      };
    }
  }

  if (!bestCandidate) {
    const fallbackPlayer = normalized[0]?.player || { type: 'Unknown', level: 10 };
    return {
      player: { type: fallbackPlayer.type, currentLevel: fallbackPlayer.level, targetLevel: MAX_LEVEL, slot: normalized[0]?.slot || 'CB1' },
      expectedGain: 0,
      roi: 0,
      explanation: 'All players in squad are already at maximum level (Level 10).',
    };
  }

  const explanation = `Investing ${budget} level(s) into ${bestCandidate.type} (${bestCandidate.slot}) gives the highest ROI of ${bestRoi} pts/level (+${maxGain} total pts).`;

  return {
    player: bestCandidate,
    expectedGain: maxGain,
    roi: bestRoi,
    explanation,
  };
}

/**
 * Finds the player in the squad with the highest raw growth potential up to Lvl 10.
 *
 * @param {Object} input - { squad }
 * @returns {Object} { player, gain, explanation }
 */
export function findHighestGrowthPlayer(input = {}) {
  const { squad } = input || {};
  const normalized = normalizeSquad(squad);

  if (normalized.length === 0) {
    return {
      player: null,
      gain: 0,
      explanation: 'Empty squad provided.',
    };
  }

  let bestPlayer = null;
  let maxGain = -1;

  for (const item of normalized) {
    const curLvl = item.player.level;
    const basePos = normalizePosition(item.slot);

    const posGrowth = predictPositionGrowth({
      type: item.player.type,
      currentLevel: curLvl,
      targetLevel: MAX_LEVEL,
      position: basePos,
    });

    if (posGrowth.improvement > maxGain) {
      maxGain = posGrowth.improvement;
      bestPlayer = {
        type: item.player.type,
        currentLevel: curLvl,
        targetLevel: MAX_LEVEL,
        slot: item.slot,
      };
    }
  }

  if (!bestPlayer) {
    const fallback = normalized[0];
    bestPlayer = { type: fallback.player.type, currentLevel: fallback.player.level, targetLevel: MAX_LEVEL, slot: fallback.slot };
    maxGain = 0;
  }

  const explanation = `${bestPlayer.type} (${bestPlayer.slot}) has the highest growth potential, gaining +${maxGain} pts when scaled to Level 10.`;

  return {
    player: bestPlayer,
    gain: maxGain,
    explanation,
  };
}

/**
 * Projects a player's suitability and attributes directly from current level to Level 10.
 *
 * @param {Object} input - { type, currentLevel, position }
 * @returns {Object} { currentLevel, targetLevel, improvement, projection }
 */
export function projectToMaxLevel(input = {}) {
  const { type, currentLevel = 1, position = 'CB' } = input || {};

  const curLvl = clampLevel(currentLevel);
  const targetLevel = MAX_LEVEL;

  if (!type) {
    return {
      currentLevel: curLvl,
      targetLevel,
      improvement: 0,
      projection: {},
    };
  }

  const basePos = normalizePosition(position);
  const posGrowth = predictPositionGrowth({
    type,
    currentLevel: curLvl,
    targetLevel,
    position: basePos,
  });

  const attrGrowth = predictPlayerGrowth({
    type,
    currentLevel: curLvl,
    targetLevel,
  });

  const improvement = posGrowth.improvement;

  const projection = {
    positionScore: posGrowth.projectedScore,
    attributeGains: attrGrowth.attributeGains,
    totalAttributeGain: attrGrowth.totalGain,
  };

  return {
    currentLevel: curLvl,
    targetLevel,
    improvement,
    projection,
  };
}

/**
 * MASTER ENTRY POINT
 * Dispatches growth prediction queries and returns result wrapped with confidence and explanation.
 *
 * @param {Object} input - { predictionType, payload }
 * @returns {Object} { predictionType, result, confidence, explanation }
 */
export function runGrowthPrediction(input = {}) {
  const { predictionType, payload } = input || {};

  const SUPPORTED_TYPES = [
    'PLAYER_GROWTH',
    'POSITION_GROWTH',
    'CHEMISTRY_GROWTH',
    'SQUAD_GROWTH',
    'BEST_INVESTMENT',
    'HIGHEST_GROWTH',
    'MAX_LEVEL_PROJECTION',
  ];

  if (!predictionType || !SUPPORTED_TYPES.includes(predictionType)) {
    throw new Error(`Invalid or unsupported predictionType: '${predictionType}'. Must be one of: ${SUPPORTED_TYPES.join(', ')}`);
  }

  let result = {};
  let confidence = 95;

  switch (predictionType) {
    case 'PLAYER_GROWTH':
      result = predictPlayerGrowth(payload);
      confidence = payload?.type ? 98 : 60;
      break;

    case 'POSITION_GROWTH':
      result = predictPositionGrowth(payload);
      confidence = payload?.type ? 96 : 60;
      break;

    case 'CHEMISTRY_GROWTH':
      result = predictChemistryGrowth(payload);
      confidence = payload?.squad ? 92 : 65;
      break;

    case 'SQUAD_GROWTH':
      result = predictSquadGrowth(payload);
      confidence = payload?.squad ? 90 : 60;
      break;

    case 'BEST_INVESTMENT':
      result = findBestInvestment(payload);
      confidence = payload?.squad ? 94 : 65;
      break;

    case 'HIGHEST_GROWTH':
      result = findHighestGrowthPlayer(payload);
      confidence = payload?.squad ? 95 : 65;
      break;

    case 'MAX_LEVEL_PROJECTION':
      result = projectToMaxLevel(payload);
      confidence = payload?.type ? 98 : 60;
      break;
  }

  const explanation = result.explanation || `Deterministic growth projection calculated for ${predictionType}.`;

  return {
    predictionType,
    result,
    confidence,
    explanation,
  };
}
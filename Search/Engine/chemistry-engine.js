/**
 * chemistry-engine.js
 * ---------------------------------------------------------------------------
 * MODULE 6 — Chemistry / Synergy Engine
 * ---------------------------------------------------------------------------
 * Evaluates tactical synergy and chemistry across individual player pairs
 * and full starting lineups.
 * 
 * Key Principles:
 * - Deterministic, pure ES module functions.
 * - Explains all synergy scores for Module 7 consumption.
 * - Normalized final output clamped between 0 and 100.
 */

import { isGoalkeeperType } from './behaviour-intelligence.js';

// ---------------------------------------------------------------------------
// SYNERGY RULE TABLES
// ---------------------------------------------------------------------------

/** Pair synergy rules mapping combined archetype keys to score, category, and reason. */
const PAIR_SYNERGY_MAP = {
  // Positive Pairs
  'Guard+Protector': { score: 9, category: 'positive', reason: 'Strong defensive partnership' },
  'GK-Stopper+Guard': { score: 8, category: 'positive', reason: 'Solid shot-stopping and structural cover' },
  'Commander+Protector': { score: 8, category: 'positive', reason: 'Dominant aerial and physical backline' },
  'Architect+Producer': { score: 9, category: 'positive', reason: 'Fluid creative midfield playmaker duo' },
  'Architect+Explorer': { score: 8, category: 'positive', reason: 'Precision passing meets dynamic overlap' },
  'Menace+Producer': { score: 8, category: 'positive', reason: 'Target striker fed by high-volume crossing' },
  'Hammer+Prowler': { score: 9, category: 'positive', reason: 'Target man setup for sharp opportunistic finishes' },
  'Explorer+Speedster': { score: 8, category: 'positive', reason: 'Devastating pace on the wings and counter' },
  'Commander+Menace': { score: 8, category: 'positive', reason: 'High-pressing physical spine' },
  'Explorer+GK-Sweeper': { score: 7, category: 'positive', reason: 'High defensive line supported by sweeper keeper' },
  'GK-Sweeper+Speedster': { score: 7, category: 'positive', reason: 'Direct counter-attacking distribution' },

  // Negative Pairs
  'Hammer+Hammer': { score: -4, category: 'negative', reason: 'Redundant static target men reduce movement' },
  'Architect+Architect': { score: -4, category: 'negative', reason: 'Over-ball-dominant midfield slows tempo' },
  'Commander+Commander': { score: -3, category: 'negative', reason: 'Rigid midfield positioning lacks dynamism' },
  'GK-Stopper+GK-Sweeper': { score: -10, category: 'negative', reason: 'Conflicting goalkeeper profiles' },
};

/** Categorizes archetypes into positional zones for chemistry breakdown. */
const POSITION_ZONES = {
  DEFENSE: new Set(['Guard', 'Protector', 'Voyager', 'Hero', 'Stopper']),
  MIDFIELD: new Set(['Architect', 'Producer', 'Commander', 'Engine', 'Wizard', 'Infiltrator']),
  ATTACK: new Set(['Hammer', 'Prowler', 'Explorer', 'Speedster', 'Menace', 'Intruder', 'Raider', 'Poacher']),
};

/** Clamps a number between a lower and upper bound. */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Formats archetype pair key symmetrically (alphabetical order). */
function getPairKey(typeA, typeB) {
  return [typeA, typeB].sort().join('+');
}

/** Determines position category zone for a player type. */
function getPlayerZone(type) {
  if (isGoalkeeperType(type)) return 'GOALKEEPER';
  if (POSITION_ZONES.DEFENSE.has(type)) return 'DEFENSE';
  if (POSITION_ZONES.MIDFIELD.has(type)) return 'MIDFIELD';
  if (POSITION_ZONES.ATTACK.has(type)) return 'ATTACK';
  return 'MIDFIELD'; // Default fallback
}

// ---------------------------------------------------------------------------
// PUBLIC EXPORTS
// ---------------------------------------------------------------------------

/**
 * Evaluates pair chemistry between two individual players.
 *
 * @param {Object} playerA - First player object { type, level }
 * @param {Object} playerB - Second player object { type, level }
 * @returns {Object} { score: number, category: string, reason: string }
 */
export function scorePairChemistry(playerA, playerB) {
  if (!playerA || !playerB || !playerA.type || !playerB.type) {
    return { score: 0, category: 'neutral', reason: 'Invalid or missing player types' };
  }

  const pairKey = getPairKey(playerA.type, playerB.type);
  const synergy = PAIR_SYNERGY_MAP[pairKey];

  if (synergy) {
    return {
      score: synergy.score,
      category: synergy.category,
      reason: synergy.reason,
    };
  }

  return {
    score: 0,
    category: 'neutral',
    reason: 'Standard tactical interaction',
  };
}

/**
 * Evaluates chemistry across all unique player pairings in a lineup.
 *
 * @param {Array<Object>} lineup - Starting lineup array
 * @returns {Array<Object>} List of evaluated pair scores with metadata
 */
export function evaluateAllPairs(lineup) {
  if (!Array.isArray(lineup) || lineup.length < 2) return [];

  const pairs = [];
  for (let i = 0; i < lineup.length; i++) {
    for (let j = i + 1; j < lineup.length; j++) {
      const pA = lineup[i];
      const pB = lineup[j];
      const result = scorePairChemistry(pA, pB);

      pairs.push({
        playerA: pA.type,
        playerB: pB.type,
        playerAId: pA.playerId || pA.id,
        playerBId: pB.playerId || pB.id,
        score: result.score,
        category: result.category,
        reason: result.reason,
      });
    }
  }

  return pairs;
}

/**
 * Gets all positive chemistry pairs from a lineup.
 *
 * @param {Array<Object>} lineup - Starting lineup
 * @returns {Array<Object>} List of positive pairs
 */
export function getPositiveChemistryPairs(lineup) {
  return evaluateAllPairs(lineup).filter((pair) => pair.category === 'positive');
}

/**
 * Gets all negative chemistry pairs from a lineup.
 *
 * @param {Array<Object>} lineup - Starting lineup
 * @returns {Array<Object>} List of negative pairs
 */
export function getNegativeChemistryPairs(lineup) {
  return evaluateAllPairs(lineup).filter((pair) => pair.category === 'negative');
}

/**
 * Calculates total structural bonuses and penalties for a full lineup.
 *
 * @param {Array<Object>} lineup - Starting lineup
 * @returns {Object} { bonuses: Array, penalties: Array, totalBonusScore: number, totalPenaltyScore: number }
 */
export function evaluateLineupStructure(lineup) {
  const bonuses = [];
  const penalties = [];

  if (!Array.isArray(lineup) || lineup.length === 0) {
    return { bonuses, penalties: [{ source: 'Empty Lineup', score: -100, reason: 'Lineup is empty' }], totalBonusScore: 0, totalPenaltyScore: -100 };
  }

  const types = lineup.map((p) => p.type);
  const typeCounts = {};
  let gkCount = 0;
  let defCount = 0;
  let midCount = 0;
  let fwdCount = 0;

  lineup.forEach((p) => {
    typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
    const zone = getPlayerZone(p.type);
    if (zone === 'GOALKEEPER') gkCount++;
    if (zone === 'DEFENSE') defCount++;
    if (zone === 'MIDFIELD') midCount++;
    if (zone === 'ATTACK') fwdCount++;
  });

  // --- TEAM BONUSES ---
  // 1. Balanced Back Line (At least Guard + Protector)
  if (types.includes('Guard') && types.includes('Protector')) {
    bonuses.push({ source: 'Balanced Back Line', score: 5, reason: 'Lineup features both Guard and Protector' });
  }

  // 2. Creative Midfield (Architect + Producer)
  if (types.includes('Architect') && types.includes('Producer')) {
    bonuses.push({ source: 'Creative Midfield', score: 5, reason: 'Lineup features both Architect and Producer' });
  }

  // 3. Fast Attack (Explorer + Speedster)
  if (types.includes('Explorer') && types.includes('Speedster')) {
    bonuses.push({ source: 'Fast Attack', score: 5, reason: 'Lineup features both Explorer and Speedster' });
  }

  // 4. Strong Spine (GK, CB/Defender, CM/Midfielder, ST/Forward all level >= 7)
  const highLevelSpine = ['GOALKEEPER', 'DEFENSE', 'MIDFIELD', 'ATTACK'].every((zone) => {
    return lineup.some((p) => getPlayerZone(p.type) === zone && (p.level || 0) >= 7);
  });
  if (highLevelSpine) {
    bonuses.push({ source: 'Strong Spine', score: 5, reason: 'GK, Defender, Midfielder, and Forward all level 7+' });
  }

  // --- TEAM PENALTIES ---
  // 1. No Goalkeeper
  if (gkCount === 0) {
    penalties.push({ source: 'No Goalkeeper', score: -100, reason: 'Lineup missing a Goalkeeper' });
  }

  // 2. No Defender
  if (defCount === 0) {
    penalties.push({ source: 'No Defender', score: -15, reason: 'Lineup missing dedicated Defenders' });
  }

  // 3. No Midfielder
  if (midCount === 0) {
    penalties.push({ source: 'No Midfielder', score: -15, reason: 'Lineup missing Midfield controllers' });
  }

  // 4. No Forward
  if (fwdCount === 0) {
    penalties.push({ source: 'No Forward', score: -15, reason: 'Lineup missing Attackers' });
  }

  // 5. Duplicate Archetypes (> 3 identical)
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > 3) {
      penalties.push({
        source: `Excessive Archetype (${type})`,
        score: -5,
        reason: `More than 3 players with ${type} archetype (${count})`,
      });
    }
  });

  const totalBonusScore = bonuses.reduce((acc, b) => acc + b.score, 0);
  const totalPenaltyScore = penalties.reduce((acc, p) => acc + p.score, 0);

  return {
    bonuses,
    penalties,
    totalBonusScore,
    totalPenaltyScore,
  };
}

/**
 * Generates an explainable positional breakdown of total chemistry.
 *
 * @param {Array<Object>} lineup - Starting lineup
 * @returns {Object} Category scores and penalty metrics
 */
export function getChemistryBreakdown(lineup) {
  const pairEvaluations = evaluateAllPairs(lineup);
  const structure = evaluateLineupStructure(lineup);

  let defensiveChemistry = 0;
  let midfieldChemistry = 0;
  let attackingChemistry = 0;
  let goalkeeperChemistry = 0;

  pairEvaluations.forEach((pair) => {
    const zoneA = getPlayerZone(pair.playerA);
    const zoneB = getPlayerZone(pair.playerB);

    if (zoneA === 'GOALKEEPER' || zoneB === 'GOALKEEPER') {
      goalkeeperChemistry += pair.score;
    } else if (zoneA === 'DEFENSE' && zoneB === 'DEFENSE') {
      defensiveChemistry += pair.score;
    } else if (zoneA === 'MIDFIELD' && zoneB === 'MIDFIELD') {
      midfieldChemistry += pair.score;
    } else if (zoneA === 'ATTACK' && zoneB === 'ATTACK') {
      attackingChemistry += pair.score;
    } else {
      // Cross-zone pairs contribute to primary zone
      if (zoneA === 'MIDFIELD' || zoneB === 'MIDFIELD') midfieldChemistry += pair.score;
      else if (zoneA === 'ATTACK' || zoneB === 'ATTACK') attackingChemistry += pair.score;
      else defensiveChemistry += pair.score;
    }
  });

  // Apply structural bonuses directly into relevant breakdowns
  structure.bonuses.forEach((b) => {
    if (b.source === 'Balanced Back Line') defensiveChemistry += b.score;
    if (b.source === 'Creative Midfield') midfieldChemistry += b.score;
    if (b.source === 'Fast Attack') attackingChemistry += b.score;
    if (b.source === 'Strong Spine') {
      goalkeeperChemistry += 2;
      defensiveChemistry += 1;
      midfieldChemistry += 1;
      attackingChemistry += 1;
    }
  });

  return {
    defensiveChemistry,
    midfieldChemistry,
    attackingChemistry,
    goalkeeperChemistry,
    penalties: structure.totalPenaltyScore,
  };
}

/**
 * Calculates normalized overall team chemistry score (0 to 100).
 *
 * @param {Array<Object>} lineup - Starting lineup
 * @returns {number} Normalized score from 0 to 100
 */
export function calculateTeamChemistry(lineup) {
  if (!Array.isArray(lineup) || lineup.length === 0) return 0;

  const pairEvaluations = evaluateAllPairs(lineup);
  const structure = evaluateLineupStructure(lineup);

  const rawPairSum = pairEvaluations.reduce((acc, p) => acc + p.score, 0);
  const rawTotal = 50 + rawPairSum + structure.totalBonusScore + structure.totalPenaltyScore;

  return clamp(rawTotal, 0, 100);
}

/**
 * Full lineup chemistry evaluation.
 *
 * @param {Array<Object>} lineup - Optimized starting lineup from Module 5
 * @returns {Object} Complete chemistry breakdown and metrics
 */
export function scoreLineupChemistry(lineup) {
  const pairScores = evaluateAllPairs(lineup);
  const positivePairs = pairScores.filter((p) => p.category === 'positive');
  const negativePairs = pairScores.filter((p) => p.category === 'negative');
  const structure = evaluateLineupStructure(lineup);
  const chemistryScore = calculateTeamChemistry(lineup);

  const strengths = [
    ...positivePairs.map((p) => `${p.playerA} + ${p.playerB}: ${p.reason}`),
    ...structure.bonuses.map((b) => `${b.source}: ${b.reason}`),
  ];

  const weaknesses = [
    ...negativePairs.map((p) => `${p.playerA} + ${p.playerB}: ${p.reason}`),
    ...structure.penalties.map((p) => `${p.source}: ${p.reason}`),
  ];

  return {
    chemistryScore,
    pairScores,
    positivePairs,
    negativePairs,
    strengths,
    weaknesses,
  };
}

/**
 * Compares chemistry scores between two candidate lineups.
 *
 * @param {Array<Object>} lineupA - First candidate lineup
 * @param {Array<Object>} lineupB - Second candidate lineup
 * @returns {Object} { winner: 'A'|'B'|'TIE', chemistryDifference: number }
 */
export function compareLineupChemistry(lineupA, lineupB) {
  const scoreA = calculateTeamChemistry(lineupA);
  const scoreB = calculateTeamChemistry(lineupB);
  const diff = Math.abs(scoreA - scoreB);

  let winner = 'TIE';
  if (scoreA > scoreB) winner = 'A';
  if (scoreB > scoreA) winner = 'B';

  return {
    winner,
    chemistryDifference: diff,
    scoreA,
    scoreB,
  };
}
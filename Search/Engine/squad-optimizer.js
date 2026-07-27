/**
 * squad-optimizer.js
 * ---------------------------------------------------------------------------
 * MODULE 5 — Squad Optimizer Engine
 * ---------------------------------------------------------------------------
 */

import {
  isGoalkeeperType,
} from './behaviour-intelligence.js';

import {
  scorePosition,
} from './position-suitability.js';

import {
  FORMATION_IDS,
} from '../Data/formations-data.js';

import {
  getFormation,
} from './formation-intelligence.js';

/** Custom error class for squad optimization failures. */
export class SquadOptimizerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SquadOptimizerError';
  }
}

/** Round a number to a specified number of decimal places. */
function roundTo(val, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/** Maps formation slot names to valid scorePosition keys. */
function normalizeSlotToPosition(slotName) {
  if (slotName === 'GK') {
    return 'GK_STOPPER';
  }
  return slotName;
}

/** Helper to determine if a position key represents a goalkeeper position. */
function isGoalkeeperPosition(pos) {
  return pos.startsWith('GK');
}

/** Calculates total and average score for a starting lineup. */
export function calculateLineupScore(lineup) {
  if (!Array.isArray(lineup) || lineup.length === 0) {
    return { totalScore: 0, averageScore: 0 };
  }

  const total = lineup.reduce((acc, player) => acc + (player.score || 0), 0);
  const totalScore = roundTo(total, 1);
  const averageScore = roundTo(total / lineup.length, 1);

  return {
    totalScore,
    averageScore,
  };
}

/** Validates a generated starting lineup against tactical and structural rules. */
export function validateLineup(lineup, formationId) {
  const errors = [];

  let formation;
  try {
    formation = getFormation(formationId);
  } catch (err) {
    return { valid: false, errors: [`Invalid formation ID: "${formationId}"`] };
  }

  if (!Array.isArray(lineup)) {
    return { valid: false, errors: ['Lineup must be an array.'] };
  }

  if (lineup.length !== formation.slots.length) {
    errors.push(`Lineup slot count (${lineup.length}) does not match formation requirement (${formation.slots.length}).`);
  }

  const seenPlayers = new Set();
  lineup.forEach((slot, index) => {
    if (!slot.playerId) {
      errors.push(`Slot index ${index} missing playerId.`);
      return;
    }

    if (seenPlayers.has(slot.playerId)) {
      errors.push(`Duplicate player detected in lineup: ${slot.playerId}`);
    }
    seenPlayers.add(slot.playerId);

    const isGKPlayer = isGoalkeeperType(slot.type);
    const expectedPos = normalizeSlotToPosition(formation.slots[index]);
    const isGKSlot = isGoalkeeperPosition(expectedPos);

    if (isGKSlot && !isGKPlayer) {
      errors.push(`Outfield player (${slot.playerId}) assigned to Goalkeeper slot at index ${index}.`);
    }

    if (!isGKSlot && isGKPlayer) {
      errors.push(`Goalkeeper player (${slot.playerId}) assigned to outfield slot at index ${index}.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/** Returns players from the original squad who were not selected in the starting lineup. */
export function getBenchPlayers(players, lineup) {
  const selectedIds = new Set((lineup || []).map((p) => p.playerId));
  return (players || [])
    .filter((p) => !selectedIds.has(p.id))
    .map((p) => ({ playerId: p.id }));
}

/**
 * Normalizes user overrides so both level-nested and direct formats work cleanly.
 */
function normalizeOverrides(overrides, playerType, level) {
  if (!overrides || !overrides[playerType]) return overrides;

  // If overrides already have the level key nested, return as is
  if (overrides[playerType][level]) {
    return overrides;
  }

  // If passed directly like { Guard: { sp: 99 } }, construct level wrapper automatically
  return {
    ...overrides,
    [playerType]: {
      ...overrides[playerType],
      [level]: overrides[playerType],
    },
  };
}

/** Optimizes squad assignment for a specific formation using deterministic matching. */
export function optimizeSquad(players, formationId, overrides = {}) {
  const formation = getFormation(formationId);
  const slots = formation.slots;

  if (!Array.isArray(players) || players.length < slots.length) {
    throw new SquadOptimizerError(
      `Insufficient players to fill formation ${formationId}. Required: ${slots.length}, Provided: ${players ? players.length : 0}`
    );
  }

  // Pre-calculate score matrix for each candidate player across all formation slots
  const candidates = players.map((p) => {
    const isGK = isGoalkeeperType(p.type);
    const playerOverrides = normalizeOverrides(overrides, p.type, p.level);

    const slotScores = slots.map((slotName) => {
      const targetPos = normalizeSlotToPosition(slotName);
      const isGKSlot = isGoalkeeperPosition(targetPos);

      // Enforce Goalkeeper isolation rule
      if ((isGK && !isGKSlot) || (!isGK && isGKSlot)) {
        return 0;
      }

      const res = scorePosition(p.type, p.level, targetPos, playerOverrides);
      return res.score;
    });

    return {
      player: p,
      isGK,
      slotScores,
    };
  });

  const slotIndices = slots.map((_, idx) => idx);
  const gkSlotIndices = slotIndices.filter((idx) => isGoalkeeperPosition(normalizeSlotToPosition(slots[idx])));
  const outfieldSlotIndices = slotIndices.filter((idx) => !isGoalkeeperPosition(normalizeSlotToPosition(slots[idx])));

  const assignedLineup = new Array(slots.length).fill(null);
  const usedPlayerIds = new Set();

  const fillSlots = (indices) => {
    const sortedIndices = [...indices].sort((idxA, idxB) => {
      const topA = Math.max(...candidates.map((c) => c.slotScores[idxA]));
      const topB = Math.max(...candidates.map((c) => c.slotScores[idxB]));
      return topB - topA;
    });

    sortedIndices.forEach((slotIdx) => {
      let bestCandidate = null;
      let bestScore = -1;

      candidates.forEach((cand) => {
        if (usedPlayerIds.has(cand.player.id)) return;

        const score = cand.slotScores[slotIdx];
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = cand;
        } else if (score === bestScore && bestCandidate !== null) {
          if (cand.player.id.localeCompare(bestCandidate.player.id) < 0) {
            bestCandidate = cand;
          }
        }
      });

      if (!bestCandidate) {
        throw new SquadOptimizerError(`Unable to fill slot index ${slotIdx} (${slots[slotIdx]}) legally.`);
      }

      usedPlayerIds.add(bestCandidate.player.id);
      assignedLineup[slotIdx] = {
        playerId: bestCandidate.player.id,
        type: bestCandidate.player.type,
        level: bestCandidate.player.level,
        position: slots[slotIdx],
        score: bestScore,
      };
    });
  };

  fillSlots(gkSlotIndices);
  fillSlots(outfieldSlotIndices);

  const { totalScore } = calculateLineupScore(assignedLineup);
  const bench = getBenchPlayers(players, assignedLineup);

  return {
    formation: formationId,
    totalScore,
    lineup: assignedLineup,
    bench,
  };
}

/** Optimizes squad across multiple formation choices and ranks them by total team score. */
export function compareFormations(players, formationIds, overrides = {}) {
  if (!Array.isArray(formationIds)) {
    return [];
  }

  const results = formationIds.map((fId) => {
    const opt = optimizeSquad(players, fId, overrides);
    return {
      formation: fId,
      score: opt.totalScore,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

/** Finds the single best formation for a squad across all supported formations. */
export function findBestFormation(players, overrides = {}) {
  const ranked = compareFormations(players, FORMATION_IDS, overrides);
  return ranked[0];
}
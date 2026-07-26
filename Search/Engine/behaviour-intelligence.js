/**
 * behaviour-intelligence.js
 * ---------------------------------------------------------------------------
 * MODULE 1 — Behaviour Intelligence Layer (API)
 *
 * Responsibility (per Recommendation Engine Architecture, Section 4):
 *   Given a behaviour type + level (+ optional user corrections), resolve
 *   the six ground-truth attributes a player has RIGHT NOW, with full
 *   provenance (verified / estimated / user-corrected) so the Explainable
 *   Reasoning layer (Module 7 downstream) can cite exactly where a number
 *   came from.
 *
 * This module owns NO mutable global state. Callers pass an `overrides`
 * object explicitly on every call. This keeps the layer pure, deterministic,
 * and trivially unit-testable — it never reaches into localStorage, the
 * DOM, or any persistence mechanism itself. Persistence is a concern of the
 * layer above this one (out of scope for this module).
 * ---------------------------------------------------------------------------
 */

import {
  DEFAULT_STATS,
  ATTR_KEYS,
  BEHAVIOUR_TYPES,
  isGoalkeeperType,
  clampLevel,
  DATA_VERSION,
} from '../Data/behaviour-data.js';

/** Thrown when a caller asks about a behaviour type this layer doesn't know. */
export class UnknownBehaviourTypeError extends Error {
  constructor(type) {
    super(`Unknown behaviour type: "${type}". Known types: ${BEHAVIOUR_TYPES.join(', ')}`);
    this.name = 'UnknownBehaviourTypeError';
    this.type = type;
  }
}

/**
 * @typedef {Object} ResolvedAttributes
 * @property {number} sp
 * @property {number} ht
 * @property {number} st
 * @property {number} pw
 * @property {number} sk
 * @property {number} rs
 * @property {string} type
 * @property {number} level
 * @property {Object.<string, 'verified'|'estimated'|'user-corrected'>} provenance
 *   Per-attribute origin of the value actually returned.
 */

/**
 * Validate that a behaviour type exists in the known type list.
 * @param {string} type
 * @throws {UnknownBehaviourTypeError}
 */
export function assertValidBehaviourType(type) {
  if (!BEHAVIOUR_TYPES.includes(type)) {
    throw new UnknownBehaviourTypeError(type);
  }
}

/**
 * Resolve the six attributes for a (type, level) pair, honoring user
 * corrections where present.
 *
 * @param {string} type - one of BEHAVIOUR_TYPES
 * @param {number} level - 1-10 (values outside this range are clamped)
 * @param {Object} [overrides] - user-corrected stats, shaped as
 *   { [type]: { [level]: { [attrKey]: number } } } — matches what the
 *   editable "stats data" UI in the current prototype already persists.
 * @returns {ResolvedAttributes}
 * @throws {UnknownBehaviourTypeError} if `type` is not recognized
 */
export function resolveAttributes(type, level, overrides = {}) {
  assertValidBehaviourType(type);
  const lvl = clampLevel(level);

  const base = DEFAULT_STATS[type][lvl];
  const overrideRow = overrides?.[type]?.[lvl];

  const result = { type, level: lvl, provenance: {} };

  ATTR_KEYS.forEach((attr, idx) => {
    const hasOverride = overrideRow && overrideRow[attr] !== undefined && overrideRow[attr] !== null;
    if (hasOverride) {
      result[attr] = Number(overrideRow[attr]);
      result.provenance[attr] = 'user-corrected';
    } else {
      result[attr] = base[attr];
      result.provenance[attr] = base._prov[idx];
    }
  });

  return result;
}

/**
 * Convenience: resolve attributes for every level (1-10) of a type in one
 * call. Used by the editable reference-table UI and by the Future
 * Prediction Engine (Module 9) to reason about a player's growth curve.
 * @param {string} type
 * @param {Object} [overrides]
 * @returns {ResolvedAttributes[]} indexed 0..9 for levels 1..10
 */
export function resolveAllLevels(type, overrides = {}) {
  assertValidBehaviourType(type);
  const rows = [];
  for (let lvl = 1; lvl <= 10; lvl++) {
    rows.push(resolveAttributes(type, lvl, overrides));
  }
  return rows;
}

/**
 * Compute, per attribute, the maximum value observed across all behaviour
 * types for a given level range. Used by the Position Suitability Scoring
 * layer (Module 2) to normalize raw attribute values into a 0-100 scale.
 *
 * Levels 1-9 are used by default (not 1-10): level 10 in the source data is
 * a special "fully maxed" tier with uniform cap values (e.g. 50 or 100
 * across every type), which would flatten normalization if included — see
 * Architecture doc, Section 12 (Edge Cases) for the full rationale.
 *
 * @param {Object} [overrides]
 * @param {{minLevel?: number, maxLevel?: number}} [opts]
 * @returns {Object.<string, number>} e.g. { sp: 47, ht: 46, ... }
 */
export function computeAttributeCeilings(overrides = {}, opts = {}) {
  const minLevel = opts.minLevel ?? 1;
  const maxLevel = opts.maxLevel ?? 9;
  const ceilings = {};
  ATTR_KEYS.forEach((a) => { ceilings[a] = 1; });

  BEHAVIOUR_TYPES.forEach((type) => {
    for (let lvl = minLevel; lvl <= maxLevel; lvl++) {
      const resolved = resolveAttributes(type, lvl, overrides);
      ATTR_KEYS.forEach((a) => {
        if (resolved[a] > ceilings[a]) ceilings[a] = resolved[a];
      });
    }
  });

  return ceilings;
}

/**
 * Report which cells in the *default* table were originally estimated
 * (interpolated) rather than sourced directly from verified game data.
 * Used by the UI to flag low-confidence cells and by the Explainable
 * Reasoning layer to (optionally) caveat a recommendation that leaned
 * heavily on an estimated stat.
 *
 * @returns {Array<{type: string, level: number, attr: string}>}
 */
export function listEstimatedCells() {
  const out = [];
  BEHAVIOUR_TYPES.forEach((type) => {
    for (let lvl = 1; lvl <= 10; lvl++) {
      const row = DEFAULT_STATS[type][lvl];
      row._prov.forEach((status, idx) => {
        if (status === 'estimated') {
          out.push({ type, level: lvl, attr: ATTR_KEYS[idx] });
        }
      });
    }
  });
  return out;
}

export { isGoalkeeperType, clampLevel, ATTR_KEYS, BEHAVIOUR_TYPES, DATA_VERSION };

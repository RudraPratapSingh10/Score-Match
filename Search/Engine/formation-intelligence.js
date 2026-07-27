/**
 * formation-intelligence.js
 * ---------------------------------------------------------------------------
 * MODULE 3 — Formation Intelligence Layer (Engine)
 *
 * Responsibility:
 *   Converts raw formation definitions into enriched tactical slot metadata and
 *   role distributions for team composition, optimization engines (Module 4+),
 *   and explainable reasoning layers.
 *
 * DESIGN & ARCHITECTURE NOTES:
 * - Pure functions only: Zero state, zero DOM, zero network.
 * - Fully deterministic behavior based on static data inputs.
 * - Seamless integration with position categories defined across the system.
 * ---------------------------------------------------------------------------
 */

import {
  FORMATIONS,
  FORMATION_IDS,
  isValidFormation,
} from '../Data/formations-data.js';

/** Thrown when an unrecognized formation ID is provided. */
export class UnknownFormationError extends Error {
  constructor(id) {
    super(`Unknown formation ID: "${id}". Supported formations: ${FORMATION_IDS.join(', ')}`);
    this.name = 'UnknownFormationError';
    this.id = id;
  }
}

/**
 * Categorizes position codes into standard broad football roles.
 * @type {Readonly<Object.<string, string>>}
 */
const POSITION_ROLE_MAP = Object.freeze({
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

/**
 * Validate that a formation ID exists.
 * @param {string} id
 * @throws {UnknownFormationError}
 */
export function assertValidFormation(id) {
  if (!isValidFormation(id)) {
    throw new UnknownFormationError(id);
  }
}

/**
 * Retrieve full formation record.
 * @param {string} id
 * @returns {{id: string, name: string, slots: readonly string[]}}
 */
export function getFormation(id) {
  assertValidFormation(id);
  return FORMATIONS[id];
}

/**
 * Retrieve the list of positional slot codes for a formation.
 * @param {string} id
 * @returns {string[]}
 */
export function getSlots(id) {
  assertValidFormation(id);
  return [...FORMATIONS[id].slots];
}

/**
 * Count the total number of slots in a formation (typically 11).
 * @param {string} id
 * @returns {number}
 */
export function countSlots(id) {
  assertValidFormation(id);
  return FORMATIONS[id].slots.length;
}

/**
 * Count frequencies of each specific position within a formation.
 * @param {string} id
 * @returns {Object.<string, number>} e.g., { GK: 1, CB: 2, CM: 2, ST: 2 }
 */
export function getPositionCounts(id) {
  assertValidFormation(id);
  const slots = FORMATIONS[id].slots;
  const counts = {};

  slots.forEach((slot) => {
    counts[slot] = (counts[slot] || 0) + 1;
  });

  return counts;
}

/**
 * Expand a formation into rich slot metadata objects, detailing index, slot name, and role.
 * @param {string} id
 * @returns {Array<{slotIndex: number, slotName: string, role: ('goalkeeper'|'defender'|'midfielder'|'forward')}>}
 */
export function expandFormation(id) {
  assertValidFormation(id);
  const slots = FORMATIONS[id].slots;

  return slots.map((slotName, slotIndex) => ({
    slotIndex,
    slotName,
    role: POSITION_ROLE_MAP[slotName] || 'midfielder',
  }));
}

/**
 * Calculate role distribution metrics for a formation.
 * @param {string} id
 * @returns {{goalkeepers: number, defenders: number, midfielders: number, forwards: number}}
 */
export function getRoleCounts(id) {
  assertValidFormation(id);
  const expanded = expandFormation(id);

  const roleCounts = {
    goalkeepers: 0,
    defenders: 0,
    midfielders: 0,
    forwards: 0,
  };

  expanded.forEach((slot) => {
    if (slot.role === 'goalkeeper') roleCounts.goalkeepers++;
    else if (slot.role === 'defender') roleCounts.defenders++;
    else if (slot.role === 'midfielder') roleCounts.midfielders++;
    else if (slot.role === 'forward') roleCounts.forwards++;
  });

  return roleCounts;
}

/**
 * Retrieve all formation records.
 * @returns {Array<{id: string, name: string, slots: readonly string[]}>}
 */
export function getAllFormations() {
  return FORMATION_IDS.map((id) => FORMATIONS[id]);
}
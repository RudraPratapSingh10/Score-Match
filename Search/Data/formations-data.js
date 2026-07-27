/**
 * formations-data.js
 * ---------------------------------------------------------------------------
 * MODULE 3 — Formation Intelligence Layer (Data)
 *
 * Single source of truth for all supported Score! Match formations.
 * Each formation specifies its unique ID, human-readable display name, and an
 * ordered 11-slot array representing the tactical layout on the field.
 *
 * DESIGN & ARCHITECTURE NOTES:
 * - Pure data module: No side effects, no dependencies, no logic except simple lookup validation.
 * - Immutable data exports: Object.freeze() prevents accidental runtime mutations.
 * ---------------------------------------------------------------------------
 */

export const FORMATION_DATA_VERSION = '1.0.0';

/**
 * Raw formation definitions containing slot order.
 * Slots always start with 1 GK followed by 10 outfield positions.
 */
export const FORMATIONS = Object.freeze({
  '442': Object.freeze({
    id: '442',
    name: '4-4-2',
    slots: Object.freeze(['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST']),
  }),
  '433': Object.freeze({
    id: '433',
    name: '4-3-3',
    slots: Object.freeze(['GK', 'LB', 'CB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'ST', 'RW']),
  }),
  '532': Object.freeze({
    id: '532',
    name: '5-3-2',
    slots: Object.freeze(['GK', 'LWB', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CDM', 'CM', 'ST', 'ST']),
  }),
  '352': Object.freeze({
    id: '352',
    name: '3-5-2',
    slots: Object.freeze(['GK', 'CB', 'CB', 'CB', 'LWB', 'CDM', 'CDM', 'RWB', 'CAM', 'CF', 'ST']),
  }),
  '451': Object.freeze({
    id: '451',
    name: '4-5-1',
    slots: Object.freeze(['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CDM', 'CM', 'RM', 'ST']),
  }),
  '541': Object.freeze({
    id: '541',
    name: '5-4-1',
    slots: Object.freeze(['GK', 'LWB', 'CB', 'CB', 'CB', 'RWB', 'LM', 'CM', 'CM', 'RM', 'ST']),
  }),
  '343': Object.freeze({
    id: '343',
    name: '3-4-3',
    slots: Object.freeze(['GK', 'CB', 'CB', 'CB', 'LM', 'CM', 'CM', 'RM', 'LW', 'ST', 'RW']),
  }),
});

/** Array of all supported formation IDs. */
export const FORMATION_IDS = Object.freeze(Object.keys(FORMATIONS));

/**
 * Helper to check if a string is a valid formation ID.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidFormation(id) {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(FORMATIONS, id);
}
/**
 * position-weights.js
 * ---------------------------------------------------------------------------
 * MODULE 2 — Position Weights Layer (Data)
 *
 * Single source of truth for positional weight distributions across the six
 * player attributes: Speed (sp), Height (ht), Strength (st), Power (pw),
 * Skill (sk), and Response (rs).
 *
 * RULES & GUARANTEES:
 * - Pure data module: No calculations, no helper functions, no normalization logic.
 * - Zero imports from Module 1 or external dependencies.
 * - Every position defines exactly six numeric attribute weights.
 * - The sum of all six weights for any position equals EXACTLY 100.
 * - Fully immutable: All exported data structures are frozen with Object.freeze().
 * ---------------------------------------------------------------------------
 */

export const POSITION_DATA_VERSION = 1;

export const POSITION_KEYS = Object.freeze([
  'GK_STOPPER',
  'GK_SWEEPER',
  'CB',
  'LB',
  'RB',
  'LWB',
  'RWB',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RM',
  'LW',
  'RW',
  'CF',
  'SS',
  'ST',
]);

export const POSITION_WEIGHTS = Object.freeze({
  // Goalkeepers: Prioritizing Response & Height
  GK_STOPPER: Object.freeze({ sp: 5, ht: 35, st: 10, pw: 5, sk: 5, rs: 40 }),
  GK_SWEEPER: Object.freeze({ sp: 15, ht: 25, st: 5, pw: 5, sk: 10, rs: 40 }),

  // Center Backs: Prioritizing Strength & Height
  CB: Object.freeze({ sp: 10, ht: 30, st: 30, pw: 10, sk: 5, rs: 15 }),

  // Fullbacks: Balanced Speed, Response, and Skill/Strength
  LB: Object.freeze({ sp: 30, ht: 10, st: 15, pw: 5, sk: 15, rs: 25 }),
  RB: Object.freeze({ sp: 30, ht: 10, st: 15, pw: 5, sk: 15, rs: 25 }),

  // Wing Backs: High Speed, Response, and Skill
  LWB: Object.freeze({ sp: 35, ht: 5, st: 10, pw: 5, sk: 20, rs: 25 }),
  RWB: Object.freeze({ sp: 35, ht: 5, st: 10, pw: 5, sk: 20, rs: 25 }),

  // Defensive Midfielders: Prioritizing Skill, Response, Strength, and Height
  CDM: Object.freeze({ sp: 10, ht: 15, st: 20, pw: 10, sk: 20, rs: 25 }),

  // Central Midfielders: Prioritizing Skill & Response
  CM: Object.freeze({ sp: 15, ht: 10, st: 10, pw: 10, sk: 30, rs: 25 }),

  // Attacking Midfielders: Prioritizing Skill & Response
  CAM: Object.freeze({ sp: 15, ht: 5, st: 5, pw: 10, sk: 40, rs: 25 }),

  // Wide Midfielders: Prioritizing Speed, Skill, and Response
  LM: Object.freeze({ sp: 30, ht: 5, st: 5, pw: 5, sk: 30, rs: 25 }),
  RM: Object.freeze({ sp: 30, ht: 5, st: 5, pw: 5, sk: 30, rs: 25 }),

  // Wingers: Prioritizing Speed & Skill
  LW: Object.freeze({ sp: 40, ht: 5, st: 5, pw: 5, sk: 30, rs: 15 }),
  RW: Object.freeze({ sp: 40, ht: 5, st: 5, pw: 5, sk: 30, rs: 15 }),

  // Forwards: Prioritizing Speed, Skill, and Power
  CF: Object.freeze({ sp: 25, ht: 10, st: 10, pw: 20, sk: 20, rs: 15 }),
  SS: Object.freeze({ sp: 30, ht: 5, st: 5, pw: 15, sk: 25, rs: 20 }),
  ST: Object.freeze({ sp: 30, ht: 10, st: 10, pw: 25, sk: 15, rs: 10 }),
});
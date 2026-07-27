/**
 * query-parser.js
 * ---------------------------------------------------------------------------
 * Converts natural language user queries into structured engine commands.
 */

const KNOWN_FORMATIONS = [
  '4-4-2', '4-3-3', '3-5-2', '5-3-2', '3-4-3', '4-2-3-1', '5-4-1', '4-1-2-1-2', '3-4-1-2'
];

const KNOWN_POSITIONS = [
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'DM', 'CM', 'LM', 'RM', 'AM', 'LW', 'RW', 'CF', 'ST'
];

const KNOWN_BEHAVIOURS = [
  'Guard', 'Engine', 'Commander', 'Producer', 'Prowler', 'Speedster',
  'Intruder', 'Hammer', 'Architect', 'Voyager', 'Protector', 'Stopper',
  'Sweeper', 'Menace', 'Infiltrator', 'Hero', 'Poacher', 'Marksman'
];

/**
 * Detects the core intent from a raw query.
 * @param {string} query 
 * @returns {string} Intent identifier
 */
export function detectIntent(query) {
  if (typeof query !== 'string' || !query.trim()) return 'unknown';

  const q = query.toLowerCase();

  if (q.includes('compare') || q.includes('versus') || q.includes(' vs ')) return 'compare_players';
  if (q.includes('optimize') || q.includes('best squad') || q.includes('best lineup') || q.includes('best team')) return 'optimize_squad';
  if (q.includes('chemistry') || q.includes('synergy')) return 'chemistry_analysis';
  if (q.includes('grow') || q.includes('predict') || q.includes('future') || q.includes('level up')) return 'growth_prediction';
  if (q.includes('simulate') || q.includes('scenario') || q.includes('matchup')) return 'simulation';
  if (q.includes('why') || q.includes('explain')) return 'explain_recommendation';
  if (q.includes('recommend') || q.includes('suggest')) return 'recommendation';
  if (q.includes('best player') || q.includes('top player')) return 'best_player';
  if (q.includes('best formation') || q.includes('ideal formation')) return 'best_formation';
  if (q.includes('best') || q.includes('top') || q.includes('ideal')) return 'best_position';

  return 'unknown';
}

/**
 * Extracts a valid formation pattern from text.
 * @param {string} query 
 * @returns {string|null}
 */
export function extractFormation(query) {
  if (typeof query !== 'string') return null;
  
  for (const fmt of KNOWN_FORMATIONS) {
    const regex = new RegExp(`\\b${fmt}\\b`, 'i');
    if (regex.test(query)) return fmt;
  }

  // Generic fallback for formation regex X-X-X or X-X-X-X
  const genericMatch = query.match(/\b\d-\d-\d(-\d)?\b/);
  return genericMatch ? genericMatch[0] : null;
}

/**
 * Extracts a valid position from text.
 * @param {string} query 
 * @returns {string|null}
 */
export function extractPosition(query) {
  if (typeof query !== 'string') return null;

  const upperQuery = query.toUpperCase();
  for (const pos of KNOWN_POSITIONS) {
    const regex = new RegExp(`\\b${pos}\\b`, 'i');
    if (regex.test(query)) return pos;
  }
  return null;
}

/**
 * Extracts all matching behaviour types from text.
 * @param {string} query 
 * @returns {Array<string>}
 */
export function extractBehaviour(query) {
  if (typeof query !== 'string') return [];

  const found = [];
  for (const beh of KNOWN_BEHAVIOURS) {
    const regex = new RegExp(`\\b${beh}\\b`, 'i');
    if (regex.test(query)) {
      found.push(beh);
    }
  }
  return found;
}

/**
 * Extracts target level numbers (e.g. "Level 10", "lvl 9").
 * @param {string} query 
 * @returns {number|null}
 */
export function extractLevel(query) {
  if (typeof query !== 'string') return null;

  const match = query.match(/\b(?:level|lvl|lvl\.|level\s*)\s*(\d{1,2})\b/i);
  if (match) {
    const lvl = parseInt(match[1], 10);
    return (lvl >= 1 && lvl <= 11) ? lvl : null;
  }
  return null;
}

/**
 * Parses a query string into a structured request object.
 * @param {string} query 
 * @returns {Object} Structured command
 */
export function parseQuery(query) {
  if (typeof query !== 'string' || !query.trim()) {
    return {
      intent: 'unknown',
      formation: null,
      position: null,
      behaviours: [],
      level: null,
      rawQuery: query || ''
    };
  }

  const intent = detectIntent(query);
  const formation = extractFormation(query);
  const position = extractPosition(query);
  const behaviours = extractBehaviour(query);
  const level = extractLevel(query);

  return {
    intent,
    formation,
    position,
    behaviours,
    level,
    rawQuery: query
  };
}
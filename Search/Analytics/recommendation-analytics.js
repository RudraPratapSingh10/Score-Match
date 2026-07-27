/**
 * recommendation-analytics.js
 * ---------------------------------------------------------------------------
 * Tracks and aggregates stats on recommendation events.
 */

/**
 * Validates and records a single recommendation event into a normalized object.
 * @param {Object} event
 * @returns {Object} Normalized event object
 */
export function recordRecommendation(event) {
  if (!event || typeof event !== 'object') {
    return {
      behaviour: 'Unknown',
      position: 'Unknown',
      formation: 'Unknown',
      suitability: 0,
      chemistry: 0,
      timestamp: Date.now()
    };
  }

  return {
    behaviour: String(event.behaviour || 'Unknown'),
    position: String(event.position || 'Unknown'),
    formation: String(event.formation || 'Unknown'),
    suitability: typeof event.suitability === 'number' && !isNaN(event.suitability) ? event.suitability : 0,
    chemistry: typeof event.chemistry === 'number' && !isNaN(event.chemistry) ? event.chemistry : 0,
    timestamp: typeof event.timestamp === 'number' ? event.timestamp : Date.now()
  };
}

/**
 * Calculates the top recommended behaviour across events.
 * @param {Array} events
 * @returns {string} Top behaviour name
 */
export function getTopRecommendedBehaviours(events) {
  if (!Array.isArray(events) || events.length === 0) return 'None';
  const counts = {};
  for (const e of events) {
    if (!e || !e.behaviour) continue;
    counts[e.behaviour] = (counts[e.behaviour] || 0) + 1;
  }
  let top = 'None';
  let max = 0;
  for (const [b, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      top = b;
    }
  }
  return top;
}

/**
 * Calculates the top recommended position across events.
 * @param {Array} events
 * @returns {string} Top position name
 */
export function getTopRecommendedPositions(events) {
  if (!Array.isArray(events) || events.length === 0) return 'None';
  const counts = {};
  for (const e of events) {
    if (!e || !e.position) continue;
    counts[e.position] = (counts[e.position] || 0) + 1;
  }
  let top = 'None';
  let max = 0;
  for (const [p, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      top = p;
    }
  }
  return top;
}

/**
 * Calculates the most used formation across events.
 * @param {Array} events
 * @returns {string} Most used formation
 */
export function getFormationUsage(events) {
  if (!Array.isArray(events) || events.length === 0) return 'None';
  const counts = {};
  for (const e of events) {
    if (!e || !e.formation) continue;
    counts[e.formation] = (counts[e.formation] || 0) + 1;
  }
  let top = 'None';
  let max = 0;
  for (const [f, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      top = f;
    }
  }
  return top;
}

/**
 * Computes average suitability across events.
 * @param {Array} events
 * @returns {number} Average suitability rounded to 1 decimal place
 */
export function getAverageSuitability(events) {
  if (!Array.isArray(events) || events.length === 0) return 0;
  let sum = 0;
  let validCount = 0;
  for (const e of events) {
    if (e && typeof e.suitability === 'number' && !isNaN(e.suitability)) {
      sum += e.suitability;
      validCount++;
    }
  }
  if (validCount === 0) return 0;
  return Number((sum / validCount).toFixed(1));
}

/**
 * Computes average chemistry across events.
 * @param {Array} events
 * @returns {number} Average chemistry rounded to 1 decimal place
 */
export function getAverageChemistry(events) {
  if (!Array.isArray(events) || events.length === 0) return 0;
  let sum = 0;
  let validCount = 0;
  for (const e of events) {
    if (e && typeof e.chemistry === 'number' && !isNaN(e.chemistry)) {
      sum += e.chemistry;
      validCount++;
    }
  }
  if (validCount === 0) return 0;
  return Number((sum / validCount).toFixed(1));
}

/**
 * Returns a full summary report from recorded events.
 * @param {Array} events
 * @returns {Object} Analytical summary
 */
export function getRecommendationSummary(events) {
  const safeEvents = Array.isArray(events) ? events : [];
  return {
    totalRecommendations: safeEvents.length,
    topBehaviour: getTopRecommendedBehaviours(safeEvents),
    topPosition: getTopRecommendedPositions(safeEvents),
    mostUsedFormation: getFormationUsage(safeEvents),
    averageSuitability: getAverageSuitability(safeEvents),
    averageChemistry: getAverageChemistry(safeEvents)
  };
}
/**
 * recommendation-validator.js
 * ---------------------------------------------------------------------------
 * Validates structural integrity, rules, and limits of recommendations & squads.
 */

const VALID_POSITIONS = new Set([
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB',
  'DM', 'CM', 'LM', 'RM', 'AM',
  'LW', 'RW', 'CF', 'ST'
]);

const VALID_FORMATIONS = new Set([
  '4-4-2', '4-3-3', '3-5-2', '5-3-2', '4-2-3-1', '5-2-1-2', '4-1-2-1-2', '3-4-3'
]);

/**
 * Validates a formation identifier.
 * @param {string} formation
 * @returns {Array<string>} Errors
 */
export function validateFormation(formation) {
  const errors = [];
  if (!formation || typeof formation !== 'string') {
    errors.push('Invalid or missing formation identifier');
    return errors;
  }
  const norm = formation.trim();
  if (!VALID_FORMATIONS.has(norm) && !/^\d-\d-\d(-\d)?$/.test(norm)) {
    errors.push(`Invalid formation style: ${formation}`);
  }
  return errors;
}

/**
 * Validates a chemistry score.
 * @param {number} chemistry
 * @returns {Array<string>} Errors
 */
export function validateChemistry(chemistry) {
  const errors = [];
  if (typeof chemistry !== 'number' || isNaN(chemistry)) {
    errors.push('Chemistry must be a valid number');
  } else if (chemistry < 0 || chemistry > 100) {
    errors.push(`Invalid chemistry value: ${chemistry} (must be between 0 and 100)`);
  }
  return errors;
}

/**
 * Validates a suitability score.
 * @param {number} suitability
 * @returns {Array<string>} Errors
 */
export function validateSuitability(suitability) {
  const errors = [];
  if (typeof suitability !== 'number' || isNaN(suitability)) {
    errors.push('Suitability must be a valid number');
  } else if (suitability < 0 || suitability > 100) {
    errors.push(`Invalid suitability value: ${suitability} (must be between 0 and 100)`);
  }
  return errors;
}

/**
 * Validates an entire squad lineup against rules (duplicates, GK rules, positions).
 * @param {Array} squad
 * @returns {Array<string>} Errors
 */
export function validateSquad(squad) {
  const errors = [];
  if (!Array.isArray(squad)) {
    errors.push('Squad must be an array of player slots');
    return errors;
  }

  if (squad.length === 0) {
    errors.push('Squad is empty');
    return errors;
  }

  const playerIds = new Set();
  let gkCount = 0;

  for (let i = 0; i < squad.length; i++) {
    const item = squad[i];
    if (!item || typeof item !== 'object') {
      errors.push(`Invalid player slot at index ${i}`);
      continue;
    }

    // ID / Identity duplicate check
    const pid = item.id || item.playerId || (item.player && item.player.id);
    if (pid) {
      if (playerIds.has(pid)) {
        errors.push(`Duplicate player found: ${pid}`);
      }
      playerIds.add(pid);
    }

    // Position check
    const pos = item.position || item.assignedPosition;
    if (pos) {
      if (!VALID_POSITIONS.has(pos)) {
        errors.push(`Invalid position assigned: ${pos}`);
      }
      if (pos === 'GK') {
        gkCount++;
      }
    }
  }

  if (squad.length >= 11 && gkCount === 0) {
    errors.push('Missing goalkeeper');
  } else if (gkCount > 1) {
    errors.push(`Multiple goalkeepers assigned (${gkCount})`);
  }

  return errors;
}

/**
 * Validates a single recommendation response object.
 * @param {Object} rec
 * @returns {Array<string>} Errors
 */
export function validateRecommendation(rec) {
  const errors = [];
  if (!rec || typeof rec !== 'object') {
    errors.push('Recommendation object is missing or invalid');
    return errors;
  }

  if (rec.formation) {
    errors.push(...validateFormation(rec.formation));
  }

  if (rec.chemistry !== undefined) {
    errors.push(...validateChemistry(rec.chemistry));
  }

  if (rec.suitability !== undefined) {
    errors.push(...validateSuitability(rec.suitability));
  }

  if (Array.isArray(rec.squad) || Array.isArray(rec.recommendations)) {
    const list = rec.squad || rec.recommendations;
    errors.push(...validateSquad(list));
  }

  return errors;
}

/**
 * Generates a full validation report for an engine output.
 * @param {Object} rec
 * @returns {Object} Validation report
 */
export function generateValidationReport(rec) {
  const errors = validateRecommendation(rec);
  return {
    valid: errors.length === 0,
    errors
  };
}
/**
 * user-overrides.js
 * ---------------------------------------------------------------------------
 * PHASE B — Persistence Layer (User Overrides)
 * ---------------------------------------------------------------------------
 * Stores and manages custom player attribute corrections made by users.
 * Safely handles storage availability, corrupted JSON, and schema migrations.
 */

const STORAGE_KEY = 'score_match_user_overrides';
const DATA_VERSION = '2026.07.27-1';

/**
 * Checks if localStorage is available and functional.
 * @returns {boolean}
 */
function isStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a fresh, empty user overrides data structure.
 * @returns {Object}
 */
function createDefaultStructure() {
  return {
    version: DATA_VERSION,
    overrides: {},
  };
}

/**
 * Migrates older or unversioned override data structures to current DATA_VERSION.
 * @param {Object} rawData 
 * @returns {Object} Migrated overrides structure
 */
export function migrateOverrides(rawData) {
  if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
    return createDefaultStructure();
  }

  const migrated = {
    version: DATA_VERSION,
    overrides: {},
  };

  const sourceOverrides = rawData.overrides && typeof rawData.overrides === 'object'
    ? rawData.overrides
    : rawData;

  for (const [type, levels] of Object.entries(sourceOverrides)) {
    if (type === 'version' || !levels || typeof levels !== 'object') continue;
    
    migrated.overrides[type] = {};
    for (const [lvl, stats] of Object.entries(levels)) {
      if (stats && typeof stats === 'object' && !Array.isArray(stats)) {
        migrated.overrides[type][lvl] = { ...stats };
      }
    }
  }

  return migrated;
}

/**
 * Loads stored user attribute overrides.
 * @returns {Object} Stored overrides or empty structure (never returns null)
 */
export function loadOverrides() {
  if (!isStorageAvailable()) {
    return createDefaultStructure();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultStructure();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return createDefaultStructure();
    }

    if (parsed.version !== DATA_VERSION) {
      const migrated = migrateOverrides(parsed);
      saveOverrides(migrated);
      return migrated;
    }

    return {
      version: DATA_VERSION,
      overrides: parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {},
    };
  } catch {
    return createDefaultStructure();
  }
}

/**
 * Saves user overrides to persistent storage.
 * @param {Object} overridesObj 
 * @returns {boolean} Success status
 */
export function saveOverrides(overridesObj) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const dataToSave = migrateOverrides(overridesObj);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch {
    return false;
  }
}

/**
 * Updates or sets a single attribute override for a player archetype and level.
 * @param {string} playerType Player archetype (e.g., 'Guard')
 * @param {number|string} level Level number (1-10)
 * @param {string} stat Stat key (e.g., 'sp')
 * @param {number} value Stat value
 * @returns {Object} Updated overrides object
 */
export function updateOverride(playerType, level, stat, value) {
  const data = loadOverrides();

  if (!playerType || level === undefined || level === null || !stat || typeof value !== 'number') {
    return data;
  }

  const pType = String(playerType);
  const lvlKey = String(level);
  const statKey = String(stat);

  if (!data.overrides[pType]) {
    data.overrides[pType] = {};
  }
  if (!data.overrides[pType][lvlKey]) {
    data.overrides[pType][lvlKey] = {};
  }

  data.overrides[pType][lvlKey][statKey] = value;
  saveOverrides(data);
  return data;
}

/**
 * Removes a specific attribute override.
 * @param {string} playerType 
 * @param {number|string} [level] 
 * @param {string} [stat] 
 * @returns {Object} Updated overrides object
 */
export function removeOverride(playerType, level, stat) {
  const data = loadOverrides();
  if (!playerType || !data.overrides[playerType]) {
    return data;
  }

  const pType = String(playerType);

  if (level === undefined || level === null) {
    delete data.overrides[pType];
  } else {
    const lvlKey = String(level);
    if (data.overrides[pType][lvlKey]) {
      if (stat === undefined || stat === null) {
        delete data.overrides[pType][lvlKey];
      } else {
        delete data.overrides[pType][lvlKey][String(stat)];
        if (Object.keys(data.overrides[pType][lvlKey]).length === 0) {
          delete data.overrides[pType][lvlKey];
        }
      }
    }
    if (Object.keys(data.overrides[pType]).length === 0) {
      delete data.overrides[pType];
    }
  }

  saveOverrides(data);
  return data;
}

/**
 * Clears all user attribute overrides.
 * @returns {boolean} Success status
 */
export function clearOverrides() {
  if (!isStorageAvailable()) {
    return false;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Exports stored overrides as a formatted JSON string.
 * @returns {string} JSON export
 */
export function exportOverrides() {
  const data = loadOverrides();
  return JSON.stringify(data, null, 2);
}

/**
 * Imports overrides from a JSON string safely with validation.
 * @param {string} jsonString 
 * @returns {boolean} Success status
 */
export function importOverrides(jsonString) {
  if (typeof jsonString !== 'string' || !jsonString.trim()) {
    return false;
  }

  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return false;
    }

    const migrated = migrateOverrides(parsed);
    return saveOverrides(migrated);
  } catch {
    return false;
  }
}
/**
 * engine-settings.js
 * ---------------------------------------------------------------------------
 * PHASE B — Persistence Layer (Engine Settings)
 * ---------------------------------------------------------------------------
 * Stores and manages engine user configuration and preferences.
 * Safely handles storage availability, defaults restoration, and validation.
 */

const STORAGE_KEY = 'score_match_engine_settings';

const DEFAULT_SETTINGS = Object.freeze({
  preferredFormation: '4-4-2',
  autoOptimize: true,
  showExplanations: true,
  simulationConfidence: true,
  theme: 'system',
});

/**
 * Checks if localStorage is available.
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
 * Validates and merges settings with defaults.
 * @param {Object} raw 
 * @returns {Object} Validated settings object
 */
function sanitizeSettings(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    preferredFormation: typeof raw.preferredFormation === 'string' ? raw.preferredFormation : DEFAULT_SETTINGS.preferredFormation,
    autoOptimize: typeof raw.autoOptimize === 'boolean' ? raw.autoOptimize : DEFAULT_SETTINGS.autoOptimize,
    showExplanations: typeof raw.showExplanations === 'boolean' ? raw.showExplanations : DEFAULT_SETTINGS.showExplanations,
    simulationConfidence: typeof raw.simulationConfidence === 'boolean' ? raw.simulationConfidence : DEFAULT_SETTINGS.simulationConfidence,
    theme: typeof raw.theme === 'string' ? raw.theme : DEFAULT_SETTINGS.theme,
  };
}

/**
 * Loads current engine settings.
 * @returns {Object} Current settings or defaults if missing/corrupted
 */
export function loadSettings() {
  if (!isStorageAvailable()) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(raw);
    return sanitizeSettings(parsed);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Saves settings to persistent storage.
 * @param {Object} settingsObj 
 * @returns {boolean} Success status
 */
export function saveSettings(settingsObj) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const sanitized = sanitizeSettings(settingsObj);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return true;
  } catch {
    return false;
  }
}

/**
 * Updates a single setting key with a new value.
 * @param {string} key Setting name
 * @param {any} value Setting value
 * @returns {Object} Updated settings object
 */
export function updateSetting(key, value) {
  const current = loadSettings();
  if (!key || !(key in DEFAULT_SETTINGS)) {
    return current;
  }

  const updated = {
    ...current,
    [key]: value,
  };

  const sanitized = sanitizeSettings(updated);
  saveSettings(sanitized);
  return sanitized;
}

/**
 * Resets settings to system default values.
 * @returns {Object} Default settings object
 */
export function resetSettings() {
  const defaults = { ...DEFAULT_SETTINGS };
  saveSettings(defaults);
  return defaults;
}

/**
 * Exports current settings as a JSON string.
 * @returns {string} JSON export string
 */
export function exportSettings() {
  const settings = loadSettings();
  return JSON.stringify(settings, null, 2);
}

/**
 * Imports settings from a JSON string safely with validation.
 * @param {string} jsonString 
 * @returns {boolean} Success status
 */
export function importSettings(jsonString) {
  if (typeof jsonString !== 'string' || !jsonString.trim()) {
    return false;
  }

  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return false;
    }

    const sanitized = sanitizeSettings(parsed);
    return saveSettings(sanitized);
  } catch {
    return false;
  }
}
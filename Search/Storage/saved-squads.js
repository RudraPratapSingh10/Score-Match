/**
 * saved-squads.js
 * ---------------------------------------------------------------------------
 * PHASE B — Persistence Layer (Saved Squads)
 * ---------------------------------------------------------------------------
 * Stores and manages user optimized squad configurations.
 * Safely handles storage availability, unique ID generation, and corrupted JSON.
 */

const STORAGE_KEY = 'score_match_saved_squads';

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
 * Generates a unique string ID.
 * @returns {string} Unique ID
 */
function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `sqd_${timestamp}_${randomStr}`;
}

/**
 * Sanitizes and validates squad object structure.
 * @param {Object} rawSquad 
 * @returns {Object|null} Valid squad object or null
 */
function sanitizeSquad(rawSquad) {
  if (!rawSquad || typeof rawSquad !== 'object' || Array.isArray(rawSquad)) {
    return null;
  }

  return {
    id: rawSquad.id ? String(rawSquad.id) : generateUniqueId(),
    name: rawSquad.name ? String(rawSquad.name) : 'Untitled Squad',
    formation: rawSquad.formation ? String(rawSquad.formation) : '4-4-2',
    players: Array.isArray(rawSquad.players) ? rawSquad.players : [],
    createdAt: rawSquad.createdAt || new Date().toISOString(),
  };
}

/**
 * Loads all saved squads.
 * @returns {Array<Object>} Array of saved squads (returns [] if none exist or error)
 */
export function loadSquads() {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    const squadList = Array.isArray(parsed) ? parsed : (parsed?.squads || []);

    if (!Array.isArray(squadList)) {
      return [];
    }

    return squadList
      .map(sanitizeSquad)
      .filter((sq) => sq !== null);
  } catch {
    return [];
  }
}

/**
 * Saves all squads array internally to storage.
 * @param {Array<Object>} squadsArray 
 * @returns {boolean} Success status
 */
function persistSquadsList(squadsArray) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const validSquads = squadsArray.map(sanitizeSquad).filter((sq) => sq !== null);
    const payload = { squads: validSquads };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates and saves a new squad. Auto-generates ID if missing.
 * @param {Object} squadData 
 * @returns {Object|null} Saved squad object or null on failure
 */
export function saveSquad(squadData) {
  const sanitized = sanitizeSquad(squadData);
  if (!sanitized) {
    return null;
  }

  const squads = loadSquads();
  squads.push(sanitized);

  const success = persistSquadsList(squads);
  return success ? sanitized : null;
}

/**
 * Updates an existing squad by ID.
 * @param {string} squadId 
 * @param {Object} updatedFields 
 * @returns {Object|null} Updated squad object or null if not found/failed
 */
export function updateSquad(squadId, updatedFields) {
  if (!squadId || !updatedFields || typeof updatedFields !== 'object') {
    return null;
  }

  const squads = loadSquads();
  const index = squads.findIndex((sq) => sq.id === String(squadId));

  if (index === -1) {
    return null;
  }

  const existing = squads[index];
  const updated = sanitizeSquad({
    ...existing,
    ...updatedFields,
    id: existing.id, // ID remains immutable
    createdAt: existing.createdAt,
  });

  if (!updated) {
    return null;
  }

  squads[index] = updated;
  const success = persistSquadsList(squads);
  return success ? updated : null;
}

/**
 * Deletes a saved squad by ID.
 * @param {string} squadId 
 * @returns {boolean} True if deleted, false if not found/failed
 */
export function deleteSquad(squadId) {
  if (!squadId) {
    return false;
  }

  const squads = loadSquads();
  const initialLength = squads.length;
  const filtered = squads.filter((sq) => sq.id !== String(squadId));

  if (filtered.length === initialLength) {
    return false;
  }

  return persistSquadsList(filtered);
}

/**
 * Deletes all saved squads.
 * @returns {boolean} Success status
 */
export function clearSquads() {
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
 * Exports all saved squads to a JSON string.
 * @returns {string} Formatted JSON string
 */
export function exportSquads() {
  const squads = loadSquads();
  return JSON.stringify({ squads }, null, 2);
}

/**
 * Imports saved squads from a JSON string safely with structure validation.
 * @param {string} jsonString 
 * @returns {boolean} Success status
 */
export function importSquads(jsonString) {
  if (typeof jsonString !== 'string' || !jsonString.trim()) {
    return false;
  }

  try {
    const parsed = JSON.parse(jsonString);
    const squadList = Array.isArray(parsed) ? parsed : (parsed?.squads || []);

    if (!Array.isArray(squadList)) {
      return false;
    }

    const sanitizedList = squadList
      .map(sanitizeSquad)
      .filter((sq) => sq !== null);

    return persistSquadsList(sanitizedList);
  } catch {
    return false;
  }
}
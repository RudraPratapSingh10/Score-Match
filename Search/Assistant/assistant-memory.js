/**
 * assistant-memory.js
 * ---------------------------------------------------------------------------
 * Temporary in-memory session context storage for conversational tracking.
 */

const sessions = new Map();

/**
 * Initializes or resets a context session.
 * @param {string} sessionId 
 * @returns {Object} New session object
 */
export function createSession(sessionId = 'default-session') {
  const session = {
    sessionId,
    createdAt: Date.now(),
    context: {
      lastQuery: null,
      lastIntent: null,
      lastFormation: null,
      lastPosition: null,
      lastRecommendation: null,
      lastComparison: null
    }
  };
  sessions.set(sessionId, session);
  return session;
}

/**
 * Stores/updates conversation context for a given session.
 * @param {string} sessionId 
 * @param {Object} partialContext 
 */
export function storeContext(sessionId = 'default-session', partialContext = {}) {
  if (!sessions.has(sessionId)) {
    createSession(sessionId);
  }
  const session = sessions.get(sessionId);
  session.context = {
    ...session.context,
    ...partialContext
  };
}

/**
 * Retrieves full context for a given session.
 * @param {string} sessionId 
 * @returns {Object} Session context
 */
export function getContext(sessionId = 'default-session') {
  if (!sessions.has(sessionId)) {
    createSession(sessionId);
  }
  return sessions.get(sessionId).context;
}

/**
 * Clears stored context for a session.
 * @param {string} sessionId 
 */
export function clearContext(sessionId = 'default-session') {
  if (sessions.has(sessionId)) {
    sessions.delete(sessionId);
  }
}

/**
 * Gets the last processed query string.
 * @param {string} sessionId 
 * @returns {string|null}
 */
export function getLastQuery(sessionId = 'default-session') {
  return getContext(sessionId).lastQuery || null;
}

/**
 * Gets the last generated recommendation.
 * @param {string} sessionId 
 * @returns {Object|null}
 */
export function getLastRecommendation(sessionId = 'default-session') {
  return getContext(sessionId).lastRecommendation || null;
}
/**
 * conversation-engine.js
 * ---------------------------------------------------------------------------
 * Orchestrates natural language understanding, engine query routing, and chat building.
 */

import { parseQuery } from './query-parser.js';
import {
  generateRecommendationResponse,
  generateOptimizationResponse,
  generateComparisonResponse,
  generateChemistryResponse,
  generateSimulationResponse,
  generateGrowthPredictionResponse
} from './recommendation-chat.js';
import { getContext, storeContext } from './assistant-memory.js';

/**
 * Handles unrecognized user prompts gracefully.
 * @param {string} rawQuery 
 * @returns {string}
 */
export function handleUnknownIntent(rawQuery = '') {
  return `I couldn't quite understand "${rawQuery}". Try asking for a player recommendation (e.g., "Best CB for 4-4-2"), comparing players ("Compare Guard and Protector"), or optimizing a formation.`;
}

/**
 * Routes parsed intent to standard responses or underlying simulation logic.
 * @param {Object} parsed 
 * @param {Object} context 
 * @returns {string}
 */
export function routeIntent(parsed, context = {}) {
  const { intent, position, formation, behaviours, level } = parsed;

  switch (intent) {
    case 'best_position':
    case 'recommendation': {
      const pos = position || context.lastPosition || 'CB';
      const beh = behaviours[0] || 'Guard';
      return generateRecommendationResponse({
        behaviour: beh,
        position: pos,
        score: 92,
        reasoning: `High defensive discipline and physical stats make ${beh} excellent for ${pos}.`
      });
    }

    case 'compare_players': {
      const p1 = behaviours[0] || 'Guard';
      const p2 = behaviours[1] || 'Protector';
      return generateComparisonResponse({
        playerA: p1,
        playerB: p2,
        scoreA: 90,
        scoreB: 86,
        advantage: `${p1} has superior positioning and response time.`
      });
    }

    case 'optimize_squad': {
      const fmt = formation || context.lastFormation || '4-4-2';
      return generateOptimizationResponse({
        formation: fmt,
        overallScore: 91,
        assignments: [
          { behaviour: 'Guard', position: 'CB' },
          { behaviour: 'Speedster', position: 'ST' }
        ]
      });
    }

    case 'chemistry_analysis': {
      return generateChemistryResponse({
        chemistryScore: 88,
        keySynergies: ['Guard + Commander anchor'],
        bottlenecks: ['Lack of wide playmaking']
      });
    }

    case 'growth_prediction': {
      const beh = behaviours[0] || 'Guard';
      const lvl = level || 10;
      return generateGrowthPredictionResponse({
        behaviour: beh,
        targetLevel: lvl,
        keyStatGains: { Strength: 8, Response: 6 }
      });
    }

    case 'simulation': {
      return generateSimulationResponse({
        winProbability: 72,
        summary: 'Solid defensive structure prevents high-risk counter-attacks.'
      });
    }

    default:
      return handleUnknownIntent(parsed.rawQuery);
  }
}

/**
 * Builds the complete response object.
 * @param {string} intent 
 * @param {string} textResponse 
 * @returns {Object}
 */
export function buildResponse(intent, textResponse) {
  return {
    intent,
    response: textResponse,
    timestamp: Date.now()
  };
}

/**
 * Main entrance to process raw user queries end-to-end.
 * @param {string} query 
 * @param {string} sessionId 
 * @returns {Object} Structured engine reply
 */
export function processQuery(query, sessionId = 'default-session') {
  const context = getContext(sessionId);
  const parsed = parseQuery(query);

  const textResponse = routeIntent(parsed, context);

  // Update memory context
  storeContext(sessionId, {
    lastQuery: query,
    lastIntent: parsed.intent,
    lastFormation: parsed.formation || context.lastFormation,
    lastPosition: parsed.position || context.lastPosition
  });

  return buildResponse(parsed.intent, textResponse);
}
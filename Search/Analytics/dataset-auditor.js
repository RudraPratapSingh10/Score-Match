/**
 * dataset-auditor.js
 * ---------------------------------------------------------------------------
 * Audits source datasets for missing stats, invalid provenance, or estimated data ratio.
 */

const KNOWN_BEHAVIOURS = new Set([
  'Guard', 'Engine', 'Commander', 'Producer', 'Prowler', 'Speedster',
  'Intruder', 'Hammer', 'Architect', 'Voyager', 'Protector', 'Stopper',
  'Sweeper', 'Menace', 'Infiltrator', 'Hero', 'Poacher', 'Marksman'
]);

/**
 * Audits a behaviour dataset.
 * @param {Object|Array} behaviourData
 * @returns {Object} Audit results
 */
export function auditBehaviourData(behaviourData) {
  const warnings = [];
  let totalEntries = 0;
  let estimatedEntries = 0;
  let missingStats = 0;

  const entries = Array.isArray(behaviourData)
    ? behaviourData
    : (behaviourData && typeof behaviourData === 'object' ? Object.values(behaviourData) : []);

  for (const item of entries) {
    if (!item || typeof item !== 'object') {
      warnings.push('Encountered null or invalid behaviour entry');
      continue;
    }

    totalEntries++;

    const name = item.type || item.name || item.behaviour;
    if (name && !KNOWN_BEHAVIOURS.has(name)) {
      warnings.push(`Unknown behaviour type: ${name}`);
    }

    if (!item.stats || typeof item.stats !== 'object') {
      missingStats++;
      warnings.push(`Missing stats for behaviour: ${name || 'unnamed'}`);
    }

    if (item.isEstimated || item.provenance === 'ESTIMATED') {
      estimatedEntries++;
    }

    if (typeof item.level === 'number' && (item.level < 1 || item.level > 10)) {
      warnings.push(`Invalid level for behaviour ${name}: ${item.level}`);
    }
  }

  return {
    totalEntries,
    missingStats,
    estimatedEntries,
    warnings
  };
}

/**
 * Audits formation definitions.
 * @param {Object|Array} formationData
 * @returns {Object} Audit results
 */
export function auditFormationData(formationData) {
  const warnings = [];
  let totalFormations = 0;

  const entries = Array.isArray(formationData)
    ? formationData
    : (formationData && typeof formationData === 'object' ? Object.entries(formationData) : []);

  for (const entry of entries) {
    totalFormations++;
    const key = Array.isArray(entry) ? entry[0] : (entry.name || entry.id);
    const val = Array.isArray(entry) ? entry[1] : entry;

    if (!val || (typeof val !== 'object' && !Array.isArray(val))) {
      warnings.push(`Missing definition for formation: ${key}`);
    }
  }

  return {
    totalFormations,
    warnings
  };
}

/**
 * Audits position weight configurations.
 * @param {Object} positionWeights
 * @returns {Object} Audit results
 */
export function auditPositionWeights(positionWeights) {
  const warnings = [];
  let validPositions = 0;

  if (!positionWeights || typeof positionWeights !== 'object') {
    return { validPositions: 0, warnings };
  }

  for (const [pos, weights] of Object.entries(positionWeights)) {
    validPositions++;
    if (!weights || typeof weights !== 'object') {
      warnings.push(`Missing weights for position: ${pos}`);
    }
  }

  return {
    validPositions,
    warnings
  };
}

/**
 * Performs a holistic audit on the entire dataset object.
 * @param {Object} dataset
 * @returns {Object} Audit summary
 */
export function auditEntireDataset(dataset) {
  if (!dataset || typeof dataset !== 'object') {
    return {
      valid: false,
      estimatedCellCount: 0,
      estimatedRatio: 0,
      missingCells: 0,
      warnings: ['Dataset is missing or not an object']
    };
  }

  const bAudit = auditBehaviourData(dataset.behaviours || dataset.players);
  const fAudit = auditFormationData(dataset.formations);
  const pAudit = auditPositionWeights(dataset.positionWeights);

  const allWarnings = [
    ...bAudit.warnings,
    ...fAudit.warnings,
    ...pAudit.warnings
  ];

  const estimatedCellCount = bAudit.estimatedEntries;
  const total = bAudit.totalEntries;
  const estimatedRatio = total > 0 ? Number((estimatedCellCount / total).toFixed(2)) : 0;

  return {
    valid: allWarnings.length === 0,
    estimatedCellCount,
    estimatedRatio,
    missingCells: bAudit.missingStats,
    warnings: allWarnings
  };
}

/**
 * Alias report generator function for Dataset Auditor.
 * @param {Object} dataset
 * @returns {Object} Audit Report
 */
export function generateAuditReport(dataset) {
  return auditEntireDataset(dataset);
}
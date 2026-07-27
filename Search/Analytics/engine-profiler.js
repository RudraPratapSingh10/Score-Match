/**
 * engine-profiler.js
 * ---------------------------------------------------------------------------
 * High-precision benchmarking and execution profiler for engine pipelines.
 */

/**
 * Starts a profiling timer with a label.
 * @param {string} label
 * @returns {Object} Profile handle
 */
export function startProfile(label = 'default') {
  return {
    label: String(label),
    startTime: performance.now()
  };
}

/**
 * Ends a profiling timer and returns duration in ms.
 * @param {Object} profile
 * @returns {number} Duration in ms
 */
export function endProfile(profile) {
  if (!profile || typeof profile.startTime !== 'number') {
    return 0;
  }
  const endTime = performance.now();
  return Math.max(0, endTime - profile.startTime);
}

/**
 * Profiles a single function call.
 * @param {Function} fn
 * @returns {Object} Result and duration in ms
 */
export function profileFunction(fn) {
  if (typeof fn !== 'function') {
    return { result: null, durationMs: 0 };
  }
  const handle = startProfile('fn');
  let result = null;
  try {
    result = fn();
  } catch (err) {
    result = { error: err.message };
  }
  const durationMs = endProfile(handle);
  return { result, durationMs };
}

/**
 * Alias for pipeline execution profiling.
 * @param {Function} fn
 * @returns {Object} Result and duration in ms
 */
export function profilePipeline(fn) {
  return profileFunction(fn);
}

/**
 * Calculates average execution time from sample durations.
 * @param {Array<number>} samples
 * @returns {number} Average in ms
 */
export function calculateAverageExecutionTime(samples) {
  if (!Array.isArray(samples) || samples.length === 0) return 0;
  const validSamples = samples.filter(s => typeof s === 'number' && !isNaN(s));
  if (validSamples.length === 0) return 0;
  const sum = validSamples.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / validSamples.length).toFixed(2));
}

/**
 * Generates a full performance summary report from a set of duration samples.
 * @param {Array<number>} samples
 * @returns {Object} Performance report
 */
export function generatePerformanceReport(samples) {
  if (!Array.isArray(samples) || samples.length === 0) {
    return {
      averageMs: 0,
      fastestMs: 0,
      slowestMs: 0,
      samples: 0
    };
  }

  const validSamples = samples.filter(s => typeof s === 'number' && !isNaN(s));
  if (validSamples.length === 0) {
    return {
      averageMs: 0,
      fastestMs: 0,
      slowestMs: 0,
      samples: 0
    };
  }

  const averageMs = calculateAverageExecutionTime(validSamples);
  const fastestMs = Number(Math.min(...validSamples).toFixed(2));
  const slowestMs = Number(Math.max(...validSamples).toFixed(2));

  return {
    averageMs,
    fastestMs,
    slowestMs,
    samples: validSamples.length
  };
}
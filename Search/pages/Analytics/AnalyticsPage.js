import React, { useState, useEffect } from 'react';
import { fetchAnalyticsData } from '../../services/engine-api-adapter.js';
import { Card } from '../../components/Common/Card.jsx';

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(fetchAnalyticsData());
  }, []);

  if (!analytics) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1>Engine Analytics & Validation Layer</h1>

      <div className="grid-cols-2">
        <Card title="Profiler Metrics">
          <p>Average Execution: <strong>{analytics.performance.averageMs} ms</strong></p>
          <p>Fastest Execution: <strong>{analytics.performance.fastestMs} ms</strong></p>
          <p>Slowest Execution: <strong>{analytics.performance.slowestMs} ms</strong></p>
          <p>Sample Size: <strong>{analytics.performance.samples} runs</strong></p>
        </Card>

        <Card title="Dataset Validation Report">
          <p>Status: <strong style={{ color: analytics.validation.valid ? 'var(--primary)' : 'var(--danger)' }}>
            {analytics.validation.valid ? 'VALID' : 'INVALID'}
          </strong></p>
          <p>Errors Detected: <strong>{analytics.validation.errors.length}</strong></p>
        </Card>
      </div>
    </div>
  );
}
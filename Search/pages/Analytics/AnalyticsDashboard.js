import React from 'react';
import PerformanceMetrics from './PerformanceMetrics';
import RecommendationMetrics from './RecommendationMetrics';
import ValidationReport from './ValidationReport';

export default function AnalyticsDashboard({
  overview = {
    accuracyScore: 94.2,
    tacticalEfficiency: 88.5,
    recommendationsApplied: 142,
    validationStatus: 'Passed'
  }
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100">Tactical Analytics & Validation Hub</h2>
          <p className="text-xs text-slate-400">Real-time model evaluation, system performance, and decision confidence</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            Model Status: {overview.validationStatus}
          </span>
          <span className="text-[10px] font-mono px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg font-bold">
            Accuracy: {overview.accuracyScore}%
          </span>
        </div>
      </div>

      {/* Grid Layout for Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceMetrics />
        <RecommendationMetrics />
      </div>

      {/* Validation Report Full Width */}
      <ValidationReport />
    </div>
  );
}
import React, { useState } from 'react';

export default function GrowthChart({
  playerName = "Vini Jr.",
  projections = [
    { season: '2024/25', age: 24, rating: 89, potential: 90 },
    { season: '2025/26', age: 25, rating: 91, potential: 92 },
    { season: '2026/27', age: 26, rating: 93, potential: 94 },
    { season: '2027/28', age: 27, rating: 94, potential: 95 },
    { season: '2028/29', age: 28, rating: 94, potential: 95 },
  ],
  height = 220
}) {
  const [activePoint, setActivePoint] = useState(null);

  if (!projections || projections.length === 0) return null;

  const padding = 40;
  const chartWidth = 520;
  const chartHeight = height;

  const ratings = projections.map(p => p.rating);
  const minRating = Math.max(50, Math.min(...ratings) - 4);
  const maxRating = Math.min(99, Math.max(...ratings) + 4);

  const points = projections.map((p, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (projections.length - 1);
    const y = chartHeight - padding - ((p.rating - minRating) / (maxRating - minRating || 1)) * (chartHeight - padding * 2);
    return { x, y, ...p };
  });

  const lineD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${lineD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100">{playerName} — Projected Rating Curve</h3>
          <p className="text-xs text-slate-400">5-Season Machine Learning Development Trajectory</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Projected Rating
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const yPos = padding + ratio * (chartHeight - padding * 2);
            return (
              <line
                key={idx}
                x1={padding}
                y1={yPos}
                x2={chartWidth - padding}
                y2={yPos}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#growthAreaGradient)" />

          {/* Main Growth Curve */}
          <path
            d={lineD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activePoint?.season === pt.season ? "7" : "5"}
                className="fill-slate-900 stroke-emerald-400 transition-all duration-200"
                strokeWidth="3"
                onMouseEnter={() => setActivePoint(pt)}
                onMouseLeave={() => setActivePoint(null)}
              />
              <text
                x={pt.x}
                y={chartHeight - 12}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-mono font-semibold"
              >
                {pt.season}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {activePoint && (
          <div
            className="absolute px-3 py-1.5 bg-slate-800 text-slate-100 text-xs rounded-xl border border-slate-700 shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-12 transition-all"
            style={{
              left: `${(activePoint.x / chartWidth) * 100}%`,
              top: `${(activePoint.y / chartHeight) * 100}%`,
            }}
          >
            <div className="font-bold text-emerald-400">{activePoint.season} (Age {activePoint.age})</div>
            <div className="text-[11px] text-slate-300">
              Rating: <strong className="text-amber-400">{activePoint.rating}</strong> | Potential: <strong className="text-emerald-400">{activePoint.potential}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
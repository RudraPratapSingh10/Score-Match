import React, { useState } from 'react';

export default function LineChart({ 
  data = [
    { label: 'Jan', value: 78 },
    { label: 'Feb', value: 80 },
    { label: 'Mar', value: 81 },
    { label: 'Apr', value: 85 },
    { label: 'May', value: 84 },
    { label: 'Jun', value: 89 },
  ],
  title = "Performance Trajectory",
  metricName = "Rating",
  height = 220
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) return null;

  const padding = 35;
  const chartWidth = 500;
  const chartHeight = height;

  const values = data.map(d => d.value);
  const minVal = Math.max(0, Math.min(...values) - 5);
  const maxVal = Math.min(100, Math.max(...values) + 5);

  const points = data.map((d, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (data.length - 1);
    const y = chartHeight - padding - ((d.value - minVal) / (maxVal - minVal || 1)) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          <p className="text-xs text-slate-400">Progression over recent matches / time</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-emerald-400 font-medium">{metricName}</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
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

          {/* Gradient Fill Area */}
          <path d={areaD} fill="url(#lineGradient)" />

          {/* Smooth Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Nodes */}
          {points.map((pt, i) => (
            <g key={i} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.label === pt.label ? "7" : "4.5"}
                className="fill-slate-900 stroke-emerald-400 transition-all duration-200"
                strokeWidth="2.5"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={pt.x}
                y={chartHeight - 10}
                textAnchor="middle"
                className="fill-slate-400 text-[11px] font-medium"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute px-3 py-1.5 bg-slate-800 text-slate-100 text-xs rounded-lg border border-slate-700 shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-12 transition-all"
            style={{
              left: `${(hoveredPoint.x / chartWidth) * 100}%`,
              top: `${(hoveredPoint.y / chartHeight) * 100}%`,
            }}
          >
            <div className="font-semibold text-emerald-400">{hoveredPoint.label}</div>
            <div className="text-[11px]">{metricName}: <span className="font-bold">{hoveredPoint.value}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
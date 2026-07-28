import React from 'react';

export default function RadarChart({
  stats = {
    Pace: 88,
    Shooting: 84,
    Passing: 82,
    Dribbling: 89,
    Defending: 45,
    Physical: 76
  },
  size = 280,
  label = "Attribute Profile"
}) {
  const categories = Object.keys(stats);
  const totalAxes = categories.length;
  const center = size / 2;
  const radius = center - 45;

  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon coordinates for player's current stats
  const points = categories.map((cat, i) => {
    const { x, y } = getCoordinates(i, stats[cat]);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
        <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
          6-Point Polygon
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Web Grid Circles (20%, 40%, 60%, 80%, 100%) */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale, level) => {
            const gridPoints = categories.map((_, i) => {
              const { x, y } = getCoordinates(i, scale * 100);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={level}
                points={gridPoints}
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray={scale === 1 ? "none" : "2 2"}
              />
            );
          })}

          {/* Spoke Lines */}
          {categories.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}

          {/* Stats Overlay Area */}
          <polygon
            points={points}
            fill="url(#radarFill)"
            stroke="#10b981"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Attribute Data Points & Labels */}
          {categories.map((cat, i) => {
            const val = stats[cat];
            const point = getCoordinates(i, val);
            const labelPoint = getCoordinates(i, 118);

            return (
              <g key={cat}>
                {/* Vertex Point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  className="fill-amber-400 stroke-slate-900"
                  strokeWidth="2"
                />

                {/* Stat Category Label */}
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-300 text-[11px] font-semibold tracking-wide"
                >
                  {cat}
                </text>

                {/* Numeric Value Label */}
                <text
                  x={labelPoint.x}
                  y={labelPoint.y + 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-emerald-400 text-[10px] font-bold"
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
import React from 'react';

export default function GrowthTable({
  tableData = [
    { season: '2024/25', age: 24, overall: 89, pace: 97, shooting: 84, passing: 81, dribbling: 92, stamina: 88, delta: '+2' },
    { season: '2025/26', age: 25, overall: 91, pace: 98, shooting: 86, passing: 83, dribbling: 94, stamina: 89, delta: '+2' },
    { season: '2026/27', age: 26, overall: 93, pace: 98, shooting: 88, passing: 86, dribbling: 95, stamina: 90, delta: '+2' },
    { season: '2027/28', age: 27, overall: 94, pace: 97, shooting: 89, passing: 87, dribbling: 95, stamina: 89, delta: '+1' },
    { season: '2028/29', age: 28, overall: 94, pace: 96, shooting: 89, passing: 88, dribbling: 94, stamina: 88, delta: '0' },
  ]
}) {
  return (
    <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-3 overflow-hidden">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detailed Progression Metrics</h3>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Stat Breakdowns
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800/80 text-[10px] uppercase">
              <th className="py-2.5 px-3">Season</th>
              <th className="py-2.5 px-2">Age</th>
              <th className="py-2.5 px-2 text-emerald-400">OVR</th>
              <th className="py-2.5 px-2">PAC</th>
              <th className="py-2.5 px-2">SHO</th>
              <th className="py-2.5 px-2">PAS</th>
              <th className="py-2.5 px-2">DRI</th>
              <th className="py-2.5 px-2">STM</th>
              <th className="py-2.5 px-3 text-right">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-200">{row.season}</td>
                <td className="py-2.5 px-2 text-slate-400">{row.age} yr</td>
                <td className="py-2.5 px-2 font-black text-amber-400">{row.overall}</td>
                <td className="py-2.5 px-2">{row.pace}</td>
                <td className="py-2.5 px-2">{row.shooting}</td>
                <td className="py-2.5 px-2">{row.passing}</td>
                <td className="py-2.5 px-2">{row.dribbling}</td>
                <td className="py-2.5 px-2">{row.stamina}</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
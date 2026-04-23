import React from 'react';

interface Props {
  sites: string[];
  selected: number;
  onSelect: (i: number) => void;
  windSpeeds: number[];
}

export default function SiteSelector({ sites, selected, onSelect, windSpeeds }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {sites.map((site, i) => {
        const w = windSpeeds[i];
        const status = w > 18 ? 'ALERT' : w < 6 ? 'LOW' : 'NORMAL';
        const statusColor = status === 'ALERT' ? 'text-red-400' : status === 'LOW' ? 'text-yellow-400' : 'text-green-400';
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`rounded-xl border p-4 text-left transition-all ${
              selected === i
                ? 'border-sky-500 bg-sky-900/30'
                : 'border-slate-700 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-200">{site}</span>
              <span className={`text-xs font-bold ${statusColor}`}>● {status}</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Wind: <span className="text-sky-400 font-semibold">{w} m/s</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Click to view details</div>
          </button>
        );
      })}
    </div>
  );
}
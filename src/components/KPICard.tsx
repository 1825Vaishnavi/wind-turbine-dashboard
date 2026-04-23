import React from 'react';

interface Props {
  label: string;
  value: string;
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'teal';
  icon: string;
  sub: string;
}

const colorMap = {
  green:  { card: 'bg-green-900/30 border-green-700',  text: 'text-green-400'  },
  red:    { card: 'bg-red-900/30 border-red-700',      text: 'text-red-400'    },
  yellow: { card: 'bg-yellow-900/30 border-yellow-700', text: 'text-yellow-400' },
  blue:   { card: 'bg-blue-900/30 border-blue-700',    text: 'text-blue-400'   },
  purple: { card: 'bg-purple-900/30 border-purple-700', text: 'text-purple-400' },
  teal:   { card: 'bg-teal-900/30 border-teal-700',    text: 'text-teal-400'   },
};

export default function KPICard({ label, value, color, icon, sub }: Props) {
  const c = colorMap[color];
  return (
    <div className={`rounded-xl border p-4 ${c.card}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      <div className="text-slate-500 text-xs mt-1">{sub}</div>
    </div>
  );
}
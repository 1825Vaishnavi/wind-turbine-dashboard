import React from 'react';
import { SensorReading } from '../App';

interface Props {
  readings: SensorReading[][];
  sites: string[];
}

export default function AlertPanel({ readings, sites }: Props) {
  const alerts: { site: string; msg: string; level: 'red' | 'yellow' }[] = [];

  readings.forEach((siteReadings, i) => {
    const current = siteReadings.at(-1)!;
    if (current.windSpeed > 18)
      alerts.push({ site: sites[i], msg: `High wind ${current.windSpeed} m/s`, level: 'red' });
    if (current.windSpeed < 6)
      alerts.push({ site: sites[i], msg: `Low wind ${current.windSpeed} m/s`, level: 'yellow' });
    if (current.temperature > 22)
      alerts.push({ site: sites[i], msg: `High temp ${current.temperature}°C`, level: 'red' });
    if (current.energyOutput < 25)
      alerts.push({ site: sites[i], msg: `Low output ${current.energyOutput} kWh`, level: 'yellow' });
  });

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 h-full">
      <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
        ⚠️ Alert Thresholds
      </h2>
      {alerts.length === 0 ? (
        <div className="text-green-400 text-sm mt-4 text-center">
          ✅ All sites operating normally
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`rounded-lg p-3 text-xs border ${
              a.level === 'red'
                ? 'bg-red-900/30 border-red-700 text-red-300'
                : 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
            }`}>
              <div className="font-semibold">{a.site.split(' - ')[0]}</div>
              <div>{a.msg}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 border-t border-slate-700 pt-3">
        <div className="text-xs text-slate-500 mb-2">Threshold config</div>
        <div className="text-xs text-slate-400 space-y-1">
          <div>🔴 Wind &gt; 18 m/s → High wind alert</div>
          <div>🟡 Wind &lt; 6 m/s → Below cut-in</div>
          <div>🔴 Temp &gt; 22°C → Overheat risk</div>
          <div>🟡 Output &lt; 25 kWh → Low generation</div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import KPICard from './components/KPICard';
import EnergyChart from './components/EnergyChart';
import AlertPanel from './components/AlertPanel';
import SiteSelector from './components/SiteSelector';

export const SITES = ['Site A - Boston', 'Site B - Worcester', 'Site C - Springfield'];

export interface SensorReading {
  timestamp: string;
  windSpeed: number;
  energyOutput: number;
  rpm: number;
  temperature: number;
}

function generateReading(): SensorReading {
  return {
    timestamp: new Date().toLocaleTimeString(),
    windSpeed: +(Math.random() * 15 + 5).toFixed(1),
    energyOutput: +(Math.random() * 80 + 20).toFixed(1),
    rpm: Math.floor(Math.random() * 20 + 10),
    temperature: +(Math.random() * 10 + 15).toFixed(1),
  };
}

export default function App() {
  const [selectedSite, setSelectedSite] = useState(0);
  const [readings, setReadings] = useState<SensorReading[][]>(
    [0, 1, 2].map(() => Array.from({ length: 20 }, generateReading))
  );
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setReadings(prev => prev.map(siteReadings => [
        ...siteReadings.slice(1),
        generateReading()
      ]));
      setLastUpdated(new Date());
    }, 2000);
    return () => clearInterval(interval);
  }, []);
useEffect(() => {
  const fetchFromAPI = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/readings');
      const data = await res.json();
      console.log('API connected:', data.total_readings_today, 'readings today');
    } catch (e) {
      console.log('Using simulated data');
    }
  };
  fetchFromAPI();
}, []);
useEffect(() => {
  const fetchAPI = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/readings');
      const data = await res.json();
      console.log('✅ API Connected:', data.total_readings_today, 'readings today');
    } catch (e) {
      console.log('⚠️ Using simulated data - API offline');
    }
  };
  fetchAPI();
}, []);

  const current = readings[selectedSite].at(-1)!;
  const allCurrentWinds = readings.map(r => r.at(-1)!.windSpeed);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sky-400">
              🌬️ Wind Turbine Operations Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time monitoring · 3 turbine sites · Anemometer sensor data
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div className="text-green-400 font-semibold text-sm">● LIVE</div>
            <div>Updated: {lastUpdated.toLocaleTimeString()}</div>
            <div>10K+ readings/day</div>
          </div>
        </div>

        {/* Site Selector */}
        <SiteSelector
          sites={SITES}
          selected={selectedSite}
          onSelect={setSelectedSite}
          windSpeeds={allCurrentWinds}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <KPICard label="Wind Speed" value={`${current.windSpeed} m/s`}
            color={current.windSpeed > 18 ? 'red' : current.windSpeed < 6 ? 'yellow' : 'green'}
            icon="💨" sub="Anemometer reading" />
          <KPICard label="Energy Output" value={`${current.energyOutput} kWh`}
            color="blue" icon="⚡" sub="Last 2 seconds" />
          <KPICard label="Turbine RPM" value={`${current.rpm} RPM`}
            color="purple" icon="🔄" sub="Rotor speed" />
          <KPICard label="Nacelle Temp" value={`${current.temperature}°C`}
            color={current.temperature > 22 ? 'red' : 'teal'} icon="🌡️" sub="Internal sensor" />
        </div>

        {/* Charts + Alerts */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <EnergyChart readings={readings[selectedSite]} siteName={SITES[selectedSite]} />
          </div>
          <div>
            <AlertPanel readings={readings} sites={SITES} />
          </div>
        </div>

      </div>
    </div>
  );
}
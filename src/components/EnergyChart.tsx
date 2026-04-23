import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { SensorReading } from '../App';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  readings: SensorReading[];
  siteName: string;
}

export default function EnergyChart({ readings, siteName }: Props) {
  const labels = readings.map(r => r.timestamp);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Energy Output (kWh)',
        data: readings.map(r => r.energyOutput),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56,189,248,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
      },
      {
        label: 'Wind Speed (m/s)',
        data: readings.map(r => r.windSpeed),
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.05)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: { duration: 300 },
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 11 } }
      },
      title: {
        display: true,
        text: `${siteName} — Live Energy Output & Wind Speed`,
        color: '#e2e8f0',
        font: { size: 13, weight: 'bold' as const },
      },
    },
    scales: {
      x: {
        ticks: { color: '#475569', font: { size: 9 }, maxTicksLimit: 6 },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#475569', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <Line data={data} options={options} />
    </div>
  );
}
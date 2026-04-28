// src/components/ScaleCard.tsx
import React from 'react';
import { formatNumber } from '../utils/formatters';
import { type TimeScale } from '../types/timeScales';

interface ScaleCardProps {
  scale: TimeScale;
  colorClass?: string;
}

export const ScaleCard: React.FC<ScaleCardProps> = ({ scale, colorClass = "bg-blue-500" }) => {
  // Determine the "next" unit label for the progress bar context
  // e.g., if scale is "Days", progress is "Days until next Week"
  const nextUnitMap: Record<string, string> = {
    seconds: 'Minute',
    minutes: 'Hour',
    hours: 'Day',
    days: 'Week',
    weeks: 'Month',
    months: 'Year',
    years: 'Decade',
    decades: 'Century',
    lunar: 'Next Lunar Cycle',
    solar: 'Next Solar Cycle',
    earth_orbits: 'Next Earth Orbit',
    galactic: 'Next Galactic Orbit',
  };

  const nextUnitLabel = nextUnitMap[scale.id] || 'Next Cycle';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-transparent hover:border-blue-500 transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {scale.label}
        </h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {scale.unit}
        </span>
      </div>

      <div className="mb-3">
        <span className="text-2xl font-bold text-gray-800 font-mono">
          {formatNumber(Number(scale.value), scale.id === 'distance' || scale.id === 'galactic' ? 2 : 2)}
        </span>
      </div>

      {/* Progress Bar Section */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress in {nextUnitLabel}</span>
          <span>{(scale.progress * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full ${colorClass} transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, scale.progress * 100))}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

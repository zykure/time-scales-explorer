import { DateTime, Interval } from 'luxon';
import type { TimeScale } from '../types/timeScales';
import { countDecades } from './decades';
//import { countEclipses } from './eclipses';
import { countLeapSeconds, countLeapYears } from './leap';
import { countLunarCycles } from './lunar';
import { countSolarCycles } from './solar';
import { countEarthOrbits } from './orbit';

const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;  // s
const SUN_SPEED_KM_PER_SEC = 220; // Approximate orbital speed around galactic center
const SUN_DISTANCE_PER_YEAR_KM = SUN_SPEED_KM_PER_SEC * SECONDS_PER_YEAR; // ~6.94 billion km
const GALACTIC_ORBIT_YEARS = 225_000_000;
const EARTH_ORBIT_CIRCUMFERENCE_KM = 940_000_000;

export const calculateTimeDiff = (startDate: Date | null, endDate: Date | null): {
  milliseconds: number;
  direction: 'past' | 'future';
  interval: Interval;
} => {
  const now = DateTime.now();
  const start = startDate === null ? now : DateTime.fromJSDate(startDate);
  const end = endDate === null ? now : DateTime.fromJSDate(endDate);
  const diffMs = end.toMillis() - start.toMillis();

  return {
    milliseconds: Math.abs(diffMs),
    direction: diffMs >= 0 ? 'past' : 'future',
    interval: diffMs >= 0
      ? Interval.fromDateTimes(start, end)
      : Interval.fromDateTimes(end, start),
  };
};

// Standard scales (keep simple division for small units)
export const calculateStandardScales = (milliseconds: number, start: DateTime, end: DateTime): TimeScale[] => {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30.44; // Average month
  const years = days / 365.25; // Accounting for leap years
  const decades = years / 10;
  const centuries = years / 100;
  const millenia = years / 1000;
  const fullDecades = countDecades(start, end);
  const fullCenturies = countDecades(start, end, 100);

  return [
    { id: 'seconds', label: 'Elapsed Seconds', value: Math.floor(seconds), unit: 's', isComplete: true, progress: 1 },
    { id: 'minutes', label: 'Elapsed Minutes', value: Math.floor(minutes), unit: 'min', isComplete: true, progress: 1 },
    { id: 'hours', label: 'Elapsed Hours', value: Math.floor(hours), unit: 'hr', isComplete: true, progress: 1 },
    { id: 'days', label: 'Elapsed Days', value: Math.floor(days), unit: 'd', isComplete: true, progress: 1 },
    { id: 'weeks', label: 'Elapsed Weeks', value: Math.floor(weeks), unit: 'wk', isComplete: true, progress: 1 },
    { id: 'months', label: 'Elapsed Months', value: Math.floor(months), unit: 'mo', isComplete: true, progress: 1 },
    { id: 'years', label: 'Elapsed Years', value: Math.floor(years), unit: 'yr', isComplete: true, progress: 1 },
    { id: 'decades', label: 'Elapsed Decades', value: Math.floor(decades), unit: 'dec', isComplete: true, progress: decades % 1 },
    { id: 'centuries', label: 'Elapsed Centuries', value: Math.floor(centuries), unit: 'cent', isComplete: true, progress: centuries % 1 },
    { id: 'millenia', label: 'Elapsed Millenia', value: Math.floor(millenia), unit: 'mil', isComplete: true, progress: millenia % 1 },
    { id: 'full_decades', label: 'Completed Decades', value: fullDecades.count, unit: 'dec', isComplete: true, progress: fullDecades.currentProgress },
    { id: 'full_centuries', label: 'Completed Centuries', value: fullCenturies.count, unit: 'cent', isComplete: true, progress: fullCenturies.currentProgress },
  ];
};

// Updated astronomical scales with boundary counting
export const calculateAstronomicalScales = (milliseconds: number, start: DateTime, end: DateTime): TimeScale[] => {
  const lunar = countLunarCycles(start, end);
  const solar = countSolarCycles(start, end);
  const earthOrbits = countEarthOrbits(start, end);
  const leapYears = countLeapYears(start, end);
  const leapSeconds = countLeapSeconds(start, end);
  //const eclipses = countEclipses(start, end);

  const diffMs = end.toMillis() - start.toMillis();
  const diffYears = diffMs / (365.25 * 24 * 60 * 60 * 1000);
  const absYears = Math.abs(diffYears);

  // 1. Earth around Sun
  const earthDistanceTraveledKm = absYears * EARTH_ORBIT_CIRCUMFERENCE_KM;

  // 2. Sun around Galactic Center
  const sunDistanceTraveledKm = absYears * SUN_DISTANCE_PER_YEAR_KM;
  const galacticOrbits = absYears / GALACTIC_ORBIT_YEARS;

  return [
    { id: 'leap_years', label: 'Encountered Leap Years', value: leapYears, unit: 'years', isComplete: true, progress: 1 },
    { id: 'leap_seconds', label: 'Encountered Leap Seconds', value: leapSeconds, unit: 'sec', isComplete: true, progress: 1 },
    { id: 'lunar_cycles', label: 'Completed Lunar Cycles', value: lunar.count, unit: 'cycles', isComplete: true, progress: lunar.currentPhase },
    { id: 'solar_cycles', label: 'Completed Solar Cycles', value: solar.count, unit: 'cycles', isComplete: true, progress: solar.currentProgress },
    { id: 'earth_orbits', label: 'Completed Earth Orbits', value: earthOrbits.count, unit: 'orbits', isComplete: true, progress: earthOrbits.currentProgress },
    { id: 'galactic_orbits', label: 'Completed Galactic Orbits', value: galacticOrbits, unit: 'orbits', isComplete: true, progress: galacticOrbits % 1 },
    //{ id: 'lunar_eclipses', label: 'Observed Lunar Eclipses', value: eclipses.lunar, unit: 'eclipses', isComplete: true, progress: 1 },
    //{ id: 'global_solar_eclipses', label: 'Observed Solar Eclipses', value: eclipses.solar, unit: 'eclipses', isComplete: true, progress: 1 },
    { id: 'earth_distance', label: 'Earth Distance Traveled', value: earthDistanceTraveledKm, unit: 'km', isComplete: true, progress: 1 },
    { id: 'sun_distance', label: 'Sun Distance Traveled', value: sunDistanceTraveledKm, unit: 'km', isComplete: true, progress: 1 },
  ];
};

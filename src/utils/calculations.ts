import { DateTime, Interval } from 'luxon';
import type { TimeScale } from '../types/timeScales';
import { countDecades } from './decades';
import { countEclipses } from './eclipses';
import { countLeapSeconds, countLeapYears } from './leap';
import { countLunarCycles, countSarosCycles } from './lunar';
import { countSeasons } from './seasons';
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
    { id: 'seconds', label: 'Elapsed Seconds', value: Math.floor(seconds), unit: 's', last: null },
    { id: 'minutes', label: 'Elapsed Minutes', value: Math.floor(minutes), unit: 'min', last: null },
    { id: 'hours', label: 'Elapsed Hours', value: Math.floor(hours), unit: 'hr', last: null },
    { id: 'days', label: 'Elapsed Days', value: Math.floor(days), unit: 'd', last: null },
    { id: 'weeks', label: 'Elapsed Weeks', value: Math.floor(weeks), unit: 'wk', last: null },
    { id: 'months', label: 'Elapsed Months', value: Math.floor(months), unit: 'mo', last: null },
    { id: 'years', label: 'Elapsed Years', value: Math.floor(years), unit: 'yr', last: null },
    { id: 'decades', label: 'Elapsed Decades', value: Math.floor(decades), unit: 'dec', last: null },
    { id: 'centuries', label: 'Elapsed Centuries', value: Math.floor(centuries), unit: 'cent', last: null },
    { id: 'millenia', label: 'Elapsed Millenia', value: Math.floor(millenia), unit: 'mil', last: null },
    { id: 'full_decades', label: 'Completed Decades', value: fullDecades.count, unit: 'dec', last: null },
    { id: 'full_centuries', label: 'Completed Centuries', value: fullCenturies.count, unit: 'cent', last: null },
  ];
};

// Updated astronomical scales with boundary counting
export const calculateAstronomicalScales = (milliseconds: number, start: DateTime, end: DateTime): TimeScale[] => {
  const lunar = countLunarCycles(start, end);
  const solar = countSolarCycles(start, end);
  const sarosCycles = countSarosCycles(start, end);
  const earthOrbits = countEarthOrbits(start, end);
  const leapYears = countLeapYears(start, end);
  const leapSeconds = countLeapSeconds(start, end);
  const eclipses = countEclipses(start, end);
  const seasons = countSeasons(start, end);

  const diffYears = milliseconds / (365.25 * 24 * 60 * 60 * 1000);
  const absYears = Math.abs(diffYears);

  // 1. Earth around Sun
  const earthDistanceTraveledKm = absYears * EARTH_ORBIT_CIRCUMFERENCE_KM;

  // 2. Sun around Galactic Center
  const sunDistanceTraveledKm = absYears * SUN_DISTANCE_PER_YEAR_KM;
  const galacticOrbits = absYears / GALACTIC_ORBIT_YEARS;

  return [
    { id: 'leap_years', label: 'Encountered Leap Years', value: leapYears.count, unit: 'years', last: leapYears.last },
    { id: 'leap_seconds', label: 'Encountered Leap Seconds', value: leapSeconds.count, unit: 'sec', last: leapSeconds.last },
    { id: 'lunar_eclipses', label: 'Observed Lunar Eclipses', value: eclipses.count.lunar, unit: '', last: eclipses.last.lunar },
    { id: 'global_solar_eclipses', label: 'Observed Solar Eclipses', value: eclipses.count.solar, unit: '', last: eclipses.last.solar },
    { id: 'spring_equinoxes', label: 'Observed Spring Equinoxes', value: seasons.count.spring, unit: '', last: seasons.last.spring },
    { id: 'summer_solstices', label: 'Observed Summer Solstices', value: seasons.count.summer, unit: '', last: seasons.last.summer },
    { id: 'autumn_equinoxes', label: 'Observed Autumn Equinoxes', value: seasons.count.autumn, unit: '', last: seasons.last.autumn },
    { id: 'winter_solstices', label: 'Observed Winter Solstices', value: seasons.count.winter, unit: '', last: seasons.last.winter },
    { id: 'lunar_cycles', label: 'Elapsed Lunar Cycles', value: lunar.count, unit: 'cycles', last: null },
    { id: 'solar_cycles', label: 'Elapsed Solar Cycles', value: solar.count, unit: 'cycles', last: null },
    { id: 'saros_cycles', label: 'Elapsed Saros Cycles', value: sarosCycles, unit: 'cycles', last: null },
    { id: 'earth_orbits', label: 'Elapsed Earth Orbits', value: earthOrbits.count, unit: 'orbits', last: null },
    { id: 'galactic_orbits', label: 'Elapsed Galactic Orbits', value: galacticOrbits, unit: 'orbits', last: null },
    { id: 'earth_distance', label: 'Earth Distance Traveled', value: earthDistanceTraveledKm, unit: 'km', last: null },
    { id: 'sun_distance', label: 'Sun Distance Traveled', value: sunDistanceTraveledKm, unit: 'km', last: null },
  ];
};

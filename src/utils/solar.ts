import { DateTime } from 'luxon';

const SIDEREAL_YEAR_MS = 365.25636 * 24 * 60 * 60 * 1000;
const SOLAR_CYCLE_YEARS = 11.0;

// Count actual solar cycles (sunspot cycle ~11 years)
export const countSolarCycles = (start: DateTime, end: DateTime): {
  count: number;
  currentProgress: number;
} => {
  const siderealYearMs = (end.toMillis() - start.toMillis()) / SIDEREAL_YEAR_MS;
  const count = siderealYearMs / SOLAR_CYCLE_YEARS;
  const currentProgress = (siderealYearMs % SOLAR_CYCLE_YEARS) / SOLAR_CYCLE_YEARS;

  return { count, currentProgress };
};

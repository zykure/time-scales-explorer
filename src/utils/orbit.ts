import { DateTime } from 'luxon';

const SIDEREAL_YEAR_MS = 365.25636 * 24 * 60 * 60 * 1000;

// Count Earth orbits (1 per year, accounting for leap years)
export const countEarthOrbits = (start: DateTime, end: DateTime): {
  count: number;
  currentProgress: number;
} => {
  const siderealYearMs = (end.toMillis() - start.toMillis()) / SIDEREAL_YEAR_MS;
  const count = siderealYearMs;
  const currentProgress = siderealYearMs % 1;

  return { count, currentProgress };
};

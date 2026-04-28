import { DateTime } from 'luxon';

// Known leap seconds inserted since 1972 (UTC)
// Format: [Year, Month, Day]
const KNOWN_LEAP_SECONDS = [
  [1972, 6, 30],
  [1972, 12, 31],
  [1973, 12, 31],
  [1974, 12, 31],
  [1975, 12, 31],
  [1976, 12, 31],
  [1977, 12, 31],
  [1978, 12, 31],
  [1979, 12, 31],
  [1981, 6, 30],
  [1982, 6, 30],
  [1983, 6, 30],
  [1985, 6, 30],
  [1987, 12, 31],
  [1989, 12, 31],
  [1990, 12, 31],
  [1992, 6, 30],
  [1993, 6, 30],
  [1994, 6, 30],
  [1995, 12, 31],
  [1997, 6, 30],
  [1998, 12, 31],
  [2005, 12, 31],
  [2008, 12, 31],
  [2012, 6, 30],
  [2015, 6, 30],
  [2016, 12, 31],
  // updated 2026-04-28
  // see e.g. https://en.wikipedia.org/wiki/Leap_second
];

export const countLeapYears = (start: DateTime, end: DateTime): number => {
  let count = 0;
  const minYear = Math.min(start.year, end.year);
  const maxYear = Math.max(start.year, end.year);

  for (let year = minYear; year <= maxYear; year++) {
    // Check if year is a leap year
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    if (isLeap) {
      // Check if Feb 29 of this year falls within the interval
      const feb29 = DateTime.fromObject({ year, month: 2, day: 29 }, { zone: 'utc' });

      // Ensure the date is valid (Luxon might create a valid date for non-leap years in some modes,
      // but fromObject with day 29 in non-leap year usually rolls over or errors depending on settings.
      // Safer to check if the month is actually February.
      if (feb29.month === 2 && feb29.day === 29) {
        if (feb29 > start && feb29 <= end) {
          count++;
        }
      }
    }
  }
  return count;
};

export const countLeapSeconds = (start: DateTime, end: DateTime): number => {
  let count = 0;
  const startMs = start.toMillis();
  const endMs = end.toMillis();

  for (const [year, month, day] of KNOWN_LEAP_SECONDS) {
    const leapDate = DateTime.fromObject({ year, month, day, hour: 23, minute: 59, second: 59 }, { zone: 'utc' });
    const leapMs = leapDate.toMillis();

    if (leapMs > startMs && leapMs <= endMs) {
      count++;
    }
  }
  return count;
};

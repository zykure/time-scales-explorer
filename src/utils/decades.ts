import { DateTime } from 'luxon';

// Count actual decade boundaries crossed
export const countDecades = (start: DateTime, end: DateTime, years: number = 10): {
  count: number;
  boundaries: DateTime[];
  currentProgress: number;
} => {
  const boundaries: DateTime[] = [];
  const startYear = start.year;
  const endYear = end.year;

  // Determine the direction of iteration
  const minYear = Math.min(startYear, endYear);
  const maxYear = Math.max(startYear, endYear);

  // Find decade boundaries (years divisible by 10)
  // Start from the first decade boundary >= minYear
  const firstDecade = Math.ceil(minYear / years) * years;

  for (let year = firstDecade; year <= maxYear; year += years) {
    // Only add boundaries that are strictly BETWEEN start and end
    // Or on the boundary itself if we want to count the start/end point
    const boundaryDate = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: 'utc' });

    // Check if this boundary is within the interval (exclusive of start, inclusive of end for counting)
    // Actually, for "how many decades passed", we count the boundaries crossed.
    // If start is 1995 and end is 2005, we cross 2000. Count = 1.
    // If start is 1990 and end is 2000, we cross 2000? Usually 1990-2000 is 1 decade.
    // Let's count boundaries strictly inside the interval (start, end]
    if (boundaryDate > start && boundaryDate <= end) {
      boundaries.push(boundaryDate);
    }
  }

  const count = boundaries.length > 0 ? boundaries.length - 1 : 0;

  // Calculate progress within the current decade
  // Find the most recent decade boundary <= end
  const currentDecadeStartYear = Math.floor(end.year / years) * years;
  const currentDecadeStart = DateTime.fromObject({ year: currentDecadeStartYear, month: 1, day: 1 }, { zone: 'utc' });
  const nextDecadeStart = currentDecadeStart.plus({ years: years });

  const totalDuration = nextDecadeStart.toMillis() - currentDecadeStart.toMillis();
  const elapsedDuration = end.toMillis() - currentDecadeStart.toMillis();

  // Safety check for NaN
  let progress = 0;
  if (totalDuration > 0 && !isNaN(elapsedDuration)) {
    progress = Math.max(0, Math.min(1, elapsedDuration / totalDuration));
  }

  return { count, boundaries, currentProgress: progress };
};

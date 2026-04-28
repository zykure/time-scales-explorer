import { DateTime } from 'luxon';
import { SearchGlobalSolarEclipse, NextGlobalSolarEclipse, SearchLunarEclipse, NextLunarEclipse, type AstroTime } from 'astronomy-engine';

// Helper to convert Astronomy Engine Date back to Luxon
const fromAstroDate = (jd: AstroTime): DateTime => { return DateTime.fromJSDate(jd.date); };

export const countEclipses = (start: DateTime, end: DateTime): {
  solar: number;
  lunar: number;
} => {
  const startDate: Date = start.toJSDate();
  const endDate: Date = end.toJSDate();
  const results = { solar: 0, lunar: 0 };

  let nextSolar = SearchGlobalSolarEclipse(startDate);
  while (true) {
    const solarDate = fromAstroDate(nextSolar.peak);
    if (solarDate > end)
      break;

    results.solar++;
    nextSolar = NextGlobalSolarEclipse(nextSolar.peak);
  }

  let nextLunar = SearchLunarEclipse(startDate);
  while (true) {
    const lunarDate = fromAstroDate(nextLunar.peak);
    if (lunarDate > end)
      break;

    results.lunar++;
    nextLunar = NextLunarEclipse(nextLunar.peak);
  }

  return results;
};

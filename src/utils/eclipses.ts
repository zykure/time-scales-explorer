import { DateTime } from 'luxon';
import { MakeTime, SearchGlobalSolarEclipse, SearchLunarEclipse, type AstroTime } from 'astronomy-engine';

// Helper to convert Luxon DateTime to Astronomy Engine Date
const toAstroDate = (dt: DateTime): AstroTime => MakeTime(dt.toJSDate()); // Days since J2000

// Helper to convert Astronomy Engine Date back to Luxon
const fromAstroDate = (jd: AstroTime): DateTime => { return DateTime.fromJSDate(jd.date); };

export class CalculateEclipses {
  fromDate: DateTime | null = null;
  toDate: DateTime | null = null;
  solarEclipses: Array<DateTime>;
  lunarEclipses: Array<DateTime>;

  countSolarEclipses(start: DateTime, end: DateTime): number {
    this.scanTimeInterval(start, end);

    let count = 0;
    for (const [solarDate] of this.solarEclipses) {
      if (solarDate >= start && solarDate <= end)
        count++;
    }
    return count;
  }

  countLunearEclipses(start: DateTime, end: DateTime): number {
    this.scanTimeInterval(start, end);

    let count = 0;
    for (const [lunarDate] of this.lunarEclipses) {
      if (lunarDate >= start && lunarDate <= end)
        count++;
    }
    return count;
  }

  scanTimeInterval(start: DateTime, end: DateTime) {
    if (start >= this.fromDate && end <= this.toDate)
      return;

    const startDate = toAstroDate(start);
    const endDate = toAstroDate(end);

    let searchTime = startDate;

    while (searchTime < endDate) {
      // Find next Solar
      const nextSolar = SearchGlobalSolarEclipse(searchTime);
      if (!nextSolar) break;

      const solarDate = fromAstroDate(nextSolar.peak);
      if (solarDate < this.fromDate || solarDate > this.toDate) {
        this.solarEclipses.push(solarDate);
      }

      searchTime = nextSolar.peak;
      searchTime.AddDays(1);
    }

    searchTime = startDate
    while (searchTime < endDate) {
      // Find next Lunar
      const nextLunar = SearchLunarEclipse(searchTime);
      if (!nextLunar) break;

      const lunarDate = fromAstroDate(nextLunar.peak);
      if (lunarDate < this.fromDate || lunarDate > this.toDate) {
        this.lunarEclipses.push(lunarDate);
      }

      searchTime = nextLunar.peak;
      searchTime.AddDays(1);
    }

    if (start < this.fromDate)
      this.fromDate = start;
    if (end > this.toDate)
      this.toDate = end;
  }
}

export const countEclipses = (start: DateTime, end: DateTime): {
  solar: number;
  lunar: number;
} => {
  const startDate = toAstroDate(start);
  const endDate = toAstroDate(end);

  const results = { solar: 0, lunar: 0 };
  let searchTime = startDate;

  while (searchTime < endDate) {
    // Find next Solar
    const nextSolar = SearchGlobalSolarEclipse(searchTime);
    if (!nextSolar) break;

    const solarDate = fromAstroDate(nextSolar.peak);
    if (solarDate < end) {
      results.solar++;
    }

    searchTime = nextSolar.peak;
    searchTime.AddDays(1);
  }

  searchTime = startDate
  while (searchTime < endDate) {
    // Find next Lunar
    const nextLunar = SearchLunarEclipse(searchTime);
    if (!nextLunar) break;

    const lunarDate = fromAstroDate(nextLunar.peak);
    if (lunarDate < end) {
      results.lunar++;
    }

    searchTime = nextLunar.peak;
    searchTime.AddDays(1);
  }

  return results;
};

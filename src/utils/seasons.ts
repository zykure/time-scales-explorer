import { DateTime } from 'luxon';
import { Seasons, AstroTime } from 'astronomy-engine';

// Helper to convert Astronomy Engine Date back to Luxon
const fromAstroDate = (jd: AstroTime): DateTime => { return DateTime.fromJSDate(jd.date); };

export const countSeasons = (start: DateTime, end: DateTime): {
  count: {
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
  },
  last: {
    spring: DateTime,
    summer: DateTime,
    autumn: DateTime,
    winter: DateTime
  }
} => {
  const startYear = start.year;
  const endYear = end.year;
  const results = { count: { spring: 0, summer: 0, autumn: 0, winter: 0 },
    last: { spring: null, summer: null, autumn: null, winter: null } };

  const minYear = Math.min(startYear, endYear);
  const maxYear = Math.max(startYear, endYear);

  for (let year = minYear; year <= maxYear; year += 1) {
    let seasons = Seasons(year);

    const springEquinox = fromAstroDate(seasons.mar_equinox);
    if (springEquinox >= start && springEquinox <= end) {
      results.count.spring++;
      results.last.spring = springEquinox;
    }

    const summerSolstice = fromAstroDate(seasons.jun_solstice);
    if (summerSolstice >= start && summerSolstice <= end) {
      results.count.summer++;
      results.last.summer = summerSolstice;
    }

    const autumnEquinox = fromAstroDate(seasons.sep_equinox);
    if (autumnEquinox >= start && autumnEquinox <= end) {
      results.count.autumn++;
      results.last.autumn = autumnEquinox;
    }

    const winterSolstice = fromAstroDate(seasons.dec_solstice);
    if (winterSolstice >= start && winterSolstice <= end) {
      results.count.winter++;
      results.last.winter = winterSolstice;
    }
  }

  return results;
};

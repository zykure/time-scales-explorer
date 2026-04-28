import { DateTime } from 'luxon';

const SYNODIC_MONTH_MS = 29.53059 * 24 * 60 * 60 * 1000;

// Reference new moon: January 6, 2000 at 18:14 UTC
const REFERENCE_NEW_MOON = DateTime.fromISO('2000-01-06T18:14:00Z');

// Count actual lunar cycles using astronomical approximation
export const countLunarCycles = (start: DateTime, end: DateTime): {
  count: number;
  currentPhase: number; // 0-1 representing current position in lunar cycle
} => {
  const diffMs = end.toMillis() - start.toMillis();
  const totalCycles = diffMs / SYNODIC_MONTH_MS;
  const count = Math.floor(totalCycles);

  // Calculate current phase
  const msSinceReference = end.toMillis() - REFERENCE_NEW_MOON.toMillis();
  const currentPhase = (msSinceReference % SYNODIC_MONTH_MS) / SYNODIC_MONTH_MS;

  return { count, currentPhase };
};

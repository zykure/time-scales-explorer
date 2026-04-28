export type TimeDirection = 'past' | 'future';

export interface TimeScale {
  id: string;
  label: string;
  value: number;
  unit: string;
  isComplete: boolean;  // Has the cycle finished?
  progress: number;     // 0-1 for visualization
}

export interface TimeResult {
  direction: TimeDirection;
  eventDate: Date;
  standard: TimeScale[];
  astronomical: TimeScale[];
  cosmic: TimeScale[];
}

export interface ConcentricRingData {
  label: string;
  value: number;
  total: number;        // Total for this cycle
  color: string;
}

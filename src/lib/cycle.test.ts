import { describe, it, expect } from 'vitest';
import { calculateCycleLengths, averageCycleLength, averagePeriodLength, currentCycleDay, predictNextPeriod, getCycleInfo, cycleVariation, getPeriodDates } from './cycle';
import type { PeriodEntry } from '../types';
import { format, subDays } from 'date-fns';

function makePeriod(start: string, end?: string, flow: PeriodEntry['flow'] = 'medium'): PeriodEntry {
  return {
    id: crypto.randomUUID(),
    startDate: start,
    endDate: end,
    flow,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe('calculateCycleLengths', () => {
  it('returns empty array for no periods', () => {
    expect(calculateCycleLengths([])).toEqual([]);
  });

  it('returns empty array for single period', () => {
    expect(calculateCycleLengths([makePeriod('2024-01-01')])).toEqual([]);
  });

  it('calculates correct cycle lengths', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-29'),
      makePeriod('2024-02-26'),
    ];
    expect(calculateCycleLengths(periods)).toEqual([28, 28]);
  });

  it('filters out cycles outside valid range (< 10 days)', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-05'),
      makePeriod('2024-02-02'),
    ];
    // 4 days is too short, filtered out. 28 days is valid.
    expect(calculateCycleLengths(periods)).toEqual([28]);
  });

  it('filters out cycles outside valid range (> 90 days)', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-05-01'),
    ];
    // 121 days is too long
    expect(calculateCycleLengths(periods)).toEqual([]);
  });

  it('handles irregular cycles', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-25'), // 24 days
      makePeriod('2024-02-20'), // 26 days
      makePeriod('2024-03-22'), // 31 days
    ];
    expect(calculateCycleLengths(periods)).toEqual([24, 26, 31]);
  });

  it('handles unsorted input', () => {
    const periods = [
      makePeriod('2024-02-26'),
      makePeriod('2024-01-01'),
      makePeriod('2024-01-29'),
    ];
    expect(calculateCycleLengths(periods)).toEqual([28, 28]);
  });
});

describe('averageCycleLength', () => {
  it('returns undefined for no data', () => {
    expect(averageCycleLength([])).toBeUndefined();
  });

  it('returns undefined for single period', () => {
    expect(averageCycleLength([makePeriod('2024-01-01')])).toBeUndefined();
  });

  it('calculates average correctly', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-29'),
      makePeriod('2024-02-26'),
    ];
    expect(averageCycleLength(periods)).toBe(28);
  });

  it('rounds to nearest integer', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-25'), // 24
      makePeriod('2024-02-20'), // 26
    ];
    expect(averageCycleLength(periods)).toBe(25);
  });
});

describe('averagePeriodLength', () => {
  it('returns undefined when no complete entries', () => {
    expect(averagePeriodLength([makePeriod('2024-01-01')])).toBeUndefined();
  });

  it('calculates from complete entries', () => {
    const periods = [
      makePeriod('2024-01-01', '2024-01-05'), // 5 days
      makePeriod('2024-01-29', '2024-02-02'), // 5 days
    ];
    expect(averagePeriodLength(periods)).toBe(5);
  });
});

describe('currentCycleDay', () => {
  it('returns undefined for no periods', () => {
    expect(currentCycleDay([])).toBeUndefined();
  });

  it('calculates days since last period start', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const periods = [makePeriod(today)];
    expect(currentCycleDay(periods)).toBe(1);
  });

  it('calculates for past period', () => {
    const tenDaysAgo = format(subDays(new Date(), 9), 'yyyy-MM-dd');
    const periods = [makePeriod(tenDaysAgo)];
    expect(currentCycleDay(periods)).toBe(10);
  });
});

describe('predictNextPeriod', () => {
  it('returns none confidence with no data', () => {
    expect(predictNextPeriod([]).confidence).toBe('none');
    expect(predictNextPeriod([]).date).toBeUndefined();
  });

  it('returns low confidence with one cycle', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-29'),
    ];
    const result = predictNextPeriod(periods);
    expect(result.confidence).toBe('low');
    expect(result.date).toBeDefined();
  });

  it('returns moderate confidence with 3 cycles', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-29'),
      makePeriod('2024-02-26'),
      makePeriod('2024-03-26'),
    ];
    const result = predictNextPeriod(periods);
    expect(result.confidence).toBe('moderate');
  });

  it('returns high confidence with 6+ regular cycles', () => {
    const periods: PeriodEntry[] = [];
    let date = new Date('2024-01-01');
    for (let i = 0; i < 7; i++) {
      periods.push(makePeriod(format(date, 'yyyy-MM-dd')));
      date = new Date(date.getTime() + 28 * 86400000);
    }
    const result = predictNextPeriod(periods);
    expect(result.confidence).toBe('high');
  });

  it('returns moderate for 6+ irregular cycles', () => {
    const periods: PeriodEntry[] = [];
    let date = new Date('2024-01-01');
    const cycleLens = [28, 35, 22, 30, 25, 33, 28];
    for (const len of cycleLens) {
      periods.push(makePeriod(format(date, 'yyyy-MM-dd')));
      date = new Date(date.getTime() + len * 86400000);
    }
    const result = predictNextPeriod(periods);
    expect(result.confidence).toBe('moderate');
  });
});

describe('cycleVariation', () => {
  it('returns undefined for fewer than 2 cycles', () => {
    expect(cycleVariation([makePeriod('2024-01-01')])).toBeUndefined();
  });

  it('calculates range correctly', () => {
    const periods = [
      makePeriod('2024-01-01'),
      makePeriod('2024-01-25'), // 24
      makePeriod('2024-02-20'), // 26
      makePeriod('2024-03-22'), // 31
    ];
    expect(cycleVariation(periods)).toBe(7); // 31 - 24
  });
});

describe('getPeriodDates', () => {
  it('returns all dates in a period range', () => {
    const dates = getPeriodDates([makePeriod('2024-01-01', '2024-01-05')]);
    expect(dates.size).toBe(5);
    expect(dates.has('2024-01-01')).toBe(true);
    expect(dates.has('2024-01-03')).toBe(true);
    expect(dates.has('2024-01-05')).toBe(true);
    expect(dates.has('2024-01-06')).toBe(false);
  });

  it('handles single-day period', () => {
    const dates = getPeriodDates([makePeriod('2024-01-01')]);
    expect(dates.size).toBe(1);
    expect(dates.has('2024-01-01')).toBe(true);
  });
});

describe('getCycleInfo', () => {
  it('returns unknown phase with no data', () => {
    const info = getCycleInfo([]);
    expect(info.phase).toBe('unknown');
    expect(info.cycleDay).toBeUndefined();
    expect(info.cycleLengths).toEqual([]);
    expect(info.predictionConfidence).toBe('none');
  });

  it('returns menstrual phase on day 1', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const info = getCycleInfo([makePeriod(today)]);
    expect(info.cycleDay).toBe(1);
    // Phase is unknown without an average cycle length (needs 2+ periods)
    expect(info.phase).toBe('unknown');
  });
});

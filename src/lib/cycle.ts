// Cycle calculation engine — handles irregular cycles, incomplete data, predictions

import type { PeriodEntry, CycleInfo, CyclePhase } from '../types';
import { differenceInCalendarDays, addDays, format, parseISO, startOfDay } from 'date-fns';

/**
 * Extracts valid period start dates sorted chronologically.
 * Only entries with a valid startDate are considered.
 */
export function getPeriodStartDates(periods: PeriodEntry[]): Date[] {
  return periods
    .filter(p => p.startDate && !isNaN(new Date(p.startDate).getTime()))
    .map(p => startOfDay(parseISO(p.startDate)))
    .sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Calculates individual cycle lengths from consecutive period start dates.
 * A cycle length is the number of days between one period start and the next.
 * Only cycles between 10 and 90 days are considered valid (WHO ranges).
 */
export function calculateCycleLengths(periods: PeriodEntry[]): number[] {
  const starts = getPeriodStartDates(periods);
  const lengths: number[] = [];

  for (let i = 1; i < starts.length; i++) {
    const diff = differenceInCalendarDays(starts[i], starts[i - 1]);
    if (diff >= 10 && diff <= 90) {
      lengths.push(diff);
    }
  }

  return lengths;
}

/**
 * Calculates the average cycle length from recorded history.
 * Returns undefined if there are fewer than 1 valid cycle.
 */
export function averageCycleLength(periods: PeriodEntry[]): number | undefined {
  const lengths = calculateCycleLengths(periods);
  if (lengths.length === 0) return undefined;
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
}

/**
 * Calculates the average period length from entries that have both start and end dates.
 */
export function averagePeriodLength(periods: PeriodEntry[]): number | undefined {
  const completeEntries = periods.filter(p => p.startDate && p.endDate);
  if (completeEntries.length === 0) return undefined;
  const lengths = completeEntries.map(p =>
    differenceInCalendarDays(parseISO(p.endDate!), parseISO(p.startDate)) + 1
  );
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
}

/**
 * Determines the current cycle day (days since the most recent period start).
 * Returns undefined if no period has been recorded.
 */
export function currentCycleDay(periods: PeriodEntry[]): number | undefined {
  const starts = getPeriodStartDates(periods);
  if (starts.length === 0) return undefined;
  const lastStart = starts[starts.length - 1];
  const today = startOfDay(new Date());
  const day = differenceInCalendarDays(today, lastStart) + 1;
  return day > 0 ? day : undefined;
}

/**
 * Determines the current cycle phase based on cycle day and average length.
 * This is an educational estimate, not a medical determination.
 */
export function getCyclePhase(cycleDay: number | undefined, avgLength: number | undefined): CyclePhase {
  if (!cycleDay || !avgLength) return 'unknown';

  // Standard phase boundaries (approximate, educational only)
  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= 13) return 'follicular';
  if (cycleDay <= 16) return 'ovulatory';
  return 'luteal';
}

/**
 * Predicts the next period start date.
 * Uses average cycle length from recorded history.
 * Requires at least 1 completed cycle for a low-confidence prediction,
 * and at least 3 for moderate confidence.
 *
 * This is an estimate only — bodies are not clocks.
 */
export function predictNextPeriod(periods: PeriodEntry[]): { date: string | undefined; confidence: 'none' | 'low' | 'moderate' | 'high' } {
  const starts = getPeriodStartDates(periods);
  const lengths = calculateCycleLengths(periods);
  const avg = averageCycleLength(periods);

  if (starts.length === 0 || !avg) {
    return { date: undefined, confidence: 'none' };
  }

  const lastStart = starts[starts.length - 1];
  const nextStart = addDays(lastStart, avg);
  const today = startOfDay(new Date());

  // If the predicted date has already passed, predict the next one after today
  let predictedDate = nextStart;
  while (differenceInCalendarDays(predictedDate, today) < 0) {
    predictedDate = addDays(predictedDate, avg);
  }

  let confidence: 'none' | 'low' | 'moderate' | 'high' = 'none';
  if (lengths.length >= 6) {
    // Check regularity — if cycles vary by more than 7 days, lower confidence
    const variation = Math.max(...lengths) - Math.min(...lengths);
    confidence = variation <= 7 ? 'high' : 'moderate';
  } else if (lengths.length >= 3) {
    confidence = 'moderate';
  } else if (lengths.length >= 1) {
    confidence = 'low';
  }

  return { date: format(predictedDate, 'yyyy-MM-dd'), confidence };
}

/**
 * Calculates the variation (range) in cycle lengths.
 */
export function cycleVariation(periods: PeriodEntry[]): number | undefined {
  const lengths = calculateCycleLengths(periods);
  if (lengths.length < 2) return undefined;
  return Math.max(...lengths) - Math.min(...lengths);
}

/**
 * Gets all dates that are part of a recorded period.
 */
export function getPeriodDates(periods: PeriodEntry[]): Set<string> {
  const dates = new Set<string>();
  for (const p of periods) {
    if (!p.startDate) continue;
    const start = parseISO(p.startDate);
    const end = p.endDate ? parseISO(p.endDate) : start;
    let current = start;
    while (current <= end) {
      dates.add(format(current, 'yyyy-MM-dd'));
      current = addDays(current, 1);
    }
  }
  return dates;
}

/**
 * Gets all spotting dates.
 */
export function getSpottingDates(periods: PeriodEntry[]): Set<string> {
  const dates = new Set<string>();
  for (const p of periods) {
    if (p.flow === 'spotting' && p.startDate) {
      dates.add(p.startDate);
    }
  }
  return dates;
}

/**
 * Gets predicted period dates for calendar display.
 */
export function getPredictedPeriodDates(periods: PeriodEntry[]): Set<string> {
  const predicted = new Set<string>();
  const { date } = predictNextPeriod(periods);
  const avgPeriod = averagePeriodLength(periods) ?? 5;

  if (date) {
    const start = parseISO(date);
    for (let i = 0; i < avgPeriod; i++) {
      predicted.add(format(addDays(start, i), 'yyyy-MM-dd'));
    }
  }

  return predicted;
}

/**
 * Comprehensive cycle info calculation.
 */
export function getCycleInfo(periods: PeriodEntry[]): CycleInfo {
  const cycleLengths = calculateCycleLengths(periods);
  const avgCycle = averageCycleLength(periods);
  const avgPeriod = averagePeriodLength(periods);
  const day = currentCycleDay(periods);
  const phase = getCyclePhase(day, avgCycle);
  const { date, confidence } = predictNextPeriod(periods);

  return {
    cycleLength: avgCycle,
    periodLength: avgPeriod,
    cycleDay: day,
    phase,
    nextPeriodEstimate: date,
    predictionConfidence: confidence,
    averageCycleLength: avgCycle,
    cycleLengths,
  };
}

/**
 * Checks if a date falls within a predicted period window.
 */
export function isDateInPredictedPeriod(date: Date, periods: PeriodEntry[]): boolean {
  const predicted = getPredictedPeriodDates(periods);
  return predicted.has(format(date, 'yyyy-MM-dd'));
}

/**
 * Generates a symptom summary for a healthcare appointment.
 */
export function generateSymptomSummary(
  periods: PeriodEntry[],
  symptoms: import('../types').SymptomEntry[]
): string {
  const info = getCycleInfo(periods);
  const lines: string[] = [];

  lines.push('Symptom Summary for Healthcare Appointment');
  lines.push('Generated by Saheli — ' + format(new Date(), 'MMMM d, yyyy'));
  lines.push('');

  if (info.cycleLength) {
    lines.push(`Average cycle length: ${info.cycleLength} days`);
  }
  if (info.cycleLengths.length > 0) {
    lines.push(`Recorded cycles: ${info.cycleLengths.length}`);
    lines.push(`Cycle lengths: ${info.cycleLengths.join(', ')} days`);
  }
  if (info.periodLength) {
    lines.push(`Average period length: ${info.periodLength} days`);
  }
  lines.push('');

  if (symptoms.length > 0) {
    lines.push('Recent symptoms (last 30 days):');
    const thirtyDaysAgo = addDays(new Date(), -30);
    const recent = symptoms.filter(s => parseISO(s.date) >= thirtyDaysAgo);
    const symptomFreq: Record<string, number> = {};
    for (const s of recent) {
      for (const sym of s.symptoms) {
        symptomFreq[sym] = (symptomFreq[sym] || 0) + 1;
      }
    }
    const sorted = Object.entries(symptomFreq).sort((a, b) => b[1] - a[1]);
    for (const [sym, count] of sorted) {
      lines.push(`  - ${sym}: ${count} time(s)`);
    }

    const painLevels = recent.map(s => s.painLevel).filter(p => p > 0);
    if (painLevels.length > 0) {
      const avgPain = (painLevels.reduce((a, b) => a + b, 0) / painLevels.length).toFixed(1);
      lines.push(`Average pain level: ${avgPain}/10`);
    }
  }

  lines.push('');
  lines.push('Note: This summary is for reference only and does not constitute a diagnosis.');

  return lines.join('\n');
}

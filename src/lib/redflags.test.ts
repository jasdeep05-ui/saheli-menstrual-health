import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  evaluateRedFlags,
  CONFIG,
  STATIC_WARNINGS,
  URGENT_WARNINGS,
  generateVisitSummary,
  type RedFlagInput,
} from './redflags';
import type { PeriodEntry, SymptomEntry, OnboardingPrefs } from '../types';

// Fixed "today" for deterministic tests
const FIXED_TODAY = new Date('2026-10-24T12:00:00Z');

function makePeriod(id: string, start: string, end?: string, flow: PeriodEntry['flow'] = 'medium'): PeriodEntry {
  return {
    id, startDate: start, endDate: end, flow,
    createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
  };
}

function makeSymptom(id: string, date: string, overrides: Partial<SymptomEntry> = {}): SymptomEntry {
  return {
    id, date, symptoms: [], painLevel: 0, mood: 'okay', energy: 'medium', sleep: 'fair',
    createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

const adultOnboarding: OnboardingPrefs = {
  completed: true, language: 'en', interests: [], trackingEnabled: true,
  privacyAcknowledged: true, remindersEnabled: false, ageGroup: 'adult',
};

const minorOnboarding: OnboardingPrefs = {
  completed: true, language: 'en', interests: [], trackingEnabled: true,
  privacyAcknowledged: true, remindersEnabled: false, ageGroup: 'minor',
};

const unknownOnboarding: OnboardingPrefs = {
  completed: true, language: 'en', interests: [], trackingEnabled: true,
  privacyAcknowledged: true, remindersEnabled: false, ageGroup: 'unknown',
};

describe('redflags — long bleeding (>7 days)', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('flags a period lasting 8 days', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-08')],
      symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    const longBleeding = flags.find(f => f.id === 'long-bleeding-p1');
    expect(longBleeding).toBeDefined();
    expect(longBleeding?.severity).toBe('routine');
  });

  it('does not flag a period lasting exactly 7 days (boundary)', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-07')],
      symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'long-bleeding-p1')).toBeUndefined();
  });

  it('does not flag a period lasting 6 days', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-06')],
      symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'long-bleeding-p1')).toBeUndefined();
  });

  it('handles missing end date safely', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01')],
      symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'long-bleeding-p1')).toBeUndefined();
  });
});

describe('redflags — heavy bleeding indicators', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('flags heavy flow', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-05', 'heavy')],
      symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'heavy-flow-p1')).toBeDefined();
  });

  it('flags clots logged in symptom entry', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { clots: true })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'clots-s1')).toBeDefined();
  });

  it('flags pad change every 1-2 hours', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { padChangeFrequency: '1-2hours' })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'pad-change-s1')).toBeDefined();
  });

  it('does not flag normal pad change frequency', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { padChangeFrequency: 'normal' })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'pad-change-s1')).toBeUndefined();
  });

  it('does not flag when clots field is not set (missing info)', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02')],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'clots-s1')).toBeUndefined();
  });
});

describe('redflags — irregular cycles', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('flags 3 consecutive short cycles (<21 days) for adults', () => {
    // 4 periods with 20-day gaps = 3 cycles of 20 days each
    const periods = [
      makePeriod('p1', '2026-07-01'),
      makePeriod('p2', '2026-07-21'),
      makePeriod('p3', '2026-08-10'),
      makePeriod('p4', '2026-08-30'),
    ];
    const input: RedFlagInput = { periods, symptoms: [], onboarding: adultOnboarding };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id.startsWith('irregular-cycles-'))).toBeDefined();
  });

  it('flags 3 consecutive long cycles (>35 days) for adults', () => {
    // 4 periods with 36-day gaps
    const periods = [
      makePeriod('p1', '2026-05-01'),
      makePeriod('p2', '2026-06-06'),
      makePeriod('p3', '2026-07-12'),
      makePeriod('p4', '2026-08-17'),
    ];
    const input: RedFlagInput = { periods, symptoms: [], onboarding: adultOnboarding };
    const flags = evaluateRedFlags(input);
    const irreg = flags.find(f => f.id.startsWith('irregular-cycles-'));
    expect(irreg).toBeDefined();
    expect(irreg?.descriptionKey).toBe('rfIrregularCyclesLongDesc');
  });

  it('flags 3 consecutive long cycles (>45 days) for minors', () => {
    // 4 periods with 40-day gaps — should NOT flag for minor (40 < 45)
    const periods40 = [
      makePeriod('p1', '2026-04-01'),
      makePeriod('p2', '2026-05-11'),
      makePeriod('p3', '2026-06-20'),
      makePeriod('p4', '2026-07-30'),
    ];
    const inputMinor: RedFlagInput = { periods: periods40, symptoms: [], onboarding: minorOnboarding };
    expect(evaluateRedFlags(inputMinor).find(f => f.id.startsWith('irregular-cycles-'))).toBeUndefined();

    // 4 periods with 46-day gaps — SHOULD flag for minor
    const periods46 = [
      makePeriod('p1', '2026-04-01'),
      makePeriod('p2', '2026-05-17'),
      makePeriod('p3', '2026-07-02'),
      makePeriod('p4', '2026-08-17'),
    ];
    const inputMinor46: RedFlagInput = { periods: periods46, symptoms: [], onboarding: minorOnboarding };
    expect(evaluateRedFlags(inputMinor46).find(f => f.id.startsWith('irregular-cycles-'))).toBeDefined();
  });

  it('does not flag 3 consecutive normal cycles (28 days)', () => {
    const periods = [
      makePeriod('p1', '2026-07-01'),
      makePeriod('p2', '2026-07-29'),
      makePeriod('p3', '2026-08-26'),
      makePeriod('p4', '2026-09-23'),
    ];
    const input: RedFlagInput = { periods, symptoms: [], onboarding: adultOnboarding };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id.startsWith('irregular-cycles-'))).toBeUndefined();
  });

  it('does not flag with fewer than 3 cycles', () => {
    const periods = [
      makePeriod('p1', '2026-09-01'),
      makePeriod('p2', '2026-09-21'), // 20-day cycle
      makePeriod('p3', '2026-10-11'), // 20-day cycle — only 2, not 3
    ];
    const input: RedFlagInput = { periods, symptoms: [], onboarding: adultOnboarding };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id.startsWith('irregular-cycles-'))).toBeUndefined();
  });

  it('marks basedOnIncompleteInfo when ageGroup is unknown', () => {
    // 4 periods with 20-day gaps
    const periods = [
      makePeriod('p1', '2026-07-01'),
      makePeriod('p2', '2026-07-21'),
      makePeriod('p3', '2026-08-10'),
      makePeriod('p4', '2026-08-30'),
    ];
    const input: RedFlagInput = { periods, symptoms: [], onboarding: unknownOnboarding };
    const flags = evaluateRedFlags(input);
    const irreg = flags.find(f => f.id.startsWith('irregular-cycles-'));
    expect(irreg).toBeDefined();
    expect(irreg?.basedOnIncompleteInfo).toBe(true);
  });

  it('does not mark basedOnIncompleteInfo when ageGroup is adult', () => {
    const periods = [
      makePeriod('p1', '2026-07-01'),
      makePeriod('p2', '2026-07-21'),
      makePeriod('p3', '2026-08-10'),
      makePeriod('p4', '2026-08-30'),
    ];
    const input: RedFlagInput = { periods, symptoms: [], onboarding: adultOnboarding };
    const flags = evaluateRedFlags(input);
    const irreg = flags.find(f => f.id.startsWith('irregular-cycles-'));
    expect(irreg?.basedOnIncompleteInfo).toBeFalsy();
  });
});

describe('redflags — no period for 90 days', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('flags when last period was 91 days ago', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-07-25')],
      symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    const noPeriod = flags.find(f => f.id === 'no-period-90');
    expect(noPeriod).toBeDefined();
  });

  it('does not flag when last period was exactly 90 days ago (boundary)', () => {
    // 90 days before Oct 24 = Jul 26
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-07-26')],
      symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'no-period-90')).toBeUndefined();
  });

  it('does not flag when there are no periods at all', () => {
    const input: RedFlagInput = {
      periods: [], symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'no-period-90')).toBeUndefined();
  });
});

describe('redflags — bleeding between periods', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('flags when bleedingBetweenPeriods is true', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { bleedingBetweenPeriods: true })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'bleeding-between-s1')).toBeDefined();
  });

  it('does not flag when bleedingBetweenPeriods is not set', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02')],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'bleeding-between-s1')).toBeUndefined();
  });

  it('does not flag when bleedingBetweenPeriods is false', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { bleedingBetweenPeriods: false })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'bleeding-between-s1')).toBeUndefined();
  });
});

describe('redflags — severe pain', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('flags urgent when pain level is 9', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { painLevel: 9 })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    const pain = flags.find(f => f.id === 'severe-pain-s1');
    expect(pain).toBeDefined();
    expect(pain?.severity).toBe('urgent');
  });

  it('flags urgent when pain level is 10', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { painLevel: 10 })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'severe-pain-s1')?.severity).toBe('urgent');
  });

  it('flags routine when impactsDailyLife is true even with low pain', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { painLevel: 3, impactsDailyLife: true })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    const pain = flags.find(f => f.id === 'severe-pain-s1');
    expect(pain).toBeDefined();
    expect(pain?.severity).toBe('routine');
  });

  it('does not flag when pain is 8 and impactsDailyLife is not set', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { painLevel: 8 })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'severe-pain-s1')).toBeUndefined();
  });

  it('does not flag when pain is 0 and no impactsDailyLife', () => {
    const input: RedFlagInput = {
      periods: [],
      symptoms: [makeSymptom('s1', '2026-10-02', { painLevel: 0 })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'severe-pain-s1')).toBeUndefined();
  });
});

describe('redflags — heavy bleeding with anemia signs', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('flags urgent when heavy flow + fatigue symptom', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-05', 'heavy')],
      symptoms: [makeSymptom('s1', '2026-10-02', { symptoms: ['Fatigue'] })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    const anemia = flags.find(f => f.id === 'heavy-bleeding-anemia');
    expect(anemia).toBeDefined();
    expect(anemia?.severity).toBe('urgent');
  });

  it('flags urgent when heavy flow + dizziness symptom', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-05', 'heavy')],
      symptoms: [makeSymptom('s1', '2026-10-02', { symptoms: ['Dizziness'] })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'heavy-bleeding-anemia')?.severity).toBe('urgent');
  });

  it('flags urgent when heavy flow + breathlessness symptom', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-05', 'heavy')],
      symptoms: [makeSymptom('s1', '2026-10-02', { symptoms: ['Breathlessness'] })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'heavy-bleeding-anemia')).toBeDefined();
  });

  it('does not flag when heavy flow but no anemia symptoms', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-05', 'heavy')],
      symptoms: [makeSymptom('s1', '2026-10-02', { symptoms: ['Cramps'] })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'heavy-bleeding-anemia')).toBeUndefined();
  });

  it('does not flag when anemia symptoms but no heavy flow', () => {
    const input: RedFlagInput = {
      periods: [makePeriod('p1', '2026-10-01', '2026-10-05', 'medium')],
      symptoms: [makeSymptom('s1', '2026-10-02', { symptoms: ['Fatigue'] })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags.find(f => f.id === 'heavy-bleeding-anemia')).toBeUndefined();
  });
});

describe('redflags — empty and missing data', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns no flags with completely empty data', () => {
    const input: RedFlagInput = {
      periods: [], symptoms: [], onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    expect(flags).toHaveLength(0);
  });

  it('handles invalid date strings safely', () => {
    const input: RedFlagInput = {
      periods: [{ ...makePeriod('p1', 'invalid-date', 'also-invalid') }],
      symptoms: [], onboarding: adultOnboarding,
    };
    expect(() => evaluateRedFlags(input)).not.toThrow();
  });
});

describe('redflags — urgent flags sorted first', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('sorts urgent flags before routine flags', () => {
    const input: RedFlagInput = {
      periods: [
        makePeriod('p1', '2026-10-01', '2026-10-05', 'heavy'),
        makePeriod('p2', '2026-09-01', '2026-09-10'), // 10 days = long bleeding (routine)
      ],
      symptoms: [makeSymptom('s1', '2026-10-02', { symptoms: ['Fatigue'] })],
      onboarding: adultOnboarding,
    };
    const flags = evaluateRedFlags(input);
    const firstUrgentIdx = flags.findIndex(f => f.severity === 'urgent');
    const firstRoutineIdx = flags.findIndex(f => f.severity === 'routine');
    expect(firstUrgentIdx).toBeLessThan(firstRoutineIdx);
  });
});

describe('redflags — static and urgent warnings', () => {
  it('has 3 static warnings', () => {
    expect(STATIC_WARNINGS).toHaveLength(3);
    expect(STATIC_WARNINGS.map(w => w.id)).toContain('first-period-15');
    expect(STATIC_WARNINGS.map(w => w.id)).toContain('sudden-change');
    expect(STATIC_WARNINGS.map(w => w.id)).toContain('post-menopause');
  });

  it('has 3 urgent warnings', () => {
    expect(URGENT_WARNINGS).toHaveLength(3);
    expect(URGENT_WARNINGS.map(w => w.id)).toContain('fainting');
    expect(URGENT_WARNINGS.map(w => w.id)).toContain('severe-worsening-pain');
    expect(URGENT_WARNINGS.map(w => w.id)).toContain('heavy-bleeding-dizziness');
  });
});

describe('redflags — generateVisitSummary', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(FIXED_TODAY); });
  afterEach(() => { vi.useRealTimers(); });

  it('generates a summary with cycle history', () => {
    const periods = [
      makePeriod('p1', '2026-09-01'),
      makePeriod('p2', '2026-09-29'),
      makePeriod('p3', '2026-10-27'),
    ];
    const summary = generateVisitSummary(periods, [], [], 'en');
    expect(summary).toContain('Cycle History');
    expect(summary).toContain('Recorded cycles: 2');
  });

  it('generates a summary with symptom records', () => {
    const symptoms = [
      makeSymptom('s1', '2026-10-02', { painLevel: 7, symptoms: ['Cramps'], mood: 'low' }),
    ];
    const summary = generateVisitSummary([], symptoms, [], 'en');
    expect(summary).toContain('Symptom Records');
    expect(summary).toContain('Cramps');
  });

  it('includes flagged patterns in summary', () => {
    const periods = [makePeriod('p1', '2026-10-01', '2026-10-10')]; // 10-day period
    const flags = evaluateRedFlags({ periods, symptoms: [], onboarding: adultOnboarding });
    const summary = generateVisitSummary(periods, [], flags, 'en');
    expect(summary).toContain('Flagged Patterns');
    expect(summary).toContain('long-bleeding-p1');
  });

  it('includes questions section', () => {
    const summary = generateVisitSummary([], [], [], 'en');
    expect(summary).toContain('Questions for the Clinician');
  });

  it('handles empty data gracefully', () => {
    const summary = generateVisitSummary([], [], [], 'en');
    expect(summary).toContain('No periods recorded');
    expect(summary).toContain('No symptoms recorded');
    expect(summary).toContain('No patterns flagged');
  });

  it('generates Hindi version', () => {
    const summary = generateVisitSummary([], [], [], 'hi');
    expect(summary).toContain('चिकित्सक अपॉइंटमेंट सारांश');
  });
});

describe('redflags — CONFIG thresholds', () => {
  it('has configurable thresholds', () => {
    expect(CONFIG.longBleedingDays).toBe(7);
    expect(CONFIG.shortCycleAdult).toBe(21);
    expect(CONFIG.longCycleAdult).toBe(35);
    expect(CONFIG.longCycleMinor).toBe(45);
    expect(CONFIG.consecutiveIrregularCycles).toBe(3);
    expect(CONFIG.noPeriodDays).toBe(90);
    expect(CONFIG.urgentPainLevel).toBe(9);
  });
});

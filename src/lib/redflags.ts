// Red-flag evaluation engine — all processing is local, on-device.
// No health records are sent to any external service.
//
// Rules are centralized here so they are readable and testable.
// Thresholds are configurable via the CONFIG object.

import type { PeriodEntry, SymptomEntry, OnboardingPrefs } from '../types';
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';
import { calculateCycleLengths, getPeriodStartDates, averagePeriodLength } from './cycle';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export const CONFIG = {
  longBleedingDays: 7,
  heavyFlowValues: ['heavy'] as const,
  shortCycleAdult: 21,
  longCycleAdult: 35,
  longCycleMinor: 45,
  consecutiveIrregularCycles: 3,
  noPeriodDays: 90,
  highPainLevel: 7,
  urgentPainLevel: 9,
  // symptoms that indicate heavy bleeding complications
  anemiaSymptoms: ['Fatigue', 'Dizziness', 'Breathlessness'] as const,
  // symptom that indicates pain interfering with daily life
  painStopSymptoms: ['Cramps', 'Back pain'] as const,
} as const;

export type Severity = 'routine' | 'urgent';

export type AgeGroup = 'minor' | 'adult' | 'unknown';

export interface RedFlag {
  id: string;
  severity: Severity;
  titleKey: string;
  descriptionKey: string;
  actionKey: string;
  dates?: string[];
  detail?: string;
  basedOnIncompleteInfo?: boolean;
}

export interface RedFlagInput {
  periods: PeriodEntry[];
  symptoms: SymptomEntry[];
  onboarding: OnboardingPrefs;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeParseISO(date: string | undefined): Date | null {
  if (!date) return null;
  const d = parseISO(date);
  return isNaN(d.getTime()) ? null : d;
}

function periodDurationDays(p: PeriodEntry): number | null {
  const start = safeParseISO(p.startDate);
  const end = safeParseISO(p.endDate);
  if (!start || !end) return null;
  return differenceInCalendarDays(end, start) + 1;
}

function getAgeGroup(onboarding: OnboardingPrefs): AgeGroup {
  if (onboarding.ageGroup === 'minor') return 'minor';
  if (onboarding.ageGroup === 'adult') return 'adult';
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Rule evaluators
// ---------------------------------------------------------------------------

// 1. Period bleeding lasting more than 7 days
function checkLongBleeding(periods: PeriodEntry[]): RedFlag[] {
  const flags: RedFlag[] = [];
  for (const p of periods) {
    const dur = periodDurationDays(p);
    if (dur !== null && dur > CONFIG.longBleedingDays) {
      flags.push({
        id: `long-bleeding-${p.id}`,
        severity: 'routine',
        titleKey: 'rfLongBleedingTitle',
        descriptionKey: 'rfLongBleedingDesc',
        actionKey: 'rfLongBleedingAction',
        dates: [p.startDate, p.endDate ?? p.startDate],
        detail: `${dur}`,
      });
    }
  }
  return flags;
}

// 2. Heavy bleeding indicators: heavy flow, clots, or pad change frequency
function checkHeavyBleeding(periods: PeriodEntry[], symptoms: SymptomEntry[]): RedFlag[] {
  const flags: RedFlag[] = [];

  // Heavy flow entries
  for (const p of periods) {
    if (CONFIG.heavyFlowValues.includes(p.flow as typeof CONFIG.heavyFlowValues[number])) {
      flags.push({
        id: `heavy-flow-${p.id}`,
        severity: 'routine',
        titleKey: 'rfHeavyFlowTitle',
        descriptionKey: 'rfHeavyFlowDesc',
        actionKey: 'rfHeavyFlowAction',
        dates: [p.startDate],
        detail: p.flow,
      });
    }
  }

  // Clots logged in symptom entries
  for (const s of symptoms) {
    if (s.clots === true) {
      flags.push({
        id: `clots-${s.id}`,
        severity: 'routine',
        titleKey: 'rfClotsTitle',
        descriptionKey: 'rfClotsDesc',
        actionKey: 'rfClotsAction',
        dates: [s.date],
      });
    }
  }

  // Pad change frequency logged in symptom entries
  for (const s of symptoms) {
    if (s.padChangeFrequency === '1-2hours') {
      flags.push({
        id: `pad-change-${s.id}`,
        severity: 'routine',
        titleKey: 'rfPadChangeTitle',
        descriptionKey: 'rfPadChangeDesc',
        actionKey: 'rfPadChangeAction',
        dates: [s.date],
      });
    }
  }

  return flags;
}

// 3. Repeated irregular cycle lengths (3 consecutive cycles)
function checkIrregularCycles(periods: PeriodEntry[], ageGroup: AgeGroup): RedFlag[] {
  const flags: RedFlag[] = [];
  const lengths = calculateCycleLengths(periods);
  if (lengths.length < CONFIG.consecutiveIrregularCycles) return flags;

  const shortThreshold = CONFIG.shortCycleAdult;
  const longThreshold = ageGroup === 'minor' ? CONFIG.longCycleMinor : CONFIG.longCycleAdult;

  // Check for 3 consecutive irregular cycles
  for (let i = 0; i <= lengths.length - CONFIG.consecutiveIrregularCycles; i++) {
    let consecutive = 0;
    for (let j = i; j < lengths.length; j++) {
      if (lengths[j] < shortThreshold || lengths[j] > longThreshold) {
        consecutive++;
        if (consecutive >= CONFIG.consecutiveIrregularCycles) {
          const startIdx = getPeriodStartDates(periods);
          const periodDates = startIdx.slice(i, i + CONFIG.consecutiveIrregularCycles + 1).map(d => d.toISOString().slice(0, 10));
          const isShort = lengths.slice(i, i + CONFIG.consecutiveIrregularCycles).some(l => l < shortThreshold);
          flags.push({
            id: `irregular-cycles-${i}`,
            severity: 'routine',
            titleKey: 'rfIrregularCyclesTitle',
            descriptionKey: isShort ? 'rfIrregularCyclesShortDesc' : 'rfIrregularCyclesLongDesc',
            actionKey: 'rfIrregularCyclesAction',
            dates: periodDates,
            detail: lengths.slice(i, i + CONFIG.consecutiveIrregularCycles).join(', '),
            basedOnIncompleteInfo: ageGroup === 'unknown',
          });
          break;
        }
      } else {
        break;
      }
    }
  }

  return flags;
}

// 4. No recorded period for 90 days
function checkNoPeriod(periods: PeriodEntry[]): RedFlag[] {
  const starts = getPeriodStartDates(periods);
  if (starts.length === 0) return [];

  const lastStart = starts[starts.length - 1];
  const today = startOfDay(new Date());
  const daysSince = differenceInCalendarDays(today, lastStart);

  if (daysSince >= CONFIG.noPeriodDays) {
    return [{
      id: 'no-period-90',
      severity: 'routine',
      titleKey: 'rfNoPeriodTitle',
      descriptionKey: 'rfNoPeriodDesc',
      actionKey: 'rfNoPeriodAction',
      dates: [lastStart.toISOString().slice(0, 10)],
      detail: `${daysSince}`,
    }];
  }

  return [];
}

// 5. Bleeding between periods or after sex (only if logged)
function checkBleedingBetweenPeriods(symptoms: SymptomEntry[]): RedFlag[] {
  const flags: RedFlag[] = [];
  for (const s of symptoms) {
    if (s.bleedingBetweenPeriods === true) {
      flags.push({
        id: `bleeding-between-${s.id}`,
        severity: 'routine',
        titleKey: 'rfBleedingBetweenTitle',
        descriptionKey: 'rfBleedingBetweenDesc',
        actionKey: 'rfBleedingBetweenAction',
        dates: [s.date],
      });
    }
  }
  return flags;
}

// 6. Pain that stops daily activities or not helped by painkillers
function checkSeverePain(symptoms: SymptomEntry[]): RedFlag[] {
  const flags: RedFlag[] = [];
  for (const s of symptoms) {
    if (s.painLevel >= CONFIG.urgentPainLevel || s.impactsDailyLife === true) {
      const isUrgent = s.painLevel >= CONFIG.urgentPainLevel;
      flags.push({
        id: `severe-pain-${s.id}`,
        severity: isUrgent ? 'urgent' : 'routine',
        titleKey: isUrgent ? 'rfSeverePainTitle' : 'rfPainImpactsTitle',
        descriptionKey: isUrgent ? 'rfSeverePainDesc' : 'rfPainImpactsDesc',
        actionKey: isUrgent ? 'rfSeverePainAction' : 'rfPainImpactsAction',
        dates: [s.date],
        detail: `${s.painLevel}`,
      });
    }
  }
  return flags;
}

// 7. Heavy bleeding together with tiredness, breathlessness or dizziness
function checkHeavyBleedingWithAnemia(periods: PeriodEntry[], symptoms: SymptomEntry[]): RedFlag[] {
  const flags: RedFlag[] = [];

  // Check if any period entry has heavy flow
  const hasHeavyFlow = periods.some(p =>
    CONFIG.heavyFlowValues.includes(p.flow as typeof CONFIG.heavyFlowValues[number])
  );

  if (!hasHeavyFlow) return flags;

  // Check for anemia symptoms
  const anemiaSymptomEntries = symptoms.filter(s =>
    s.symptoms.some(sym => CONFIG.anemiaSymptoms.includes(sym as typeof CONFIG.anemiaSymptoms[number]))
  );

  if (anemiaSymptomEntries.length > 0) {
    const dates = anemiaSymptomEntries.map(s => s.date).sort();
    flags.push({
      id: 'heavy-bleeding-anemia',
      severity: 'urgent',
      titleKey: 'rfHeavyBleedingAnemiaTitle',
      descriptionKey: 'rfHeavyBleedingAnemiaDesc',
      actionKey: 'rfHeavyBleedingAnemiaAction',
      dates,
    });
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Main evaluation function
// ---------------------------------------------------------------------------

export function evaluateRedFlags(input: RedFlagInput): RedFlag[] {
  const { periods, symptoms, onboarding } = input;
  const ageGroup = getAgeGroup(onboarding);

  const flags: RedFlag[] = [];

  flags.push(...checkLongBleeding(periods));
  flags.push(...checkHeavyBleeding(periods, symptoms));
  flags.push(...checkIrregularCycles(periods, ageGroup));
  flags.push(...checkNoPeriod(periods));
  flags.push(...checkBleedingBetweenPeriods(symptoms));
  flags.push(...checkSeverePain(symptoms));
  flags.push(...checkHeavyBleedingWithAnemia(periods, symptoms));

  // Sort: urgent first, then by date descending
  flags.sort((a, b) => {
    if (a.severity === 'urgent' && b.severity !== 'urgent') return -1;
    if (a.severity !== 'urgent' && b.severity === 'urgent') return 1;
    const aDate = a.dates?.[0] ?? '';
    const bDate = b.dates?.[0] ?? '';
    return bDate.localeCompare(aDate);
  });

  return flags;
}

// ---------------------------------------------------------------------------
// Static warning signs that logs cannot detect
// ---------------------------------------------------------------------------

export interface StaticWarning {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

export const STATIC_WARNINGS: StaticWarning[] = [
  {
    id: 'first-period-15',
    titleKey: 'rfStaticFirstPeriodTitle',
    descriptionKey: 'rfStaticFirstPeriodDesc',
  },
  {
    id: 'sudden-change',
    titleKey: 'rfStaticSuddenChangeTitle',
    descriptionKey: 'rfStaticSuddenChangeDesc',
  },
  {
    id: 'post-menopause',
    titleKey: 'rfStaticPostMenopauseTitle',
    descriptionKey: 'rfStaticPostMenopauseDesc',
  },
];

export interface UrgentWarning {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

export const URGENT_WARNINGS: UrgentWarning[] = [
  {
    id: 'fainting',
    titleKey: 'rfUrgentFaintingTitle',
    descriptionKey: 'rfUrgentFaintingDesc',
  },
  {
    id: 'severe-worsening-pain',
    titleKey: 'rfUrgentSeverePainTitle',
    descriptionKey: 'rfUrgentSeverePainDesc',
  },
  {
    id: 'heavy-bleeding-dizziness',
    titleKey: 'rfUrgentHeavyBleedingDizzinessTitle',
    descriptionKey: 'rfUrgentHeavyBleedingDizzinessDesc',
  },
];

// ---------------------------------------------------------------------------
// Print summary generation
// ---------------------------------------------------------------------------

export function generateVisitSummary(
  periods: PeriodEntry[],
  symptoms: SymptomEntry[],
  flags: RedFlag[],
  lang: 'en' | 'hi'
): string {
  const en = lang === 'en';
  const lines: string[] = [];

  lines.push(en ? 'Saheli — Healthcare Visit Summary' : 'Saheli — चिकित्सक अपॉइंटमेंट सारांश');
  lines.push(new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  lines.push('');
  lines.push(en ? 'This summary is for reference only and is not a diagnosis.' : 'यह सारांश केवल संदर्भ के लिए है और निदान नहीं है।');
  lines.push('');

  // Cycle history
  const cycleLengths = calculateCycleLengths(periods);
  const avgPeriod = averagePeriodLength(periods);
  lines.push(en ? '--- Cycle History ---' : '--- चक्र इतिहास ---');
  if (cycleLengths.length > 0) {
    lines.push(en ? `Recorded cycles: ${cycleLengths.length}` : `दर्ज चक्र: ${cycleLengths.length}`);
    lines.push(en ? `Cycle lengths (days): ${cycleLengths.join(', ')}` : `चक्र लंबाई (दिन): ${cycleLengths.join(', ')}`);
  } else {
    lines.push(en ? 'No completed cycles recorded yet.' : 'अभी तक कोई पूर्ण चक्र दर्ज नहीं।');
  }
  if (avgPeriod) {
    lines.push(en ? `Average period length: ${avgPeriod} days` : `औसत अवधि लंबाई: ${avgPeriod} दिन`);
  }
  lines.push('');

  // Period start dates and bleeding duration
  lines.push(en ? '--- Period Records ---' : '--- अवधि रिकॉर्ड ---');
  if (periods.length === 0) {
    lines.push(en ? 'No periods recorded.' : 'कोई अवधि दर्ज नहीं।');
  } else {
    for (const p of periods) {
      const dur = periodDurationDays(p);
      const durStr = dur !== null ? ` (${dur} ${en ? 'days' : 'दिन'})` : '';
      lines.push(`${p.startDate}${p.endDate ? ' to ' + p.endDate : ''}${durStr} — ${en ? 'Flow' : 'फ्लो'}: ${p.flow}`);
    }
  }
  lines.push('');

  // Symptoms
  lines.push(en ? '--- Symptom Records ---' : '--- लक्षण रिकॉर्ड ---');
  if (symptoms.length === 0) {
    lines.push(en ? 'No symptoms recorded.' : 'कोई लक्षण दर्ज नहीं।');
  } else {
    for (const s of symptoms) {
      const symList = s.symptoms.length > 0 ? s.symptoms.join(', ') : (en ? 'none' : 'कोई नहीं');
      lines.push(`${s.date}: ${en ? 'Pain' : 'दर्द'} ${s.painLevel}/10, ${en ? 'Mood' : 'मूड'}: ${s.mood}, ${en ? 'Symptoms' : 'लक्षण'}: ${symList}`);
      if (s.notes) lines.push(`  ${en ? 'Notes' : 'नोट्स'}: ${s.notes}`);
    }
  }
  lines.push('');

  // Flagged patterns
  lines.push(en ? '--- Flagged Patterns ---' : '--- चिह्नित पैटर्न ---');
  if (flags.length === 0) {
    lines.push(en ? 'No patterns flagged.' : 'कोई पैटर्न चिह्नित नहीं।');
  } else {
    for (const f of flags) {
      const severity = f.severity === 'urgent' ? (en ? 'URGENT' : 'आपातकालीन') : (en ? 'Routine' : 'नियमित');
      lines.push(`[${severity}] ${f.id}`);
      if (f.dates && f.dates.length > 0) {
        lines.push(`  ${en ? 'Dates' : 'तिथियां'}: ${f.dates.join(', ')}`);
      }
    }
  }
  lines.push('');

  // Questions section
  lines.push(en ? '--- My Questions for the Clinician ---' : '--- चिकित्सक के लिए मेरे प्रश्न ---');
  lines.push(en ? '1.' : '1.');
  lines.push(en ? '2.' : '2.');
  lines.push(en ? '3.' : '3.');
  lines.push('');
  lines.push(en ? 'Generated by Saheli. This does not replace professional medical advice.' : 'Saheli द्वारा उत्पन्न। यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।');

  return lines.join('\n');
}

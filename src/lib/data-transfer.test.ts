import { describe, it, expect } from 'vitest';
import {
  EXPORT_VERSION,
  EXPORT_APP_ID,
  buildExport,
  exportToJsonString,
  periodsToCsv,
  symptomsToCsv,
  parseBackupFile,
  validateExport,
  buildImportPreview,
  applyImport,
  type SaheliExport,
} from './data-transfer';
import type { PeriodEntry, SymptomEntry, OnboardingPrefs, ReminderPrefs, UserProfile } from '../types';

const defaultOnboarding: OnboardingPrefs = {
  completed: true,
  language: 'en',
  interests: ['tracking'],
  trackingEnabled: true,
  privacyAcknowledged: true,
  remindersEnabled: false,
};

const defaultReminders: ReminderPrefs = {
  enabled: false,
  periodAlerts: true,
  loggingReminders: false,
  reminderTime: '09:00',
  discreetMode: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

const defaultProfile: UserProfile = {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: '2026-10-01',
};

const samplePeriod: PeriodEntry = {
  id: 'p1',
  startDate: '2026-10-01',
  endDate: '2026-10-06',
  flow: 'medium',
  notes: 'normal',
  createdAt: '2026-10-01T08:00:00Z',
  updatedAt: '2026-10-01T08:00:00Z',
};

const sampleSymptom: SymptomEntry = {
  id: 's1',
  date: '2026-10-02',
  symptoms: ['cramps', 'headache'],
  painLevel: 5,
  mood: 'okay',
  energy: 'low',
  sleep: 'fair',
  notes: 'tough day',
  createdAt: '2026-10-02T08:00:00Z',
  updatedAt: '2026-10-02T08:00:00Z',
};

function makeExportData(): SaheliExport['data'] {
  return {
    periods: [samplePeriod],
    symptoms: [sampleSymptom],
    onboarding: defaultOnboarding,
    reminders: defaultReminders,
    profile: defaultProfile,
  };
}

function makeExport(): SaheliExport {
  return buildExport(makeExportData());
}

describe('data-transfer export', () => {
  it('builds a versioned export with timestamp', () => {
    const exp = makeExport();
    expect(exp.appId).toBe(EXPORT_APP_ID);
    expect(exp.version).toBe(EXPORT_VERSION);
    expect(exp.exportedAt).toBeTruthy();
    expect(exp.data.periods).toHaveLength(1);
    expect(exp.data.symptoms).toHaveLength(1);
  });

  it('serializes to JSON string', () => {
    const json = exportToJsonString(makeExportData());
    const parsed = JSON.parse(json);
    expect(parsed.appId).toBe(EXPORT_APP_ID);
    expect(parsed.version).toBe(EXPORT_VERSION);
  });

  it('generates CSV for periods with header', () => {
    const csv = periodsToCsv([samplePeriod]);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('id,startDate,endDate,flow,notes,createdAt,updatedAt');
    expect(lines[1]).toContain('p1');
    expect(lines[1]).toContain('medium');
  });

  it('generates CSV for symptoms with semicolon-joined symptoms', () => {
    const csv = symptomsToCsv([sampleSymptom]);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('id,date,symptoms,painLevel,mood,energy,sleep,notes,createdAt,updatedAt');
    expect(lines[1]).toContain('cramps;headache');
  });

  it('handles empty period CSV', () => {
    const csv = periodsToCsv([]);
    expect(csv).toBe('id,startDate,endDate,flow,notes,createdAt,updatedAt');
  });

  it('escapes commas and quotes in CSV', () => {
    const p: PeriodEntry = { ...samplePeriod, id: 'p2', notes: 'has, comma and "quote"' };
    const csv = periodsToCsv([p]);
    expect(csv).toContain('"has, comma and ""quote"""');
  });
});

describe('data-transfer validation', () => {
  it('accepts a valid export', () => {
    const result = validateExport(makeExport());
    expect(result.ok).toBe(true);
    expect(result.export).not.toBeNull();
    expect(result.error).toBe('');
  });

  it('accepts a valid export parsed from JSON string', () => {
    const json = exportToJsonString(makeExportData());
    const result = parseBackupFile(json);
    expect(result.ok).toBe(true);
    expect(result.export).not.toBeNull();
  });

  it('rejects malformed JSON', () => {
    const result = parseBackupFile('not json {{{');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('not valid JSON');
  });

  it('rejects wrong app id', () => {
    const exp = makeExport();
    (exp as unknown as Record<string, unknown>).appId = 'other-app';
    const result = validateExport(exp);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('not a Saheli backup');
  });

  it('rejects wrong version', () => {
    const exp = makeExport();
    (exp as unknown as Record<string, unknown>).version = 99;
    const result = validateExport(exp);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Unsupported backup version');
  });
  it('rejects invalid period entry (bad flow)', () => {
    const exp = makeExport();
    exp.data.periods = [{ ...samplePeriod, flow: 'invalid' as unknown as PeriodEntry['flow'] }];
    const result = validateExport(exp);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('invalid period entry');
  });

  it('rejects invalid symptom entry (bad painLevel)', () => {
    const exp = makeExport();
    exp.data.symptoms = [{ ...sampleSymptom, painLevel: 99 }];
    const result = validateExport(exp);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('invalid symptom entry');
  });

  it('rejects non-object input', () => {
    const result = validateExport('string');
    expect(result.ok).toBe(false);
  });

  it('rejects missing data section', () => {
    const result = validateExport({ appId: EXPORT_APP_ID, version: EXPORT_VERSION, exportedAt: 'x' });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Missing data section');
  });
});

describe('data-transfer import preview', () => {
  it('shows all-new records when current is empty', () => {
    const incoming = makeExport();
    const current: SaheliExport['data'] = {
      periods: [], symptoms: [],
      onboarding: { ...defaultOnboarding, completed: false },
      reminders: defaultReminders,
      profile: defaultProfile,
    };
    const preview = buildImportPreview(incoming, current);
    expect(preview.periods.added).toBe(1);
    expect(preview.periods.updated).toBe(0);
    expect(preview.symptoms.added).toBe(1);
    expect(preview.symptoms.updated).toBe(0);
  });

  it('shows updated count when same id exists', () => {
    const incoming = makeExport();
    const current: SaheliExport['data'] = {
      periods: [{ ...samplePeriod, flow: 'heavy' }],
      symptoms: [{ ...sampleSymptom, painLevel: 3 }],
      onboarding: defaultOnboarding,
      reminders: defaultReminders,
      profile: defaultProfile,
    };
    const preview = buildImportPreview(incoming, current);
    expect(preview.periods.added).toBe(0);
    expect(preview.periods.updated).toBe(1);
    expect(preview.symptoms.added).toBe(0);
    expect(preview.symptoms.updated).toBe(1);
  });
});

describe('data-transfer applyImport merge', () => {
  it('deduplicates by id, incoming overwrites existing', () => {
    const incoming = makeExport();
    const current: SaheliExport['data'] = {
      periods: [{ ...samplePeriod, flow: 'heavy' }, { ...samplePeriod, id: 'p-existing', startDate: '2026-09-01' }],
      symptoms: [{ ...sampleSymptom, painLevel: 3 }, { ...sampleSymptom, id: 's-existing', date: '2026-09-02' }],
      onboarding: defaultOnboarding,
      reminders: defaultReminders,
      profile: defaultProfile,
    };
    const result = applyImport(incoming, current, 'merge');
    const ids = result.periods.map(p => p.id);
    expect(ids).toContain('p1');
    expect(ids).toContain('p-existing');
    expect(result.periods).toHaveLength(2);
    // p1 should have the incoming flow (medium), not heavy
    const p1 = result.periods.find(p => p.id === 'p1');
    expect(p1?.flow).toBe('medium');

    const sIds = result.symptoms.map(s => s.id);
    expect(sIds).toContain('s1');
    expect(sIds).toContain('s-existing');
    expect(result.symptoms).toHaveLength(2);
    const s1 = result.symptoms.find(s => s.id === 's1');
    expect(s1?.painLevel).toBe(5);
  });

  it('does not duplicate when incoming has same ids as current', () => {
    const incoming = makeExport();
    const current = makeExportData();
    const result = applyImport(incoming, current, 'merge');
    expect(result.periods).toHaveLength(1);
    expect(result.symptoms).toHaveLength(1);
  });
});

describe('data-transfer applyImport replace', () => {
  it('replaces all data with incoming', () => {
    const incoming = makeExport();
    const current: SaheliExport['data'] = {
      periods: [{ ...samplePeriod, id: 'old-1' }, { ...samplePeriod, id: 'old-2' }],
      symptoms: [{ ...sampleSymptom, id: 'old-s1' }],
      onboarding: defaultOnboarding,
      reminders: defaultReminders,
      profile: defaultProfile,
    };
    const result = applyImport(incoming, current, 'replace');
    expect(result.periods).toHaveLength(1);
    expect(result.periods[0].id).toBe('p1');
    expect(result.symptoms).toHaveLength(1);
    expect(result.symptoms[0].id).toBe('s1');
    // old data gone
    expect(result.periods.find(p => p.id === 'old-1')).toBeUndefined();
  });
});

describe('data-transfer empty data', () => {
  it('handles empty periods and symptoms in export', () => {
    const data: SaheliExport['data'] = {
      periods: [],
      symptoms: [],
      onboarding: defaultOnboarding,
      reminders: defaultReminders,
      profile: defaultProfile,
    };
    const exp = buildExport(data);
    const result = validateExport(exp);
    expect(result.ok).toBe(true);
    expect(result.export?.data.periods).toHaveLength(0);
    expect(result.export?.data.symptoms).toHaveLength(0);
  });

  it('handles empty data in merge import', () => {
    const incoming = buildExport({
      periods: [], symptoms: [],
      onboarding: defaultOnboarding,
      reminders: defaultReminders,
      profile: defaultProfile,
    });
    const current = makeExportData();
    const result = applyImport(incoming, current, 'merge');
    // current periods/symptoms should remain since incoming has none
    expect(result.periods).toHaveLength(1);
    expect(result.symptoms).toHaveLength(1);
  });

  it('handles empty data in replace import', () => {
    const incoming = buildExport({
      periods: [], symptoms: [],
      onboarding: defaultOnboarding,
      reminders: defaultReminders,
      profile: defaultProfile,
    });
    const current = makeExportData();
    const result = applyImport(incoming, current, 'replace');
    expect(result.periods).toHaveLength(0);
    expect(result.symptoms).toHaveLength(0);
  });
});

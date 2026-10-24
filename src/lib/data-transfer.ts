// On-device data export, import, CSV generation, and validation.
// No data leaves the device through this module.

import type { PeriodEntry, SymptomEntry, OnboardingPrefs, ReminderPrefs, UserProfile } from '../types';

export const EXPORT_VERSION = 1 as const;
export const EXPORT_APP_ID = 'saheli' as const;

export interface SaheliExport {
  appId: typeof EXPORT_APP_ID;
  version: typeof EXPORT_VERSION;
  exportedAt: string;
  data: {
    periods: PeriodEntry[];
    symptoms: SymptomEntry[];
    onboarding: OnboardingPrefs;
    reminders: ReminderPrefs;
    profile: UserProfile;
  };
}

export type ImportMode = 'merge' | 'replace';

export interface ImportPreview {
  periods: { added: number; updated: number; total: number };
  symptoms: { added: number; updated: number; total: number };
  onboarding: boolean;
  reminders: boolean;
  profile: boolean;
}

export type ImportResult = SaheliExport['data'];

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function buildExport(data: SaheliExport['data']): SaheliExport {
  return {
    appId: EXPORT_APP_ID,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function exportToJsonString(data: SaheliExport['data']): string {
  return JSON.stringify(buildExport(data), null, 2);
}

function csvEscape(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function periodsToCsv(periods: PeriodEntry[]): string {
  const header = ['id', 'startDate', 'endDate', 'flow', 'notes', 'createdAt', 'updatedAt'];
  const rows = periods.map(p =>
    [p.id, p.startDate, p.endDate ?? '', p.flow, p.notes ?? '', p.createdAt, p.updatedAt]
      .map(csvEscape).join(',')
  );
  return [header.join(','), ...rows].join('\n');
}

export function symptomsToCsv(symptoms: SymptomEntry[]): string {
  const header = ['id', 'date', 'symptoms', 'painLevel', 'mood', 'energy', 'sleep', 'notes', 'createdAt', 'updatedAt'];
  const rows = symptoms.map(s =>
    [s.id, s.date, s.symptoms.join(';'), s.painLevel, s.mood, s.energy, s.sleep, s.notes ?? '', s.createdAt, s.updatedAt]
      .map(csvEscape).join(',')
  );
  return [header.join(','), ...rows].join('\n');
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isPeriodEntry(v: unknown): v is PeriodEntry {
  if (!isObject(v)) return false;
  if (typeof v.id !== 'string') return false;
  if (typeof v.startDate !== 'string') return false;
  if (v.endDate !== undefined && typeof v.endDate !== 'string') return false;
  if (typeof v.flow !== 'string' || !['light', 'medium', 'heavy', 'spotting'].includes(v.flow)) return false;
  if (v.notes !== undefined && typeof v.notes !== 'string') return false;
  if (typeof v.createdAt !== 'string') return false;
  if (typeof v.updatedAt !== 'string') return false;
  return true;
}

function isSymptomEntry(v: unknown): v is SymptomEntry {
  if (!isObject(v)) return false;
  if (typeof v.id !== 'string') return false;
  if (typeof v.date !== 'string') return false;
  if (!Array.isArray(v.symptoms) || !v.symptoms.every((s) => typeof s === 'string')) return false;
  if (typeof v.painLevel !== 'number' || v.painLevel < 0 || v.painLevel > 10) return false;
  if (typeof v.mood !== 'string' || !['great', 'good', 'okay', 'low', 'upset'].includes(v.mood)) return false;
  if (typeof v.energy !== 'string' || !['high', 'medium', 'low', 'exhausted'].includes(v.energy)) return false;
  if (typeof v.sleep !== 'string' || !['good', 'fair', 'poor', 'none'].includes(v.sleep)) return false;
  if (v.notes !== undefined && typeof v.notes !== 'string') return false;
  if (typeof v.createdAt !== 'string') return false;
  if (typeof v.updatedAt !== 'string') return false;
  return true;
}

function isOnboardingPrefs(v: unknown): v is OnboardingPrefs {
  if (!isObject(v)) return false;
  if (typeof v.completed !== 'boolean') return false;
  if (typeof v.language !== 'string' || !['en', 'hi'].includes(v.language)) return false;
  if (!Array.isArray(v.interests) || !v.interests.every((i) => typeof i === 'string')) return false;
  if (typeof v.trackingEnabled !== 'boolean') return false;
  if (typeof v.privacyAcknowledged !== 'boolean') return false;
  if (typeof v.remindersEnabled !== 'boolean') return false;
  return true;
}

function isReminderPrefs(v: unknown): v is ReminderPrefs {
  if (!isObject(v)) return false;
  if (typeof v.enabled !== 'boolean') return false;
  if (typeof v.periodAlerts !== 'boolean') return false;
  if (typeof v.loggingReminders !== 'boolean') return false;
  if (typeof v.reminderTime !== 'string') return false;
  if (typeof v.discreetMode !== 'boolean') return false;
  if (typeof v.quietHoursStart !== 'string') return false;
  if (typeof v.quietHoursEnd !== 'string') return false;
  return true;
}

function isUserProfile(v: unknown): v is UserProfile {
  if (!isObject(v)) return false;
  if (v.cycleLength !== null && typeof v.cycleLength !== 'number') return false;
  if (v.periodLength !== null && typeof v.periodLength !== 'number') return false;
  if (v.lastPeriodStart !== null && typeof v.lastPeriodStart !== 'string') return false;
  return true;
}

export interface ValidationResult {
  ok: boolean;
  export: SaheliExport | null;
  error: string;
}

export function validateExport(raw: unknown): ValidationResult {
  if (!isObject(raw)) return { ok: false, export: null, error: 'File is not a valid JSON object.' };
  if (raw.appId !== EXPORT_APP_ID) return { ok: false, export: null, error: 'This file is not a Saheli backup.' };
  if (raw.version !== EXPORT_VERSION) return { ok: false, export: null, error: `Unsupported backup version: ${String(raw.version)}. Expected version ${EXPORT_VERSION}.` };
  if (typeof raw.exportedAt !== 'string') return { ok: false, export: null, error: 'Missing or invalid export timestamp.' };
  if (!isObject(raw.data)) return { ok: false, export: null, error: 'Missing data section in backup.' };

  const d = raw.data as Record<string, unknown>;

  if (!Array.isArray(d.periods)) return { ok: false, export: null, error: 'Period data is missing or not an array.' };
  if (!Array.isArray(d.symptoms)) return { ok: false, export: null, error: 'Symptom data is missing or not an array.' };

  const validPeriods = d.periods.filter(isPeriodEntry);
  if (validPeriods.length !== d.periods.length) {
    return { ok: false, export: null, error: `Backup contains ${d.periods.length - validPeriods.length} invalid period entry/entries.` };
  }

  const validSymptoms = d.symptoms.filter(isSymptomEntry);
  if (validSymptoms.length !== d.symptoms.length) {
    return { ok: false, export: null, error: `Backup contains ${d.symptoms.length - validSymptoms.length} invalid symptom entry/entries.` };
  }

  if (!isOnboardingPrefs(d.onboarding)) return { ok: false, export: null, error: 'Onboarding preferences in backup are invalid.' };
  if (!isReminderPrefs(d.reminders)) return { ok: false, export: null, error: 'Reminder preferences in backup are invalid.' };
  if (!isUserProfile(d.profile)) return { ok: false, export: null, error: 'Profile data in backup is invalid.' };

  return {
    ok: true,
    error: '',
    export: {
      appId: EXPORT_APP_ID,
      version: EXPORT_VERSION,
      exportedAt: raw.exportedAt as string,
      data: {
        periods: validPeriods,
        symptoms: validSymptoms,
        onboarding: d.onboarding,
        reminders: d.reminders,
        profile: d.profile,
      },
    },
  };
}

export function parseBackupFile(text: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, export: null, error: 'File is not valid JSON.' };
  }
  return validateExport(parsed);
}

// ---------------------------------------------------------------------------
// Import preview + apply
// ---------------------------------------------------------------------------

export function buildImportPreview(
  incoming: SaheliExport,
  current: { periods: PeriodEntry[]; symptoms: SymptomEntry[]; onboarding: OnboardingPrefs; reminders: ReminderPrefs; profile: UserProfile }
): ImportPreview {
  const currentPeriodIds = new Set(current.periods.map(p => p.id));
  const currentSymptomIds = new Set(current.symptoms.map(s => s.id));

  const periodsAdded = incoming.data.periods.filter(p => !currentPeriodIds.has(p.id)).length;
  const periodsUpdated = incoming.data.periods.length - periodsAdded;

  const symptomsAdded = incoming.data.symptoms.filter(s => !currentSymptomIds.has(s.id)).length;
  const symptomsUpdated = incoming.data.symptoms.length - symptomsAdded;

  const onboardingChanged = JSON.stringify(incoming.data.onboarding) !== JSON.stringify(current.onboarding);
  const remindersChanged = JSON.stringify(incoming.data.reminders) !== JSON.stringify(current.reminders);
  const profileChanged = JSON.stringify(incoming.data.profile) !== JSON.stringify(current.profile);

  return {
    periods: { added: periodsAdded, updated: periodsUpdated, total: incoming.data.periods.length },
    symptoms: { added: symptomsAdded, updated: symptomsUpdated, total: incoming.data.symptoms.length },
    onboarding: onboardingChanged,
    reminders: remindersChanged,
    profile: profileChanged,
  };
}

export function applyImport(
  incoming: SaheliExport,
  current: { periods: PeriodEntry[]; symptoms: SymptomEntry[]; onboarding: OnboardingPrefs; reminders: ReminderPrefs; profile: UserProfile },
  mode: ImportMode
): ImportResult {
  if (mode === 'replace') {
    return {
      periods: [...incoming.data.periods].sort((a, b) => a.startDate.localeCompare(b.startDate)),
      symptoms: [...incoming.data.symptoms].sort((a, b) => a.date.localeCompare(b.date)),
      onboarding: incoming.data.onboarding,
      reminders: incoming.data.reminders,
      profile: incoming.data.profile,
    };
  }

  // merge: dedupe by id, incoming overwrites existing
  const periodMap = new Map<string, PeriodEntry>(current.periods.map(p => [p.id, p]));
  for (const p of incoming.data.periods) {
    periodMap.set(p.id, p);
  }
  const symptomMap = new Map<string, SymptomEntry>(current.symptoms.map(s => [s.id, s]));
  for (const s of incoming.data.symptoms) {
    symptomMap.set(s.id, s);
  }

  return {
    periods: Array.from(periodMap.values()).sort((a, b) => a.startDate.localeCompare(b.startDate)),
    symptoms: Array.from(symptomMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
    onboarding: incoming.data.onboarding,
    reminders: incoming.data.reminders,
    profile: incoming.data.profile,
  };
}

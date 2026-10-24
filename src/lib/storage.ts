// Local storage layer — privacy-first, all data stays on-device

import type { PeriodEntry, SymptomEntry, OnboardingPrefs, ReminderPrefs, UserProfile } from '../types';
import type { SaheliExport } from './data-transfer';

const KEYS = {
  PERIODS: 'saheli_periods',
  SYMPTOMS: 'saheli_symptoms',
  ONBOARDING: 'saheli_onboarding',
  REMINDERS: 'saheli_reminders',
  PROFILE: 'saheli_profile',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write to storage', e);
  }
}

// Period entries
export function getPeriods(): PeriodEntry[] {
  return read<PeriodEntry[]>(KEYS.PERIODS, []);
}

export function savePeriods(entries: PeriodEntry[]): void {
  write(KEYS.PERIODS, entries);
}

export function addPeriod(entry: PeriodEntry): PeriodEntry[] {
  const periods = getPeriods();
  periods.push(entry);
  periods.sort((a, b) => a.startDate.localeCompare(b.startDate));
  savePeriods(periods);
  return periods;
}

export function updatePeriod(id: string, updates: Partial<PeriodEntry>): PeriodEntry[] {
  const periods = getPeriods().map(p =>
    p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
  );
  savePeriods(periods);
  return periods;
}

export function deletePeriod(id: string): PeriodEntry[] {
  const periods = getPeriods().filter(p => p.id !== id);
  savePeriods(periods);
  return periods;
}

// Symptom entries
export function getSymptoms(): SymptomEntry[] {
  return read<SymptomEntry[]>(KEYS.SYMPTOMS, []);
}

export function saveSymptoms(entries: SymptomEntry[]): void {
  write(KEYS.SYMPTOMS, entries);
}

export function addSymptom(entry: SymptomEntry): SymptomEntry[] {
  const symptoms = getSymptoms();
  symptoms.push(entry);
  symptoms.sort((a, b) => a.date.localeCompare(b.date));
  saveSymptoms(symptoms);
  return symptoms;
}

export function updateSymptom(id: string, updates: Partial<SymptomEntry>): SymptomEntry[] {
  const symptoms = getSymptoms().map(s =>
    s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
  );
  saveSymptoms(symptoms);
  return symptoms;
}

export function deleteSymptom(id: string): SymptomEntry[] {
  const symptoms = getSymptoms().filter(s => s.id !== id);
  saveSymptoms(symptoms);
  return symptoms;
}

// Onboarding
export function getOnboarding(): OnboardingPrefs {
  return read<OnboardingPrefs>(KEYS.ONBOARDING, {
    completed: false,
    language: 'en',
    interests: [],
    trackingEnabled: true,
    privacyAcknowledged: false,
    remindersEnabled: false,
  });
}

export function saveOnboarding(prefs: OnboardingPrefs): void {
  write(KEYS.ONBOARDING, prefs);
}

// Reminders
export function getReminders(): ReminderPrefs {
  return read<ReminderPrefs>(KEYS.REMINDERS, {
    enabled: false,
    periodAlerts: true,
    loggingReminders: false,
    reminderTime: '09:00',
    discreetMode: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
}

export function saveReminders(prefs: ReminderPrefs): void {
  write(KEYS.REMINDERS, prefs);
}

// Profile
export function getProfile(): UserProfile {
  return read<UserProfile>(KEYS.PROFILE, {
    cycleLength: null,
    periodLength: null,
    lastPeriodStart: null,
  });
}

export function saveProfile(profile: UserProfile): void {
  write(KEYS.PROFILE, profile);
}

// Export all local data as a single object for backup/transfer
export function exportAllData(): SaheliExport['data'] {
  return {
    periods: getPeriods(),
    symptoms: getSymptoms(),
    onboarding: getOnboarding(),
    reminders: getReminders(),
    profile: getProfile(),
  };
}

// Import a complete data set, replacing all local storage
export function importAllData(data: SaheliExport['data']): void {
  savePeriods(data.periods);
  saveSymptoms(data.symptoms);
  saveOnboarding(data.onboarding);
  saveReminders(data.reminders);
  saveProfile(data.profile);
}

// Data clearing
export function clearAllData(): void {
  localStorage.removeItem(KEYS.PERIODS);
  localStorage.removeItem(KEYS.SYMPTOMS);
  localStorage.removeItem(KEYS.PROFILE);
}

export function clearOnboarding(): void {
  localStorage.removeItem(KEYS.ONBOARDING);
}

// Removes every Saheli-owned localStorage key: periods, symptoms,
// profile, onboarding, and reminder settings. Does not touch
// unrelated browser data or data sent to external services.
export function clearEverything(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}

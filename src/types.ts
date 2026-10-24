// Type definitions for Saheli

export type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting';

export interface PeriodEntry {
  id: string;
  startDate: string; // ISO date
  endDate?: string; // ISO date, optional
  flow: FlowIntensity;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SymptomEntry {
  id: string;
  date: string; // ISO date
  symptoms: string[];
  painLevel: number; // 0-10
  mood: MoodType;
  energy: EnergyLevel;
  sleep: SleepQuality;
  notes?: string;
  // Optional red-flag fields — only set when the user explicitly answers
  impactsDailyLife?: boolean; // pain stops daily activities
  bleedingBetweenPeriods?: boolean; // bleeding between periods or after sex
  clots?: boolean; // clots larger than a ₹10 coin
  padChangeFrequency?: 'normal' | '1-2hours'; // changing pad every 1-2 hours
  createdAt: string;
  updatedAt: string;
}

export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'upset';
export type EnergyLevel = 'high' | 'medium' | 'low' | 'exhausted';
export type SleepQuality = 'good' | 'fair' | 'poor' | 'none';

export interface CycleInfo {
  cycleLength?: number;
  periodLength?: number;
  cycleDay?: number;
  phase: CyclePhase;
  nextPeriodEstimate?: string;
  predictionConfidence: 'none' | 'low' | 'moderate' | 'high';
  averageCycleLength?: number;
  cycleLengths: number[];
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';

export interface OnboardingPrefs {
  completed: boolean;
  language: 'en' | 'hi';
  interests: string[];
  trackingEnabled: boolean;
  privacyAcknowledged: boolean;
  remindersEnabled: boolean;
  ageGroup?: 'minor' | 'adult' | 'unknown'; // optional, used for age-appropriate thresholds
}

export interface ReminderPrefs {
  enabled: boolean;
  periodAlerts: boolean;
  loggingReminders: boolean;
  reminderTime: string; // HH:MM
  discreetMode: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface UserProfile {
  cycleLength: number | null; // user-set average, optional
  periodLength: number | null;
  lastPeriodStart: string | null;
}

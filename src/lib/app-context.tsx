import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Lang } from './i18n';
import { t as translate, translations } from './i18n';
import type { OnboardingPrefs, ReminderPrefs, PeriodEntry, SymptomEntry } from '../types';
import * as storage from './storage';

interface AppContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations.en) => string;
  onboarding: OnboardingPrefs;
  setOnboarding: (prefs: OnboardingPrefs) => void;
  reminders: ReminderPrefs;
  setReminders: (prefs: ReminderPrefs) => void;
  periods: PeriodEntry[];
  refreshPeriods: () => void;
  symptoms: SymptomEntry[];
  refreshSymptoms: () => void;
  isOnboarded: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => storage.getOnboarding().language);
  const [onboarding, setOnboardingState] = useState<OnboardingPrefs>(() => storage.getOnboarding());
  const [reminders, setRemindersState] = useState<ReminderPrefs>(() => storage.getReminders());
  const [periods, setPeriods] = useState<PeriodEntry[]>(() => storage.getPeriods());
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(() => storage.getSymptoms());

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    const current = storage.getOnboarding();
    const updated = { ...current, language: l };
    storage.saveOnboarding(updated);
    setOnboardingState(updated);
  }, []);

  const setOnboarding = useCallback((prefs: OnboardingPrefs) => {
    storage.saveOnboarding(prefs);
    setOnboardingState(prefs);
    setLangState(prefs.language);
  }, []);

  const setReminders = useCallback((prefs: ReminderPrefs) => {
    storage.saveReminders(prefs);
    setRemindersState(prefs);
  }, []);

  const refreshPeriods = useCallback(() => {
    setPeriods(storage.getPeriods());
  }, []);

  const refreshSymptoms = useCallback(() => {
    setSymptoms(storage.getSymptoms());
  }, []);

  const t = useCallback((key: keyof typeof translations.en) => translate(lang, key), [lang]);

  return (
    <AppContext.Provider value={{
      lang, setLang, t,
      onboarding, setOnboarding,
      reminders, setReminders,
      periods, refreshPeriods,
      symptoms, refreshSymptoms,
      isOnboarded: onboarding.completed,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

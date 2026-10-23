import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import * as storage from '../lib/storage';
import { Globe, Shield, Bell, Info, Trash2, RotateCcw } from 'lucide-react';
import type { ReminderPrefs } from '../types';
import type { Lang } from '../lib/i18n';

export function Settings() {
  const { t, lang, setLang, reminders, setReminders, refreshPeriods, refreshSymptoms } = useApp();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = () => {
    storage.clearAllData();
    refreshPeriods();
    refreshSymptoms();
    setShowClearConfirm(false);
  };

  const handleRestartOnboarding = () => {
    storage.clearOnboarding();
    storage.clearAllData();
    navigate('/');
    window.location.reload();
  };

  const updateReminder = (updates: Partial<ReminderPrefs>) => {
    setReminders({ ...reminders, ...updates });
  };

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold text-plum-700">{t('settingsTitle')}</h1>

      {/* Language */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Globe size={18} className="text-coral-400" />
          <h2 className="text-sm font-semibold text-plum-500">{t('settingsLanguage')}</h2>
        </div>
        <div className="space-y-2">
          {[
            { code: 'en' as Lang, label: 'English' },
            { code: 'hi' as Lang, label: 'हिन्दी (Hindi)' },
          ].map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all ${
                lang === l.code ? 'border-coral-300 bg-coral-50' : 'border-cream-200 hover:bg-cream-50'
              }`}>
              <span className="text-sm font-medium text-plum-600">{l.label}</span>
              {lang === l.code && <span className="text-coral-500">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Shield size={18} className="text-lavender-500" />
          <h2 className="text-sm font-semibold text-plum-500">{t('settingsPrivacy')}</h2>
        </div>
        <div className="mb-4 rounded-xl bg-cream-50 p-4">
          <p className="text-sm leading-relaxed text-plum-400">{t('settingsDataStored')}</p>
        </div>
        {showClearConfirm ? (
          <div className="rounded-xl border border-coral-200 bg-blush-100 p-4">
            <p className="mb-3 text-sm text-coral-600">{t('settingsClearConfirm')}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowClearConfirm(false)} className="btn-secondary flex-1">{t('commonCancel')}</button>
              <button onClick={handleClearData} className="btn-primary flex-1 bg-coral-500 hover:bg-coral-600">
                <Trash2 size={16} /> {t('settingsClear')}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowClearConfirm(true)} className="btn-secondary w-full text-coral-500">
            <Trash2 size={16} /> {t('settingsClearData')}
          </button>
        )}
      </div>

      {/* Reminders */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Bell size={18} className="text-blush-400" />
          <h2 className="text-sm font-semibold text-plum-500">{t('settingsReminders')}</h2>
        </div>
        <div className="space-y-3">
          <ToggleRow
            label={t('settingsEnableReminders')}
            value={reminders.enabled}
            onChange={v => updateReminder({ enabled: v })}
          />
          {reminders.enabled && (
            <>
              <ToggleRow label={t('settingsPeriodAlerts')} value={reminders.periodAlerts} onChange={v => updateReminder({ periodAlerts: v })} />
              <ToggleRow label={t('settingsLoggingReminders')} value={reminders.loggingReminders} onChange={v => updateReminder({ loggingReminders: v })} />
              <div className="rounded-xl bg-cream-50 p-3">
                <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('settingsReminderTime')}</label>
                <input type="time" value={reminders.reminderTime} onChange={e => updateReminder({ reminderTime: e.target.value })} className="input-field" />
              </div>
              <ToggleRow label={t('settingsDiscreetMode')} desc={t('settingsDiscreetDesc')} value={reminders.discreetMode} onChange={v => updateReminder({ discreetMode: v })} />
              <div className="rounded-xl bg-cream-50 p-3">
                <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('settingsQuietHours')}</label>
                <div className="flex items-center gap-2">
                  <input type="time" value={reminders.quietHoursStart} onChange={e => updateReminder({ quietHoursStart: e.target.value })} className="input-field" />
                  <span className="text-plum-400">—</span>
                  <input type="time" value={reminders.quietHoursEnd} onChange={e => updateReminder({ quietHoursEnd: e.target.value })} className="input-field" />
                </div>
              </div>
              <p className="text-xs text-plum-300">Reminder preferences are saved on your device. Background notifications depend on your device settings and browser permissions.</p>
            </>
          )}
        </div>
      </div>

      {/* About */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Info size={18} className="text-plum-400" />
          <h2 className="text-sm font-semibold text-plum-500">{t('settingsAbout')}</h2>
        </div>
        <p className="text-sm leading-relaxed text-plum-500">
          Saheli is a free, privacy-conscious menstrual health companion. It provides general educational information from trusted public-health sources. It does not diagnose conditions, replace professional medical advice, or claim clinical validation.
        </p>
        <p className="mt-2 text-xs text-plum-300">
          Sources include WHO, UNICEF, Mayo Clinic, NHS, and ACOG. Always consult a healthcare professional for personal health concerns.
        </p>
      </div>

      {/* Restart onboarding */}
      <button onClick={handleRestartOnboarding} className="btn-ghost w-full text-plum-400">
        <RotateCcw size={16} /> {t('settingsOnboarding')}
      </button>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-cream-200 bg-white p-3">
      <div>
        <p className="text-sm font-medium text-plum-600">{label}</p>
        {desc && <p className="text-xs text-plum-400">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${value ? 'bg-coral-400' : 'bg-cream-300'}`}
        role="switch" aria-checked={value}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}

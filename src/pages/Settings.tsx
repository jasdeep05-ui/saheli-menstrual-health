import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import * as storage from '../lib/storage';
import {
  exportToJsonString,
  periodsToCsv,
  symptomsToCsv,
  downloadFile,
  parseBackupFile,
  buildImportPreview,
  applyImport,
  type ImportMode,
  type ImportPreview,
  type SaheliExport,
} from '../lib/data-transfer';
import { Globe, Shield, Bell, Info, Trash2, RotateCcw, Download, Upload, FileJson, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ReminderPrefs } from '../types';
import type { Lang } from '../lib/i18n';

type StatusKind = 'success' | 'error' | null;

export function Settings() {
  const { t, lang, setLang, reminders, setReminders, refreshAll } = useApp();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // export status
  const [exportStatus, setExportStatus] = useState<StatusKind>(null);
  const [exportMessage, setExportMessage] = useState('');

  // import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedBackup, setParsedBackup] = useState<SaheliExport | null>(null);
  const [importError, setImportError] = useState('');
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [importStatus, setImportStatus] = useState<StatusKind>(null);
  const [importStatusMsg, setImportStatusMsg] = useState('');

  const handleClearData = () => {
    storage.clearEverything();
    refreshAll();
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

  // --- Export ---

  const handleExportJson = useCallback(() => {
    const data = storage.exportAllData();
    const totalRecords = data.periods.length + data.symptoms.length;
    if (totalRecords === 0 && !data.onboarding.completed) {
      setExportStatus('error');
      setExportMessage(t('settingsExportEmpty'));
      return;
    }
    const json = exportToJsonString(data);
    const ts = new Date().toISOString().slice(0, 10);
    downloadFile(`saheli-backup-${ts}.json`, json, 'application/json');
    setExportStatus('success');
    setExportMessage(t('settingsExportSuccess'));
  }, [t]);

  const handleExportPeriodsCsv = useCallback(() => {
    const periods = storage.getPeriods();
    if (periods.length === 0) {
      setExportStatus('error');
      setExportMessage(t('settingsExportEmpty'));
      return;
    }
    const csv = periodsToCsv(periods);
    const ts = new Date().toISOString().slice(0, 10);
    downloadFile(`saheli-periods-${ts}.csv`, csv, 'text/csv');
    setExportStatus('success');
    setExportMessage(t('settingsExportSuccess'));
  }, [t]);

  const handleExportSymptomsCsv = useCallback(() => {
    const symptoms = storage.getSymptoms();
    if (symptoms.length === 0) {
      setExportStatus('error');
      setExportMessage(t('settingsExportEmpty'));
      return;
    }
    const csv = symptomsToCsv(symptoms);
    const ts = new Date().toISOString().slice(0, 10);
    downloadFile(`saheli-symptoms-${ts}.csv`, csv, 'text/csv');
    setExportStatus('success');
    setExportMessage(t('settingsExportSuccess'));
  }, [t]);

  // --- Import ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    setImportStatusMsg('');
    setImportError('');
    setParsedBackup(null);
    setImportPreview(null);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const result = parseBackupFile(text);
      if (!result.ok || !result.export) {
        setImportError(result.error || t('settingsImportInvalid'));
        return;
      }
      const current = storage.exportAllData();
      const preview = buildImportPreview(result.export, current);
      setParsedBackup(result.export);
      setImportPreview(preview);
    };
    reader.onerror = () => {
      setImportError(t('settingsImportError'));
    };
    reader.readAsText(file);

    // reset input so the same file can be selected again
    e.target.value = '';
  };

  const handleImportConfirm = () => {
    if (!parsedBackup) return;

    try {
      const current = storage.exportAllData();
      const result = applyImport(parsedBackup, current, importMode);
      storage.importAllData(result);
      refreshAll();
      setImportStatus('success');
      setImportStatusMsg(t('settingsImportSuccess'));
      setParsedBackup(null);
      setImportPreview(null);
    } catch {
      setImportStatus('error');
      setImportStatusMsg(t('settingsImportError'));
    }
  };

  const handleImportCancel = () => {
    setParsedBackup(null);
    setImportPreview(null);
    setImportError('');
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

        {/* Export */}
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-semibold text-plum-600">{t('settingsExportData')}</h3>
          <button onClick={handleExportJson} className="btn-secondary w-full">
            <FileJson size={16} /> {t('settingsExportJson')}
          </button>
          <div className="flex gap-2">
            <button onClick={handleExportPeriodsCsv} className="btn-secondary flex-1">
              <FileText size={16} /> {t('settingsExportCsv')}
            </button>
            <button onClick={handleExportSymptomsCsv} className="btn-secondary flex-1">
              <FileText size={16} /> {t('settingsExportSymptomsCsv')}
            </button>
          </div>
          {exportStatus && (
            <div className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
              exportStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-blush-100 text-coral-600'
            }`}>
              {exportStatus === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {exportMessage}
            </div>
          )}
        </div>

        {/* Import */}
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-semibold text-plum-600">{t('settingsImportData')}</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary w-full">
            <Upload size={16} /> {t('settingsImportSelect')}
          </button>

          {importError && (
            <div className="flex items-center gap-2 rounded-xl bg-blush-100 p-3 text-sm text-coral-600">
              <AlertCircle size={16} /> {importError}
            </div>
          )}

          {importPreview && parsedBackup && (
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-plum-600">{t('settingsImportPreview')}</h4>
              <div className="space-y-1 text-sm text-plum-500">
                <div className="flex justify-between">
                  <span>{t('settingsImportPeriods')}</span>
                  <span>{importPreview.periods.total} ({importPreview.periods.added} {t('settingsImportAdded')}, {importPreview.periods.updated} {t('settingsImportUpdated')})</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('settingsImportSymptoms')}</span>
                  <span>{importPreview.symptoms.total} ({importPreview.symptoms.added} {t('settingsImportAdded')}, {importPreview.symptoms.updated} {t('settingsImportUpdated')})</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-all ${
                  importMode === 'merge' ? 'border-coral-300 bg-coral-50' : 'border-cream-200 bg-white'
                }`}>
                  <input type="radio" name="importMode" value="merge" checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')} className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-plum-600">{t('settingsImportMerge')}</p>
                    <p className="text-xs text-plum-400">{t('settingsImportMergeDesc')}</p>
                  </div>
                </label>
                <label className={`flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-all ${
                  importMode === 'replace' ? 'border-coral-300 bg-coral-50' : 'border-cream-200 bg-white'
                }`}>
                  <input type="radio" name="importMode" value="replace" checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')} className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-plum-600">{t('settingsImportReplace')}</p>
                    <p className="text-xs text-plum-400">{t('settingsImportReplaceDesc')}</p>
                  </div>
                </label>
              </div>

              {importMode === 'replace' && (
                <p className="text-xs text-coral-600">{t('settingsImportReplaceWarn')}</p>
              )}

              <div className="flex gap-2">
                <button onClick={handleImportCancel} className="btn-secondary flex-1">{t('commonCancel')}</button>
                <button onClick={handleImportConfirm} className="btn-primary flex-1 bg-coral-500 hover:bg-coral-600">
                  <Download size={16} /> {t('settingsImportConfirm')}
                </button>
              </div>
            </div>
          )}

          {importStatus && (
            <div className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
              importStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-blush-100 text-coral-600'
            }`}>
              {importStatus === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {importStatusMsg}
            </div>
          )}
        </div>

        {/* Delete */}
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

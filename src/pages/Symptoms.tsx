import { useState } from 'react';
import { useApp } from '../lib/app-context';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/States';
import { BarChart } from '../components/Charts';
import * as storage from '../lib/storage';
import type { SymptomEntry, MoodType, EnergyLevel, SleepQuality } from '../types';
import { format, parseISO, subDays } from 'date-fns';
import { Plus, Edit2, Trash2, Heart } from 'lucide-react';

const SYMPTOM_OPTIONS = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Nausea', 'Breast tenderness', 'Back pain'];

export function Symptoms() {
  const { t, symptoms, refreshSymptoms } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SymptomEntry | null>(null);

  const handleDelete = (id: string) => {
    if (confirm(t('trackConfirmDelete'))) { storage.deleteSymptom(id); refreshSymptoms(); }
  };

  // Symptom frequency (last 30 days)
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recent = symptoms.filter(s => parseISO(s.date) >= thirtyDaysAgo);
  const freqMap: Record<string, number> = {};
  recent.forEach(s => s.symptoms.forEach(sym => { freqMap[sym] = (freqMap[sym] || 0) + 1; }));
  const freqData = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }));

  // Pain history (last 14 entries)
  const painData = symptoms.slice(-14).map(s => ({ label: format(parseISO(s.date), 'MMM d'), value: s.painLevel }));

  const moodEmoji: Record<MoodType, string> = { great: '😊', good: '🙂', okay: '😐', low: '😔', upset: '😢' };
  const moodLabel: Record<MoodType, string> = { great: t('moodGreat'), good: t('moodGood'), okay: t('moodOkay'), low: t('moodLow'), upset: t('moodUpset') };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-plum-700">{t('sympTitle')}</h1>
        <button className="btn-primary" onClick={() => { setEditingEntry(null); setShowForm(true); }}>
          <Plus size={18} /> {t('sympNewEntry')}
        </button>
      </div>

      {symptoms.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Heart size={28} />} title={t('sympNoEntries')} description={t('sympNoEntriesDesc')} />
        </div>
      ) : (
        <>
          {/* Symptom frequency chart */}
          {freqData.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-4 text-sm font-semibold text-plum-500">{t('sympFrequency')}</h2>
              <BarChart data={freqData} />
            </div>
          )}

          {/* Pain history chart */}
          {painData.length > 1 && (
            <div className="card p-5">
              <h2 className="mb-4 text-sm font-semibold text-plum-500">{t('sympPainHistory')}</h2>
              <BarChart data={painData} unit="/10" />
            </div>
          )}

          {/* Entry list */}
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-plum-500">All entries</h2>
            <div className="space-y-2">
              {[...symptoms].reverse().map(entry => (
                <div key={entry.id} className="rounded-xl bg-cream-50 px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{moodEmoji[entry.mood]}</span>
                      <div>
                        <p className="text-sm font-medium text-plum-600">{format(parseISO(entry.date), 'MMM d, yyyy')}</p>
                        <p className="text-xs text-plum-400">Mood: {moodLabel[entry.mood]} · Pain: {entry.painLevel}/10</p>
                        {entry.symptoms.length > 0 && <p className="mt-1 text-xs text-plum-400">{entry.symptoms.join(', ')}</p>}
                        {entry.notes && <p className="mt-1 text-xs italic text-plum-300">"{entry.notes}"</p>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingEntry(entry); setShowForm(true); }} className="btn-ghost p-2" aria-label={t('sympEdit')}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(entry.id)} className="btn-ghost p-2 text-coral-500" aria-label={t('sympDelete')}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showForm && (
        <SymptomForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingEntry(null); }}
          onSave={() => { refreshSymptoms(); setShowForm(false); setEditingEntry(null); }}
          editingEntry={editingEntry}
        />
      )}
    </div>
  );
}

function SymptomForm({ open, onClose, onSave, editingEntry }: {
  open: boolean; onClose: () => void; onSave: () => void; editingEntry: SymptomEntry | null;
}) {
  const { t } = useApp();
  const [date, setDate] = useState(editingEntry?.date || format(new Date(), 'yyyy-MM-dd'));
  const [symptoms, setSymptoms] = useState<string[]>(editingEntry?.symptoms || []);
  const [painLevel, setPainLevel] = useState(editingEntry?.painLevel ?? 0);
  const [mood, setMood] = useState<MoodType>(editingEntry?.mood || 'okay');
  const [energy, setEnergy] = useState<EnergyLevel>(editingEntry?.energy || 'medium');
  const [sleep, setSleep] = useState<SleepQuality>(editingEntry?.sleep || 'fair');
  const [notes, setNotes] = useState(editingEntry?.notes || '');

  const toggleSymptom = (sym: string) => setSymptoms(s => s.includes(sym) ? s.filter(x => x !== sym) : [...s, sym]);

  const handleSave = () => {
    if (editingEntry) {
      storage.updateSymptom(editingEntry.id, { date, symptoms, painLevel, mood, energy, sleep, notes: notes || undefined });
    } else {
      storage.addSymptom({
        id: crypto.randomUUID(), date, symptoms, painLevel, mood, energy, sleep,
        notes: notes || undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
    }
    onSave();
  };

  return (
    <Modal open={open} onClose={onClose} title={editingEntry ? t('sympEdit') : t('sympNewEntry')} size="lg">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympDate')}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" max={format(new Date(), 'yyyy-MM-dd')} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympSymptoms')}</label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map(sym => (
              <button key={sym} onClick={() => toggleSymptom(sym)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${symptoms.includes(sym) ? 'border-coral-300 bg-coral-50 text-coral-500' : 'border-cream-200 text-plum-500'}`}>
                {sym}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympPain')}: <span className="text-coral-500">{painLevel}/10</span></label>
          <input type="range" min={0} max={10} value={painLevel} onChange={e => setPainLevel(Number(e.target.value))} className="w-full accent-coral-400" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympMood')}</label>
            <select value={mood} onChange={e => setMood(e.target.value as MoodType)} className="input-field">
              <option value="great">{t('moodGreat')}</option><option value="good">{t('moodGood')}</option>
              <option value="okay">{t('moodOkay')}</option><option value="low">{t('moodLow')}</option><option value="upset">{t('moodUpset')}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympEnergy')}</label>
            <select value={energy} onChange={e => setEnergy(e.target.value as EnergyLevel)} className="input-field">
              <option value="high">{t('energyHigh')}</option><option value="medium">{t('energyMedium')}</option>
              <option value="low">{t('energyLow')}</option><option value="exhausted">{t('energyExhausted')}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympSleep')}</label>
            <select value={sleep} onChange={e => setSleep(e.target.value as SleepQuality)} className="input-field">
              <option value="good">{t('sleepGood')}</option><option value="fair">{t('sleepFair')}</option>
              <option value="poor">{t('sleepPoor')}</option><option value="none">{t('sleepNone')}</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympNotes')}</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field min-h-[60px] resize-none" placeholder="Optional notes..." />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">{t('sympCancel')}</button>
          <button onClick={handleSave} className="btn-primary flex-1">{t('sympSave')}</button>
        </div>
      </div>
    </Modal>
  );
}

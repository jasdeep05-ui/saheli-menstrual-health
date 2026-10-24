import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { getCycleInfo } from '../lib/cycle';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/States';
import { ProgressRing } from '../components/Charts';
import { articles } from '../lib/content';
import { Calendar, Heart, MessageCircle, BookOpen, LifeBuoy, Plus, Sparkles, CircleAlert as AlertCircle, Flower2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { FlowIntensity, SymptomEntry, MoodType, EnergyLevel, SleepQuality } from '../types';
import * as storage from '../lib/storage';
import { getGreeting, getDailyQuote } from '../lib/welcome';

export function Home() {
  const { t, lang, periods, symptoms, refreshPeriods, refreshSymptoms, onboarding } = useApp();
  const navigate = useNavigate();
  const [showCheckin, setShowCheckin] = useState(false);
  const [showPeriodLog, setShowPeriodLog] = useState(false);

  const [greeting] = useState(() => getGreeting());
  const [dailyQuote] = useState(() => getDailyQuote());

  const cycleInfo = getCycleInfo(periods);
  const trackingEnabled = onboarding.trackingEnabled;

  // Pick a rotating tip-of-the-day
  const tipIndex = new Date().getDate() % articles.length;
  const tip = articles[tipIndex];

  const quickActions = [
    { icon: Calendar, label: t('homeLogPeriod'), color: 'coral', action: () => setShowPeriodLog(true) },
    { icon: Heart, label: t('homeRecordSymptoms'), color: 'blush', action: () => setShowCheckin(true) },
    { icon: MessageCircle, label: t('homeAskSaheli'), color: 'lavender', action: () => navigate('/ask') },
    { icon: BookOpen, label: t('homeLearnSomething'), color: 'coral', action: () => navigate('/learn') },
    { icon: LifeBuoy, label: t('homeGetHelp'), color: 'blush', action: () => navigate('/help') },
  ];

  const phaseLabel = {
    menstrual: t('homePhaseMenstrual'),
    follicular: t('homePhaseFollicular'),
    ovulatory: t('homePhaseOvulatory'),
    luteal: t('homePhaseLuteal'),
    unknown: t('homePhaseUnknown'),
  }[cycleInfo.phase];

  return (
    <div className="space-y-5">
      {/* Welcome header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-2">
          <Flower2 size={20} className="text-coral-400 animate-sway" />
          <p className="text-sm font-medium text-coral-500">{t('homeWelcome')}</p>
        </div>
        <h1 className="mt-1 font-display text-2xl font-semibold leading-tight text-plum-500">
          {greeting}, Saheli!
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-plum-400">
          {dailyQuote}
        </p>
      </div>

      {/* Cycle overview */}
      {trackingEnabled ? (
        <div className="card p-5 animate-slide-up">
          {cycleInfo.cycleDay ? (
            <div className="flex items-center gap-5">
              <ProgressRing
                value={cycleInfo.cycleDay}
                max={cycleInfo.cycleLength || 28}
                label={lang === 'hi' ? 'दिन' : 'day'}
                size={90}
              />
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-plum-300">
                  {t('homeCycleDay')}
                </p>
                <p className="text-2xl font-semibold text-plum-700">{cycleInfo.cycleDay}</p>
                <span className="badge bg-coral-50 text-coral-500 mt-1">{phaseLabel}</span>

                {cycleInfo.nextPeriodEstimate && (
                  <div className="mt-3 rounded-lg bg-cream-50 px-3 py-2">
                    <p className="text-xs text-plum-400">{t('homeNextPeriod')}</p>
                    <p className="text-sm font-medium text-plum-600">
                      {format(parseISO(cycleInfo.nextPeriodEstimate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-[10px] text-plum-300 mt-0.5">
                      {t('homeEstimate')} · {
                        cycleInfo.predictionConfidence === 'low' ? 'Low confidence' :
                        cycleInfo.predictionConfidence === 'moderate' ? 'Moderate confidence' :
                        cycleInfo.predictionConfidence === 'high' ? 'Higher confidence' : ''
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<Calendar size={28} />}
              title={t('homeNoData')}
              description={t('homeNoDataDesc')}
              action={
                <button className="btn-primary" onClick={() => setShowPeriodLog(true)}>
                  <Plus size={18} />
                  {t('homeLogPeriod')}
                </button>
              }
            />
          )}

          {cycleInfo.cycleDay && cycleInfo.predictionConfidence === 'none' && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-cream-50 px-3 py-2">
              <AlertCircle className="mt-0.5 flex-shrink-0 text-plum-300" size={14} />
              <p className="text-xs text-plum-400">{t('homeInsufficientData')}</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-plum-500">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            const colorMap: Record<string, string> = {
              coral: 'bg-coral-50 text-coral-400',
              blush: 'bg-blush-100 text-blush-400',
              lavender: 'bg-lavender-100 text-lavender-500',
            };
            return (
              <button
                key={i}
                onClick={action.action}
                className="card flex flex-col items-center gap-2 p-4 transition-all hover:shadow-card active:scale-[0.98]"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[action.color]}`}>
                  <Icon size={20} />
                </span>
                <span className="text-xs font-medium text-plum-600 text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily check-in */}
      {trackingEnabled && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-plum-500">{t('homeDailyCheckin')}</h2>
            <button
              onClick={() => setShowCheckin(true)}
              className="btn-ghost text-coral-500"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          {symptoms.length > 0 ? (
            <LatestSymptomPreview entry={symptoms[symptoms.length - 1]} />
          ) : (
            <p className="text-sm text-plum-300">No check-in today. How are you feeling?</p>
          )}
        </div>
      )}

      {/* Tip of the day */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 bg-lavender-100 px-5 py-3">
          <Sparkles size={18} className="text-lavender-500" />
          <h2 className="text-sm font-semibold text-lavender-600">{t('homeTipOfDay')}</h2>
        </div>
        <button
          onClick={() => navigate(`/learn/${tip.id}`)}
          className="block w-full p-5 text-left transition-colors hover:bg-cream-50"
        >
          <p className="font-medium text-plum-600">{tip.title[lang]}</p>
          <p className="mt-1 text-sm text-plum-400 line-clamp-2">{tip.summary[lang]}</p>
          <span className="mt-2 text-xs text-coral-400">Read more →</span>
        </button>
      </div>

      {/* Prediction note */}
      {trackingEnabled && cycleInfo.nextPeriodEstimate && (
        <p className="px-2 text-xs leading-relaxed text-plum-300">
          {t('trackPredictionNote')}
        </p>
      )}

      {/* Modals */}
      <PeriodQuickLog
        open={showPeriodLog}
        onClose={() => setShowPeriodLog(false)}
        onSave={() => { refreshPeriods(); setShowPeriodLog(false); }}
      />
      <DailyCheckin
        open={showCheckin}
        onClose={() => setShowCheckin(false)}
        onSave={() => { refreshSymptoms(); setShowCheckin(false); }}
      />
    </div>
  );
}

function LatestSymptomPreview({ entry }: { entry: SymptomEntry }) {
  const { t } = useApp();
  const moodLabel: Record<MoodType, string> = {
    great: t('moodGreat'), good: t('moodGood'), okay: t('moodOkay'),
    low: t('moodLow'), upset: t('moodUpset'),
  };
  const moodEmoji: Record<MoodType, string> = {
    great: '😊', good: '🙂', okay: '😐', low: '😔', upset: '😢',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{moodEmoji[entry.mood]}</span>
      <div>
        <p className="text-sm text-plum-600">Mood: {moodLabel[entry.mood]}</p>
        {entry.symptoms.length > 0 && (
          <p className="text-xs text-plum-400">{entry.symptoms.join(', ')}</p>
        )}
        {entry.painLevel > 0 && (
          <p className="text-xs text-plum-400">Pain: {entry.painLevel}/10</p>
        )}
      </div>
    </div>
  );
}

// Quick period log modal
function PeriodQuickLog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: () => void }) {
  const { t } = useApp();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<FlowIntensity>('medium');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const entry = {
      id: crypto.randomUUID(),
      startDate,
      endDate: endDate || undefined,
      flow,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.addPeriod(entry);
    setNotes('');
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setEndDate('');
    setFlow('medium');
    onSave();
  };

  return (
    <Modal open={open} onClose={onClose} title={t('trackNewEntry')}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackStartDate')}</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="input-field"
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackEndDate')}</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="input-field"
            min={startDate}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackFlow')}</label>
          <div className="grid grid-cols-4 gap-2">
            {(['light', 'medium', 'heavy', 'spotting'] as FlowIntensity[]).map(f => (
              <button
                key={f}
                onClick={() => setFlow(f)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                  flow === f ? 'border-coral-300 bg-coral-50 text-coral-500' : 'border-cream-200 text-plum-500'
                }`}
              >
                {f === 'light' ? t('flowLight') : f === 'medium' ? t('flowMedium') : f === 'heavy' ? t('flowHeavy') : t('flowSpotting')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackNotes')}</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="input-field min-h-[80px] resize-none"
            placeholder="Optional notes..."
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">{t('trackCancel')}</button>
          <button onClick={handleSave} className="btn-primary flex-1">{t('trackSave')}</button>
        </div>
      </div>
    </Modal>
  );
}

// Daily check-in modal
function DailyCheckin({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: () => void }) {
  const { t } = useApp();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(0);
  const [mood, setMood] = useState<MoodType>('okay');
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [sleep, setSleep] = useState<SleepQuality>('fair');
  const [notes, setNotes] = useState('');

  const symptomOptions = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Acne', 'Nausea', 'Breast tenderness', 'Back pain'];

  const toggleSymptom = (sym: string) => {
    setSymptoms(s => s.includes(sym) ? s.filter(x => x !== sym) : [...s, sym]);
  };

  const handleSave = () => {
    const entry: SymptomEntry = {
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd'),
      symptoms,
      painLevel,
      mood,
      energy,
      sleep,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.addSymptom(entry);
    // Reset
    setSymptoms([]); setPainLevel(0); setMood('okay'); setEnergy('medium'); setSleep('fair'); setNotes('');
    onSave();
  };

  return (
    <Modal open={open} onClose={onClose} title={t('homeDailyCheckin')} size="lg">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympSymptoms')}</label>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map(sym => (
              <button
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  symptoms.includes(sym) ? 'border-coral-300 bg-coral-50 text-coral-500' : 'border-cream-200 text-plum-500'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">
            {t('sympPain')}: <span className="text-coral-500">{painLevel}/10</span>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={painLevel}
            onChange={e => setPainLevel(Number(e.target.value))}
            className="w-full accent-coral-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympMood')}</label>
            <select value={mood} onChange={e => setMood(e.target.value as MoodType)} className="input-field">
              <option value="great">{t('moodGreat')}</option>
              <option value="good">{t('moodGood')}</option>
              <option value="okay">{t('moodOkay')}</option>
              <option value="low">{t('moodLow')}</option>
              <option value="upset">{t('moodUpset')}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympEnergy')}</label>
            <select value={energy} onChange={e => setEnergy(e.target.value as EnergyLevel)} className="input-field">
              <option value="high">{t('energyHigh')}</option>
              <option value="medium">{t('energyMedium')}</option>
              <option value="low">{t('energyLow')}</option>
              <option value="exhausted">{t('energyExhausted')}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympSleep')}</label>
            <select value={sleep} onChange={e => setSleep(e.target.value as SleepQuality)} className="input-field">
              <option value="good">{t('sleepGood')}</option>
              <option value="fair">{t('sleepFair')}</option>
              <option value="poor">{t('sleepPoor')}</option>
              <option value="none">{t('sleepNone')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('sympNotes')}</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="input-field min-h-[60px] resize-none"
            placeholder="Optional notes..."
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">{t('sympCancel')}</button>
          <button onClick={handleSave} className="btn-primary flex-1">{t('sympSave')}</button>
        </div>
      </div>
    </Modal>
  );
}

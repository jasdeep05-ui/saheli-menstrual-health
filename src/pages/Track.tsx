import { useState } from 'react';
import { useApp } from '../lib/app-context';
import { getCycleInfo, getPeriodDates, getSpottingDates, getPredictedPeriodDates, calculateCycleLengths, averageCycleLength, averagePeriodLength } from '../lib/cycle';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/States';
import * as storage from '../lib/storage';
import type { PeriodEntry, FlowIntensity } from '../types';
import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Calendar } from 'lucide-react';

export function Track() {
  const { t, periods, refreshPeriods } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PeriodEntry | null>(null);

  const cycleInfo = getCycleInfo(periods);
  const periodDates = getPeriodDates(periods);
  const spottingDates = getSpottingDates(periods);
  const predictedDates = getPredictedPeriodDates(periods);
  const cycleLengths = calculateCycleLengths(periods);
  const avgCycle = averageCycleLength(periods);
  const avgPeriod = averagePeriodLength(periods);

  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEntryForDate = (dateStr: string): PeriodEntry | undefined => {
    return periods.find(p => {
      if (p.startDate === dateStr) return true;
      if (p.endDate && p.startDate <= dateStr && p.endDate >= dateStr) return true;
      return false;
    });
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = getEntryForDate(dateStr);
    if (entry) {
      setEditingEntry(entry);
      setSelectedDate(dateStr);
    } else {
      setSelectedDate(dateStr);
      setEditingEntry(null);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t('trackConfirmDelete'))) {
      storage.deletePeriod(id);
      refreshPeriods();
      setEditingEntry(null);
      setSelectedDate(null);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-plum-700">{t('trackTitle')}</h1>
        <button className="btn-primary" onClick={() => { setEditingEntry(null); setShowForm(true); }}>
          <Plus size={18} />
          {t('trackNewEntry')}
        </button>
      </div>

      {/* Summary stats */}
      {periods.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-3 text-center">
            <p className="text-xs text-plum-400">{t('trackAvgCycle')}</p>
            <p className="text-lg font-semibold text-plum-700">{avgCycle ? `${avgCycle}d` : '—'}</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-xs text-plum-400">{t('trackAvgPeriod')}</p>
            <p className="text-lg font-semibold text-plum-700">{avgPeriod ? `${avgPeriod}d` : '—'}</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-xs text-plum-400">Cycles</p>
            <p className="text-lg font-semibold text-plum-700">{cycleLengths.length}</p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="card p-4">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-ghost p-2" aria-label="Previous month">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-display text-lg font-semibold text-plum-700">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-ghost p-2" aria-label="Next month">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-plum-300">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isToday = isSameDay(day, today);
            const inMonth = isSameMonth(day, currentMonth);
            const isPeriod = periodDates.has(dateStr);
            const isSpotting = spottingDates.has(dateStr);
            const isPredicted = predictedDates.has(dateStr);

            let bgClass = '';
            let ariaLabel = format(day, 'MMMM d');
            if (isPeriod) { bgClass = 'bg-coral-300 text-white'; ariaLabel += ' — period'; }
            else if (isSpotting) { bgClass = 'bg-blush-200 text-blush-400'; ariaLabel += ' — spotting'; }
            else if (isPredicted) { bgClass = 'bg-lavender-100 text-lavender-500 border border-lavender-300 border-dashed'; ariaLabel += ' — predicted'; }

            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(day)}
                aria-label={ariaLabel}
                className={`relative aspect-square rounded-lg text-xs font-medium transition-all hover:shadow-soft ${
                  !inMonth ? 'text-plum-200' : ''
                } ${bgClass} ${isToday ? 'ring-2 ring-coral-500 ring-offset-1' : ''} ${
                  !bgClass && inMonth ? 'text-plum-600 hover:bg-cream-100' : ''
                }`}
              >
                {format(day, 'd')}
                {isToday && <span className="sr-only">Today</span>}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 border-t border-cream-200 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-coral-300" />
            <span className="text-xs text-plum-400">{t('trackLegendPeriod')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-blush-200" />
            <span className="text-xs text-plum-400">{t('trackLegendSpotting')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-lavender-300 border-dashed bg-lavender-100" />
            <span className="text-xs text-plum-400">{t('trackLegendPredicted')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded ring-2 ring-coral-500 ring-offset-1" />
            <span className="text-xs text-plum-400">{t('trackLegendToday')}</span>
          </div>
        </div>
      </div>

      {/* Prediction note */}
      {cycleInfo.nextPeriodEstimate && (
        <p className="px-2 text-xs leading-relaxed text-plum-300">{t('trackPredictionNote')}</p>
      )}

      {/* Cycle history */}
      <div className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-plum-500">{t('trackHistory')}</h2>
        {periods.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title={t('trackNoPeriods')} description={t('trackNoPeriodsDesc')} />
        ) : (
          <div className="space-y-2">
            {[...periods].reverse().map((p, i) => {
              const prevStart = periods[periods.length - 1 - i - 1];
              const cycleLen = prevStart ? Math.round((parseISO(p.startDate).getTime() - parseISO(prevStart.startDate).getTime()) / 86400000) : null;
              return (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-cream-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-plum-600">
                      {format(parseISO(p.startDate), 'MMM d, yyyy')}
                      {p.endDate && ` — ${format(parseISO(p.endDate), 'MMM d')}`}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="badge bg-coral-50 text-coral-500">{p.flow}</span>
                      {cycleLen && <span className="text-xs text-plum-400">{cycleLen}d cycle</span>}
                    </div>
                    {p.notes && <p className="mt-1 text-xs text-plum-300">{p.notes}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingEntry(p); setShowForm(true); }} className="btn-ghost p-2" aria-label={t('trackEdit')}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="btn-ghost p-2 text-coral-500" aria-label={t('trackDelete')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Entry view modal */}
      {editingEntry && selectedDate && (
        <Modal open={!!editingEntry} onClose={() => { setEditingEntry(null); setSelectedDate(null); }} title={format(parseISO(selectedDate), 'MMMM d, yyyy')}>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-plum-400">Flow</p>
              <span className="badge bg-coral-50 text-coral-500 mt-1">{editingEntry.flow}</span>
            </div>
            {editingEntry.endDate && (
              <div><p className="text-xs text-plum-400">End date</p><p className="text-sm text-plum-600">{format(parseISO(editingEntry.endDate), 'MMM d, yyyy')}</p></div>
            )}
            {editingEntry.notes && <div><p className="text-xs text-plum-400">Notes</p><p className="text-sm text-plum-600">{editingEntry.notes}</p></div>}
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setShowForm(true); }} className="btn-secondary flex-1">
                <Edit2 size={16} /> {t('trackEdit')}
              </button>
              <button onClick={() => handleDelete(editingEntry.id)} className="btn-primary flex-1 bg-blush-300 hover:bg-blush-400">
                <Trash2 size={16} /> {t('trackDelete')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Entry form modal */}
      {showForm && (
        <PeriodForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingEntry(null); }}
          onSave={() => { refreshPeriods(); setShowForm(false); setEditingEntry(null); }}
          editingEntry={editingEntry}
          defaultDate={selectedDate || format(new Date(), 'yyyy-MM-dd')}
        />
      )}
    </div>
  );
}

function PeriodForm({ open, onClose, onSave, editingEntry, defaultDate }: {
  open: boolean; onClose: () => void; onSave: () => void;
  editingEntry: PeriodEntry | null; defaultDate: string;
}) {
  const { t } = useApp();
  const [startDate, setStartDate] = useState(editingEntry?.startDate || defaultDate);
  const [endDate, setEndDate] = useState(editingEntry?.endDate || '');
  const [flow, setFlow] = useState<FlowIntensity>(editingEntry?.flow || 'medium');
  const [notes, setNotes] = useState(editingEntry?.notes || '');

  const handleSave = () => {
    if (editingEntry) {
      storage.updatePeriod(editingEntry.id, { startDate, endDate: endDate || undefined, flow, notes: notes || undefined });
    } else {
      storage.addPeriod({
        id: crypto.randomUUID(), startDate, endDate: endDate || undefined, flow,
        notes: notes || undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
    }
    setStartDate(format(new Date(), 'yyyy-MM-dd')); setEndDate(''); setFlow('medium'); setNotes('');
    onSave();
  };

  return (
    <Modal open={open} onClose={onClose} title={editingEntry ? t('trackEdit') : t('trackNewEntry')}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackStartDate')}</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" max={format(new Date(), 'yyyy-MM-dd')} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackEndDate')}</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" min={startDate} max={format(new Date(), 'yyyy-MM-dd')} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackFlow')}</label>
          <div className="grid grid-cols-4 gap-2">
            {(['light', 'medium', 'heavy', 'spotting'] as FlowIntensity[]).map(f => (
              <button key={f} onClick={() => setFlow(f)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${flow === f ? 'border-coral-300 bg-coral-50 text-coral-500' : 'border-cream-200 text-plum-500'}`}>
                {f === 'light' ? t('flowLight') : f === 'medium' ? t('flowMedium') : f === 'heavy' ? t('flowHeavy') : t('flowSpotting')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-plum-600">{t('trackNotes')}</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Optional notes..." />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">{t('trackCancel')}</button>
          <button onClick={handleSave} className="btn-primary flex-1">{t('trackSave')}</button>
        </div>
      </div>
    </Modal>
  );
}

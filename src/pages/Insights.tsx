import { useApp } from '../lib/app-context';
import { getCycleInfo, calculateCycleLengths, cycleVariation, averageCycleLength, averagePeriodLength } from '../lib/cycle';
import { EmptyState } from '../components/States';
import { BarChart, Sparkline } from '../components/Charts';
import { format, parseISO, subDays } from 'date-fns';
import { BarChart3, TrendingUp, Heart, FileText } from 'lucide-react';
import { generateSymptomSummary } from '../lib/cycle';
import { useNavigate } from 'react-router-dom';

export function Insights() {
  const { t, periods, symptoms } = useApp();
  const navigate = useNavigate();
  const cycleInfo = getCycleInfo(periods);
  const cycleLengths = calculateCycleLengths(periods);
  const variation = cycleVariation(periods);
  const avgCycle = averageCycleLength(periods);
  const avgPeriod = averagePeriodLength(periods);

  // Symptom frequency
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recent = symptoms.filter(s => parseISO(s.date) >= thirtyDaysAgo);
  const freqMap: Record<string, number> = {};
  recent.forEach(s => s.symptoms.forEach(sym => { freqMap[sym] = (freqMap[sym] || 0) + 1; }));
  const freqData = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }));

  // Pain trend
  const painTrend = symptoms.slice(-14).map(s => s.painLevel);

  // Flow distribution
  const flowCounts: Record<string, number> = { light: 0, medium: 0, heavy: 0, spotting: 0 };
  periods.forEach(p => { flowCounts[p.flow] = (flowCounts[p.flow] || 0) + 1; });
  const flowData = Object.entries(flowCounts).filter(([_, v]) => v > 0).map(([label, value]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1), value,
    color: label === 'heavy' ? '#E85538' : label === 'medium' ? '#FF8B73' : label === 'light' ? '#FFB3A4' : '#F3A8B8',
  }));

  const hasData = periods.length > 0 || symptoms.length > 0;

  const handleDownloadSummary = () => {
    const summary = generateSymptomSummary(periods, symptoms);
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saheli-symptom-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hasData) {
    return (
      <div className="space-y-5">
        <h1 className="font-display text-2xl font-semibold text-plum-700">{t('insightsTitle')}</h1>
        <div className="card">
          <EmptyState icon={<BarChart3 size={28} />} title={t('insightsNoData')} description={t('insightsNoDataDesc')}
            action={<button className="btn-primary" onClick={() => navigate('/track')}>Start tracking</button>} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold text-plum-700">{t('insightsTitle')}</h1>

      {/* Cycle length history */}
      {cycleLengths.length > 0 && (
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-coral-400" />
            <h2 className="text-sm font-semibold text-plum-500">{t('insightsCycleHistory')}</h2>
          </div>
          <BarChart data={cycleLengths.map((len, i) => ({ label: `C${i + 1}`, value: len }))} unit="d" />
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-cream-200 pt-3">
            <div><p className="text-xs text-plum-400">{t('trackAvgCycle')}</p><p className="text-lg font-semibold text-plum-700">{avgCycle ? `${avgCycle}d` : '—'}</p></div>
            <div><p className="text-xs text-plum-400">{t('insightsVariation')}</p><p className="text-lg font-semibold text-plum-700">{variation !== undefined ? `${variation}d` : '—'}</p></div>
            <div><p className="text-xs text-plum-400">{t('trackAvgPeriod')}</p><p className="text-lg font-semibold text-plum-700">{avgPeriod ? `${avgPeriod}d` : '—'}</p></div>
          </div>
        </div>
      )}

      {/* Symptom frequency */}
      {freqData.length > 0 && (
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Heart size={18} className="text-blush-400" />
            <h2 className="text-sm font-semibold text-plum-500">{t('insightsSymptomFreq')}</h2>
          </div>
          <BarChart data={freqData} />
          {recent.length > 0 && (
            <p className="mt-3 text-xs text-plum-300">Based on {recent.length} entries in the last 30 days. These are symptoms you logged, not a medical diagnosis.</p>
          )}
        </div>
      )}

      {/* Pain trend */}
      {painTrend.length >= 2 && (
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-lavender-500" />
            <h2 className="text-sm font-semibold text-plum-500">{t('insightsPainTrend')}</h2>
          </div>
          <div className="flex items-center justify-center py-2">
            <Sparkline data={painTrend} width={280} height={60} color="#8B72C4" />
          </div>
          <p className="mt-2 text-center text-xs text-plum-300">Last {painTrend.length} entries</p>
        </div>
      )}

      {/* Flow summary */}
      {flowData.length > 0 && (
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-plum-500">{t('insightsFlowSummary')}</h2>
          <BarChart data={flowData} />
        </div>
      )}

      {/* Preparation suggestions */}
      {cycleInfo.nextPeriodEstimate && (
        <div className="card p-5">
          <h2 className="mb-3 text-sm font-semibold text-plum-500">{t('insightsPrep')}</h2>
          <ul className="space-y-2 text-sm text-plum-500">
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-coral-400" />Keep pads or tampons in your bag</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-coral-400" />Stay hydrated and prioritize rest</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-coral-400" />Have a heating pad ready for cramps</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-coral-400" />Track symptoms to understand your pattern</li>
          </ul>
        </div>
      )}

      {/* Summary for appointment */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <FileText size={18} className="text-plum-400" />
          <h2 className="text-sm font-semibold text-plum-500">Appointment summary</h2>
        </div>
        <p className="mb-3 text-xs text-plum-400">Generate a summary of your cycle and symptom data to share with a healthcare provider.</p>
        <button onClick={handleDownloadSummary} className="btn-secondary w-full">Download summary</button>
      </div>

      {/* Disclaimer */}
      <p className="px-2 text-xs leading-relaxed text-plum-300">{t('insightsDisclaimer')}</p>
    </div>
  );
}

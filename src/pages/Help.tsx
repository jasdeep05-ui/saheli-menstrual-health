import { useState, useCallback } from 'react';
import { useApp } from '../lib/app-context';
import { useNavigate } from 'react-router-dom';
import { getSymptomGuidance, type SymptomGuidance } from '../lib/saheli-ai';
import { generateSymptomSummary } from '../lib/cycle';
import { evaluateRedFlags, STATIC_WARNINGS, URGENT_WARNINGS, generateVisitSummary, type RedFlag } from '../lib/redflags';
import { ChevronDown, AlertTriangle, Stethoscope, Package, ShowerHead, MapPin, MessageSquare, Download, Check, Navigation, Printer, HeartPulse } from 'lucide-react';
import { format } from 'date-fns';

type Section = 'unexpected' | 'emergencyKit' | 'hygiene' | 'findSupport' | 'talkAbout' | 'symptomGuidance' | 'seeDoctor';

export function Help() {
  const { t, periods, symptoms, onboarding } = useApp();
  const [section, setSection] = useState<Section>('unexpected');

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'unexpected', label: t('helpUnexpected'), icon: <AlertTriangle size={18} /> },
    { id: 'emergencyKit', label: t('helpEmergencyKit'), icon: <Package size={18} /> },
    { id: 'hygiene', label: t('helpHygiene'), icon: <ShowerHead size={18} /> },
    { id: 'symptomGuidance', label: t('helpSymptomGuidance'), icon: <Stethoscope size={18} /> },
    { id: 'seeDoctor', label: t('helpSeeDoctor'), icon: <HeartPulse size={18} /> },
    { id: 'findSupport', label: t('helpFindSupport'), icon: <MapPin size={18} /> },
    { id: 'talkAbout', label: t('helpTalkAbout'), icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold text-plum-700">{t('helpTitle')}</h1>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all ${
              section === s.id ? 'bg-coral-400 text-white' : 'bg-white border border-cream-200 text-plum-500 hover:bg-cream-100'
            }`}>
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      {section === 'unexpected' && <UnexpectedPeriod />}
      {section === 'emergencyKit' && <EmergencyKit />}
      {section === 'hygiene' && <HygieneSection />}
      {section === 'symptomGuidance' && <SymptomGuidanceSection periods={periods} symptoms={symptoms} />}
      {section === 'seeDoctor' && <SeeDoctorSection periods={periods} symptoms={symptoms} onboarding={onboarding} />}
      {section === 'findSupport' && <FindSupport />}
      {section === 'talkAbout' && <TalkAboutSection />}
    </div>
  );
}

function UnexpectedPeriod() {
  const { t } = useApp();
  const steps = [
    t('helpUnexpectedStep1'), t('helpUnexpectedStep2'), t('helpUnexpectedStep3'),
    t('helpUnexpectedStep4'), t('helpUnexpectedStep5'), t('helpUnexpectedStep6'),
    t('helpUnexpectedStep7'), t('helpUnexpectedStep8'),
  ];

  return (
    <div className="card p-5 animate-fade-in">
      <h2 className="mb-4 font-display text-lg font-semibold text-plum-700">{t('helpUnexpectedTitle')}</h2>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-coral-50 text-xs font-semibold text-coral-500">{i + 1}</span>
            <p className="text-sm leading-relaxed text-plum-500">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmergencyKit() {
  const { t } = useApp();
  const items = [
    t('helpKitItem1'), t('helpKitItem2'), t('helpKitItem3'), t('helpKitItem4'),
    t('helpKitItem5'), t('helpKitItem6'), t('helpKitItem7'), t('helpKitItem8'),
  ];
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; });
  };

  return (
    <div className="card p-5 animate-fade-in">
      <h2 className="mb-4 font-display text-lg font-semibold text-plum-700">{t('helpKitTitle')}</h2>
      <p className="mb-4 text-sm text-plum-400">{t('helpKitDesc')}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
              checked.has(i) ? 'border-coral-200 bg-coral-50' : 'border-cream-200 bg-white hover:bg-cream-50'
            }`}>
            <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all ${
              checked.has(i) ? 'border-coral-400 bg-coral-400 text-white' : 'border-cream-300'
            }`}>
              {checked.has(i) && <Check size={14} />}
            </span>
            <span className={`text-sm ${checked.has(i) ? 'text-plum-400 line-through' : 'text-plum-600'}`}>{item}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-plum-300">
        {checked.size} / {items.length} {t('helpKitItemsChecked')}
      </p>
    </div>
  );
}

function HygieneSection() {
  const { t } = useApp();
  const tips = [
    { title: t('helpHygWashHandsT'), desc: t('helpHygWashHandsD') },
    { title: t('helpHygChangeT'), desc: t('helpHygChangeD') },
    { title: t('helpHygWashT'), desc: t('helpHygWashD') },
    { title: t('helpHygDisposalT'), desc: t('helpHygDisposalD') },
    { title: t('helpHygUnderwearT'), desc: t('helpHygUnderwearD') },
    { title: t('helpHygHydrateT'), desc: t('helpHygHydrateD') },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {tips.map((tip, i) => (
        <div key={i} className="card p-4">
          <h3 className="text-sm font-semibold text-plum-600">{tip.title}</h3>
          <p className="mt-1 text-sm text-plum-400">{tip.desc}</p>
        </div>
      ))}
    </div>
  );
}

function SymptomGuidanceSection({ periods, symptoms }: { periods: import('../types').PeriodEntry[]; symptoms: import('../types').SymptomEntry[] }) {
  const { t, lang } = useApp();
  const [selected, setSelected] = useState<SymptomGuidance | null>(null);
  const guidanceData = getSymptomGuidance(lang);

  const handleDownload = () => {
    const summary = generateSymptomSummary(periods, symptoms);
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptom-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-4">
        <p className="text-sm text-plum-400">{t('helpSgIntro')}</p>
        <p className="mt-2 text-xs text-plum-300">{t('helpSgDisclaimer')}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {guidanceData.map(g => (
          <button key={g.symptom} onClick={() => setSelected(g)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              selected?.symptom === g.symptom ? 'border-coral-300 bg-coral-50 text-coral-500' : 'border-cream-200 bg-white text-plum-500 hover:bg-cream-50'
            }`}>
            {g.symptom}
          </button>
        ))}
      </div>

      {selected && (
        <div className="card p-5 animate-slide-up">
          <h2 className="mb-3 font-display text-lg font-semibold text-plum-700">{selected.symptom}</h2>
          <p className="mb-4 text-sm leading-relaxed text-plum-500">{selected.generalInfo}</p>

          <div className="mb-4 rounded-xl bg-cream-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-plum-600">
              <Stethoscope size={16} className="text-lavender-500" />
              {t('helpSgSeeDoctor')}
            </h3>
            <ul className="space-y-1.5">
              {selected.seeDoctor.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-plum-500">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lavender-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-blush-100 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-coral-600">
              <AlertTriangle size={16} />
              {t('helpSgUrgentCare')}
            </h3>
            <ul className="space-y-1.5">
              {selected.urgent.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-coral-600">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-coral-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={handleDownload} className="btn-secondary mt-4 w-full">
            <Download size={16} />
            {t('helpSgDownload')}
          </button>
        </div>
      )}
    </div>
  );
}

function FindSupport() {
  const { t } = useApp();
  const navigate = useNavigate();

  const resources = [
    { name: 'World Health Organization — Menstrual Health', url: 'https://www.who.int/health-topics/menstrual-health', type: t('helpFsResource1') },
    { name: 'UNICEF — Menstrual Hygiene', url: 'https://www.unicef.org/wash/menstrual-hygiene', type: t('helpFsResource2') },
    { name: 'Mayo Clinic — Women\'s Health', url: 'https://www.mayoclinic.org/patient-care/obstetrics-gynecology', type: t('helpFsResource3') },
    { name: 'NHS — Periods and Menstrual Health', url: 'https://www.nhs.uk/conditions/periods/', type: t('helpFsResource3') },
    { name: 'ACOG — Women\'s Health', url: 'https://www.acog.org/womens-health', type: t('helpFsResource3') },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Find Nearby Period Essentials card */}
      <button
        onClick={() => navigate('/find-essentials')}
        className="card flex w-full items-center gap-4 p-5 text-left transition-all hover:shadow-card"
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-coral-50">
          <Navigation size={24} className="text-coral-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-plum-600">{t('helpFsEssentialsT')}</h3>
          <p className="mt-0.5 text-xs text-plum-400">
            {t('helpFsEssentialsD')}
          </p>
        </div>
        <ChevronDown size={20} className="-rotate-90 text-plum-300" />
      </button>

      <div className="card p-4">
        <p className="text-sm text-plum-400">
          {t('helpFsIntro')}
        </p>
        <p className="mt-2 text-xs text-plum-300">
          {t('helpFsNote')}
        </p>
      </div>

      <div className="space-y-2">
        {resources.map((r, i) => (
          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
            className="card flex items-center justify-between p-4 transition-all hover:shadow-card">
            <div>
              <p className="text-sm font-medium text-plum-600">{r.name}</p>
              <p className="text-xs text-plum-400">{r.type}</p>
            </div>
            <ChevronDown size={20} className="-rotate-90 text-plum-300" />
          </a>
        ))}
      </div>
    </div>
  );
}

function TalkAboutSection() {
  const { t } = useApp();
  const guides = [
    { who: t('helpTaWho1'), opening: t('helpTaOpen1'), tip: t('helpTaTip1') },
    { who: t('helpTaWho2'), opening: t('helpTaOpen2'), tip: t('helpTaTip2') },
    { who: t('helpTaWho3'), opening: t('helpTaOpen3'), tip: t('helpTaTip3') },
    { who: t('helpTaWho4'), opening: t('helpTaOpen4'), tip: t('helpTaTip4') },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="card p-4">
        <p className="text-sm text-plum-400">{t('helpTaIntro')}</p>
      </div>
      {guides.map((g, i) => (
        <div key={i} className="card p-4">
          <h3 className="text-sm font-semibold text-plum-600">{g.who}</h3>
          <p className="mt-2 rounded-lg bg-cream-50 px-3 py-2 text-sm italic text-plum-500">{g.opening}</p>
          <p className="mt-2 text-xs text-plum-400">{g.tip}</p>
        </div>
      ))}
    </div>
  );
}

function SeeDoctorSection({ periods, symptoms, onboarding }: {
  periods: import('../types').PeriodEntry[];
  symptoms: import('../types').SymptomEntry[];
  onboarding: import('../types').OnboardingPrefs;
}) {
  const { t, lang } = useApp();
  const flags = evaluateRedFlags({ periods, symptoms, onboarding });

  const handlePrint = useCallback(() => {
    const summary = generateVisitSummary(periods, symptoms, flags, lang);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${t('rfScreenTitle')} — Saheli</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #333; line-height: 1.5; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            .meta { color: #666; font-size: 13px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section h2 { font-size: 15px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px; }
            .disclaimer { font-size: 12px; color: #666; margin-bottom: 20px; font-style: italic; }
            .flag { margin-bottom: 10px; padding: 8px 12px; background: #f9f5f5; border-radius: 6px; }
            .flag .sev { font-weight: bold; font-size: 12px; }
            .flag .sev.urgent { color: #c0392b; }
            .flag .sev.routine { color: #7d6b7d; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>Saheli — ${t('rfScreenTitle')}</h1>
          <div class="meta">${new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <p class="disclaimer">${t('rfScreenDisclaimer')}</p>
          <pre>${summary}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  }, [periods, symptoms, flags, lang, t]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-plum-700">{t('rfScreenTitle')}</h2>
        <p className="text-sm leading-relaxed text-plum-500">{t('rfScreenIntro')}</p>
        <p className="mt-3 text-xs text-plum-300">{t('rfScreenDisclaimer')}</p>
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-plum-600">{t('rfFlaggedPatterns')}</h3>
        {flags.length === 0 ? (
          <div className="rounded-xl bg-cream-50 p-4">
            <p className="text-sm text-plum-500">{t('rfNoFlags')}</p>
            <p className="mt-1 text-xs text-plum-400">{t('rfNoFlagsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flags.map(flag => (
              <RedFlagCard key={flag.id} flag={flag} t={t} />
            ))}
          </div>
        )}
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-plum-600">{t('rfStaticWarningsTitle')}</h3>
        <p className="mb-3 text-sm text-plum-400">{t('rfStaticWarningsDesc')}</p>
        <div className="space-y-3">
          {STATIC_WARNINGS.map(w => (
            <div key={w.id} className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <h4 className="text-sm font-semibold text-plum-600">{t(w.titleKey as never)}</h4>
              <p className="mt-1 text-sm text-plum-400">{t(w.descriptionKey as never)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-coral-200 bg-blush-100 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-coral-600">
          <AlertTriangle size={18} />
          {t('rfUrgentWarningsTitle')}
        </h3>
        <p className="mb-3 text-sm text-coral-600">{t('rfUrgentWarningsDesc')}</p>
        <div className="space-y-3">
          {URGENT_WARNINGS.map(w => (
            <div key={w.id} className="rounded-lg bg-white/60 p-3">
              <h4 className="text-sm font-semibold text-coral-700">{t(w.titleKey as never)}</h4>
              <p className="mt-1 text-sm text-coral-600">{t(w.descriptionKey as never)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-2 text-sm font-semibold text-plum-600">{t('rfPrepareVisit')}</h3>
        <p className="mb-3 text-xs text-plum-400">{t('rfPrintInstructions')}</p>
        <button onClick={handlePrint} className="btn-secondary w-full">
          <Printer size={16} />
          {t('rfPrintSummary')}
        </button>
      </div>
    </div>
  );
}

function RedFlagCard({ flag, t }: { flag: RedFlag; t: (key: never) => string }) {
  const isUrgent = flag.severity === 'urgent';
  return (
    <div className={`rounded-xl border p-4 ${isUrgent ? 'border-coral-200 bg-blush-100' : 'border-cream-200 bg-cream-50'}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`text-xs font-semibold uppercase ${isUrgent ? 'text-coral-600' : 'text-plum-400'}`}>
          {isUrgent ? t('rfSeverityUrgent' as never) : t('rfSeverityRoutine' as never)}
        </span>
        {isUrgent && <AlertTriangle size={14} className="text-coral-500" />}
      </div>
      <h4 className={`text-sm font-semibold ${isUrgent ? 'text-coral-700' : 'text-plum-600'}`}>
        {t(flag.titleKey as never)}
      </h4>
      <p className="mt-1 text-sm text-plum-500">{t(flag.descriptionKey as never)}</p>
      {flag.dates && flag.dates.length > 0 && (
        <p className="mt-2 text-xs text-plum-400">
          {t('rfDatesLabel' as never)}: {flag.dates.join(', ')}
        </p>
      )}
      <p className={`mt-2 text-sm font-medium ${isUrgent ? 'text-coral-600' : 'text-plum-500'}`}>
        {t(flag.actionKey as never)}
      </p>
      {flag.basedOnIncompleteInfo && (
        <p className="mt-2 text-xs italic text-plum-400">{t('rfBasedOnIncompleteInfo' as never)}</p>
      )}
    </div>
  );
}

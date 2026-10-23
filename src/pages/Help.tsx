import { useState } from 'react';
import { useApp } from '../lib/app-context';
import { symptomGuidanceData, type SymptomGuidance } from '../lib/saheli-ai';
import { generateSymptomSummary } from '../lib/cycle';
import { ChevronDown, AlertTriangle, Stethoscope, Package, ShowerHead, MapPin, MessageSquare, Download, Check } from 'lucide-react';
import { format } from 'date-fns';

type Section = 'unexpected' | 'emergencyKit' | 'hygiene' | 'findSupport' | 'talkAbout' | 'symptomGuidance';

export function Help() {
  const { t, periods, symptoms } = useApp();
  const [section, setSection] = useState<Section>('unexpected');

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'unexpected', label: t('helpUnexpected'), icon: <AlertTriangle size={18} /> },
    { id: 'emergencyKit', label: t('helpEmergencyKit'), icon: <Package size={18} /> },
    { id: 'hygiene', label: t('helpHygiene'), icon: <ShowerHead size={18} /> },
    { id: 'symptomGuidance', label: t('helpSymptomGuidance'), icon: <Stethoscope size={18} /> },
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
      {section === 'findSupport' && <FindSupport />}
      {section === 'talkAbout' && <TalkAboutSection />}
    </div>
  );
}

function UnexpectedPeriod() {
  const steps = [
    'Stay calm — it is completely normal for periods to start unexpectedly.',
    'Check if a friend, colleague, or school nurse has a spare pad or tampon.',
    'If no product is available, fold toilet paper or tissue into a thick pad as a temporary solution.',
    'If you stained your clothes, tie a jacket or sweater around your waist to cover it.',
    'Wash any stained clothing with cold water as soon as possible — warm water sets stains.',
    'Change your temporary pad every 2-3 hours until you can get a proper product.',
    'If you are at school, ask to visit the school nurse or counselor — they often have supplies.',
    'If you are at work, check if your workplace has a first-aid room or supplies.',
  ];

  return (
    <div className="card p-5 animate-fade-in">
      <h2 className="mb-4 font-display text-lg font-semibold text-plum-700">Managing an unexpected period</h2>
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
  const items = [
    '2-3 sanitary pads (regular and heavy flow)',
    '1-2 tampons (if you use them)',
    'Spare underwear',
    'Small pack of tissues',
    'Wet wipes (unscented, biodegradable)',
    'Small plastic bag for disposing used products',
    'Pain relief medication (in its original packaging)',
    'Hand sanitizer',
  ];
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; });
  };

  return (
    <div className="card p-5 animate-fade-in">
      <h2 className="mb-4 font-display text-lg font-semibold text-plum-700">Emergency kit checklist</h2>
      <p className="mb-4 text-sm text-plum-400">Build a small kit to keep in your bag. Tap items to check them off.</p>
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
        {checked.size} of {items.length} items checked
      </p>
    </div>
  );
}

function HygieneSection() {
  const tips = [
    { title: 'Wash your hands', desc: 'Always wash hands before and after changing any menstrual product.' },
    { title: 'Change regularly', desc: 'Pads every 3-4 hours, tampons every 4-6 hours, cups up to 12 hours.' },
    { title: 'External washing', desc: 'Wash the external genital area with warm water and mild unscented soap. The vagina is self-cleaning — avoid douching.' },
    { title: 'Safe disposal', desc: 'Wrap used products in tissue or their wrapper before disposing in a bin. Never flush pads or tampons.' },
    { title: 'Comfortable underwear', desc: 'Cotton underwear is breathable and helps prevent irritation during your period.' },
    { title: 'Stay hydrated', desc: 'Drinking water can help reduce bloating and keep you feeling better during your period.' },
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
  const [selected, setSelected] = useState<SymptomGuidance | null>(null);

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
        <p className="text-sm text-plum-400">Select a symptom to see general guidance, signs that warrant medical attention, and warning signs that may need urgent care.</p>
        <p className="mt-2 text-xs text-plum-300">This is educational guidance, not a diagnosis. It cannot tell you whether you do or do not have a condition.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {symptomGuidanceData.map(g => (
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
              Consider seeing a doctor if:
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
              Seek urgent care if:
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
            Create summary for a healthcare appointment
          </button>
        </div>
      )}
    </div>
  );
}

function FindSupport() {
  const resources = [
    { name: 'World Health Organization — Menstrual Health', url: 'https://www.who.int/health-topics/menstrual-health', type: 'Public health resource' },
    { name: 'UNICEF — Menstrual Hygiene', url: 'https://www.unicef.org/wash/menstrual-hygiene', type: 'Support organization' },
    { name: 'Mayo Clinic — Women\'s Health', url: 'https://www.mayoclinic.org/patient-care/obstetrics-gynecology', type: 'Healthcare information' },
    { name: 'NHS — Periods and Menstrual Health', url: 'https://www.nhs.uk/conditions/periods/', type: 'Healthcare information' },
    { name: 'ACOG — Women\'s Health', url: 'https://www.acog.org/womens-health', type: 'Healthcare information' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-4">
        <p className="text-sm text-plum-400">
          These are general health resources from recognized organizations. For local healthcare facilities, search for clinics or hospitals in your area, or contact your local health department.
        </p>
        <p className="mt-2 text-xs text-plum-300">
          Saheli does not verify specific local clinics or services. Always check current availability and eligibility directly with the provider.
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
  const guides = [
    { who: 'A trusted adult or parent', opening: '"I wanted to talk to you about something. I got my period / I have a question about periods..."', tip: 'Choose a quiet, private moment. You can write it down if speaking feels hard.' },
    { who: 'A teacher or school counselor', opening: '"I need some help. Do you have any menstrual products? / Can I talk to you about a health question?"', tip: 'School staff are there to help. You have the right to ask for support.' },
    { who: 'A partner', opening: '"I want to share something about my health with you. I am on my period / I have been experiencing..."', tip: 'Sharing helps them understand and support you better.' },
    { who: 'A healthcare professional', opening: '"I have been experiencing [symptoms] and wanted to get it checked. Here is a summary of what I have been tracking."', tip: 'You can use the symptom summary from the Insights page. You deserve to be heard.' },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="card p-4">
        <p className="text-sm text-plum-400">Starting a conversation about periods can feel hard, but it gets easier. Here are some opening lines to help.</p>
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

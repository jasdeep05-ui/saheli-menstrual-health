import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { SaheliLogo } from '../components/Logo';
import { Check, ChevronRight, ChevronLeft, Shield, Heart, BookOpen, LifeBuoy, Bell } from 'lucide-react';
import type { OnboardingPrefs } from '../types';
import type { Lang } from '../lib/i18n';

type Step = 'language' | 'purpose' | 'privacy' | 'interests' | 'tracking' | 'reminders';

const STEPS: Step[] = ['language', 'purpose', 'privacy', 'interests', 'tracking', 'reminders'];

export function Onboarding() {
  const navigate = useNavigate();
  const { setOnboarding } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [prefs, setPrefs] = useState<OnboardingPrefs>({
    completed: false,
    language: 'en',
    interests: [],
    trackingEnabled: true,
    privacyAcknowledged: false,
    remindersEnabled: false,
  });

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      const final = { ...prefs, completed: true };
      setOnboarding(final);
      navigate('/home');
    } else {
      setStepIndex(i => i + 1);
    }
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex(i => i - 1);
  };

  const toggleInterest = (interest: string) => {
    setPrefs(p => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter(i => i !== interest)
        : [...p.interests, interest],
    }));
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <SaheliLogo size={32} />
          {stepIndex > 0 && (
            <button onClick={back} className="btn-ghost">
              <ChevronLeft size={18} />
              Back
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="mb-8 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? 'bg-coral-400' : 'bg-cream-200'
              }`}
            />
          ))}
        </div>

        {/* Steps */}
        <div className="flex-1">
          {step === 'language' && (
            <StepContainer title="Choose your language" icon={<BookOpen size={28} />}>
              <div className="space-y-2">
                {[
                  { code: 'en' as Lang, label: 'English', desc: 'Read in English' },
                  { code: 'hi' as Lang, label: 'हिन्दी (Hindi)', desc: 'हिंदी में पढ़ें' },
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setPrefs(p => ({ ...p, language: lang.code }))}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                      prefs.language === lang.code
                        ? 'border-coral-300 bg-coral-50'
                        : 'border-cream-200 bg-white hover:bg-cream-50'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium text-plum-600">{lang.label}</p>
                      <p className="text-xs text-plum-400">{lang.desc}</p>
                    </div>
                    {prefs.language === lang.code && <Check className="text-coral-400" size={20} />}
                  </button>
                ))}
              </div>
            </StepContainer>
          )}

          {step === 'purpose' && (
            <StepContainer title="What Saheli offers" icon={<Heart size={28} />}>
              <p className="mb-4 text-sm leading-relaxed text-plum-500">
                Saheli is a free menstrual health companion. Track your cycle, learn about your body, and get practical support — all in a private, judgment-free space.
              </p>
              <div className="space-y-3">
                <Feature icon={<Heart size={18} />} text="Cycle tracking with predictions that communicate uncertainty" />
                <Feature icon={<BookOpen size={18} />} text="Evidence-grounded health education from trusted sources" />
                <Feature icon={<LifeBuoy size={18} />} text="Practical support for real-life situations" />
                <Feature icon={<Shield size={18} />} text="Your data stays on your device — nothing is sent to a server" />
              </div>
            </StepContainer>
          )}

          {step === 'privacy' && (
            <StepContainer title="Your privacy matters" icon={<Shield size={28} />}>
              <p className="mb-4 text-sm leading-relaxed text-plum-500">
                All your data is stored locally on your device only. Nothing is sent to a server unless you choose to create an account. You can use educational features without sharing any personal information.
              </p>
              <div className="space-y-3">
                <PrivacyItem text="Cycle and symptom data stays on your device" />
                <PrivacyItem text="No account required for basic features" />
                <PrivacyItem text="Educational content is always free" />
                <PrivacyItem text="You can delete all data anytime in Settings" />
              </div>
              <label className="mt-4 flex items-start gap-3 rounded-xl bg-cream-100 p-4">
                <input
                  type="checkbox"
                  checked={prefs.privacyAcknowledged}
                  onChange={e => setPrefs(p => ({ ...p, privacyAcknowledged: e.target.checked }))}
                  className="mt-0.5 h-5 w-5 rounded accent-coral-400"
                />
                <span className="text-sm text-plum-500">
                  I understand my data is stored on my device and I can delete it anytime.
                </span>
              </label>
            </StepContainer>
          )}

          {step === 'interests' && (
            <StepContainer title="What are you interested in?" icon={<BookOpen size={28} />}>
              <p className="mb-4 text-sm text-plum-400">Select all that apply — you can change this later.</p>
              <div className="space-y-2">
                {[
                  { id: 'tracking', label: 'Cycle tracking', icon: <Heart size={18} /> },
                  { id: 'education', label: 'Menstrual health education', icon: <BookOpen size={18} /> },
                  { id: 'support', label: 'Practical support', icon: <LifeBuoy size={18} /> },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 transition-all ${
                      prefs.interests.includes(item.id)
                        ? 'border-coral-300 bg-coral-50'
                        : 'border-cream-200 bg-white hover:bg-cream-50'
                    }`}
                  >
                    <span className="text-coral-400">{item.icon}</span>
                    <span className="flex-1 text-left text-sm font-medium text-plum-600">{item.label}</span>
                    {prefs.interests.includes(item.id) && <Check className="text-coral-400" size={18} />}
                  </button>
                ))}
              </div>
            </StepContainer>
          )}

          {step === 'tracking' && (
            <StepContainer title="Would you like to start tracking your cycle?" icon={<Heart size={28} />}>
              <p className="mb-4 text-sm text-plum-400">
                Tracking helps you understand your cycle pattern. You can change this anytime, and tracking is never required to use educational features.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setPrefs(p => ({ ...p, trackingEnabled: true }))}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                    prefs.trackingEnabled
                      ? 'border-coral-300 bg-coral-50'
                      : 'border-cream-200 bg-white hover:bg-cream-50'
                  }`}
                >
                  <span className="text-sm font-medium text-plum-600">Yes, help me track</span>
                  {prefs.trackingEnabled && <Check className="text-coral-400" size={18} />}
                </button>
                <button
                  onClick={() => setPrefs(p => ({ ...p, trackingEnabled: false }))}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                    !prefs.trackingEnabled
                      ? 'border-coral-300 bg-coral-50'
                      : 'border-cream-200 bg-white hover:bg-cream-50'
                  }`}
                >
                  <span className="text-sm font-medium text-plum-600">Not right now</span>
                  {!prefs.trackingEnabled && <Check className="text-coral-400" size={18} />}
                </button>
              </div>
            </StepContainer>
          )}

          {step === 'reminders' && (
            <StepContainer title="Enable gentle reminders?" icon={<Bell size={28} />}>
              <p className="mb-4 text-sm text-plum-400">
                Optional, discreet notifications to help you log and prepare. You can change this anytime in Settings.
              </p>
              <label className="flex items-center justify-between rounded-xl border border-cream-200 bg-white p-4">
                <div>
                  <p className="text-sm font-medium text-plum-600">Enable reminders</p>
                  <p className="text-xs text-plum-400">Discreet by default</p>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, remindersEnabled: !p.remindersEnabled }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    prefs.remindersEnabled ? 'bg-coral-400' : 'bg-cream-300'
                  }`}
                  role="switch"
                  aria-checked={prefs.remindersEnabled}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    prefs.remindersEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </label>
            </StepContainer>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6">
          <button
            className="btn-primary w-full"
            onClick={next}
            disabled={step === 'privacy' && !prefs.privacyAcknowledged}
          >
            {isLast ? 'Start using Saheli' : 'Continue'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepContainer({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-50 text-coral-400">
        {icon}
      </div>
      <h2 className="mb-4 font-display text-2xl font-semibold text-plum-700">{title}</h2>
      {children}
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream-100 text-coral-400">
        {icon}
      </span>
      <span className="text-sm text-plum-500">{text}</span>
    </div>
  );
}

function PrivacyItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="text-coral-400" size={18} />
      <span className="text-sm text-plum-500">{text}</span>
    </div>
  );
}

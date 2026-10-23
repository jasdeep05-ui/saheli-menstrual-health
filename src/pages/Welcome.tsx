import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { GirlIllustration } from '../components/GirlIllustration';
import { BookOpen, Calendar, LifeBuoy, Shield } from 'lucide-react';
import { saveOnboarding } from '../lib/storage';

export function Welcome() {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-blush-100 to-lavender-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12">
        {/* Girl illustration */}
        <div className="mb-6 animate-fade-in">
          <div className="animate-sway">
            <GirlIllustration size={180} />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="mb-1.5 font-display text-4xl font-semibold text-plum-700 animate-slide-up tracking-tight">
          Saheli
        </h1>

        {/* Tagline */}
        <p className="mb-3 text-center font-display text-lg text-coral-400 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {t('tagline')}
        </p>

        {/* Supporting copy */}
        <p className="mb-10 text-center text-sm leading-relaxed text-plum-400 animate-slide-up max-w-xs" style={{ animationDelay: '0.2s' }}>
          {t('supportingCopy')}
        </p>

        {/* Feature highlights */}
        <div className="mb-10 grid w-full grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card p-4 text-center">
            <Calendar className="mx-auto mb-2 text-coral-400" size={24} />
            <p className="text-xs font-medium text-plum-500">Cycle tracking</p>
          </div>
          <div className="card p-4 text-center">
            <BookOpen className="mx-auto mb-2 text-lavender-400" size={24} />
            <p className="text-xs font-medium text-plum-500">Health education</p>
          </div>
          <div className="card p-4 text-center">
            <LifeBuoy className="mx-auto mb-2 text-blush-400" size={24} />
            <p className="text-xs font-medium text-plum-500">Practical support</p>
          </div>
          <div className="card p-4 text-center">
            <Shield className="mx-auto mb-2 text-plum-400" size={24} />
            <p className="text-xs font-medium text-plum-500">Privacy-first</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex w-full flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            className="btn-primary w-full"
            onClick={() => navigate('/onboarding')}
          >
            {t('getStarted')}
          </button>
          <button
            className="btn-secondary w-full"
            onClick={() => {
              saveOnboarding({
                completed: true,
                language: 'en',
                interests: ['education'],
                trackingEnabled: false,
                privacyAcknowledged: true,
                remindersEnabled: false,
              });
              window.location.href = '/learn';
            }}
          >
            {t('exploreWithout')}
          </button>
        </div>

        {/* Privacy note */}
        <p className="mt-8 text-center text-xs text-plum-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Free to use. Your data stays on your device.
        </p>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import { GirlIllustration } from '../components/GirlIllustration';
import { BookOpen, Calendar, Heart, Shield } from 'lucide-react';
import { saveOnboarding } from '../lib/storage';

export function Welcome() {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-blush-100 to-lavender-100" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-10 sm:py-12">
        {/* Girl illustration */}
        <div className="mb-5 animate-fade-in">
          <div className="animate-sway">
            <GirlIllustration size={160} />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="mb-1.5 font-display text-4xl font-semibold text-plum-700 animate-slide-up tracking-tight sm:text-5xl">
          Saheli
        </h1>

        {/* Tagline */}
        <p className="mb-3 text-center font-display text-base text-coral-400 animate-slide-up sm:text-lg" style={{ animationDelay: '0.1s' }}>
          {t('tagline')}
        </p>

        {/* Supporting copy */}
        <p className="mb-8 text-center text-sm leading-relaxed text-plum-400 animate-slide-up max-w-xs sm:text-base sm:max-w-sm" style={{ animationDelay: '0.2s' }}>
          {t('supportingCopy')}
        </p>

        {/* Feature highlights */}
        <div className="mb-8 grid w-full grid-cols-2 gap-2.5 animate-slide-up sm:gap-3" style={{ animationDelay: '0.3s' }}>
          <div className="card p-3 text-center sm:p-4">
            <Calendar className="mx-auto mb-1.5 text-coral-400" size={22} />
            <p className="text-xs font-medium text-plum-500 sm:text-sm">Cycle tracking</p>
          </div>
          <div className="card p-3 text-center sm:p-4">
            <BookOpen className="mx-auto mb-1.5 text-lavender-400" size={22} />
            <p className="text-xs font-medium text-plum-500 sm:text-sm">Health education</p>
          </div>
          <div className="card p-3 text-center sm:p-4">
            <Heart className="mx-auto mb-1.5 text-blush-400" size={22} />
            <p className="text-xs font-medium text-plum-500 sm:text-sm">Saheli AI companion</p>
          </div>
          <div className="card p-3 text-center sm:p-4">
            <Shield className="mx-auto mb-1.5 text-plum-400" size={22} />
            <p className="text-xs font-medium text-plum-500 sm:text-sm">Privacy-first</p>
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
        <p className="mt-6 text-center text-xs text-plum-300 animate-fade-in sm:mt-8" style={{ animationDelay: '0.5s' }}>
          Free to use. Your data stays on your device.
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { GirlIllustration } from './GirlIllustration';

const SPLASH_KEY = 'saheli_splash_shown';

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    try {
      const shown = sessionStorage.getItem(SPLASH_KEY);
      if (shown) return;
      setVisible(true);
    } catch {
      return;
    }

    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch { /* ignore */ }
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-cream-50 via-blush-100 to-lavender-100 transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden="true"
    >
      {/* Decorative floating accents */}
      <div className="pointer-events-none absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-coral-300 opacity-30 animate-fade-in" style={{ animationDelay: '0.3s' }} />
      <div className="pointer-events-none absolute right-[15%] top-[22%] h-2 w-2 rounded-full bg-lavender-300 opacity-40 animate-fade-in" style={{ animationDelay: '0.5s' }} />
      <div className="pointer-events-none absolute left-[18%] bottom-[20%] h-2.5 w-2.5 rounded-full bg-mint-200 opacity-30 animate-fade-in" style={{ animationDelay: '0.7s' }} />
      <div className="pointer-events-none absolute right-[12%] bottom-[18%] h-3 w-3 rounded-full bg-coral-200 opacity-30 animate-fade-in" style={{ animationDelay: '0.4s' }} />

      {/* Girl illustration */}
      <div className="animate-scale-in">
        <div className="animate-sway">
          <GirlIllustration size={140} />
        </div>
      </div>

      {/* App name */}
      <h1 className="mt-4 font-display text-3xl font-semibold text-plum-700 tracking-tight animate-fade-in" style={{ animationDelay: '0.3s' }}>
        Saheli
      </h1>

      {/* Tagline */}
      <p className="mt-1.5 text-center font-display text-sm text-coral-400 animate-fade-in px-8 max-w-xs" style={{ animationDelay: '0.6s' }}>
        Your Cycle. Your Health. Your Safe Space.
      </p>
    </div>
  );
}

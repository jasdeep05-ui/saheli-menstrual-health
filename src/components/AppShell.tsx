import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Chrome as Home, Calendar, MessageCircle, BookOpen, LifeBuoy, Settings, MoreHorizontal, TrendingUp, Heart, X } from 'lucide-react';
import { useApp } from '../lib/app-context';
import { SaheliWordmark } from './Logo';
import { FloatingSaheli } from './FloatingSaheli';

const navItems = [
  { path: '/home', icon: Home, key: 'navHome' as const },
  { path: '/track', icon: Calendar, key: 'navTrack' as const },
  { path: '/ask', icon: MessageCircle, key: 'navAsk' as const },
  { path: '/learn', icon: BookOpen, key: 'navLearn' as const },
];

const moreItems = [
  { path: '/symptoms', icon: Heart, key: 'navSymptoms' as const },
  { path: '/insights', icon: TrendingUp, key: 'navInsights' as const },
  { path: '/help', icon: LifeBuoy, key: 'navHelp' as const },
  { path: '/settings', icon: Settings, key: 'navSettings' as const },
];

const allDesktopNav = [
  ...navItems,
  { path: '/symptoms', icon: Heart, key: 'navSymptoms' as const },
  { path: '/insights', icon: TrendingUp, key: 'navInsights' as const },
  { path: '/help', icon: LifeBuoy, key: 'navHelp' as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const morePaths = moreItems.map(i => i.path);
  const moreActive = morePaths.includes(location.pathname);

  const handleMoreNavigate = (path: string) => {
    setMoreOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-cream-200 bg-white/80 backdrop-blur-sm lg:flex">
        <div className="px-5 py-6">
          <SaheliWordmark size={36} />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {allDesktopNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-coral-50 text-coral-500'
                      : 'text-plum-500 hover:bg-cream-100'
                  }`
                }
              >
                <Icon size={20} />
                {t(item.key)}
              </NavLink>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive ? 'bg-coral-50 text-coral-500' : 'text-plum-500 hover:bg-cream-100'
              }`
            }
          >
            <Settings size={20} />
            {t('navSettings')}
          </NavLink>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-60">
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-6 lg:max-w-4xl lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-cream-200 bg-white/95 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-coral-500' : 'text-plum-400'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="truncate max-w-full">{t(item.key)}</span>
              </NavLink>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-medium transition-colors ${
              moreActive ? 'text-coral-500' : 'text-plum-400'
            }`}
            aria-label={t('navMore')}
          >
            <MoreHorizontal size={20} strokeWidth={moreActive ? 2.5 : 2} />
            <span>{t('navMore')}</span>
          </button>
        </div>
      </nav>

      {/* Mobile More sheet */}
      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-plum-700/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-4 pb-6 shadow-float lg:hidden"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
            role="dialog"
            aria-label={t('navMore')}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-cream-200" />
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-plum-700">{t('navMore')}</h2>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-plum-400 hover:bg-cream-100"
                aria-label={t('commonClose')}
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleMoreNavigate(item.path)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                      isActive
                        ? 'border-coral-300 bg-coral-50 text-coral-500'
                        : 'border-cream-200 text-plum-500 hover:bg-cream-50'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-sm font-medium">{t(item.key)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Floating AI assistant */}
      <FloatingSaheli />
    </div>
  );
}

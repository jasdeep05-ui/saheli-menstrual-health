import { NavLink, useLocation } from 'react-router-dom';
import { Chrome as Home, Calendar, MessageCircle, BookOpen, LifeBuoy } from 'lucide-react';
import { useApp } from '../lib/app-context';
import { SaheliWordmark } from './Logo';
import { FloatingSaheli } from './FloatingSaheli';
import { Settings } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, key: 'navHome' as const },
  { path: '/track', icon: Calendar, key: 'navTrack' as const },
  { path: '/ask', icon: MessageCircle, key: 'navAsk' as const },
  { path: '/learn', icon: BookOpen, key: 'navLearn' as const },
  { path: '/help', icon: LifeBuoy, key: 'navHelp' as const },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useApp();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-cream-200 bg-white/80 backdrop-blur-sm lg:flex">
        <div className="px-5 py-6">
          <SaheliWordmark size={36} />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(item => {
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
          <NavLink
            to="/symptoms"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive ? 'bg-coral-50 text-coral-500' : 'text-plum-500 hover:bg-cream-100'
              }`
            }
          >
            <Calendar size={20} />
            {t('navSymptoms')}
          </NavLink>
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive ? 'bg-coral-50 text-coral-500' : 'text-plum-500 hover:bg-cream-100'
              }`
            }
          >
            <Calendar size={20} />
            {t('navInsights')}
          </NavLink>
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
        {/* Mobile settings button */}
        <NavLink
          to="/settings"
          className="fixed right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-plum-400 shadow-soft backdrop-blur-sm transition-colors hover:text-coral-500 lg:hidden"
          style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
          aria-label={t('navSettings')}
        >
          <Settings size={20} />
        </NavLink>
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-6 lg:max-w-4xl lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-cream-200 bg-white/95 backdrop-blur-sm lg:hidden"
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
        </div>
      </nav>

      {/* Floating AI assistant */}
      <FloatingSaheli />
    </div>
  );
}

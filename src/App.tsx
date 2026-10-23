import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './lib/app-context';
import { AppShell } from './components/AppShell';
import { Welcome } from './pages/Welcome';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Track } from './pages/Track';
import { Symptoms } from './pages/Symptoms';
import { Insights } from './pages/Insights';
import { AskSaheli } from './pages/AskSaheli';
import { Learn } from './pages/Learn';
import { ArticleView } from './pages/ArticleView';
import { Help } from './pages/Help';
import { Settings } from './pages/Settings';

function AppRoutes() {
  const { isOnboarded } = useApp();

  return (
    <Routes>
      <Route path="/" element={isOnboarded ? <Navigate to="/home" replace /> : <Welcome />} />
      <Route path="/onboarding" element={isOnboarded ? <Navigate to="/home" replace /> : <Onboarding />} />
      <Route path="*" element={
        isOnboarded ? (
          <AppShell>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/track" element={<Track />} />
              <Route path="/symptoms" element={<Symptoms />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/ask" element={<AskSaheli />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:articleId" element={<ArticleView />} />
              <Route path="/help" element={<Help />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </AppShell>
        ) : (
          <Navigate to="/" replace />
        )
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

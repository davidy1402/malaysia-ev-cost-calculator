import { useState, useMemo, useEffect } from 'react';
import { DEFAULT_USER_INPUTS } from './constants/presets';
import { UserInputs } from './types/calculator';
import { calculateAllEvMetrics } from './utils/tnbTariff';
import { CockpitPage } from './components/CockpitPage';
import { ResultsPage } from './components/ResultsPage';
import { LanguageProvider } from './i18n/LanguageContext';

type Theme = 'light' | 'dark';
type ViewMode = 'cockpit' | 'results';

function AppContent() {
  const [view, setView] = useState<ViewMode>('cockpit');
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_USER_INPUTS);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Instant reactive calculation
  const result = useMemo(() => calculateAllEvMetrics(inputs), [inputs]);

  const handleUpdateInputs = (patch: Partial<UserInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const handleCalculate = () => {
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCockpit = () => {
    setView('cockpit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'results') {
    return (
      <ResultsPage
        inputs={inputs}
        result={result}
        onBack={handleBackToCockpit}
        onChange={handleUpdateInputs}
      />
    );
  }

  return (
    <CockpitPage
      inputs={inputs}
      result={result}
      onChange={handleUpdateInputs}
      onCalculate={handleCalculate}
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    />
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

import { useState, useEffect } from 'react';
import CockpitPage from './pages/cockpit.page';
import ResultsPage from './pages/results.page';
import { useCalculatorStore } from './stores/calculator.store';

export function App() {
  const [currentPage, setCurrentPage] = useState<'cockpit' | 'results'>('cockpit');
  const { theme } = useCalculatorStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Setup window.App for prototype compatibility
  useEffect(() => {
    (window as unknown as { App: { transitionTo: (id: string) => void; goBack: () => void } }).App = {
      transitionTo: (pageId: string) => {
        if (pageId === 'results' || pageId === 'cockpit') {
          setCurrentPage(pageId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      goBack: () => {
        setCurrentPage('cockpit');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
  }, []);

  if (currentPage === 'results') {
    return (
      <ResultsPage
        onBack={() => {
          setCurrentPage('cockpit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <CockpitPage
      onCalculate={() => {
        setCurrentPage('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}

export default App;

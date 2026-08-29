import { useState, useMemo, useEffect } from 'react';
import { DEFAULT_USER_INPUTS } from './constants/presets';
import { UserInputs } from './types/calculator';
import { calculateAllEvMetrics } from './utils/tnbTariff';
import { Navbar } from './components/Navbar';
import { ShowroomInputCard } from './components/ShowroomInputCard';
import { SavingsHeroCard } from './components/SavingsHeroCard';
import { CostPer100KmComparison } from './components/CostPer100KmComparison';
import { TnbBreakdownCard } from './components/TnbBreakdownCard';
import { ThresholdJumpExplainerCard } from './components/ThresholdJumpExplainerCard';
import { AdvancedSettingsDrawer } from './components/AdvancedSettingsDrawer';
import { ShareReportModal } from './components/ShareReportModal';

type Theme = 'light' | 'dark';

export function App() {
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_USER_INPUTS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  // Instant reactive computation
  const result = useMemo(() => calculateAllEvMetrics(inputs), [inputs]);

  const handleUpdateInputs = (patch: Partial<UserInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_USER_INPUTS);
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <Navbar
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
        {/* 01 — Showroom inputs */}
        <section className="mb-8">
          <ShowroomInputCard inputs={inputs} result={result} onChange={handleUpdateInputs} />
        </section>

        {/* Verdict hero */}
        <section className="mb-8">
          <SavingsHeroCard inputs={inputs} result={result} />
        </section>

        {/* Per-100km comparison */}
        <section className="mb-8">
          <CostPer100KmComparison inputs={inputs} result={result} />
        </section>

        {/* TNB bill breakdown */}
        <section className="mb-8">
          <TnbBreakdownCard inputs={inputs} result={result} />
        </section>

        {/* 600 kWh Threshold Jump Deep-Dive */}
        <section className="mb-8">
          <ThresholdJumpExplainerCard inputs={inputs} result={result} />
        </section>
      </main>

      {/* Modals and Drawers */}
      <AdvancedSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        inputs={inputs}
        onChange={handleUpdateInputs}
      />

      <ShareReportModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        inputs={inputs}
        result={result}
      />

      {/* Footer */}
      <footer className="border-t border-line py-8">
        <p className="text-center text-xs leading-relaxed text-faint">
          所有数字为估算，实际以 TNB 账单与经销商报价为准。
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          Malaysia EV × TNB Cost Calculator
        </p>
      </footer>
    </div>
  );
}

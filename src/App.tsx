import { useState, useMemo, useEffect } from 'react';
import { DEFAULT_USER_INPUTS } from './constants/presets';
import { UserInputs } from './types/calculator';
import { calculateAllEvMetrics } from './utils/tnbTariff';
import { Navbar } from './components/Navbar';
import { ShowroomInputCard } from './components/ShowroomInputCard';
import { SavingsHeroCard } from './components/SavingsHeroCard';
import { MultiCarCompareCard } from './components/MultiCarCompareCard';
import { CostPer100KmComparison } from './components/CostPer100KmComparison';
import { RoadTaxComparisonCard } from './components/RoadTaxComparisonCard';
import { TnbBreakdownCard } from './components/TnbBreakdownCard';
import { ThresholdJumpExplainerCard } from './components/ThresholdJumpExplainerCard';
import { AdvancedSettingsDrawer } from './components/AdvancedSettingsDrawer';
import { ShareReportModal } from './components/ShareReportModal';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

type Theme = 'light' | 'dark';

function AppContent() {
  const { t } = useLanguage();
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
        {/* 01 — Showroom Target Inputs */}
        <section className="mb-8">
          <ShowroomInputCard inputs={inputs} result={result} onChange={handleUpdateInputs} />
        </section>

        {/* 02 — Verdict Hero Card */}
        <section className="mb-8">
          <SavingsHeroCard inputs={inputs} result={result} />
        </section>

        {/* 03 — Multi-Car Side-by-Side Comparison */}
        <section className="mb-8">
          <MultiCarCompareCard inputs={inputs} result={result} />
        </section>

        {/* 04 — Per-100km & Trip Scenarios */}
        <section className="mb-8">
          <CostPer100KmComparison inputs={inputs} result={result} />
        </section>

        {/* 05 — 2026 Malaysia JPJ Official EV Road Tax Comparison */}
        <section className="mb-8">
          <RoadTaxComparisonCard inputs={inputs} result={result} onChange={handleUpdateInputs} />
        </section>

        {/* 06 — Real TNB Itemized Bill Breakdown */}
        <section className="mb-8">
          <TnbBreakdownCard inputs={inputs} result={result} />
        </section>

        {/* 07 — 600 kWh Threshold Jump Deep-Dive */}
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
          {t.footer.disclaimer}
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          {t.footer.appName}
        </p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

import React, { useEffect } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { Fuel, Zap, Home, CheckCircle2, Sparkles } from 'lucide-react';
import { formatRm } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';

interface SavingsHeroCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const SavingsHeroCard: React.FC<SavingsHeroCardProps> = ({
  inputs,
  result
}) => {
  const { t } = useLanguage();
  const isPositiveSavings = result.monthlyNetSavings > 0;

  useEffect(() => {
    if (isPositiveSavings && result.monthlyNetSavings > 15) {
      try {
        confetti({
          particleCount: 24,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399']
        });
      } catch (e) {
        // ignore in SSR
      }
    }
  }, [inputs.modelName, inputs.consumptionKwhPer100Km, inputs.chargingMode]);

  const modeName = inputs.chargingMode === 'home_only' ? t.verdict.homeOnlyModeName : t.verdict.mixedModeName;
  const headerText = t.verdict.header.replace('{model}', inputs.modelName.trim() || 'EV').replace('{mode}', modeName);

  return (
    <div className="space-y-4">
      {/* 1. Master Verdict Card */}
      <div className="doppelrand-shell">
        <div className="doppelrand-core relative overflow-hidden bg-gradient-to-br from-brand-strong/15 via-surface to-surface border border-brand/20 p-5 sm:p-7">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold text-brand border border-brand/20 whitespace-nowrap">
                  <Sparkles size={12} strokeWidth={2} />
                  <span>{t.verdict.tag}</span>
                </span>
                <span className="text-xs font-semibold text-muted line-clamp-1">
                  {headerText}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-medium text-muted block">
                {t.verdict.totalExpenseSub}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className={`text-3xl sm:text-5xl font-extrabold font-mono tracking-tight whitespace-nowrap ${isPositiveSavings ? 'text-brand' : 'text-oil'}`}>
                  {isPositiveSavings
                    ? t.verdict.savesMonthly.replace('{amount}', formatRm(Math.abs(result.monthlyNetSavings)))
                    : t.verdict.costsMoreMonthly.replace('{amount}', formatRm(Math.abs(result.monthlyNetSavings)))}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-muted font-medium">
              {t.verdict.yearly5yr
                .replace('{verb}', isPositiveSavings ? t.verdict.saveVerb : t.verdict.costVerb)
                .replace('{yearly}', formatRm(Math.abs(result.yearlyNetSavings)))
                .replace('{fiveYear}', formatRm(Math.abs(result.fiveYearNetSavings)))}
            </p>

            {/* Arithmetic Breakdown Waterfall */}
            <div className="mt-4.5 rounded-2xl border border-line bg-surface/90 p-4 text-xs text-ink leading-relaxed space-y-2.5 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-brand text-xs">
                <CheckCircle2 size={15} strokeWidth={2.25} />
                <span>{t.verdict.logicTitle}</span>
              </div>

              <div className="space-y-1.5 text-muted divide-y divide-line/60">
                <p className="pt-1">
                  {t.verdict.logicPetrol.replace('{amount}', formatRm(inputs.fatherPetrolCostRm))}
                </p>
                <p className="pt-1.5">
                  {t.verdict.logicHome
                    .replace('{marginal}', formatRm(result.marginalHomeElectricityCost))
                    .replace('{old}', formatRm(result.baselineBill.totalAmount))
                    .replace('{new}', formatRm(result.newCombinedBill.totalAmount))}
                  {inputs.chargingMode === 'mixed' && t.verdict.logicPublic.replace('{publicCost}', formatRm(result.publicChargingCost))}
                </p>
              </div>

              <div className="border-t border-line pt-2 font-bold font-mono text-ink text-xs sm:text-[13px] flex items-center justify-between flex-wrap gap-1">
                <span>
                  {t.verdict.logicNet
                    .replace('{petrol}', formatRm(inputs.fatherPetrolCostRm))
                    .replace('{home}', formatRm(result.marginalHomeElectricityCost))
                    .replace('{public}', inputs.chargingMode === 'mixed' ? `− ${formatRm(result.publicChargingCost)}` : '')
                    .replace('{savings}', formatRm(result.monthlyNetSavings))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side: Current Monthly vs EV Monthly */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Left: Current State */}
        <div className="rounded-2xl border border-line bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-xs font-bold text-muted uppercase tracking-wider whitespace-nowrap">
              {t.verdict.currentMonthlyTitle}
            </span>
            <span className="font-mono text-base font-bold text-ink whitespace-nowrap">
              {formatRm(result.oldTotalMonthlyEnergyExpense)}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans text-muted">
                <Home size={14} strokeWidth={2} className="text-grid" />
                <span className="whitespace-nowrap">{t.verdict.homeBillLabel.replace('{kwh}', result.baselineBill.kwh.toString())}</span>
              </div>
              <span className="font-semibold text-ink whitespace-nowrap">{formatRm(result.baselineBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans text-muted">
                <Fuel size={14} strokeWidth={2} className="text-oil" />
                <span className="whitespace-nowrap">{t.verdict.petrolLabel}</span>
              </div>
              <span className="font-semibold text-oil whitespace-nowrap">{formatRm(inputs.fatherPetrolCostRm)}</span>
            </div>
          </div>
        </div>

        {/* Right: EV State */}
        <div className="rounded-2xl border border-brand/35 bg-surface p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-xs font-bold text-brand uppercase tracking-wider whitespace-nowrap">
              {t.verdict.evMonthlyTitle}
            </span>
            <span className="font-mono text-base font-bold text-brand whitespace-nowrap">
              {formatRm(result.newTotalMonthlyEnergyExpense)}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans text-muted">
                <Zap size={14} strokeWidth={2} className="text-brand" />
                <span className="whitespace-nowrap">{t.verdict.newHomeBillLabel.replace('{kwh}', result.newCombinedBill.kwh.toString())}</span>
              </div>
              <span className="font-semibold text-brand whitespace-nowrap">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans text-faint">
                <span className="whitespace-nowrap">{inputs.chargingMode === 'home_only' ? t.verdict.publicDcZeroLabel : t.verdict.publicDcLabel}</span>
              </div>
              <span className="text-muted whitespace-nowrap">{formatRm(result.publicChargingCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

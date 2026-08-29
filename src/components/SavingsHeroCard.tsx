import React, { useEffect } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { Fuel, Zap, Home, CheckCircle2 } from 'lucide-react';
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
          particleCount: 25,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399']
        });
      } catch (e) {
        // ignore in SSR/test
      }
    }
  }, [inputs.modelName, inputs.consumptionKwhPer100Km, inputs.chargingMode]);

  const modeName = inputs.chargingMode === 'home_only' ? t.verdict.homeOnlyModeName : t.verdict.mixedModeName;
  const headerText = t.verdict.header.replace('{model}', inputs.modelName.trim() || 'EV').replace('{mode}', modeName);

  return (
    <div className="space-y-4">
      {/* Big Direct Verdict Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-zinc-950 p-6 text-white shadow-2xl sm:p-8 border border-emerald-500/20">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              {t.verdict.tag}
            </span>
            <span className="text-xs text-zinc-300 font-medium">
              {headerText}
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xs text-zinc-300">
              {t.verdict.totalExpenseSub}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-3xl font-bold font-mono tracking-tight sm:text-5xl ${isPositiveSavings ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isPositiveSavings
                  ? t.verdict.savesMonthly.replace('{amount}', formatRm(Math.abs(result.monthlyNetSavings)))
                  : t.verdict.costsMoreMonthly.replace('{amount}', formatRm(Math.abs(result.monthlyNetSavings)))}
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs text-zinc-300 sm:text-sm">
            {t.verdict.yearly5yr
              .replace('{verb}', isPositiveSavings ? t.verdict.saveVerb : t.verdict.costVerb)
              .replace('{yearly}', formatRm(Math.abs(result.yearlyNetSavings)))
              .replace('{fiveYear}', formatRm(Math.abs(result.fiveYearNetSavings)))}
          </p>

          {/* Simple plain explanation box */}
          <div className="mt-4 rounded-xl bg-zinc-950/70 p-3.5 border border-zinc-800 text-xs text-zinc-200 leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <CheckCircle2 size={15} />
              <span>{t.verdict.logicTitle}</span>
            </div>

            <p>
              {t.verdict.logicPetrol.replace('{amount}', formatRm(inputs.fatherPetrolCostRm))}
            </p>
            <p>
              {t.verdict.logicHome
                .replace('{marginal}', formatRm(result.marginalHomeElectricityCost))
                .replace('{old}', formatRm(result.baselineBill.totalAmount))
                .replace('{new}', formatRm(result.newCombinedBill.totalAmount))}
              {inputs.chargingMode === 'mixed' && t.verdict.logicPublic.replace('{publicCost}', formatRm(result.publicChargingCost))}
            </p>
            <p className="border-t border-zinc-800/80 pt-1.5 font-semibold text-zinc-100">
              {t.verdict.logicNet
                .replace('{petrol}', formatRm(inputs.fatherPetrolCostRm))
                .replace('{home}', formatRm(result.marginalHomeElectricityCost))
                .replace('{public}', inputs.chargingMode === 'mixed' ? `− ${formatRm(result.publicChargingCost)}` : '')
                .replace('{savings}', formatRm(result.monthlyNetSavings))}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-side: Now vs After buying EV */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Left: Current State */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              {t.verdict.currentMonthlyTitle}
            </span>
            <span className="font-mono text-base font-bold text-zinc-100">
              {formatRm(result.oldTotalMonthlyEnergyExpense)}
            </span>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans">
                <Home size={14} className="text-blue-400" />
                <span>{t.verdict.homeBillLabel.replace('{kwh}', result.baselineBill.kwh.toString())}</span>
              </div>
              <span className="font-semibold text-zinc-100">{formatRm(result.baselineBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans">
                <Fuel size={14} className="text-amber-400" />
                <span>{t.verdict.petrolLabel}</span>
              </div>
              <span className="font-semibold text-amber-400">{formatRm(inputs.fatherPetrolCostRm)}</span>
            </div>
          </div>
        </div>

        {/* Right: EV State */}
        <div className="rounded-2xl border border-emerald-500/30 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {t.verdict.evMonthlyTitle}
            </span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {formatRm(result.newTotalMonthlyEnergyExpense)}
            </span>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans">
                <Zap size={14} className="text-emerald-400" />
                <span>{t.verdict.newHomeBillLabel.replace('{kwh}', result.newCombinedBill.kwh.toString())}</span>
              </div>
              <span className="font-semibold text-emerald-400">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans text-zinc-400">
                <span>{inputs.chargingMode === 'home_only' ? t.verdict.publicDcZeroLabel : t.verdict.publicDcLabel}</span>
              </div>
              <span className="text-zinc-400">{formatRm(result.publicChargingCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

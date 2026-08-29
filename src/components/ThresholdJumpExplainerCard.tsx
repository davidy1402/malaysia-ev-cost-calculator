import React, { useState } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { AlertTriangle, ChevronDown, ChevronUp, Flame, Zap, Clock } from 'lucide-react';
import { formatRm } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';

interface ThresholdJumpExplainerCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const ThresholdJumpExplainerCard: React.FC<ThresholdJumpExplainerCardProps> = ({
  inputs,
  result
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const baselineKwh = result.baselineBill.kwh;
  const newKwh = result.newCombinedBill.kwh;

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base flex items-center gap-2">
              <span>{t.threshold.title}</span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              {t.threshold.sub}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <span>{isOpen ? t.threshold.collapseBtn : t.threshold.expandBtn}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Your Household Specific Risk Status */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Flame size={15} />
            <span>{t.threshold.riskTitle}</span>
          </span>
          <span className="font-mono text-xs text-zinc-300">
            {baselineKwh} kWh ➔ <strong className="text-amber-400">{newKwh} kWh</strong>
          </span>
        </div>

        <p className="text-xs text-zinc-200 leading-relaxed">
          {t.threshold.riskDesc
            .replace('{old}', baselineKwh.toString())
            .replace('{new}', newKwh.toString())
            .replace('{afa}', result.newCombinedBill.afaSurcharge.toFixed(2))}
        </p>

        <div className="pt-1 border-t border-amber-500/20 text-xs font-medium text-emerald-400">
          {t.threshold.riskConclusion
            .replace('{marginal}', formatRm(result.marginalHomeElectricityCost))
            .replace('{petrol}', formatRm(inputs.fatherPetrolCostRm))
            .replace('{savings}', formatRm(result.monthlyNetSavings))}
        </div>
      </div>

      {/* Deep-Dive Educational Section */}
      {isOpen && (
        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 text-xs text-zinc-300 leading-relaxed">
          <h4 className="font-semibold text-zinc-100 text-sm flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Zap size={16} className="text-emerald-400" />
            <span>{t.threshold.title}</span>
          </h4>

          <div className="space-y-3">
            <div className="space-y-1">
              <strong className="text-amber-300 block">{t.threshold.r1Title}</strong>
              <p className="text-zinc-400">{t.threshold.r1Desc}</p>
            </div>

            <div className="space-y-1">
              <strong className="text-amber-300 block">{t.threshold.r2Title}</strong>
              <p className="text-zinc-400">{t.threshold.r2Desc}</p>
            </div>

            <div className="space-y-1">
              <strong className="text-amber-300 block">{t.threshold.r3Title}</strong>
              <p className="text-zinc-400">{t.threshold.r3Desc}</p>
            </div>

            <div className="space-y-1">
              <strong className="text-amber-300 block">{t.threshold.r4Title}</strong>
              <p className="text-zinc-400">{t.threshold.r4Desc}</p>
            </div>
          </div>

          {/* Solution: ToU */}
          <div className="mt-4 rounded-xl bg-blue-950/30 border border-blue-500/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-blue-300">
              <Clock size={15} />
              <span>{t.threshold.touTitle}</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              {t.threshold.touDesc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

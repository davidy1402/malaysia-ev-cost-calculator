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
    <div className="doppelrand-shell">
      <div className="doppelrand-core space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-oil-soft text-oil">
              <AlertTriangle size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                {t.threshold.title}
              </h3>
              <p className="text-[11px] text-muted">
                {t.threshold.sub}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted btn-spring hover:border-line-strong hover:text-ink shadow-sm whitespace-nowrap"
          >
            <span>{isOpen ? t.threshold.collapseBtn : t.threshold.expandBtn}</span>
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Your Household Specific Risk Status */}
        <div className="rounded-2xl border border-oil/30 bg-oil-soft/40 p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-xs font-bold text-oil flex items-center gap-1.5 whitespace-nowrap">
              <Flame size={15} strokeWidth={2} />
              <span>{t.threshold.riskTitle}</span>
            </span>
            <span className="font-mono text-xs font-semibold text-ink whitespace-nowrap">
              {baselineKwh} kWh ➔ <strong className="text-oil font-bold">{newKwh} kWh</strong>
            </span>
          </div>

          <p className="text-xs text-ink leading-relaxed">
            {t.threshold.riskDesc
              .replace('{old}', baselineKwh.toString())
              .replace('{new}', newKwh.toString())
              .replace('{afa}', result.newCombinedBill.afaSurcharge.toFixed(2))}
          </p>

          <div className="pt-2 border-t border-oil/20 text-xs font-bold text-brand">
            {t.threshold.riskConclusion
              .replace('{marginal}', formatRm(result.marginalHomeElectricityCost))
              .replace('{petrol}', formatRm(inputs.fatherPetrolCostRm))
              .replace('{savings}', formatRm(result.monthlyNetSavings))}
          </div>
        </div>

        {/* Deep-Dive Educational Section */}
        {isOpen && (
          <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 text-xs text-ink leading-relaxed shadow-sm">
            <h4 className="font-bold text-ink text-sm flex items-center gap-2 border-b border-line pb-2">
              <Zap size={15} strokeWidth={2} className="text-brand" />
              <span>{t.threshold.title}</span>
            </h4>

            <div className="space-y-3">
              <div className="space-y-1">
                <strong className="text-oil block font-bold">{t.threshold.r1Title}</strong>
                <p className="text-muted">{t.threshold.r1Desc}</p>
              </div>

              <div className="space-y-1">
                <strong className="text-oil block font-bold">{t.threshold.r2Title}</strong>
                <p className="text-muted">{t.threshold.r2Desc}</p>
              </div>

              <div className="space-y-1">
                <strong className="text-oil block font-bold">{t.threshold.r3Title}</strong>
                <p className="text-muted">{t.threshold.r3Desc}</p>
              </div>

              <div className="space-y-1">
                <strong className="text-oil block font-bold">{t.threshold.r4Title}</strong>
                <p className="text-muted">{t.threshold.r4Desc}</p>
              </div>
            </div>

            {/* Solution: ToU */}
            <div className="mt-4 rounded-xl bg-grid-soft border border-grid/30 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-grid whitespace-nowrap">
                <Clock size={15} strokeWidth={2} />
                <span>{t.threshold.touTitle}</span>
              </div>
              <p className="text-ink text-[11px] leading-relaxed">
                {t.threshold.touDesc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

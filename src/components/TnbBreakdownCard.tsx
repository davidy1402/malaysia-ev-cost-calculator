import React, { useState } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { formatRm } from '../utils/formatter';
import { useLanguage } from '../i18n/LanguageContext';

interface TnbBreakdownCardProps {
  inputs?: UserInputs;
  result: EvCalculationResult;
}

export const TnbBreakdownCard: React.FC<TnbBreakdownCardProps> = ({
  result
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const totalKwh = result.newCombinedBill.kwh;

  return (
    <div className="doppelrand-shell">
      <div className="doppelrand-core space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Zap size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">
                {t.tnb.title}
              </h3>
              <p className="text-[11px] text-muted">
                {t.tnb.sub}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted btn-spring hover:border-line-strong hover:text-ink shadow-sm"
          >
            <span>{isExpanded ? t.tnb.hideDetails : t.tnb.viewDetails}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Usage Summary Box */}
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-ink font-bold">
              {t.tnb.totalUsageTitle}<strong className="font-mono text-base font-extrabold text-brand ml-1">{totalKwh}</strong> kWh
            </span>
            <span className="text-xs text-muted font-mono">
              {t.tnb.totalUsageSub
                .replace('{home}', result.baselineBill.kwh.toString())
                .replace('{ev}', result.evHomeChargingKwh.toString())}
            </span>
          </div>

          {/* Visual Usage Bar */}
          <div className="space-y-1.5">
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-paper">
              {/* Baseline portion */}
              <div
                className="absolute left-0 top-0 h-full bg-grid rounded-l-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (result.baselineBill.kwh / totalKwh) * 100)}%` }}
              />
              {/* EV portion */}
              <div
                className="absolute top-0 h-full bg-brand rounded-r-full transition-all duration-500 ease-out"
                style={{
                  left: `${Math.min(100, (result.baselineBill.kwh / totalKwh) * 100)}%`,
                  width: `${Math.max(0, 100 - (result.baselineBill.kwh / totalKwh) * 100)}%`
                }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-muted">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-grid inline-block" />
                <span>{t.tnb.homeUsageLegend.replace('{kwh}', result.baselineBill.kwh.toString())}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand inline-block" />
                <span>{t.tnb.evUsageLegend.replace('{kwh}', result.evHomeChargingKwh.toString())}</span>
              </div>
            </div>
          </div>

          {/* Summary Note */}
          <div className="rounded-xl bg-paper/80 p-3 text-xs text-ink leading-relaxed border border-line">
            <span className="font-bold">账单变化一览：</span>
            {t.tnb.billChangeSummary
              .replace('{old}', formatRm(result.baselineBill.totalAmount))
              .replace('{oldKwh}', result.baselineBill.kwh.toString())
              .replace('{marginal}', formatRm(result.marginalHomeElectricityCost))
              .replace('{new}', formatRm(result.newCombinedBill.totalAmount))}
          </div>
        </div>

        {/* Expanded Itemized Table */}
        {isExpanded && (
          <div className="overflow-hidden rounded-2xl border border-line bg-surface text-xs shadow-sm">
            <div className="p-3 bg-paper/80 border-b border-line text-ink font-bold flex items-center justify-between">
              <span>{t.tnb.itemizedHeader}</span>
              <span className="font-mono text-brand font-bold">
                {t.tnb.newTotalHeader.replace('{amount}', formatRm(result.newCombinedBill.totalAmount))}
              </span>
            </div>

            <div className="divide-y divide-line/60 font-mono text-ink">
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="font-sans text-muted">{t.tnb.item1}</span>
                <span className="font-semibold text-ink">{formatRm(result.newCombinedBill.baseEnergySubtotal)}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 text-brand">
                <span className="font-sans text-muted">{t.tnb.item2.replace('{sen}', result.newCombinedBill.eeiRebateSen.toString())}</span>
                <span>−{formatRm(result.newCombinedBill.eeiRebateAmount)}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="font-sans text-muted">{t.tnb.item3}</span>
                <span className="text-ink">{result.newCombinedBill.retailCharge > 0 ? formatRm(result.newCombinedBill.retailCharge) : t.tnb.waivedText}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="font-sans text-muted">{t.tnb.item4}</span>
                <span className="text-ink">{result.newCombinedBill.afaSurcharge > 0 ? formatRm(result.newCombinedBill.afaSurcharge) : t.tnb.waivedText}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="font-sans text-muted">{t.tnb.item5}</span>
                <span className="text-ink">{formatRm(result.newCombinedBill.kwtbbFund)}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="font-sans text-muted">{t.tnb.item6}</span>
                <span className="text-ink">{formatRm(result.newCombinedBill.sstTax)}</span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-3 bg-brand-soft text-brand font-bold">
                <span className="font-sans">{t.tnb.finalTotal}</span>
                <span className="text-base">{formatRm(result.newCombinedBill.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

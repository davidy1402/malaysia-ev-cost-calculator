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
    <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Zap size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
              {t.tnb.title}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {t.tnb.sub}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <span>{isExpanded ? t.tnb.hideDetails : t.tnb.viewDetails}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Usage Summary Box */}
      <div className="space-y-3 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-zinc-200 font-medium">
            {t.tnb.totalUsageTitle}<strong className="font-mono text-base font-bold text-emerald-400 ml-1">{totalKwh}</strong> kWh
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            {t.tnb.totalUsageSub
              .replace('{home}', result.baselineBill.kwh.toString())
              .replace('{ev}', result.evHomeChargingKwh.toString())}
          </span>
        </div>

        {/* Visual bar */}
        <div className="space-y-1.5">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-800">
            {/* Baseline portion */}
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 rounded-l-full transition-all duration-300"
              style={{ width: `${Math.min(100, (result.baselineBill.kwh / totalKwh) * 100)}%` }}
            />
            {/* EV portion */}
            <div
              className="absolute top-0 h-full bg-emerald-500 rounded-r-full transition-all duration-300"
              style={{
                left: `${Math.min(100, (result.baselineBill.kwh / totalKwh) * 100)}%`,
                width: `${Math.max(0, 100 - (result.baselineBill.kwh / totalKwh) * 100)}%`
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
              <span>{t.tnb.homeUsageLegend.replace('{kwh}', result.baselineBill.kwh.toString())}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span>{t.tnb.evUsageLegend.replace('{kwh}', result.evHomeChargingKwh.toString())}</span>
            </div>
          </div>
        </div>

        {/* Summary note */}
        <div className="rounded-xl bg-zinc-900/90 p-3 text-xs text-zinc-300 leading-relaxed border border-zinc-800/60">
          💡 {t.tnb.billChangeSummary
            .replace('{old}', formatRm(result.baselineBill.totalAmount))
            .replace('{oldKwh}', result.baselineBill.kwh.toString())
            .replace('{marginal}', formatRm(result.marginalHomeElectricityCost))
            .replace('{new}', formatRm(result.newCombinedBill.totalAmount))}
        </div>
      </div>

      {/* Expanded itemized comparison table */}
      {isExpanded && (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/90 text-xs">
          <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 text-zinc-200 font-medium flex items-center justify-between">
            <span>{t.tnb.itemizedHeader}</span>
            <span className="font-mono text-emerald-400 font-bold">
              {t.tnb.newTotalHeader.replace('{amount}', formatRm(result.newCombinedBill.totalAmount))}
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">{t.tnb.item1}</span>
              <span className="font-semibold text-zinc-100">{formatRm(result.newCombinedBill.baseEnergySubtotal)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5 text-emerald-400">
              <span className="font-sans text-zinc-300">{t.tnb.item2.replace('{sen}', result.newCombinedBill.eeiRebateSen.toString())}</span>
              <span>−{formatRm(result.newCombinedBill.eeiRebateAmount)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">{t.tnb.item3}</span>
              <span className="text-zinc-200">{result.newCombinedBill.retailCharge > 0 ? formatRm(result.newCombinedBill.retailCharge) : t.tnb.waivedText}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">{t.tnb.item4}</span>
              <span className="text-zinc-200">{result.newCombinedBill.afaSurcharge > 0 ? formatRm(result.newCombinedBill.afaSurcharge) : t.tnb.waivedText}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">{t.tnb.item5}</span>
              <span className="text-zinc-200">{formatRm(result.newCombinedBill.kwtbbFund)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">{t.tnb.item6}</span>
              <span className="text-zinc-200">{formatRm(result.newCombinedBill.sstTax)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-3 bg-emerald-950/40 text-emerald-300 font-bold">
              <span className="font-sans">{t.tnb.finalTotal}</span>
              <span className="text-base">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

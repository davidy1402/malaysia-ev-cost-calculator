import React, { useEffect } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { TrendingDown, TriangleAlert, Fuel, Zap, Home } from 'lucide-react';
import { formatRm } from '../utils/formatter';
import confetti from 'canvas-confetti';

interface SavingsHeroCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const SavingsHeroCard: React.FC<SavingsHeroCardProps> = ({
  inputs,
  result
}) => {
  const isPositiveSavings = result.monthlyNetSavings > 0;

  useEffect(() => {
    if (isPositiveSavings && result.monthlyNetSavings > 50) {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#46c795', '#0b7a55', '#e8a04c']
        });
      } catch (e) {
        // ignore in SSR/test
      }
    }
  }, [inputs.modelName]);

  return (
    <div className="space-y-4">
      {/* Verdict hero banner — premium brand card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e6b4a] via-[#0b563e] to-[#073122] p-6 text-white shadow-pop sm:p-8">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#46c795]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold text-[#b8ecd6] ring-1 ring-white/15">
              结论
            </span>
            <span className="text-xs text-white/70">
              换开 {inputs.modelName.trim() || '这台车'} 之后
            </span>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-sm font-medium text-white/70">
              {isPositiveSavings ? '每月大约省下' : '每月大约多花'}
            </span>
          </div>
          <div className="font-display mt-1 flex items-baseline gap-2">
            <span className="text-[52px] font-semibold leading-none tracking-tight sm:text-[64px]">
              {formatRm(Math.abs(result.monthlyNetSavings))}
            </span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-white/70 sm:text-sm">
            一年累计 {isPositiveSavings ? '省' : '多'}{' '}
            <span className="font-semibold text-white">{formatRm(Math.abs(result.yearlyNetSavings))}</span>
            ，五年累计{' '}
            <span className="font-semibold text-white">{formatRm(Math.abs(result.fiveYearNetSavings))}</span>
          </p>

          {/* Per-100km ratio chip */}
          <div className="mt-5 inline-flex items-center gap-2.5 rounded-2xl bg-white/10 px-3.5 py-2.5 ring-1 ring-white/15 backdrop-blur-sm">
            <TrendingDown size={18} strokeWidth={2} className="shrink-0 text-[#8fe6c3]" />
            <div>
              <div className="text-xs font-semibold text-white">
                每 100 km 便宜 {result.savingsRatioPerKm}%
              </div>
              <div className="mt-0.5 text-[10px] text-white/60">
                电 {formatRm(result.evCostPer100Km)} · 油 {formatRm(result.petrolCostPer100Km)}
              </div>
            </div>
          </div>
        </div>

        {/* 600 kWh threshold alert, embedded */}
        {result.crossed600Threshold && (
          <div className="relative mt-5 flex items-start gap-2.5 rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15">
            <TriangleAlert size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[#ffd28a]" />
            <div className="space-y-0.5 text-xs leading-relaxed">
              <div className="font-semibold text-[#ffe3b8]">
                总用电跨过 600 度门槛（{result.baselineBill.kwh} ➔ {result.newCombinedBill.kwh} kWh）
              </div>
              <p className="text-[11px] text-white/70">
                跨线后 TNB 会恢复收取 RM10 零售费与 AFA 燃油调整费（约多 {formatRm(result.thresholdJumpPenaltyRm)}）。
                即便如此，每月仍净省 <strong className="text-white">{formatRm(result.monthlyNetSavings)}</strong>。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Status Quo Box */}
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Fuel size={15} strokeWidth={1.75} className="text-oil" />
              <span>现在 · 油车生活</span>
            </div>
            <span className="font-display text-sm font-semibold text-ink">
              {formatRm(result.oldTotalMonthlyEnergyExpense)}
              <span className="ml-0.5 text-[10px] font-normal text-faint">/月</span>
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-1.5">
                <Home size={13} strokeWidth={1.75} className="text-grid" />
                家里电费（{result.baselineBill.kwh} 度）
              </span>
              <span className="font-medium text-ink">{formatRm(result.baselineBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-1.5">
                <Fuel size={13} strokeWidth={1.75} className="text-oil" />
                每月汽油（RON95）
              </span>
              <span className="font-medium text-oil">{formatRm(result.petrolMonthlyCost)}</span>
            </div>

            <div className="rounded-xl bg-inset p-2.5 text-[11px] leading-relaxed text-muted">
              够开约 <strong className="font-semibold text-ink">{result.petrolEquivalentDistanceKm.toLocaleString()} km</strong>／月（按 1 公升 14 km 估算）
            </div>
          </div>
        </div>

        {/* New Scenario Box */}
        <div className="space-y-3 rounded-2xl border border-brand/30 bg-brand-soft/40 p-4 shadow-card">
          <div className="flex items-center justify-between border-b border-brand/20 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
              <Zap size={15} strokeWidth={1.75} />
              <span>以后 · 电车生活</span>
            </div>
            <span className="font-display text-sm font-semibold text-brand">
              {formatRm(result.newTotalMonthlyEnergyExpense)}
              <span className="ml-0.5 text-[10px] font-normal opacity-60">/月</span>
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-1.5">
                <Home size={13} strokeWidth={1.75} className="text-brand" />
                新 TNB 总电费（{result.newCombinedBill.kwh} 度）
              </span>
              <span className="font-semibold text-ink">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between pl-4 text-[11px] text-muted">
              <span>└ 其中电车多出来的部分</span>
              <span className="font-medium text-brand">+{formatRm(result.marginalHomeElectricityCost)}</span>
            </div>

            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-1.5">
                <Zap size={13} strokeWidth={1.75} className="text-grid" />
                在外快充（约 10%）
              </span>
              <span className="font-medium text-ink">{formatRm(result.publicChargingCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

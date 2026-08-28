import React, { useEffect } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { TrendingDown, AlertTriangle, Sparkles, Fuel, Zap, Home } from 'lucide-react';
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
          colors: ['#10b981', '#34d399', '#6ee7b7']
        });
      } catch (e) {
        // ignore in SSR/test
      }
    }
  }, [inputs.modelName]);

  return (
    <div className="space-y-4">
      {/* Primary Savings Hero Banner */}
      <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-2xl backdrop-blur-md transition-all sm:p-6 ${
        isPositiveSavings
          ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-zinc-900/90 to-zinc-950 ring-1 ring-emerald-500/20'
          : 'border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-zinc-900/90 to-zinc-950 ring-1 ring-amber-500/20'
      }`}>
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                <Sparkles size={13} strokeWidth={2} />
                换开 {inputs.modelName} 对比结论
              </span>
              {isPositiveSavings && (
                <span className="text-xs font-medium text-emerald-400">
                  比现状更划算！
                </span>
              )}
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-zinc-100 sm:text-5xl">
                {isPositiveSavings ? formatRm(result.monthlyNetSavings) : formatRm(Math.abs(result.monthlyNetSavings))}
              </span>
              <span className="text-sm font-medium text-zinc-400">
                / 每月{isPositiveSavings ? '净节省' : '多支出'}
              </span>
            </div>

            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              一年累计节省 <span className="font-mono font-bold text-emerald-400">{formatRm(result.yearlyNetSavings)}</span> · 5年累计节省 <span className="font-mono font-bold text-emerald-400">{formatRm(result.fiveYearNetSavings)}</span>
            </p>
          </div>

          {/* Key comparison ratio pill */}
          <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:items-end">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-left sm:text-right">
              <div className="text-[11px] font-medium text-zinc-400">
                每 100km 能耗成本降低
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-lg font-bold text-emerald-400 sm:justify-end">
                <TrendingDown size={18} strokeWidth={2.2} />
                <span>{result.savingsRatioPerKm}%</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                电费 {formatRm(result.evCostPer100Km)} vs 油费 {formatRm(result.petrolCostPer100Km)}
              </div>
            </div>
          </div>
        </div>

        {/* 600 kWh Threshold Alert Banner */}
        {result.crossed600Threshold && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
            <AlertTriangle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-amber-400" />
            <div className="space-y-0.5">
              <div className="font-semibold text-amber-300">
                TNB 阶梯提醒：总用电跨过 600 kWh 门槛 ({result.baselineBill.kwh} kWh ➔ {result.newCombinedBill.kwh} kWh)
              </div>
              <p className="text-[11px] text-amber-200/80">
                跨过 600 度后，TNB 将恢复征收 RM10 Retail Charge 与每月 AFA 燃油调整费（约多出 {formatRm(result.thresholdJumpPenaltyRm)}）。
                即便如此，扣除全部电费后每月依然净省 <strong className="font-mono text-emerald-300">{formatRm(result.monthlyNetSavings)}</strong>！
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-side comparison cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Status Quo Box */}
        <div className="relative space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <Fuel size={16} strokeWidth={1.75} className="text-amber-400" />
              <span>【现状】家里原电费 + 爸爸油费</span>
            </div>
            <span className="font-mono text-xs font-bold text-zinc-200">
              {formatRm(result.oldTotalMonthlyEnergyExpense)} /月
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Home size={14} strokeWidth={1.75} />
                家里基础电费 ({result.baselineBill.kwh} kWh)
              </span>
              <span className="font-mono text-zinc-200">{formatRm(result.baselineBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Fuel size={14} strokeWidth={1.75} className="text-amber-400" />
                爸爸每月汽油费 (RON95)
              </span>
              <span className="font-mono text-amber-400">{formatRm(result.petrolMonthlyCost)}</span>
            </div>

            <div className="rounded-lg bg-zinc-950/60 p-2 text-[11px] text-zinc-400">
              对应月行驶里程：约 <strong className="text-zinc-200 font-mono">{result.petrolEquivalentDistanceKm.toLocaleString()} km</strong>（按每升 14km 测算）
            </div>
          </div>
        </div>

        {/* New Scenario Box */}
        <div className="relative space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 ring-1 ring-emerald-500/10">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Zap size={16} strokeWidth={1.75} className="text-emerald-400" />
              <span>【新方案】新 TNB 电费 + 快充</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-300">
              {formatRm(result.newTotalMonthlyEnergyExpense)} /月
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Home size={14} strokeWidth={1.75} className="text-emerald-400" />
                新 TNB 总电费 ({result.newCombinedBill.kwh} kWh)
              </span>
              <span className="font-mono font-semibold text-zinc-100">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-400 pl-4 text-[11px]">
              <span>└ 其中：电车家充增加电费</span>
              <span className="font-mono text-emerald-400">+{formatRm(result.marginalHomeElectricityCost)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Zap size={14} strokeWidth={1.75} className="text-blue-400" />
                外出商业快充预估 (10%)
              </span>
              <span className="font-mono text-zinc-300">{formatRm(result.publicChargingCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

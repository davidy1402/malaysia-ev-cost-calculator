import React, { useEffect } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { Fuel, Zap, Home, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      {/* Big Direct Verdict Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-zinc-950 p-6 text-white shadow-2xl sm:p-8 border border-emerald-500/20">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              算账结论
            </span>
            <span className="text-xs text-zinc-300 font-medium">
              换开 {inputs.modelName.trim() || '这辆电车'}（{inputs.chargingMode === 'home_only' ? '100% 纯家充' : '90% 家充 + 10% 外充'}）
            </span>
          </div>

          <div className="mt-3">
            <div className="text-xs text-zinc-300">
              全家每月能源总开销（电费 + 汽车用油/充电）：
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-3xl font-bold font-mono tracking-tight sm:text-5xl ${isPositiveSavings ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isPositiveSavings ? '每月省 ' : '每月多花 '} {formatRm(Math.abs(result.monthlyNetSavings))}
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs text-zinc-300 sm:text-sm">
            一年累计 {isPositiveSavings ? '省' : '多'}{' '}
            <strong className="text-white font-mono">{formatRm(Math.abs(result.yearlyNetSavings))}</strong> · 5年累计{' '}
            <strong className="text-white font-mono">{formatRm(Math.abs(result.fiveYearNetSavings))}</strong>
          </p>

          {/* Simple plain explanation box */}
          <div className="mt-4 rounded-xl bg-zinc-950/70 p-3.5 border border-zinc-800 text-xs text-zinc-200 leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <CheckCircle2 size={15} />
              <span>算账逻辑与明细：</span>
            </div>

            <p>
              • 爸爸每月彻底<strong className="text-emerald-300">省下 {formatRm(inputs.fatherPetrolCostRm)} 的油钱</strong>。
            </p>
            <p>
              • 电车在家充电增加电费 <strong className="text-white">{formatRm(result.marginalHomeElectricityCost)}</strong>（家里电费从原本 {formatRm(result.baselineBill.totalAmount)} 变为 {formatRm(result.newCombinedBill.totalAmount)}）
              {inputs.chargingMode === 'mixed' && (
                <>，外加偶尔外出快充 <strong className="text-white">{formatRm(result.publicChargingCost)}</strong></>
              )}。
            </p>
            <p className="border-t border-zinc-800/80 pt-1.5 font-semibold text-zinc-100">
              ➔ 最终净省：{formatRm(inputs.fatherPetrolCostRm)} 油钱 − {formatRm(result.marginalHomeElectricityCost)} 家充电费 {inputs.chargingMode === 'mixed' ? `− ${formatRm(result.publicChargingCost)} 外充电费` : ''} = <span className="text-emerald-400">{formatRm(result.monthlyNetSavings)} / 月</span>
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
              【现在】每月总支出
            </span>
            <span className="font-mono text-base font-bold text-zinc-100">
              {formatRm(result.oldTotalMonthlyEnergyExpense)}
            </span>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans">
                <Home size={14} className="text-blue-400" />
                <span>家里电费 ({result.baselineBill.kwh} 度)</span>
              </div>
              <span className="font-semibold text-zinc-100">{formatRm(result.baselineBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans">
                <Fuel size={14} className="text-amber-400" />
                <span>爸爸每月油钱</span>
              </div>
              <span className="font-semibold text-amber-400">{formatRm(inputs.fatherPetrolCostRm)}</span>
            </div>
          </div>
        </div>

        {/* Right: EV State */}
        <div className="rounded-2xl border border-emerald-500/30 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              【买电车后】每月总支出
            </span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {formatRm(result.newTotalMonthlyEnergyExpense)}
            </span>
          </div>

          <div className="space-y-2 text-xs text-zinc-300 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans">
                <Zap size={14} className="text-emerald-400" />
                <span>家里新电费 ({result.newCombinedBill.kwh} 度)</span>
              </div>
              <span className="font-semibold text-emerald-400">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-sans text-zinc-400">
                <span>{inputs.chargingMode === 'home_only' ? '外出快充 (0%)' : '外出偶尔快充 (10%)'}</span>
              </div>
              <span className="text-zinc-400">{formatRm(result.publicChargingCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { formatRm } from '../utils/formatter';

interface TnbBreakdownCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const TnbBreakdownCard: React.FC<TnbBreakdownCardProps> = ({
  inputs,
  result
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalKwh = result.newCombinedBill.kwh;

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Zap size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
              家里新电费明细
            </h3>
            <p className="text-[11px] text-zinc-400">
              按照 TNB 官方最新电费标准自动计算
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <span>{isExpanded ? '收起明细' : '查看账单项目'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Simplified Usage Summary Box */}
      <div className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-zinc-200 font-medium">
            每月总用电量：<strong className="font-mono text-base font-bold text-emerald-400">{totalKwh}</strong> 度 (kWh)
          </span>
          <span className="text-xs text-zinc-400">
            家里原本日常用电 {result.baselineBill.kwh} 度 + 车充 {result.evHomeChargingKwh} 度
          </span>
        </div>

        {/* Intuitive visual bar: Baseline vs Car */}
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
              <span>家里原本日常用电 ({Math.round((result.baselineBill.kwh / totalKwh) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span>电车在家充电 ({Math.round((result.evHomeChargingKwh / totalKwh) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Human-friendly note */}
        <div className="rounded-lg bg-zinc-900/90 p-3 text-xs text-zinc-300 leading-relaxed border border-zinc-800/60">
          💡 <strong className="text-zinc-100">简单来说：</strong>
          家里现在的电费是 <strong className="text-zinc-100">{formatRm(result.baselineBill.totalAmount)}</strong>，买了电车后，每月因为充电会多出大约 <strong className="text-emerald-400">{formatRm(result.marginalHomeElectricityCost)}</strong> 电费，所以家里每月的总电费账单会变成 <strong className="text-emerald-400">{formatRm(result.newCombinedBill.totalAmount)}</strong>。
        </div>
      </div>

      {/* Expanded itemized list for curious users */}
      {isExpanded && (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 text-xs">
          <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 text-zinc-200 font-medium flex items-center justify-between">
            <span>TNB 官方账单项目明细</span>
            <span className="font-mono text-emerald-400 font-bold">总计 {formatRm(result.newCombinedBill.totalAmount)}</span>
          </div>

          <div className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">1. 基本用电费 (每度约 44.43 sen)</span>
              <span className="font-semibold text-zinc-100">{formatRm(result.newCombinedBill.baseEnergySubtotal)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">2. TNB 固定月费 (Retail Charge)</span>
              <span className="text-zinc-200">{result.newCombinedBill.retailCharge > 0 ? formatRm(result.newCombinedBill.retailCharge) : '免费 (免征收)'}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">3. 燃油价格浮动调整 (AFA)</span>
              <span className="text-zinc-200">{result.newCombinedBill.afaSurcharge > 0 ? formatRm(result.newCombinedBill.afaSurcharge) : '免费 (免征收)'}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5">
              <span className="font-sans text-zinc-300">4. 政府能源基金与税项 (KWTBB & SST)</span>
              <span className="text-zinc-200">{formatRm(result.newCombinedBill.kwtbbFund + result.newCombinedBill.sstTax)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-3 bg-emerald-950/40 text-emerald-300 font-bold">
              <span className="font-sans">家里每月新电费总额</span>
              <span className="text-base">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

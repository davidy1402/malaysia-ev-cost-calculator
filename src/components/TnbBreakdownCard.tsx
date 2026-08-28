import React, { useState } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { ShieldCheck, AlertCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
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
  const marker600Percent = 60; // 600 kWh on 1000 kWh scale

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <FileText size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
              马来西亚 TNB 新阶梯电费算法拆解
            </h3>
            <p className="text-[11px] text-zinc-400">
              采用 2025/2026 现行住宅结构 (General Domestic Tariff)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
        >
          <span>{isExpanded ? '收起明细' : '查看完整账单明细'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* 600 kWh Threshold Visual Gauge */}
      <div className="space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-300">
            每月总用电负荷：<strong className="font-mono text-emerald-400 font-bold">{totalKwh} kWh</strong>
          </span>
          <span className="text-[11px] text-zinc-400">
            原家电 {result.baselineBill.kwh} kWh + 车充 {result.evHomeChargingKwh} kWh
          </span>
        </div>

        {/* Progress bar with 600 marker */}
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-800/80">
          {/* Baseline part */}
          <div
            className="absolute left-0 top-0 h-full bg-blue-500/80 transition-all duration-300"
            style={{ width: `${Math.min(100, (result.baselineBill.kwh / 1000) * 100)}%` }}
            title={`原家电: ${result.baselineBill.kwh} kWh`}
          />
          {/* Added EV part */}
          <div
            className="absolute top-0 h-full bg-emerald-500 transition-all duration-300"
            style={{
              left: `${Math.min(100, (result.baselineBill.kwh / 1000) * 100)}%`,
              width: `${Math.min(100 - (result.baselineBill.kwh / 1000) * 100, (result.evHomeChargingKwh / 1000) * 100)}%`
            }}
            title={`电车家充: ${result.evHomeChargingKwh} kWh`}
          />
          {/* 600 kWh marker line */}
          <div
            className="absolute top-0 h-full w-0.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-10"
            style={{ left: `${marker600Percent}%` }}
          />
        </div>

        <div className="relative flex justify-between text-[10px] text-zinc-400 font-mono pt-0.5">
          <span>0 kWh</span>
          <span className="text-amber-400 font-semibold" style={{ position: 'absolute', left: '55%' }}>
            ▲ 600 kWh 优惠临界线
          </span>
          <span>1,000+ kWh</span>
        </div>

        {/* 600 kWh waiver explanation status */}
        <div className="mt-2 flex items-center justify-between rounded-lg bg-zinc-900/90 px-3 py-2 text-xs">
          <div className="flex items-center gap-1.5">
            {result.newCombinedBill.isOver600Threshold ? (
              <AlertCircle size={15} className="text-amber-400 shrink-0" />
            ) : (
              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
            )}
            <span className={result.newCombinedBill.isOver600Threshold ? 'text-amber-300' : 'text-emerald-300'}>
              {result.newCombinedBill.isOver600Threshold
                ? '总电量超过 600 kWh：已恢复征收 Retail Charge 与 AFA'
                : '总电量 ≤ 600 kWh：享受 RM10 Retail Charge 与 AFA 燃油全免优惠！'}
            </span>
          </div>

          <span className="font-mono text-zinc-300 text-[11px]">
            综合均价 ~{result.newCombinedBill.effectiveRatePerKwh.toFixed(3)} RM/kWh
          </span>
        </div>
      </div>

      {/* Expanded Table Breakdown */}
      {isExpanded && (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 text-xs">
          <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 text-zinc-300 font-medium flex items-center justify-between">
            <span>TNB 账单项目逐项清单 (新总额 {formatRm(result.newCombinedBill.totalAmount)})</span>
            <span className="text-[11px] text-zinc-400">总计 {totalKwh} 度电</span>
          </div>

          <div className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
            {/* 1. Base Energy */}
            <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-900/40">
              <div>
                <div className="font-sans font-medium text-zinc-200">
                  1. 发电费 (Generation @ 27.03 sen)
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  {totalKwh} kWh × RM 0.2703
                </div>
              </div>
              <span className="font-semibold text-zinc-100">{formatRm(result.newCombinedBill.baseGeneration)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-900/40">
              <div>
                <div className="font-sans font-medium text-zinc-200">
                  2. 容量费 (Capacity @ 4.55 sen)
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  {totalKwh} kWh × RM 0.0455
                </div>
              </div>
              <span className="text-zinc-200">{formatRm(result.newCombinedBill.baseCapacity)}</span>
            </div>

            <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-900/40">
              <div>
                <div className="font-sans font-medium text-zinc-200">
                  3. 电网费 (Network @ 12.85 sen)
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  {totalKwh} kWh × RM 0.1285
                </div>
              </div>
              <span className="text-zinc-200">{formatRm(result.newCombinedBill.baseNetwork)}</span>
            </div>

            {/* 4. Retail Charge */}
            <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-900/40">
              <div>
                <div className="font-sans font-medium text-zinc-200">
                  4. Retail Charge (固定零售服务费)
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  {result.newCombinedBill.isRetailChargeWaived ? '≤600 kWh 豁免免收' : '超过 600 kWh 正常征收'}
                </div>
              </div>
              <span className={result.newCombinedBill.isRetailChargeWaived ? 'text-emerald-400' : 'text-zinc-200'}>
                {result.newCombinedBill.isRetailChargeWaived ? 'RM 0.00 (已豁免)' : formatRm(result.newCombinedBill.retailCharge)}
              </span>
            </div>

            {/* 5. AFA */}
            <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-900/40">
              <div>
                <div className="font-sans font-medium text-zinc-200">
                  5. AFA 燃油自动调整费 (+{inputs.afaRateSen} sen/kWh)
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  {result.newCombinedBill.isAfaWaived ? '≤600 kWh 豁免免收' : `${totalKwh} kWh × +${inputs.afaRateSen} sen`}
                </div>
              </div>
              <span className={result.newCombinedBill.isAfaWaived ? 'text-emerald-400' : 'text-zinc-200'}>
                {result.newCombinedBill.isAfaWaived ? 'RM 0.00 (已豁免)' : formatRm(result.newCombinedBill.afaSurcharge)}
              </span>
            </div>

            {/* 6. KWTBB Fund */}
            <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-900/40">
              <div>
                <div className="font-sans font-medium text-zinc-200">
                  6. KWTBB 可再生能源基金 (1.6%)
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  超过 300 kWh 部分征收
                </div>
              </div>
              <span className="text-zinc-200">{formatRm(result.newCombinedBill.kwtbbFund)}</span>
            </div>

            {/* 7. SST */}
            <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-zinc-900/40">
              <div>
                <div className="font-sans font-medium text-zinc-200">
                  7. 8% SST 服务税
                </div>
                <div className="text-[10px] text-zinc-400 font-sans">
                  超过 600 kWh 部分征收
                </div>
              </div>
              <span className="text-zinc-200">{formatRm(result.newCombinedBill.sstTax)}</span>
            </div>

            {/* Total Row */}
            <div className="flex items-center justify-between px-3.5 py-3 bg-emerald-950/30 text-emerald-300 font-bold">
              <span className="font-sans text-sm">TNB 新电费月总计</span>
              <span className="text-base">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

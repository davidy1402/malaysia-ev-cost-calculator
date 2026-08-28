import React, { useState } from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { ShieldCheck, CircleAlert, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="card space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold tracking-tight text-ink">
            新电费是怎么算出来的
          </h4>
          <p className="mt-0.5 text-[11px] text-muted">
            TNB 住宅费率 · 2025/2026 结构，含所有附加项
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-line-strong"
        >
          <span>{isExpanded ? '收起明细' : '逐项明细'}</span>
          {isExpanded ? (
            <ChevronUp size={14} strokeWidth={1.75} />
          ) : (
            <ChevronDown size={14} strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* 600 kWh Threshold Visual Gauge */}
      <div className="space-y-2.5 rounded-2xl border border-line bg-inset/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="text-ink">
            每月总用电
            <strong className="font-display ml-1.5 text-sm font-semibold text-brand">{totalKwh}</strong>
            <span className="text-muted"> 度</span>
          </span>
          <span className="text-[11px] text-muted">
            家用 {result.baselineBill.kwh} + 车充 {result.evHomeChargingKwh}
          </span>
        </div>

        {/* Progress bar with 600 marker */}
        <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-line">
          {/* Baseline part */}
          <div
            className="absolute left-0 top-0 h-full bg-grid/80 transition-all duration-300"
            style={{ width: `${Math.min(100, (result.baselineBill.kwh / 1000) * 100)}%` }}
            title={`原家用电: ${result.baselineBill.kwh} kWh`}
          />
          {/* Added EV part */}
          <div
            className="absolute top-0 h-full bg-brand transition-all duration-300"
            style={{
              left: `${Math.min(100, (result.baselineBill.kwh / 1000) * 100)}%`,
              width: `${Math.min(100 - (result.baselineBill.kwh / 1000) * 100, (result.evHomeChargingKwh / 1000) * 100)}%`
            }}
            title={`电车家充: ${result.evHomeChargingKwh} kWh`}
          />
          {/* 600 kWh marker line */}
          <div
            className="absolute top-0 z-10 h-full w-0.5 bg-oil shadow-[0_0_6px_rgba(180,83,9,0.6)]"
            style={{ left: `${marker600Percent}%` }}
          />
        </div>

        <div className="relative flex justify-between text-[10px] text-faint">
          <span>0 度</span>
          <span className="absolute font-semibold text-oil" style={{ left: '55%' }}>
            ▲ 600 度优惠线
          </span>
          <span>1,000+ 度</span>
        </div>

        {/* 600 kWh waiver explanation status */}
        <div className="flex items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2.5 text-xs shadow-card">
          <div className="flex items-center gap-1.5">
            {result.newCombinedBill.isOver600Threshold ? (
              <CircleAlert size={15} strokeWidth={1.75} className="shrink-0 text-warn" />
            ) : (
              <ShieldCheck size={15} strokeWidth={1.75} className="shrink-0 text-brand" />
            )}
            <span className={result.newCombinedBill.isOver600Threshold ? 'text-warn' : 'text-brand'}>
              {result.newCombinedBill.isOver600Threshold
                ? '已超过 600 度：零售费与 AFA 恢复征收'
                : '仍在 600 度内：RM10 零售费与 AFA 全免'}
            </span>
          </div>

          <span className="shrink-0 text-[11px] text-muted">
            综合均价 ~{result.newCombinedBill.effectiveRatePerKwh.toFixed(3)} RM/kWh
          </span>
        </div>
      </div>

      {/* Expanded Table Breakdown */}
      {isExpanded && (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface text-xs">
          <div className="flex items-center justify-between border-b border-line bg-inset px-4 py-2.5 text-ink">
            <span className="font-medium">TNB 账单逐项清单</span>
            <span className="text-[11px] text-muted">共 {totalKwh.toLocaleString()} 度</span>
          </div>

          <div className="divide-y divide-line/60 text-ink">
            {/* 1. Base Energy */}
            <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-inset/50">
              <div>
                <div className="font-medium">1. 发电费 · Generation</div>
                <div className="text-[10px] text-muted">
                  {totalKwh.toLocaleString()} kWh × RM 0.2703
                </div>
              </div>
              <span className="font-semibold">{formatRm(result.newCombinedBill.baseGeneration)}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-inset/50">
              <div>
                <div className="font-medium">2. 容量费 · Capacity</div>
                <div className="text-[10px] text-muted">
                  {totalKwh.toLocaleString()} kWh × RM 0.0455
                </div>
              </div>
              <span>{formatRm(result.newCombinedBill.baseCapacity)}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-inset/50">
              <div>
                <div className="font-medium">3. 电网费 · Network</div>
                <div className="text-[10px] text-muted">
                  {totalKwh.toLocaleString()} kWh × RM 0.1285
                </div>
              </div>
              <span>{formatRm(result.newCombinedBill.baseNetwork)}</span>
            </div>

            {/* 4. Retail Charge */}
            <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-inset/50">
              <div>
                <div className="font-medium">4. 零售服务费 · Retail Charge</div>
                <div className="text-[10px] text-muted">
                  {result.newCombinedBill.isRetailChargeWaived ? '600 度以内，免收' : '超过 600 度，正常征收'}
                </div>
              </div>
              <span className={result.newCombinedBill.isRetailChargeWaived ? 'font-medium text-brand' : ''}>
                {result.newCombinedBill.isRetailChargeWaived ? 'RM 0.00（已免）' : formatRm(result.newCombinedBill.retailCharge)}
              </span>
            </div>

            {/* 5. AFA */}
            <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-inset/50">
              <div>
                <div className="font-medium">5. 燃油调整费 · AFA（+{inputs.afaRateSen} sen/kWh）</div>
                <div className="text-[10px] text-muted">
                  {result.newCombinedBill.isAfaWaived ? '600 度以内，免收' : `${totalKwh.toLocaleString()} kWh × +${inputs.afaRateSen} sen`}
                </div>
              </div>
              <span className={result.newCombinedBill.isAfaWaived ? 'font-medium text-brand' : ''}>
                {result.newCombinedBill.isAfaWaived ? 'RM 0.00（已免）' : formatRm(result.newCombinedBill.afaSurcharge)}
              </span>
            </div>

            {/* 6. KWTBB Fund */}
            <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-inset/50">
              <div>
                <div className="font-medium">6. 可再生能源基金 · KWTBB（1.6%）</div>
                <div className="text-[10px] text-muted">超过 300 度的部分征收</div>
              </div>
              <span>{formatRm(result.newCombinedBill.kwtbbFund)}</span>
            </div>

            {/* 7. SST */}
            <div className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-inset/50">
              <div>
                <div className="font-medium">7. 服务税 · SST（8%）</div>
                <div className="text-[10px] text-muted">超过 600 度的部分征收</div>
              </div>
              <span>{formatRm(result.newCombinedBill.sstTax)}</span>
            </div>

            {/* Total Row */}
            <div className="flex items-center justify-between bg-brand-soft px-4 py-3 font-semibold text-brand">
              <span className="text-sm">新电费每月总计</span>
              <span className="font-display text-base">{formatRm(result.newCombinedBill.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

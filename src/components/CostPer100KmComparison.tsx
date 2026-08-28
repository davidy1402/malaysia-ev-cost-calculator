import React from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { Gauge, Fuel, Zap, BatteryCharging, MapPin } from 'lucide-react';
import { formatRm } from '../utils/formatter';

interface CostPer100KmComparisonProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const CostPer100KmComparison: React.FC<CostPer100KmComparisonProps> = ({
  inputs,
  result
}) => {
  const fullBatteryKwh = inputs.batteryCapacityKwh || 60;
  const fullChargeCostHome = (fullBatteryKwh * 0.90 / inputs.chargingEfficiency) * (result.newCombinedBill.effectiveRatePerKwh);

  const trips = [
    {
      name: '日常通勤 (50 km)',
      distance: 50,
      petrolCost: (50 / 100) * result.petrolCostPer100Km,
      evCost: (50 / 100) * result.evCostPer100Km,
    },
    {
      name: 'JB ➔ KL 单程 (330 km)',
      distance: 330,
      petrolCost: (330 / 100) * result.petrolCostPer100Km,
      evCost: (330 / 100) * result.evCostPer100Km,
    },
    {
      name: 'KL ➔ 怡保/槟城 (350 km)',
      distance: 350,
      petrolCost: (350 / 100) * result.petrolCostPer100Km,
      evCost: (350 / 100) * result.evCostPer100Km,
    }
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Gauge size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
              每 100 公里能耗成本直观对比
            </h3>
            <p className="text-[11px] text-zinc-400">
              汽油车 (RON95) vs {inputs.modelName} (家用慢充+快充混合)
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          每公里仅 {formatRm(result.evCostPer100Km / 100, { decimals: 3 })}
        </div>
      </div>

      {/* Main 100km Bar Visualizer */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Petrol Bar */}
        <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
              <Fuel size={16} strokeWidth={1.75} className="text-amber-400" />
              <span>汽油车 (每 100 km)</span>
            </div>
            <span className="font-mono text-base font-bold text-amber-400">
              {formatRm(result.petrolCostPer100Km)}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-full rounded-full bg-amber-500" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>消耗油量：~{(100 / inputs.petrolFuelEfficiencyKmPerL).toFixed(1)} L</span>
            <span>按 RM {inputs.petrolPricePerLiter.toFixed(2)}/L 计</span>
          </div>
        </div>

        {/* EV Bar */}
        <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-3.5 ring-1 ring-emerald-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
              <Zap size={16} strokeWidth={1.75} className="text-emerald-400" />
              <span>{inputs.modelName} (每 100 km)</span>
            </div>
            <span className="font-mono text-base font-bold text-emerald-400">
              {formatRm(result.evCostPer100Km)}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, (result.evCostPer100Km / result.petrolCostPer100Km) * 100))}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>电耗：{inputs.consumptionKwhPer100Km} kWh</span>
            <span className="font-medium text-emerald-400">便宜 {result.savingsRatioPerKm}%</span>
          </div>
        </div>
      </div>

      {/* Battery & Real Trip Scenario Table */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span className="flex items-center gap-1">
            <MapPin size={14} strokeWidth={1.75} />
            常见出行场景费用对比
          </span>
          <span className="flex items-center gap-1 text-[11px] font-normal text-zinc-400">
            <BatteryCharging size={14} strokeWidth={1.75} className="text-emerald-400" />
            满电 ({fullBatteryKwh}kWh) 家充约 {formatRm(fullChargeCostHome)}
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-3.5 py-2.5 font-medium">出行场景</th>
                <th className="px-3.5 py-2.5 font-medium text-right">汽油车油费</th>
                <th className="px-3.5 py-2.5 font-medium text-right">电车电费</th>
                <th className="px-3.5 py-2.5 font-medium text-right text-emerald-400">单趟节省</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/40 font-mono">
              {trips.map((trip) => {
                const tripSavings = trip.petrolCost - trip.evCost;
                return (
                  <tr key={trip.name} className="transition-colors hover:bg-zinc-800/40">
                    <td className="px-3.5 py-2 font-sans font-medium text-zinc-200">
                      {trip.name}
                    </td>
                    <td className="px-3.5 py-2 text-right text-zinc-400">
                      {formatRm(trip.petrolCost)}
                    </td>
                    <td className="px-3.5 py-2 text-right text-zinc-200">
                      {formatRm(trip.evCost)}
                    </td>
                    <td className="px-3.5 py-2 text-right font-semibold text-emerald-400">
                      {formatRm(tripSavings, { showPlus: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

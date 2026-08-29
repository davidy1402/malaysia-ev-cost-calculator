import React from 'react';
import { EvCalculationResult, UserInputs } from '../types/calculator';
import { Fuel, Zap, BatteryCharging, MapPin } from 'lucide-react';
import { formatRm } from '../utils/formatter';

interface CostPer100KmComparisonProps {
  inputs: UserInputs;
  result: EvCalculationResult;
}

export const CostPer100KmComparison: React.FC<CostPer100KmComparisonProps> = ({
  inputs,
  result
}) => {
  const fullBatteryKwh = inputs.batteryCapacityKwh || 60.22;
  const fullChargeCostHome = result.singleFullChargeMarginalCost;
  const fullChargeCostPublic = Math.round(fullBatteryKwh * (inputs.publicDcPricePerKwh || 1.40) * 100) / 100;

  const trips = [
    {
      name: '日常通勤 (50 km)',
      distance: 50,
      petrolCost: (50 / 100) * result.petrolCostPer100Km,
      evCost: (50 / 100) * result.evCostPer100Km
    },
    {
      name: 'JB ➔ KL 单程 (330 km)',
      distance: 330,
      petrolCost: (330 / 100) * result.petrolCostPer100Km,
      evCost: (330 / 100) * result.evCostPer100Km
    },
    {
      name: 'KL ➔ 怡保/槟城 (350 km)',
      distance: 350,
      petrolCost: (350 / 100) * result.petrolCostPer100Km,
      evCost: (350 / 100) * result.evCostPer100Km
    }
  ];

  return (
    <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <h3 className="text-sm font-semibold text-zinc-100 sm:text-base flex items-center gap-2">
          <Zap size={16} className="text-emerald-400" />
          <span>每开 100 公里要花多少钱？</span>
        </h3>
        <span className="text-[11px] text-zinc-400">
          基于当前电价模型与爸爸 RM 1.99/L 油价
        </span>
      </div>

      {/* Main 100km Bar Visualizer */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Petrol Bar */}
        <div className="space-y-2.5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
              <Fuel size={15} strokeWidth={1.75} className="text-amber-400" />
              <span>汽油车 · 每 100 km</span>
            </div>
            <span className="font-display text-lg font-bold font-mono text-amber-400">
              {formatRm(result.petrolCostPer100Km)}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-full rounded-full bg-amber-500/80" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>约 {(100 / inputs.petrolFuelEfficiencyKmPerL).toFixed(1)} 升油 (14 km/L)</span>
            <span>按 RM {inputs.petrolPricePerLiter.toFixed(2)}/L</span>
          </div>
        </div>

        {/* EV Bar */}
        <div className="space-y-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-100">
              <Zap size={15} strokeWidth={1.75} className="text-emerald-400" />
              <span>{inputs.modelName.trim() || '这台 EV'} · 每 100 km</span>
            </div>
            <span className="font-display text-lg font-bold font-mono text-emerald-400">
              {formatRm(result.evCostPer100Km)}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, (result.evCostPer100Km / result.petrolCostPer100Km) * 100))}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>官方 {inputs.consumptionKwhPer100Km} (实测 ≈ {(inputs.consumptionKwhPer100Km * 1.10).toFixed(1)} 度)</span>
            <span className="font-semibold text-emerald-300">便宜 {result.savingsRatioPerKm}%</span>
          </div>
        </div>
      </div>

      {/* Battery & Real Trip Scenario Table */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
            <MapPin size={14} strokeWidth={1.75} className="text-emerald-400" />
            <span>常见出行场景，单趟费用对比</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
            <BatteryCharging size={14} className="text-emerald-400" />
            <span>充满一次（{fullBatteryKwh} kWh）：家充约 <strong className="text-emerald-300">{formatRm(fullChargeCostHome)}</strong>* · 外充约 <strong className="text-zinc-300">{formatRm(fullChargeCostPublic)}</strong></span>
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-[11px] text-zinc-400 font-medium">
              <tr>
                <th className="px-3.5 py-2.5">出行场景</th>
                <th className="px-3 py-2.5 text-right">汽油车</th>
                <th className="px-3 py-2.5 text-right">电车 (综合)</th>
                <th className="px-3.5 py-2.5 text-right text-emerald-400">省下</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {trips.map((trip) => {
                const tripSavings = Math.round((trip.petrolCost - trip.evCost) * 100) / 100;
                return (
                  <tr key={trip.name} className="transition-colors hover:bg-zinc-900/40">
                    <td className="px-3.5 py-2.5 font-sans font-medium text-zinc-200">{trip.name}</td>
                    <td className="px-3 py-2.5 text-right text-zinc-400">{formatRm(trip.petrolCost)}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-zinc-100">{formatRm(trip.evCost)}</td>
                    <td className="px-3.5 py-2.5 text-right font-semibold text-emerald-400">
                      +{formatRm(tripSavings)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="flex justify-between text-[11px] text-zinc-500">
          <span>*家充单次充满费用按家庭真实「边际电费」模拟估算</span>
          <span>每公里电费约 {formatRm(result.evCostPer100Km / 100, { decimals: 3 })}</span>
        </p>
      </div>
    </div>
  );
};

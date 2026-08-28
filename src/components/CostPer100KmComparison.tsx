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
  const fullBatteryKwh = inputs.batteryCapacityKwh || 60;
  const fullChargeCostHome = result.singleFullChargeMarginalCost;

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
    <div className="card space-y-5 p-4 sm:p-6">
      {/* Main 100km Bar Visualizer */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Petrol Bar */}
        <div className="space-y-2.5 rounded-2xl border border-line bg-inset/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Fuel size={15} strokeWidth={1.75} className="text-oil" />
              <span>汽油车 · 每 100 km</span>
            </div>
            <span className="font-display text-lg font-semibold text-oil">
              {formatRm(result.petrolCostPer100Km)}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full w-full rounded-full bg-oil/80" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>约 {(100 / inputs.petrolFuelEfficiencyKmPerL).toFixed(1)} 公升油</span>
            <span>按 RM {inputs.petrolPricePerLiter.toFixed(2)}/L</span>
          </div>
        </div>

        {/* EV Bar */}
        <div className="space-y-2.5 rounded-2xl border border-brand/30 bg-brand-soft/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Zap size={15} strokeWidth={1.75} className="text-brand" />
              <span>{inputs.modelName.trim() || '这台 EV'} · 每 100 km</span>
            </div>
            <span className="font-display text-lg font-semibold text-brand">
              {formatRm(result.evCostPer100Km)}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, (result.evCostPer100Km / result.petrolCostPer100Km) * 100))}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>{inputs.consumptionKwhPer100Km} kWh 电耗</span>
            <span className="font-semibold text-brand">便宜 {result.savingsRatioPerKm}%</span>
          </div>
        </div>
      </div>

      {/* Battery & Real Trip Scenario Table */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <MapPin size={14} strokeWidth={1.75} className="text-brand" />
            常见出行，一趟花多少
          </span>
          <span className="flex items-center gap-1 text-[11px] font-normal text-muted">
            <BatteryCharging size={14} strokeWidth={1.75} className="text-brand" />
            满电（{fullBatteryKwh} kWh）家充约 {formatRm(fullChargeCostHome)}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-inset text-[11px] text-muted">
              <tr>
                <th className="px-3.5 py-2.5 font-medium">出行场景</th>
                <th className="px-3 py-2.5 text-right font-medium">汽油</th>
                <th className="px-3 py-2.5 text-right font-medium">电车</th>
                <th className="px-3.5 py-2.5 text-right font-medium text-brand">省</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {trips.map((trip) => {
                const tripSavings = trip.petrolCost - trip.evCost;
                return (
                  <tr key={trip.name} className="transition-colors hover:bg-inset/60">
                    <td className="px-3.5 py-2.5 font-medium text-ink">{trip.name}</td>
                    <td className="px-3 py-2.5 text-right text-muted">{formatRm(trip.petrolCost)}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-ink">{formatRm(trip.evCost)}</td>
                    <td className="px-3.5 py-2.5 text-right font-semibold text-brand">
                      {formatRm(tripSavings, { showPlus: true })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="flex justify-end text-[11px] text-faint">
          每公里电费约 {formatRm(result.evCostPer100Km / 100, { decimals: 3 })}
        </p>
      </div>
    </div>
  );
};

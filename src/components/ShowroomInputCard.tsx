import React from 'react';
import { UserInputs, EvCalculationResult } from '../types/calculator';
import { Zap, Fuel, Home, Gauge } from 'lucide-react';

interface ShowroomInputCardProps {
  inputs: UserInputs;
  result: EvCalculationResult;
  onChange: (patch: Partial<UserInputs>) => void;
}

export const ShowroomInputCard: React.FC<ShowroomInputCardProps> = ({
  inputs,
  result,
  onChange
}) => {
  return (
    <div className="space-y-5 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-xl backdrop-blur-sm sm:p-6">
      {/* Showroom Main Target: Energy Consumption */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-zinc-950/60 p-4 ring-1 ring-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap size={18} strokeWidth={1.75} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                试驾问销售的核心问题
              </span>
              <h2 className="text-sm font-medium text-zinc-100 sm:text-base">
                车身标称电耗 (kWh / 100km)
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="rounded-full bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300">
              {inputs.modelName}
            </span>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.1"
              min="8"
              max="35"
              value={inputs.consumptionKwhPer100Km || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange({ consumptionKwhPer100Km: isNaN(val) ? 0 : val });
              }}
              placeholder="例如 14.5"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950/90 px-4 py-3 text-2xl font-bold font-mono text-emerald-400 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:text-3xl"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400">
              kWh / 100 km
            </span>
          </div>

          {/* Quick step adjusters for fast thumb interaction */}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ consumptionKwhPer100Km: Math.round((inputs.consumptionKwhPer100Km + 0.5) * 10) / 10 })}
              className="flex h-7 w-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 active:scale-95"
            >
              +0.5
            </button>
            <button
              type="button"
              onClick={() => onChange({ consumptionKwhPer100Km: Math.max(5, Math.round((inputs.consumptionKwhPer100Km - 0.5) * 10) / 10) })}
              className="flex h-7 w-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 active:scale-95"
            >
              -0.5
            </button>
          </div>
        </div>

        <p className="mt-2 text-[11px] text-zinc-400">
          💡 问员工话术：<span className="text-zinc-200 italic font-mono">“What is the official energy consumption in kWh per 100 kilometres?”</span>
        </p>
      </div>

      {/* Grid of Inputs: Mileage, Home Bill, Father's Petrol */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* 1. Monthly Mileage */}
        <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <Gauge size={16} strokeWidth={1.75} className="text-emerald-400" />
              <span>每月预估里程</span>
            </label>
            <span className="text-xs font-mono font-medium text-emerald-400">
              {inputs.monthlyMileageKm.toLocaleString()} km
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              step="50"
              min="100"
              max="10000"
              value={inputs.monthlyMileageKm || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onChange({ monthlyMileageKm: isNaN(val) ? 0 : val });
              }}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-semibold font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
              km / 月
            </span>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1 pt-1">
            <button
              type="button"
              onClick={() => onChange({ monthlyMileageKm: result.petrolEquivalentDistanceKm })}
              title="根据每月RM210油费推算的月行驶里程"
              className="rounded px-2 py-0.5 text-[10px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
            >
              对齐爸爸油费 ({result.petrolEquivalentDistanceKm}km)
            </button>
            {[1000, 1500, 2000].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onChange({ monthlyMileageKm: km })}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                  inputs.monthlyMileageKm === km
                    ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {km}km
              </button>
            ))}
          </div>
        </div>

        {/* 2. Current Baseline Home Electricity Bill */}
        <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <Home size={16} strokeWidth={1.75} className="text-blue-400" />
              <span>家里平均电费</span>
            </label>
            <span className="text-xs font-mono font-medium text-blue-400">
              ~{result.baselineBill.kwh} kWh
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
              RM
            </span>
            <input
              type="number"
              step="10"
              min="0"
              max="5000"
              value={inputs.baselineHomeBillRm || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange({ baselineHomeBillRm: isNaN(val) ? 0 : val });
              }}
              placeholder="200"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-3 py-2 text-sm font-semibold font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Quick Home Bill Presets */}
          <div className="flex flex-wrap gap-1 pt-1">
            {[
              { label: 'RM 200 (常态~448度)', rm: 200 },
              { label: 'RM 250 (峰值~525度)', rm: 250 },
              { label: 'RM 180 (省电~400度)', rm: 180 }
            ].map((b) => (
              <button
                key={b.rm}
                type="button"
                onClick={() => onChange({ baselineHomeBillRm: b.rm })}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                  inputs.baselineHomeBillRm === b.rm
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Father's Current Petrol Cost */}
        <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <Fuel size={16} strokeWidth={1.75} className="text-amber-400" />
              <span>爸爸每月油费</span>
            </label>
            <span className="text-xs font-mono font-medium text-amber-400">
              @ RM {inputs.petrolPricePerLiter.toFixed(2)}/L
            </span>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
              RM
            </span>
            <input
              type="number"
              step="10"
              min="0"
              max="2000"
              value={inputs.fatherPetrolCostRm || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange({ fatherPetrolCostRm: isNaN(val) ? 0 : val });
              }}
              placeholder="210"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-3 py-2 text-sm font-semibold font-mono text-amber-400 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Quick Oil Price Switch */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChange({ petrolPricePerLiter: 1.99 })}
                className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${
                  inputs.petrolPricePerLiter === 1.99
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                RM 1.99/L (基准)
              </button>
              <button
                type="button"
                onClick={() => onChange({ petrolPricePerLiter: 2.05 })}
                className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${
                  inputs.petrolPricePerLiter === 2.05
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                RM 2.05/L (RON95)
              </button>
            </div>
            <span className="font-mono text-zinc-300">
              ~{(inputs.fatherPetrolCostRm / inputs.petrolPricePerLiter).toFixed(1)} L
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
